import React, { useEffect, useRef, useState, memo, useCallback, Suspense, lazy } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { Helmet } from 'react-helmet-async';

import HeaderPublic from '@/components/HeaderPublic';
import { SEOPageHero } from './SeoPageHero';

// CSS-import verwijderd ten gunste van inline Tailwind voor FCP optimalisatie
// Indien nodig, laad niet-kritieke CSS asynchroon

const FooterLanding = lazy(() => import('./Footer'));
const TableOfContents = lazy(() => import('./TableOfContents'));

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

const PRODUCTION_URL = 'https://www.stockflowsystem.com';

const SEOPageLayout = memo(({
  breadcrumbItems,
  heroTitle,
  dateUpdated,
  heroDescription,
  children,
  pageLanguage = 'nl',
  previousArticle = null,
  nextArticle = null,
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const canonicalUrl = `${PRODUCTION_URL}${location.pathname}`.replace(/\/+$/, '');

  // 1. Herstel Scroll Positie (Client-side only)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // 2. Headings extractie (Deferred)
  const extractHeadings = useCallback(() => {
    if (!contentRef.current) return [];
    const headings = contentRef.current.querySelectorAll('h2');
    return Array.from(headings).map((h, i) => {
      const id = h.id || `section-${i}`;
      if (!h.id) h.id = id;
      return { id, text: h.textContent?.trim() || `Sectie ${i + 1}`, level: 2 };
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTocItems(extractHeadings());
    }, 500); // Verhoogde delay om hoofdtaken niet te blokkeren
    return () => clearTimeout(timer);
  }, [children, extractHeadings]);

  // 3. Intersection Observer (Passive)
  useEffect(() => {
    if (tocItems.length === 0) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) setActiveId(visible.target.id);
    }, { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 });

    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [tocItems]);

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <html lang={pageLanguage} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        
        {/* Kritieke Preloads - Direct in HTML path */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fetch priority hint voor LCP elementen (H1) wordt via de component afgehandeld */}
      </Helmet>

      <HeaderPublic />

      <main className="relative">
        <SEOPageHero 
          title={heroTitle}
          breadcrumbItems={breadcrumbItems} 
          dateUpdated={dateUpdated} 
          description={heroDescription}
        />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Artikel content - Direct renderen voor FCP */}
            <article 
              ref={contentRef} 
              className="flex-1 min-w-0 seo-article"
            >
              {children}

              {/* Navigatie onderaan */}
              {(previousArticle || nextArticle) && (
                <nav aria-label="Artikel navigatie" className="mt-16 pt-10 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previousArticle ? (
                      <Link to={previousArticle.href} className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors flex items-start gap-4">
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase text-slate-400">Vorige</p>
                          <p className="font-bold text-slate-900 truncate">{previousArticle.title}</p>
                        </div>
                      </Link>
                    ) : <div />}
                    {nextArticle && (
                      <Link to={nextArticle.href} className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors flex items-start justify-between gap-4 text-right">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase text-slate-400">Volgende</p>
                          <p className="font-bold text-slate-900 truncate">{nextArticle.title}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            {/* Sidebar - Lazy geladen om main thread te ontlasten */}
            <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24">
              <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse rounded-2xl" />}>
                <TableOfContentsWrapper items={tocItems} activeId={activeId} />
              </Suspense>
            </aside>
          </div>
        </section>
      </main>

      <Suspense fallback={null}>
        <FooterWrapper />
      </Suspense>
    </div>
  );
});

// Implementatie van wrappers voor fouttolerantie en tree-shaking
const TableOfContentsWrapper = memo(({ items, activeId }: { items: TOCItem[], activeId: string }) => {
  return <TableOfContents items={items} activeId={activeId} />;
});

const FooterWrapper = memo(() => {
  return <FooterLanding />;
});

SEOPageLayout.displayName = 'SEOPageLayout';

export default SEOPageLayout;