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
  ArrowRight,
  Calculator,
  ShieldCheck,
  FileSpreadsheet,
  Users,
  Zap,
  Target,
  AlertCircle,
  Boxes,
  Hammer,
  HardHat
} from 'lucide-react';

/**
 * Optimized Construction Inventory Management Page
 * Target Keywords: construction inventory management software, managing inventory across jobsites, 
 * inventory tracking software for builders, best accounting software for construction.
 */
export default function ContractorInventoryManagement() {
  
  const location = useLocation();
  
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const topicTitle = "Construction Inventory Management Software for Contractors: Complete Guide 2026";
  const dateUpdated = "January 15, 2026";
  const heroDescription = "Complete guide to construction inventory management for contractors. Learn how to manage inventory across multiple jobsites, track equipment and tools, prevent theft and waste, and integrate with accounting software for accurate job costing.";

  const faqData = [
    {
      question: "What is the best way to handle construction inventory management?",
      answer: "The best approach involves using dedicated construction inventory management software that supports multi-site tracking. Unlike static Excel sheets, modern software provides real-time visibility into material levels and tool locations across every active jobsite. Key features include mobile barcode scanning, multi-location tracking, automated reorder points, and integration with accounting systems for accurate job costing. This eliminates the 20% 'ghost inventory' typically lost between warehouse and jobsites."
    },
    {
      question: "How do you manage inventory across multiple jobsites effectively?",
      answer: "Effective multi-jobsite management requires: (1) Mobile-first software with barcode/QR scanning for instant updates from any location, (2) Centralized dashboard showing real-time inventory across all sites, (3) Transfer management to track materials moving between warehouse, vehicles, and jobsites, (4) Location-specific alerts for low stock at each site, (5) Regular cycle counts using mobile devices, and (6) Integration with project management tools. This approach eliminates duplicate orders, prevents shortages, and provides complete visibility."
    },
    {
      question: "What are the biggest challenges in construction inventory management?",
      answer: "Major challenges include: (1) Material waste (10-15% of materials wasted due to poor tracking), (2) Theft and loss (1-2% of material value lost, especially high-value items), (3) Multi-location complexity (managing warehouse, vehicles, and multiple jobsites simultaneously), (4) Material shortages causing project delays, (5) Inaccurate job costing from poor material tracking, and (6) Time wasted on manual counts instead of billable work. Modern inventory software addresses all these challenges."
    },
    {
      question: "How does construction equipment tracking software work?",
      answer: "Construction equipment tracking software uses barcode/QR codes or RFID tags to track tools and machinery. Each piece of equipment is assigned a unique identifier. When equipment moves between locations (warehouse to jobsite, jobsite to jobsite), it's scanned to update location in real-time. The software tracks engine hours, schedules maintenance, assigns equipment to specific projects, and provides alerts for overdue maintenance or unauthorized movements. This extends equipment life by 35% through proactive maintenance."
    },
    {
      question: "What is the best accounting software for construction inventory?",
      answer: "The best systems integrate inventory costs directly into construction financial management software. Key features include: material cost tracking per project, real-time job costing, integration with accounting systems (QuickBooks, Sage, etc.), automated cost allocation, and financial reporting. This ensures accurate job costing, competitive bidding, and profitability analysis. Inventory software should export data to accounting systems seamlessly."
    },
    {
      question: "How do contractors prevent theft and loss of inventory?",
      answer: "Prevent theft by: (1) Tracking high-value items individually with serial numbers, (2) Using barcode scanning to record all movements with timestamps, (3) Maintaining detailed logs of who accessed inventory, (4) Conducting regular cycle counts to detect discrepancies quickly, (5) Securing storage areas with access controls, (6) Tracking items from warehouse to vehicle to jobsite, and (7) Using inventory software with complete audit trails. Real-time tracking makes theft immediately apparent."
    },
    {
      question: "Can construction inventory software help with job costing?",
      answer: "Yes! Modern inventory software is essential for accurate job costing. It tracks materials used per project, assigns inventory costs to specific jobs, provides cost reports per project, calculates material costs for bidding, tracks tool and equipment usage per job, and integrates with accounting systems. Accurate inventory tracking ensures profitable job costing, competitive bidding, and prevents cost overruns that eat into profits."
    },
    {
      question: "What types of contractors benefit most from inventory software?",
      answer: "All contractors benefit, but especially: general contractors managing multiple projects, electrical contractors tracking wire and components, plumbing contractors managing fixtures and fittings, HVAC contractors tracking parts and equipment, concrete contractors monitoring additives and reinforcement, and specialty contractors with high-value materials. Contractors with 3+ active jobsites, $100K+ annual material costs, or frequent material shortages see the greatest ROI."
    },
    {
      question: "Is there free construction inventory management software?",
      answer: "Yes, some inventory management software offers free tiers. These typically support limited items (50-100), basic tracking features, and mobile scanning. Free options are ideal for small contractors or those starting out. However, verify there are no hidden costs, item limits that restrict growth, or feature limitations that require paid upgrades. Free software should provide essential multi-location tracking and mobile access."
    }
  ];

  const keyTakeaways = [
    'Switching from Excel spreadsheets to cloud-based construction inventory management software reduces data errors by 90% and saves 15+ hours weekly on manual counts.',
    'Managing inventory across multiple jobsites requires real-time mobile scanning to prevent the 20% "ghost inventory" lost between warehouse and sites, plus tool theft and material waste.',
    'Integrating inventory data with construction financial management software is essential for 100% accurate job costing, competitive bidding, and profitability analysis.',
    'Construction equipment tracking software extends tool life by 35% through proactive maintenance scheduling and prevents expensive downtime from equipment failures.',
    'Contractors waste 10-15% of materials due to poor tracking—modern inventory software reduces this waste by 30% through real-time visibility and automated reorder points.',
    'Multi-location tracking eliminates duplicate orders, prevents material shortages that delay projects, and provides complete visibility across warehouse, vehicles, and all jobsites.'
  ];

  const structuredData = generateSeoPageStructuredData({
    title: topicTitle,
    description: "Professional construction inventory management software for general contractors. Manage inventory across jobsites, track tools, and integrate with financial software.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow Construction Suite",
      description: "Advanced inventory tracking software for builders and general contractors. Includes mobile scanning and multi-site support.",
      category: "ConstructionBusinessSoftware",
      operatingSystem: "Cloud-Based / Mobile",
      price: "0",
      currency: "USD",
      features: [
        "Multi-jobsite material tracking",
        "Construction equipment tracking software",
        "Automated material reordering",
        "QR/Barcode mobile scanning",
        "Job costing financial integration"
      ],
      image: "https://www.stockflowsystems.com/ConstructionInventory.png",
      url: location.pathname
    },
    pageType: 'software'
  });

  const breadcrumbItems = breadcrumbs.map(item => ({
    name: item.name,
    path: item.url
  }));

  return (
    <SeoPageLayout 
      breadcrumbItems={breadcrumbItems}
      heroTitle={topicTitle}
      heroDescription={heroDescription}
      dateUpdated={dateUpdated}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Construction Inventory Management Software for Contractors: Complete Guide 2026 | Multi-Jobsite Tracking"
        description="Complete guide to construction inventory management for contractors. Learn how to manage inventory across multiple jobsites, track equipment and tools, prevent theft and waste (reduce by 30%), and integrate with accounting software for accurate job costing. Best practices for general contractors, electrical, plumbing, HVAC, and concrete contractors."
        keywords="construction inventory management software, managing inventory across jobsites, inventory management software for general contractors, construction equipment tracking software, construction business software, best accounting software for construction, contractor inventory management, construction material tracking, jobsite inventory management, construction tool tracking, construction job costing, multi-location construction inventory"
        url="https://www.stockflowsystems.com/contractor-inventory-management"
        structuredData={structuredData}
      />

      {/* Hero / Introduction */}
      <section className="mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
          <ShieldCheck className="w-4 h-4" /> Complete Guide for Construction Professionals
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
          Construction Inventory Management: Complete Guide for Contractors
        </h1>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              For many construction firms, <strong>managing inventory across jobsites</strong> is the largest source of unrecovered costs and operational inefficiency. Materials are over-ordered, tools disappear from sites, and traditional <strong>construction inventory management Excel</strong> sheets become outdated before they're even printed. The construction industry faces unique inventory challenges that require specialized solutions.
            </p>
            <p>
              This comprehensive guide covers everything contractors need to know about construction inventory management: from managing materials across multiple jobsites to tracking equipment, preventing theft and waste, and integrating with accounting systems for accurate job costing. Whether you're a general contractor, electrical contractor, plumbing contractor, or specialize in concrete, HVAC, or other trades, effective inventory management is essential for profitability.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">The Construction Inventory Challenge</h3>
              <p className="text-blue-800 text-sm">
                Construction projects waste 10-15% of materials due to poor inventory management. Contractors lose 1-2% of material value to theft, with high-value items (copper, tools, equipment) most at risk. The 20% "ghost inventory" lost between warehouse and jobsites costs thousands annually. Modern inventory management software addresses these challenges with real-time tracking, mobile scanning, and multi-location visibility.
              </p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calculator className="text-blue-400" /> Key Benefits of Modern Systems
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
              Professional construction inventory management software provides:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Real-time visibility across warehouse, vehicles, and all jobsites</span></li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Mobile barcode/QR scanning for instant updates from field</span></li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Equipment tracking with maintenance scheduling</span></li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Job costing integration with accounting systems</span></li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Automated reorder points to prevent shortages</span></li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> <span>Complete audit trails to prevent theft</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Unique Contractor Challenges */}
      <section className="mb-20 bg-gray-50 py-16 px-4 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Unique Challenges in Construction Inventory Management</h2>
          <p className="text-lg text-slate-600 mb-8">
            Contractors face inventory challenges that differ significantly from traditional retail or warehouse operations. Understanding these challenges is the first step toward effective management.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Multi-Location Complexity</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Contractors simultaneously manage inventory at the warehouse, multiple active jobsites, service vehicles, and sometimes supplier locations. Traditional inventory systems designed for fixed locations can't handle this complexity.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Without real-time visibility, contractors don't know what materials are available at other jobsites, leading to duplicate orders and inefficient allocation. Materials may sit unused at one site while another site orders the same items.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Stock Management</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Service vehicles carry inventory that moves constantly between warehouse, jobsites, and suppliers. Tracking what's in each vehicle, what was used on jobs, and what needs replenishment requires mobile access and real-time updates.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Without vehicle tracking, crews arrive at jobsites without needed materials, make unnecessary trips to warehouse, or duplicate purchases. This wastes time and increases costs.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-gray-900">Material Theft and Loss</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Construction sites lose 1-2% of material value to theft, with high-value items (copper wire, tools, equipment) most at risk. Open jobsites, multiple workers, and temporary storage make theft prevention difficult.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Theft costs contractors thousands annually. Without tracking, theft goes undetected until inventory counts reveal shortages, making it impossible to identify when or where items disappeared.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">Material Waste and Overstocking</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Construction projects waste 10-15% of materials due to poor inventory management, ordering excess, or materials expiring on site. Without accurate tracking, contractors over-order to avoid shortages, creating waste.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Material waste directly reduces profitability. Overstocking ties up capital in unused materials and increases storage costs. Perishable materials (concrete additives, adhesives) expire if not used timely.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Material Shortages Delaying Projects</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Running out of critical materials causes project delays, overtime costs, and contractor penalties. Without proper tracking and reorder points, shortages occur unexpectedly.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Project delays cost contractors in overtime pay, penalties, and lost future business. A single material shortage can delay an entire project, affecting multiple trades and timelines.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Inaccurate Job Costing</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Without accurate material tracking per project, contractors can't determine true job costs. This leads to unprofitable bids, cost overruns, and inability to identify which projects are profitable.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> Inaccurate job costing means contractors bid too low (losing money) or too high (losing bids). Without knowing true costs, contractors can't improve profitability or make informed business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2rem] text-white mb-20 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hard Data for <span className="text-blue-400">Construction Professionals</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Implementing professional <strong>inventory management for contractors</strong> delivers measurable ROI from the first project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "30%", label: "Waste Reduction", desc: "Average savings on materials like lumber and concrete." },
              { value: "40%", label: "Less Tool Loss", desc: "Using construction equipment tracking software." },
              { value: "95%", label: "Costing Accuracy", desc: "When linked with construction financial software." },
              { value: "15+", label: "Weekly Hours Saved", desc: "Eliminating manual inventory counts at jobsites." },
              { value: "99%", label: "Stock Visibility", desc: "Real-time updates via mobile scanning apps." },
              { value: "0€", label: "Free Entry Tier", desc: "Start today with zero financial management risk." }
            ].map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
                <div className="text-5xl font-extrabold text-blue-400 mb-2">{metric.value}</div>
                <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
                <p className="text-slate-400 text-sm">{metric.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices for Multi-Jobsite Management */}
      <section className="mb-24 bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Practices for Managing Inventory Across Multiple Jobsites</h2>
          <p className="text-lg text-slate-600 mb-8">
            Effective multi-jobsite inventory management requires specific strategies and processes. These best practices help contractors maintain accuracy, prevent waste, and ensure materials are available when needed.
          </p>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">1. Implement Mobile-First Tracking</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Field crews need mobile access to check materials in and out instantly. Use barcode or QR code scanning on smartphones to update inventory in real-time from any jobsite. This eliminates the delay between material usage and system updates.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Scan materials when delivered to jobsite</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Record usage as materials are consumed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Track transfers between locations instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Update inventory even without internet (syncs when connected)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">2. Centralize Visibility with Multi-Location Tracking</h3>
              </div>
              <p className="text-gray-700 mb-3">
                A centralized dashboard showing real-time inventory across all locations prevents duplicate orders and enables efficient material allocation. Know what's available at each jobsite, in vehicles, and at the warehouse.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>View all locations from single dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Check availability before ordering new materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Transfer materials between sites instead of ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Set location-specific reorder points and alerts</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">3. Set Automated Reorder Points by Location</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Each jobsite has different material needs and consumption rates. Set location-specific reorder points based on historical usage, project phase, and lead times. Automated alerts notify you when materials need reordering at specific locations.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Calculate reorder points: (Average Daily Usage × Lead Time) + Safety Stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Adjust for project phase (higher usage during peak construction)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Account for supplier lead times and delivery schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Review and adjust quarterly based on actual usage patterns</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-gray-900">4. Assign Materials to Specific Projects</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Track which materials are allocated to which projects for accurate job costing. When materials are used, assign them to the specific project to calculate true project costs and profitability.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Allocate materials to projects when delivered to jobsite</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Track usage per project for accurate job costing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Generate cost reports per project for profitability analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Use historical data to improve future project estimates</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-gray-900">5. Conduct Regular Cycle Counts</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Regular cycle counts using mobile devices maintain accuracy and detect discrepancies early. Count high-value items (A-items) monthly, medium-value (B-items) quarterly, and low-value (C-items) annually.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Use mobile scanning for faster, more accurate counts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Investigate discrepancies immediately to identify causes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Document findings and adjust processes to prevent recurrence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Target 95-99% accuracy across all locations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Tracking Section */}
      <section className="mb-24 bg-gray-50 py-16 px-4 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Construction Equipment Tracking: Tools and Machinery</h2>
          <p className="text-lg text-slate-600 mb-8">
            Construction equipment tracking software extends beyond materials to include tools, machinery, and vehicles. Proper equipment tracking prevents loss, schedules maintenance, and maximizes equipment utilization.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Heavy Machinery and Vehicles</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Track excavators, bulldozers, cranes, trucks, and other heavy equipment across locations. Log engine hours, schedule preventive maintenance, and assign equipment to specific projects.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Track location in real-time (warehouse, jobsite, maintenance)</li>
                <li>• Log engine hours and usage for maintenance scheduling</li>
                <li>• Schedule preventive maintenance to prevent downtime</li>
                <li>• Assign equipment to specific projects for cost tracking</li>
                <li>• Track fuel consumption and operating costs</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Hand Tools and Power Tools</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Track high-value tools (drills, saws, generators) individually with serial numbers. Monitor tool usage, schedule maintenance, and prevent theft through check-in/check-out tracking.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Assign unique identifiers (barcodes/QR codes) to each tool</li>
                <li>• Track who checked out tools and when</li>
                <li>• Set alerts for overdue tools or unauthorized movements</li>
                <li>• Schedule maintenance based on usage hours</li>
                <li>• Generate reports on tool utilization and costs</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Equipment Tracking Benefits</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-800 mb-1">Prevent Loss</p>
                <p className="text-blue-700">Know where every tool and piece of equipment is at all times. Reduce theft and misplaced items by 40%.</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800 mb-1">Extend Equipment Life</p>
                <p className="text-blue-700">Proactive maintenance scheduling extends equipment life by 35% and prevents expensive downtime.</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800 mb-1">Optimize Utilization</p>
                <p className="text-blue-700">Track which equipment is used most and ensure proper allocation across projects for maximum ROI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Costing Integration */}
      <section className="mb-24 bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Job Costing Integration: Accurate Financial Tracking</h2>
          <p className="text-lg text-slate-600 mb-8">
            Accurate job costing is essential for profitable construction projects. Inventory management software integrates with accounting systems to provide real-time material costs per project.
          </p>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Material Cost Tracking Per Project</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Assign materials to specific projects and track costs in real-time. When materials are used, costs are automatically allocated to the project, providing accurate job costing data.
              </p>
              <div className="bg-white rounded-lg p-4 mb-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">How It Works:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Materials are allocated to projects when delivered to jobsite</li>
                  <li>As materials are used, costs are tracked per project</li>
                  <li>Real-time cost reports show material expenses per project</li>
                  <li>Compare actual costs to estimates to identify variances</li>
                  <li>Export data to accounting systems for financial reporting</li>
                </ol>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Integration with Accounting Systems</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Inventory data integrates with construction financial management software (QuickBooks, Sage, etc.) to provide complete financial visibility. Material costs flow automatically into accounting systems for accurate financial reporting.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Benefits:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Eliminate manual data entry errors</li>
                    <li>• Real-time financial reporting</li>
                    <li>• Accurate job profitability analysis</li>
                    <li>• Improved cash flow management</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Data Exported:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Material costs per project</li>
                    <li>• Equipment usage costs</li>
                    <li>• Inventory valuation</li>
                    <li>• Cost of goods sold</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Modernizing Your Workflow</h2>
            <p className="text-slate-500">Move from <strong>construction inventory management Excel</strong> to a live system in 4 steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Map Jobsites", desc: "Digitize your physical locations from central warehouse to active sites." },
              { step: "02", title: "Bulk Import", desc: "Upload your current inventory tracking software for builders data instantly." },
              { step: "03", title: "Deploy Mobile", desc: "Give field crews the app to scan materials in/out as they work." },
              { step: "04", title: "Financial Sync", desc: "Push usage data to your construction financial management software." }
            ].map((item, index) => (
              <div key={index} className="relative pt-12 group">
                <span className="absolute top-0 left-0 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">
                  {item.step}
                </span>
                <div className="relative">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-4 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Unified Construction Inventory View</h2>
              <p className="text-slate-400">Monitor all material and equipment status from a single field-ready dashboard.</p>
            </div>
            
            
            
            <div className="mt-8 text-center text-slate-500 text-xs italic">
              Example dashboard: Real-time material burn rates and equipment location heatmaps.
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes to Avoid */}
      <section className="py-20 bg-red-50 rounded-3xl mb-20 px-8 lg:px-20 border border-red-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Construction Inventory Management Mistakes to Avoid</h2>
          <p className="text-lg text-slate-600 mb-8">
            Learning from common mistakes helps contractors avoid costly errors. These mistakes reduce profitability and operational efficiency.
          </p>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Relying on Excel Spreadsheets
              </h3>
              <p className="text-gray-700">
                Excel spreadsheets become outdated immediately, require manual updates, and are prone to errors. They can't provide real-time visibility across multiple locations or integrate with accounting systems. <strong>Solution:</strong> Use cloud-based inventory management software with mobile access for real-time updates.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Not Tracking Materials Per Project
              </h3>
              <p className="text-gray-700">
                Without project-level tracking, contractors can't determine true job costs or profitability. This leads to unprofitable bids and inability to identify which projects are profitable. <strong>Solution:</strong> Assign all materials to specific projects and track usage per project for accurate job costing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Ignoring Equipment Maintenance
              </h3>
              <p className="text-gray-700">
                Equipment failures cause expensive downtime and project delays. Without tracking engine hours and scheduling maintenance, equipment fails unexpectedly. <strong>Solution:</strong> Use equipment tracking software to log usage, schedule preventive maintenance, and extend equipment life by 35%.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Not Conducting Regular Counts
              </h3>
              <p className="text-gray-700">
                Without regular cycle counts, discrepancies accumulate undetected. Theft, damage, and errors go unnoticed until major problems occur. <strong>Solution:</strong> Conduct regular cycle counts using mobile devices—monthly for high-value items, quarterly for medium-value, annually for low-value.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Over-Ordering to Avoid Shortages
              </h3>
              <p className="text-gray-700">
                Without accurate tracking and reorder points, contractors over-order materials to avoid shortages. This ties up capital, increases storage costs, and creates waste. <strong>Solution:</strong> Set automated reorder points based on historical usage and lead times. Real-time tracking prevents both shortages and overstocking.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions About Construction Inventory Management</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <summary className="cursor-pointer font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6 text-center">Key Takeaways: Effective Construction Inventory Management</h2>
          <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Construction inventory management is complex but essential for profitability. Managing inventory across multiple jobsites, tracking equipment, preventing theft and waste, and integrating with accounting systems requires specialized tools and processes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Multi-location tracking is essential</p>
                  <p className="text-gray-700 text-sm">
                    Contractors manage inventory at warehouse, vehicles, and multiple jobsites simultaneously. Real-time visibility across all locations prevents duplicate orders, enables efficient allocation, and eliminates the 20% "ghost inventory" lost between locations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Mobile-first approach is critical</p>
                  <p className="text-gray-700 text-sm">
                    Field crews need mobile access to check materials in and out instantly. Barcode/QR scanning on smartphones updates inventory in real-time from any jobsite, eliminating delays and errors from manual processes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Job costing integration ensures profitability</p>
                  <p className="text-gray-700 text-sm">
                    Tracking materials per project and integrating with accounting systems provides accurate job costing. This enables competitive bidding, identifies profitable projects, and prevents cost overruns that reduce profitability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Equipment tracking extends asset life</p>
                  <p className="text-gray-700 text-sm">
                    Construction equipment tracking software logs usage, schedules maintenance, and prevents loss. Proactive maintenance extends equipment life by 35% and prevents expensive downtime from unexpected failures.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                By implementing modern construction inventory management practices—mobile tracking, multi-location visibility, automated reorder points, regular cycle counts, and job costing integration—contractors can reduce material waste by 30%, prevent theft and loss, ensure accurate job costing, and improve overall profitability. The investment in proper inventory management provides significant returns through better cost control and operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>




    </SeoPageLayout>
  );
}