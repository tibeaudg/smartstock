import React, { useEffect, useRef, useState, memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import HeaderPublic from '@/components/HeaderPublic';
import FooterLanding from './Footer';
import { TableOfContents } from './TableOfContents';
import { SEOPageHero } from './SeoPageHero';
import './SeoPageLayout.css';



interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface SEOPageLayoutProps {
  breadcrumbItems: any[];
  heroTitle: string;
  dateUpdated: string;
  heroDescription: string;
  children: React.ReactNode;
  pageLanguage?: 'nl' | 'en';
  previousArticle?: any | null;
  nextArticle?: any | null;
}

export const SEOPageLayout = memo(({
  breadcrumbItems,
  heroTitle,
  dateUpdated,
  heroDescription,
  children,
  pageLanguage = 'en',
  previousArticle = null,
  nextArticle = null,
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');

  // 1. Schone navigatie & Body fix (LCP optimalisatie)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Forceer visible om CSS sticky te laten werken
    document.documentElement.style.overflow = 'visible';
    document.body.style.overflow = 'visible';
  }, [location.pathname]);

  // 2. Headings extractie
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('h2');
    const items: TOCItem[] = Array.from(headings).map((h, i) => {
      const id = h.id || `section-${i}`;
      h.id = id;
      return { id, text: h.textContent || '', level: 2 };
    });
    setTocItems(items);
  }, [children]);

  // 3. Lichtgewicht Intersection Observer voor Active State (Geen Scroll Listener)
  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find(entry => entry.isIntersecting);
        if (intersecting) setActiveId(intersecting.target.id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  return (
    <div className="bg-white min-h-screen selection-container">
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <html lang={pageLanguage} />
      </Helmet>

      <HeaderPublic />
      
      <main className="relative">
        <SEOPageHero 
          title={heroTitle}
          breadcrumbItems={breadcrumbItems} 
          dateUpdated={dateUpdated} 
          description={heroDescription}
        />

        <section className="container mx-auto px-4 py-12 overflow-visible">
          <div className="flex flex-col lg:flex-row gap-16 items-start overflow-visible">            
            <article ref={contentRef} className="flex-1 min-w-0 overflow-visible">
              {children}

              {(previousArticle || nextArticle) && (
                <nav aria-label="Article navigation" className="mt-16 pt-10 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previousArticle ? (
                      <Link to={previousArticle.href} className="group bg-slate-100 flex items-start gap-4 rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition">
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-xs uppercase text-slate-500">Previous</p>
                          <p className="font-medium text-slate-900">{previousArticle.title}</p>
                        </div>
                      </Link>
                    ) : <div />}

                    {nextArticle && (
                      <Link to={nextArticle.href} className="group bg-slate-100 flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition text-right">
                        <div>
                          <p className="text-xs uppercase text-slate-500">Next</p>
                          <p className="font-medium text-slate-900">{nextArticle.title}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            {/* Aside gefixeerd op artikel-hoogte */}
            <aside className="hidden lg:block w-[320px] shrink-0 self-stretch">
              <div className="sticky top-24"> {/* Native CSS sticky */}
                <TableOfContents items={tocItems} activeId={activeId} />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <FooterLanding />
    </div>
  );
});

SEOPageLayout.displayName = 'SEOPageLayout';
export default SEOPageLayout;