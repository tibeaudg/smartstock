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
  Star
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function BillOfMaterialsManagementSoftware() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is bill of materials management software?",
      answer: "Bill of materials management software is a specialized tool that helps manufacturing and assembly businesses create, manage, and track bills of materials (BOMs). A BOM is a comprehensive list of all components, parts, and materials needed to build a product. BOM management software tracks hierarchical relationships between finished products and their constituent parts, calculates material requirements, manages multi-level assemblies, and helps optimize production planning."
    },
    {
      question: "Why do I need bill of materials management software?",
      answer: "If you manufacture or assemble products, bill of materials management software is essential for: creating and maintaining accurate BOMs, calculating material requirements for production orders, tracking component costs and total product costs, managing multi-level assemblies, preventing production delays due to missing components, optimizing purchasing decisions, and maintaining production history through BOM versioning."
    },
    {
      question: "How does bill of materials management software work?",
      answer: "Bill of materials management software works by storing BOM structures (lists of components and quantities) for each product. When you create a production order, the software multiplies BOM quantities by the production quantity to calculate total material needs. It then checks inventory levels and alerts you if components are insufficient. Advanced systems can also generate purchase orders automatically and track component usage as products are assembled."
    },
    {
      question: "What features should bill of materials management software have?",
      answer: "The best bill of materials management software should include: multi-level BOM creation and management, component and quantity tracking, material requirements planning (MRP), cost tracking and rollup, BOM versioning and revision control, integration with inventory management systems, production order management, component availability alerts, reporting and analytics, and export capabilities."
    },
    {
      question: "How much does bill of materials management software cost?",
      answer: `Bill of materials management software pricing varies, but StockFlow offers a free plan for small manufacturers with up to 30 products. Premium plans start at ${formatPrice(29)}/month for unlimited products and advanced features like automated MRP calculations. Most solutions offer free trials to test the software before committing.`
    },
    {
      question: "Can bill of materials management software integrate with inventory systems?",
      answer: "Yes, modern bill of materials management software like StockFlow integrates seamlessly with inventory management systems. This integration allows you to check component availability in real-time, track component usage as products are assembled, automatically update inventory levels, and generate purchase orders for missing materials. The integration ensures you always have the right materials available for production."
    },
    {
      question: "Is bill of materials management software suitable for small manufacturers?",
      answer: "Absolutely! Bill of materials management software is especially beneficial for small manufacturers as it helps automate material planning, reduce errors, and provides insights that were previously only available to large enterprises. StockFlow is specifically designed for SMEs and growing businesses, with a free plan perfect for startups."
    },
    {
      question: "What's the difference between BOM software and inventory management software?",
      answer: "BOM (Bill of Materials) software focuses on managing the recipe or structure of how products are assembled from components, tracking relationships between finished goods and their parts. Inventory management software tracks quantities, locations, and movements of stock items. Many modern solutions like StockFlow combine both: BOM management for production planning and inventory management for stock control."
    }
  ];

  const features = [
    {
      icon: Layers,
      title: "Multi-Level BOM Management",
      description: "Create complex assemblies with unlimited levels. Track parent-child relationships between components and sub-assemblies."
    },
    {
      icon: Package,
      title: "Material Requirements Planning",
      description: "Automatically calculate material needs based on production schedules. Never run out of components during production."
    },
    {
      icon: BarChart3,
      title: "Cost Tracking & Analysis",
      description: "Track component costs and calculate total product costs automatically. Make informed pricing decisions."
    },
    {
      icon: Link2,
      title: "Inventory Integration",
      description: "Seamlessly integrate BOM management with inventory tracking. See real-time component availability."
    },
    {
      icon: FileText,
      title: "Revision Control",
      description: "Manage multiple BOM versions and track changes over time. Maintain complete production history."
    },
    {
      icon: Settings,
      title: "Production Planning",
      description: "Plan production runs based on BOM structures and available inventory. Optimize your manufacturing workflow."
    }
  ];

  return (
    <SeoPageLayout
      title="Bill of Materials Management Software | BOM Software"
      heroTitle="Bill of Materials Management Software"
      description="Complete bill of materials management software for manufacturing. Create BOMs, track components, calculate material requirements, and manage production with StockFlow."
      updatedDate="25/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Bill of Materials Management Software 2025 | BOM Software | StockFlow"
        description="Get bill of materials management software for manufacturing. Create and manage BOMs, track components, calculate material requirements, and optimize production planning. Free trial available."
        keywords="bill of materials management software, bom management software, bill of materials software, bom software, bill of materials system, bom management system, manufacturing bom software, assembly bom software, production bom software, multi-level bom software, stockflow, stock flow"
        url="https://www.stockflow.be/bill-of-materials-management-software"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Bill of Materials Management Software
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Streamline your manufacturing operations with <strong>bill of materials management software</strong>. Create accurate BOMs, calculate material requirements automatically, track component costs, and optimize production planning—all in one integrated platform. When integrated with <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link>, BOM software provides complete production control. Compare with <Link to="/bill-of-material-management-software-free" className="text-blue-600 hover:underline font-semibold">free BOM software options</Link> or explore <Link to="/bill-of-materials-inventory-management" className="text-blue-600 hover:underline font-semibold">integrated BOM inventory management</Link> solutions.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Why Use Bill of Materials Management Software?</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Create and manage accurate BOMs for all your products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Automatically calculate material requirements for production</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Track component costs and total product costs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Prevent production delays with component availability alerts</span>
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
            What is Bill of Materials Management Software?
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Bill of materials management software</strong> is a specialized tool that helps manufacturing and assembly businesses create, manage, and track bills of materials (BOMs). A BOM is a comprehensive list of all components, parts, and materials required to manufacture a product. BOM management software digitizes this process, making it easier to track material requirements, calculate costs, plan production, and maintain accurate production records.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6 text-blue-600" />
                Single-Level BOM
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                A simple list showing all components needed for one product. Perfect for simple assemblies with direct component relationships.
              </p>
              <p className="text-sm text-gray-600">
                Example: A chair BOM lists 4 legs, 1 seat, 1 backrest, and 16 screws.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-green-600" />
                Multi-Level BOM
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Complex hierarchical structures where sub-assemblies contain their own components. Essential for complex products like electronics or machinery.
              </p>
              <p className="text-sm text-gray-600">
                Example: A computer BOM includes a motherboard (which has its own BOM), processor, RAM, and other components.
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Bill of materials management software</strong> like StockFlow provides these essential capabilities, making it easier to manage production planning and material control. When combined with <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link>, BOM software becomes a powerful tool for complete production management. For businesses starting out, consider <Link to="/bill-of-materials-management-software-free" className="text-blue-600 hover:underline font-semibold">free BOM management software</Link> options, or learn about <Link to="/solutions/inventory-management-software-with-bill-of-materials" className="text-blue-600 hover:underline font-semibold">inventory management software with bill of materials</Link> integration.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features of Bill of Materials Management Software
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage BOMs and optimize production
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

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits of Bill of Materials Management Software
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real results from using professional BOM management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Reduce Material Waste</h4>
                <p className="text-gray-600 text-sm">Accurate BOM calculations prevent over-ordering and reduce material waste by up to 30%.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Save Production Time</h4>
                <p className="text-gray-600 text-sm">Automated material calculations save 5-10 hours per week on manual planning and ordering.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Improve Cost Accuracy</h4>
                <p className="text-gray-600 text-sm">Real-time cost tracking helps set accurate prices and improve profit margins by 15-25%.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Prevent Production Delays</h4>
                <p className="text-gray-600 text-sm">Material availability alerts prevent production stoppages due to missing components.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* StockFlow CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started with Bill of Materials Management Software
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              StockFlow offers comprehensive BOM management software with integrated inventory tracking. Start with our free plan and scale as you grow.
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
          "name": "StockFlow - BOM Management Software",
          "description": "Bill of materials management software for manufacturing. Create BOMs, track components, calculate material requirements, and manage production planning.",
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

