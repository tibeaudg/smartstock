import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SEOPageHeroProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  description?: string;
  dateUpdated?: string;
  readingTime?: string;
  category?: string;
}

export function SEOPageHero({
  title,
  breadcrumbItems,
  description,
  dateUpdated,
  readingTime,
  category,
}: SEOPageHeroProps) {
  return (
    <section
      className="relative bg-slate-50 border-b border-slate-200"
      aria-labelledby="page-title"
    >
      {/* Decorative background */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

          <Breadcrumbs
            items={breadcrumbItems}
            className="mb-6 justify-center"
          />

          {category && (
            <span className="mb-5 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {category}
            </span>
          )}

          <h1
            id="page-title"
            className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl leading-tight"
          >
            {title}
          </h1>

          {description && (
            <p className="mb-8 max-w-2xl text-lg text-slate-600 md:text-xl leading-relaxed">
              {description}
            </p>
          )}

          {(dateUpdated || readingTime) && (
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
              {dateUpdated && (
                <div className="flex items-center gap-2">
                  <Calendar
                    className="h-4 w-4"
                    aria-hidden
                  />
                  <span>Updated {dateUpdated}</span>
                </div>
              )}

              {readingTime && (
                <div className="flex items-center gap-2">
                  <Clock
                    className="h-4 w-4"
                    aria-hidden
                  />
                  <span>{readingTime} read</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
