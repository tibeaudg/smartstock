import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Package,
  Layers,
  Settings,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  BarChart3,
  FileText,
  Link2,
  DollarSign,
  Database
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function BillOfMaterialsInventoryManagement() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is bill of materials inventory management?",
      answer: "Bill of materials inventory management is an integrated approach that combines BOM management with inventory tracking. This system tracks both the components needed to build products (via BOMs) and the actual inventory levels of those components and finished goods. It automatically calculates material requirements, checks component availability, and manages production planning based on inventory levels."
    },
    {
      question: "How does bill of materials inventory management work?",
      answer: "Bill of materials inventory management works by storing BOM structures that define what components are needed for each product, while simultaneously tracking inventory levels of both components and finished goods. When you plan production, the system multiplies BOM quantities by production quantity, checks current inventory levels, and alerts you if components are insufficient. This ensures you always have the right materials available for production."
    },
    {
      question: "Why is bill of materials inventory management important?",
      answer: "Bill of materials inventory management is essential because it: prevents production delays by ensuring component availability, eliminates manual material requirement calculations, tracks costs from components to finished products, optimizes purchasing based on production schedules, reduces material waste through accurate planning, and provides complete visibility into both component and finished goods inventory."
    },
    {
      question: "What features does bill of materials inventory management include?",
      answer: "Bill of materials inventory management should include: multi-level BOM creation and management, real-time inventory tracking for components and finished goods, automatic material requirements calculation, component availability checking, cost tracking and rollup, production order management, purchase order generation, and reporting on material usage and inventory levels."
    },
    {
      question: "Can small manufacturers use bill of materials inventory management?",
      answer: `Yes! Bill of materials inventory management is perfect for small manufacturers. StockFlow offers a free plan starting at ${formatPrice(0)}/month for small businesses with up to 30 products, including full BOM and inventory management functionality. As you grow, you can upgrade to plans with unlimited products and advanced features.`
    },
    {
      question: "How does bill of materials inventory management prevent stockouts?",
      answer: "Bill of materials inventory management prevents stockouts by automatically checking component availability when you create production orders. The system multiplies BOM quantities by production quantity, compares this to current inventory levels, and alerts you immediately if any components are insufficient. This allows you to order materials before production starts, preventing costly delays."
    },
    {
      question: "Does bill of materials inventory management integrate with purchasing?",
      answer: "Yes, modern bill of materials inventory management systems like StockFlow integrate with purchasing systems to automatically generate purchase orders for missing components. Based on production schedules and BOM requirements, the system calculates what needs to be ordered and can create purchase orders automatically, ensuring you always have materials available for production."
    }
  ];

  const features = [
    {
      icon: Layers,
      title: "BOM & Inventory Integration",
      description: "Seamlessly combine BOM management with inventory tracking. See component availability in real-time."
    },
    {
      icon: Database,
      title: "Unified Tracking",
      description: "Track both finished goods and raw materials in a single system with real-time visibility across all locations."
    },
    {
      icon: Zap,
      title: "Automatic Material Planning",
      description: "Automatically calculate material needs based on production schedules and current inventory levels."
    },
    {
      icon: DollarSign,
      title: "Cost Management",
      description: "Track component costs and automatically calculate total product costs for accurate pricing."
    },
    {
      icon: Shield,
      title: "Availability Alerts",
      description: "Receive instant alerts when component inventory is low or insufficient for planned production."
    },
    {
      icon: BarChart3,
      title: "Production Optimization",
      description: "Optimize production planning based on BOM requirements and available inventory with data-driven insights."
    }
  ];

  return (
    <SeoPageLayout
      title="Bill of Materials Inventory Management | BOM & Inventory Integration"
      heroTitle="Bill of Materials Inventory Management"
      description="Complete bill of materials inventory management system. Track components and finished goods, calculate material requirements, and manage production with integrated BOM and inventory tracking."
      updatedDate="25/11/2025"
      faqData={faqData}
    >
      <SEO
        title="BOM Inventory Management 2025 | Integrated System | StockFlow"
        description="Integrated bill of materials inventory management tracks components and finished goods in one system. Calculate material requirements automatically, prevent production delays, and optimize purchasing. Free plan available."
        keywords="bill of materials inventory management, bom inventory management, inventory management with bill of materials, bom and inventory management, bill of materials stock management, manufacturing inventory with bom, production inventory management, assembly inventory with bom, integrated bom inventory, stockflow, stock flow"
        url="https://www.stockflow.be/bill-of-materials-inventory-management"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Bill of Materials Inventory Management
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Integrate <strong>bill of materials</strong> with <strong>inventory management</strong> to track components and finished goods in one unified system. Automatically calculate material requirements, check component availability, and optimize production planning based on real-time inventory levels.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Why Use Bill of Materials Inventory Management?</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Track components and finished goods in one system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Automatically check component availability before production</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Prevent production delays with real-time inventory alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Optimize purchasing based on production schedules</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What is Bill of Materials Inventory Management?
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Bill of materials inventory management</strong> is an integrated approach that combines BOM management with inventory tracking. This system tracks both the components needed to build products (via BOMs) and the actual inventory levels of those components and finished goods. It automatically calculates material requirements, checks component availability, and manages production planning based on inventory levels. This integration eliminates manual calculations and prevents production delays due to missing components.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            For manufacturing businesses, <strong>bill of materials inventory management</strong> is essential because it eliminates the disconnect between production planning and inventory availability. Instead of manually calculating material needs and checking inventory separately, the integrated system does both automatically, ensuring you always have the right materials available when needed. StockFlow combines comprehensive <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> with powerful <Link to="/bill-of-materials-management-software" className="text-blue-600 hover:underline font-semibold">BOM management software</Link> functionality for complete production control. Learn more about <Link to="/solutions/inventory-management-software-with-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software with bill of materials</Link> integration.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features of Bill of Materials Inventory Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage BOMs and inventory in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* StockFlow CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started with Bill of Materials Inventory Management
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              StockFlow offers comprehensive bill of materials inventory management with integrated tracking. Start with our free plan and scale as you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors text-lg"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
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
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - BOM Inventory Management",
          "description": "Integrated bill of materials inventory management system. Track components and finished goods, calculate material requirements automatically, and manage production planning in one platform.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "2.0",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 30 products with BOM and inventory management",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-01-01"
            },
            {
              "@type": "Offer",
              "price": "29",
              "priceCurrency": "EUR",
              "description": "Growth plan - Unlimited products with advanced BOM features",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-01-01"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Multi-level BOM management",
            "Real-time inventory tracking",
            "Automatic material requirements calculation",
            "Component availability checking",
            "Production planning",
            "Cost tracking and rollup",
            "Multi-location support"
          ],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/bill-of-materials-inventory-management"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Bill of Materials Inventory Management: Complete Integration Guide",
          "description": "Learn how integrated BOM and inventory management systems track components and finished goods, calculate material requirements, and prevent production delays.",
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
            "@id": "https://www.stockflow.be/bill-of-materials-inventory-management"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}

