import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';

export default function EcommerceInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is ecommerce management software?",
      answer: "Ecommerce management software is a platform that helps businesses manage online store operations, including inventory management, order processing, customer management, and sales analytics. It integrates with e-commerce platforms like Shopify, WooCommerce, and Amazon to provide centralized management of online business operations."
    },
    {
      question: "What is multi platform inventory management?",
      answer: "Multi platform inventory management is the ability to manage inventory across multiple sales channels and e-commerce platforms (like Shopify, Amazon, eBay, WooCommerce) from a single system. This ensures inventory levels are synchronized across all platforms, preventing overselling and maintaining accurate stock counts."
    },
    {
      question: "What is cross platform inventory management?",
      answer: "Cross platform inventory management is similar to multi platform - it allows businesses to manage inventory across different e-commerce platforms, marketplaces, and sales channels from one centralized system. StockFlow provides cross platform inventory management that syncs with Shopify, Amazon, WooCommerce, and more."
    },
    {
      question: "Why do I need ecommerce management software?",
      answer: "Ecommerce management software helps online stores: prevent overselling across channels, sync inventory in real-time, manage orders efficiently, track sales across platforms, automate reordering, and scale operations. Without it, managing inventory across multiple platforms becomes error-prone and time-consuming."
    },
    {
      question: "How does multi platform inventory management work?",
      answer: "Multi platform inventory management works by connecting to multiple e-commerce platforms through APIs, synchronizing inventory levels in real-time, updating stock across all channels when products are sold, and providing a centralized dashboard to manage inventory across all platforms. StockFlow makes this seamless."
    },
    {
      question: "Can inventory management software integrate with multiple e-commerce platforms?",
      answer: "Yes, StockFlow integrates with multiple e-commerce platforms including Shopify, WooCommerce, Amazon, BigCommerce, Wix, and more. This allows you to manage inventory across all your sales channels from one system, ensuring accurate stock levels and preventing overselling."
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Multi-Platform Sync",
      description: "Sync inventory across Shopify, Amazon, WooCommerce, and other e-commerce platforms in real-time."
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Integration",
      description: "Integrate with major e-commerce platforms and marketplaces for seamless inventory management."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Automatic inventory updates across all platforms when products are sold or restocked."
    },
    {
      icon: TrendingUp,
      title: "Unified Dashboard",
      description: "Manage all e-commerce inventory from one centralized dashboard, regardless of platform."
    }
  ];

  const benefits = [
    "Prevent overselling across all platforms",
    "Sync inventory in real-time across channels",
    "Manage multiple stores from one system",
    "Reduce manual inventory updates",
    "Improve inventory accuracy",
    "Scale e-commerce operations efficiently",
    "Better inventory control and visibility",
    "Automate reordering across platforms"
  ];

  const platforms = [
    { name: "Shopify", description: "Full integration with Shopify stores" },
    { name: "WooCommerce", description: "Sync with WooCommerce stores" },
    { name: "Amazon", description: "Manage Amazon inventory" },
    { name: "BigCommerce", description: "Integrate with BigCommerce" },
    { name: "Wix", description: "Connect Wix stores" },
    { name: "Etsy", description: "Manage Etsy inventory" }
  ];

  return (
    <SeoPageLayout 
      title="Ecommerce Inventory Management"
      heroTitle="Ecommerce Inventory Management"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Ecommerce Inventory Management 2025 - Ecommerce Inventory..."
        description="Discover how ecommerce inventory management to automate your processes. Find out how ecommerce inventory management to optimize your inventory. Get started f..."
        keywords="ecommerce management software, ecommerce inventory management, multi platform inventory management, cross platform inventory management, ecommerce inventory software, multi platform inventory, cross platform inventory, ecommerce inventory system, multi channel inventory management, ecommerce inventory solution, inventory management for ecommerce, multi platform inventory software, cross platform inventory software, stockflow, stock flow"
        url="https://www.stockflow.be/ecommerce-inventory-management"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-blue-600">Ecommerce Management Software</span> for Multi Platform Operations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Manage inventory across multiple e-commerce platforms and sales channels from one system. Multi platform and cross platform inventory management for growing online businesses.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ecommerce Management Software <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Multi Platform Inventory</span>
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

      <section id="platforms" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Supported <span className="text-blue-600">E-commerce Platforms</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow integrates with all major e-commerce platforms for multi platform inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                <p className="text-gray-600">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Multi Platform Inventory Management Today
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



