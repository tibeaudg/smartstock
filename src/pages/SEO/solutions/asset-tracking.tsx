import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import {
  Wrench,
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
  QrCode,
  Shield,
  Camera,
  FileText,
  History,
  Target
} from 'lucide-react';

export default function AssetTracking() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is asset tracking?",
      answer: "Asset tracking is the process of monitoring and managing physical assets like tools, equipment, and spare parts throughout their lifecycle. It involves tracking asset locations, maintaining digital audit trails, recording location history, and ensuring assets are accounted for and properly maintained. Modern asset tracking systems use barcode scanning, mobile apps, and cloud-based platforms to provide real-time visibility into asset status and location."
    },
    {
      question: "How does asset tracking software work?",
      answer: "Asset tracking software assigns unique identifiers (barcodes, QR codes, or RFID tags) to each asset. When assets are scanned or moved, the system records the location, timestamp, and user in a digital audit trail. Mobile apps enable field workers to scan assets, update locations, and log maintenance activities. The cloud-based platform provides real-time visibility, location history, and automated alerts for missing or overdue maintenance."
    },
    {
      question: "What assets should I track?",
      answer: "Track critical tools, equipment, and spare parts that are valuable, frequently moved, or require maintenance. This includes construction tools, manufacturing equipment, IT assets, vehicles, medical devices, spare parts inventory, and any assets that move between locations. Generally, track assets worth more than $500 or those critical to operations."
    },
    {
      question: "How does barcode scanning improve asset tracking?",
      answer: "Barcode scanning eliminates manual data entry errors and speeds up asset audits. Each asset gets a unique barcode label. When scanned with a mobile device, the system instantly retrieves asset details, updates location, and records the action in the audit trail. Mobile scanning enables quick field audits, location updates, and maintenance logging without paperwork."
    },
    {
      question: "What is a digital audit trail in asset tracking?",
      answer: "A digital audit trail is a complete record of all asset movements, location changes, maintenance activities, and user actions. It includes timestamps, user identification, location history, and any changes made to asset records. This provides accountability, helps prevent loss, supports compliance requirements, and enables quick identification of when and where assets were last seen."
    },
    {
      question: "Can asset tracking software track location history?",
      answer: "Yes, modern asset tracking systems like StockFlow maintain complete location history for each asset. You can see where an asset has been, when it moved, who moved it, and its current location. Location history helps identify patterns, recover lost assets, optimize asset allocation, and maintain compliance with audit requirements."
    },
    {
      question: "How much does asset tracking software cost?",
      answer: `Asset tracking software pricing varies. Basic systems start at ${formatPrice(50)}/month. Enterprise solutions can cost ${formatPrice(500)}-${formatPrice(2000)}/month. StockFlow offers asset tracking starting with a free plan for up to 30 assets, with scalable pricing (€0.004 per asset/month for assets 31+), making it affordable for small businesses managing tools and equipment.`
    },
    {
      question: "How does asset tracking prevent loss and theft?",
      answer: "Asset tracking prevents loss by maintaining real-time visibility into asset locations, recording all movements in audit trails, conducting regular audits with mobile scanning, setting up alerts for unusual activity, and quickly identifying missing assets. The location history helps recover assets and identify patterns that may indicate theft or misuse."
    },
    {
      question: "Can asset tracking software track spare parts inventory?",
      answer: "Yes, asset tracking systems can track spare parts inventory alongside equipment. You can track spare parts locations, quantities, usage history, and reorder points. This ensures critical spare parts are available when needed and prevents overstocking. StockFlow combines asset tracking and inventory management in one platform."
    },
    {
      question: "How do I implement asset tracking?",
      answer: "Start by cataloging all assets with key details (serial numbers, purchase dates, locations, values). Label each asset with barcodes or QR codes. Set up location hierarchy (departments, buildings, rooms). Configure user roles and permissions. Train staff on mobile scanning. Conduct regular audits. StockFlow's setup wizard guides you through this process in under an hour."
    },
    {
      question: "What is the ROI of asset tracking?",
      answer: "The ROI is typically very high. Businesses see: prevention of asset loss (which can cost thousands per year), reduced time spent searching for assets (saving 10+ hours per week), improved asset utilization, compliance with audit requirements, and accurate asset records for accounting. Most businesses see ROI within 3-6 months through loss prevention and time savings."
    },
    {
      question: "Can asset tracking software integrate with other systems?",
      answer: "Yes, asset tracking systems integrate with accounting software, maintenance management systems, and ERP platforms through APIs. This enables automatic asset value updates, maintenance scheduling, purchase recording, and unified reporting. Integration ensures asset data is synchronized across systems, simplifying operations."
    },
    {
      question: "Is mobile access important for asset tracking?",
      answer: "Absolutely. Mobile access is essential for asset tracking because assets are often in the field, at job sites, or in remote locations. Mobile apps enable field workers to scan assets, update locations, log maintenance, and conduct audits without returning to the office. Offline mobile scanning ensures tracking continues even without internet connectivity."
    }
  ];

  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Asset Tracking Software for Tools, Equipment & Spare Parts",
    url: "https://www.stockflow.be/asset-tracking",
    description: "Asset tracking software for tools, equipment, and spare parts. Digital audit trails, location history, mobile scanning. Reduce loss 40-60%, save 10+ hours/week. Free plan available.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Asset Tracking", url: "https://www.stockflow.be/asset-tracking", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Asset Tracking",
      description: "Asset tracking software for tools, equipment, and spare parts. Digital audit trails, location history, mobile scanning. Reduce loss 40-60%, save 10+ hours/week.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "180"
      },
      features: [
        "Digital audit trails",
        "Location history tracking",
        "Mobile barcode scanning",
        "Multi-location support",
        "Maintenance scheduling",
        "Spare parts inventory"
      ],
      image: "https://www.stockflow.be/AssetTracking.png",
      url: "https://www.stockflow.be/asset-tracking"
    }
  });

  const features = [
    {
      icon: QrCode,
      title: "Mobile Barcode Scanning",
      description: "Scan tools and equipment directly from the field using your smartphone. Update locations instantly and maintain accurate records without paperwork."
    },
    {
      icon: History,
      title: "Digital Audit Trails",
      description: "Complete record of all asset movements, location changes, and user actions with timestamps. Track who moved what, when, and where."
    },
    {
      icon: MapPin,
      title: "Location History",
      description: "See where assets have been, track movement patterns, and quickly locate tools and equipment across multiple locations."
    },
    {
      icon: Wrench,
      title: "Tool & Equipment Tracking",
      description: "Track critical tools, equipment, and spare parts with detailed records, maintenance schedules, and usage history."
    },
    {
      icon: Clock,
      title: "Maintenance Scheduling",
      description: "Automated maintenance reminders, service history tracking, and warranty expiration alerts to keep equipment in working condition."
    },
    {
      icon: Package,
      title: "Spare Parts Inventory",
      description: "Track spare parts locations, quantities, and usage to ensure critical parts are available when needed."
    },
    {
      icon: Shield,
      title: "Compliance & Reporting",
      description: "Maintain compliance with complete audit trails, asset documentation, and regulatory reporting capabilities."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Understand asset utilization, identify patterns, and make data-driven decisions about asset allocation and maintenance."
    }
  ];

  const useCases = [
    {
      title: "Construction Tool Tracking",
      description: "Track tools and equipment across job sites, prevent loss and theft, and ensure tools are available when needed. Monitor tool usage and schedule maintenance.",
      icon: Building2,
      metrics: "Reduce tool loss by 40%"
    },
    {
      title: "Manufacturing Equipment",
      description: "Track manufacturing equipment, machinery, and spare parts across production floors. Maintain equipment history and schedule preventive maintenance.",
      icon: Wrench,
      metrics: "Improve equipment utilization by 35%"
    },
    {
      title: "IT Asset Management",
      description: "Track computers, servers, printers, and IT equipment with warranty info, maintenance schedules, and user assignments across locations.",
      icon: Smartphone,
      metrics: "100% asset visibility"
    },
    {
      title: "Field Service Tools",
      description: "Track tools and equipment in service vehicles. Field technicians can scan assets, update locations, and log maintenance activities on-site.",
      icon: MapPin,
      metrics: "Save 10+ hours per week on audits"
    },
    {
      title: "Spare Parts Inventory",
      description: "Track spare parts locations, quantities, and usage history. Ensure critical spare parts are available and prevent overstocking.",
      icon: Package,
      metrics: "Reduce spare parts costs by 25%"
    },
    {
      title: "Multi-Location Operations",
      description: "Track assets across warehouses, distribution centers, and multiple locations. Real-time visibility and location history across all sites.",
      icon: Building2,
      metrics: "Manage unlimited locations"
    }
  ];

  const metrics = [
    {
      value: "40-60%",
      label: "Reduction in Asset Loss",
      description: "Prevent loss and theft with real-time tracking"
    },
    {
      value: "10+",
      label: "Hours Saved Per Week",
      description: "Eliminate time spent searching for assets"
    },
    {
      value: "100%",
      label: "Asset Visibility",
      description: "Real-time visibility across all locations"
    },
    {
      value: "Complete",
      label: "Audit Trails",
      description: "Digital records of all asset movements"
    },
    {
      value: "35%",
      label: "Improved Utilization",
      description: "Optimize asset allocation and usage"
    },
    {
      value: "99%",
      label: "Location Accuracy",
      description: "Know exactly where every asset is"
    }
  ];

  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Operations Manager, Construction Co",
      content: "StockFlow's asset tracking transformed how we manage tools across job sites. We reduced tool loss by 45% and saved 15 hours per week on asset audits. The location history feature is invaluable.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Facilities Manager, Manufacturing Plant",
      content: "Tracking equipment and spare parts used to be a nightmare. With StockFlow, we have complete visibility and digital audit trails. We've improved equipment utilization by 40%.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "IT Director, Tech Services",
      content: "The mobile scanning and location history features are game-changers. We can track IT assets across multiple locations and maintain complete audit trails for compliance.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Catalog Your Assets",
      description: "Create a comprehensive list of tools, equipment, and spare parts with key details"
    },
    {
      step: "2",
      title: "Label with Barcodes",
      description: "Print and attach barcode labels to each asset for quick scanning and identification"
    },
    {
      step: "3",
      title: "Track Locations",
      description: "Use mobile scanning to track asset locations and maintain location history"
    },
    {
      step: "4",
      title: "Maintain Audit Trails",
      description: "Automatically record all movements, location changes, and maintenance activities"
    }
  ];

  return (
    <SeoPageLayout 
      title="Asset Tracking Software for Tools, Equipment & Spare Parts"
      heroTitle="Asset Tracking: Keep Tabs on Critical Tools, Equipment & Spare Parts"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Asset Tracking Software | Digital Audit Trails & Location History | StockFlow"
        description="Asset tracking software for tools, equipment, and spare parts. Digital audit trails, location history, mobile scanning. Reduce loss 40-60%, save 10+ hours/week. Free plan available."
        keywords="asset tracking, asset tracking software, tool tracking, equipment tracking, spare parts tracking, digital audit trail, location history, asset management, equipment management, tool management, asset tracking app, mobile asset tracking, barcode asset tracking, asset tracking system, stockflow"
        url="https://www.stockflow.be/asset-tracking"
        structuredData={structuredData}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Keep tabs on critical tools, equipment, and spare parts with digital audit trails and location history. Stop losing assets, save hours every week, and maintain complete visibility across all locations with mobile asset tracking designed for field operations.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Asset tracking</strong> is essential for businesses managing tools, equipment, and spare parts across multiple locations. It helps prevent loss and theft, maintains digital audit trails, tracks location history, and ensures assets are available when needed. Unlike manual methods, modern <strong>asset tracking software</strong> provides real-time visibility into asset locations and complete movement history.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Businesses face unique challenges: tracking assets across multiple locations, preventing loss and theft, maintaining compliance with audit requirements, and ensuring tools and equipment are available when needed. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Asset tracking software</Link> like StockFlow helps businesses overcome these challenges with mobile scanning, digital audit trails, and location history. Learn more about <Link to="/solutions/assets-inventory" className="text-blue-600 hover:underline font-semibold">assets inventory management</Link> for comprehensive asset control.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Asset Tracking</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact asset tracking has on business operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-gray-600">{metric.description}</p>
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
              See StockFlow Asset Tracking in <span className="text-blue-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Track tools, equipment, and spare parts with digital audit trails and location history.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/AssetTracking.png" 
              alt="StockFlow Asset Tracking Dashboard - Track tools, equipment, and spare parts with digital audit trails and location history"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Asset Tracking <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How businesses use StockFlow to track tools, equipment, and spare parts.
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-blue-600">Asset Tracking</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to track tools, equipment, and spare parts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in <span className="text-blue-600">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Set up asset tracking in minutes, not weeks.
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Asset Tracking Users</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how businesses have transformed their asset management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Businesses Choose <span className="text-blue-600">StockFlow Asset Tracking</span>
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
                  <span><strong>40-60% reduction</strong> in asset loss and theft</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>25% reduction</strong> in spare parts costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Improved asset utilization</strong> reduces unnecessary purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Accurate asset records</strong> simplify accounting</span>
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
                  <span><strong>10+ hours per week</strong> saved on asset audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Mobile scanning</strong> eliminates manual data entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Location history</strong> eliminates time searching for assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Digital audit trails</strong> automate compliance reporting</span>
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
              Learn more about features, pricing, and see how StockFlow helps businesses track assets.
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
                Mobile scanning, audit trails, and more.
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
                Start free, scale as you grow.
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
              to="/solutions/assets-inventory"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 group text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Assets Inventory
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Complete asset management guide.
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



