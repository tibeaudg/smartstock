import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Package,
  QrCode,
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Zap,
  ShoppingCart,
  Link2,
  RefreshCw,
  Cloud
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function ShopifyPlusWmsIntegration() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is Shopify Plus WMS integration?",
      answer: "Shopify Plus WMS integration connects your Shopify Plus store with a Warehouse Management System (WMS) to automatically sync inventory levels, orders, and product data. When a customer places an order on Shopify, the WMS receives the order details, updates inventory levels, and syncs stock counts back to Shopify in real-time. This eliminates manual data entry, prevents overselling, and ensures accurate inventory across all sales channels."
    },
    {
      question: "Why do Shopify Plus stores need WMS integration?",
      answer: "Shopify Plus stores selling high volumes need automated inventory management to prevent overselling, handle complex fulfillment workflows, manage multiple warehouses, track inventory across locations, and sync with other sales channels (Amazon, eBay, etc.). Manual inventory updates can't keep pace with high-volume sales, leading to overselling, stockouts, and customer dissatisfaction. WMS integration automates this process."
    },
    {
      question: "How does Shopify Plus WMS integration work?",
      answer: "Integration works through APIs: Shopify sends order data to the WMS when orders are placed. The WMS processes orders, updates inventory levels, and manages fulfillment. Inventory levels sync back to Shopify automatically. Product data (descriptions, prices, variants) can sync bidirectionally. StockFlow offers native Shopify integration that syncs inventory in real-time, preventing overselling and ensuring accurate stock levels."
    },
    {
      question: "What are the benefits of Shopify Plus WMS integration?",
      answer: "Key benefits include: automatic inventory sync (no manual updates), prevent overselling across channels, real-time stock visibility, multi-warehouse support, faster order fulfillment, accurate inventory reporting, and seamless multi-channel selling. Businesses typically see 99%+ inventory accuracy and eliminate overselling incidents completely."
    },
    {
      question: "Can WMS integration work with other e-commerce platforms?",
      answer: "Yes, modern WMS systems like StockFlow integrate with multiple e-commerce platforms including Shopify, Shopify Plus, WooCommerce, BigCommerce, Amazon, eBay, Etsy, and others. This enables true multi-channel inventory management where all sales channels share the same inventory pool, preventing overselling and ensuring accurate stock levels across all platforms."
    },
    {
      question: "How much does Shopify Plus WMS integration cost?",
      answer: `WMS integration costs vary. Basic integrations start at ${formatPrice(50)}/month. Enterprise solutions with advanced features can cost ${formatPrice(200)}-${formatPrice(1000)}/month. StockFlow offers Shopify Plus integration starting with a free plan for up to 30 products, with scalable pricing (€0.004 per product/month), making it affordable for growing e-commerce businesses.`
    },
    {
      question: "How long does it take to set up Shopify Plus WMS integration?",
      answer: "Setup time varies by complexity. Simple integrations can be configured in 1-2 hours. Complex multi-warehouse setups may take 1-2 days. StockFlow's Shopify integration can be set up in under 30 minutes: connect your Shopify store via API, map product fields, configure sync settings, and start syncing inventory automatically. No coding required."
    },
    {
      question: "What happens if the WMS integration goes offline?",
      answer: "Modern WMS systems handle offline scenarios gracefully. StockFlow stores order data locally and syncs when connection is restored. Inventory levels are cached to prevent overselling. Orders continue processing in the WMS even if Shopify connection is temporarily lost. Automatic retry mechanisms ensure data syncs once connectivity is restored."
    },
    {
      question: "What is the ROI of Shopify Plus WMS integration?",
      answer: "The ROI is typically very high. E-commerce businesses see: elimination of overselling (which can cost 20% of lost sales), 20+ hours saved per week on manual inventory updates, 15-25% reduction in carrying costs, 99%+ inventory accuracy, and ability to scale to high volumes without additional staff. Most businesses see ROI within the first month."
    },
    {
      question: "Can Shopify Plus WMS integration handle multiple warehouses?",
      answer: "Yes, modern WMS integrations like StockFlow support multiple warehouses. You can route orders to the nearest warehouse, track inventory across all locations, transfer stock between warehouses, and set location-specific reorder points. This is essential for high-volume Shopify Plus stores with multiple fulfillment centers."
    },
    {
      question: "Does Shopify Plus WMS integration work with Shopify (non-Plus)?",
      answer: "Yes, StockFlow integrates with both Shopify and Shopify Plus. The integration works the same way - automatically syncing inventory, orders, and product data. Shopify Plus stores may benefit from additional features like advanced reporting and dedicated support, but the core integration works for all Shopify plans."
    },
    {
      question: "How does Shopify Plus WMS integration prevent overselling?",
      answer: "Integration prevents overselling by: real-time inventory synchronization between Shopify and WMS, automatic stock level updates when orders are placed, inventory reservation when orders are created, and multi-channel inventory pooling. When inventory is low, the system automatically updates Shopify to prevent further sales until stock is replenished."
    },
    {
      question: "What data syncs between Shopify Plus and WMS?",
      answer: "Data that syncs includes: inventory levels (bidirectional), order details (from Shopify to WMS), order status updates (from WMS to Shopify), product information (descriptions, prices, variants), and fulfillment tracking. This ensures both systems always have accurate, up-to-date information."
    }
  ];

  const keyFeatures = [
    {
      icon: RefreshCw,
      title: "Real-Time Inventory Sync",
      description: "Automatic bidirectional sync of inventory levels between Shopify Plus and WMS in real-time, preventing overselling."
    },
    {
      icon: ShoppingCart,
      title: "Automatic Order Import",
      description: "Orders from Shopify Plus automatically import into WMS for fulfillment, with order status updates syncing back to Shopify."
    },
    {
      icon: Link2,
      title: "Multi-Channel Integration",
      description: "Sync inventory across Shopify Plus, Amazon, eBay, and other channels from one central WMS, preventing overselling."
    },
    {
      icon: BarChart3,
      title: "Inventory Reporting",
      description: "Unified reporting showing sales, inventory levels, and fulfillment metrics across all integrated channels."
    },
    {
      icon: Shield,
      title: "Overselling Prevention",
      description: "Real-time inventory checks prevent overselling by ensuring stock levels are accurate across all sales channels."
    },
    {
      icon: Cloud,
      title: "Cloud-Based Sync",
      description: "No on-premise servers required. Cloud-based integration ensures 99.9% uptime and automatic updates."
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "Eliminate overselling completely" },
    { icon: Clock, text: "Save 20+ hours per week on manual inventory updates" },
    { icon: DollarSign, text: "Reduce inventory carrying costs by 15-25%" },
    { icon: TrendingUp, text: "Scale to high-volume sales without manual work" },
    { icon: Zap, text: "Faster order fulfillment with automated workflows" },
    { icon: Shield, text: "99%+ inventory accuracy across all channels" }
  ];

  const integrationSteps = [
    {
      step: "1",
      title: "Connect Shopify Plus Store",
      description: "Authorize StockFlow to access your Shopify Plus store via secure API connection. No coding required."
    },
    {
      step: "2",
      title: "Map Product Fields",
      description: "Map product SKUs, variants, and inventory fields between Shopify Plus and WMS for accurate syncing."
    },
    {
      step: "3",
      title: "Configure Sync Settings",
      description: "Set sync frequency (real-time or scheduled), inventory update rules, and order import preferences."
    },
    {
      step: "4",
      title: "Test & Go Live",
      description: "Test with a few products first, verify inventory syncs correctly, then enable full integration."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Overselling Across Channels",
      problem: "Selling on Shopify Plus, Amazon, and eBay without integration leads to overselling when inventory sells out on one channel but isn't updated on others.",
      solution: "Real-time inventory sync ensures all channels share the same inventory pool, preventing overselling automatically."
    },
    {
      icon: Clock,
      title: "Manual Inventory Updates",
      problem: "Manually updating inventory in Shopify Plus after every sale is time-consuming and error-prone, especially for high-volume stores.",
      solution: "Automatic inventory sync eliminates manual updates, saving 20+ hours per week and ensuring 100% accuracy."
    },
    {
      icon: DollarSign,
      title: "Inventory Inaccuracy",
      problem: "Discrepancies between Shopify Plus and actual warehouse inventory lead to stockouts, overselling, and lost sales.",
      solution: "Bidirectional sync keeps Shopify Plus and WMS inventory levels identical in real-time, ensuring accuracy."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Shopify Plus WMS Integration 2025",
    "description": "Complete guide to Shopify Plus WMS integration. Automatically sync inventory, orders, and product data between Shopify Plus and warehouse management systems. Free plan available.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/solutions/shopify-plus-wms-integration"
    }
  };

  const faqStructuredData = {
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
  };

  return (
    <SeoPageLayout
      title="Shopify Plus WMS Integration 2025"
      heroTitle="Shopify Plus WMS Integration: Automate Inventory Sync & Order Fulfillment"
      description="Complete Shopify Plus WMS integration guide. Automatically sync inventory, orders, and product data between Shopify Plus and warehouse management systems. Prevent overselling. Free plan available."
      updatedDate="2025-01-15"
      faqData={faqData}
    >
      <SEO
        title="Shopify Plus WMS Integration 2025 - Prevent Overselling, Save 20+ Hours/Week | StockFlow"
        description="Shopify Plus WMS integration 2025 automates inventory sync and order fulfillment. Real-time sync, prevent overselling, multi-channel support. Save 20+ hours/week, 99%+ accuracy. Free plan for up to 100 products. Start free trial - no credit card required."
        keywords="shopify plus wms integration, shopify wms integration, shopify warehouse management, shopify inventory sync, shopify plus inventory management, shopify warehouse software, shopify inventory system, shopify wms software, shopify plus warehouse, ecommerce wms integration, stockflow, stock flow"
        url="https://www.stockflowsystems.com/solutions/shopify-plus-wms-integration"
        structuredData={[structuredData, faqStructuredData]}
      />

      <StructuredData data={[structuredData, faqStructuredData]} />

      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            <strong>Shopify Plus WMS integration</strong> connects your Shopify Plus store with a Warehouse Management System (WMS) to automatically sync inventory levels, orders, and product data in real-time. For high-volume Shopify Plus stores, manual inventory management becomes impossible - you need automated integration to prevent overselling, handle complex fulfillment workflows, and manage inventory across multiple warehouses and sales channels.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Modern <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> like StockFlow offers native Shopify Plus integration that syncs inventory automatically. When a customer places an order on Shopify Plus, the WMS receives order details, updates inventory levels, and syncs stock counts back to Shopify in real-time. This eliminates manual data entry, prevents overselling, and ensures accurate inventory across all sales channels including Amazon, eBay, and other marketplaces. Learn more about <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:underline font-semibold">inventory management software solutions</Link>.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Integration works through secure APIs: Shopify sends order data to the WMS when orders are placed, the WMS processes orders and manages fulfillment, and inventory levels sync back to Shopify automatically. Learn more about <Link to="/ecommerce-inventory-management" className="text-blue-600 hover:underline font-semibold">ecommerce inventory management</Link> for multi-channel sellers.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features of Shopify Plus WMS Integration
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Common Challenges Solved by WMS Integration
          </h2>
          <div className="grid md:grid-cols-1 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <challenge.icon className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{challenge.title}</h3>
                <p className="text-slate-600 mb-3"><strong>Problem:</strong> {challenge.problem}</p>
                <p className="text-slate-700"><strong>Solution:</strong> {challenge.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Benefits of Shopify Plus WMS Integration
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-lg">
                <benefit.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            How to Set Up Shopify Plus WMS Integration
          </h2>
          <div className="space-y-4">
            {integrationSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{step.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-slate-700">
            StockFlow's Shopify Plus integration can be set up in under 30 minutes with no coding required. Simply connect your Shopify Plus store via secure API, map product fields, configure sync settings, and start syncing inventory automatically. Test with a few products first, then enable full integration once verified.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Multi-Channel Inventory Management
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Modern WMS systems like StockFlow integrate with multiple e-commerce platforms, not just Shopify Plus. This enables true multi-channel inventory management where all sales channels (Shopify Plus, Amazon, eBay, Etsy, WooCommerce) share the same inventory pool. When a product sells on Amazon, inventory automatically decreases in Shopify Plus and all other channels, preventing overselling across all platforms.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            This unified approach eliminates the need to manually manage inventory across multiple platforms, reduces the risk of overselling, and provides a single source of truth for inventory levels. Learn more about <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> for comprehensive multi-channel support.
          </p>
        </div>
      </section>
    </SeoPageLayout>
  );
}

