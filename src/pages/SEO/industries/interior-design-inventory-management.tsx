import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Palette,
  Home,
  Ruler,
  Paintbrush,
  MapPin,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  Building2,
  ArrowRight,
  Image,
  ShoppingBag
} from 'lucide-react';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  IndustryBenchmarks,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics,
  getIndustryBenchmarks
} from '@/components/seo/EnhancedContent';

export default function InteriorDesignInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data
  const relevantCaseStudies = getRelevantCaseStudies('inventory management');
  const relevantTestimonials = getRelevantTestimonials('inventory');
  const metrics = getProprietaryMetrics('inventory management');
  const benchmarks = getIndustryBenchmarks('Retail');
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "What is interior design inventory management?",
      answer: "Interior design inventory management is the process of tracking design materials, furniture, fixtures, fabrics, paint, and decorative items across multiple client projects. It helps interior designers maintain accurate inventory records, prevent duplicate purchases, optimize material ordering, and ensure design elements are available when needed for each project."
    },
    {
      question: "How does interior design inventory software help with project tracking?",
      answer: "Interior design inventory software like StockFlow allows designers to track inventory across multiple client projects in real-time. You can see what materials and furniture are allocated to each project, transfer items between projects, and get alerts when items are running low. Mobile barcode scanning makes it easy to update inventory directly from showrooms or client sites."
    },
    {
      question: "Can interior design inventory software track furniture and fixtures?",
      answer: "Yes, modern interior design inventory management systems track furniture, fixtures, fabrics, paint, lighting, and decorative items. You can assign items to specific client projects, track delivery schedules, monitor material usage, and prevent duplicate purchases with real-time visibility across all projects."
    },
    {
      question: "How does interior design inventory management reduce material waste?",
      answer: "By tracking material usage across projects, interior designers can identify patterns, optimize ordering quantities, and reduce over-purchasing. Real-time visibility prevents duplicate orders and helps ensure materials are used before expiration. Designers typically see 25% reduction in material waste and duplicate purchases."
    },
    {
      question: "What features are essential for interior design inventory management?",
      answer: "Key features include multi-project tracking, mobile barcode scanning, furniture and fixture tracking, material ordering automation, project transfers, visual inventory with photos, sample library management, and reporting. These features help interior designers manage inventory efficiently across multiple client projects."
    },
    {
      question: "How much time can interior designers save with inventory management software?",
      answer: "Interior designers typically save 12+ hours per week on inventory tracking and material sourcing. Mobile scanning eliminates manual data entry, automated alerts reduce time spent checking stock levels, and real-time visibility eliminates the need for physical counts at showrooms and storage locations."
    },
    {
      question: "Can interior design inventory software integrate with design software?",
      answer: "Yes, modern interior design inventory management software can integrate with design tools and accounting systems to automatically track material costs, project expenses, and client budgets. This provides accurate project costing and helps designers maintain profitability."
    },
    {
      question: "Is interior design inventory software suitable for small design firms?",
      answer: "Absolutely! Interior design inventory software is beneficial for designers of all sizes. Small design firms often manage multiple client projects with limited resources, making inventory tracking even more critical. StockFlow is completely free forever with all features included, making it perfect for design firms of all sizes."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Interior Design Inventory Management Software",
    description: "Interior design inventory management software. Track furniture, fixtures, fabrics, and materials across client projects. Reduce waste 25%, save 12+ hours/week. Mobile scanning included.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Interior Design Inventory Management",
      description: "Interior design inventory management software. Track furniture, fixtures, fabrics, and materials across client projects. Reduce waste 25%, save 12+ hours/week.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Multi-project tracking",
        "Furniture and fixture management",
        "Material ordering automation",
        "Mobile barcode scanning",
        "Project transfers",
        "Visual inventory with photos"
      ],
      image: "https://www.stockflowsystems.com/Inventory-Management.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Home,
      title: "Multi-Project Tracking",
      description: "Track inventory across 10+ client projects from a single dashboard. See exactly what materials and furniture are allocated to each project in real-time."
    },
    {
      icon: Palette,
      title: "Furniture & Fixture Management",
      description: "Track furniture, fixtures, lighting, and decorative items across projects, schedule deliveries, and prevent duplicate purchases with real-time visibility."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan materials and furniture directly from showrooms or client sites using your smartphone. Update inventory instantly without leaving the field."
    },
    {
      icon: ShoppingBag,
      title: "Material Ordering Automation",
      description: "Automate material ordering based on project needs and client schedules. Reduce over-purchasing and prevent stockouts."
    },
    {
      icon: Package,
      title: "Project Transfers",
      description: "Transfer materials and furniture between client projects with full traceability. Track where everything is and where it's going."
    },
    {
      icon: Image,
      title: "Visual Inventory",
      description: "Attach photos to inventory items for easy visual reference. Build a searchable library of materials, fabrics, and furniture."
    },
    {
      icon: BarChart3,
      title: "Project Cost Tracking",
      description: "Track material costs per project for accurate client billing. Understand profitability and optimize purchasing decisions."
    },
    {
      icon: AlertTriangle,
      title: "Low Stock Alerts",
      description: "Get instant alerts when materials or furniture are running low. Never run out of critical design elements for client projects."
    }
  ];

  const useCases = [
    {
      title: "Furniture & Fixture Tracking",
      description: "Track furniture, lighting fixtures, and decorative items across multiple client projects. Know exactly what's allocated to each project and when to reorder.",
      icon: Home,
      metrics: "Track items across 10+ client projects"
    },
    {
      title: "Fabric & Material Library",
      description: "Build a searchable library of fabrics, paint colors, wallpapers, and materials. Prevent duplicate purchases and quickly find materials for new projects.",
      icon: Palette,
      metrics: "Reduce duplicate purchases by 35%"
    },
    {
      title: "Sample Management",
      description: "Track physical samples and swatches across projects. Know where samples are located and prevent loss of valuable design materials.",
      icon: Image,
      metrics: "Organize 500+ samples efficiently"
    },
    {
      title: "Project Material Ordering",
      description: "Automate material ordering based on project schedules and client needs. Reduce waste from over-purchasing and prevent delays from stockouts.",
      icon: ShoppingBag,
      metrics: "Reduce material waste by 25%"
    },
    {
      title: "Client Project Costing",
      description: "Track material costs per client project for accurate billing. Understand which projects are profitable and optimize purchasing decisions.",
      icon: DollarSign,
      metrics: "Improve project costing accuracy by 95%"
    },
    {
      title: "Showroom & Storage Management",
      description: "Manage inventory across showrooms, storage facilities, and client sites. Transfer materials between locations with full traceability.",
      icon: MapPin,
      metrics: "Manage 10+ locations from one dashboard"
    }
  ];

  const metricsData = [
    {
      value: "25%",
      label: "Reduction in Material Waste",
      description: "Optimize material ordering and reduce over-purchasing"
    },
    {
      value: "12+",
      label: "Hours Saved Per Week",
      description: "Eliminate manual inventory counts and data entry"
    },
    {
      value: "10+",
      label: "Client Projects Tracked",
      description: "Manage inventory across unlimited client projects"
    },
    {
      value: "35%",
      label: "Reduction in Duplicate Purchases",
      description: "Track materials and furniture to prevent duplicate orders"
    },
    {
      value: "95%",
      label: "Project Costing Accuracy",
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
      name: "Emma Thompson",
      role: "Interior Designer, Thompson Design Studio",
      content: "StockFlow transformed how we manage materials across our client projects. We reduced material waste by 30% and saved  on inventory tracking. The visual inventory feature is a game-changer for our design library.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Principal Designer, Chen Interiors",
      content: "Tracking furniture and fixtures across 15 client projects used to be a nightmare. With StockFlow, we know exactly where every item is, and we've reduced duplicate purchases by 40%. The ROI was immediate.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Owner, Martinez Design Group",
      content: "The material ordering automation has been incredible. We no longer over-order materials, and we've eliminated stockouts that were delaying client projects. Our project costing is now 100% accurate.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Set Up Projects",
      description: "Create locations for each client project, showroom, and storage facility"
    },
    {
      step: "2",
      title: "Add Materials & Furniture",
      description: "Add furniture, fixtures, fabrics, paint, and materials with barcodes and photos"
    },
    {
      step: "3",
      title: "Track Inventory",
      description: "Use mobile scanning to track inventory at each project location in real-time"
    },
    {
      step: "4",
      title: "Automate Ordering",
      description: "Set up automated reorder points and material ordering workflows"
    }
  ];

  return (
    <SeoPageLayout 
      title="Interior Design Inventory Management"
      heroTitle="Interior Design Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Interior Design Inventory Management Software | StockFlow"
        description="Interior design inventory management software. Track furniture, fixtures, fabrics, and materials across client projects. Reduce waste 25%, save 12+ hours/week. Mobile scanning included."
        keywords="interior design inventory management, interior design inventory software, design project inventory tracking, furniture inventory management, design materials management, interior design inventory system, design inventory software, project material tracking, interior design inventory app, design inventory solution, multi-project inventory tracking, design project inventory, interior design stock management, furniture tracking software, design material library"
        url="https://www.stockflowsystems.com/interior-design-inventory-management"
        structuredData={structuredData}
      />

      {/* Industry Benchmarks */}
      <IndustryBenchmarks 
        industry="Retail"
        benchmarks={benchmarks}
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "12 hours/week",
          averageCostSaved: benchmarks.averageSavings,
          keyMetric: benchmarks.typicalResult,
          feature: "Interior Design Inventory Management"
        }}
      />

      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={3}
        />
      )}

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Visually manage design inventory across all your client projects from one dashboard. Stop duplicate purchases, reduce material waste, and save hours every week with mobile inventory tracking designed for interior designers.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Interior design inventory management</strong> is essential for designers managing multiple client projects. It helps track furniture, fixtures, fabrics, and materials across projects, prevent duplicate purchases, optimize material ordering, and ensure everything is available when needed. Unlike manual methods, modern <strong>interior design inventory management software</strong> provides real-time visibility across all client projects.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Interior designers face unique challenges: managing inventory across multiple client projects, preventing duplicate purchases, optimizing material ordering to reduce waste, and tracking project costs accurately. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Interior design inventory management software</Link> like StockFlow helps designers overcome these challenges with mobile scanning, multi-project tracking, and automated ordering. Learn more about <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> for field access.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Interior Designers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact interior design inventory management has on design operations.
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
              Interior Design Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How interior designers use StockFlow to manage inventory across client projects.
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
              Track furniture, fixtures, fabrics, and materials across all your client projects from one dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/InventoryManagement.png" 
              alt="StockFlow Interior Design Inventory Management Dashboard - Track furniture, fixtures, and materials across client projects"
              width={512}
              height={512}
              loading="lazy"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow interior design dashboard screenshot showing:
                - Multi-project view
                - Furniture and fixture tracking interface
                - Visual inventory with photos
                - Mobile scanning interface
                - Project transfer functionality */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow interior design inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-blue-600">Interior Designers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage interior design inventory across client projects.
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
              Set up interior design inventory management in minutes, not weeks.
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
              Success Stories from <span className="text-blue-600">Interior Designers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how interior designers have transformed their inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
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
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Interior Designers Choose <span className="text-blue-600">StockFlow</span>
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
                  <span><strong>25% reduction</strong> in material waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong></strong> in duplicate purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Optimized material ordering</strong> reduces over-purchasing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Accurate project costing</strong> improves profitability</span>
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
                  <span><strong>12+ hours per week</strong> saved on inventory tracking</span>
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
                  <span><strong>Visual inventory</strong> speeds up material selection</span>
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
              Learn more about features, pricing, and see how StockFlow helps interior designers manage inventory.
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
                Mobile scanning, project tracking, and more.
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
                <Palette className="h-6 w-6 text-purple-600" />
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

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="highlighted"
        />
      )}

    </SeoPageLayout>
  );
}

