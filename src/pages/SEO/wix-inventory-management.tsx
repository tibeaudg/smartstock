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
  ShoppingBag,
  Zap
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function WixInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is Wix inventory management?",
      answer: "Wix inventory management refers to managing inventory for Wix stores. While Wix has basic inventory features, dedicated inventory management software like StockFlow provides advanced inventory tracking, multi-channel sync, automated reordering, and better inventory control for Wix stores."
    },
    {
      question: "Can I integrate inventory management with Wix?",
      answer: "Yes, StockFlow can integrate with Wix stores to sync inventory in real-time, prevent overselling, and manage inventory more effectively than Wix's built-in inventory features."
    },
    {
      question: "Do I need separate inventory management for Wix?",
      answer: "While Wix has basic inventory features, dedicated inventory management like StockFlow provides advanced features, multi-channel support, automated reordering, and better inventory control - essential for growing Wix stores."
    }
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Wix Integration",
      description: "Seamlessly sync inventory with Wix stores for real-time accuracy."
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Automatic inventory updates between StockFlow and Wix stores."
    }
  ];

  const benefits = [
    "Prevent overselling on Wix",
    "Sync inventory in real-time",
    "Advanced inventory features",
    "Multi-channel support",
    "Automated reordering"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'Wix Inventory Management', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Wix Inventory Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Wix Inventory Management 2025 | Inventory Management for Wix | StockFlow"
        description="Best Wix inventory management. Integrate with Wix stores, sync inventory in real-time, prevent overselling. Free trial available."
        keywords="wix inventory management, wix inventory, wix inventory software, wix inventory app, wix inventory sync, wix inventory management system, wix inventory tracking, wix inventory integration, inventory management for wix, wix inventory solution, stockflow, stock flow"
        url="https://www.stockflow.be/wix-inventory-management"
      />

      <SeoPageHero
        title="Wix Inventory Management: Best Inventory Solution for Wix Stores"
        description="Best Wix inventory management. Integrate with Wix stores, sync inventory in real-time, prevent overselling. Free trial available."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 for Wix", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Wix Integration Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-blue-600">Wix Inventory Management</span> for Wix Stores
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Manage inventory for Wix stores with advanced inventory management. Integrate seamlessly and sync inventory in real-time.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Wix Inventory Management <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
              Benefits for <span className="text-blue-600">Wix Stores</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            Start Managing Wix Inventory Today
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

