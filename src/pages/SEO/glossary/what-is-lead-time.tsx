import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
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
      heroTitle="What is Lead Time"
      updatedDate="3/12/2025"
      faqData={faqData}
      
      
    >
      <SEO
        title="What Is Lead Time 2025 - Prevent Stockouts, Save 25% Costs | StockFlow"
        description="Complete guide to lead time in inventory management 2025. Definition, formula, calculation examples. Optimize lead times to prevent stockouts and save 25% costs. Free plan available. Join for Free - no credit card required."
        keywords="what is lead time, lead time, lead time definition, lead time meaning, lead time calculation, lead time formula, lead time inventory, lead time management, lead time planning, lead time optimization, supplier lead time, production lead time, order lead time, lead time tracking, stockflow, stock flow"
        url="https://www.stockflowsystems.com/what-is-lead-time"
      />      
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Lead Time</span>?
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Lead time is the period between placing an order and receiving it. Understanding what is lead time is essential for effective inventory planning and preventing stockouts.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Lead Time Formula</h3>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              Lead Time = Order Date → Receipt Date
            </div>
            <p className="text-gray-700 mb-4">
              Lead time includes order processing time, manufacturing (if applicable), shipping time, and receiving time. Inventory management software like StockFlow tracks lead times automatically to help optimize inventory planning.
            </p>
            <div className="bg-white rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Calculation:</h4>
              <p className="text-sm text-gray-700">
                Lead Time = Supplier Processing Time + Manufacturing Time (if applicable) + Shipping Time + Receiving/Inspection Time
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Lead time</strong> is one of the most critical metrics in inventory management. It directly impacts your reorder points, safety stock levels, and overall inventory investment. Understanding and accurately tracking lead times can help you prevent stockouts, reduce carrying costs by up to 25%, and improve cash flow management.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Businesses that accurately track and account for lead times see significant improvements in inventory efficiency. For example, a retailer with 500 SKUs who properly accounts for lead time variations can reduce safety stock by 30% while maintaining the same service level, freeing up capital for growth. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Modern inventory management software</Link> like StockFlow automatically tracks historical lead times and adjusts reorder points accordingly.
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
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proper lead time management delivers measurable business benefits. Companies that accurately track and optimize lead times see significant improvements in inventory efficiency and cost reduction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-World Impact</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Stockout Prevention</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">95%</p>
                <p className="text-sm text-gray-600">Reduction in stockouts when lead times are accurately tracked</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Cost Reduction</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">25%</p>
                <p className="text-sm text-gray-600">Average reduction in safety stock requirements</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Cash Flow</h4>
                <p className="text-2xl font-bold text-purple-600 mb-2">30%</p>
                <p className="text-sm text-gray-600">Improvement in cash flow from optimized inventory levels</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculation" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            How to Calculate and Optimize Lead Time
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Calculating lead time accurately requires tracking multiple components. Here's a practical approach:
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                  <span><strong>Track historical data:</strong> Record the time from order placement to receipt for each supplier over at least 3-6 months</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                  <span><strong>Calculate average:</strong> Sum all lead times and divide by the number of orders to get average lead time</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                  <span><strong>Account for variability:</strong> Calculate standard deviation to understand lead time variability and set appropriate safety stock</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                  <span><strong>Update regularly:</strong> Review and update lead times quarterly or when supplier relationships change</span>
                </li>
              </ol>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Inventory management software</Link> automates this process by tracking order dates and receipt dates, calculating averages, and adjusting reorder points automatically. This eliminates manual calculations and ensures your inventory levels are always optimized based on current lead time data.
            </p>
          </div>
        </div>
      </section>

      <section id="optimization" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Strategies to Optimize Lead Times
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Supplier Relationships</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Negotiate shorter lead times with reliable suppliers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Maintain backup suppliers for critical items</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use local suppliers when possible to reduce shipping time</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Place orders earlier based on accurate lead time data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use automated reorder points that account for lead time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monitor lead time trends and adjust safety stock accordingly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Automate Lead Time Tracking with StockFlow
          </h2>
          <p className="text-xl mb-8 opacity-90">
            StockFlow automatically tracks lead times, calculates averages, and adjusts reorder points to optimize your inventory levels. Join for Free today with up to 100 products.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Join for Free →
          </Link>
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



