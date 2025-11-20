import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  CheckCircle, 
  Star, 
  ArrowRight,
  Warehouse,
  Zap,
  BarChart3,
  Users,
  Truck,
  Boxes,
  Target,
  Shield,
  Cloud,
  Database,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function WarehouseManagementSystem() {
  usePageRefresh();
  const [roiInputs, setRoiInputs] = useState({
    inventoryValue: '',
    hoursPerWeek: '',
    hourlyRate: '',
    stockoutLosses: ''
  });
  const [roiResult, setRoiResult] = useState<{
    carryingCostSavings: number;
    timeSavings: number;
    stockoutSavings: number;
    netSavings: number;
    roi: number;
  } | null>(null);

  const pageMetadata = {
    published: '2025-11-14',
    updated: '2025-11-14',
    updatedDisplay: '14/11/2025'
  };

  const faqData = [
    {
      question: "What is a Warehouse Management System (WMS)?",
      answer: "A WMS is software that manages and optimizes warehouse operations including receiving, storage, inventory tracking, and order fulfillment. It provides real-time visibility, intelligent task assignment, and seamless integrations with ERP, e-commerce, and supply chain systems."
    },
    {
      question: "Why is a WMS important?",
      answer: "A WMS improves accuracy, reduces labor costs, accelerates shipping, and gives companies real-time operational visibility. It enables businesses to reduce stockouts and overstocking, improve order accuracy and fulfillment speed, lower labor and operational costs, and gain real-time insights into warehouse performance."
    },
    {
      question: "Is a WMS different from inventory management?",
      answer: "Yes. Inventory management handles stock levels and replenishment, while WMS handles the entire physical workflow of the warehouse including receiving, putaway, picking, packing, and shipping operations. WMS focuses on warehouse operations, automation, and picking optimization."
    },
    {
      question: "What types of businesses need a WMS?",
      answer: "Any operation dealing with regular inventory movement, especially e-commerce, retail, manufacturing, and 3PL providers. Industries using WMS include e-commerce & fulfillment centers, retail distribution hubs, manufacturing plants, 3PL logistics providers, pharmaceutical and cold-chain storage, and food & beverage warehouses."
    },
    {
      question: "Does automation require a WMS?",
      answer: "Yes. Robots and automated systems depend on a WMS to orchestrate tasks and maintain data accuracy. Modern WMS systems integrate with Autonomous Mobile Robots (AMRs), Automated Storage & Retrieval Systems (AS/RS), AGVs, conveyor controls, and drones for inventory counting."
    },
    {
      question: "What are the key features of a modern warehouse management system?",
      answer: "Key features include real-time inventory tracking, barcode scanning, automated picking and packing, integration with ERP systems, reporting and analytics, multi-location support, mobile accessibility, wave/batch/zone picking, smart receiving & putaway, labor optimization, and automated shipping & documentation."
    },
    {
      question: "How does cloud-based warehouse management differ from on-premise systems?",
      answer: "Cloud-based WMS systems offer better accessibility, automatic updates, lower upfront costs, and easier integration with other business systems. They provide fast deployment, automatic updates, strong integrations, and lower IT overhead. On-premise systems provide more control but require higher maintenance and investment."
    }
  ];

  const coreFunctions = [
    {
      icon: Database,
      title: "Real-Time Inventory Management",
      description: "A WMS continuously tracks stock levels, location data, and product movement using barcodes, RFID, and IoT sensors. Benefits include accurate forecasts, traceability for recalls, faster cycle counts, and zero need for spreadsheets or manual checks."
    },
    {
      icon: Target,
      title: "Optimized Order Fulfillment",
      description: "Advanced WMS platforms support wave, batch, and zone picking; pick-to-light & put-to-light systems; voice-guided and AR-assisted picking; and robotic picking integration. These methods reduce worker travel time and maximize throughput."
    },
    {
      icon: Boxes,
      title: "Smart Receiving & Putaway",
      description: "A WMS validates incoming shipments, generates labels, and assigns the best storage locations based on rules like turnover speed or product size."
    },
    {
      icon: Users,
      title: "Labor & Resource Optimization",
      description: "Track productivity, assign tasks intelligently, and reduce overtime by optimizing employee routing, workload balancing, and equipment utilization."
    },
    {
      icon: Truck,
      title: "Automated Shipping & Documentation",
      description: "Integrated shipping carriers, automated label printing, and real-time order updates ensure smoother dispatching."
    },
    {
      icon: BarChart3,
      title: "Analytics, Reporting & Forecasting",
      description: "AI-driven dashboards reveal order cycle times, inventory movements, bottlenecks in picking/packing, and labor efficiency trends."
    }
  ];

  const advancedCapabilities = [
    {
      icon: Zap,
      title: "Automation & Robotics Support",
      description: "Modern WMS systems integrate with Autonomous Mobile Robots (AMRs), Automated Storage & Retrieval Systems (AS/RS), AGVs and conveyor controls, and drones for inventory counting."
    },
    {
      icon: TrendingUp,
      title: "AI & Predictive Intelligence",
      description: "Cutting-edge systems use machine learning to predict demand, optimize labor allocation, simulate warehouse layouts, and suggest replenishment or slotting changes."
    },
    {
      icon: Cloud,
      title: "IoT Connectivity",
      description: "IoT sensors add real-time signals on equipment usage, temperature monitoring (e.g., cold chain), fleet movement, and inventory conditions."
    },
    {
      icon: Shield,
      title: "AR/VR Applications",
      description: "AR glasses for picking, VR training for forklift operators, and digital twins of warehouses enhance operations and training."
    }
  ];

  const wmsTypes = [
    {
      type: "Standalone WMS",
      description: "Best for highly specialized needs with more customization, higher upfront costs, and on-premise installation.",
      bestFor: "Specialized warehouse operations"
    },
    {
      type: "Cloud-Based WMS (SaaS)",
      description: "Fast-growing due to low cost and easy scaling. Fast deployment, automatic updates, strong integrations, and lower IT overhead.",
      bestFor: "Most businesses seeking flexibility"
    },
    {
      type: "Integrated WMS (ERP/SCM Modules)",
      description: "Works as part of a larger ecosystem with unified business data, less specialized features, ideal for mid-to-large enterprises.",
      bestFor: "Enterprises needing unified data"
    }
  ];

  const industries = [
    "E-commerce & fulfillment centers",
    "Retail distribution hubs",
    "Manufacturing plants",
    "3PL logistics providers",
    "Pharmaceutical and cold-chain storage",
    "Food & beverage warehouses"
  ];

  const challenges = [
    "Manual processes causing errors",
    "Slow receiving and putaway",
    "Poor inventory accuracy",
    "Labor shortages",
    "Inefficient picking routes",
    "Lack of real-time visibility",
    "Difficulty scaling or integrating new technology"
  ];

  return (
    <SeoPageLayout 
      title="Warehouse Management System"
      heroTitle="Warehouse Management System"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Warehouse Management System 2025 - Warehouse Management S..."
        description="Discover how warehouse management system to choose the best software. Learn how warehouse management system to save time and money.. Start free today."
        keywords="warehouse management system, WMS software, warehouse automation, warehouse inventory system, warehouse operations, supply chain management software, real-time inventory management, warehouse picking systems, cloud WMS, warehouse optimization, logistics software, how does a warehouse management system work, benefits of a WMS, advanced WMS features, WMS vs inventory management system, best WMS software for ecommerce, cloud-based warehouse management system, warehouse digitalization tools"
        url="https://www.stockflow.be/warehouse-management-system"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              What Is a Warehouse Management System (WMS)? Complete Guide 2025
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              A <strong>Warehouse Management System (WMS)</strong> is software that controls, optimizes, and automates warehouse operations — from receiving and storing goods to picking, packing, and shipping. Modern WMS platforms offer <strong>real-time visibility</strong>, intelligent task assignment, and seamless integrations with ERP, e-commerce, and supply chain systems.
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              In an era where speed and accuracy define logistics, a well-implemented WMS becomes the brain of the warehouse: orchestrating people, inventory, automation, and data to deliver consistent performance.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm text-gray-600">Based on 326 reviews</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center justify-center border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why WMS Matters Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Why a WMS Matters More Than Ever
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto text-center">
            Today's supply chains run at breakneck speed. Customers expect next-day delivery. Inventory cycles are shorter. Labor shortages and rising costs increase pressure to operate smarter.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reduce Stockouts and Overstocking</h3>
              <p className="text-gray-600">Maintain optimal inventory levels with real-time tracking and predictive analytics.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Improve Order Accuracy</h3>
              <p className="text-gray-600">Minimize errors and improve fulfillment speed with automated processes.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lower Labor Costs</h3>
              <p className="text-gray-600">Optimize workforce allocation and reduce overtime through intelligent task assignment.</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
              <p className="text-gray-600">Gain real-time insights into warehouse performance and operational efficiency.</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
              <p className="text-gray-600">Integrate with carriers, robots, and supply chain systems for unified operations.</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Higher Productivity</h3>
              <p className="text-gray-600">Achieve higher productivity, fewer errors, and more predictable operations.</p>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <p className="text-xl font-semibold mb-2">The result:</p>
            <p className="text-2xl font-bold">Higher productivity, fewer errors, and more predictable operations.</p>
          </div>
        </div>
      </section>

      {/* Core Functions Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Core Functions of a Warehouse Management System
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A comprehensive WMS handles every aspect of warehouse operations from receiving to shipping.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFunctions.map((func, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <func.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{func.title}</h3>
                <p className="text-gray-600">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Advanced WMS Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern WMS systems leverage cutting-edge technology to optimize warehouse operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedCapabilities.map((capability, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
                <capability.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                <p className="text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of WMS Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Types of Warehouse Management Systems
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the right WMS type based on your business needs and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {wmsTypes.map((type, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">{type.type}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-semibold text-blue-800">Best for: {type.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WMS vs Other Systems Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              WMS vs. Other Warehouse Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the differences helps you choose the right solution for your needs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">System</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Focus</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">WMS</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Warehouse operations, automation, picking</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High-volume logistics</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Inventory Management System</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Stock levels & replenishment</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Small businesses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">ERP</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Finance, HR, purchasing, light warehouse tasks</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Enterprises needing unified data</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">WES/WCS</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Automation hardware control</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Robot-heavy warehouses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Common Challenges in Warehousing That WMS Solves
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A WMS eliminates these pain points through automation, data-driven decisions, and digital workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Industries Using WMS Today
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each industry leverages different features such as batch tracking, expiry management, or kitting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600 mb-3" />
                <p className="text-lg font-semibold text-gray-900">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Calculate Your WMS ROI
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how much a Warehouse Management System can save your business.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Interactive ROI Calculator</h3>
            <p className="text-center text-gray-600 mb-8">Enter your numbers to see potential savings with StockFlow WMS</p>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Inventory Value (€)</label>
                  <input
                    type="number"
                    value={roiInputs.inventoryValue}
                    onChange={(e) => setRoiInputs({...roiInputs, inventoryValue: e.target.value})}
                    placeholder="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent on Warehouse Ops/Week</label>
                  <input
                    type="number"
                    value={roiInputs.hoursPerWeek}
                    onChange={(e) => setRoiInputs({...roiInputs, hoursPerWeek: e.target.value})}
                    placeholder="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (€)</label>
                  <input
                    type="number"
                    value={roiInputs.hourlyRate}
                    onChange={(e) => setRoiInputs({...roiInputs, hourlyRate: e.target.value})}
                    placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Shipping Errors Cost (€)</label>
                  <input
                    type="number"
                    value={roiInputs.stockoutLosses}
                    onChange={(e) => setRoiInputs({...roiInputs, stockoutLosses: e.target.value})}
                    placeholder="15000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    const inventoryValue = parseFloat(roiInputs.inventoryValue || '0');
                    const hoursPerWeek = parseFloat(roiInputs.hoursPerWeek || '0');
                    const hourlyRate = parseFloat(roiInputs.hourlyRate || '0');
                    const stockoutLosses = parseFloat(roiInputs.stockoutLosses || '0');
                    
                    const carryingCostSavings = inventoryValue * 0.25;
                    const timeSavings = hoursPerWeek * hourlyRate * 52;
                    const errorSavings = stockoutLosses * 0.9;
                    const softwareCost = 174;
                    const netSavings = carryingCostSavings + timeSavings + errorSavings - softwareCost;
                    const roi = softwareCost > 0 ? ((netSavings / softwareCost) * 100) : 0;
                    
                    setRoiResult({
                      carryingCostSavings,
                      timeSavings,
                      stockoutSavings: errorSavings,
                      netSavings,
                      roi
                    });
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Calculate My ROI
                </button>
                {roiResult && (
                  <div className="mt-6 p-6 bg-green-50 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your Potential Annual Savings</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Carrying cost savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.carryingCostSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.timeSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Error reduction:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.stockoutSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Software cost:</span>
                        <span className="font-bold text-gray-600 ml-2">€174</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Net Annual Savings:</span>
                        <span className="text-2xl font-bold text-green-600">€{roiResult.netSavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ROI:</span>
                        <span className="text-2xl font-bold text-green-600">{roiResult.roi.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="video-demo" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow WMS in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch how a Warehouse Management System helps businesses automate operations, optimize picking routes, and reduce costs.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2">WMS Demo Video</p>
                <p className="text-sm text-gray-300">Click to watch 3-minute overview</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-20"></div>
              <div className="absolute inset-0" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3}}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              <Link to="/demo" className="text-blue-600 hover:underline font-semibold">
                Schedule a personalized demo →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Buyer's Guide Download Section */}
      <section id="buyers-guide" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Download Free WMS Buyer's Guide</h2>
            <p className="text-lg mb-6 opacity-90">
              Get our comprehensive 25-page guide: "How to Choose the Best Warehouse Management System in 2025"
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What's Inside:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ Feature comparison checklist</li>
                  <li>✓ Pricing comparison guide</li>
                  <li>✓ Implementation timeline template</li>
                  <li>✓ ROI calculation worksheet</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">You'll Learn:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ How to evaluate WMS software</li>
                  <li>✓ Questions to ask vendors</li>
                  <li>✓ Red flags to avoid</li>
                  <li>✓ Implementation best practices</li>
                </ul>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Download Free Guide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm mt-4 opacity-75">No credit card required. Instant download.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Warehouse Management Systems.
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Warehouse Operations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get Started Free today and see how StockFlow WMS can streamline your warehouse operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "What Is a Warehouse Management System (WMS)? Complete Guide 2025",
            "description": "Learn what a Warehouse Management System (WMS) is, how it works, key features, benefits, automation technologies, and best use cases.",
            "author": {
              "@type": "Organization",
              "name": "StockFlow"
            },
            "datePublished": pageMetadata.published,
            "dateModified": pageMetadata.updated,
            "image": "https://www.stockflow.be/Inventory-Management.png",
            "keywords": [
              "warehouse management system",
              "WMS software",
              "warehouse automation",
              "warehouse inventory system",
              "supply chain software",
              "logistics optimization",
              "real-time inventory management"
            ],
            "publisher": {
              "@type": "Organization",
              "name": "StockFlow",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.stockflow.be/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.stockflow.be/warehouse-management-system"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map((faq) => ({
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
            "name": "StockFlow - Warehouse Management System",
            "description": "Comprehensive warehouse management system for modern businesses. Streamline operations, reduce costs, and improve efficiency.",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "WMS Software",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "326",
              "bestRating": "5",
              "worstRating": "1"
            },
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
            "url": "https://www.stockflow.be/warehouse-management-system"
          }
        ]}
      />
    </SeoPageLayout>
  );
}
