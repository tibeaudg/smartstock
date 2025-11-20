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
  Shield,
  Calculator,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function HowToCalculateSafetyStock() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is safety stock?",
      answer: "Safety stock is extra inventory kept on hand to protect against stockouts caused by unexpected demand spikes, supplier delays, or forecasting errors. It acts as a buffer to ensure you can continue fulfilling orders even when demand exceeds forecasts or supply chain disruptions occur. Calculating safety stock correctly is essential for maintaining service levels while avoiding overstock."
    },
    {
      question: "How do you calculate safety stock?",
      answer: "Safety stock is typically calculated using the formula: Safety Stock = (Maximum Daily Usage × Maximum Lead Time) - (Average Daily Usage × Average Lead Time). Alternatively, you can use the statistical method: Safety Stock = Z-score × Standard Deviation of Demand × √Lead Time. The Z-score corresponds to your desired service level (e.g., 1.65 for 95% service level). Inventory management software can automate these calculations based on your historical data."
    },
    {
      question: "What is the safety stock formula?",
      answer: "The most common safety stock formula is: Safety Stock = Z × σD × √L, where Z is the Z-score for desired service level, σD is the standard deviation of demand, and L is the lead time. For example, with a 95% service level (Z=1.65), demand standard deviation of 10 units, and lead time of 7 days, safety stock = 1.65 × 10 × √7 ≈ 44 units."
    },
    {
      question: "Why is safety stock important?",
      answer: "Safety stock prevents stockouts that can lead to lost sales, customer dissatisfaction, and damage to your reputation. It also protects against supply chain disruptions, supplier delays, and demand variability. However, too much safety stock ties up capital and increases carrying costs. Proper calculation helps balance service levels with inventory costs."
    },
    {
      question: "What factors affect safety stock calculation?",
      answer: "Key factors include: demand variability (how much actual demand differs from forecasts), lead time variability (supplier delivery time fluctuations), desired service level (percentage of orders you want to fulfill without stockouts), and product criticality (how important the item is to your business). Stock tracking systems can monitor these factors in real-time and adjust safety stock levels automatically."
    },
    {
      question: "How can inventory management software help with safety stock?",
      answer: "Inventory management software like StockFlow automatically calculates safety stock based on historical demand patterns, lead time data, and your desired service levels. It continuously monitors demand variability and adjusts safety stock recommendations as your business grows. The software also alerts you when stock levels approach safety stock thresholds, helping prevent stockouts while optimizing inventory investment."
    }
  ];

  const concepts = [
    {
      icon: Shield,
      title: "Service Level",
      description: "The percentage of orders you want to fulfill without stockouts (e.g., 95% service level means 95 out of 100 orders are fulfilled)."
    },
    {
      icon: Calculator,
      title: "Demand Variability",
      description: "How much actual demand differs from average demand, measured by standard deviation."
    },
    {
      icon: AlertTriangle,
      title: "Lead Time",
      description: "The time between placing an order and receiving inventory, including supplier processing and shipping."
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'How to Calculate Safety Stock', level: 1 },
    { id: 'concepts', title: 'Key Concepts', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="How to Calculate Safety Stock"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="How to Calculate Safety Stock - Complete Guide 2025"
        description="Learn how to calculate safety stock with formulas, examples, and best practices. Complete guide to safety stock calculation for inventory management. Free tools included."
        keywords="how to calculate safety stock, safety stock formula, safety stock calculation, calculate safety stock, safety stock, safety stock meaning, safety stock definition, safety stock example, safety stock formula excel, safety stock calculator, inventory safety stock, safety stock level, safety stock calculation method, stockflow, stock flow"
        url="https://www.stockflow.be/how-to-calculate-safety-stock"
      />

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">How to Calculate Safety Stock</h1>
      <SeoPageHero
        title="How to Calculate Safety Stock: Complete Guide"
        description="Learn how to calculate safety stock with step-by-step formulas, examples, and best practices. Complete guide to safety stock calculation for effective inventory management. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Managing Safety Stock Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How to Calculate <span className="text-blue-600">Safety Stock</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Safety stock is extra inventory kept on hand to protect against stockouts caused by unexpected demand spikes, supplier delays, or forecasting errors. Calculating safety stock correctly is essential for maintaining service levels while avoiding overstock. However, manual calculations become inaccurate as demand patterns change and lead times fluctuate. This is where <Link to="/inventory-management-software" className="text-blue-600 hover:text-blue-800 font-semibold underline">inventory management software</Link> becomes critical for automatically calculating and adjusting safety stock levels based on real-time data.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Safety Stock Formula</h3>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              Safety Stock = Z × σD × √L
            </div>
            <p className="text-gray-700 mb-4">
              Where Z is the Z-score for your desired service level, σD is the standard deviation of demand, and L is the lead time. This statistical formula provides the most accurate safety stock calculation by accounting for demand variability and lead time uncertainty.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-gray-800 font-semibold mb-2">The Challenge: Manual Calculations Fail</p>
              <p className="text-gray-700">
                Manual safety stock calculations require constant updates as demand patterns change, lead times fluctuate, and new products are introduced. Spreadsheets can't track real-time demand variability or automatically adjust safety stock levels. Use <Link to="/inventory-management-software" className="text-blue-600 hover:text-blue-800 font-semibold underline">automated inventory management</Link> to continuously calculate and optimize safety stock based on actual demand patterns and lead time data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="concepts" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key <span className="text-blue-600">Safety Stock Concepts</span>
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
            Automate Your Safety Stock Calculations
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Calculating safety stock manually is time-consuming and error-prone. As demand patterns change and lead times fluctuate, your safety stock levels need constant adjustment. <Link to="/inventory-management-software" className="text-white font-semibold underline hover:text-blue-200">Inventory management software</Link> automatically calculates optimal safety stock levels based on historical demand data, lead time variability, and your desired service levels. This ensures you maintain adequate stock buffers while avoiding excess inventory that ties up capital.
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

