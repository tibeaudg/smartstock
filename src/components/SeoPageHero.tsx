import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Calendar, Clock, Share2 } from 'lucide-react';

interface ArticleNavItem {
  title: string;
  href: string;
}

interface SEOPageHeroProps {
  title: string;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  description?: string;
  dateUpdated?: string;
  readingTime?: string;
  previousArticle?: ArticleNavItem | null;
  nextArticle?: ArticleNavItem | null;
}

export const SEOPageHero = memo(({
  title,
  breadcrumbItems = [],
  description,
  dateUpdated,
  readingTime = "8 min",
  previousArticle = null,
  nextArticle = null,
}: SEOPageHeroProps) => {
  return (
    <header className="relative w-full bg-white border-b border-slate-100">
      {/* Grid Pattern - Subtieler en beperkt tot container */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="h-full w-full" fill="none">
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-12 lg:py-20">
          {/* Breadcrumbs - Uitgelijnd met Logo */}
          {breadcrumbItems.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
                {breadcrumbItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Link to={item.href} className="hover:text-blue-600 transition-colors">
                      {item.label}
                    </Link>
                    {index < breadcrumbItems.length - 1 && (
                      <ChevronRight className="h-3 w-3 opacity-50" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              {/* Metadata */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} Reading Time</span>
                </div>
                {dateUpdated && (
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{dateUpdated}</span>
                  </div>
                )}
              </div>

              {/* Title - Minder agressieve grootte, betere line-height */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                {title}
              </h1>

              {description && (
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>

          
          </div>
        </div>
      </div>
    </header>
  );
});

SEOPageHero.displayName = 'SEOPageHero';