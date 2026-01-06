import React, { useEffect, useRef, useState, memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight, ArrowUp } from 'lucide-react';

import HeaderPublic from '@/components/HeaderPublic';
import FooterLanding from './Footer';
import { TableOfContents } from './TableOfContents';
import { KeyTakeaways } from './KeyTakeaways';
import { SEOPageHero } from './SeoPageHero';
import './SeoPageLayout.css';

// --- Components ---

const BackToTop = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <button
      onClick={scrollToTop}
      className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
    >
      <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <ArrowUp className="h-4 w-4" />
      </div>
      Back to top
    </button>
  );
};

// --- Types ---

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface SEOPageLayoutProps {
  breadcrumbItems: any[];
  title: string;
  dateUpdated: string;
  heroDescription: string;
  children: React.ReactNode;
  keyTakeaways?: string[];
  recentArticles?: any[];
  pageLanguage?: 'nl' | 'en';
}

// --- Main Layout ---

export const SEOPageLayout = memo(({
  breadcrumbItems,
  title,
  dateUpdated,
  heroDescription,
  children,
  keyTakeaways = [],
  recentArticles = [],
  pageLanguage = 'en',
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [tocStyles, setTocStyles] = useState<React.CSSProperties>({});
  const [showFixedToc, setShowFixedToc] = useState(false);

  // 1. Reset scroll on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // 2. Extract Headings (Populates the TOC)
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h2');
    const items: TOCItem[] = Array.from(headings).map((h, i) => {
      const id = h.id || `section-${i}`;
      h.id = id;
      return { 
        id, 
        text: h.textContent || '', 
        level: 2 
      };
    });

    setTocItems(items);
  }, [children]);

  // 3. Calculate fixed TOC position with proper boundaries
  useEffect(() => {
    const updateTocPosition = () => {
      if (!tocContainerRef.current || !sectionRef.current) return;

      const tocRect = tocContainerRef.current.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Get absolute positions
      const tocContainerTop = tocContainerRef.current.offsetTop;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionBottom = sectionTop + sectionRef.current.offsetHeight;
      
      const headerOffset = 120;
      const bottomPadding = 40; // Extra padding from bottom
      
      // Check if we've scrolled past the TOC's starting position
      const hasScrolledPastStart = scrollY + headerOffset > tocContainerTop;
      
      if (hasScrolledPastStart) {
        setShowFixedToc(true);
        
        // Get the TOC element to measure its actual height
        const tocElement = document.querySelector('[data-toc-fixed]') as HTMLElement;
        const tocHeight = tocElement ? tocElement.offsetHeight : 500;
        
        // Calculate the maximum top position (where TOC should stop)
        const maxTopPosition = sectionBottom - tocHeight - bottomPadding;
        const currentTopPosition = scrollY + headerOffset;
        
        // Check if we need to stop at the bottom
        if (currentTopPosition > maxTopPosition) {
          // Stop scrolling - use absolute positioning
          setTocStyles({
            position: 'absolute',
            top: `${maxTopPosition}px`,
            left: `${tocRect.left + window.scrollX}px`,
            width: `${tocRect.width}px`,
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
            zIndex: 40
          });
        } else {
          // Normal fixed positioning - follow scroll
          setTocStyles({
            position: 'fixed',
            top: `${headerOffset}px`,
            left: `${tocRect.left}px`,
            width: `${tocRect.width}px`,
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
            zIndex: 40
          });
        }
      } else {
        // Not scrolled past start - hide fixed TOC
        setShowFixedToc(false);
      }
    };

    updateTocPosition();
    
    // Update on scroll and resize
    window.addEventListener('scroll', updateTocPosition, { passive: true });
    window.addEventListener('resize', updateTocPosition);

    return () => {
      window.removeEventListener('scroll', updateTocPosition);
      window.removeEventListener('resize', updateTocPosition);
    };
  }, []);

  // 4. Optimized Scroll Spy (Intersection Observer)
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-120px 0px -50% 0px',
        threshold: 0
      }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div className="bg-white min-h-screen">
      <HeaderPublic />
      <main>
        <SEOPageHero 
          title={title} 
          breadcrumbItems={breadcrumbItems} 
          dateUpdated={dateUpdated} 
          description={heroDescription} 
        />
        
        <section ref={sectionRef} className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-16">
            
            <article ref={contentRef} className="min-w-0">
              {children}
            </article>

            {/* Placeholder container for measuring position */}
            <aside className="hidden lg:block">
              <div ref={tocContainerRef} style={{ minHeight: '200px' }}>
                {/* Static TOC shown when at top of page */}
                {!showFixedToc && (
                  <div>
                    <TableOfContents items={tocItems} activeId={activeId} />
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <BackToTop />
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

      </main>

      {/* Fixed/Absolute TOC that follows scroll and stops at section bottom */}
      {showFixedToc && (
        <div style={tocStyles} className="hidden lg:block" data-toc-fixed>
          <TableOfContents items={tocItems} activeId={activeId} />
          <div className="mt-8 pt-8 border-t border-slate-200">
            <BackToTop />
          </div>
        </div>
      )}

      <FooterLanding />
    </div>
  );
});

SEOPageLayout.displayName = 'SEOPageLayout';
export default SEOPageLayout;