import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { getSeoRoutes } from '@/routes/seoRoutes';
import { getAllSeoPages, type PageMetadata } from '@/config/topicClusters';
import { pathToLabel } from '@/utils/seoCrossLinks';

interface SeoCategoryHubPageProps {
  canonicalPath: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  routeFilter: (path: string) => boolean;
  emptyMessage?: string;
}

export default function SeoCategoryHubPage({
  canonicalPath,
  title,
  seoTitle,
  seoDescription,
  heroTitle,
  heroDescription,
  routeFilter,
  emptyMessage = 'No pages found in this category yet.',
}: SeoCategoryHubPageProps) {
  const pages = useMemo(() => {
    const metadataMap = new Map<string, PageMetadata>();
    getAllSeoPages().forEach((page) => {
      const normalizedPath = page.path.startsWith('/') ? page.path : `/${page.path}`;
      metadataMap.set(normalizedPath, page);
    });

    return getSeoRoutes()
      .filter((route) => routeFilter(route.path))
      .map((route) => {
        const meta = metadataMap.get(route.path);
        return {
          path: route.path,
          title: meta?.title ?? pathToLabel(route.path),
          description: meta?.description,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [routeFilter]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: seoDescription,
    url: `https://www.stockflowsystems.com${canonicalPath}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pages.length,
      itemListElement: pages.slice(0, 50).map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.title,
        url: `https://www.stockflowsystems.com${page.path}`,
      })),
    },
  };

  return (
    <SeoPageLayout
      title={title}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      heroTitle={heroTitle}
      heroDescription={heroDescription}
      structuredData={structuredData}
    >
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {pages.length === 0 ? (
            <p className="text-slate-600">{emptyMessage}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <li key={page.path}>
                  <Link
                    to={page.path}
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                      {page.title}
                    </h2>
                    {page.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{page.description}</p>
                    )}
                    <span className="mt-auto pt-3 text-sm font-medium text-blue-600">
                      Read guide →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SeoPageLayout>
  );
}
