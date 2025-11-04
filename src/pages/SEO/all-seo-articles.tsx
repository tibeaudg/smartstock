import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { getAllSeoPages, type PageMetadata } from '@/config/topicClusters';
import { Search, Globe, FileText, Filter } from 'lucide-react';
import { useState } from 'react';

export default function AllSeoArticles() {
  usePageRefresh();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'nl' | 'en'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allArticles = getAllSeoPages();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allArticles.map(article => article.category));
    return Array.from(cats).sort();
  }, [allArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          article.title.toLowerCase().includes(query) ||
          article.description?.toLowerCase().includes(query) ||
          article.path.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Language filter
      if (selectedLanguage !== 'all' && article.language !== selectedLanguage) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [allArticles, searchQuery, selectedLanguage, selectedCategory]);

  // Group articles by category
  const articlesByCategory = useMemo(() => {
    const grouped: Record<string, PageMetadata[]> = {};
    filteredArticles.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, [filteredArticles]);

  const totalArticles = allArticles.length;
  const filteredCount = filteredArticles.length;

  return (
    <SeoPageLayout title="All SEO Articles">
      <SEO
        title="All SEO Articles - Complete Inventory Management Resource Library | StockFlow"
        description="Browse our complete collection of SEO articles covering inventory management, stock control, warehouse management, and more. Find expert guides, tips, and solutions."
        keywords="all articles, SEO articles, inventory management articles, stock management articles, warehouse management articles, resource library"
        url="https://www.stockflow.be/all-seo-articles"
      />

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All SEO Articles
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Browse our complete library of {totalArticles} articles covering inventory management, stock control, and warehouse solutions.
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Language Filter */}
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'all' | 'nl' | 'en')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Languages</option>
                  <option value="en">English</option>
                  <option value="nl">Dutch</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredCount} of {totalArticles} articles
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h2>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Group by Category */}
              {Object.entries(articlesByCategory).map(([category, articles]) => (
                <div key={category}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-600 rounded"></span>
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <Link
                        key={article.path}
                        to={article.path}
                        className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {article.image && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                article.language === 'nl' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {article.language.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">{article.category}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            {article.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {article.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SeoPageLayout>
  );
}

