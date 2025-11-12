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
  ShoppingBag,
  Zap,
  TrendingUp,
  Package
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function ShopifyInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is the best inventory management software for Shopify?",
      answer: "The best inventory management software for Shopify should sync seamlessly with your Shopify store, provide real-time inventory updates, handle multi-channel sales, support barcode scanning, and offer automated reordering. StockFlow integrates with Shopify and provides all these features, making it an excellent choice for Shopify stores."
    },
    {
      question: "How does inventory management software integrate with Shopify?",
      answer: "Inventory management software integrates with Shopify through APIs that connect your inventory system to your Shopify store. This allows real-time synchronization of inventory levels, automatic updates when products are sold, and centralized inventory management across multiple sales channels. StockFlow offers seamless Shopify integration."
    },
    {
      question: "What is Shopify Stocky?",
      answer: "Shopify Stocky is a Shopify app for inventory management. However, StockFlow offers more comprehensive inventory management features, better pricing, and can integrate with multiple platforms beyond Shopify. StockFlow is a better alternative to Stocky for businesses needing robust inventory management."
    },
    {
      question: "How does Shopify Plus inventory management work?",
      answer: "Shopify Plus inventory management requires robust inventory management software that can handle high-volume sales, multiple locations, and complex inventory operations. StockFlow integrates with Shopify Plus to provide advanced inventory tracking, multi-warehouse management, and automated reordering capabilities."
    },
    {
      question: "What is the best WMS for Shopify?",
      answer: "The best WMS (Warehouse Management System) for Shopify should integrate seamlessly, handle multi-channel inventory, support real-time syncing, and scale with your business. StockFlow provides WMS capabilities specifically designed for Shopify stores, offering better value than dedicated WMS solutions."
    },
    {
      question: "Can inventory management software sync with Shopify in real-time?",
      answer: "Yes, StockFlow syncs with Shopify in real-time, ensuring inventory levels are always accurate. When a product is sold on Shopify, StockFlow automatically updates inventory levels, and when inventory is updated in StockFlow, it syncs back to Shopify. This prevents overselling and ensures accurate stock levels."
    },
    {
      question: "Do I need separate inventory management software if I use Shopify?",
      answer: "While Shopify has basic inventory features, dedicated inventory management software like StockFlow provides advanced features like multi-channel inventory sync, automated reordering, detailed analytics, supplier management, and better inventory control. For growing businesses, StockFlow offers significant advantages over Shopify's built-in inventory."
    }
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Shopify Integration",
      description: "Seamlessly sync inventory with Shopify stores, ensuring real-time accuracy across all sales channels."
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Automatic inventory updates between StockFlow and Shopify prevent overselling and stockouts."
    },
    {
      icon: Package,
      title: "Multi-Channel Management",
      description: "Manage inventory across Shopify, other e-commerce platforms, and physical stores from one system."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Get detailed insights into sales performance, inventory turnover, and demand forecasting for Shopify products."
    }
  ];

  const benefits = [
    "Prevent overselling on Shopify",
    "Sync inventory in real-time",
    "Manage multiple Shopify stores",
    "Automate reordering for Shopify products",
    "Track inventory across channels",
    "Improve inventory accuracy",
    "Scale Shopify operations efficiently",
    "Better than Shopify Stocky"
  ];

  const comparisons = [
    {
      feature: "Real-time Shopify sync",
      stockflow: "✓ Included",
      stocky: "Limited",
      shopify: "Basic only"
    },
    {
      feature: "Multi-channel support",
      stockflow: "✓ All platforms",
      stocky: "Shopify only",
      shopify: "Shopify only"
    },
    {
      feature: "Advanced analytics",
      stockflow: "✓ Comprehensive",
      stocky: "Limited",
      shopify: "Basic"
    },
    {
      feature: "Automated reordering",
      stockflow: "✓ Included",
      stocky: "Premium only",
      shopify: "Not available"
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'Shopify Inventory Management', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'comparison', title: 'StockFlow vs Stocky', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Shopify Inventory Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Shopify Inventory Management 2025 | Best Inventory Software for Shopify | StockFlow vs Stocky"
        description="Best inventory management software for Shopify. Integrate with Shopify, sync inventory in real-time, prevent overselling. Better than Shopify Stocky. Free trial available - no credit card required!"
        keywords="shopify inventory management, inventory management software shopify, shopify stocky, best inventory management software for shopify, shopify plus inventory management, best wms for shopify, shopify inventory software, shopify inventory app, shopify inventory sync, shopify inventory management system, shopify inventory tracking, shopify inventory integration, inventory management for shopify stores, shopify inventory solution, stockflow, stock flow"
        url="https://www.stockflow.be/shopify-inventory-management"
      />

      <SeoPageHero
        title="Shopify Inventory Management: Best Inventory Software for Shopify"
        description="The best inventory management software for Shopify. Integrate seamlessly, sync inventory in real-time, prevent overselling, and manage multi-channel inventory. Better alternative to Shopify Stocky. Free trial available!"
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 for Shopify", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Better than Stocky", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Shopify Stores", variant: 'info' }
        ]}
        ctaText="Start Shopify Integration Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Best <span className="text-blue-600">Inventory Management Software for Shopify</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow is the best inventory management software for Shopify stores. Integrate seamlessly, sync inventory in real-time, and manage multi-channel inventory from one system. Better than Shopify Stocky with more features and better pricing.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Shopify Inventory Management <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits for <span className="text-blue-600">Shopify Stores</span>
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

      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Shopify Stocky</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See why StockFlow is the best alternative to Shopify Stocky for inventory management.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Shopify Stocky</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Shopify Built-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisons.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.stocky}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.shopify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Managing Shopify Inventory Today
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



