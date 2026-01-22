import React from "react";

export type SeoRoute = { path: string; element: React.ReactNode };

/**
 * Auto-discover TSX files under SEO directories.
 * Case-insensitive discovery for cross-platform compatibility.
 */
const upperCaseModules = import.meta.glob("../pages/SEO/**/*.tsx");
const lowerCaseModules = import.meta.glob("../pages/seo/**/*.tsx");
const modules = { ...upperCaseModules, ...lowerCaseModules };

let cachedRoutes: SeoRoute[] | null = null;

export function clearRouteCache() {
  cachedRoutes = null;
}

/**
 * Maps file system paths to URL slugs.
 * Logic specifically handles glossary flattening, solutions path preservation, and Dutch /nl/ paths.
 */
function getSlugFromPath(path: string): string {
  const withoutPrefix = path
    .replace(/^(\.\.\/)+/, "")
    .replace(/^pages\/(SEO|seo)\//, "");

  const withoutExtension = withoutPrefix.replace(/\.tsx$/, "");
  const segments = withoutExtension.split("/").filter(Boolean);

  if (segments.length === 0) return "";

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "index") {
    segments.pop();
  }

  if (segments.length === 0) return "";

  // Handle Dutch /nl/ paths - preserve the /nl/ prefix
  if (segments[0] === "nl") {
    if (segments.length === 1) return "nl";
    // For nested structures like nl/industries/..., preserve full path
    if (segments.length > 1) {
      return segments.join("/");
    }
  }

  const legacyTopLevelSlugs = new Set([
    "asset-tracking",
    "inventory-management",
    "what-is-lead-time",
    "warehouse-management",
    "warehouse-management-system",
  ]);

  // Handle Glossary legacy path mapping
  if (segments[0] === "glossary") {
    if (segments.length === 1) return "glossary";
    if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
      return segments[1];
    }
    return segments.join("/");
  }

  // Preserve hierarchy for solutions (e.g., /solutions/inventory-software-management)
  if (segments[0] === "solutions") {
    return segments.join("/");
  }

  return segments[segments.length - 1];
}

/**
 * Generates route objects for SEO-optimized pages.
 * Incorporates internal Suspense boundaries to prevent layout popping.
 */
export function getSeoRoutes(): SeoRoute[] {
  if (cachedRoutes) return cachedRoutes;

  const excludedFiles = new Set([
    'glossary/createGlossaryPage',
    'resources', 
  ]);

  cachedRoutes = Object.entries(modules)
    .map(([path, loader]) => {
      const withoutPrefix = path
        .replace(/^(\.\.\/)+/, "")
        .replace(/^pages\/(SEO|seo)\//, "")
        .replace(/\.tsx$/, "");
      
      if (excludedFiles.has(withoutPrefix)) return null;

      const slug = getSlugFromPath(path);
      if (!slug) return null;
      
      const Component = React.lazy(
        loader as () => Promise<{ default: React.ComponentType<any> }>
      );

      // We wrap the component in a local Suspense boundary.
      // Important: These components MUST contain their own <SEO title="..." /> 
      // tags internally to override the default site metadata.
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

      return { path: `/${slug}`, element };
    })
    .filter((route): route is SeoRoute => route !== null)
    .reduce<SeoRoute[]>((acc, route) => {
      // Prevent duplicates from case-insensitive file matching
      if (!acc.some(r => r.path === route.path)) acc.push(route);
      return acc;
    }, [])
    .sort((a, b) => a.path.localeCompare(b.path));

  return cachedRoutes;
}