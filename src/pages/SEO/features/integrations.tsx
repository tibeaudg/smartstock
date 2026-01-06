import IntegrationsPage from '@/pages/integrations';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  CheckCircle, 
  ArrowRight,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Database,
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react';


const faqData = [
  {
    question: "What integrations does StockFlow support?",
    answer: "StockFlow integrates with 45+ business tools including e-commerce platforms (Shopify, Amazon, WooCommerce, BigCommerce), accounting software (QuickBooks, Xero, Sage), POS systems (Square, Lightspeed), payment processors (Stripe), and more. We also offer API access for custom integrations."
  },
  {
    question: "How do inventory integrations work?",
    answer: "Inventory integrations connect StockFlow with your other business systems through secure APIs. When a sale occurs on Shopify, inventory automatically updates in StockFlow. When you receive stock, it syncs to your accounting software. This eliminates manual data entry and ensures all systems stay synchronized in real-time."
  },
  {
    question: "Can I integrate StockFlow with my e-commerce store?",
    answer: "Yes! StockFlow integrates with major e-commerce platforms including Shopify, WooCommerce, Amazon, BigCommerce, Wix, and Etsy. Inventory levels sync automatically across all channels, preventing overselling and ensuring accurate stock counts. Learn more about ecommerce inventory management."
  },
  {
    question: "Does StockFlow integrate with accounting software?",
    answer: "Yes, StockFlow integrates with popular accounting software including QuickBooks, Xero, Sage, and Exact Online. Inventory transactions, purchase orders, and stock valuations automatically sync to your accounting system, eliminating double data entry and ensuring financial accuracy."
  },
  {
    question: "How long does it take to set up integrations?",
    answer: "Most integrations can be set up in minutes. Simply connect your accounts through StockFlow's integration dashboard, authorize the connection, and inventory will start syncing automatically. Complex integrations may take 1-2 hours with our support team's assistance."
  },
  {
    question: "What is the ROI of inventory integrations?",
    answer: "The ROI is typically very high. Businesses see: 10+ hours saved per week on manual data entry, 99%+ inventory accuracy across channels, elimination of overselling, 25% reduction in carrying costs, and improved cash flow. Most businesses see ROI within the first month through time savings alone."
  },
  {
    question: "Can I use StockFlow's API for custom integrations?",
    answer: "Yes, StockFlow offers a comprehensive REST API that allows you to build custom integrations with any system. The API supports inventory management, order processing, product management, and reporting. Documentation and developer support are available for all API users."
  },
  {
    question: "Do integrations work in real-time?",
    answer: "Yes, most StockFlow integrations sync in real-time. When inventory changes in one system, it updates automatically in all connected systems within seconds. This ensures accurate stock levels across all channels and prevents overselling or stockouts."
  },
  {
    question: "What happens if an integration fails?",
    answer: "StockFlow monitors all integrations continuously. If a connection fails, you'll receive immediate notifications, and the system will automatically retry the sync. Failed transactions are logged for review, and our support team can help resolve any integration issues quickly."
  },
  {
    question: "Are there additional costs for integrations?",
    answer: "Most integrations are included in your StockFlow plan at no additional cost. Premium integrations or high-volume API usage may have associated fees, which are clearly disclosed before activation. The free plan includes access to core integrations like Shopify and QuickBooks."
  }
];

const integrationCategories = [
  {
    icon: ShoppingCart,
    title: "E-commerce Platforms",
    description: "Connect with Shopify, Amazon, WooCommerce, BigCommerce, Wix, Etsy, and more. Real-time inventory sync prevents overselling across all channels.",
    integrations: ["Shopify", "Amazon", "WooCommerce", "BigCommerce", "Wix", "Etsy"]
  },
  {
    icon: BarChart3,
    title: "Accounting Software",
    description: "Sync inventory transactions, purchase orders, and valuations with QuickBooks, Xero, Sage, and Exact Online. Eliminate double data entry.",
    integrations: ["QuickBooks", "Xero", "Sage", "Exact Online"]
  },
  {
    icon: CreditCard,
    title: "Payment Processors",
    description: "Process payments seamlessly with Stripe integration. Manage subscriptions, invoices, and payment workflows directly from StockFlow.",
    integrations: ["Stripe", "Square", "PayPal"]
  },
  {
    icon: Database,
    title: "Database & Infrastructure",
    description: "Leverage Supabase for real-time database updates, authentication, and scalable infrastructure. Build custom solutions with our API.",
    integrations: ["Supabase", "Custom API", "Webhooks"]
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Inventory Management Integrations - StockFlow",
    "description": "Connect StockFlow with 45+ business tools. Integrate Shopify, Amazon, QuickBooks, Xero, WooCommerce. Automate inventory sync, save 10+ hours/week.",
    "url": "https://www.stockflowsystems.com/features/integrations",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow Integrations",
      "description": "Powerful integrations for inventory management",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      }
    }
  },
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
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.stockflowsystems.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Features",
        "item": "https://www.stockflowsystems.com/features"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Integrations",
        "item": "https://www.stockflowsystems.com/features/integrations"
      }
    ]
  }
];

export default function SEOIntegrationsPage() {
  usePageRefresh();
  
  

  return (
    <SeoPageLayout 
      title="Integrations"
      heroTitle="Integrations: Connect Your Business Tools"
      previousArticle={{
        title: "Mobile Inventory Management",
        href: "/mobile-inventory-management"
      }}
      nextArticle={{
        title: "Advanced Features",
        href: "/advanced-features"
      }}
    >
      <SEO
        title="Inventory Management Integrations 2026 - 45+ Connections, Save Time | StockFlow"
        description="Connect StockFlow with 45+ business tools 2026. Integrate Shopify, Amazon, QuickBooks, Xero, WooCommerce. Automate inventory sync, save 10+ hours/week. Free plan available. Join for Free - no credit card required."
        keywords="inventory integrations, inventory management integrations, e-commerce integrations, accounting integrations, POS integrations, Shopify integration, QuickBooks integration, inventory API, stockflow integrations"
        url="https://www.stockflowsystems.com/features/integrations"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />




      {/* Introduction Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Connect StockFlow with <span className="text-blue-600">45+ Business Tools</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              StockFlow integrates seamlessly with your existing business systems, eliminating manual data entry and ensuring real-time synchronization across all platforms. Connect your e-commerce stores, accounting software, POS systems, and more to create a unified inventory management ecosystem.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              With StockFlow integrations, businesses save  on manual data entry, achieve 99%+ inventory accuracy across channels, and eliminate overselling. Our integrations work in real-time, automatically syncing inventory levels, orders, and transactions between systems.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integration Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect StockFlow with the tools you already use to streamline operations and automate workflows
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {integrationCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition">
                <category.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.integrations.map((integration, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits of StockFlow Integrations
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save 10+ Hours Weekly</h3>
              <p className="text-gray-600">Eliminate manual data entry with automatic synchronization across all connected systems.</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">99%+ Accuracy</h3>
              <p className="text-gray-600">Real-time sync ensures inventory levels are always accurate across all channels and systems.</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Inventory changes sync instantly across all platforms, preventing overselling and stockouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How StockFlow Integrations Work
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Setting up integrations is quick and easy. Connect your accounts and start syncing in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Accounts</h3>
              <p className="text-gray-600">Authorize StockFlow to connect with your e-commerce, accounting, or POS systems through secure OAuth connections.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure Sync Settings</h3>
              <p className="text-gray-600">Choose what data to sync, set sync frequency, and configure field mappings to match your workflow.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Syncing</h3>
              <p className="text-gray-600">Inventory, orders, and transactions automatically sync in real-time. Monitor sync status and resolve any issues from the dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Common Integration Use Cases
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Multi-Channel E-commerce</h3>
              <p className="text-gray-600 mb-3">
                Connect Shopify, Amazon, and WooCommerce to sync inventory across all channels. When a product sells on one platform, stock automatically updates everywhere, preventing overselling and ensuring accurate fulfillment.
              </p>
              <Link to="/ecommerce-inventory-management" className="text-blue-600 hover:underline font-semibold inline-flex items-center">
                Learn more about e-commerce inventory <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Accounting Automation</h3>
              <p className="text-gray-600 mb-3">
                Sync inventory transactions, purchase orders, and stock valuations with QuickBooks or Xero. Eliminate manual journal entries and ensure financial records stay accurate automatically.
              </p>
              <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold inline-flex items-center">
                Explore inventory software solutions <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">POS Integration</h3>
              <p className="text-gray-600 mb-3">
                Connect Square, Lightspeed, or other POS systems to automatically update inventory when sales occur in-store. Real-time sync ensures online and in-store inventory stay synchronized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Connecting Your Business Tools Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Connect StockFlow with your existing systems and start saving time immediately. Most integrations take just minutes to set up.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Join for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Component Wrapper */}
      <IntegrationsPage />


    </SeoPageLayout>
  );
}

