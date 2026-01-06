import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SEOPageHeroProps {
  title: string;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  description?: string;
}

export const SEOPageHero: React.FC<SEOPageHeroProps> = ({
  title,
  breadcrumbItems = [],
  description,
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
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SEOPageHero;