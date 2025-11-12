import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function WhatIsLeadTime() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is lead time?",
      answer: "Lead time is the period between when an order is placed and when it is received or completed. In inventory management, lead time typically refers to the time it takes from placing a purchase order with a supplier until the goods arrive and are available for use. Understanding lead time is crucial for inventory planning and preventing stockouts."
    },
    {
      question: "Why is lead time important in inventory management?",
      answer: "Lead time is important because it determines when you need to reorder inventory to avoid stockouts. If you know your lead time is 14 days, you need to place orders 14 days before you expect to run out. Accurate lead time information helps businesses set appropriate reorder points and maintain optimal inventory levels."
    },
    {
      question: "How do you calculate lead time?",
      answer: "Lead time is calculated by measuring the time from order placement to receipt. For inventory management, lead time = Order Date + Supplier Processing Time + Shipping Time + Receiving Time. Inventory management software like StockFlow tracks lead times automatically based on historical order data."
    },
    {
      question: "What factors affect lead time?",
      answer: "Factors affecting lead time include: supplier processing time, manufacturing time (for custom orders), shipping method and distance, customs clearance (for international orders), seasonality and demand fluctuations, supplier reliability, and order quantity. Inventory management software helps track and account for these factors."
    },
    {
      question: "How can inventory management software help with lead time?",
      answer: "Inventory management software like StockFlow helps with lead time by tracking historical lead times, calculating average lead times, setting reorder points based on lead times, providing alerts when lead times change, and helping optimize inventory levels to account for lead time variations."
    },
    {
      question: "What is the difference between lead time and cycle time?",
      answer: "Lead time is the total time from order placement to receipt, including all waiting and processing time. Cycle time is the active time spent processing or manufacturing an item. Lead time includes cycle time plus waiting periods, shipping, and other delays."
    }
  ];

  const concepts = [
    {
      icon: Clock,
      title: "Order Lead Time",
      description: "Time from placing an order until it's received, including processing and shipping."
    },
    {
      icon: Calendar,
      title: "Production Lead Time",
      description: "Time required to manufacture or produce goods before they're available for sale."
    },
    {
      icon: TrendingUp,
      title: "Replenishment Lead Time",
      description: "Time needed to restock inventory from the point of reorder to availability."
    }
  ];

  const benefits = [
    "Prevent stockouts by ordering in advance",
    "Optimize inventory levels based on lead times",
    "Improve cash flow planning",
    "Better negotiate with suppliers",
    "Reduce safety stock requirements",
    "Improve customer service levels",
    "Make data-driven ordering decisions",
    "Handle seasonal variations effectively"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Lead Time?', level: 1 },
    { id: 'concepts', title: 'Key Concepts', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="What is Lead Time"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="What is Lead Time 2025 | Lead Time Definition & Guide | StockFlow"
        description="Complete guide to what is lead time. Learn lead time definition, how to calculate lead time, and how to use lead time for inventory planning. Free tools included."
        keywords="what is lead time, lead time, lead time definition, lead time meaning, lead time calculation, lead time formula, lead time inventory, lead time management, lead time planning, lead time optimization, supplier lead time, production lead time, order lead time, lead time tracking, stockflow, stock flow"
        url="https://www.stockflow.be/what-is-lead-time"
      />

      <SeoPageHero
        title="What is Lead Time: Complete Guide to Lead Time Definition"
        description="Learn what is lead time and how to use lead time for inventory planning. Complete guide to lead time definition, calculation, and optimization. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Managing Lead Times Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Lead Time</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Lead time is the period between placing an order and receiving it. Understanding what is lead time is essential for effective inventory planning and preventing stockouts.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Lead Time Formula</h3>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              Lead Time = Order Date â†’ Receipt Date
            </div>
            <p className="text-gray-700">
              Lead time includes order processing time, manufacturing (if applicable), shipping time, and receiving time. Inventory management software like StockFlow tracks lead times automatically to help optimize inventory planning.
            </p>
          </div>
        </div>
      </section>

      <section id="concepts" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key <span className="text-blue-600">Lead Time Concepts</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {concepts.map((concept, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <concept.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{concept.title}</h3>
                <p className="text-gray-600">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Lead Time</span> Management
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Managing Lead Times Today
          </h2>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ]} />
    </SeoPageLayout>
  );
}



