import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  DollarSign,
  Calculator,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Target,
  AlertCircle
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { CostMarginCalculator } from '@/components/CostMarginCalculator';

export default function RetailPrice() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is retail price?",
      answer: "Retail price is the price at which a product is sold to end consumers in retail stores or online. It's the final selling price that customers pay, which typically includes the cost of goods, markup, and profit margin. Retail prices are higher than wholesale prices to cover operating costs and generate profit. The formula is: Retail Price = Cost Price × (1 + Markup %)."
    },
    {
      question: "How do you calculate retail price?",
      answer: "Retail price is calculated by adding a markup percentage to the cost price. The formula is: Retail Price = Cost Price × (1 + Markup %). For example, if a product costs €10 and you want a 50% markup, the retail price would be €15. You can also calculate it as: Retail Price = Cost Price + (Cost Price × Markup %). Inventory management software like StockFlow can help track costs and calculate retail prices automatically."
    },
    {
      question: "What's the difference between retail price and wholesale price?",
      answer: "Retail price is what end consumers pay, while wholesale price is what retailers pay to suppliers. Wholesale prices are typically lower because retailers buy in bulk and need to add markup to cover costs and profit. The difference between wholesale and retail prices is the retailer's margin, which covers operating expenses, overhead, and profit."
    },
    {
      question: "How do you set retail prices?",
      answer: "Set retail prices by: calculating cost price (including product cost, shipping, and overhead), determining desired profit margin, researching competitor prices, considering market demand and positioning, applying markup formula, and testing prices with customers. Use inventory management software to track costs in real-time and ensure your pricing remains profitable as costs change."
    },
    {
      question: "What is a good retail price markup?",
      answer: "Good retail price markup varies by industry: retail typically 50-100%, fashion 100-200%, electronics 10-30%, food service 200-400%, and luxury goods 200-500%. The markup should cover all costs (product, shipping, overhead) plus desired profit. Consider competitor pricing, market positioning, and customer willingness to pay when setting markup percentages."
    },
    {
      question: "How can inventory management software help with retail pricing?",
      answer: "Inventory management software like StockFlow helps with retail pricing by: tracking cost prices in real-time, calculating markups automatically, managing price changes across products, analyzing profit margins, providing insights into pricing strategies, tracking cost changes from suppliers, and optimizing pricing based on inventory turnover and market conditions."
    },
    {
      question: "Should retail prices include tax?",
      answer: "Retail prices typically exclude tax in most regions, with tax added at checkout. However, some regions require tax-inclusive pricing. Check local regulations. When calculating retail price, focus on the base price before tax. Tax is usually calculated separately and added to the final customer payment."
    }
  ];

  const concepts = [
    {
      icon: DollarSign,
      title: "Cost Price",
      description: "The amount paid to suppliers or manufacturers for products, including shipping and handling costs."
    },
    {
      icon: Calculator,
      title: "Markup",
      description: "The percentage added to cost price to determine retail price. Covers operating expenses and profit."
    },
    {
      icon: TrendingUp,
      title: "Profit Margin",
      description: "The difference between retail price and cost price, expressed as a percentage of the retail price."
    }
  ];

  return (
    <SeoPageLayout 
      title="Retail Price | How to Calculate Retail Price"
      description="Learn about retail price, how to calculate retail price, and retail pricing strategies. Complete guide to retail price markup, profit margins, and pricing optimization."
      faqData={faqData}
    >
      <SEO
        title="Retail Price | How to Calculate Retail Price 2025 | StockFlow"
        description="Complete guide to retail price. Learn how to calculate retail price, set retail prices, and optimize pricing strategies. Free retail price calculator included."
        keywords="retail price, retail prices, retail price calculation, retail price formula, retail price markup, how to calculate retail price, retail pricing, retail price vs wholesale price, retail price calculator, stockflow, stock flow"
        url="https://www.stockflowsystems.com/industries/retail-price"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Retail Price
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              <strong>Retail price</strong> is the final price at which products are sold to end consumers. The fundamental formula is: <strong>Retail Price = Cost + Margin</strong>. To maintain your margin, you must track accurate costs and stock levels. Understanding retail pricing is essential for inventory management, profitability, and competitive positioning.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Retail Price Formula</h2>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              Retail Price = Cost Price × (1 + Markup %)
            </div>
            <p className="text-gray-700 mb-4">
              The retail price includes the cost of the product plus a markup percentage that covers operating expenses, overhead, and profit margin. However, this formula only works if you have accurate, real-time cost data.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-gray-800 font-semibold mb-2">The Critical Gap: Manual Spreadsheets Fail</p>
              <p className="text-gray-700">
                Manual spreadsheets fail at tracking real-time costs. When supplier prices change, shipping costs fluctuate, or inventory levels shift, your margin calculations become inaccurate. Use <Link to="/inventory-management-software" className="text-blue-600 hover:text-blue-800 font-semibold underline">automated inventory management</Link> to protect your margins by tracking costs and stock levels in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="concepts" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key <span className="text-blue-600">Pricing Concepts</span>
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

      <section id="calculator" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Retail Price Calculator
          </h2>
          <CostMarginCalculator />
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop Guessing Your Profit Margins
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Calculating retail price is only the first step. To maintain your margins, you need real-time tracking of costs and inventory levels. Manual spreadsheets can't keep up with changing supplier prices, shipping costs, and stock movements. <Link to="/inventory-management-software" className="text-white font-semibold underline hover:text-blue-200">Automated inventory management software</Link> protects your margins by tracking COGS and stock levels in real-time, ensuring your pricing calculations remain accurate as your business grows.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Join for Free
            </Link>
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

