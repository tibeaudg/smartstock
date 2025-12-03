import React, { useMemo, memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './HeaderPublic';
import Footer from './Footer';
import { getBreadcrumbPath, getAllSeoPages, getRelatedPages } from '@/config/topicClusters';
import { detectPageLanguage } from '@/utils/seoPageHelpers';
import { getStableRelatedArticles } from '@/utils/linkAlgo';
import { 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// --- Interfaces ---
export interface FAQItem {
  question: string;
  answer: string;
}

interface HeroBadge {
  text: string;
}

interface HeroCTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface SeoPageLayoutProps {
  title: string;
  description?: string;
  publishDate?: string;
  children: React.ReactNode;
  hideVisualBreadcrumbs?: boolean;
  faqData?: FAQItem[];
  heroTitle?: string;
  updatedDate?: string;
  maxRelatedArticles?: number;
}

// --- Static Data ---
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

const defaultArticleImages = [
  '/aza.png',
  '/bzb.png',
  '/czc.png',
] as const;








// --- Memoized Sub-Components ---
const BreadcrumbNav = memo<{ items: Array<{ name: string; path: string }> }>(({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-500 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={`${item.path}-${i}`}>
          {i > 0 && <span className="text-slate-300 mx-1" aria-hidden="true">/</span>}
          {i === items.length - 1 ? (
            <span className="text-slate-900 font-medium px-2 py-1 rounded-md bg-white shadow-sm border border-slate-100" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link 
              to={item.path} 
              className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
            >
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
});
BreadcrumbNav.displayName = 'BreadcrumbNav';

const HeroSection = memo<{
  heroTitle?: string;
  title: string;
  updatedDate?: string;
}>(({ heroTitle, title, updatedDate }) => {
  if (!heroTitle && !updatedDate) return null;

  return (
    <section className="max-w-full rounded-b-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-8" aria-labelledby="hero-title">

      
      <h1 id="hero-title" className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
        {heroTitle || title}
      </h1>

      <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-8 flex-wrap">
        {updatedDate && (
          <time dateTime={updatedDate}>
            <strong>Updated on:</strong> {updatedDate}
          </time>
        )}
        {updatedDate && <span className="w-1 h-1 bg-slate-300 rounded-full" aria-hidden="true"></span>}
      </div>


    </section>
  );
});
HeroSection.displayName = 'HeroSection';








const SingleFAQItem = memo<{ 
  faq: FAQItem; 
  id: string;
}>(({ faq, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors hover:bg-slate-50"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${id}`}
      >
        <h3 className="text-lg font-bold text-slate-900 pr-4 flex-1">
          {faq.question}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`faq-answer-${id}`}
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 pt-0">
          <p className="text-base text-slate-800 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
});
SingleFAQItem.displayName = 'SingleFAQItem';

const FAQSection = memo<{ faqData: FAQItem[]; pageLanguage: 'nl' | 'en' }>(({ faqData, pageLanguage }) => {
  if (!faqData || faqData.length === 0) return null;

  const heading = pageLanguage === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions';
  
  // Split FAQs into two columns
  const midPoint = Math.ceil(faqData.length / 2);
  const leftColumn = faqData.slice(0, midPoint);
  const rightColumn = faqData.slice(midPoint);

  return (
    <section className="py-24 bg-white border-t border-slate-300" aria-labelledby="faq-heading">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-16 text-center text-black">
          {heading}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((faq, index) => (
              <SingleFAQItem 
                key={`faq-left-${index}`} 
                faq={faq} 
                id={`left-${index}`}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((faq, index) => (
              <SingleFAQItem 
                key={`faq-right-${index}`} 
                faq={faq} 
                id={`right-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
FAQSection.displayName = 'FAQSection';








const TestimonialsSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-slate-50 relative overflow-hidden" 
      aria-labelledby="testimonials-heading"
    >
      <style>{`
        @keyframes starPop {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(360deg);
          }
        }
      `}</style>



      {/* Testimonials Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 
          id="testimonials-heading" 
          className={`text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          What Our Customers Say
        </h2>

        {/* Testimonial Carousel */}
        <div className="relative flex items-center justify-center min-h-[400px]">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 z-10 p-3 rounded-full bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>

          {/* Testimonial Card */}
          <article 
            key={currentIndex}
            className={`flex flex-col items-center text-center px-8 md:px-16 py-12 transition-all duration-500 ${
              isVisible 
                ? isAnimating 
                  ? 'opacity-0 translate-x-4 scale-95' 
                  : 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-y-4'
            }`}
            role="article"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Rating Stars */}
            <div 
              className="flex items-center justify-center gap-1 mb-6 -mt-12" 
              aria-label="5 out of 5 stars"
            >
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  style={{
                    animation: isVisible && !isAnimating ? 'starPop 0.6s ease-out forwards' : 'none',
                    animationDelay: isVisible && !isAnimating ? `${i * 100}ms` : '0ms',
                    opacity: isVisible && !isAnimating ? 1 : 0
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote 
              className={`text-xl md:text-2xl font-medium text-slate-900 mb-8 leading-relaxed max-w-2xl transition-all duration-500 ${
                isVisible && !isAnimating
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: isVisible && !isAnimating ? '300ms' : '0ms'
              }}
            >
              "{currentTestimonial.content}"
            </blockquote>

            {/* Avatar */}
            <div 
              className={`w-20 h-20 rounded-full ${currentTestimonial.avatarColor} flex items-center justify-center font-bold text-white text-2xl mb-4 border-4 border-blue-600 transition-all duration-500 hover:scale-110 hover:rotate-6 ${
                isVisible && !isAnimating
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-0'
              }`}
              style={{
                transitionDelay: isVisible && !isAnimating ? '400ms' : '0ms'
              }}
              aria-hidden="true"
            >
              {currentTestimonial.name.charAt(0)}
            </div>

            {/* Name */}
            <p 
              className={`text-lg font-semibold text-slate-900 mb-1 transition-all duration-500 ${
                isVisible && !isAnimating
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2'
              }`}
              style={{
                transitionDelay: isVisible && !isAnimating ? '500ms' : '0ms'
              }}
            >
              {currentTestimonial.name}
            </p>

            {/* Role */}
            <p 
              className={`text-sm text-slate-600 transition-all duration-500 ${
                isVisible && !isAnimating
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2'
              }`}
              style={{
                transitionDelay: isVisible && !isAnimating ? '600ms' : '0ms'
              }}
            >
              {currentTestimonial.role}
            </p>
          </article>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-0 z-10 p-3 rounded-full bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div 
          className={`flex justify-center gap-2 mt-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? '700ms' : '0ms'
          }}
          role="tablist" 
          aria-label="Testimonial navigation"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8 scale-110' 
                  : 'bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
});
TestimonialsSection.displayName = 'TestimonialsSection';



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


const CTASection = memo<{ pageLanguage: 'nl' | 'en' }>(({ pageLanguage }) => {
  const heading = pageLanguage === 'nl' ? 'Klaar voor de volgende stap?' : 'Ready to Simplify Your Stock Management?';
  const ctaText = pageLanguage === 'nl' ? 'Start Gratis' : 'Start Free Trial';

  return (
    <section className="py-24 bg-blue-700 relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" aria-hidden="true"></div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 id="cta-heading" className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {heading}
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          Join the inventory revolution with the platform engineered for accuracy and speed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" role="group" aria-label="Call to action buttons">
          <button 
            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
            onClick={() => window.location.href = '/auth'}
          >
            {ctaText}
          </button>
          <a 
            href="/demo" 
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-blue-400 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-500"
          >
            Watch Demo
          </a>
        </div>
        <p className="mt-6 text-sm text-blue-200 opacity-80">No credit card required • 14-day free trial</p>
      </div>
    </section>
  );
});
CTASection.displayName = 'CTASection';

// --- Helper function to normalize canonical URL ---
const normalizeCanonicalUrl = (pathname: string): string => {
  // Remove trailing slashes (except for root)
  let normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  // Ensure it starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  // Construct absolute URL
  return `https://www.stockflow.be${normalized}`;
};

// --- Main Component ---
const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({
  title,
  description,
  publishDate,
  children,
  hideVisualBreadcrumbs = false,
  faqData = [],
  heroTitle,
  updatedDate,
  maxRelatedArticles,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageLanguage = detectPageLanguage(location.pathname);

  // --- Memoized Data ---
  const breadcrumbItems = useMemo(() => getBreadcrumbPath(location.pathname), [location.pathname]);
  const clusterArticles = useMemo(() => getRelatedPages(location.pathname), [location.pathname]);
  
  const allAvailableArticles = useMemo(() => {
    if (clusterArticles.length > 0) return clusterArticles;
    const allPages = getAllSeoPages();
    return allPages.filter(page => page.path !== location.pathname);
  }, [clusterArticles, location.pathname]);
  
  const recentArticles = useMemo(() => 
    getStableRelatedArticles(allAvailableArticles, location.pathname, 30), 
  [allAvailableArticles, location.pathname]);

  // Normalize canonical URL (remove trailing slashes, ensure consistency)
  const canonicalUrl = useMemo(() => normalizeCanonicalUrl(location.pathname), [location.pathname]);

  // --- Memoized JSON-LD ---
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `https://www.stockflow.be${item.path}`
        }))
      },
      {
        "@type": "Article",
        "headline": title,
        "description": description,
        "datePublished": publishDate,
        "dateModified": updatedDate || publishDate,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      }
      // FAQPage is handled by individual pages via StructuredData component to avoid duplication
    ]
  }), [breadcrumbItems, title, description, publishDate, updatedDate, canonicalUrl]);

  const handleLoginClick = useMemo(() => () => navigate('/auth'), [navigate]);









  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900" lang={pageLanguage}>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header
        onLoginClick={handleLoginClick}
        onNavigate={() => {}}
        hideAuthButtons={false}
        hideNotifications
      />

      <div className="bg-slate-50/80 border-b border-slate-100">
        {!hideVisualBreadcrumbs && breadcrumbItems.length > 0 && (
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        )}

        <HeroSection 
          heroTitle={heroTitle}
          title={title}
          updatedDate={updatedDate}
        />
      </div>


      <main>
        <article className="relative pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-strong:text-slate-900
              leading-relaxed">
              {children}
            </div>
          </div>
        </article>



        

        <FAQSection faqData={faqData} pageLanguage={pageLanguage} />

        <TestimonialsSection />

        <RecentArticlesSection articles={recentArticles} pageLanguage={pageLanguage} maxArticles={maxRelatedArticles} />

        <CTASection pageLanguage={pageLanguage} />
      </main>

      <Footer />
    </div>
  );
};

export default memo(SeoPageLayout);
