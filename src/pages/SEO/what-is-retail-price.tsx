import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '../../components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  DollarSign,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function WhatIsRetailPrice() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is retail price?",
      answer: "Retail price is the price at which a product is sold to end consumers in retail stores or online. It's the final selling price that customers pay, which typically includes the cost of goods, markup, and profit margin. Retail prices are higher than wholesale prices to cover operating costs and generate profit."
    },
    {
      question: "What are retail prices?",
      answer: "Retail prices are the prices set by retailers for products sold to consumers. Retail prices vary based on factors like product cost, competition, market demand, brand positioning, and profit margins. Effective retail pricing strategies help businesses maximize revenue while remaining competitive."
    },
    {
      question: "What is the retail price?",
      answer: "The retail price is the final price consumers pay when purchasing a product from a retailer. It's calculated by adding markup to the cost price, covering expenses like overhead, marketing, and profit. Understanding retail pricing is essential for inventory management and profitability."
    },
    {
      question: "How do you calculate retail price?",
      answer: "Retail price is typically calculated by adding a markup percentage to the cost price. Formula: Retail Price = Cost Price × (1 + Markup %). For example, if a product costs €10 and you want a 50% markup, the retail price would be €15. Inventory management software like StockFlow can help track and manage retail prices."
    },
    {
      question: "What is the difference between retail price and wholesale price?",
      answer: "Retail price is what end consumers pay, while wholesale price is what retailers pay to suppliers. Wholesale prices are typically lower because retailers buy in bulk and need to add markup to cover costs and profit. The difference between wholesale and retail prices is the retailer's margin."
    },
    {
      question: "How can inventory management software help with retail pricing?",
      answer: "Inventory management software like StockFlow helps with retail pricing by tracking cost prices, calculating markups, managing price changes, analyzing profit margins, and providing insights into pricing strategies. The software can also help optimize pricing based on inventory turnover and market conditions."
    }
  ];

  const concepts = [
    {
      icon: DollarSign,
      title: "Cost Price",
      description: "The amount paid to suppliers or manufacturers for products."
    },
    {
      icon: Calculator,
      title: "Markup",
      description: "The percentage added to cost price to determine retail price."
    },
    {
      icon: TrendingUp,
      title: "Profit Margin",
      description: "The difference between retail price and cost price, expressed as a percentage."
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Retail Price?', level: 1 },
    { id: 'concepts', title: 'Key Concepts', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="What is Retail Price"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="What is Retail Price 2025 | What are Retail Prices | Complete Guide | StockFlow"
        description="Complete guide to retail price and retail pricing. Learn what is retail price, what are retail prices, how to calculate retail prices, and optimize pricing strategies. Free tools included."
        keywords="what is retail price, what are retail prices, what is the retail price, retail price, retail prices, retail price definition, retail price meaning, retail price calculation, retail price formula, retail price vs wholesale price, retail pricing, retail pricing strategy, retail price markup, retail price calculator, stockflow, stock flow"
        url="https://www.stockflow.be/what-is-retail-price"
      />

      <SeoPageHero
        title="What is Retail Price: Complete Guide to Retail Pricing"
        description="Learn what is retail price, what are retail prices, and how to calculate retail prices effectively. Complete guide to retail pricing strategies, markups, and profit margins. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Managing Prices Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Retail Price</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Retail price is the final price at which products are sold to end consumers. Understanding retail pricing is essential for inventory management, profitability, and competitive positioning.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Retail Price Formula</h3>
            <div className="text-xl font-semibold text-blue-600 mb-4">
              Retail Price = Cost Price × (1 + Markup %)
            </div>
            <p className="text-gray-700">
              The retail price includes the cost of the product plus a markup percentage that covers operating expenses, overhead, and profit margin. Inventory management software like StockFlow helps track and manage retail prices effectively.
            </p>
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

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Managing Retail Prices Today
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

