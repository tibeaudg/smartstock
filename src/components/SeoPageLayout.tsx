import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Check, ChevronLeft, ChevronRight } from 'lucide-react';

import HeaderPublic from '@/components/HeaderPublic';
import { SEOPageHero } from './SeoPageHero';
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
  keyTakeaways?: string[];
}

const PRODUCTION_URL = 'https://www.stockflowsystems.com';

/* ---------------------------------------------
   SEO Auto Discovery
--------------------------------------------- */
const seoPages = import.meta.glob('/src/pages/seo/**/*.tsx', { eager: true });

const getAllArticles = () => {
  const articles: Array<{ title: string; href: string; category: string }> = [];

  Object.keys(seoPages).forEach((path) => {
    const fullPath = path
      .replace('/src/pages/seo', '')
      .replace('.tsx', '')
      .replace('/index', '');

    const parts = fullPath.split('/').filter(Boolean);
    const category = parts[0] || 'General';
    const filename = parts[parts.length - 1] || '';
    const urlPath = `/${filename}`;

    const title = filename
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    articles.push({
      title,
      href: urlPath,
      category: category.charAt(0).toUpperCase() + category.slice(1)
    });
  });

  return articles;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* ---------------------------------------------
   Key Takeaways
--------------------------------------------- */
const KeyTakeaways = memo(({ takeaways }: { takeaways: string[] }) => {
  if (!takeaways?.length) return null;

  return (
    <section className="mb-12 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-900">Key takeaways</h3>
      <ul className="space-y-3">
        {takeaways.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-700">
            <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

KeyTakeaways.displayName = 'KeyTakeaways';

/* ---------------------------------------------
   Related Articles
--------------------------------------------- */
const RelatedArticlesSection = memo(({ currentPath }: { currentPath: string }) => {
  const displayArticles = useMemo(() => {
    const all = getAllArticles();
    const filtered = all.filter(a => a.href !== currentPath);
    return shuffleArray(filtered).slice(0, 3);
  }, [currentPath]);

  if (!displayArticles.length) return null;

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-10 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Related articles</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {displayArticles.map((article, index) => (
            <Link
              key={`${article.href}-${index}`}
              to={article.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {article.category}
              </span>
              <h3 className="mb-4 line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                {article.title}
              </h3>
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                Read more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

RelatedArticlesSection.displayName = 'RelatedArticlesSection';

/* ---------------------------------------------
   Main Layout
--------------------------------------------- */
const SEOPageLayout = memo(({
  breadcrumbItems,
  heroTitle,
  dateUpdated,
  heroDescription,
  children,
  pageLanguage = 'nl',
  previousArticle = null,
  nextArticle = null,
  keyTakeaways = []
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const canonicalUrl = `${PRODUCTION_URL}${location.pathname}`.replace(/\/+$/, '');

  /* Scroll restore */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  /* Extract headings */
  const extractHeadings = useCallback((): TOCItem[] => {
    if (!contentRef.current) return [];

    const headings = contentRef.current.querySelectorAll('h2, h3');

    return Array.from(headings).map((el, i) => {
      const id = el.id || `section-${i}`;
      if (!el.id) el.id = id;

      return {
        id,
        text: el.textContent?.trim() || `Section ${i + 1}`,
        level: el.tagName === 'H2' ? 2 : 3
      };
    });
  }, []);

  useEffect(() => {
    const run = () => setTocItems(extractHeadings());

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }

    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [children, extractHeadings]);

  /* TOC observer */
  useEffect(() => {
    if (!tocItems.length) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (!visible.length) return;

        const top = visible.reduce((a, b) =>
          b.boundingClientRect.top < a.boundingClientRect.top ? b : a
        );

        setActiveId(top.target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.25, 0.75, 1] }
    );

    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [tocItems]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <html lang={pageLanguage} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style>{`@font-face { font-display: swap; }`}</style>
      </Helmet>

      <HeaderPublic />

      <main>
        <SEOPageHero
          title={heroTitle}
          breadcrumbItems={breadcrumbItems}
          dateUpdated={dateUpdated}
          description={heroDescription}
        />

        <section className="container mx-auto max-w-7xl px-4 py-14">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_320px]">
            <article ref={contentRef} className="min-w-0">
              <KeyTakeaways takeaways={keyTakeaways} />

              <div className="prose prose-slate max-w-none">
                {children}
              </div>

              {(previousArticle || nextArticle) && (
                <nav className="mt-20 border-t border-slate-200 pt-10">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {previousArticle ? (
                      <Link
                        to={previousArticle.href}
                        className="group flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
                      >
                        <ChevronLeft className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">Previous</p>
                          <p className="font-medium text-slate-900 group-hover:text-blue-600">
                            {previousArticle.title}
                          </p>
                        </div>
                      </Link>
                    ) : <div />}

                    {nextArticle && (
                      <Link
                        to={nextArticle.href}
                        className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">Next</p>
                          <p className="font-medium text-slate-900 group-hover:text-blue-600">
                            {nextArticle.title}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            <aside className="sticky top-24 hidden h-fit lg:block">
              {tocItems.length ? (
                <TableOfContents items={tocItems} activeId={activeId} />
              ) : (
                <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
              )}
            </aside>
          </div>
        </section>

        <RelatedArticlesSection currentPath={location.pathname} />

        {/* Testimonials */}
        <section className="bg-white py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-10 text-2xl font-bold text-slate-900">What customers say</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg key={idx} className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 text-slate-700">
                    {i === 1
                      ? 'Outstanding service and clear explanations. It has helped our company tremendously.'
                      : 'Professional team with strong domain knowledge. Very satisfied with the collaboration.'}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {i === 1 ? '- Jan de Vries' : '- Maria Janssen'}
                  </p>
                </div>
              ))}
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
