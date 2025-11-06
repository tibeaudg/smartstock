import React from 'react';
import { Link } from 'react-router-dom';
import { List, Navigation, ArrowRight } from 'lucide-react';
import type { PageMetadata } from '@/config/topicClusters';
import { RelatedArticles } from './RelatedArticles';
import { useLocation } from 'react-router-dom';

export interface SidebarContent {
  relatedArticles?: PageMetadata[];
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
  navigationLinks?: Array<{ path: string; title: string }>;
  language?: 'nl' | 'en';
  maxArticles?: number; // Maximum articles to show before "View All" button
}

interface SeoSidebarProps {
  content?: SidebarContent;
  className?: string;
}

export const SeoSidebar: React.FC<SeoSidebarProps> = ({ 
  content,
  className = '' 
}) => {
  const location = useLocation();
  const language = content?.language || 'nl';
  const maxArticles = content?.maxArticles || 20; // Default to showing 10 articles

  // If no content provided, return null
  if (!content || (!content.relatedArticles && !content.tableOfContents && !content.navigationLinks)) {
    return null;
  }

  const hasMoreArticles = content.relatedArticles && content.relatedArticles.length > maxArticles;
  const displayedArticles = content.relatedArticles ? content.relatedArticles.slice(0, maxArticles) : [];

  return (
    <aside className={`hidden lg:block lg:sticky lg:top-8 lg:self-start ${className}`}>
      <div className="space-y-8">


        {/* Navigation Links */}
        {content.navigationLinks && content.navigationLinks.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'nl' ? 'Navigatie' : 'Navigation'}
              </h3>
            </div>
            <nav className="space-y-2">
              {content.navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Related Articles - Compact Version for Sidebar */}
        {content.relatedArticles && content.relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'nl' ? 'Alle Artikels' : 'All Articles'}
            </h3>
            <nav className="space-y-3">
              {displayedArticles.map((article) => (
                <Link
                  key={article.path}
                  to={article.path}
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    {article.image && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                        {article.title}
                      </h4>
                      {article.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* View All Button */}
              {hasMoreArticles && (
                <Link
                  to="/all-seo-articles"
                  className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors group"
                >
                  <span>{language === 'nl' ? 'Bekijk alle artikelen' : 'View All Articles'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span className="text-xs text-gray-500 ml-1">
                    ({content.relatedArticles!.length - maxArticles} {language === 'nl' ? 'meer' : 'more'})
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SeoSidebar;

