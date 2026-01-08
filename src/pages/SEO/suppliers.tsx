import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Building2,
  Users,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  ArrowRight,
  FileText,
  Shield,
  Zap,
  Globe
} from 'lucide-react';


export default function SuppliersPage() {
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data for supplier management
 
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "What is supplier management in inventory software?",
      answer: "Supplier management in inventory software is the process of tracking and managing relationships with vendors, suppliers, and manufacturers. It includes maintaining supplier contact information, tracking purchase orders, monitoring supplier performance, managing pricing agreements, and automating reordering processes. Effective supplier management helps businesses maintain reliable supply chains and optimize procurement costs."
    },
    {
      question: "How does inventory software help manage suppliers?",
      answer: "Inventory software like StockFlow helps manage suppliers by centralizing supplier information, automating purchase order creation, tracking order history, monitoring supplier performance metrics, managing pricing agreements, and providing real-time visibility into supplier relationships. This streamlines procurement processes and helps businesses make informed supplier decisions."
    },
    {
      question: "Can inventory software track supplier performance?",
      answer: "Yes, modern inventory management software tracks supplier performance metrics including on-time delivery rates, order accuracy, lead times, pricing consistency, and quality ratings. This data helps businesses identify reliable suppliers, negotiate better terms, and make informed procurement decisions."
    },
    {
      question: "How does supplier management reduce procurement costs?",
      answer: "Supplier management reduces procurement costs by consolidating orders to negotiate better pricing, identifying cost-effective suppliers, reducing rush orders through better planning, minimizing stockouts that require expensive expedited shipping, and automating purchase processes to reduce administrative overhead. Businesses typically see 15-25% reduction in procurement costs."
    },
    {
      question: "What features are essential for supplier management?",
      answer: "Key features include supplier contact management, purchase order automation, order history tracking, supplier performance metrics, pricing agreement management, automated reordering, multi-supplier support, and supplier communication tools. These features help businesses maintain efficient supplier relationships."
    },
    {
      question: "Can inventory software integrate with supplier systems?",
      answer: "Yes, modern inventory management software can integrate with supplier systems through EDI (Electronic Data Interchange), API connections, and automated email-based ordering. This enables seamless order placement, automatic order confirmations, and real-time inventory updates from suppliers."
    },
    {
      question: "How does supplier management improve inventory accuracy?",
      answer: "Supplier management improves inventory accuracy by automating purchase order creation based on reorder points, tracking expected delivery dates, providing visibility into incoming inventory, and reducing manual data entry errors. This ensures inventory records stay accurate and up-to-date."
    },
    {
      question: "Is supplier management suitable for small businesses?",
      answer: "Absolutely! Supplier management is beneficial for businesses of all sizes. Small businesses often work with multiple suppliers and can benefit from organized supplier information, automated reordering, and performance tracking. StockFlow offers supplier management features on all plans, including the free tier."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Supplier Management Software for Inventory Control",
    description: "Supplier management software for inventory control. Track suppliers, automate purchase orders, monitor performance. Reduce procurement costs 15-25%. Free plan available.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Supplier Management",
      description: "Supplier management software for inventory control. Track suppliers, automate purchase orders, monitor performance. Reduce procurement costs 15-25%.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Supplier contact management",
        "Purchase order automation",
        "Supplier performance tracking",
        "Pricing agreement management",
        "Automated reordering",
        "Multi-supplier support"
      ],
      image: "https://www.stockflowsystems.com/Inventory-Management.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Building2,
      title: "Supplier Contact Management",
      description: "Centralize all supplier information including contact details, addresses, payment terms, and notes. Access supplier information instantly from anywhere."
    },
    {
      icon: FileText,
      title: "Purchase Order Automation",
      description: "Automatically generate purchase orders based on reorder points, low stock alerts, or manual triggers. Send POs directly to suppliers via email."
    },
    {
      icon: BarChart3,
      title: "Supplier Performance Tracking",
      description: "Monitor supplier metrics including on-time delivery rates, order accuracy, lead times, and pricing consistency. Make data-driven supplier decisions."
    },
    {
      icon: DollarSign,
      title: "Pricing Agreement Management",
      description: "Track pricing agreements, volume discounts, and contract terms for each supplier. Ensure you're always getting the best prices."
    },
    {
      icon: Zap,
      title: "Automated Reordering",
      description: "Set up automated reorder points and let the system create purchase orders automatically when inventory falls below thresholds."
    },
    {
      icon: Users,
      title: "Multi-Supplier Support",
      description: "Manage relationships with multiple suppliers for the same product. Compare prices, lead times, and performance to choose the best supplier."
    },
    {
      icon: Clock,
      title: "Order History Tracking",
      description: "Maintain complete order history for each supplier. Track delivery dates, quantities received, and order costs for accurate reporting."
    },
    {
      icon: Shield,
      title: "Supplier Communication",
      description: "Streamline communication with suppliers through integrated messaging, automated order confirmations, and delivery notifications."
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Reduce Procurement Costs",
      description: "Consolidate orders, negotiate better pricing, and identify cost-effective suppliers. Typical savings of 15-25% on procurement costs.",
      metric: "15-25%"
    },
    {
      icon: Clock,
      title: "Save Time on Ordering",
      description: "Automate purchase order creation and supplier communication. Save  on procurement tasks.",
      metric: "10+ hours/week"
    },
    {
      icon: CheckCircle,
      title: "Improve Supplier Relationships",
      description: "Track performance and communicate effectively with suppliers. Build stronger, more reliable supplier partnerships.",
      metric: "95%"
    },
    {
      icon: Package,
      title: "Reduce Stockouts",
      description: "Automated reordering and supplier performance tracking ensure you never run out of critical inventory.",
      metric: "90%"
    }
  ];

  const useCases = [
    {
      icon: Building2,
      title: "Multi-Supplier Management",
      description: "Manage relationships with multiple suppliers for the same products. Compare prices, lead times, and performance to optimize procurement.",
      metrics: "Compare 5+ suppliers per product"
    },
    {
      icon: FileText,
      title: "Automated Purchase Orders",
      description: "Set up automated reorder points and let the system generate purchase orders automatically when inventory is low.",
      metrics: "90% reduction in manual PO creation"
    },
    {
      icon: BarChart3,
      title: "Supplier Performance Analysis",
      description: "Track on-time delivery rates, order accuracy, and pricing consistency to identify your best suppliers.",
      metrics: "Track 10+ performance metrics"
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description: "Monitor pricing agreements and volume discounts to ensure you're always getting the best prices from suppliers.",
      metrics: "15-25% cost reduction"
    },
    {
      icon: Clock,
      title: "Lead Time Management",
      description: "Track supplier lead times and adjust reorder points accordingly to maintain optimal inventory levels.",
      metrics: "30% reduction in rush orders"
    },
    {
      icon: Shield,
      title: "Supplier Risk Management",
      description: "Identify supplier risks early by tracking performance trends and maintaining backup supplier relationships.",
      metrics: "99% supply chain reliability"
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Add Suppliers",
      description: "Add supplier contact information, payment terms, and pricing agreements"
    },
    {
      step: "2",
      title: "Set Reorder Points",
      description: "Configure automated reorder points for products from each supplier"
    },
    {
      step: "3",
      title: "Automate Ordering",
      description: "Let the system automatically create purchase orders when inventory is low"
    },
    {
      step: "4",
      title: "Track Performance",
      description: "Monitor supplier performance and optimize your supplier relationships"
    }
  ];

  return (
    <SeoPageLayout 
      title="Supplier Management Software for Inventory Control"
      heroTitle="Supplier Management Software for Inventory Control"
      updatedDate="06/01/2026"
      faqData={faqData}
      previousArticle={{
        title: "Inventory Management Software",
        href: "/inventory-management-software"
      }}
      nextArticle={{
        title: "Stock Management Software",
        href: "/stock-management-software"
      }}
    >
      <SEO
        title="Supplier Management Software | StockFlow"
        description="Supplier management software for inventory control. Track suppliers, automate purchase orders, monitor performance. Reduce procurement costs 15-25%. Free plan available."
        keywords="supplier management, vendor management, supplier tracking, purchase order software, supplier performance, procurement software, supplier management system, vendor tracking, supplier relationship management, purchase order automation, supplier management software, vendor management software, supplier tracking software, procurement management, supplier database, vendor database, stockflow, stock flow"
        url="https://www.stockflowsystems.com/suppliers"
        structuredData={structuredData}
      />





      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Manage all your supplier relationships from one central platform. Automate purchase orders, track supplier performance, and reduce procurement costs by 15-25% with supplier management software designed for growing businesses.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Supplier management</strong> is essential for businesses that work with multiple vendors, suppliers, and manufacturers. It helps track supplier information, automate purchase orders, monitor supplier performance, manage pricing agreements, and optimize procurement processes. Unlike manual methods, modern <strong>supplier management software</strong> provides real-time visibility into supplier relationships and automates ordering workflows.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Businesses face unique supplier management challenges: maintaining supplier contact information, tracking purchase orders, monitoring supplier performance, negotiating better pricing, and ensuring reliable supply chains. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Supplier management software</Link> like StockFlow helps businesses overcome these challenges with automated ordering, performance tracking, and centralized supplier information. Learn more about <Link to="/features/purchase-requisition-software" className="text-blue-600 hover:underline font-semibold">purchase requisition software</Link> for streamlined procurement.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Supplier Management</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact supplier management software has on procurement operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <benefit.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">{benefit.metric}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Supplier Management <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How businesses use StockFlow to manage suppliers and optimize procurement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <useCase.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">{useCase.metrics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow Supplier Management in <span className="text-blue-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Manage all your supplier relationships, automate purchase orders, and track performance from one dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/Inventory-Management.png" 
              alt="StockFlow Supplier Management Dashboard - Track suppliers, automate purchase orders, monitor performance"
              width={512}
              height={512}
              loading="lazy"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-blue-600">Supplier Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage suppliers and optimize procurement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in <span className="text-blue-600">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Set up supplier management in minutes, not weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   


    </SeoPageLayout>
  );
}




