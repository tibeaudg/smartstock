import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Share2,
  Copy,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';

import HeaderPublic from '@/components/HeaderPublic';
import { SEO } from '@/components/SEO';
import { generateFAQSchema } from '@/lib/structuredData';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
} from '@/utils/enhancedStructuredData';
import { getHubForPath, getTopicalRelatedLinks } from '@/config/internalLinking';
import { getHreflangAlternates } from '@/config/enNlHreflang';
import {
  generatePageMetaDescription,
  isThinTemplatePage,
  normalizeKeyTakeaways,
} from '@/utils/seoPageDescription';
import { FORCED_NOINDEX_PATHS } from '@/config/seoPruning.generated';
import { SEOPageHero } from './SeoPageHero';
import FooterLanding from './Footer';
import TableOfContents from './TableOfContents';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface SEOPageLayoutProps {
  breadcrumbItems?: Array<{ name: string; url: string }>;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  heroTitle: string;
  dateUpdated?: string;
  datePublished?: string;
  authorName?: string;
  authorUrl?: string;
  heroDescription?: string;
  children: React.ReactNode;
  pageLanguage?: 'nl' | 'en';
  alternateLanguages?: Array<{ lang: string; url: string }>;
  previousArticle?: { title: string; href: string } | null;
  nextArticle?: { title: string; href: string } | null;
  keyTakeaways?: string[];
  faqData?: Array<{ question: string; answer: string }>;
  structuredData?: object | object[];
  noindex?: boolean;
  /* Reading time override in minutes — auto-calculated from content if omitted */
  readingTimeMinutes?: number;
}

const PRODUCTION_URL = 'https://www.stockflowsystems.com';
const DEFAULT_AUTHOR = 'StockFlow Team';

/* ─────────────────────────────────────────────
   SEO Auto Discovery
───────────────────────────────────────────── */
const seoPagesUpper = import.meta.glob('/src/pages/SEO/**/*.tsx', { eager: false });
const seoPagesLower = import.meta.glob('/src/pages/seo/**/*.tsx', { eager: false });
const seoPages = { ...seoPagesUpper, ...seoPagesLower };

const getAllArticles = () => {
  const articles: Array<{ title: string; href: string; category: string }> = [];
  Object.keys(seoPages).forEach((path) => {
    const fullPath = path
      .replace(/\/src\/pages\/(SEO|seo)\//, '')
      .replace('.tsx', '')
      .replace('/index', '');
    const parts = fullPath.split('/').filter(Boolean);
    const category = parts[0] || 'General';
    const filename = parts[parts.length - 1] || '';
    const title = filename
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    articles.push({
      title,
      href: `/${filename}`,
      category: category.charAt(0).toUpperCase() + category.slice(1),
    });
  });
  return articles;
};

/* Deterministic shuffle based on URL — same path always returns same 3 articles.
   This ensures crawlers always see the same internal links (important for link equity). */
const seededShuffle = <T,>(array: T[], seed: string): T[] => {
  const arr = [...array];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h ^= h << 13; h ^= h >> 7; h ^= h << 17;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const toReadableLabel = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/** Estimate reading time from a DOM element's text content (200 wpm average) */
const estimateReadingTime = (el: HTMLElement | null): number => {
  if (!el) return 3;
  const words = (el.textContent || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/* ─────────────────────────────────────────────
   Generate Article JSON-LD schema
───────────────────────────────────────────── */
const generateArticleSchema = (params: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  imageUrl?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: params.title,
  description: params.description,
  url: params.url,
  ...(params.datePublished && { datePublished: params.datePublished }),
  ...(params.dateModified && { dateModified: params.dateModified }),
  author: {
    '@type': 'Person',
    name: params.authorName,
    ...(params.authorUrl && { url: params.authorUrl }),
  },
  publisher: {
    '@type': 'Organization',
    name: 'StockFlow',
    url: PRODUCTION_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${PRODUCTION_URL}/logo.png`,
    },
  },
  ...(params.imageUrl && {
    image: {
      '@type': 'ImageObject',
      url: params.imageUrl,
    },
  }),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': params.url,
  },
});

/* ─────────────────────────────────────────────
   Reading Progress Bar
───────────────────────────────────────────── */
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className=" w-full fixed top-16 left-0 z-[9999] h-1 bg-primary transition-all duration-75"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
};

/* ─────────────────────────────────────────────
   Key Takeaways
───────────────────────────────────────────── */
const KeyTakeaways = memo(({ takeaways }: { takeaways: string[] }) => {
  if (!takeaways?.length) return null;
  return (
    <section
      className="mb-12 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm"
      aria-label="Key takeaways"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Key takeaways</h2>
      <ul className="space-y-3">
        {takeaways.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-700">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
});
KeyTakeaways.displayName = 'KeyTakeaways';

/* ─────────────────────────────────────────────
   Article Meta Bar (reading time, date, share)
───────────────────────────────────────────── */
const ArticleMetaBar = memo(({
  readingTime,
  dateUpdated,
  datePublished,
  authorName,
  currentUrl,
}: {
  readingTime: number;
  dateUpdated?: string;
  datePublished?: string;
  authorName: string;
  currentUrl: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently fail — clipboard blocked in some browsers */
    }
  }, [currentUrl]);

  const displayDate = dateUpdated || datePublished;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-100 pb-6">
      {/* Author */}
      <span className="flex items-center gap-2 text-sm text-slate-600">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {authorName.charAt(0)}
        </span>
        {authorName}
      </span>

      {/* Reading time */}
      <span className="flex items-center gap-1.5 text-sm text-slate-500">
        <Clock className="h-4 w-4" aria-hidden="true" />
        {readingTime} min read
      </span>

      {/* Date */}
      {formattedDate && (
        <span className="flex items-center gap-1.5 text-sm text-slate-500">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={displayDate}>{formattedDate}</time>
        </span>
      )}

      {/* Spacer */}
      <span className="flex-1" />

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
        aria-label="Copy link to this article"
      >
        {copied ? (
          <>
            <CheckCheck className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
});
ArticleMetaBar.displayName = 'ArticleMetaBar';

/* ─────────────────────────────────────────────
   Inline CTA Banner
───────────────────────────────────────────── */
const InlineCTA = memo(() => (
  <aside
    className="my-14 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg"
    aria-label="Try StockFlow for free"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
          Free forever
        </p>
        <h3 className="mt-1 text-xl font-bold text-white">
          Track your inventory in real-time — completely free.
        </h3>
        <p className="mt-1 text-sm text-blue-100">
          No credit card. No time limit. Used by 500+ businesses today.
        </p>
      </div>
      <Link
        to="/?ref=article-cta"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow transition hover:shadow-md hover:-translate-y-0.5"
      >
        Get started free
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </aside>
));
InlineCTA.displayName = 'InlineCTA';

/* ─────────────────────────────────────────────
   Related Articles
───────────────────────────────────────────── */
const RelatedArticlesSection = memo(({ currentPath }: { currentPath: string }) => {
  const displayArticles = useMemo(() => {
    const topical = getTopicalRelatedLinks(currentPath);
    if (topical.length >= 3) {
      return topical.slice(0, 3).map((item) => ({
        title: item.title,
        href: item.path,
        category: 'Related',
      }));
    }
    // Deterministic shuffle: same path → same 3 articles on every page load / crawl
    const all = getAllArticles().filter((a) => a.href !== currentPath);
    return seededShuffle(all, currentPath).slice(0, 3);
  }, [currentPath]);

  if (!displayArticles.length) return null;

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-20" aria-label="Related articles">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600" aria-hidden="true" />
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
                Read more
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});
RelatedArticlesSection.displayName = 'RelatedArticlesSection';

/* ─────────────────────────────────────────────
   Topic Cluster Hub Section
───────────────────────────────────────────── */
const TopicClusterSection = memo(({
  currentHub,
  currentPath,
}: {
  currentHub: NonNullable<ReturnType<typeof getHubForPath>>;
  currentPath: string;
}) => (
  <section
    className="border-t border-slate-100 bg-white py-14"
    aria-label={`More in ${currentHub.title}`}
  >
    <div className="container mx-auto max-w-6xl px-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
        Topic guide
      </p>
      <h2 className="mb-2 text-xl font-bold text-slate-900">{currentHub.title}</h2>
      <p className="mb-6 text-slate-600">
        Part of our complete guide. Start with{' '}
        <Link to={currentHub.path} className="font-semibold text-blue-600 hover:underline">
          {currentHub.hubAnchorText}
        </Link>
        .
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {currentHub.spokes
          .filter((spoke) => spoke.path !== currentPath)
          .map((spoke) => (
            <Link
              key={spoke.path}
              to={spoke.path}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              <span>{spoke.title}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </Link>
          ))}
      </div>
    </div>
  </section>
));
TopicClusterSection.displayName = 'TopicClusterSection';

/* ─────────────────────────────────────────────
   Main Layout
───────────────────────────────────────────── */
const SEOPageLayout = memo(({
  breadcrumbItems = [],
  title,
  seoTitle,
  seoDescription,
  heroTitle,
  dateUpdated,
  datePublished,
  authorName = DEFAULT_AUTHOR,
  authorUrl,
  heroDescription = '',
  children,
  pageLanguage,
  alternateLanguages,
  previousArticle = null,
  nextArticle = null,
  keyTakeaways = [],
  faqData = [],
  structuredData,
  noindex: noindexProp,
  readingTimeMinutes,
}: SEOPageLayoutProps) => {
  const location = useLocation();
  const currentHub = getHubForPath(location.pathname);
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [readingTime, setReadingTime] = useState(readingTimeMinutes ?? 3);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Language resolution ── */
  const resolvedPageLanguage: 'en' | 'nl' =
    pageLanguage ?? (location.pathname.startsWith('/nl') ? 'nl' : 'en');

  /* ── SEO Title (≤ 60 chars) ── */
  const pageTitle = title || heroTitle;
  const resolvedSeoTitle = useMemo(() => {
    const candidate = seoTitle || pageTitle;
    if (candidate.length <= 60) return candidate;
    const brandSuffix = ' | StockFlow';
    const base = candidate.endsWith(brandSuffix)
      ? candidate.slice(0, -brandSuffix.length)
      : candidate;
    const shortened = base
      .replace(/ Strategy & Automation Guide$/, '')
      .replace(/ Guide$/, '')
      .replace(/ - A Technical Framework$/, '');
    const trimmed = shortened + brandSuffix;
    return trimmed.length <= 60 ? trimmed : trimmed.substring(0, 57) + '...';
  }, [seoTitle, pageTitle]);

  const canonicalUrl = `${PRODUCTION_URL}${location.pathname.replace(/\/+$/, '') || '/'}`;

  /* ── Breadcrumbs ── */
  const resolvedBreadcrumbItems = useMemo(() => {
    if (breadcrumbItems.length > 0) return breadcrumbItems;
    if (!currentHub)
      return [{ name: 'Home', url: '/' }, { name: heroTitle, url: location.pathname }];
    if (currentHub.path === location.pathname)
      return [{ name: 'Home', url: '/' }, { name: currentHub.title, url: currentHub.path }];
    return [
      { name: 'Home', url: '/' },
      { name: currentHub.title, url: currentHub.path },
      { name: toReadableLabel(location.pathname.replace(/^\//, '')), url: location.pathname },
    ];
  }, [breadcrumbItems, currentHub, heroTitle, location.pathname]);

  /* ── Meta description ── */
  const resolvedDescription =
    seoDescription ||
    heroDescription ||
    generatePageMetaDescription(heroTitle, resolvedPageLanguage);

  /* ── Noindex resolution ── */
  const thinTemplate = isThinTemplatePage(heroTitle, keyTakeaways);
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const forcedNoindex = FORCED_NOINDEX_PATHS.has(normalizedPath);
  const shouldNoindex = noindexProp ?? (thinTemplate || forcedNoindex);

  /* ── Key takeaways ── */
  const normalizedTakeaways = useMemo(
    () => normalizeKeyTakeaways(keyTakeaways, heroTitle),
    [keyTakeaways, heroTitle]
  );

  /* ── hreflang ── */
  const resolvedAlternateLanguages =
    alternateLanguages ?? getHreflangAlternates(location.pathname);

  /* ── Combined structured data (Article + FAQ + Org + Site + Breadcrumb) ── */
  const combinedStructuredData = useMemo(() => {
    const schemas: object[] = [
      generateOrganizationSchema(PRODUCTION_URL),
      generateLocalBusinessSchema(PRODUCTION_URL),
      generateWebSiteSchema(PRODUCTION_URL, resolvedPageLanguage),
      generateBreadcrumbSchema(
        location.pathname,
        heroTitle,
        PRODUCTION_URL,
        currentHub?.title,
        currentHub?.path
      ),
      // Article schema on every content page
      generateArticleSchema({
        title: pageTitle,
        description: resolvedDescription,
        url: canonicalUrl,
        datePublished,
        dateModified: dateUpdated,
        authorName,
        authorUrl,
        imageUrl: `${PRODUCTION_URL}/Inventory-Management.png`,
      }),
    ];

    if (structuredData) {
      schemas.push(...(Array.isArray(structuredData) ? structuredData : [structuredData]));
    } else if (faqData?.length) {
      schemas.push(generateFAQSchema(faqData));
    }

    return schemas;
  }, [
    structuredData,
    faqData,
    resolvedPageLanguage,
    location.pathname,
    heroTitle,
    currentHub,
    pageTitle,
    resolvedDescription,
    canonicalUrl,
    datePublished,
    dateUpdated,
    authorName,
    authorUrl,
  ]);

  /* ── og:type should be 'article' for content pages ── */
  // (Passed to <SEO> via Helmet override below)

  /* ── Scroll restore on route change ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  /* ── Extract headings for TOC + compute reading time ── */
  const extractHeadings = useCallback((): TOCItem[] => {
    if (!contentRef.current) return [];
    const headings = contentRef.current.querySelectorAll('h2, h3');
    return Array.from(headings).map((el, i) => {
      const id = el.id || `section-${i}`;
      if (!el.id) el.id = id;
      return {
        id,
        text: el.textContent?.trim() || `Section ${i + 1}`,
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });
  }, []);

  useEffect(() => {
    const run = () => {
      setTocItems(extractHeadings());
      if (!readingTimeMinutes) {
        setReadingTime(estimateReadingTime(contentRef.current));
      }
    };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [children, extractHeadings, readingTimeMinutes]);

  /* ── TOC scroll observer ── */
  useEffect(() => {
    if (!tocItems.length) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) =>
          b.boundingClientRect.top < a.boundingClientRect.top ? b : a
        );
        setActiveId(top.target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.25, 0.75, 1] }
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [tocItems]);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Lang tag */}
      <Helmet>
        <html lang={resolvedPageLanguage} />
        {/* Override og:type to 'article' for content pages */}
        <meta property="og:type" content="article" />
        {datePublished && (
          <meta property="article:published_time" content={datePublished} />
        )}
        {dateUpdated && (
          <meta property="article:modified_time" content={dateUpdated} />
        )}
        <meta property="article:author" content={authorName} />
      </Helmet>

      <SEO
        title={resolvedSeoTitle}
        description={resolvedDescription}
        canonical={canonicalUrl}
        url={canonicalUrl}
        locale={resolvedPageLanguage}
        alternateLanguages={resolvedAlternateLanguages}
        structuredData={combinedStructuredData}
        noindex={shouldNoindex}
      />

      <HeaderPublic showBreadcrumbTrail={false} />

      <main id="main-content">
        {/* Hero */}
        <SEOPageHero
          title={heroTitle}
          breadcrumbItems={resolvedBreadcrumbItems}
          dateUpdated={dateUpdated}
          description={heroDescription}
        />

        {/* Content grid */}
        <section className="container mx-auto max-w-full p-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_300px]">

            {/* ── Article body ── */}
            <article ref={contentRef} className="min-w-0" itemScope itemType="https://schema.org/Article">
              {/* Machine-readable meta for schema.org */}
              <meta itemProp="headline" content={pageTitle} />
              <meta itemProp="description" content={resolvedDescription} />
              {datePublished && <meta itemProp="datePublished" content={datePublished} />}
              {dateUpdated && <meta itemProp="dateModified" content={dateUpdated} />}
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <meta itemProp="name" content={authorName} />
                {authorUrl && <meta itemProp="url" content={authorUrl} />}
              </span>

              {/* Meta bar: reading time, date, share */}
              <ArticleMetaBar
                readingTime={readingTime}
                dateUpdated={dateUpdated}
                datePublished={datePublished}
                authorName={authorName}
                currentUrl={canonicalUrl}
              />

              {/* Key takeaways */}
              <KeyTakeaways takeaways={normalizedTakeaways} />

              {/* Body content */}
              <div className="prose prose-slate max-w-none" itemProp="articleBody">
                {children}
              </div>

              {/* Inline CTA — placed after the main content */}
              <InlineCTA />

              {/* FAQ section (rendered for users; JSON-LD handles SEO) */}
              {faqData && faqData.length > 0 && (
                <section className="mt-14" aria-label="Frequently asked questions">
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Frequently asked questions
                  </h2>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                    {faqData.map((item, idx) => (
                      <details
                        key={idx}
                        className="group px-6 py-5 cursor-pointer"
                        itemScope
                        itemType="https://schema.org/Question"
                      >
                        <summary
                          className="flex items-center justify-between gap-4 font-semibold text-slate-900 list-none marker:hidden"
                          itemProp="name"
                        >
                          {item.question}
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90"
                            aria-hidden="true"
                          />
                        </summary>
                        <div
                          className="mt-3 text-slate-600 leading-relaxed"
                          itemScope
                          itemType="https://schema.org/Answer"
                          itemProp="acceptedAnswer"
                        >
                          <span itemProp="text">{item.answer}</span>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Previous / Next navigation */}
              {(previousArticle || nextArticle) && (
                <nav
                  className="mt-20 border-t border-slate-200 pt-10"
                  aria-label="Article navigation"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {previousArticle ? (
                      <Link
                        to={previousArticle.href}
                        rel="prev"
                        className="group flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
                      >
                        <ChevronLeft
                          className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">Previous</p>
                          <p className="font-medium text-slate-900 group-hover:text-blue-600">
                            {previousArticle.title}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div />
                    )}

                    {nextArticle && (
                      <Link
                        to={nextArticle.href}
                        rel="next"
                        className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">Next</p>
                          <p className="font-medium text-slate-900 group-hover:text-blue-600">
                            {nextArticle.title}
                          </p>
                        </div>
                        <ChevronRight
                          className="mt-1 h-5 w-5 text-slate-400 group-hover:text-blue-600"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </article>

            {/* ── Sidebar TOC ── */}
            <aside className="sticky top-24 hidden h-fit lg:block" aria-label="Table of contents">
              {tocItems.length > 0 ? (
                <TableOfContents items={tocItems} activeId={activeId} />
              ) : (
                /* Skeleton while headings are being extracted */
                <div className="space-y-3 rounded-xl bg-slate-50 p-5">
                  {[70, 55, 80, 45, 65].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 animate-pulse rounded bg-slate-200"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* Related articles */}
        <RelatedArticlesSection currentPath={location.pathname} />

        {/* Topic cluster hub links */}
        {currentHub && (
          <TopicClusterSection currentHub={currentHub} currentPath={location.pathname} />
        )}
      </main>

      <FooterLanding />
    </div>
  );
});

SEOPageLayout.displayName = 'SEOPageLayout';

export default SEOPageLayout;