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
  Package,
  Calculator,
  TrendingUp,
  Target
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function WhatIsEconomicOrderQuantity() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is Economic Order Quantity (EOQ)?",
      answer: "Economic Order Quantity (EOQ) is the optimal order quantity that minimizes total inventory costs, including ordering costs and holding costs. It's a formula used to determine the ideal number of units to order at one time to balance the cost of ordering inventory against the cost of holding inventory. EOQ helps businesses reduce total inventory costs while maintaining adequate stock levels."
    },
    {
      question: "What is the EOQ formula?",
      answer: "The EOQ formula is: EOQ = √(2DS/H), where D is annual demand in units, S is ordering cost per order, and H is holding cost per unit per year. For example, with annual demand of 1,000 units, ordering cost of €50, and holding cost of €2 per unit per year, EOQ = √(2 × 1,000 × 50 / 2) = √50,000 ≈ 224 units. Inventory management software can automatically calculate EOQ based on your actual demand and cost data."
    },
    {
      question: "How do you calculate Economic Order Quantity?",
      answer: "To calculate EOQ: 1) Determine annual demand (D) in units, 2) Calculate ordering cost per order (S), including processing, shipping, and administrative costs, 3) Determine holding cost per unit per year (H), including storage, insurance, and opportunity costs, 4) Apply the formula: EOQ = √(2DS/H). The result is the optimal order quantity that minimizes total inventory costs."
    },
    {
      question: "What are the assumptions of the EOQ model?",
      answer: "The EOQ model assumes: constant demand rate, fixed ordering costs, fixed holding costs per unit, no quantity discounts, no stockouts, and immediate delivery. While these assumptions don't always hold in real-world scenarios, EOQ provides a useful starting point for order quantity optimization. Modern stock tracking systems can adjust EOQ calculations to account for variable demand, quantity discounts, and other real-world factors."
    },
    {
      question: "Why is Economic Order Quantity important?",
      answer: "EOQ helps businesses minimize total inventory costs by finding the balance between ordering too frequently (high ordering costs) and ordering too much at once (high holding costs). It reduces capital tied up in inventory, minimizes storage costs, and optimizes cash flow. However, EOQ must be adjusted based on actual demand patterns, supplier constraints, and business goals."
    },
    {
      question: "How can inventory management software help with EOQ?",
      answer: "Inventory management software like StockFlow automatically calculates EOQ based on historical demand data, actual ordering costs, and holding costs. It continuously updates EOQ recommendations as demand patterns change and can adjust for quantity discounts, supplier minimums, and storage constraints. The software also helps track whether you're ordering at optimal quantities and alerts you when adjustments are needed."
    }
  ];

  const concepts = [
    {
      icon: Package,
      title: "Ordering Cost",
      description: "The cost associated with placing and receiving an order, including processing, shipping, and administrative expenses."
    },
    {
      icon: Calculator,
      title: "Holding Cost",
      description: "The cost of storing and maintaining inventory, including storage, insurance, obsolescence, and opportunity costs."
    },
    {
      icon: Target,
      title: "Optimal Quantity",
      description: "The order quantity that minimizes the sum of ordering costs and holding costs, balancing frequency and volume."
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Economic Order Quantity?', level: 1 },
    { id: 'concepts', title: 'Key Concepts', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="What is Economic Order Quantity"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="What is Economic Order Quantity (EOQ) - Complete Guide 2025"
        description="Learn what is Economic Order Quantity (EOQ), the EOQ formula, and how to calculate EOQ for optimal inventory management. Complete guide with examples and best practices."
        keywords="what is economic order quantity, EOQ, economic order quantity, EOQ formula, economic order quantity formula, calculate EOQ, EOQ calculation, economic order quantity calculation, EOQ model, optimal order quantity, inventory order quantity, EOQ meaning, EOQ definition, stockflow, stock flow"
        url="https://www.stockflow.be/what-is-economic-order-quantity"
      />

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">What is Economic Order Quantity (EOQ)</h1>
      <SeoPageHero
        title="What is Economic Order Quantity (EOQ): Complete Guide"
        description="Learn what is Economic Order Quantity (EOQ), the EOQ formula, and how to calculate optimal order quantities. Complete guide to EOQ for effective inventory management. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Optimizing Orders Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Economic Order Quantity (EOQ)</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Economic Order Quantity (EOQ) is the optimal order quantity that minimizes total inventory costs by balancing ordering costs and holding costs. The EOQ formula helps determine how much inventory to order at one time to minimize costs while maintaining adequate stock levels. However, calculating EOQ manually becomes complex as demand patterns change, costs fluctuate, and you manage multiple products. This is where <Link to="/inventory-management-software" className="text-blue-600 hover:text-blue-800 font-semibold underline">inventory management software</Link> becomes essential for automatically calculating and updating EOQ based on real-time demand and cost data.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">EOQ Formula</h3>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              EOQ = √(2DS/H)
            </div>
            <p className="text-gray-700 mb-4">
              Where D is annual demand in units, S is ordering cost per order, and H is holding cost per unit per year. This formula finds the order quantity that minimizes the sum of ordering costs and holding costs.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-gray-800 font-semibold mb-2">The Challenge: Manual EOQ Calculations Are Outdated</p>
              <p className="text-gray-700">
                Manual EOQ calculations assume constant demand and fixed costs, which rarely match real-world conditions. As demand patterns change, supplier costs fluctuate, and storage constraints vary, your EOQ needs constant recalculation. Spreadsheets can't track real-time demand or automatically adjust for quantity discounts and supplier minimums. Use <Link to="/inventory-management-software" className="text-blue-600 hover:text-blue-800 font-semibold underline">automated inventory management</Link> to continuously calculate optimal order quantities based on actual demand patterns and current cost data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="concepts" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key <span className="text-blue-600">EOQ Concepts</span>
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

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automate Your Order Quantity Optimization
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Calculating EOQ manually is time-consuming and quickly becomes outdated as demand patterns and costs change. The traditional EOQ formula assumes constant conditions that rarely exist in real business operations. <Link to="/inventory-management-software" className="text-white font-semibold underline hover:text-blue-200">Inventory management software</Link> automatically calculates optimal order quantities based on historical demand data, current ordering costs, and holding costs. It continuously updates EOQ recommendations as conditions change and can adjust for quantity discounts, supplier minimums, and storage constraints, ensuring you always order the right quantity at the right time.
          </p>
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

