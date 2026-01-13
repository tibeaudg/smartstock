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
  FileSpreadsheet
} from 'lucide-react';

/**
 * Optimized Construction Inventory Management Page
 * Target Keywords: construction inventory management software, managing inventory across jobsites, 
 * inventory tracking software for builders, best accounting software for construction.
 */
export default function ContractorInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const topicTitle = "Construction Inventory Management Software for Contractors";
  const dateUpdated = "January 10, 2026";

  const faqData = [
    {
      question: "What is the best way to handle construction inventory management?",
      answer: "The best approach involves using dedicated construction inventory management software that supports multi-site tracking. Unlike a static construction inventory management Excel sheet, modern software provides real-time visibility into material levels and tool locations across every active jobsite."
    },
    {
      question: "Can StockFlow integrate with Procore inventory management or FOUNDATION construction software?",
      answer: "StockFlow is designed to complement existing workflows. While Procore focuses on project management, StockFlow provides the deep granular tracking needed for physical materials. Data can be exported to sync with specialized platforms like FOUNDATION construction software or Procore for a unified operational view."
    },
    {
      question: "How do you manage inventory across jobsites effectively?",
      answer: "Effective management requires a mobile-first strategy. By using a construction inventory management system with QR or barcode scanning, field crews can check materials in and out instantly. This eliminates the 20% 'ghost inventory' typically lost between the warehouse and the site."
    },
    {
      question: "What is the best accounting software for construction inventory?",
      answer: "The best systems are those that integrate inventory costs directly into your construction financial management software. StockFlow allows you to track material burn rates per project, which can then be synced with accounting tools to ensure accurate job costing."
    },
    {
      question: "Is there free construction accounting software or inventory tools?",
      answer: "Yes, StockFlow offers a free-forever tier for small builders and concrete contractors. While many 'free construction accounting software' options have hidden costs, our free inventory tool provides essential mobile tracking for up to 100 items at no cost."
    }
  ];

  const keyTakeaways = [
    'Switching from a construction inventory management Excel to cloud software reduces data errors by 90%.',
    'Managing inventory across jobsites requires real-time mobile scanning to prevent tool theft and material waste.',
    'Integrating inventory data with construction financial management software is essential for 100% accurate job costing.',
    'Specialized construction equipment tracking software can extend tool life by 35% through proactive maintenance scheduling.',
    'Even concrete contractors benefit from digital tracking by monitoring additives and reinforcement stock levels in real-time.'
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

  return (
    <SeoPageLayout 
      title={topicTitle}
      heroTitle="Construction Inventory Management for General Contractors"
      dateUpdated={dateUpdated}
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Construction Inventory Management Software | Multi-Jobsite Tracking"
        description="The leading construction inventory management system for general contractors. Track materials, manage tools across jobsites, and reduce waste by 30%."
        keywords="construction inventory management software, managing inventory across jobsites, inventory management software for general contractors, construction equipment tracking software, construction business software, best accounting software for construction"
        url="https://www.stockflowsystems.com/contractor-inventory-management"
        structuredData={structuredData}
      />

      {/* Hero Narrative & Deep Context */}
      <section className="mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
          <ShieldCheck className="w-4 h-4" /> Built for Modern Builders
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
          Stop Losing Profits to <span className="text-blue-600">Poor Jobsite Tracking</span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              For many firms, <strong>managing inventory across jobsites</strong> is the largest source of unrecovered costs. Materials are over-ordered, tools "walk off" the site, and <strong>construction inventory management Excel</strong> sheets are outdated before the ink is dry.
            </p>
            <p>
              StockFlow provides a comprehensive <strong>construction inventory management system</strong> that bridges the gap between the warehouse and the field. Whether you are looking for <strong>inventory tracking software for builders</strong> or a specialized <strong>inventory tracking tool for concrete contractors</strong>, our platform ensures every nail, board, and piece of heavy machinery is accounted for.
            </p>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calculator className="text-blue-400" /> Beyond Simple Tracking
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
              Our <strong>construction business software</strong> integrates with your existing tech stack, providing a missing link for:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400" /> Procore inventory management field sync</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400" /> FOUNDATION construction software data exports</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400" /> Construction financial management software API</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-400" /> Automated Equipment Maintenance logs</li>
            </ul>
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

      {/* Feature Focus: Equipment & Financials */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Integrated Construction Business Solutions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-slate-50 rounded-3xl border border-slate-200">
            <Truck className="w-12 h-12 text-blue-600 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Construction Equipment Tracking Software</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Track your fleet and heavy machinery across multiple locations. Log engine hours, schedule preventive maintenance, and assign equipment to specific general contractors or project leads. Prevent expensive downtime by ensuring your <strong>construction equipment tracking</strong> is digitized.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              Learn about tool tracking <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="p-10 bg-slate-50 rounded-3xl border border-slate-200">
            <BarChart3 className="w-12 h-12 text-blue-600 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Financial & Accounting Integration</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Inventory isn't just physical—it's capital. StockFlow provides the data needed for the <strong>best accounting software for construction</strong>. By tracking every dollar of material used, you can provide real-time job costing data to your financial teams, moving far beyond <strong>free construction accounting software</strong> limitations.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              View financial integrations <ArrowRight className="w-4 h-4" />
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

      {/* Final Comparison / CTA */}
      <section className="py-20 bg-slate-50 rounded-3xl mb-20 px-8 lg:px-20 border border-slate-200">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Settle for Less?</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Generic <strong>construction inventory management software</strong> often misses the reality of the jobsite. StockFlow is built to handle the dirt, the multiple locations, and the need for speed. Upgrade from <strong>construction inventory management Excel</strong> and stop guessing where your equipment is.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/features" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-xl text-center hover:bg-slate-50 transition-all">
                View Full Features
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <FileSpreadsheet className="w-8 h-8 text-red-500 mb-4" />
              <h4 className="font-bold mb-2">No More Spreadsheets</h4>
              <p className="text-xs text-slate-500">Live data beats static files every time.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-bold mb-2">Field Ready</h4>
              <p className="text-xs text-slate-500">Scanning built for the toughest jobsites.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Building2 className="w-8 h-8 text-indigo-500 mb-4" />
              <h4 className="font-bold mb-2">Enterprise Scaling</h4>
              <p className="text-xs text-slate-500">From 1 jobsite to 1,000+.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <DollarSign className="w-8 h-8 text-green-500 mb-4" />
              <h4 className="font-bold mb-2">Profit Maximization</h4>
              <p className="text-xs text-slate-500">Know exactly where your money is spent.</p>
            </div>
          </div>
        </div>
      </section>


      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>




    </SeoPageLayout>
  );
}