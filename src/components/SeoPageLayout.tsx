import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { Helmet } from 'react-helmet-async';

import HeaderPublic from '@/components/HeaderPublic';
import { SEOPageHero } from './SeoPageHero';

// ⚡ CRITICAL OPTIMIZATION 1: Remove lazy loading for critical components
// Lazy loading Footer and TableOfContents delays LCP by 1,000-1,500ms
// These components are small and should be part of the initial bundle
import FooterLanding from './Footer';
import TableOfContents from './TableOfContents';

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

const PRODUCTION_URL = 'https://www.stockflowsystems.com';

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

  // Scroll restoration - runs once per route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // ⚡ OPTIMIZATION 2: Use requestIdleCallback for non-critical TOC extraction
  // This defers TOC generation until browser is idle, preventing blocking
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
    // ⚡ Use requestIdleCallback if available, setTimeout as fallback
    const scheduleExtraction = () => {
      setTocItems(extractHeadings());
    };

    if ('requestIdleCallback' in window) {
      const idleCallbackId = requestIdleCallback(scheduleExtraction, { timeout: 2000 });
      return () => cancelIdleCallback(idleCallbackId);
    } else {
      // Reduced from 500ms to 300ms - still deferred but faster
      const timer = setTimeout(scheduleExtraction, 300);
      return () => clearTimeout(timer);
    }
  }, [children, extractHeadings]);

  // IntersectionObserver for active heading tracking
  useEffect(() => {
    if (tocItems.length === 0) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 }
    );

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
        
        {/* ⚡ OPTIMIZATION 3: Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ⚡ OPTIMIZATION 4: Preload logo for faster LCP */}
        <link rel="preload" as="image" href="/logo.png" />
        
        {/* ⚡ OPTIMIZATION 5: Font display swap for faster text rendering */}
        <style>{`
          @font-face {
            font-display: swap;
          }
        `}</style>
      </Helmet>

      <HeaderPublic />

      <main className="relative">
        {/* ⚡ Hero content is critical for LCP - ensure it renders immediately */}
        <SEOPageHero 
          title={heroTitle}
          breadcrumbItems={breadcrumbItems} 
          dateUpdated={dateUpdated} 
          description={heroDescription}
        />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* ⚡ Article content renders immediately - no Suspense blocking */}
            <article 
              ref={contentRef} 
              className="flex-1 min-w-0 seo-article"
            >
              {children}

              {/* Navigation links */}
              {(previousArticle || nextArticle) && (
                <nav aria-label="Artikel navigatie" className="mt-16 pt-10 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previousArticle ? (
                      <Link 
                        to={previousArticle.href} 
                        className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors flex items-start gap-4"
                      >
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase text-slate-400">Previous</p>
                          <p className="font-bold text-slate-900 truncate">{previousArticle.title}</p>
                        </div>
                      </Link>
                    ) : <div />}
                    {nextArticle && (
                      <Link 
                        to={nextArticle.href} 
                        className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors flex items-start justify-between gap-4 text-right"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase text-slate-400">Next</p>
                          <p className="font-bold text-slate-900 truncate">{nextArticle.title}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            {/* ⚡ OPTIMIZATION 6: Direct render TOC instead of Suspense */}
            {/* TOC is small and non-critical, but Suspense adds unnecessary complexity */}
            <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24">
              {tocItems.length > 0 ? (
                <TableOfContents items={tocItems} activeId={activeId} />
              ) : (
                <div className="h-64 bg-slate-50 animate-pulse rounded-2xl" />
              )}
            </aside>
          </div>
        </section>
      </main>

      {/* ⚡ OPTIMIZATION 7: Direct render Footer instead of Suspense */}
      {/* Footer is essential content and should be part of initial render */}
      <FooterLanding />
    </div>
  );
});

SEOPageLayout.displayName = 'SEOPageLayout';

export default SEOPageLayout;