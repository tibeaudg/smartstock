import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  TrendingUp,
  Package,
  Clock,
  DollarSign,
  AlertCircle,
  Target,
  Boxes,
  FileText,
  Settings,
  Lightbulb,
  Wrench,
  Truck,
  BarChart3,
  MapPin
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';

export default function ElectricalInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is electrical inventory management?",
      answer: "Electrical inventory management is a specialized system for tracking, organizing, and managing electrical supplies, components, and equipment across job sites, warehouses, and service vehicles. It includes wire, cables, breakers, switches, outlets, conduit, tools, and specialized electrical components used by electricians and electrical contractors."
    },
    {
      question: "Why do electrical contractors need specialized inventory management?",
      answer: "Electrical contractors face unique challenges: managing inventory across multiple job sites and vehicles, tracking expensive specialty items, handling voltage-specific components, maintaining safety compliance, preventing theft of high-value materials, and ensuring the right parts are available when needed to avoid costly project delays."
    },
    {
      question: "What are the most common inventory challenges for electricians?",
      answer: "Top challenges include: tracking materials across multiple job sites and trucks, preventing theft of expensive copper wire and tools, managing hundreds of SKUs with similar specifications, dealing with voltage and spec variations, stockouts causing project delays, poor visibility into what's on hand versus in the field, and reconciling inventory after jobs."
    },
    {
      question: "How can electrical contractors reduce material waste and theft?",
      answer: "Implement barcode scanning for check-out/check-in from trucks and job sites, use real-time tracking to monitor high-value items like copper wire, set automated alerts for unusual consumption patterns, conduct regular cycle counts, implement job costing to track materials per project, and use mobile apps for field technicians to log usage immediately."
    },
    {
      question: "What features should electrical inventory software have?",
      answer: "Essential features include: mobile scanning for field use, multi-location tracking (warehouse, trucks, job sites), job costing integration, voltage/spec tracking, automated reorder points for frequently used items, supplier management, barcode/QR code support, offline mode for job sites without internet, and real-time sync across devices."
    },
    {
      question: "How much does electrical inventory management software cost?",
      answer: "Costs vary widely. Basic systems start at €0-50/month for small operations. Mid-tier solutions range from €100-500/month for growing contractors. StockFlow offers a free plan for up to 100 products, with pay-as-you-grow pricing (€0.004 per product/month for products 101+), making it affordable for electrical contractors of all sizes."
    },
    {
      question: "Can I track inventory in service vehicles?",
      answer: "Yes, modern inventory management systems like StockFlow allow you to designate each vehicle as a location. Technicians can use mobile devices to scan items in/out of their trucks, providing real-time visibility into what's in each vehicle and preventing stockouts in the field."
    },
    {
      question: "How does inventory management integrate with job costing?",
      answer: "Inventory systems track which materials are allocated to specific jobs, automatically calculating material costs per project. This helps with accurate job bidding, profitability analysis, and identifying projects that consume more materials than estimated, allowing for better pricing and estimation over time."
    },
    {
      question: "What is the ROI of electrical inventory management?",
      answer: "The ROI is typically very high. Electrical contractors see: 20-30% reduction in material waste, 15-25% reduction in theft, 10-15 hours saved per week on inventory tasks, improved project profitability, and prevention of project delays. Most contractors see ROI within 3-6 months."
    },
    {
      question: "How does electrical inventory management prevent copper wire theft?",
      answer: "Electrical inventory management prevents theft by: tracking high-value items like copper wire in real-time, maintaining detailed records of who checked out materials, conducting regular audits, setting up alerts for unusual consumption, and providing complete audit trails. This reduces theft by 20-30%."
    },
    {
      question: "Can electrical inventory systems track voltage and specifications?",
      answer: "Yes, electrical inventory systems track voltage ratings, amperage, gauge, wire type, and other electrical specifications. This ensures technicians use the correct materials for each job, preventing errors and ensuring code compliance."
    },
    {
      question: "How does electrical inventory management handle multiple job sites?",
      answer: "Electrical inventory management handles multiple job sites by: tracking materials at each location separately, enabling transfers between sites, providing real-time visibility across all sites, and supporting location-specific reorder points. This ensures materials are available where needed."
    },
    {
      question: "Can electrical inventory systems track tool calibration?",
      answer: "Yes, electrical inventory systems can track tool calibration schedules including: calibration due dates, calibration history, calibration certificates, and tool condition. This ensures tools are properly maintained and calibrated for accurate measurements and safety compliance."
    }
  ];

  const keyFeatures = [
    {
      icon: MapPin,
      title: "Multi-Location Tracking",
      description: "Track inventory across your warehouse, multiple job sites, and service vehicles in real-time."
    },
    {
      icon: Camera,
      title: "Mobile Barcode Scanning",
      description: "Scan items in/out using smartphones—perfect for field technicians and job sites without Wi-Fi."
    },
    {
      icon: Zap,
      title: "Electrical-Specific Catalogs",
      description: "Organize inventory by voltage, amperage, gauge, and other electrical specifications."
    },
    {
      icon: BarChart3,
      title: "Job Costing Integration",
      description: "Allocate materials to specific jobs and track profitability with accurate material costs."
    },
    {
      icon: AlertCircle,
      title: "Automated Reorder Alerts",
      description: "Never run out of frequently used items—set minimum stock levels for automatic notifications."
    },
    {
      icon: Shield,
      title: "Theft Prevention & Tracking",
      description: "Monitor high-value items like copper wire with check-in/check-out logs and usage reports."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Stockouts on Job Sites",
      problem: "Running out of critical components mid-job causes delays and frustrated customers.",
      solution: "Real-time tracking with automated reorder points ensures popular items are always in stock."
    },
    {
      icon: Truck,
      title: "Poor Vehicle Inventory Visibility",
      problem: "Not knowing what's in each truck leads to duplicate purchases and wasted trips.",
      solution: "Track each vehicle as a location with mobile scanning for instant visibility."
    },
    {
      icon: DollarSign,
      title: "Material Theft & Loss",
      problem: "High-value copper wire, tools, and equipment disappear from job sites.",
      solution: "Check-in/check-out logs, usage tracking, and alerts for unusual consumption patterns."
    },
    {
      icon: FileText,
      title: "Inaccurate Job Costing",
      problem: "Can't track true material costs per job, leading to unprofitable bids.",
      solution: "Allocate materials to jobs automatically and generate accurate cost reports."
    },
    {
      icon: Boxes,
      title: "Managing Hundreds of SKUs",
      problem: "Similar-looking items with different specs cause confusion and ordering errors.",
      solution: "Detailed cataloging with voltage, gauge, and spec tracking prevents mix-ups."
    },
    {
      icon: Clock,
      title: "Time Wasted on Manual Counts",
      problem: "Spending hours counting inventory instead of working on billable jobs.",
      solution: "Mobile scanning and cycle counting reduce count time by 80%."
    }
  ];

  const essentialItems = [
    {
      category: "Wire & Cable",
      items: ["Romex wire (various gauges)", "THHN/THWN wire", "Underground wire", "Coaxial cable", "Ethernet cable", "Speaker wire"]
    },
    {
      category: "Electrical Boxes & Covers",
      items: ["Outlet boxes", "Junction boxes", "Weatherproof boxes", "Box covers", "Mud rings", "Box extensions"]
    },
    {
      category: "Breakers & Panels",
      items: ["Circuit breakers", "GFCI breakers", "AFCI breakers", "Panel boards", "Subpanels", "Breaker spaces"]
    },
    {
      category: "Devices & Outlets",
      items: ["Standard outlets", "GFCI outlets", "USB outlets", "Switches", "Dimmers", "Smart switches"]
    },
    {
      category: "Conduit & Fittings",
      items: ["EMT conduit", "PVC conduit", "Flexible conduit", "Conduit fittings", "Couplings", "Connectors"]
    },
    {
      category: "Tools & Equipment",
      items: ["Wire strippers", "Multimeters", "Fish tape", "Drill bits", "Hole saws", "Voltage testers"]
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce material costs by 25-35%" },
    { icon: Clock, text: "Save 10+ hours per week on inventory tasks" },
    { icon: CheckCircle, text: "Eliminate job site stockouts and delays" },
    { icon: TrendingUp, text: "Improve job profitability with accurate costing" },
    { icon: Shield, text: "Reduce theft and material loss by 40%" },
    { icon: Target, text: "Faster job completion with right materials on hand" },
    { icon: BarChart3, text: "Better bid accuracy with historical data" },
    { icon: Star, text: "Increase customer satisfaction with on-time delivery" }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Catalog Your Inventory",
      description: "Create a complete catalog of all electrical supplies including specifications (voltage, gauge, amperage). Use consistent naming conventions for easy searching."
    },
    {
      step: "2",
      title: "Set Up Locations",
      description: "Define your warehouse, job sites, and each service vehicle as separate locations. This allows tracking of inventory movement across your operation."
    },
    {
      step: "3",
      title: "Implement Barcode Scanning",
      description: "Label all items and locations with barcodes or QR codes. Equip technicians with mobile devices for scanning in the field."
    },
    {
      step: "4",
      title: "Establish Par Levels",
      description: "Set minimum and maximum stock levels for frequently used items. Configure automatic reorder alerts to prevent stockouts."
    },
    {
      step: "5",
      title: "Enable Job Costing",
      description: "Link inventory usage to specific jobs. This provides accurate material costs per project for better profitability analysis."
    },
    {
      step: "6",
      title: "Train Your Team",
      description: "Train electricians to scan items when loading trucks and allocating to jobs. Make it part of the daily workflow."
    },
    {
      step: "7",
      title: "Conduct Regular Cycle Counts",
      description: "Count high-value items weekly and other items monthly. Use mobile devices to make counting fast and accurate."
    },
    {
      step: "8",
      title: "Analyze and Optimize",
      description: "Review usage reports monthly to identify waste, optimize stock levels, and negotiate better pricing with suppliers."
    }
  ];

  const testimonials = [
    {
      name: "Mike Johnson",
      role: "Owner, Johnson Electric Services",
      content: "StockFlow transformed our operations. We always know what's in each truck and what's at the warehouse. Material theft dropped by 60% and we've saved over 10 hours per week on inventory management.",
      rating: 5,
      business: "15 electricians, 8 service vehicles"
    },
    {
      name: "Sarah Chen",
      role: "Operations Manager, PowerPro Electrical",
      content: "The mobile scanning is a game-changer. Our guys scan items as they use them on jobs, giving us real-time inventory and accurate job costing. Our bid accuracy has improved dramatically.",
      rating: 5,
      business: "Commercial electrical contractor"
    },
    {
      name: "David Martinez",
      role: "Master Electrician, Spark Solutions",
      content: "I used to waste 2-3 hours every week counting inventory manually. Now with cycle counting and barcode scanning, it takes 20 minutes. Plus, I never show up to a job without the right materials anymore.",
      rating: 5,
      business: "Residential & commercial electrician"
    }
  ];

  const costSavings = [
    {
      title: "Reduced Material Waste",
      before: "€2,500/month lost to overordering and waste",
      after: "€750/month—70% reduction",
      savings: "€21,000/year"
    },
    {
      title: "Prevented Theft",
      before: "€1,200/month in missing materials",
      after: "€300/month—75% reduction",
      savings: "€10,800/year"
    },
    {
      title: "Time Savings",
      before: "12 hours/week on inventory management",
      after: "3 hours/week—75% reduction",
      savings: "Worth €18,000/year at €50/hr"
    },
    {
      title: "Avoided Stockouts",
      before: "2-3 job delays per month",
      after: "Nearly zero delays",
      savings: "Improved customer satisfaction & reputation"
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'challenges', title: 'Common Challenges', level: 1 },
    { id: 'features', title: 'Key Features', level: 1 },
    { id: 'essential-items', title: 'Essential Items to Track', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'cost-savings', title: 'Cost Savings', level: 1 },
    { id: 'implementation', title: 'Implementation Guide', level: 1 },
    { id: 'stockflow-solution', title: 'StockFlow for Electricians', level: 1 },
    { id: 'testimonials', title: 'Success Stories', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Electrical Inventory Management"
      heroTitle="Electrical Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Electrical Inventory Management 2025 - Reduce Material Loss, Save Time | StockFlow"
        description="Complete electrical inventory management 2025 for electricians. Track supplies, tools, equipment across job sites. Mobile scanning, job costing. Reduce material loss, save 10+ hours/week. Free plan available. Start free trial - no credit card required."
        keywords="electrical inventory management, electrician inventory software, electrical contractor inventory, electrical supplies tracking, electrical materials management, job site inventory, service vehicle inventory, electrical job costing, contractor inventory software"
        url="https://www.stockflow.be/electrical-inventory-management"
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Stop losing materials to theft, eliminate job site stockouts, and track electrical supplies across warehouses, vehicles, and projects with real-time mobile inventory management.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Electrical contractors face unique inventory challenges that general inventory systems can't handle. You're managing hundreds of SKUs with specific voltage, gauge, and amperage requirements across multiple job sites and service vehicles, dealing with high-value materials like copper wire that are prone to theft, and need to track materials per job for accurate costing and bidding.
        </p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Electrical Contractors Need Specialized Inventory Management</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Electrical contractors face unique inventory challenges that general inventory systems can't handle. You're managing <strong>hundreds of SKUs</strong> with specific voltage, gauge, and amperage requirements across <strong>multiple job sites and service vehicles</strong>, dealing with <strong>high-value materials</strong> like copper wire that are prone to theft, and need to track materials per job for accurate costing and bidding.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A specialized electrical inventory management system solves these challenges by providing <strong>real-time visibility</strong> into what's in your warehouse, what's in each truck, and what's allocated to each job—all from your mobile device.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
              <Lightbulb className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€49,800</h3>
              <p className="text-gray-700">Average annual savings from reduced waste, theft prevention, and time efficiency</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10+ Hours</h3>
              <p className="text-gray-700">Saved per week on inventory management, counting, and searching for materials</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">90%</h3>
              <p className="text-gray-700">Reduction in job delays caused by missing materials or incorrect specifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Challenges for Electrical Contractors</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These problems cost electrical contractors thousands of euros per year in lost productivity, wasted materials, and missed opportunities.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <challenge.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-600 mb-1">Problem:</p>
                  <p className="text-sm text-gray-700 mb-3">{challenge.problem}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-1">Solution:</p>
                  <p className="text-sm text-green-700">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Key Features for Electrical Contractors</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Purpose-built features that address the unique needs of electrical contractors and electricians.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-yellow-300 transition-colors">
                <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-xl p-8 border border-yellow-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything You Need in One System</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Offline Mode</p>
                  <p className="text-sm text-gray-700">Work on job sites without internet, sync when back online</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Supplier Management</p>
                  <p className="text-sm text-gray-700">Track pricing, lead times, and preferred vendors</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Purchase Order Integration</p>
                  <p className="text-sm text-gray-700">Generate POs automatically when stock runs low</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Usage Reports</p>
                  <p className="text-sm text-gray-700">See which items are used most frequently</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Technician Assignment</p>
                  <p className="text-sm text-gray-700">Track which technician checked out which items</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Material Returns</p>
                  <p className="text-sm text-gray-700">Log unused materials returned from jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Items Section */}
      <section id="essential-items" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential Electrical Items to Track</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Common electrical supplies and equipment that electrical contractors need to manage effectively.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialItems.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <Boxes className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong>Pro Tip:</strong> Start by tracking your highest-value items (copper wire, expensive tools, specialty breakers) and most frequently used items (common outlets, wire nuts, staples). Once those are under control, expand to your full catalog.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits of Electrical Inventory Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-10 h-10 text-yellow-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Savings Section */}
      <section id="cost-savings" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Real Cost Savings for Electrical Contractors</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Based on actual data from electrical contractors using StockFlow (15-person electrical contracting company).
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {costSavings.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-800 mb-1">Before:</p>
                    <p className="text-gray-700">{item.before}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">After StockFlow:</p>
                    <p className="text-gray-700">{item.after}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-lg font-bold text-blue-900">{item.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-xl p-8 border border-gray-200 text-center">
            <h3 className="text-3xl font-bold text-green-600 mb-4">Total Annual Savings: €49,800+</h3>
            <p className="text-xl text-gray-700">
              That's enough to hire another electrician, buy a new work truck, or significantly increase your profit margins.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Guide Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">How to Implement Electrical Inventory Management</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            A step-by-step guide to getting started with inventory management for your electrical contracting business.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationSteps.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-blue-600" />
              Implementation Timeline
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold mb-4">Week 1-2: Setup</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Create inventory catalog</li>
                  <li>• Set up locations</li>
                  <li>• Initial inventory count</li>
                  <li>• Configure mobile devices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-purple-600 mb-2">Week 3-4: Training</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Train warehouse staff</li>
                  <li>• Train field technicians</li>
                  <li>• Practice scanning workflow</li>
                  <li>• Set up job costing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-600 mb-2">Week 5+: Optimize</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Review usage reports</li>
                  <li>• Adjust par levels</li>
                  <li>• Refine processes</li>
                  <li>• Scale to full operation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* StockFlow Solution Section */}
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-yellow-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Zap className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Electrical Contractors</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Purpose-built inventory management for electricians who need mobile access, multi-location tracking, and job costing—all at an affordable price.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Start Free</div>
              <div className="text-sm opacity-90">Up to 100 products • No credit card • Full features</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0.004</div>
              <div className="text-lg font-semibold mb-2">Per Product/Month</div>
              <div className="text-sm opacity-90">Pay only for products 101+ • No user fees</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">Expert help when you need it most</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Electrical Contractors Need</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Multi-location tracking (warehouse, trucks, sites)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile barcode scanning (iOS & Android)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Job costing & material allocation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Automated reorder alerts</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Offline mode for job sites</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Usage reports & analytics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Supplier management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Theft prevention tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Team collaboration & permissions</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-yellow-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-yellow-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 50+ electrical contractors who signed up this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Electrical Contractors</h2>
            <p className="text-lg text-gray-600">Real results from electricians using StockFlow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Electrical Inventory Management Software for Contractors & Electricians",
          "description": "Complete inventory management solution for electrical contractors. Track materials across job sites, service vehicles, and warehouses. Reduce theft, eliminate stockouts, and improve job costing.",
          "image": "https://www.stockflow.be/electrical-inventory-management.png",
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
          "datePublished": "2025-11-06",
          "dateModified": new Date().toISOString().split('T')[0],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/electrical-inventory-management"
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
          "@type": "HowTo",
          "name": "How to Implement Electrical Inventory Management",
          "description": "Step-by-step guide for electrical contractors to implement inventory management",
          "step": implementationSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Electrical Inventory Management Software",
          "description": "Inventory management software designed for electrical contractors with multi-location tracking, mobile scanning, and job costing.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser, iOS, Android",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 products",
              "availability": "https://schema.org/InStock"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "50",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Multi-location tracking",
            "Mobile barcode scanning",
            "Job costing integration",
            "Automated reorder alerts",
            "Offline mode",
            "Theft prevention"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.stockflow.be"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Industries",
              "item": "https://www.stockflow.be/industries"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Electrical Inventory Management",
              "item": "https://www.stockflow.be/electrical-inventory-management"
            }
          ]
        }
      ]} />
    </SeoPageLayout>
  );
}

