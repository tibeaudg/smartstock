import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  ShoppingCart,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';

export default function InventoryForEcommerce() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "How does inventory management work for ecommerce businesses?",
      answer: "Ecommerce inventory management synchronizes stock levels between your online store and inventory system in real-time. When a customer orders online, inventory automatically decreases. This prevents overselling, ensures accurate stock levels, and enables automatic fulfillment workflows perfect for online retailers."
    },
    {
      question: "Why do I need inventory software for my webshop?",
      answer: "Inventory software for webshops prevents overselling (selling products you don't have), automates stock synchronization across sales channels, enables real-time stock visibility, automates reorder alerts, and integrates seamlessly with popular ecommerce platforms like Shopify, WooCommerce, and Magento."
    },
    {
      question: "Can inventory software integrate with my ecommerce platform?",
      answer: "Yes! StockFlow integrates with major ecommerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and many others. Integration enables automatic inventory sync, order import, and real-time stock updates across all your sales channels."
    },
    {
      question: "How does ecommerce inventory prevent overselling?",
      answer: "Ecommerce inventory management prevents overselling by synchronizing stock levels in real-time. When inventory reaches zero or goes below a threshold, products automatically become out of stock on your webshop. This ensures you never sell more products than you have available."
    },
    {
      question: "What features are essential for ecommerce inventory management?",
      answer: "Essential features include: real-time sync with webshops, multi-channel inventory management, automated low stock alerts, barcode scanning for fulfillment, order import from sales channels, batch processing for large catalogs, and integration APIs for custom platforms."
    }
  ];

  const ecommerceBenefits = [
    {
      benefit: "Prevent Overselling",
      description: "Never sell products you don't have. Real-time sync prevents overselling across all channels.",
      icon: Shield
    },
    {
      benefit: "Multi-Channel Sync",
      description: "Manage inventory across multiple sales channels - webshop, marketplace, retail store - from one system.",
      icon: LinkIcon
    },
    {
      benefit: "Automated Fulfillment",
      description: "Automatically update stock when orders are placed and processed, reducing manual work.",
      icon: Zap
    },
    {
      benefit: "Better Forecasting",
      description: "Analyze sales patterns to predict demand and optimize stock levels for peak seasons.",
      icon: TrendingUp
    }
  ];

  const structuredData = [
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
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Inventory Management for Ecommerce: Complete Guide",
      "description": "Perfect inventory solution for online stores. Sync with your webshop, prevent overselling, automate fulfillment, and manage multi-channel inventory from one system.",
      "image": "https://www.stockflow.be/Inventory-Management.png",
      "author": {
        "@type": "Organization",
        "name": "StockFlow"
      },
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.stockflow.be/logo.png"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.stockflow.be/inventory-for-ecommerce"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Inventory for Ecommerce",
          "item": "https://www.stockflow.be/inventory-for-ecommerce"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Inventory for Ecommerce">
      <SEO
        title="Inventory Management for Ecommerce | Prevent Overselling & Sync Webshop | StockFlow"
        description="Perfect inventory solution for online stores. Sync with webshops in real-time, prevent overselling, automate fulfillment, and manage multi-channel inventory. Free trial available."
        keywords="ecommerce inventory, webshop inventory, online store stock management, ecommerce fulfillment, ecommerce inventory software, webshop inventory management, online inventory sync, prevent overselling, multi-channel inventory"
        url="https://www.stockflow.be/inventory-for-ecommerce"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-for-ecommerce' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-webshop' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory for Ecommerce: <span className="text-blue-600">Seamless Integration with Your Online Store</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Perfect inventory solution for online stores. Sync with your webshop, prevent overselling, and automate fulfillment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                  View Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ Businesses</span>
              </div>
            </div>
            <div>
              <img 
                src="/Inventory-Management.png" 
                alt="Ecommerce inventory management dashboard showing real-time webshop synchronization, order tracking, and multi-channel stock control"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Ecommerce Businesses Need Inventory Software
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage inventory across multiple sales channels and prevent costly overselling mistakes
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {ecommerceBenefits.map((item, index) => (
              <div key={index} className="bg-blue-50 p-8 rounded-xl">
                <div className="flex items-start mb-4">
                  <item.icon className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.benefit}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Ecommerce Platform Integrations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingCart, title: "Shopify Integration", description: "Seamlessly sync inventory with your Shopify store. Automatic stock updates prevent overselling." },
              { icon: ShoppingCart, title: "WooCommerce Sync", description: "Connect StockFlow with WooCommerce for real-time inventory management on WordPress sites." },
              { icon: ShoppingCart, title: "Magento Connection", description: "Integrate with Magento for enterprise-level ecommerce inventory control." },
              { icon: LinkIcon, title: "Multi-Channel", description: "Manage inventory across Amazon, eBay, and other marketplaces from one dashboard." },
              { icon: Zap, title: "API Access", description: "Build custom integrations with our REST API for any ecommerce platform." },
              { icon: Shield, title: "Real-Time Sync", description: "Inventory updates instantly across all connected sales channels." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Webshop (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - voorraadbeheer voor webshops.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete inventory management solution for all business types.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/online-inventory-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Online Inventory Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Cloud-based inventory management accessible from anywhere.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Managing Your Ecommerce Inventory Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. Sync with your webshop in minutes. Prevent overselling and automate fulfillment. No credit card required.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}

