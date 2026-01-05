import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { getAllSeoPages, type PageMetadata } from "@/config/topicClusters";
import { getSeoRoutes } from "@/routes/seoRoutes";
import { useMemo } from "react";
import { Search } from "lucide-react";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Blog - StockFlow",
  "description": "Explore our complete library of articles, guides, and resources about inventory management, software comparisons, and industry insights.",
  "url": "https://www.stockflowsystems.com/resources",
  "mainEntity": {
    "@type": "ItemList",
    "name": "StockFlow Blog Articles",
    "description": "Comprehensive articles about inventory management"
  }
};

export default function SEOResourcesBlogPage() {
  usePageRefresh();

  // Get all blog articles
  const blogArticles = useMemo(() => {
    const routes = getSeoRoutes();
    const metadataMap = new Map<string, PageMetadata>();
    
    getAllSeoPages().forEach(page => {
      const normalizedPath = page.path.startsWith('/') ? page.path : `/${page.path}`;
      metadataMap.set(normalizedPath, page);
    });

    return routes
      .filter(route => {
        const path = route.path.toLowerCase();
        return path.includes('/') && path !== '' && path !== '/resources';
      })
      .map(route => {
        const existingMetadata = metadataMap.get(route.path);
        return existingMetadata || {
          path: route.path,
          title: route.path.split('/').pop()?.replace(/-/g, ' ') || 'Article',
          description: `Learn more about ${route.path.split('/').pop()?.replace(/-/g, ' ')}`,
          category: 'blog',
          language: 'en' as const
        } as PageMetadata;
      })
      .slice(0, 12); // Show first 12 articles
  }, []);

  return (
    <SeoPageLayout 
      title="Blog - StockFlow"
      heroTitle="Blog & Resources"
      description="Explore our complete library of articles, guides, and resources about inventory management."
    >
      <SEO
        title="Inventory Management Blog 2025 - Articles, Guides & Resources | StockFlow"
        description="Explore 95+ articles about inventory management, software comparisons, best practices, and industry insights. Expert guides to optimize your inventory operations. Free resources."
        keywords="inventory management blog, inventory articles, stock management guides, inventory software guides, warehouse management articles, inventory best practices, inventory management tips, inventory control guides"
        url="https://www.stockflowsystems.com/resources"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Articles & Guides
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover expert insights, best practices, and practical guides to help you optimize your inventory management processes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <Link
                key={article.path}
                to={article.path}
                className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {article.description}
                  </p>
                )}
                <span className="text-sm text-blue-600 font-medium mt-auto">
                  Read more about {article.title} →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to=""
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="mr-2 h-5 w-5" />
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

