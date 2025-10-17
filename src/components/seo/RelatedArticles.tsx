import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import type { PageMetadata } from '@/config/topicClusters';

interface RelatedArticlesProps {
  articles: PageMetadata[];
  title?: string;
  language?: 'nl' | 'en';
  className?: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles, 
  title,
  language = 'nl',
  className = '' 
}) => {
  const defaultTitle = language === 'nl' ? 'Gerelateerde Artikelen' : 'Related Articles';
  const readMoreText = language === 'nl' ? 'Lees meer' : 'Read more';

  if (articles.length === 0) return null;

  return (
    <section className={`py-12 md:py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title || defaultTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'nl' 
              ? 'Ontdek meer over voorraadbeheer en optimaliseer je bedrijf'
              : 'Discover more about inventory management and optimize your business'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.slice(0, 6).map((article) => (
            <Link
              key={article.path}
              to={article.path}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-blue-300" />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-700 border border-blue-200">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                {article.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                )}

                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>{readMoreText}</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;

