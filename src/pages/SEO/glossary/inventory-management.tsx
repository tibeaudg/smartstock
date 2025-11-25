import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  BarChart3, 
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
  Settings
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';

export default function InventoryManagementGuide() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is inventory management?",
      answer: "Inventory management is the systematic approach to sourcing, storing, and tracking inventory—from raw materials to finished goods. It ensures businesses have the right products, in the right quantities, at the right time, while minimizing costs and maximizing efficiency."
    },
    {
      question: "What are the main types of inventory?",
      answer: "The four main types are: (1) Raw materials - inputs for production, (2) Work-in-Progress (WIP) - items being manufactured, (3) Finished goods - products ready for sale, and (4) MRO (Maintenance, Repair, Operations) - supplies that support production but aren't part of the final product."
    },
    {
      question: "Which inventory management method is best?",
      answer: "There's no universal best method. Just-in-Time (JIT) works well with reliable suppliers and stable demand. Materials Requirements Planning (MRP) suits complex manufacturers. Economic Order Quantity (EOQ) is ideal for steady-demand items. Choose based on your product type, demand variability, and supplier reliability."
    },
    {
      question: "How do I calculate Days Sales of Inventory (DSI)?",
      answer: "DSI = (Average Inventory ÷ Cost of Goods Sold) × 365. This metric shows how many days, on average, your inventory sits before being sold. Lower DSI typically indicates faster inventory turnover and better cash flow, though optimal levels vary by industry."
    },
    {
      question: "What causes inventory write-offs?",
      answer: "Common causes include product obsolescence, physical damage, theft or shrinkage, expiration (for perishable goods), and poor demand forecasting. High write-off rates signal deeper issues in procurement, storage, or sales forecasting processes."
    },
    {
      question: "How often should I conduct physical inventory counts?",
      answer: "Implement a hybrid approach: continuous cycle counting for high-value items (A-items) and periodic full counts for lower-priority stock. Most businesses benefit from weekly cycle counts of top-selling items and quarterly full inventory audits, though frequency depends on volume and accuracy requirements."
    },
    {
      question: "What is ABC inventory analysis?",
      answer: "ABC analysis categorizes inventory into three groups: A-items (high value, ~20% of items = 80% of value) need tight control, B-items (moderate value/volume) need moderate control, and C-items (low value, high volume) need basic controls. This prioritization optimizes resources and management focus."
    },
    {
      question: "What features should inventory management software have?",
      answer: "Essential features include real-time stock tracking, automated reorder points, barcode/QR scanning, multi-location support, detailed reporting and analytics, supplier management, integration with accounting and e-commerce platforms, mobile access, and role-based permissions for team collaboration."
    }
  ];

  const keyMethods = [
    {
      icon: Zap,
      title: "Just-in-Time (JIT)",
      description: "Order materials only when needed for production or sale",
      bestFor: "Stable demand, reliable suppliers",
      pros: "Minimal holding costs, reduced waste",
      cons: "Vulnerable to supply disruptions"
    },
    {
      icon: Settings,
      title: "Materials Requirements Planning (MRP)",
      description: "Demand-driven system using forecasts and BOMs",
      bestFor: "Manufacturers with complex production",
      pros: "Aligns purchasing with production schedules",
      cons: "Requires accurate forecasts and data"
    },
    {
      icon: TrendingUp,
      title: "Economic Order Quantity (EOQ)",
      description: "Mathematical model to find optimal order size",
      bestFor: "Items with steady, predictable demand",
      pros: "Minimizes total ordering and holding costs",
      cons: "Assumes constant demand and fixed costs"
    },
    {
      icon: Clock,
      title: "Days Sales of Inventory (DSI)",
      description: "Measures days to convert inventory to sales",
      bestFor: "Financial analysis and benchmarking",
      pros: "Simple, comparable metric",
      cons: "Optimal levels vary by industry"
    }
  ];

  const coreProcesses = [
    {
      icon: Package,
      title: "Ordering",
      description: "Determine when and how much to purchase or produce based on demand forecasts, lead times, and reorder points."
    },
    {
      icon: Boxes,
      title: "Storing",
      description: "Optimize warehouse layout, racking systems, and environmental controls for safety, accessibility, and efficiency."
    },
    {
      icon: BarChart3,
      title: "Tracking",
      description: "Maintain real-time, accurate records of stock levels, locations, and movements across all facilities."
    },
    {
      icon: Target,
      title: "Fulfillment",
      description: "Efficiently pick, pack, and ship products to customers while maintaining accuracy and speed."
    }
  ];

  const keyMetrics = [
    {
      metric: "Inventory Turnover",
      formula: "Cost of Goods Sold ÷ Average Inventory",
      why: "Higher turnover indicates efficient inventory management and strong sales"
    },
    {
      metric: "Days Sales of Inventory (DSI)",
      formula: "(Average Inventory ÷ COGS) × 365",
      why: "Shows how quickly inventory converts to sales; lower is typically better"
    },
    {
      metric: "Stock-out Rate",
      formula: "(Stock-outs ÷ Total Orders) × 100",
      why: "Tracks how often you can't fulfill orders due to lack of inventory"
    },
    {
      metric: "Carrying Cost",
      formula: "(Storage + Insurance + Taxes + Obsolescence) ÷ Total Inventory Value",
      why: "Reveals the true cost of holding inventory; typically 20-30% annually"
    },
    {
      metric: "Fill Rate",
      formula: "(Orders Fulfilled Completely ÷ Total Orders) × 100",
      why: "Measures service level and customer satisfaction"
    },
    {
      metric: "Inventory Accuracy",
      formula: "(Accurate Records ÷ Total Records Checked) × 100",
      why: "Critical for reliable decision-making; aim for 95%+ accuracy"
    }
  ];

  const redFlags = [
    {
      icon: AlertCircle,
      flag: "Frequent Inventory Write-offs",
      indicator: "Poor forecasting, obsolete products, or storage issues",
      action: "Review demand forecasting process and product lifecycle management"
    },
    {
      icon: AlertCircle,
      flag: "Persistent Stockouts on Best-Sellers",
      indicator: "Inadequate reorder points or supplier problems",
      action: "Adjust safety stock levels and evaluate supplier performance"
    },
    {
      icon: AlertCircle,
      flag: "Large System vs. Physical Count Discrepancies",
      indicator: "Process failures, theft, or data entry errors",
      action: "Implement cycle counting and review security/procedures"
    },
    {
      icon: AlertCircle,
      flag: "Excess Slow-Moving Inventory",
      indicator: "Overstocking, poor sales forecasts, or product-market misalignment",
      action: "Run ABC analysis, implement markdown strategy, improve forecasting"
    },
    {
      icon: AlertCircle,
      flag: "Rising Carrying Costs",
      indicator: "Inefficient space usage or excessive inventory levels",
      action: "Optimize storage layout and review replenishment policies"
    },
    {
      icon: AlertCircle,
      flag: "Changing Accounting Methods Frequently",
      indicator: "Potential manipulation of financial appearance",
      action: "Ensure consistency and review with financial advisors"
    }
  ];

  const improvementSteps = [
    {
      step: "1",
      title: "Clean Your Data",
      description: "Audit SKU descriptions, lead times, supplier performance, and historical sales data. Accurate data is the foundation of effective inventory management."
    },
    {
      step: "2",
      title: "Implement ABC Analysis",
      description: "Categorize inventory by value and velocity. Focus resources on A-items (high value) with tight controls, moderate attention to B-items, and basic controls for C-items."
    },
    {
      step: "3",
      title: "Standardize Replenishment Policies",
      description: "Establish clear reorder points, safety stock rules, and replenishment frequencies for each inventory segment based on demand patterns."
    },
    {
      step: "4",
      title: "Adopt Cycle Counting",
      description: "Replace disruptive full physical counts with frequent, targeted cycle counts. Focus on high-value items and investigate discrepancies immediately."
    },
    {
      step: "5",
      title: "Measure Supplier Performance",
      description: "Track on-time delivery rates, lead-time variability, and quality. Use this data to set appropriate safety stock and develop backup suppliers."
    },
    {
      step: "6",
      title: "Improve Demand Forecasting",
      description: "Combine historical sales, seasonality patterns, promotional impacts, and market signals. Use statistical methods and adjust for new products."
    },
    {
      step: "7",
      title: "Invest in the Right Technology",
      description: "Start with basic inventory features in your POS/ERP. Scale to dedicated inventory management software as complexity grows."
    },
    {
      step: "8",
      title: "Optimize Warehouse Layout",
      description: "Use slotting strategies, efficient pick paths, and batch picking to reduce labor time and fulfillment errors."
    },
    {
      step: "9",
      title: "Regular SKU Portfolio Review",
      description: "Quarterly review to identify slow movers for markdowns, bundling opportunities, or discontinuation. Keep your portfolio lean."
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce inventory costs by 20-35%" },
    { icon: CheckCircle, text: "Eliminate stockouts and overstock situations" },
    { icon: TrendingUp, text: "Improve cash flow with better inventory turnover" },
    { icon: Clock, text: "Save 15+ hours per week on manual processes" },
    { icon: Star, text: "Increase customer satisfaction with better availability" },
    { icon: BarChart3, text: "Make data-driven decisions with real-time insights" },
    { icon: Target, text: "Scale your business efficiently" },
    { icon: Shield, text: "Reduce waste and obsolescence" }
  ];

  const softwareFeatures = [
    {
      icon: BarChart3,
      title: "Real-time Tracking & Visibility",
      description: "Monitor stock levels across all locations instantly with live updates and alerts"
    },
    {
      icon: Camera,
      title: "Barcode & QR Code Scanning",
      description: "Speed up receiving, picking, and counting with mobile scanning capabilities"
    },
    {
      icon: Zap,
      title: "Automated Reorder Points",
      description: "Set minimum stock levels and get automatic alerts when inventory needs replenishment"
    },
    {
      icon: FileText,
      title: "Advanced Reporting & Analytics",
      description: "Gain insights into turnover rates, demand patterns, and forecasting with customizable reports"
    },
    {
      icon: Users,
      title: "Multi-location & User Management",
      description: "Manage inventory across warehouses with role-based access control"
    },
    {
      icon: Settings,
      title: "Integration Capabilities",
      description: "Connect with accounting, e-commerce, and shipping platforms for seamless operations"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager, Retail Plus",
      content: "Implementing proper inventory management reduced our carrying costs by 28% and eliminated stockouts completely. The ROI was evident within the first quarter.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "CEO, TechStart Solutions",
      content: "We switched from spreadsheets to a proper inventory system and saved 20 hours per week. The real-time tracking and automated reordering have been game-changers.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Warehouse Manager, Global Supply Co",
      content: "ABC analysis and cycle counting transformed our inventory accuracy from 78% to 99%. We now make confident decisions based on reliable data.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Inventory Management?', level: 1 },
    { id: 'why-it-matters', title: 'Why It Matters', level: 1 },
    { id: 'core-processes', title: 'Core Processes', level: 1 },
    { id: 'key-methods', title: 'Key Methods', level: 1 },
    { id: 'accounting', title: 'Accounting', level: 1 },
    { id: 'metrics-kpis', title: 'Essential KPIs', level: 1 },
    { id: 'red-flags', title: 'Red Flags to Watch', level: 1 },
    { id: 'how-to-optimize', title: 'How to Optimize', level: 1 },
    { id: 'choosing-software', title: 'Choosing Software', level: 1 },
    { id: 'stockflow-solution', title: 'StockFlow Solution', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Inventory Management Guide"
      heroTitle="Inventory Management Guide"
      updatedDate="20/11/2025"
      faqData={faqData}
      
      
    >
      <SEO
        title="Inventory Management 2025 - Inventory Management 2025"
        description="Read the guide inventory management to automate your processes. Learn how inventory management to automate your processes. Complete inventory. Try free now."
        keywords="inventory management, inventory management methods, inventory management system, JIT inventory, MRP, EOQ, DSI, inventory KPIs, inventory turnover, inventory optimization, inventory management software, ABC analysis, cycle counting, inventory best practices"
        url="https://www.stockflow.be/inventory-management"
        publishedTime="2025-11-06T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Complete guide to optimizing inventory operations: proven methods, essential KPIs, accounting principles, and actionable strategies to reduce costs and improve efficiency.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Inventory management is the systematic discipline of ordering, storing, tracking, and controlling inventory—from raw materials to finished goods. When executed properly, it reduces costs by 20-35%, prevents stockouts, improves cash flow, and increases profitability.
        </p>
      </div>

      {/* Key Takeaway Box */}
      <div className="my-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
        <p className="text-base text-slate-800 leading-relaxed m-0">
          <strong className="text-blue-900">Key Insight:</strong> This comprehensive guide covers definitions, proven methods (JIT, MRP, EOQ, DSI), accounting principles, essential KPIs, warning signs, real-world examples, and a step-by-step optimization playbook.
        </p>
      </div>

      {/* What is Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What is Inventory Management?</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Inventory management</strong> is the set of processes and systems a business uses to order, store, track, and sell stock—covering raw materials, components, work-in-progress (WIP), and finished goods.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              It encompasses both day-to-day operational tasks (receiving, put-away, picking, shipping) and strategic activities (demand forecasting, replenishment policy, safety stock planning, supplier management).
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-8">
              <p className="text-xl font-semibold text-gray-900">
                The objective is simple: <span className="text-blue-600">Have the right inventory, in the right quantity, at the right time, and at the right cost.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="why-it-matters" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Why Inventory Management Matters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <benefit.icon className="w-10 h-10 text-blue-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6">Key Impact Areas</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">Financial Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Lower storage, insurance, and handling expenses</span>
  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Avoid tying working capital in slow-moving stock</span>
  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Reduce obsolescence and write-off costs</span>
  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Align inventory investment with demand for better margins</span>
  </li>
</ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-3">Operational Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Improve service levels and reduce lost sales</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Smoother production and order fulfillment cycles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Faster response to market demand changes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Better supplier relationships and negotiating power</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Processes Section */}
      <section id="core-processes" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Core Processes in Inventory Management</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Inventory management can be divided into four operational pillars that work together to optimize your supply chain.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreProcesses.map((process, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="bg-white w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <process.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{process.title}</h3>
                <p className="text-gray-700">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Methods Section */}
      <section id="key-methods" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Key Inventory Management Methods</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            There's no one-size-fits-all approach. Choose the method that matches your product characteristics, demand variability, and supply chain reliability.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {keyMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <method.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">Best for:</p>
                    <p className="text-sm text-green-700">{method.bestFor}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Pros:</p>
                    <p className="text-sm text-blue-700">{method.pros}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">Cons:</p>
                    <p className="text-sm text-orange-700">{method.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Examples */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="w-7 h-7 mr-3 text-blue-600" />
              Real-World Examples
            </h3>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-3xl font-bold mb-4">Just-in-Time Example</h3>
                <p className="text-gray-700">
                  An electronics assembler schedules incoming PCB assemblies to arrive 2 hours before they hit the production line, minimizing storage space and handling costs—but relies heavily on reliable carriers and stable supply chains.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">MRP Example</h4>
                <p className="text-gray-700">
                  A furniture manufacturer uses sales forecasts and bills of materials (BOMs) to schedule lumber, upholstery, and hardware deliveries, ensuring production runs never stall due to missing components.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">EOQ Example</h4>
                <p className="text-gray-700">
                  A distributor selling steady-demand consumables calculates EOQ to minimize combined ordering and carrying costs, placing fewer orders but in optimal batch sizes that balance cost efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accounting Section */}
      <section id="accounting" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Accounting for Inventory</h2>
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Inventory is a current asset on the balance sheet. Accurate inventory accounting is critical for tax compliance, profitability analysis, and cash flow reporting.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-900">FIFO (First-In, First-Out)</h3>
              <p className="text-gray-700 mb-4">Earliest purchased goods are accounted as sold first.</p>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600"><strong>Best for:</strong> Perishable goods, industries with regular inventory turnover</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold mb-3 text-purple-900">LIFO (Last-In, First-Out)</h3>
              <p className="text-gray-700 mb-4">Newest inventory is accounted as sold first (less common outside U.S.).</p>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600"><strong>Best for:</strong> Tax benefits in inflationary periods (U.S. only)</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold mb-3 text-green-900">Weighted Average</h3>
              <p className="text-gray-700 mb-4">Smooths cost over a period by averaging all purchase prices.</p>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600"><strong>Best for:</strong> Commodities, items with frequent price fluctuations</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong>Important:</strong> Once you choose an accounting method, consistency is key. Frequent changes can signal financial manipulation and complicate tax reporting.
            </p>
          </div>
        </div>
      </section>

      {/* KPIs Section */}
      <section id="metrics-kpis" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential KPIs and Metrics</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Measure performance with both operational and financial metrics to drive continuous improvement.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {keyMetrics.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.metric}</h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4 font-mono text-sm text-gray-700 border border-gray-200">
                  {item.formula}
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>Why it matters:</strong> {item.why}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">Additional Important Metrics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Backorder Rate</p>
                  <p className="text-sm text-gray-700">Percentage of orders that can't be fulfilled immediately</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Obsolescence Rate</p>
                  <p className="text-sm text-gray-700">Percentage of inventory written off due to age or irrelevance</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Lead Time</p>
                  <p className="text-sm text-gray-700">Time from order placement to receipt of goods</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Order Cycle Time</p>
                  <p className="text-sm text-gray-700">Total time from order receipt to customer delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section id="red-flags" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Red Flags to Watch For</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These warning signs indicate deeper problems in your inventory management system. Address them immediately.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redFlags.map((item, index) => (
              <div key={index} className="bg-red-50 rounded-xl p-6 border-2 border-red-200 hover:border-red-400 transition-colors">
                <item.icon className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-lg font-bold text-red-900 mb-2">{item.flag}</h3>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Indicates:</strong> {item.indicator}
                </p>
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-xs text-gray-600">
                    <strong>Action:</strong> {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Optimize Section */}
      <section id="how-to-optimize" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">How to Optimize Your Inventory Management</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            A tactical playbook with practical, prioritized steps you can implement immediately.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {improvementSteps.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* 30-Day Checklist */}
          <div className="mt-12 bg-white rounded-xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="w-7 h-7 mr-3 text-green-600" />
              Your First 30 Days: Action Checklist
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">1</div>
                  <div>
                    <p className="font-semibold text-gray-900">Run ABC Analysis</p>
                    <p className="text-sm text-gray-600">Identify top 20% SKUs driving 80% of value</p>
            </div>
            </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">2</div>
                  <div>
                    <p className="font-semibold text-gray-900">Validate Lead Times</p>
                    <p className="text-sm text-gray-600">Confirm actual lead times with top 5 suppliers</p>
            </div>
            </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Set Reorder Points</p>
                    <p className="text-sm text-gray-600">Establish points for A-items, start weekly cycle counts</p>
          </div>
              </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">4</div>
                  <div>
                    <p className="font-semibold text-gray-900">Establish Baseline Metrics</p>
                    <p className="text-sm text-gray-600">Measure current fill rate, turnover, and DSI</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">5</div>
                  <div>
                    <p className="font-semibold text-gray-900">Create Automation Roadmap</p>
                    <p className="text-sm text-gray-600">Plan for alerts, reorder triggers, and scanning</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 mt-1">6</div>
                  <div>
                    <p className="font-semibold text-gray-900">Review & Optimize</p>
                    <p className="text-sm text-gray-600">Weekly reviews, monthly adjustments, quarterly audits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choosing Software Section */}
      <section id="choosing-software" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Choosing Inventory Management Software</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Match software capabilities to your operational needs for maximum ROI and efficiency.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {softwareFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-6">Key Selection Criteria</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-3">Must-Have Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Real-time stock visibility across locations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Automated reorder point alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Mobile scanning capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Integration with existing systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive reporting and analytics</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-3">Consider for Growth</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Advanced demand forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Lot/serial number tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Multi-warehouse management</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">API access for custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Automated PO generation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* StockFlow Solution Section */}
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Implement These Strategies with StockFlow</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Put inventory management best practices into action with a modern, affordable, and powerful inventory management system built for growing businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Free Plan</div>
              <div className="text-sm opacity-90">Up to 100 products - perfect to start</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">Expert help whenever you need it</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Accuracy</div>
              <div className="text-sm opacity-90">Real-time tracking precision</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Real-time inventory tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Automated reorder alerts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Mobile barcode scanning</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Multi-location management</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced analytics & reporting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Integration with e-commerce & accounting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>User role management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span>Bank-level security & GDPR compliance</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Start Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 500+ businesses who signed up this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Real results from businesses implementing proper inventory management</p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Bottom Line Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">The Bottom Line</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Inventory management is both an <strong>operational discipline</strong> and a <strong>strategic lever</strong>. When you treat it as a continuous improvement process—backed by accurate data, appropriate methods (JIT, MRP, EOQ, DSI), clear KPIs, and fit-for-purpose software—you reduce costs, improve service levels, and free up cash for growth.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <p className="text-lg font-semibold text-gray-900 mb-2">Start with these fundamentals:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Clean, accurate data as your foundation</li>
                  <li>✓ Segment inventory intelligently (ABC analysis)</li>
                  <li>✓ Experiment with policies for each segment</li>
                  <li>✓ Measure results consistently</li>
                  <li>✓ Scale tools where they deliver clear ROI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "name": "Inventory Management",
          "description": "Inventory management is the systematic discipline of ordering, storing, tracking, and controlling inventory—from raw materials to finished goods. It ensures businesses have the right products, in the right quantities, at the right time, while minimizing costs and maximizing efficiency.",
          "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "StockFlow Inventory Glossary"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Inventory Management: Complete Guide to Methods, KPIs & Best Practices",
          "description": "Master inventory management: learn core methods (JIT, MRP, EOQ), essential KPIs, accounting principles, red flags to avoid, and step-by-step optimization strategies.",
          "image": "https://www.stockflow.be/Inventory-Management.png",
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
            "@id": "https://www.stockflow.be/inventory-management"
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
          "name": "How to Optimize Your Inventory Management",
          "description": "Step-by-step guide to implementing effective inventory management practices",
          "step": improvementSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Inventory Management Software",
          "description": "Modern inventory management software with real-time tracking, automated reorder points, barcode scanning, and comprehensive analytics.",
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
            "ratingCount": "1000",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Real-time inventory tracking",
            "Automated reorder points",
            "Mobile barcode scanning",
            "Multi-location management",
            "Advanced analytics",
            "E-commerce integration"
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
              "name": "Glossary",
              "item": "https://www.stockflow.be/glossary"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Inventory Management",
              "item": "https://www.stockflow.be/inventory-management"
            }
          ]
        }
      ]} />
    </SeoPageLayout>
  );
}
