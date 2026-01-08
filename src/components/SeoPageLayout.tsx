import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import { Helmet } from 'react-helmet-async';

import HeaderPublic from '@/components/HeaderPublic';
import { SEOPageHero } from './SeoPageHero';
import FooterLanding from './Footer';
import TableOfContents from './TableOfContents';
import { Check } from 'lucide-react';

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
  keyTakeaways?: string[];
}

const PRODUCTION_URL = 'https://www.stockflowsystems.com';

// ⚡ AUTO-DISCOVERY: Automatically import all SEO pages
// This uses Vite's glob import to find all files in src/pages/seo
const seoPages = import.meta.glob('/src/pages/seo/**/*.tsx', { eager: true });

// Extract article metadata from the imported modules
const getAllArticles = () => {
  const articles: Array<{ title: string; href: string; category: string }> = [];
  
  Object.keys(seoPages).forEach((path) => {
    // Extract the full path parts
    const fullPath = path
      .replace('/src/pages/seo', '')
      .replace('.tsx', '')
      .replace('/index', '');
    
    const parts = fullPath.split('/').filter(Boolean);
    
    // Category is the first folder
    const category = parts[0] || 'General';
    
    // Filename is the last part (just the filename, not the full path)
    const filename = parts[parts.length - 1] || '';
    
    // URL is just the filename (not the full path with subfolders)
    // /src/pages/seo/blog/parts-inventory.tsx -> /parts-inventory
    const urlPath = `/${filename}`;
    
    // Convert filename to readable title
    // parts-inventory-management -> Parts Inventory Management
    const title = filename
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    articles.push({
      title,
      href: urlPath,
      category: category.charAt(0).toUpperCase() + category.slice(1)
    });
  });
  
  return articles;
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Related Articles Component - Automatically discovers and rotates through SEO pages
const RelatedArticlesSection = memo(({ currentPath }: { currentPath: string }) => {
  // Get all articles and shuffle on each render
  const displayArticles = useMemo(() => {
    const allArticles = getAllArticles();
    const filtered = allArticles.filter(article => article.href !== currentPath);
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, 3); // Show 3 random articles
  }, [currentPath]); // Re-shuffle when path changes

  if (displayArticles.length === 0) return null;

  return (
    <section className="py-16 max-w-5xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">
              Related Articles
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayArticles.map((article, index) => (
              <Link
                key={`${article.href}-${index}`}
                to={article.href}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  <span>Read more</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

RelatedArticlesSection.displayName = 'RelatedArticlesSection';

// Key Takeaways Component
const KeyTakeaways = memo(({ takeaways }: { takeaways: string[] }) => {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">

        Key Takeaways
      </h3>
      <ul className="space-y-3">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-700">
            <Check className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="flex-1">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

KeyTakeaways.displayName = 'KeyTakeaways';

const SEOPageLayout = memo(({
  breadcrumbItems,
  heroTitle,
  dateUpdated,
  heroDescription,
  children,
  pageLanguage = 'nl',
  previousArticle = null,
  nextArticle = null,
  keyTakeaways = [],
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const canonicalUrl = `${PRODUCTION_URL}${location.pathname}`.replace(/\/+$/, '');

  // Scroll restoration
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // Extract headings
  const extractHeadings = useCallback(() => {
    if (!contentRef.current) return [];
    const headings = contentRef.current.querySelectorAll('h2, h3');
    return Array.from(headings).map((h, i) => {
      const id = h.id || `section-${i}`;
      if (!h.id) h.id = id;
      return { 
        id, 
        text: h.textContent?.trim() || `Sectie ${i + 1}`, 
        level: h.tagName === 'H2' ? 2 : 3 
      };
    });
  }, []);

  useEffect(() => {
    const scheduleExtraction = () => {
      setTocItems(extractHeadings());
    };

    if ('requestIdleCallback' in window) {
      const idleCallbackId = requestIdleCallback(scheduleExtraction, { timeout: 2000 });
      return () => cancelIdleCallback(idleCallbackId);
    } else {
      const timer = setTimeout(scheduleExtraction, 300);
      return () => clearTimeout(timer);
    }
  }, [children, extractHeadings]);

  // IntersectionObserver for active heading
  useEffect(() => {
    if (tocItems.length === 0) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((top, entry) => 
            entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
          );
          setActiveId(topEntry.target.id);
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.1, 0.5, 1] }
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/logo.png" />
        <style>{`@font-face { font-display: swap; }`}</style>
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
            <article ref={contentRef} className="flex-1 min-w-0 seo-article">
              {/* ✅ FIXED: Key Takeaways now display */}
              {keyTakeaways && keyTakeaways.length > 0 && (
                <KeyTakeaways takeaways={keyTakeaways} />
              )}

              {children}

              {/* Navigation Links */}
              {(previousArticle || nextArticle) && (
                <nav aria-label="Artikel navigatie" className="mt-16 pt-10 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previousArticle ? (
                      <Link 
                        to={previousArticle.href} 
                        className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 flex items-start gap-4"
                      >
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Previous</p>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600">{previousArticle.title}</p>
                        </div>
                      </Link>
                    ) : <div />}
                    {nextArticle && (
                      <Link 
                        to={nextArticle.href} 
                        className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase text-slate-400">Next</p>
                          <p className="font-bold text-slate-900 truncate">{nextArticle.title}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24">
              {tocItems.length > 0 ? (
                <TableOfContents items={tocItems} activeId={activeId} />
              ) : (
                <div className="h-64 bg-slate-50 animate-pulse rounded-2xl" />
              )}
            </aside>
          </div>
        </section>

        {/* ⚡ AUTO-ROTATING Related Articles - discovers files automatically! */}
        <RelatedArticlesSection currentPath={location.pathname} />

        {/* Testimonials */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">What customers say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">"Outstanding service and clear explanations. It has helped our company tremendously."</p>
                  <p className="text-sm font-semibold text-slate-900">- Jan de Vries</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">"Professional team with a lot of knowledge. Very satisfied with the collaboration."</p>
                  <p className="text-sm font-semibold text-slate-900">- Maria Janssen</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterLanding />
    </div>
  );
});

SEOPageLayout.displayName = 'SEOPageLayout';

export default SEOPageLayout;