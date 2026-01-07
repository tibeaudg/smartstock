import React, { useEffect, useRef, useState, memo, useCallback, Suspense, lazy } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import HeaderPublic from '@/components/HeaderPublic';
import { SEOPageHero } from './SeoPageHero';
import './SeoPageLayout.css';

// Lazy load non-critical components - check if they have default exports
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload critical resources and optimize LCP
  useEffect(() => {
    if (!mounted) return;

    const preloadFonts = () => {
      // Add your critical font URLs here
      const criticalFonts = [
        // Example: { href: '/fonts/inter.woff2', type: 'font/woff2' }
      ];

      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = font.type;
        link.href = font.href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    const markLCPCandidates = () => {
      requestAnimationFrame(() => {
        // Mark potential LCP elements
        const lcpCandidates = document.querySelectorAll(
          'h1, h2, .hero-image, img[loading="eager"]'
        );
        
        lcpCandidates.forEach(candidate => {
          if (candidate.tagName === 'IMG') {
            candidate.setAttribute('fetchpriority', 'high');
          }
        });
      });
    };

    preloadFonts();
    const timer = setTimeout(markLCPCandidates, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Clean navigation & body fix
  useEffect(() => {
    if (!mounted) return;

    window.scrollTo({ top: 0, behavior: 'instant' });
    
    document.documentElement.classList.add('is-seo-page');
    document.body.classList.add('is-seo-page');

    return () => {
      document.documentElement.classList.remove('is-seo-page');
      document.body.classList.remove('is-seo-page');
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [location.pathname, mounted]);

  // Debounced heading extraction
  const extractHeadings = useCallback(() => {
    if (!contentRef.current) return [];
    
    const headings = contentRef.current.querySelectorAll('h2');
    return Array.from(headings).map((h, i) => {
      const id = h.id || `section-${i}`;
      if (!h.id) {
        h.id = id;
      }
      return { 
        id, 
        text: h.textContent?.trim() || `Section ${i + 1}`, 
        level: 2 
      };
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      const items = extractHeadings();
      if (items.length > 0) {
        setTocItems(items);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [children, extractHeadings, mounted]);

  // Optimized Intersection Observer for TOC
  useEffect(() => {
    if (!mounted || tocItems.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      requestAnimationFrame(() => {
        let mostVisibleEntry: IntersectionObserverEntry | null = null;
        let highestRatio = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        if (mostVisibleEntry) {
          setActiveId(mostVisibleEntry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    });

    const timer = setTimeout(() => {
      tocItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
          observerRef.current?.observe(element);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tocItems, mounted]);

  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  // Fallback components for SSR or when lazy loading fails
  const FallbackTOC = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-slate-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  const FallbackFooter = () => (
    <div className="h-20 bg-slate-100"></div>
  );

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen">
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
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-16">
              <article className="flex-1">
                {children}
              </article>
              <aside className="hidden lg:block w-[320px]">
                <FallbackTOC />
              </aside>
            </div>
          </div>
        </main>
        <FallbackFooter />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection-container">
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <html lang={pageLanguage} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </Helmet>

      {/* Noscript fallback for critical CSS */}
      <noscript>
        <link rel="stylesheet" href="/styles/critical.css" />
      </noscript>

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
            <article 
              ref={contentRef} 
              className="flex-1 min-w-0 overflow-visible seo-article"
            >
              {children}

              {(previousArticle || nextArticle) && (
                <nav 
                  aria-label="Article navigation" 
                  className="mt-16 pt-10 border-t border-slate-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previousArticle ? (
                      <Link 
                        to={previousArticle.href} 
                        className="group bg-slate-100 flex items-start gap-4 rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors duration-200"
                        prefetch="intent"
                      >
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs uppercase text-slate-500 truncate">Previous</p>
                          <p className="font-medium text-slate-900 truncate">
                            {previousArticle.title}
                          </p>
                        </div>
                      </Link>
                    ) : <div aria-hidden="true" />}

                    {nextArticle && (
                      <Link 
                        to={nextArticle.href} 
                        className="group bg-slate-100 flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors duration-200 text-right"
                        prefetch="intent"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase text-slate-500 truncate">Next</p>
                          <p className="font-medium text-slate-900 truncate">
                            {nextArticle.title}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400 flex-shrink-0" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            {/* Table of Contents - lazy loaded with error boundary */}
            <aside className="hidden lg:block w-[320px] shrink-0 self-stretch">
              <div className="sticky top-24">
                <Suspense fallback={<FallbackTOC />}>
                  <TableOfContentsWrapper items={tocItems} activeId={activeId} />
                </Suspense>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer - lazy loaded with error boundary */}
      <Suspense fallback={<FallbackFooter />}>
        <FooterWrapper />
      </Suspense>
    </div>
  );
});

// Wrapper components to handle lazy loading errors
const TableOfContentsWrapper = memo(({ items, activeId }: { items: TOCItem[], activeId: string }) => {
  try {
    return <TableOfContents items={items} activeId={activeId} />;
  } catch (error) {
    console.error('Error loading TableOfContents:', error);
    return (
      <div className="text-sm text-slate-500">
        <div className="font-medium mb-2">Table of Contents</div>
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`block py-1 ${activeId === item.id ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
});

const FooterWrapper = memo(() => {
  try {
    return <FooterLanding />;
  } catch (error) {
    console.error('Error loading Footer:', error);
    return (
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    );
  }
});

SEOPageLayout.displayName = 'SEOPageLayout';
TableOfContentsWrapper.displayName = 'TableOfContentsWrapper';
FooterWrapper.displayName = 'FooterWrapper';

export default SEOPageLayout;