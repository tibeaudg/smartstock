import React from "react";

export type SeoRoute = { path: string; element: React.ReactNode };

// Auto-discover all TSX files directly under src/pages/SEO and src/pages/seo
// Some environments or contributors may use different case for the directory.
const upperCaseModules = import.meta.glob("../pages/SEO/*.tsx");
const lowerCaseModules = import.meta.glob("../pages/seo/*.tsx");
const modules = { ...upperCaseModules, ...lowerCaseModules };

// Cache computed routes to avoid recreating React.lazy components on each render,
// which can cause Suspense to keep showing the fallback indefinitely.
let cachedRoutes: SeoRoute[] | null = null;

export function getSeoRoutes(): SeoRoute[] {
  if (cachedRoutes) return cachedRoutes;

  cachedRoutes = Object.entries(modules)
    .map(([path, loader]) => {
      const file = path.split("/").pop()!;
      const slug = file.replace(/\.tsx$/, "");
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
    // Deduplicate in case both globs matched the same file on case-insensitive FS
    .reduce<SeoRoute[]>((acc, route) => {
      if (!acc.some(r => r.path === route.path)) acc.push(route);
      return acc;
    }, [])
    .sort((a, b) => a.path.localeCompare(b.path));

  return cachedRoutes;
}


