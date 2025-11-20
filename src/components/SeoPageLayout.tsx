import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Assumed you have this installed. If not, install it.
import Header from './HeaderPublic';
import Footer from './Footer';
import { BreadcrumbNav } from './seo/BreadcrumbNav'; // Keep purely for visual if needed
import { getBreadcrumbPath, TopicCluster } from '@/config/topicClusters'; 
import { detectPageLanguage } from '@/utils/seoPageHelpers';
import { getStableRelatedArticles } from '@/utils/linkAlgo';
import { getRelatedPages } from '@/config/topicClusters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface SeoPageLayoutProps {
  title: string;
  description?: string;
  publishDate?: string;
  authorName?: string;
  children: React.ReactNode;
  hideVisualBreadcrumbs?: boolean; // Option to hide UI but keep Schema
  faqData?: FAQItem[]; // Optional FAQ data
}

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({
  title,
  description,
  publishDate,
  authorName = "Company Name", // Default author
  children,
  hideVisualBreadcrumbs = false,
  faqData = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageLanguage = detectPageLanguage(location.pathname);

  // 1. Data Fetching & Processing
  const breadcrumbItems = useMemo(() => getBreadcrumbPath(location.pathname), [location.pathname]);
  
  // Fetch all potential articles from the cluster to shuffle them
  const clusterArticles = getRelatedPages(location.pathname); 
  console.log(clusterArticles);
  // 2. Deterministic Link Selection (The "Cards")
  // Get 4 articles for Popular section (1 large + 3 small)
  const popularArticles = useMemo(() => 
    getStableRelatedArticles(clusterArticles, location.pathname, 4), 
  [clusterArticles, location.pathname]);
  
  // Get 3 articles for Recent Articles section (shuffled per page)
  const recentArticles = useMemo(() => 
    getStableRelatedArticles(clusterArticles, location.pathname, 3), 
  [clusterArticles, location.pathname]);

  // 3. JSON-LD Construction (Technical SEO)
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
        "author": {
          "@type": "Person",
          "name": authorName
        },
        "datePublished": publishDate,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.stockflow.be${location.pathname}`
        }
      },
      // Add FAQPage schema if FAQ data exists
      ...(faqData.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900" lang={pageLanguage}>
      {/* Dynamic Head Management */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} className="text-sm" />
        <link rel="canonical" href={`https://www.stockflow.be${location.pathname}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header
        onLoginClick={() => navigate('/auth')}
        onNavigate={() => {}}
        hideAuthButtons={false}
        hideNotifications
      />



      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto" role="main">
        
        {/* Minimalist Breadcrumbs - Optional UI, Mandatory Data */}
        {!hideVisualBreadcrumbs && breadcrumbItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
               {breadcrumbItems.map((item, i) => (
                 <span key={item.path}>
                   <Link to={item.path} className="hover:underline">{item.name}</Link>
                   {i < breadcrumbItems.length - 1 && <span className="mx-2">/</span>}
                 </span>
               ))}
            </nav>
          </div>
        )}

        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Prose Wrapper: 
             Using Tailwind 'prose' (typography plugin) is essential for SEO readability signals.
             It handles headers, p-tags, list spacing automatically.
          */}
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-8">
            {children}
          </div>
        </article>

        {/* Popular Articles Section */}
        {popularArticles.length > 0 && (
          <section aria-labelledby="popular-heading" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="popular-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                {pageLanguage === 'nl' ? 'Populaire Artikelen' : 'Popular Articles'}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Large Article */}
                {popularArticles[0] && (
                  <Link 
                    to={popularArticles[0].path}
                    className="lg:col-span-2 group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-blue-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white/80 text-sm mb-2">October 23, 2023</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                          {popularArticles[0].title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <p className="text-gray-600 leading-relaxed line-clamp-4">
                        {popularArticles[0].description || "Optimal strategies for achieving profitable results involve a comprehensive approach to management, selection of appropriate methods, and implementation of efficient practices."}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Smaller Stacked Articles */}
                <div className="flex flex-col gap-6">
                  {popularArticles.slice(1, 4).map((article) => (
                    <Link 
                      key={article.path} 
                      to={article.path}
                      className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                    >
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-blue-200"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">October 23, 2023</p>
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}


        {/* FAQ Section - Integrated into layout */}
        {faqData.length > 0 && (
          <section id="faq" className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {pageLanguage === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
                </h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <AccordionTrigger className="flex items-center justify-between px-6 py-5 text-left text-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                      <span className="pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}









        {/* Call-to-Action Section */}
        <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/seohero.png)'
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* CTA Content */}
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {pageLanguage === 'nl' ? 'Doe mee met de voorraadrevolutie' : 'Get involved in the inventory revolution'}
            </h2>
            <div className="flex justify-center sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                {pageLanguage === 'nl' ? 'Nu deelnemen' : 'Join Now'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>







        {/* Our Recent Articles Section - At the bottom before Footer */}
        {recentArticles.length > 0 && (
          <section aria-labelledby="recent-heading" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header with Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
                <div>
                  <h2 id="recent-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {pageLanguage === 'nl' ? 'Onze Recente Artikelen' : 'Our Recent Articles'}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {pageLanguage === 'nl' ? 'Blijf op de hoogte met onze laatste inzichten' : 'Stay Informed with Our Latest Insights'}
                  </p>
                </div>
                {/* Navigation Arrows */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button 
                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors"
                    aria-label="Previous articles"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors"
                    aria-label="Next articles"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Article Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map((article) => (
                  <Link 
                    key={article.path} 
                    to={article.path}
                    className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                  >
                    {/* Article Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-blue-100 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-blue-200"></div>
                    </div>
                    
                    {/* Article Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Author and Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-orange-600">
                          {authorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {publishDate ? new Date(publishDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '20 Apr 2024'}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3 flex-1 mb-4">
                        {article.description || "In the realm of modern business operations, a comprehensive system serves as more than just a tool..."}
                      </p>
                      
                      {/* Read More Link */}
                      <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                        <span>{pageLanguage === 'nl' ? 'Lees meer' : 'Read More'}</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link> 
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SeoPageLayout;