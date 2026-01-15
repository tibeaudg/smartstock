import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";
import { CheckCircle, Target, BarChart3, Lightbulb, TrendingUp, Shield, Users, Zap, PieChart, GitBranch, Smartphone, Package, AlertTriangle, DollarSign, Calendar } from "lucide-react";

const topicTitle = "Inventory Management for Small Business: Complete 2026 Guide";
const canonicalPath = "/blog/inventory-management-for-small-business-complete-guide";
const metaDescription = "Small business inventory management 2026 guide. Learn systems, organization methods, 80/20 rule, software selection, and cost-saving strategies to optimize your stock control.";
const keywords = "inventory management for small business, small business inventory, inventory software small business, best inventory system for small business, organize small business inventory, 80/20 rule inventory";
const heroBadge = "2026 Small Business Guide • Updated January 2026";
const summaryCopy = "Small business inventory management is the systematic tracking and control of stock to optimize costs, prevent stockouts, and support growth. This complete 2026 guide covers how to choose the best system, implement the 80/20 rule, organize your stock efficiently, and select between modern software solutions (including Square, Sortly, and Odoo) versus Excel templates. Effective management reduces carrying costs by 20-30%, cuts counting time by 70%, and prevents the 4 common mistakes that stall 43% of small business growth.";

// Updated FAQ targeting specific search queries
const faqData = [
  {
    question: "What is the best inventory management system for a small business?",
    answer: "The 'best' system depends on your specific needs. For retail businesses using Square POS, 'Square for Retail' offers seamless integration and starts free. For simple visual tracking, 'Sortly' is highly rated. For growing businesses needing scalability, cloud platforms like 'Odoo' or 'Zoho Inventory' offer extensive features. The ideal solution balances ease of use, essential features (barcode scanning, reorder alerts), and cost—typically between $0-50/month for a starter plan. Avoid overbuilt enterprise systems."
  },
  {
    question: "How do small businesses manage their inventory?",
    answer: "Small businesses typically manage inventory through tiered approaches: 1) **Manual Methods:** Spreadsheets or paper for under 50 SKUs. 2) **Dedicated Apps:** Mobile-first apps (like Sortly or StockFlow) for 50-500 SKUs, offering barcode scanning and cloud sync. 3) **Integrated Systems:** POS-linked software (like Square for Retail) for real-time sales deduction. Best practices include regular cycle counts, organizing stock with clear labels, setting reorder points, and using the 80/20 rule to focus on high-value items. The trend is rapidly shifting from Excel to specialized apps."
  },
  {
    question: "What is the 80/20 rule for inventory?",
    answer: "The 80/20 rule, or Pareto Principle, states that roughly 80% of your sales value comes from 20% of your inventory items. In practice, this means you should: 1) **Identify** your top 20% of SKUs by revenue or profit. 2) **Prioritize** intense management (daily counts, tight reorder points) on these 'A' items. 3) **Simplify** management of the remaining 80% ('B' and 'C' items) with less frequent checks. This strategy maximizes ROI on management time and prevents stockouts of your most critical products."
  },
  {
    question: "How to organize inventory for a small business?",
    answer: "Organize inventory in 4 steps: 1) **Categorize & Label:** Group items by type, frequency, or supplier. Use consistent SKUs and barcode labels. 2) **Implement Location Logic:** Assign every item a specific home (e.g., 'Aisle 1-Bin C'). Map this in your software. 3) **Adopt Storage Methods:** Use FIFO (First-In, First-Out) for perishables. For small parts, consider bin shelving. 4) **Go Digital:** Use an inventory app to maintain a digital twin of your physical layout. This reduces search time by up to 60% and drastically improves count accuracy."
  },
  {
    question: "How much does inventory management software cost for small businesses?",
    answer: "Costs vary significantly: 1) **Free Plans:** Square for Retail (with POS), StockFlow (up to 100 items), Zoho Inventory (up to 50 orders/month). 2) **Basic Tiers ($10-50/month):** Sortly, InFlow, Cin7 Core for essential features. 3) **Advanced Systems ($50-200+/month):** Odoo, TradeGecko for multi-channel or complex workflows. Most businesses start with a free plan, then upgrade. The ROI from reducing overstock and stockouts typically justifies the cost within 3-6 months."
  },
  {
    question: "Can small businesses use Excel for inventory management?",
    answer: "Excel can work as a starting point for businesses with under 50 simple SKUs and no plans for rapid growth. Free templates can track quantities, costs, and reorder points. However, limitations are severe: no real-time updates, high error rates (~15%), no barcode scanning, and no multi-user mobile access. Most businesses outgrow Excel within 12-18 months. Migrating to a dedicated app becomes essential to prevent errors and save time."
  },
  {
    question: "What are the most common inventory management mistakes small businesses make?",
    answer: "The top 4 mistakes are: 1) **No Standard Processes:** Inconsistent counting and receiving leads to chaos. 2) **Ignoring the 80/20 Rule:** Wasting time managing low-value items. 3) **Over-reliance on Manual Spreadsheets:** This creates a single point of failure and errors. 4) **Failing to Set Reorder Points:** This leads to reactive stockouts or overstocking. These mistakes contribute to the statistic that 43% of small businesses struggle with inventory management."
  }
];

// Enhanced structured data with FAQ schema
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Inventory Management for Small Business: Complete 2026 Guide",
    "description": "A comprehensive guide to small business inventory management covering system selection, the 80/20 rule, organization strategies, and software comparisons.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2024-12-01",
    "dateModified": "2026-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/blog/inventory-management-for-small-business-complete-guide"
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
];

export default function InventoryManagementForSmallBusinessCompleteGuidePage() {
  
  const location = useLocation();

  // Actionable framework for small businesses
  const actionFramework = [
    {
      title: "Audit & Classify (The 80/20 Rule)",
      description: "Identify your 'A' items (top 20% by value). These get priority management, tight reorder points, and frequent counts. Classify 'B' and 'C' items for simpler, less frequent tracking.",
      icon: PieChart,
      details: ["Run an ABC analysis report", "Set service levels: 99% for A, 95% for B, 90% for C items"]
    },
    {
      title: "Choose Your Technology Stack",
      description: "Select tools based on volume: Excel for <50 SKUs; Mobile apps (Sortly, StockFlow) for 50-500 SKUs; Integrated platforms (Square, Odoo) for >500 SKUs or multi-channel sales.",
      icon: GitBranch,
      details: ["Start with free trials of 2-3 apps", "Prioritize mobile access and barcode scanning"]
    },
    {
      title: "Organize Physical & Digital Space",
      description: "Implement a logical location system (aisle/shelf/bin) and replicate it in your software. Label everything. This creates a 'digital twin' of your warehouse.",
      icon: Package,
      details: ["Use a consistent naming convention", "Print barcode labels for items and locations"]
    },
    {
      title: "Establish Core Processes",
      description: "Document procedures for receiving, counting, and picking. Train your team. Consistency is more critical than complexity in small business inventory.",
      icon: Calendar,
      details: ["Schedule weekly cycle counts for 'A' items", "Create a simple checklist for new stock intake"]
    }
  ];

  // Software comparison table data
  const softwareComparison = [
    { name: "Stockflow", bestFor: "Small businesses, <50 SKUs, zero budget", cost: "Free", keyFeature: "Mobile QR/Barcode counting, perishable stock alerts, multi-location bar & kitchen tracking, offline counting mode, usage analytics & waste reporting, supplier management", limitation: "No real-time sync, high error rate" },
    { name: "Excel / Google Sheets", bestFor: "Absolute beginners, <50 SKUs, zero budget", cost: "$0", keyFeature: "Total control, simple templates", limitation: "No real-time sync, high error rate" },
    { name: "Sortly", bestFor: "Visual thinkers, service businesses, equipment tracking", cost: "$0-99/month", keyFeature: "Visual catalog, QR code generation", limitation: "Less focused on complex sales integration" },
    { name: "Square for Retail", bestFor: "Retail shops already using Square POS", cost: "Free with Square POS", keyFeature: "Seamless POS integration, purchase orders", limitation: "Ecosystem lock-in" },
    { name: "Odoo Inventory", bestFor: "Growing businesses needing ERP features", cost: "$7.25/user/month", keyFeature: "Modular, scales to full ERP", limitation: "Can be complex to set up" },
  ];

  const keyTakeaways = [
    'Apply the 80/20 Rule: Focus 80% of your management effort on the 20% of items that drive 80% of your revenue or profit.',
    'Organization is foundational: A clear physical location system (implemented digitally) reduces search time by up to 60% and prevents errors.',
    'Technology choice is critical: Start simple (Excel is valid for tiny inventories) but plan to migrate to a dedicated app before hitting 50-100 SKUs to avoid chaos.',
    'Process beats software: The most expensive system fails without consistent counting, receiving, and data entry procedures.'
  ];

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={"Small Business Inventory Management: How to Get Control in 2026"}
      dateUpdated="01/15/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Inventory Management for Small Business 2026: Systems, Software & Strategies"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        structuredData={structuredData}
      />

      <StructuredData data={structuredData} />

      {/* Hero / Introduction */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                <Lightbulb className="w-4 h-4" /> 2026 Implementation Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                Tired of <span className="text-blue-600">Lost Sales and Cash Tied Up in Stock?</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                For small businesses, inventory isn't just products on a shelf—it's your largest liquid asset and your biggest source of operational headaches. <strong>43% of small businesses</strong> cite inventory management as a major growth blocker.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                This guide cuts through the complexity. You'll learn a practical framework—from applying the <strong>80/20 rule</strong> and organizing your stockroom to choosing between modern apps like <strong>Sortly</strong>, <strong>Odoo</strong>, and <strong>Square</strong> versus sticking with Excel templates.
              </p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="text-amber-400" /> The Small Business Reality
              </h3>
              <div className="space-y-6">
                {[
                  { stat: "43%", label: "of small businesses struggle with inventory control" },
                  { stat: "20-30%", label: "carrying cost reduction with proper management" },
                  { stat: "70%", label: "less time counting with barcode apps vs. spreadsheets" },
                  { stat: "<50 SKUs", label: "the point where most outgrow Excel" },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-gray-700 pl-6 relative">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-300 font-medium">{item.label}</span>
                      <span className="text-2xl font-bold text-white">{item.stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Framework Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Practical 4-Step Framework for 2026</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Follow these steps in order. Skipping #1 (The 80/20 Rule) is the most common reason small business inventory projects fail.</p>
          </div>
          
          <div className="space-y-8">
            {actionFramework.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="group flex flex-col md:flex-row gap-8 p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                    {step.details && (
                      <ul className="space-y-2">
                        {step.details.map((detail, dIndex) => (
                          <li key={dIndex} className="text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Software Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">2026 Software Comparison: Find Your Fit</h2>
          <p className="text-gray-600 mb-12">The right tool depends entirely on your SKU count, budget, and growth stage. Here's how top options compare for small businesses.</p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mb-8">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-6 font-bold text-gray-900">Software / Method</th>
                  <th className="text-left p-6 font-bold text-gray-900">Best For</th>
                  <th className="text-left p-6 font-bold text-gray-900">Starting Cost</th>
                  <th className="text-left p-6 font-bold text-gray-900">Key Strength</th>
                  <th className="text-left p-6 font-bold text-gray-900">Consideration</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {softwareComparison.map((software, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="p-6 align-top font-medium">{software.name}</td>
                    <td className="p-6 align-top text-gray-700">{software.bestFor}</td>
                    <td className="p-6 align-top font-medium text-gray-900">{software.cost}</td>
                    <td className="p-6 align-top text-gray-700">{software.keyFeature}</td>
                    <td className="p-6 align-top text-gray-700">{software.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 text-center">Data based on vendor pricing and small business case studies. Most offer free trials.</p>
        </div>
      </section>

      {/* Deep Dive: The 80/20 Rule & Organization */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Master the 80/20 Rule for Inventory</h2>
              <p className="text-gray-600 mb-6">
                Not all inventory deserves equal attention. The Pareto Principle is your most powerful tool for prioritizing limited management time.
              </p>
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">How to Implement ABC Analysis:</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold text-sm flex items-center justify-center">A</div>
                    <div>
                      <span className="font-medium">Top 20% of SKUs (by annual usage value).</span>
                      <p className="text-sm text-gray-600 mt-1">Tight control: Frequent counts, low safety stock, detailed records.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center">B</div>
                    <div>
                      <span className="font-medium">Next 30% of SKUs.</span>
                      <p className="text-sm text-gray-600 mt-1">Moderate control: Regular reviews, standard reorder points.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">C</div>
                    <div>
                      <span className="font-medium">Bottom 50% of SKUs.</span>
                      <p className="text-sm text-gray-600 mt-1">Simple control: Bulk orders, infrequent counts, high safety stock.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Organize Inventory Physically & Digitally</h2>
              <p className="text-gray-600 mb-6">
                Chaos in the stockroom equals chaos in the books. A clear organization system is non-negotiable.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <Package className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Implement a Location Code System</h4>
                    <p className="text-gray-600 text-sm mt-1">Every bin, shelf, and aisle gets a unique code (e.g., A-01-B). This code is the item's "address" in your software.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Smartphone className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Create a "Digital Twin"</h4>
                    <p className="text-gray-600 text-sm mt-1">Replicate your physical layout in your inventory app. When the software says an item is in "A-01-B," your staff can find it instantly.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <AlertTriangle className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Standardize Key Processes</h4>
                    <p className="text-gray-600 text-sm mt-1">Document simple checklists for receiving new stock and picking orders. Consistency prevents 80% of inventory errors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost of Mistakes & ROI */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Real Cost of Getting It Wrong</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Understanding these costs justifies the investment in better systems and processes.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="text-red-600" /> Hidden Costs of Poor Management
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold text-sm flex items-center justify-center">1</div>
                  <span><strong>Excess Carrying Costs:</strong> Storage, insurance, and capital tied up in slow-moving stock can eat 25-30% of its value annually.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold text-sm flex items-center justify-center">2</div>
                  <span><strong>Stockout Losses:</strong> A single stockout costs more than the lost sale—it damages customer trust and sends buyers to competitors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold text-sm flex items-center justify-center">3</div>
                  <span><strong>Operational Waste:</strong> Employees searching for misplaced items or correcting errors can waste 5-10 hours per week.</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="text-green-600" /> ROI of a Proper System
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-sm flex items-center justify-center">1</div>
                  <span><strong>Direct Cost Savings:</strong> Reducing overstock and stockouts typically lowers inventory costs by 20-30%, paying for software in months.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-sm flex items-center justify-center">2</div>
                  <span><strong>Time Liberation:</strong> Automating counts and orders can give a small business owner back 4-8 hours per week for growth activities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-sm flex items-center justify-center">3</div>
                  <span><strong>Scalability Foundation:</strong> Clean data and processes are the bedrock for adding sales channels, new locations, or team members without chaos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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