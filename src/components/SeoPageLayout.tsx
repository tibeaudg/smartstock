import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './HeaderPublic';
import Footer from './Footer';
import { getBreadcrumbPath, getAllSeoPages, getRelatedPages } from '@/config/topicClusters';
import { detectPageLanguage } from '@/utils/seoPageHelpers';
import { getStableRelatedArticles } from '@/utils/linkAlgo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  Package, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  Zap
} from 'lucide-react';

// --- Interfaces (Preserved) ---
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
  authorName?: string;
  children: React.ReactNode;
  hideVisualBreadcrumbs?: boolean;
  faqData?: FAQItem[];
  heroTitle?: string;
  updatedDate?: string;
}

// --- Static Data (Preserved) ---
const features = [
  {
    icon: TrendingUp,
    title: "Real-time Tracking",
    description: "Live inventory visibility across all warehouses.",
  },
  {
    icon: BarChart3,
    title: "Smart Scanning",
    description: "QR & Barcode integration for instant accuracy.",
  },
  {
    icon: Package,
    title: "Auto-Reordering",
    description: "Never stock out with predictive replenishment.",
  },
];

const testimonials = [
  {
    name: "David Chen",
    role: "CEO · TechStart Solutions",
    content: "We retired spreadsheets and cut out-of-stock incidents by 38% in the first quarter.",
    rating: 5,
    highlight: "38% fewer stockouts"
  },
  {
    name: "Sarah Johnson",
    role: "Ops Manager · Retail Plus",
    content: "We handle 12 sales channels. StockFlow synced Shopify and Amazon instantly.",
    rating: 5,
    highlight: "18 hours saved weekly"
  },
  {
    name: "Mike Rodriguez",
    role: "Warehouse Lead · Global Supply",
    content: "Barcode scanning on mobile and predictive reordering kept our fulfillment at 99.2%.",
    rating: 5,
    highlight: "99.2% on-time fulfilment"
  }
];

// Default images for article cards
const defaultArticleImages = [
  '/aza.png', // First default image
  '/bzb.png', // Second default image  
  '/czc.png', // Third default image
];

// Hardcoded hero badges and CTAs
const defaultHeroBadges: HeroBadge[] = [
  { text: "10,000+ teams benchmarked" },
  { text: "Updated for 2025 pricing" }
];

const defaultHeroCTAs: HeroCTA[] = [
  { label: "Start Free", href: "/auth", variant: "primary" },
  { label: "Watch Demo", href: "/demo", variant: "secondary" }
];

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({
  title,
  description,
  publishDate,
  authorName = "StockFlow Team",
  children,
  hideVisualBreadcrumbs = false,
  faqData = [],
  heroTitle,
  updatedDate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageLanguage = detectPageLanguage(location.pathname);

  // --- Logic & Data Fetching (Preserved) ---
  const breadcrumbItems = useMemo(() => getBreadcrumbPath(location.pathname), [location.pathname]);
  const clusterArticles = useMemo(() => getRelatedPages(location.pathname), [location.pathname]);
  
  const allAvailableArticles = useMemo(() => {
    if (clusterArticles.length > 0) return clusterArticles;
    const allPages = getAllSeoPages();
    return allPages.filter(page => page.path !== location.pathname);
  }, [clusterArticles, location.pathname]);
  
  const recentArticles = useMemo(() => 
    getStableRelatedArticles(allAvailableArticles, location.pathname, 3), 
  [allAvailableArticles, location.pathname]);

  // --- JSON-LD (Preserved) ---
  const jsonLd = {
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
        "author": { "@type": "Person", "name": authorName },
        "datePublished": publishDate,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.stockflow.be${location.pathname}`
        }
      },
      ...(faqData.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900" lang={pageLanguage}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.stockflow.be${location.pathname}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header
        onLoginClick={() => navigate('/auth')}
        onNavigate={() => {}}
        hideAuthButtons={false}
        hideNotifications
      />

      {/* --- UX IMPROVEMENT: Subtle Background for Header/Breadcrumb integration --- */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        {!hideVisualBreadcrumbs && breadcrumbItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-500">
              {breadcrumbItems.map((item, i) => (
                <React.Fragment key={`${item.path}-${i}`}>
                  {i > 0 && <span className="text-slate-300 mx-1">/</span>}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="text-slate-900 font-medium px-2 py-1 rounded-md bg-white shadow-sm border border-slate-100">
                      {item.name}
                    </span>
                  ) : (
                    <Link to={item.path} className="hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}

        {/* --- UX IMPROVEMENT: Modern Hero with Constrained Width for Readability --- */}
        {(heroTitle || updatedDate) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-8">
            {defaultHeroBadges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {defaultHeroBadges.map((badge, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase border border-blue-100">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
              {heroTitle || title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-8">
               {updatedDate && (
                <span><strong>Updated on:</strong> {updatedDate}</span>
               )}
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span><strong>Author:</strong> {authorName}</span>
            </div>

            {defaultHeroCTAs.length > 0 && (
              <div className="flex justify-center gap-4">
                {defaultHeroCTAs.map((cta, i) => (
                   <a key={i} href={cta.href} className={`px-6 py-3 rounded-lg font-semibold transition-all ${cta.variant === 'secondary' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}>
                     {cta.label}
                   </a>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* --- UX IMPROVEMENT: Trust Strip (Moved Up) --- */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
          {[
            { val: "35%", label: "Cost Reduction", icon: TrendingUp, color: "text-blue-600" },
            { val: "15h", label: "Weekly Saved", icon: Clock, color: "text-green-600" },
            { val: "99.9%", label: "Accuracy", icon: ShieldCheck, color: "text-purple-600" },
            { val: "24/7", label: "Expert Support", icon: Zap, color: "text-orange-600" }
          ].map((stat, i) => (
            <div key={i} className={`text-center ${i % 2 !== 0 ? 'hidden md:block' : ''}`}>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} flex items-center justify-center gap-2 mb-1`}>
                {stat.val}
              </div>
              <div className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
          {/* Mobile view adjustment: show only 2 stats or use a slider if needed. Here we hide 2 on mobile to save space */}
        </div>
      </div>

      <main>
        {/* --- Article Content: Tighter Width for Cognitive Ease --- */}
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

        {/* --- FAQ: Narrow Width for Readability --- */}
        {faqData && faqData.length > 0 && (
          <section className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">
                {pageLanguage === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={`faq-${index}`}
                    value={`item-${index}`} 
                    className="bg-white rounded-lg border border-slate-200 px-2"
                  >
                    <AccordionTrigger className="px-4 py-4 text-lg font-medium text-slate-900 hover:text-blue-600 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}




        {/* --- Testimonials: Clean Grid --- */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Trusted by Growth Teams</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                  {t.highlight && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  )}
                  <div className="flex mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 flex-grow italic leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* --- Recent Articles: Horizontal Scroll on Mobile, Grid on Desktop --- */}
        {recentArticles && recentArticles.length > 0 && (
          <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  {pageLanguage === 'nl' ? 'Verder lezen' : 'Continue Reading'}
                </h2>
                <Link to="/blog" className="text-blue-600 font-medium flex items-center hover:gap-2 transition-all text-sm">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentArticles.map((article, index) => {
                  // Priority: defaultArticleImages > article.image > gradient fallback
                  const imageUrl = defaultArticleImages[index] || article.image;
                  
                  return (
                  <Link 
                    key={article.path} 
                    to={article.path}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                  >
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                       {imageUrl ? (
                         <img 
                           src={imageUrl} 
                           alt={article.title}
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           loading="lazy"
                         />
                       ) : (
                         <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 group-hover:scale-105 transition-transform duration-500" />
                       )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">Article</p>
                      <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                        {article.description}
                      </p>
                      <span className="text-sm font-medium text-slate-900 flex items-center">
                        Read now <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </span>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* --- CTA: High Contrast, Clean --- */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              {pageLanguage === 'nl' ? 'Klaar voor de volgende stap?' : 'Stop Managing, Start Growing.'}
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join the inventory revolution with the platform engineered for accuracy and speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
                {pageLanguage === 'nl' ? 'Start Gratis' : 'Start Free Trial'}
              </button>
              <a href="/demo" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-blue-400 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                 Watch Demo 
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200 opacity-80">No credit card required • 14-day free trial</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SeoPageLayout;