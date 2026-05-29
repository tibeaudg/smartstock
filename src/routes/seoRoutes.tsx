import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { extractRoutePathFromContent, getSlugFromPath } from "@/utils/seoSlug";
import NotFound from "@/pages/NotFound";

export type SeoRoute = { path: string; element: React.ReactNode };

/**
 * Auto-discover TSX files under SEO directories.
 * Case-insensitive discovery for cross-platform compatibility.
 */
const upperCaseModules = import.meta.glob("../pages/SEO/**/*.tsx");
const lowerCaseModules = import.meta.glob("../pages/seo/**/*.tsx");
const modules = { ...upperCaseModules, ...lowerCaseModules };

const seoFileContents = import.meta.glob("../pages/SEO/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const excludedFiles = new Set(["glossary/createGlossaryPage", "resources"]);

let cachedRoutes: SeoRoute[] | null = null;
let cachedRoutePaths: Set<string> | null = null;
let cachedLegacyRedirects: Array<{ from: string; to: string }> | null = null;

export function clearRouteCache() {
  cachedRoutes = null;
  cachedRoutePaths = null;
  cachedLegacyRedirects = null;
}

function normalizeRoutePath(slug: string): string {
  const trimmed = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed ? `/${trimmed}` : "/";
}

function buildRouteEntries() {
  const routeByPath = new Map<string, SeoRoute>();
  const legacyRedirects = new Map<string, string>();

  for (const [path, loader] of Object.entries(modules)) {
    const withoutPrefix = path
      .replace(/^(\.\.\/)+/, "")
      .replace(/^pages\/(SEO|seo)\//, "")
      .replace(/\.tsx$/, "");

    if (excludedFiles.has(withoutPrefix)) continue;

    const content = seoFileContents[path] ?? "";
    const slug = extractRoutePathFromContent(content, path);
    if (!slug) continue;

    const routePath = normalizeRoutePath(slug);
    const legacyPath = normalizeRoutePath(getSlugFromPath(path));

    if (legacyPath !== routePath && legacyPath !== "/") {
      legacyRedirects.set(legacyPath, routePath);
    }

    if (routeByPath.has(routePath)) continue;

    const Component = React.lazy(
      loader as () => Promise<{ default: React.ComponentType<any> }>
    );

    const element = (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Loading Page...</p>
            </div>
          </div>
        }
      >
        <Component />
      </React.Suspense>
    );

    routeByPath.set(routePath, { path: routePath, element });
  }

  const routes = Array.from(routeByPath.values()).sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  return {
    routes,
    routePaths: new Set(routes.map((route) => route.path)),
    legacyRedirects: Array.from(legacyRedirects.entries()).map(([from, to]) => ({
      from,
      to,
    })),
  };
}

/**
 * Generates route objects for SEO-optimized pages using each page's canonical URL.
 */
export function getSeoRoutes(): SeoRoute[] {
  if (cachedRoutes) return cachedRoutes;

  const built = buildRouteEntries();
  cachedRoutes = built.routes;
  cachedRoutePaths = built.routePaths;
  cachedLegacyRedirects = built.legacyRedirects;
  return cachedRoutes;
}

export function getSeoRoutePaths(): Set<string> {
  if (!cachedRoutePaths) getSeoRoutes();
  return cachedRoutePaths ?? new Set();
}

export function getSeoLegacyRedirects(): Array<{ from: string; to: string }> {
  if (!cachedLegacyRedirects) getSeoRoutes();
  return cachedLegacyRedirects ?? [];
}

/**
 * Redirect /solutions/* paths to matching flat SEO routes when available.
 */
export function SolutionsPrefixRedirect() {
  const location = useLocation();
  const routePaths = getSeoRoutePaths();
  const suffix = location.pathname.replace(/^\/solutions\/?/, "");

  const candidates = [
    `/${suffix}`,
    ...(suffix.includes("/") ? [`/${suffix.split("/").pop()}`] : []),
  ];

  for (const target of candidates) {
    if (routePaths.has(target)) {
      return <Navigate to={target} replace />;
    }
  }

  return <NotFound />;
}
