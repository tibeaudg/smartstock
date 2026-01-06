import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronRight as NextIcon } from 'lucide-react';

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

export const SEOPageHero: React.FC<SEOPageHeroProps> = ({
  title,
  breadcrumbItems = [],
  description,
  previousArticle = null,
  nextArticle = null,
}) => {
  return (
    <section className="bg-[#f8faff] border-b border-slate-100">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Breadcrumbs integrated into Hero container */}
        {breadcrumbItems.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-medium text-slate-500">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Link 
                    to={item.href}
                    className="hover:text-[#1d4ed8] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl mt-12">
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-normal mb-8">
              {description}
            </p>
          )}

          {/* Previous/Next Article Navigation */}
          {(previousArticle || nextArticle) && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200">
              {previousArticle && (
                <Link
                  to={previousArticle.href}
                  className="group flex-1 flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                >
                  <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-500 mb-1">Previous Article</div>
                    <div className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                      {previousArticle.title}
                    </div>
                  </div>
                </Link>
              )}

              {nextArticle && (
                <Link
                  to={nextArticle.href}
                  className="group flex-1 flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-right"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-500 mb-1">Next Article</div>
                    <div className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                      {nextArticle.title}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <NextIcon className="h-4 w-4" />
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SEOPageHero;