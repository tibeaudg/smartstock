import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Calendar, Clock } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SEOPageHeroProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  dateUpdated?: string;
  description?: string;
  readingTime?: string;
  category?: string;
}

export function SEOPageHero({ 
  title, 
  breadcrumbItems, 
  dateUpdated, 
  description,
  readingTime,
  category 
}: SEOPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 pb-20 pt-20 border-b border-slate-200">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <Breadcrumbs items={breadcrumbItems} className="mb-8 justify-center" />

          {category && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
              {category}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 balance-text leading-[1.1]">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
            {dateUpdated && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {dateUpdated}</span>
              </div>
            )}
            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} read</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}