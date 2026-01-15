import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { getAllSeoPages, type PageMetadata } from "@/config/topicClusters";
import { getSeoRoutes } from "@/routes/seoRoutes";
import { useMemo, useState } from "react";
import { Search, BookOpen, ArrowRight, Clock, Tag, X } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/HeaderPublic";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Knowledge Hub - StockFlow",
  "description": "Expert insights, industry guides, and software comparisons for modern inventory management.",
  "url": "https://www.stockflowsystems.com/resources",
  "mainEntity": {
    "@type": "ItemList",
    "name": "StockFlow Resources",
    "description": "Articles on warehouse optimization, procurement, and inventory control."
  }
};

export default function SEOResourcesBlogPage() {
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsToShow, setItemsToShow] = useState(13);

  const { featuredArticle, filteredArticles, totalResults } = useMemo(() => {
    const routes = getSeoRoutes();
    const metadataMap = new Map<string, PageMetadata>();
    
    getAllSeoPages().forEach(page => {
      const normalizedPath = page.path.startsWith('/') ? page.path : `/${page.path}`;
      metadataMap.set(normalizedPath, page);
    });

    const allArticles = routes
      .filter(route => {
        const path = route.path.toLowerCase();
        return path.includes('/') && path !== '' && path !== '/resources';
      })
      .map(route => {
        const existingMetadata = metadataMap.get(route.path);
        return existingMetadata || {
          path: route.path,
          title: route.path.split('/').pop()?.replace(/-/g, ' ') || 'Article',
          description: `Strategic insights into ${route.path.split('/').pop()?.replace(/-/g, ' ')} for enterprise growth.`,
          category: 'Industry Insights',
          language: 'en' as const
        } as PageMetadata;
      });

    const filtered = allArticles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      featuredArticle: searchQuery === "" ? filtered[0] : null,
      filteredArticles: searchQuery === "" ? filtered.slice(1, itemsToShow) : filtered.slice(0, itemsToShow),
      totalResults: filtered.length
    };
  }, [searchQuery, itemsToShow]);

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 12);
  };

  return (
    <>
      <Header />
      <SEO
        title="Inventory Management Resources 2026 | Industry Guides | StockFlow"
        description="Access professional articles, software comparisons, and best practices for inventory operations."
        keywords="inventory management blog, inventory strategy, warehouse optimization guides"
        url="https://www.stockflowsystems.com/blog"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />


      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Articles"}
              </h2>
              <p className="text-lg text-gray-600">
                {searchQuery 
                  ? `Showing ${filteredArticles.length} of ${totalResults} matching resources.`
                  : "Technical resources designed to eliminate operational friction and optimize stock accuracy."}
              </p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..." 
                className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-80"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.path}
                  to={article.path}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="mb-4">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded">
                      {article.category || 'Article'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>5 min read</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination/Load More Logic */}
          {totalResults > itemsToShow && (
            <div className="mt-20 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Want deeper insights?</h4>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                You've viewed {itemsToShow} articles. Access our full archive of over 95 specialized articles.
              </p>
              <button 
                onClick={handleLoadMore}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
              >
                <Search size={18} />
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}