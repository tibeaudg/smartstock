import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';

import HeaderPublic from '@/components/HeaderPublic';
import FooterLanding from './Footer';
import { TableOfContents } from './TableOfContents';
import { KeyTakeaways } from './KeyTakeaways';
import { SEOPageHero } from './SeoPageHero';

// Constants
const SCROLL_OFFSET = 120;
const TOC_TOP = 112;

const testimonials = [
  {
    name: "David Chen",
    role: "CEO · TechStart Solutions",
    content: "We retired spreadsheets and cut out-of-stock incidents by 38% in the first quarter. StockFlow's real-time tracking transformed our operations.",
    avatarColor: "bg-blue-400"
  },
  {
    name: "Sarah Johnson",
    role: "Operations Manager · Retail Plus",
    content: "We handle 12 sales channels. StockFlow synced Shopify and Amazon instantly, saving us 18 hours weekly on inventory management.",
    avatarColor: "bg-orange-400"
  },
  {
    name: "Mike Rodriguez",
    role: "Warehouse Lead · Global Supply",
    content: "Barcode scanning on mobile and predictive reordering kept our fulfillment at 99.2%. StockFlow is the backbone of our warehouse operations.",
    avatarColor: "bg-pink-400"
  },
  {
    name: "Emma Thompson",
    role: "Inventory Director · Fashion Forward",
    content: "Multi-location sync across our 8 stores eliminated overselling completely. StockFlow's accuracy is unmatched in the industry.",
    avatarColor: "bg-cyan-400"
  },
  {
    name: "James Wilson",
    role: "Supply Chain Manager · Manufacturing Co",
    content: "Raw material tracking and BOM management streamlined our production. StockFlow's traceability features are essential for quality control.",
    avatarColor: "bg-green-400"
  },
  {
    name: "Lisa Anderson",
    role: "E-commerce Director · Online Retailer",
    content: "Marketplace integration with Amazon, Shopify, and eBay prevents shipping errors. StockFlow protects our seller ratings perfectly.",
    avatarColor: "bg-purple-400"
  },
  {
    name: "Robert Kim",
    role: "Field Service Manager · Tech Services",
    content: "Offline mobile scanning for van stock transformed our field operations. Technicians can work anywhere, and billing is now 100% accurate.",
    avatarColor: "bg-amber-600"
  },
  {
    name: "Maria Garcia",
    role: "Pharmacy Operations · HealthCare Plus",
    content: "Expiration date tracking and lot number management ensure compliance. StockFlow reduced medication waste by 25% in our facility.",
    avatarColor: "bg-indigo-600"
  }
] as const;
const defaultArticleImages: string[] = [];

// Types
type TocMode = 'before' | 'fixed' | 'after';

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

const RecentArticlesSection = memo<{
  articles: Array<{ path: string; title: string; description?: string; image?: string }>;
  pageLanguage: 'nl' | 'en';
  maxArticles?: number;
}>(({ articles, pageLanguage, maxArticles }) => {
  if (!articles || articles.length === 0) return null;

  const heading = pageLanguage === 'nl' ? 'Verder lezen' : 'Continue Reading';
  const displayedArticles = articles.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50" aria-labelledby="articles-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <h2 id="articles-heading" className="text-2xl font-bold text-slate-900">
            {heading}
          </h2>
          <Link 
            to="" 
            className="text-blue-600 font-medium flex items-center hover:gap-2 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            View all <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label="Related articles">
          {displayedArticles.map((article, index) => {
            const imageUrl = defaultArticleImages[index % defaultArticleImages.length] || article.image;
            
            return (
              <Link 
                key={article.path} 
                to={article.path}
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="listitem"
              >
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 group-hover:scale-105 transition-transform duration-500" aria-hidden="true" />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">Article</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                      {article.description}
                    </p>
                  )}
                  <span className="text-sm font-medium text-slate-900 flex items-center">
                    Read now <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});
RecentArticlesSection.displayName = 'RecentArticlesSection';

const TestimonialsSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];
  const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className={`text-4xl font-bold text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          What Our Customers Say
        </h2>
        <div className="relative flex items-center justify-center min-h-[400px]">
          <button onClick={goToPrevious} className="absolute left-0 z-10 p-3 rounded-full bg-white shadow-lg"><ChevronLeft /></button>
          
          <article className={`flex flex-col items-center text-center transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium mb-8">"{currentTestimonial.content}"</blockquote>
            <div className={`w-20 h-20 rounded-full ${currentTestimonial.avatarColor} flex items-center justify-center text-white font-bold text-2xl mb-4`}>
              {currentTestimonial.name.charAt(0)}
            </div>
            <p className="font-semibold">{currentTestimonial.name}</p>
            <p className="text-slate-600">{currentTestimonial.role}</p>
          </article>

          <button onClick={goToNext} className="absolute right-0 z-10 p-3 rounded-full bg-white shadow-lg"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
});
TestimonialsSection.displayName = 'TestimonialsSection';

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
  const layoutRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [tocMode, setTocMode] = useState<TocMode>('before');
  const [tocOffset, setTocOffset] = useState(0);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Extract TOC items from headings
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('h2');
    const items: TOCItem[] = Array.from(headings).map((h, i) => {
      const element = h as HTMLElement;
      const id = element.id || `${element.textContent?.toLowerCase().replace(/\s+/g, '-')}-${i}`;
      element.id = id;
      return { id, text: element.textContent || '', level: element.tagName === 'H2' ? 2 : 3 };
    });
    setTocItems(items);
  }, [children]);

  // Track active heading based on scroll position
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting entry or the last one that passed
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Use the first visible heading
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observerOptions = {
      rootMargin: `-${SCROLL_OFFSET}px 0px -66% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all headings
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3');
      headings.forEach((heading) => observer.observe(heading));
    }

    return () => observer.disconnect();
  }, [tocItems]);

  // Update TOC position (sticky behavior)
  const updateTocPosition = useCallback(() => {
    if (!layoutRef.current || !tocRef.current) return;
    const layoutRect = layoutRef.current.getBoundingClientRect();
    const layoutTop = layoutRect.top + window.scrollY;
    const layoutHeight = layoutRef.current.offsetHeight;
    const layoutBottom = layoutTop + layoutHeight;
    const tocHeight = tocRef.current.offsetHeight;
    const scrollTop = window.scrollY;
    
    if (scrollTop + TOC_TOP < layoutTop) {
      setTocMode('before');
      setTocOffset(0);
    } else if (scrollTop + TOC_TOP + tocHeight >= layoutBottom) {
      setTocMode('after');
      setTocOffset(layoutHeight - tocHeight);
    } else {
      setTocMode('fixed');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateTocPosition);
    updateTocPosition(); // Initial call
    return () => window.removeEventListener('scroll', updateTocPosition);
  }, [updateTocPosition]);

  return (
    <div className="bg-white min-h-screen">
      <HeaderPublic />
      <main>
        <SEOPageHero title={title} breadcrumbItems={breadcrumbItems} dateUpdated={dateUpdated} description={heroDescription} />
        <section ref={layoutRef} className="container mx-auto px-4 py-12 relative mb-36">
          <div className="lg:grid lg:grid-cols-[1fr_320px] gap-16">
            <article>
              {keyTakeaways.length > 0 && <KeyTakeaways items={keyTakeaways} />}
              <div ref={contentRef} className="prose prose-lg max-w-none">{children}</div>
            </article>
            <aside className="hidden lg:block relative">
              <nav 
                ref={tocRef} 
                className="w-72" 
                style={tocMode === 'fixed' ? { position: 'fixed', top: TOC_TOP } : { position: 'absolute', top: tocOffset }}
              >
                <TableOfContents items={tocItems} activeId={activeId} onItemClick={(id) => {
                   const el = document.getElementById(id);
                   if (el) window.scrollTo({ top: el.offsetTop - SCROLL_OFFSET, behavior: 'smooth' });
                }} />
              </nav>
            </aside>
          </div>
        </section>
        <TestimonialsSection />
        <RecentArticlesSection articles={recentArticles} pageLanguage={pageLanguage} />
      </main>
      <FooterLanding />
    </div>
  );
});
SEOPageLayout.displayName = 'SEOPageLayout';

export default SEOPageLayout;