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

export default function InventoryManagementSoftwareBillOfMaterials() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is inventory management software bill of materials?",
      answer: "Inventory management software bill of materials is an integrated system that combines inventory tracking with BOM functionality. This allows businesses to track both finished goods inventory and the components needed to build them, automatically calculate material requirements for production, and manage production planning. StockFlow offers comprehensive inventory management with built-in BOM capabilities."
    },
    {
      question: "How does inventory management software with bill of materials work?",
      answer: "Inventory management software bill of materials works by storing BOM structures for each product alongside inventory levels. When you create a production order, the system automatically calculates material requirements by multiplying BOM quantities by production quantity. It checks component availability and alerts you if materials are insufficient. The system tracks both finished goods and component inventory in one unified platform."
    },
    {
      question: "Why do I need inventory management software with bill of materials?",
      answer: "If you manufacture or assemble products, inventory management software bill of materials is essential because it: tracks both finished goods and components in one system, automatically calculates material requirements for production, prevents production delays by checking component availability, tracks component costs and total product costs, manages production planning, and optimizes purchasing decisions based on production schedules."
    },
    {
      question: "What features does inventory management software bill of materials include?",
      answer: "Inventory management software bill of materials should include: multi-level BOM creation and management, real-time inventory tracking for finished goods and components, automatic material requirements calculation, cost tracking and rollup, production order management, component availability alerts, integration with purchasing systems, and reporting on material usage and costs."
    },
    {
      question: "Can small manufacturers use inventory management software bill of materials?",
      answer: `Yes! Inventory management software bill of materials is perfect for small manufacturers. StockFlow offers a free plan starting at ${formatPrice(0)}/month for small businesses with up to 30 products, including full BOM functionality. As you grow, you can upgrade to plans with unlimited products and advanced features like automated MRP calculations.`
    },
    {
      question: "How does inventory management software bill of materials calculate material needs?",
      answer: "When you create a production order (e.g., build 100 units), inventory management software bill of materials multiplies each component quantity in the BOM by the production quantity. For example, if a BOM requires 2 screws per unit, producing 100 units requires 200 screws. The system checks your current inventory and alerts you if you're short on any components."
    },
    {
      question: "Does inventory management software bill of materials integrate with other systems?",
      answer: "Yes, modern inventory management software bill of materials like StockFlow integrates with accounting software (QuickBooks, Xero), e-commerce platforms (Shopify, WooCommerce), ERP systems, and purchasing platforms. This ensures seamless data flow from production planning through inventory tracking to financial reporting."
    }
  ];

  const features = [
    {
      icon: Layers,
      title: "Integrated BOM & Inventory",
      description: "Manage bills of materials and inventory in one unified system. Track both finished goods and components seamlessly."
    },
    {
      icon: Database,
      title: "Real-Time Tracking",
      description: "See real-time availability of components and finished products across all locations and sales channels."
    },
    {
      icon: Zap,
      title: "Automatic Calculations",
      description: "Automatically calculate material requirements based on production schedules and BOM structures."
    },
    {
      icon: DollarSign,
      title: "Cost Management",
      description: "Track component costs and automatically calculate total product costs for accurate pricing decisions."
    },
    {
      icon: Shield,
      title: "Availability Alerts",
      description: "Receive instant alerts when component inventory is low or insufficient for planned production."
    },
    {
      icon: BarChart3,
      title: "Production Planning",
      description: "Plan production runs based on BOM requirements and available inventory with data-driven insights."
    }
  ];

  return (
    <SeoPageLayout
      title="Inventory Management Software Bill of Materials | BOM Integration"
      heroTitle="Inventory Management Software Bill of Materials"
      description="Complete inventory management software with integrated bill of materials. Track finished goods and components, calculate material requirements, and manage production in one system."
      updatedDate="25/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Software Bill of Materials 2025 | BOM Integration | StockFlow"
        description="Get inventory management software with bill of materials integration. Track finished goods and components, calculate material requirements automatically, and manage production planning. Free plan for up to 100 products. Start free trial."
        keywords="inventory management software bill of materials, inventory software bill of materials, inventory management with bom, bom inventory management software, inventory system with bill of materials, stock management with bom, manufacturing inventory with bom, production inventory software, assembly inventory management, bom inventory software, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/inventory-management-software-bill-of-materials"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Inventory Management Software Bill of Materials
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Combine <strong>inventory management software</strong> with <strong>bill of materials</strong> functionality to track both finished goods and components in one integrated system. Automatically calculate material requirements, manage production planning, and optimize your manufacturing operations. StockFlow's <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> provides comprehensive BOM integration. Learn more about <Link to="/bill-of-materials-inventory-management" className="text-blue-600 hover:underline font-semibold">bill of materials inventory management</Link> or explore <Link to="/solutions/inventory-management-software-with-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software with bill of materials</Link>.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Why Choose Integrated BOM and Inventory Management?</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Track finished goods and components in one system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Automatically calculate material requirements for production</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Prevent production delays with component availability alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Track costs from components to finished products</span>
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
            What is Inventory Management Software Bill of Materials?
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Inventory management software bill of materials</strong> is an integrated system that combines traditional inventory tracking with BOM management capabilities. Unlike basic inventory software that only tracks finished products, this solution tracks both finished goods and the components needed to build them, automatically calculates material requirements, and manages production planning—all in one platform.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            For manufacturing and assembly businesses, <strong>inventory management software bill of materials</strong> is essential. It eliminates manual calculations, prevents production delays, and provides complete visibility into both finished goods and component inventory. StockFlow combines comprehensive <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> with powerful BOM functionality, making it the perfect solution for manufacturers. Explore <Link to="/solutions/inventory-management-software-with-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software with bill of materials</Link> options or learn about <Link to="/bill-of-materials-inventory-management" className="text-blue-600 hover:underline font-semibold">bill of materials inventory management</Link>.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features of Inventory Management Software Bill of Materials
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage inventory and production in one integrated platform
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
              Get Started with Inventory Management Software Bill of Materials
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              StockFlow offers comprehensive inventory management with integrated BOM functionality. Start with our free plan and scale as you grow.
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
          "name": "StockFlow - Inventory Management with BOM",
          "description": "Inventory management software with integrated bill of materials. Track finished goods and components, calculate material requirements, and manage production.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 30 products with BOM management",
              "availability": "https://schema.org/InStock"
            }
          ]
        }
      ]} />
    </SeoPageLayout>
  );
}

