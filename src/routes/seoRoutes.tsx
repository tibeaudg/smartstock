import React from "react";

export type SeoRoute = { path: string; element: React.ReactNode };

// Auto-discover all TSX files under src/pages/SEO and src/pages/seo
// Some environments or contributors may use different case for the directory.
const upperCaseModules = import.meta.glob("../pages/SEO/**/*.tsx");
const lowerCaseModules = import.meta.glob("../pages/seo/**/*.tsx");
const modules = { ...upperCaseModules, ...lowerCaseModules };

// Cache computed routes to avoid recreating React.lazy components on each render,
// which can cause Suspense to keep showing the fallback indefinitely.
let cachedRoutes: SeoRoute[] | null = null;

// Function to clear cache (useful for debugging or hot reloading)
export function clearRouteCache() {
  cachedRoutes = null;
}

function getSlugFromPath(path: string): string {
  const withoutPrefix = path
    // Remove leading ../segments
    .replace(/^(\.\.\/)+/, "")
    // Remove pages/SEO or pages/seo prefix
    .replace(/^pages\/(SEO|seo)\//, "");

  const withoutExtension = withoutPrefix.replace(/\.tsx$/, "");
  const segments = withoutExtension.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "";
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "index") {
    segments.pop();
  }

  if (segments.length === 0) {
    return "";
  }

  const legacyTopLevelSlugs = new Set([
    "asset-tracking",
    "inventory-management",
    "what-is-lead-time",
    "warehouse-management",
    "warehouse-management-system",
  ]);

  if (segments[0] === "glossary") {
    if (segments.length === 1) {
      return "glossary";
    }
    if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
      return segments[1];
    }
    return segments.join("/");
  }

  // Preserve full path for solutions directory to match sitemap
  if (segments[0] === "solutions") {
    return segments.join("/");
  }

  return segments[segments.length - 1];
}

export function getSeoRoutes(): SeoRoute[] {
  if (cachedRoutes) return cachedRoutes;

  // Files to exclude from routing (helper functions, not page components)
  const excludedFiles = new Set([
    'glossary/createGlossaryPage',
    'resources', // Exclude to avoid conflict with blog/index.tsx
  ]);

  cachedRoutes = Object.entries(modules)
    .map(([path, loader]) => {
      // Check if this file should be excluded
      const withoutPrefix = path
        .replace(/^(\.\.\/)+/, "")
        .replace(/^pages\/(SEO|seo)\//, "")
        .replace(/\.tsx$/, "");
      
      if (excludedFiles.has(withoutPrefix)) {
        return null;
      }

      const slug = getSlugFromPath(path);
      if (!slug) {
        console.warn(`[seoRoutes] Skipping SEO page without slug for path: ${path}`);
        return null;
      }
      
      // Debug logging for inventory-software-management
      if (slug === 'solutions/inventory-software-management' || path.includes('inventory-software-management')) {
        console.log(`[seoRoutes] Found inventory-software-management: path=${path}, slug=${slug}, route=/${slug}`);
      }
      
      const Component = React.lazy(
        loader as () => Promise<{ default: React.ComponentType<any> }>
      );
      // Add a local Suspense boundary so the whole app doesn't switch to the global fallback
      const element = (
        <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" /><p className="text-gray-600 text-sm">Loading...</p></div></div>}>
          <Component />
        </React.Suspense>
      );
      return { path: `/${slug}`, element };
    })
    .filter((route): route is SeoRoute => route !== null)
    // Deduplicate in case both globs matched the same file on case-insensitive FS
    .reduce<SeoRoute[]>((acc, route) => {
      if (!acc.some(r => r.path === route.path)) acc.push(route);
      return acc;
    }, [])
    .sort((a, b) => a.path.localeCompare(b.path));

  // Debug: Log all solutions routes
  const solutionsRoutes = cachedRoutes.filter(r => r.path.startsWith('/solutions/'));
  console.log(`[seoRoutes] Generated ${cachedRoutes.length} total routes, ${solutionsRoutes.length} solutions routes`);
  if (solutionsRoutes.some(r => r.path === '/solutions/inventory-software-management')) {
    console.log('[seoRoutes] ✅ /solutions/inventory-software-management route is registered');
  } else {
    console.error('[seoRoutes] ❌ /solutions/inventory-software-management route is MISSING!');
    console.log('[seoRoutes] Available solutions routes:', solutionsRoutes.map(r => r.path));
  }

  return cachedRoutes;
}


