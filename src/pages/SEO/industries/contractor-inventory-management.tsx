import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Wrench,
  Truck,
  MapPin,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  Building2,
  ArrowRight
} from 'lucide-react';
import { KeyTakeaways } from '@/components/KeyTakeaways';


export default function ContractorInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data for construction industry
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "What is contractor inventory management?",
      answer: "Contractor inventory management is the process of tracking construction materials, tools, and equipment across multiple job sites. It helps contractors maintain accurate inventory records, prevent theft and loss, optimize material ordering, and ensure tools and equipment are available when needed at each job site."
    },
    {
      question: "How does construction inventory software help with job site tracking?",
      answer: "Construction inventory software like StockFlow allows contractors to track inventory across multiple job sites in real-time. You can see what materials and tools are at each location, transfer items between sites, and get alerts when items are running low. Mobile barcode scanning makes it easy to update inventory directly from the job site."
    },
    {
      question: "Can construction inventory software track tools and equipment?",
      answer: "Yes, modern construction inventory management systems track both materials and equipment. You can assign tools to specific job sites, track maintenance schedules, monitor equipment usage, and prevent loss or theft with real-time visibility across all locations."
    },
    {
      question: "How does construction inventory management reduce material waste?",
      answer: "By tracking material usage across projects, contractors can identify patterns, optimize ordering quantities, and reduce over-purchasing. Real-time visibility prevents duplicate orders and helps ensure materials are used before expiration. Contractors typically see 30% reduction in material waste."
    },
    {
      question: "What features are essential for construction inventory management?",
      answer: "Key features include multi-location tracking for job sites, mobile barcode scanning, tool and equipment tracking, material ordering automation, job site transfers, maintenance scheduling, and reporting. These features help contractors manage inventory efficiently across multiple projects."
    },
    {
      question: "How much time can contractors save with inventory management software?",
      answer: "Contractors typically save 15+ hours per week on inventory counts and material tracking. Mobile scanning eliminates manual data entry, automated alerts reduce time spent checking stock levels, and real-time visibility eliminates the need for physical counts at each job site."
    },
    {
      question: "Can construction inventory software integrate with accounting systems?",
      answer: "Yes, modern construction inventory management software integrates with accounting systems to automatically track material costs, equipment depreciation, and project expenses. This provides accurate job costing and helps contractors maintain profitability."
    },
    {
      question: "Is construction inventory software suitable for small contractors?",
      answer: "Absolutely! Construction inventory software is beneficial for contractors of all sizes. Small contractors often manage multiple job sites with limited resources, making inventory tracking even more critical. StockFlow offers a free plan perfect for small contractors getting started."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Construction Inventory Management Software for Contractors",
    description: "Construction inventory management software for contractors. Track materials, tools, and equipment across job sites. Reduce waste 30%. Mobile scanning included.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Construction Inventory Management",
      description: "Construction inventory management software for contractors. Track materials, tools, and equipment across job sites. Reduce waste 30%.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Multi-job site tracking",
        "Tool and equipment management",
        "Material ordering automation",
        "Mobile barcode scanning",
        "Job site transfers",
        "Maintenance scheduling"
      ],
      image: "https://www.stockflowsystems.com/ConstructionInventory.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: MapPin,
      title: "Multi-Job Site Tracking",
      description: "Track inventory across 10+ job sites from a single dashboard. See exactly what materials and tools are at each location in real-time."
    },
    {
      icon: Wrench,
      title: "Tool & Equipment Management",
      description: "Track tools and equipment across job sites, schedule maintenance, and prevent loss or theft with real-time visibility."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan materials and tools directly from the job site using your smartphone. Update inventory instantly without leaving the field."
    },
    {
      icon: Truck,
      title: "Material Ordering Automation",
      description: "Automate material ordering based on job site needs and project schedules. Reduce over-purchasing and prevent stockouts."
    },
    {
      icon: Package,
      title: "Job Site Transfers",
      description: "Transfer materials and tools between job sites with full traceability. Track where everything is and where it's going."
    },
    {
      icon: Clock,
      title: "Maintenance Scheduling",
      description: "Schedule equipment maintenance and track service history. Ensure tools and equipment are always in working condition."
    },
    {
      icon: BarChart3,
      title: "Project Cost Tracking",
      description: "Track material costs per project for accurate job costing. Understand profitability and optimize purchasing decisions."
    },
    {
      icon: AlertTriangle,
      title: "Low Stock Alerts",
      description: "Get instant alerts when materials or tools are running low at any job site. Never run out of critical supplies."
    }
  ];

  const useCases = [
    {
      title: "Job Site Material Tracking",
      description: "Track construction materials like lumber, concrete, drywall, and hardware across multiple job sites. Know exactly what's at each location and when to reorder.",
      icon: Building2,
      metrics: "Track materials across 10+ job sites"
    },
    {
      title: "Tool Management",
      description: "Prevent tool loss and theft by tracking tools across job sites. Assign tools to specific projects and get alerts when tools aren't returned.",
      icon: Wrench,
      metrics: "Reduce tool loss by 40%"
    },
    {
      title: "Equipment Scheduling",
      description: "Schedule heavy equipment like excavators, loaders, and generators across multiple projects. Prevent double-booking and optimize equipment utilization.",
      icon: Truck,
      metrics: "Optimize equipment utilization by 35%"
    },
    {
      title: "Material Ordering",
      description: "Automate material ordering based on project schedules and job site needs. Reduce waste from over-purchasing and prevent delays from stockouts.",
      icon: Package,
      metrics: "Reduce material waste by 30%"
    },
    {
      title: "Project Cost Tracking",
      description: "Track material costs per project for accurate job costing. Understand which projects are profitable and optimize purchasing decisions.",
      icon: DollarSign,
      metrics: "Improve job costing accuracy by 95%"
    },
    {
      title: "Multi-Location Management",
      description: "Manage inventory across warehouses, storage yards, and job sites. Transfer materials between locations with full traceability.",
      icon: MapPin,
      metrics: "Manage 10+ locations from one dashboard"
    }
  ];

  const metricsData = [
    {
      value: "30%",
      label: "Reduction in Material Waste",
      description: "Optimize material ordering and reduce over-purchasing"
    },
    {
      value: "15+",
      label: "Hours Saved Per Week",
      description: "Eliminate manual inventory counts and data entry"
    },
    {
      value: "10+",
      label: "Job Sites Tracked",
      description: "Manage inventory across unlimited job sites"
    },
    {
      value: "40%",
      label: "Reduction in Tool Loss",
      description: "Track tools and equipment to prevent theft and loss"
    },
    {
      value: "95%",
      label: "Job Costing Accuracy",
      description: "Track material costs per project accurately"
    },
    {
      value: "99%",
      label: "Inventory Accuracy",
      description: "Real-time tracking ensures accurate inventory records"
    }
  ];

  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "General Contractor, Rodriguez Construction",
      content: "StockFlow transformed how we manage materials across our job sites. We reduced material waste by 35% and saved 20 hours per week on inventory tracking. The mobile scanning is a game-changer.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Project Manager, BuildRight Contractors",
      content: "Tracking tools across 12 job sites used to be a nightmare. With StockFlow, we know exactly where every tool is, and we've reduced tool loss by 45%. The ROI was immediate.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Owner, Wilson Construction Co",
      content: "The material ordering automation has been incredible. We no longer over-order materials, and we've eliminated stockouts that were delaying projects. Our job costing is now 100% accurate.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Set Up Job Sites",
      description: "Create locations for each job site, warehouse, and storage yard"
    },
    {
      step: "2",
      title: "Add Materials & Tools",
      description: "Add construction materials, tools, and equipment with barcodes"
    },
    {
      step: "3",
      title: "Track Inventory",
      description: "Use mobile scanning to track inventory at each job site in real-time"
    },
    {
      step: "4",
      title: "Automate Ordering",
      description: "Set up automated reorder points and material ordering workflows"
    }
  ];

  return (
    <SeoPageLayout 
      title="Construction Inventory Management for Contractors"
      heroTitle="Construction Inventory Management for Contractors"
      dateUpdated="06/01/2026"
      faqData={faqData}
      keyTakeaways={KeyTakeaways}
    >
      <SEO
        title="Construction Inventory Management Software | StockFlow"
        description="Construction inventory management for contractors. Track materials, tools, and equipment across job sites. Reduce waste 30%, save time with mobile scanning."
        keywords="construction inventory management, contractor inventory software, job site inventory tracking, construction materials management, tool tracking software, construction equipment tracking, contractor inventory system, construction inventory software, job site material tracking, construction tool management, contractor inventory app, construction inventory solution, multi-site inventory tracking, construction project inventory, contractor stock management"
        url="https://www.stockflowsystems.com/contractor-inventory-management"
        structuredData={structuredData}
      />





      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Manage construction materials, tools, and equipment across all your job sites from one dashboard. Stop losing tools, reduce material waste, and save hours every week with mobile inventory tracking designed for contractors.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Construction inventory management</strong> is essential for contractors managing multiple job sites. It helps track materials, tools, and equipment across locations, prevent theft and loss, optimize material ordering, and ensure everything is available when needed. Unlike manual methods, modern <strong>construction inventory management software</strong> provides real-time visibility across all job sites.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Contractors face unique challenges: managing inventory across multiple job sites, preventing tool loss and theft, optimizing material ordering to reduce waste, and tracking project costs accurately. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Construction inventory management software</Link> like StockFlow helps contractors overcome these challenges with mobile scanning, multi-location tracking, and automated ordering. Learn more about <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> for field access.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Construction Contractors</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact construction inventory management has on contractor operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metricsData.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-gray-600">{metric.description}</p>
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
              Construction Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How contractors use StockFlow to manage inventory across job sites and projects.
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
              See StockFlow in <span className="text-blue-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Track construction materials, tools, and equipment across all your job sites from one dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/ConstructionInventory.png" 
              alt="StockFlow Construction Inventory Management Dashboard - Track materials, tools, and equipment across job sites"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow construction dashboard screenshot showing:
                - Multi-job site view
                - Material tracking interface
                - Tool/equipment management
                - Mobile scanning interface
                - Job site transfer functionality */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow construction inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-blue-600">Construction Contractors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage construction inventory across job sites.
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
              Set up construction inventory management in minutes, not weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Construction Contractors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how contractors have transformed their inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex mb-4">
                  {Array.from({ length: Number(testimonial.rating) || 0 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Contractors Choose <span className="text-blue-600">StockFlow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Cost Savings
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>30% reduction</strong> in material waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>40% reduction</strong> in tool loss and theft</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Optimized material ordering</strong> reduces over-purchasing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Accurate job costing</strong> improves profitability</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                Time Savings
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>15+ hours per week</strong> saved on inventory tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Mobile scanning</strong> eliminates manual data entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated alerts</strong> reduce time checking stock levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Real-time visibility</strong> eliminates physical counts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product & Pricing Links Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Explore StockFlow Solutions
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Learn more about features, pricing, and see how StockFlow helps contractors manage inventory.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Link 
              to="/features"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 group text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Features
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Mobile scanning, job site tracking, and more.
              </p>
              <span className="text-blue-600 text-sm font-semibold inline-flex items-center gap-1">
                View <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              to="/pricing"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 group text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Pricing
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Join for Free, scale as you grow.
              </p>
              <span className="text-blue-600 text-sm font-semibold inline-flex items-center gap-1">
                View Plans <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              to="/solutions/inventory-management-software"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 group text-center"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Solutions
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Inventory management solutions.
              </p>
              <span className="text-blue-600 text-sm font-semibold inline-flex items-center gap-1">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              to="/inventory-management-software"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 group text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Complete Guide
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Full inventory management guide.
              </p>
              <span className="text-blue-600 text-sm font-semibold inline-flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>



    </SeoPageLayout>
  );
}

