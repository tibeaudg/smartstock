import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ArticleNavItem {
  title: string;
  href: string;
}

interface SEOPageHeroProps {
  title: string;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  description?: string;
  previousArticle?: ArticleNavItem | null;
  nextArticle?: ArticleNavItem | null;
}

// Performance optimization: Memoize static components
const BreadcrumbItem = memo(({ item, isLast }: { item: { label: string; href: string }; isLast: boolean }) => (
  <li className="flex items-center gap-2">
    <Link
      to={item.href}
      className="text-gray-600 hover:text-blue-700 transition-colors duration-200 text-sm md:text-base"
      aria-label={`Navigate to ${item.label}`}
    >
      {item.label}
    </Link>
    {!isLast && (
      <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400" aria-hidden="true" />
    )}
  </li>
));

BreadcrumbItem.displayName = 'BreadcrumbItem';

const ArticleNavigationCard = memo(({ 
  article, 
  type 
}: { 
  article: ArticleNavItem; 
  type: 'previous' | 'next' 
}) => {
  const isPrevious = type === 'previous';
  
  return (
    <Link
      to={article.href}
      className="group flex-1 flex items-center gap-4 p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-white hover:shadow-md hover:border-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={`Navigate to ${article.title}`}
    >
      {isPrevious && (
        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex-shrink-0">
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
        </div>
      )}
      
      <div className={`flex-1 min-w-0 ${!isPrevious ? 'text-right' : ''}`}>
        <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          {isPrevious ? 'Previous Article' : 'Next Article'}
        </div>
        <div className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
          {article.title}
        </div>
      </div>
      
      {!isPrevious && (
        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex-shrink-0">
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
        </div>
      )}
    </Link>
  );
});

ArticleNavigationCard.displayName = 'ArticleNavigationCard';

export const SEOPageHero: React.FC<SEOPageHeroProps> = memo(({
  title,
  breadcrumbItems = [],
  description,
  previousArticle = null,
  nextArticle = null,
}) => {
  // Performance optimization: Memoize computed values
  const hasNavigation = useMemo(() => previousArticle || nextArticle, [previousArticle, nextArticle]);
  const hasBreadcrumbs = useMemo(() => breadcrumbItems.length > 0, [breadcrumbItems]);

  return (
    <section 
      className="relative bg-gradient-to-b from-white to-gray-50/30" 
      role="banner"
      aria-label="Article header"
    >
      {/* Decorative background element */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        {/* Breadcrumbs */}
        {hasBreadcrumbs && (
          <nav 
            aria-label="Breadcrumb navigation" 
            className="mb-8 md:mb-10 animate-fade-in"
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm md:text-base font-medium">
              {breadcrumbItems.map((item, index) => (
                <BreadcrumbItem 
                  key={`breadcrumb-${index}`}
                  item={item}
                  isLast={index === breadcrumbItems.length - 1}
                />
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Main Title */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight"
            itemProp="headline"
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p 
              className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-10 md:mb-12 font-light max-w-3xl"
              itemProp="description"
            >
              {description}
            </p>
          )}

          {/* Article Navigation */}
          {hasNavigation && (
            <div 
              className="mt-12 pt-8 md:pt-10 border-t border-gray-100"
              role="navigation"
              aria-label="Related articles navigation"
            >
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                {previousArticle && (
                  <ArticleNavigationCard 
                    article={previousArticle}
                    type="previous"
                  />
                )}
                
                {nextArticle && (
                  <ArticleNavigationCard 
                    article={nextArticle}
                    type="next"
                  />
                )}
              </div>
              
              {/* Reading time indicator (optional, remove if not needed) */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Updated recently</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>8 min read</span>
                </div>
                
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
                  aria-label="Share this article"
                >
                  Share Article
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Performance optimization: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
});

SEOPageHero.displayName = 'SEOPageHero';

export default SEOPageHero;