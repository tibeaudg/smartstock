import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';
import VideoModal from '@/components/VideoModal';
import {
  Package,
  Layers,
  Settings,
  CheckCircle,
  TrendingUp,
  Zap,
  Users,
  Shield,
  Clock,
  Target,
  AlertCircle,
  ArrowRight,
  BarChart3,
  FileText,
  Link2,
  Building2,
  DollarSign,
  Star,
  Database
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryManagementSoftwareWithBillOfMaterials() {
  usePageRefresh();
  const { formatPrice } = useCurrency();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const faqData = [
    {
      question: "What is inventory management software with bill of materials?",
      answer: "Inventory management software with bill of materials (BOM) is an integrated system that combines traditional inventory tracking with BOM management capabilities. This allows manufacturers to track both finished goods and the components needed to build them, automatically calculate material requirements, and manage production planning. StockFlow offers comprehensive inventory management with built-in BOM functionality, making it perfect for manufacturing businesses."
    },
    {
      question: "Why do I need inventory management software with bill of materials?",
      answer: "If you manufacture or assemble products, you need to track both your finished goods inventory and the components required to build them. Inventory management software with BOM helps you: automatically calculate material needs for production orders, prevent production delays due to missing components, track component costs and total product costs, manage multi-level assemblies, and optimize purchasing based on production schedules."
    },
    {
      question: "How does BOM integration work with inventory management?",
      answer: "When you create a production order in inventory management software with BOM, the system automatically checks your inventory levels for all required components. If any components are insufficient, you receive alerts before production starts. The system can also generate purchase orders for missing materials and track component usage as products are assembled. This integration ensures you always have the right materials available when needed."
    },
    {
      question: "Can I use inventory management software with BOM for small manufacturing?",
      answer: `Yes! StockFlow offers inventory management software with BOM starting at ${formatPrice(0)}/month for small manufacturers. The free plan supports up to 30 products with full BOM functionality, making it perfect for startups and small businesses. As you grow, you can upgrade to plans with unlimited products and advanced features like automated MRP calculations.`
    },
    {
      question: "What features should inventory management software with BOM have?",
      answer: "The best inventory management software with BOM should include: multi-level BOM creation and management, real-time inventory tracking for both finished goods and components, automatic material requirements calculation, cost tracking and rollup, production order management, component availability alerts, integration with purchasing and accounting systems, and reporting on material usage and costs."
    },
    {
      question: "How does inventory management software with BOM calculate material requirements?",
      answer: "When you create a production order (e.g., build 100 units), the software multiplies each component quantity in the BOM by the production quantity. For example, if a BOM requires 2 screws per unit, producing 100 units requires 200 screws. The system checks your current inventory and alerts you if you're short on any components. Advanced systems can also consider lead times and safety stock levels."
    },
    {
      question: "Is inventory management software with BOM suitable for custom manufacturing?",
      answer: "Absolutely! Inventory management software with BOM is ideal for custom manufacturing because it allows you to create unique BOMs for each custom order, track component usage across different product variations, manage material costs for custom pricing, and maintain inventory accuracy even with high product variety. StockFlow supports unlimited BOMs and product variations."
    },
    {
      question: "Can inventory management software with BOM integrate with my existing systems?",
      answer: "Yes, modern inventory management software with BOM like StockFlow integrates with accounting software (QuickBooks, Xero), e-commerce platforms (Shopify, WooCommerce), ERP systems, and purchasing platforms. This ensures seamless data flow from production planning through inventory tracking to financial reporting."
    },
    {
      question: "What's the difference between basic inventory software and software with BOM?",
      answer: "Basic inventory management software tracks quantities of finished products only. Inventory management software with BOM tracks both finished products AND the components needed to build them, calculates material requirements automatically, manages production planning, tracks component costs, and provides material availability alerts. This makes it essential for any manufacturing or assembly business."
    },
    {
      question: "How long does it take to implement inventory management software with BOM?",
      answer: "Cloud-based solutions like StockFlow can be set up in days rather than weeks. Most businesses are fully operational within 1-2 weeks, including: importing your product catalog and BOMs, setting up inventory locations, configuring reorder points, training your team, and integrating with existing systems. The key is choosing user-friendly software that doesn't require extensive IT support."
    },
    {
      question: "What is the ROI of inventory management software with BOM?",
      answer: "The ROI is typically very high. Manufacturers see: 30-40% reduction in material waste, 25% reduction in carrying costs, prevention of production delays (which can cost thousands per day), improved cost accuracy for pricing, and 20-30% time savings on material planning. Most businesses see ROI within the first month."
    },
    {
      question: "Can inventory management software with BOM handle multi-level assemblies?",
      answer: "Yes, advanced inventory management software with BOM supports multi-level assemblies where components themselves are assemblies. For example, a finished product may contain a sub-assembly, which contains individual components. The system automatically calculates requirements at all levels and tracks inventory accordingly."
    },
    {
      question: "How does inventory management software with BOM help with cost control?",
      answer: "BOM-integrated inventory software helps with cost control by: tracking component costs and calculating total product costs automatically, identifying cost variances when component prices change, providing cost rollup analysis to see where costs come from, enabling accurate pricing based on actual material costs, and identifying opportunities to reduce costs through component substitution."
    },
    {
      question: "Is inventory management software with BOM suitable for make-to-order manufacturing?",
      answer: "Yes, inventory management software with BOM is ideal for make-to-order manufacturing. You can create BOMs for custom orders, check component availability before accepting orders, automatically reserve components for specific orders, track material usage per order, and maintain accurate costs for custom pricing. This ensures you can fulfill custom orders profitably."
    }
  ];

  const features = [
    {
      icon: Layers,
      title: "Integrated BOM Management",
      description: "Create and manage multi-level bills of materials directly within your inventory system. Track component relationships and assembly structures with ease."
    },
    {
      icon: Database,
      title: "Unified Inventory Tracking",
      description: "Track both finished goods and raw materials in a single system. See real-time availability of components and finished products across all locations."
    },
    {
      icon: Zap,
      title: "Automatic Material Requirements",
      description: "Automatically calculate material needs based on production schedules and BOM structures. Never run out of components during production."
    },
    {
      icon: DollarSign,
      title: "Cost Tracking & Rollup",
      description: "Track component costs and automatically calculate total product costs. Make informed pricing decisions with accurate cost data."
    },
    {
      icon: AlertCircle,
      title: "Component Availability Alerts",
      description: "Receive instant alerts when component inventory is low or insufficient for planned production. Prevent production delays proactively."
    },
    {
      icon: BarChart3,
      title: "Production Planning Tools",
      description: "Plan production runs based on BOM requirements and available inventory. Optimize your manufacturing workflow with data-driven insights."
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Prevent Production Delays",
      description: "Automatic material requirement calculations ensure you always have components available when needed, preventing costly production stoppages."
    },
    {
      icon: Clock,
      title: "Save Planning Time",
      description: "Automated BOM calculations save 5-10 hours per week on manual material planning and purchasing decisions."
    },
    {
      icon: DollarSign,
      title: "Improve Cost Accuracy",
      description: "Real-time cost tracking helps set accurate prices and improve profit margins by 15-25% through better cost visibility."
    },
    {
      icon: Shield,
      title: "Reduce Material Waste",
      description: "Accurate BOM calculations prevent over-ordering and reduce material waste by up to 30%."
    }
  ];

  return (
    <SeoPageLayout
      title="Inventory Management Software with Bill of Materials | BOM Integration"
      heroTitle="Inventory Management Software with Bill of Materials"
      description="Complete inventory management software with integrated bill of materials (BOM) functionality. Track finished goods and components, calculate material requirements, and manage production with StockFlow."
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Software with Bill of Materials 2025 | BOM Integration | StockFlow"
        description="Get inventory management software with bill of materials (BOM) integration. Track finished goods and components, calculate material requirements automatically, and manage production planning. Free plan for up to 100 products. Start free trial."
        keywords="inventory management software with bill of materials, inventory management with bom, bom inventory management, inventory software with bill of materials, inventory management system with bom, stock management with bom, inventory tracking with bill of materials, manufacturing inventory software with bom, assembly inventory management, production inventory software, bom inventory management software, stockflow, stock flow"
        url="https://www.stockflowsystems.com/solutions/inventory-management-software-with-bill-of-materials"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Inventory Management Software with Bill of Materials
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Combine <strong>inventory management software with bill of materials</strong> functionality to track both finished goods and components in one integrated system. Automatically calculate material requirements, manage production planning, and optimize your manufacturing operations—all from a single platform. StockFlow's <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> provides comprehensive BOM integration. Learn more about <Link to="/bill-of-materials-inventory-management" className="text-blue-600 hover:underline font-semibold">bill of materials inventory management</Link> or explore <Link to="/solutions/inventory-management-software-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software bill of materials</Link>.
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
            What is Inventory Management Software with Bill of Materials?
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Inventory management software with bill of materials</strong> is an integrated system that combines traditional inventory tracking with BOM management capabilities. Unlike basic inventory software that only tracks finished products, this solution tracks both finished goods and the components needed to build them, automatically calculates material requirements, and manages production planning.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Traditional Inventory Management
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Basic inventory software tracks quantities of finished products only. You manually calculate material needs and manage production planning separately.
              </p>
              <p className="text-sm text-gray-600">
                Example: Track 100 finished chairs in stock, but manually calculate that you need 400 legs, 100 seats, and 1,600 screws.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6 text-green-600" />
                Inventory Management with BOM
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Integrated system tracks finished goods AND components. Automatically calculates material requirements and manages production planning.
              </p>
              <p className="text-sm text-gray-600">
                Example: System knows 100 chairs = 400 legs + 100 seats + 1,600 screws. Automatically checks component availability and alerts you if short.
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            For manufacturing and assembly businesses, <strong>inventory management software with bill of materials</strong> is essential. It eliminates manual calculations, prevents production delays, and provides complete visibility into both finished goods and component inventory. StockFlow combines comprehensive <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> with powerful BOM functionality, making it the perfect solution for manufacturers. Explore <Link to="/solutions/inventory-management-software-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software bill of materials</Link> options.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features of Inventory Management Software with BOM
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

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How Inventory Management Software with BOM Works
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Inventory management software with bill of materials</strong> streamlines your entire production workflow:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                Create Your BOMs
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Build bills of materials for each product, defining all components and quantities needed. The system stores these BOMs and links them to your finished goods inventory.
              </p>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                Plan Production Orders
              </h3>
              <p className="text-gray-700 leading-relaxed">
                When you create a production order (e.g., build 100 units), the system automatically calculates material requirements by multiplying BOM quantities by production quantity.
              </p>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                Check Component Availability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The system checks your current inventory levels for all required components. If any components are insufficient, you receive immediate alerts before production starts.
              </p>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</span>
                Generate Purchase Orders
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Based on material requirements and current inventory, the system can automatically generate purchase orders for missing components, ensuring you have everything needed for production.
              </p>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">5</span>
                Track Production and Costs
              </h3>
              <p className="text-gray-700 leading-relaxed">
                As you build products, the system tracks component usage, updates inventory levels, and calculates total product costs based on component costs. This provides complete visibility into your production costs.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-gray-800 leading-relaxed font-medium">
              StockFlow's <strong>inventory management software with bill of materials</strong> integrates seamlessly with <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:underline font-semibold">inventory management software solutions</Link>, providing a complete production management system in one platform. Learn more about <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> or see our <Link to="/solutions/inventory-management-systems-solutions" className="text-blue-600 hover:underline font-semibold">inventory management systems solutions</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits of Inventory Management Software with BOM
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real results from using integrated BOM and inventory management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
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
              Get Started with Inventory Management Software with BOM
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
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors text-lg"
              >
                View Demo
              </button>
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
          "@type": "Article",
          "headline": "Inventory Management Software with Bill of Materials | BOM Integration",
          "description": "Complete guide to inventory management software with bill of materials. Learn how integrated BOM and inventory management helps manufacturers track components, calculate material requirements, and manage production.",
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
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflowsystems.com/solutions/inventory-management-software-with-bill-of-materials"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Inventory Management with BOM",
          "description": "Inventory management software with integrated bill of materials functionality. Track finished goods and components, calculate material requirements, and manage production planning.",
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
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          }
        }
      ]} />
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </SeoPageLayout>
  );
}

