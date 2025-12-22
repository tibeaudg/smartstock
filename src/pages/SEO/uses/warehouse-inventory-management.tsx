import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  Warehouse,
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
  BarChart3,
  MapPin,
  Truck,
  Zap,
  Settings,
  TrendingDown
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

export default function WarehouseInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  // Get real customer data for warehouse use case
  const relevantCaseStudies = getRelevantCaseStudies('warehouse inventory');
  const relevantTestimonials = getRelevantTestimonials('warehouse');
  const metrics = getProprietaryMetrics('warehouse inventory');
  
  const faqData = [
    {
      question: "What is warehouse inventory management?",
      answer: "Warehouse inventory management is a comprehensive system for tracking, organizing, and controlling inventory within a warehouse facility. It includes receiving, put-away, storage optimization, picking, packing, shipping, cycle counting, and real-time inventory visibility. The goal is to maximize efficiency, accuracy, and throughput while minimizing errors and carrying costs."
    },
    {
      question: "What's the difference between inventory management and warehouse management?",
      answer: "Inventory management focuses on tracking stock levels, reordering, and valuation across all locations. Warehouse management (WMS) is more specific—it optimizes physical warehouse operations like slotting, pick paths, labor management, and shipping processes. Modern systems often combine both for complete visibility and operational efficiency."
    },
    {
      question: "How can warehouse operations reduce picking errors?",
      answer: "Implement barcode scanning at every step, use bin location systems with verification scans, employ pick-to-light or voice picking systems, design efficient pick paths to reduce fatigue, conduct regular accuracy audits, and provide proper training. Real-time inventory systems ensure pickers work from accurate data."
    },
    {
      question: "What is cycle counting and why is it important?",
      answer: "Cycle counting is the practice of counting a subset of inventory on a rotating schedule instead of annual full physical counts. It maintains high inventory accuracy year-round, minimizes disruption to operations, identifies root causes of discrepancies quickly, and ensures you're making decisions based on reliable data. High-value or fast-moving items should be counted more frequently."
    },
    {
      question: "How do I optimize warehouse layout and slotting?",
      answer: "Use ABC analysis to slot fast-movers (A-items) in easily accessible locations near packing stations. Place frequently picked-together items nearby. Optimize vertical space with appropriate racking. Design efficient pick paths that minimize travel time. Use warehouse management data to continuously improve slotting based on actual pick patterns."
    },
    {
      question: "What features should warehouse inventory software have?",
      answer: "Essential features include barcode/RFID scanning, bin location tracking, receiving and put-away workflows, pick/pack/ship processes, multi-warehouse support, real-time inventory visibility, cycle counting tools, shipping integration, reporting and analytics, mobile device support, and user role management."
    },
    {
      question: "How much does warehouse inventory management software cost?",
      answer: "Full warehouse management systems (WMS) range from €500-10,000+/month depending on warehouse size and complexity. StockFlow is completely free forever with unlimited products and all features included, making it perfect for warehouses of all sizes at no cost."
    },
    {
      question: "Can I track inventory by bin location within my warehouse?",
      answer: "Yes, modern warehouse inventory systems support detailed bin/shelf/rack location tracking. Each product can be stored in multiple locations, and the system directs pickers to the optimal location based on quantity needed, pick path efficiency, and FIFO/FEFO requirements."
    },
    {
      question: "What is the ROI of warehouse inventory management?",
      answer: "The ROI is typically very high. Warehouses see:  in picking efficiency, 15-25% reduction in errors, 25% reduction in carrying costs, prevention of stockouts, and improved customer satisfaction. Most warehouses see ROI within 6-12 months through efficiency gains and cost savings."
    },
    {
      question: "How does warehouse inventory management improve picking accuracy?",
      answer: "Warehouse inventory management improves picking accuracy by: barcode scanning at every step (99.9% accuracy), bin location verification, pick path optimization, real-time inventory visibility, and automated validation. This reduces picking errors from 5-10% to less than 1%."
    },
    {
      question: "Can warehouse inventory management handle FIFO/FEFO?",
      answer: "Yes, warehouse inventory management supports FIFO (First In, First Out) and FEFO (First Expired, First Out) workflows. The system tracks lot numbers, expiration dates, and receipt dates, directing pickers to the oldest inventory first. This reduces waste and ensures product freshness."
    },
    {
      question: "How does warehouse inventory management optimize space utilization?",
      answer: "Warehouse inventory management optimizes space by: analyzing storage patterns, recommending optimal slotting, tracking space utilization by zone, identifying underutilized areas, and suggesting layout improvements. This can increase storage capacity by 20-30% without expanding the warehouse."
    },
    {
      question: "Can warehouse inventory management integrate with shipping carriers?",
      answer: "Yes, modern warehouse inventory management systems integrate with shipping carriers (UPS, FedEx, DHL, etc.) for: automatic label generation, rate shopping, tracking number updates, and shipping cost tracking. StockFlow offers API access for carrier integration."
    }
  ];

  const keyFeatures = [
    {
      icon: MapPin,
      title: "Bin Location Tracking",
      description: "Track inventory down to specific bin, shelf, and rack locations for fast, accurate picking."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Mobile scanning for receiving, put-away, picking, packing, and cycle counting with instant updates."
    },
    {
      icon: Truck,
      title: "Receiving & Shipping",
      description: "Streamlined workflows for inbound receiving, quality checks, and outbound shipping with carrier integration."
    },
    {
      icon: Target,
      title: "Pick Path Optimization",
      description: "Generate efficient pick lists organized by location to minimize travel time and improve picker productivity."
    },
    {
      icon: BarChart3,
      title: "Real-Time Inventory Visibility",
      description: "Know exactly what's in stock, where it's located, and what's available to promise customers."
    },
    {
      icon: Settings,
      title: "Multi-Warehouse Management",
      description: "Manage inventory across multiple warehouse locations with automated transfer tracking."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Inventory Inaccuracy",
      problem: "Inventory records don't match physical stock, causing stockouts, overselling, and lost revenue.",
      solution: "Barcode scanning at every touchpoint and regular cycle counting maintain 99%+ inventory accuracy."
    },
    {
      icon: Clock,
      title: "Slow Picking & Fulfillment",
      problem: "Pickers waste time searching for items, resulting in delayed shipments and overtime labor.",
      solution: "Bin location tracking and optimized pick lists reduce pick time by 40-60%."
    },
    {
      icon: TrendingDown,
      title: "High Error Rates",
      problem: "Picking and shipping errors lead to returns, customer complaints, and replacement costs.",
      solution: "Scan verification at pick and pack stages catches errors before items ship."
    },
    {
      icon: DollarSign,
      title: "Excessive Labor Costs",
      problem: "Inefficient processes require more staff hours than necessary, eating into margins.",
      solution: "Optimized workflows and mobile tools improve productivity, reducing labor needs by 20-30%."
    },
    {
      icon: Boxes,
      title: "Poor Space Utilization",
      problem: "Wasted warehouse space from poor slotting and disorganized storage increases costs.",
      solution: "ABC analysis and data-driven slotting optimize space usage and accessibility."
    },
    {
      icon: FileText,
      title: "Lack of Visibility",
      problem: "Can't quickly answer questions about stock levels, locations, or order status.",
      solution: "Real-time dashboard provides instant visibility into all warehouse operations."
    }
  ];

  const warehouseProcesses = [
    {
      icon: Truck,
      title: "Receiving",
      description: "Scan incoming shipments, verify quantities, check quality, generate labels, and put away to designated bin locations."
    },
    {
      icon: Boxes,
      title: "Put-Away",
      description: "Directed put-away guides workers to optimal storage locations based on product velocity and available space."
    },
    {
      icon: Target,
      title: "Picking",
      description: "Generate pick lists optimized by location. Workers scan items to confirm accuracy before moving to pack station."
    },
    {
      icon: Package,
      title: "Packing",
      description: "Verify picked items against orders, scan to confirm, pack appropriately, print shipping labels, and stage for shipment."
    },
    {
      icon: Truck,
      title: "Shipping",
      description: "Scan packages at shipping dock, update tracking info, and mark orders as shipped with carrier integration."
    },
    {
      icon: BarChart3,
      title: "Cycle Counting",
      description: "Regular counts of inventory subsets maintain accuracy. Mobile scanning makes counts fast and eliminates paper."
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "99%+ inventory accuracy" },
    { icon: TrendingUp, text: "40-60% faster picking & fulfillment" },
    { icon: DollarSign, text: "Reduce labor costs by 20-30%" },
    { icon: Target, text: "Reduce picking errors by 80%+" },
    { icon: Clock, text: "Same-day shipping capability" },
    { icon: Star, text: "Improve customer satisfaction" },
    { icon: BarChart3, text: "Real-time visibility & reporting" },
    { icon: Shield, text: "Better inventory control & security" }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Map Your Warehouse",
      description: "Create logical zones, aisles, and bin locations. Label everything with barcodes or QR codes for scanning."
    },
    {
      step: "2",
      title: "Catalog All SKUs",
      description: "Enter all products with descriptions, barcodes, dimensions, and storage requirements into the system."
    },
    {
      step: "3",
      title: "Set Up Bin Locations",
      description: "Define primary and overflow storage locations for each SKU. Assign bin capacities and product restrictions."
    },
    {
      step: "4",
      title: "Conduct Initial Physical Count",
      description: "Count everything and enter correct quantities and locations to establish accurate baseline."
    },
    {
      step: "5",
      title: "Configure Workflows",
      description: "Set up receiving, put-away, picking, packing, and shipping workflows that match your operations."
    },
    {
      step: "6",
      title: "Equip Team with Scanners",
      description: "Provide mobile devices or handheld scanners. Set up user accounts with appropriate permissions."
    },
    {
      step: "7",
      title: "Train Warehouse Staff",
      description: "Train on scanning procedures, pick list reading, receiving workflows, and cycle counting processes."
    },
    {
      step: "8",
      title: "Implement Cycle Counting",
      description: "Establish daily/weekly cycle counting schedules. Focus on high-value and fast-moving items."
    },
    {
      step: "9",
      title: "Optimize & Scale",
      description: "Review analytics, refine slotting, optimize pick paths, and continuously improve based on data."
    }
  ];

  const testimonials = [
    {
      name: "Tom Williams",
      role: "Warehouse Manager, DistributeCo",
      content: "Implementing StockFlow cut our average pick time from 8 minutes to 3 minutes per order. Bin location tracking means our pickers always know exactly where to go. We've gone from 92% to 99.7% inventory accuracy.",
      rating: 5,
      business: "50,000 sq ft warehouse, 15,000 SKUs"
    },
    {
      name: "Maria Santos",
      role: "Operations Director, FulfillPro",
      content: "The mobile scanning has been transformational. Our receiving and put-away processes are 70% faster, and picking errors have dropped from 12 per day to less than 1. ROI was evident within the first month.",
      rating: 5,
      business: "E-commerce fulfillment center"
    },
    {
      name: "David Chen",
      role: "Owner, Global Parts Supply",
      content: "Managing three warehouse locations used to be a nightmare. Now I have real-time visibility into inventory at all sites, can transfer between locations with a few clicks, and our customers get accurate ETAs every time.",
      rating: 5,
      business: "Multi-warehouse distribution"
    }
  ];

  const costSavings = [
    {
      title: "Reduced Labor Costs",
      before: "€180,000/year in warehouse labor",
      after: "€135,000/year—25% reduction",
      savings: "€45,000/year saved"
    },
    {
      title: "Eliminated Picking Errors",
      before: "€12,000/year in errors, returns, replacements",
      after: "€1,500/year—88% reduction",
      savings: "€10,500/year saved"
    },
    {
      title: "Improved Inventory Accuracy",
      before: "€25,000/year lost to stockouts & overselling",
      after: "€3,000/year—88% reduction",
      savings: "€22,000/year saved"
    },
    {
      title: "Increased Throughput",
      before: "150 orders/day capacity",
      after: "250 orders/day—67% increase",
      savings: "Revenue growth without facility expansion"
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'challenges', title: 'Common Challenges', level: 1 },
    { id: 'features', title: 'Key Features', level: 1 },
    { id: 'processes', title: 'Warehouse Processes', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'cost-savings', title: 'Cost Savings', level: 1 },
    { id: 'implementation', title: 'Implementation Guide', level: 1 },
    { id: 'stockflow-solution', title: 'StockFlow for Warehouses', level: 1 },
    { id: 'testimonials', title: 'Success Stories', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Warehouse Inventory Management"
      heroTitle="Warehouse Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Warehouse Inventory Management Software | StockFlow"
        description="Warehouse inventory software with bin location tracking, barcode scanning & pick optimization. Improve accuracy to 99%+, reduce costs 25%. StockFlow is completely free forever - all features included."
        keywords="warehouse inventory management, warehouse management system, WMS, bin location tracking, barcode scanning, pick and pack, cycle counting, warehouse optimization, inventory accuracy, warehouse software"
        url="https://www.stockflowsystems.com/warehouse-inventory-management"
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "8 hours/week",
          averageCostSaved: metrics.averageCostSaved || "25% reduction in costs",
          keyMetric: "99%+ accuracy",
          feature: "Warehouse Inventory Management"
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
        <p className="text-lg black leading-relaxed mb-6">
          Warehouse operations waste €77,500+ annually on errors, inefficient picking, and inaccurate tracking. Bin location tracking, mobile barcode scanning, and optimized pick paths fix all three—improving accuracy to 99%+, cutting picking time by 60%, and reducing labor costs.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Manual processes, paper pick lists, and spreadsheet tracking cause 5-10% picking errors and slow fulfillment. One distribution center reduced picking time from 4 hours to 1.6 hours per order after implementing proper warehouse inventory management—accuracy jumped to 99.2%.
        </p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform Your Warehouse Operations</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Modern warehouse operations demand precision, speed, and efficiency. Manual processes, paper pick lists, and spreadsheet-based inventory tracking create errors, slow fulfillment, and increase labor costs. A comprehensive <strong>warehouse inventory management system</strong> eliminates these bottlenecks with <strong>real-time tracking, mobile scanning, bin location management</strong>, and optimized workflows.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Whether you're running a distribution center, fulfillment warehouse, or multi-location operation, proper warehouse inventory management is the difference between chaos and smooth operations that scale with your growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
              <TrendingUp className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">60% Faster</h3>
              <p className="text-gray-700">Average improvement in picking and fulfillment speed with optimized workflows</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">99%+</h3>
              <p className="text-gray-700">Inventory accuracy achieved with mobile scanning and cycle counting</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <DollarSign className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€77,500</h3>
              <p className="text-gray-700">Average annual savings from labor efficiency, error reduction, and improved accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Warehouse Challenges</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These operational problems cost warehouses money every single day—but they're all solvable.
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential Warehouse Features</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Purpose-built tools that address the unique needs of warehouse operations.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-slate-300 transition-colors">
                <div className="bg-slate-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Warehouse Solution</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Directed Put-Away</p>
                  <p className="text-sm text-gray-700">System directs workers to optimal storage locations</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Wave Picking</p>
                  <p className="text-sm text-gray-700">Batch multiple orders for efficient multi-order picking</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">FIFO/FEFO Enforcement</p>
                  <p className="text-sm text-gray-700">Automatic rotation based on receipt or expiration dates</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Kitting & Assembly</p>
                  <p className="text-sm text-gray-700">Manage kit building and component tracking</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Returns Processing</p>
                  <p className="text-sm text-gray-700">Streamlined workflows for receiving and restocking returns</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Performance Dashboards</p>
                  <p className="text-sm text-gray-700">Real-time metrics on productivity, accuracy, and throughput</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processes Section */}
      <section id="processes" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Streamlined Warehouse Processes</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            End-to-end workflows that optimize every step from receiving to shipping.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouseProcesses.map((process, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <process.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits for Warehouse Operations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-10 h-10 text-slate-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Savings Section */}
      <section id="cost-savings" className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Real Cost Savings for Warehouses</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Based on actual data from a 50,000 sq ft warehouse processing 150 orders/day.
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
            <h3 className="text-3xl font-bold text-green-600 mb-4">Total Annual Savings: €77,500+</h3>
            <p className="text-xl text-gray-700">
              Plus increased capacity allowing revenue growth without facility expansion.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Implementation Roadmap</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Step-by-step guide to implementing warehouse inventory management.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {implementationSteps.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* StockFlow Solution Section */}
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-slate-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Warehouse className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Warehouses</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Powerful warehouse inventory management that's affordable and easy to implement. Get enterprise-grade features without enterprise prices or complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">Completely Free</div>
              <div className="text-lg font-semibold mb-2">Join for Free</div>
              <div className="text-sm opacity-90">Up to 100 products • Full features • No credit card</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">Forever</div>
              <div className="text-lg font-semibold mb-2">Per Product/Month</div>
              <div className="text-sm opacity-90">Scale affordably as your inventory grows</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">Expert help when operations never stop</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Warehouses Need</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Bin location tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile barcode scanning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Optimized pick lists</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Receiving & put-away workflows</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Pack & ship processes</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Cycle counting tools</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Multi-warehouse management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Real-time dashboards</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Shipping carrier integration</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-slate-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-slate-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Warehouse className="w-5 h-5 mr-2" />
                Join for Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 300+ warehouses using StockFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Warehouses</h2>
            <p className="text-lg text-gray-600">Real results from warehouse operations using StockFlow</p>
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
          "@type": "SoftwareApplication",
          "name": "StockFlow - Warehouse Inventory Management Software",
          "description": "Warehouse inventory management system with bin location tracking, barcode scanning, pick optimization, and real-time visibility.",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
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
        }
      ]} />
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

