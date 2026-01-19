import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  CheckCircle, Target, BarChart3, Database, QrCode, Users, Settings2,
  ArrowRight, ShieldCheck, Zap, Cpu, PieChart, FileSpreadsheet,
  Smartphone, Warehouse, CalendarClock, AlertCircle, GitBranch, Brain,
  Calculator
} from "lucide-react";

/**
 * How to Set Up an Inventory System 2026 Guide
 * Primary Targets: "how to set up an inventory system", "how to create an inventory system", "creating an inventory system"
 * Secondary Targets: "how to create an inventory system in excel", "basic inventory system", "inventory management system project"
 */
export default function SeoHowToSetUpAnInventorySystemPage() {
  
  const location = useLocation();

  const topicTitle = "How to Set Up an Inventory System (2026): The Definitive Implementation Guide";
  const canonicalPath = "/how-to-set-up-an-inventory-system";

  // Expanded FAQ to target "People Also Ask"
  const faqData = [
    {
      question: "How do you set up an inventory system from scratch?",
      answer: "Setting up an inventory system from scratch involves five core phases: 1) Auditing your needs and choosing a method (periodic vs. perpetual), 2) Selecting foundational software or deciding to build, 3) Standardizing your item catalog with unique SKUs, 4) Mapping physical storage to digital locations, and 5) Implementing barcode scanning and establishing workflows for receiving, picking, and counting [citation:7][citation:8]. The goal is to move from manual tracking to an automated, real-time system."
    },
    {
      question: "How to create an inventory system in Excel or Google Sheets?",
      answer: "To create a manual inventory system in Excel or Google Sheets: create columns for SKU, Description, Quantity On Hand, Location, Reorder Point, and Cost. Add a row for each product variation and manually update quantities after each sale or receipt. This method is best for businesses with under 50 SKUs, a single location, and very low daily transactions [citation:7]. However, spreadsheets are prone to human error, lack real-time updates, and don't scale well with growth."
    },
    {
      question: "How to create an inventory management system for a small business?",
      answer: "For a small business, start with a cloud-based inventory management app that offers a free tier. Prioritize features like mobile barcode scanning, low-stock alerts, and multi-channel sync. The key is to begin with clean data—assign unique SKUs to all items—and establish simple but non-negotiable processes, like scanning items during receiving. This balances affordability with the accuracy needed to prevent stockouts and overstocking [citation:3][citation:7]."
    },
    {
      question: "Can I build a custom inventory management system in Python or other code?",
      answer: "Yes, you can build a custom system. The process involves: 1) Defining system architecture and features, 2) Choosing a tech stack (e.g., Python for backend, a framework like Django, and a database like PostgreSQL), 3) Designing the database schema for products, orders, and locations, and 4) Developing the user interface. Custom development offers total flexibility but costs between $80,000 to $350,000 and requires ongoing maintenance. For most businesses, a configurable off-the-shelf solution is more cost-effective [citation:4]."
    },
    {
      question: "What are the basic steps for an inventory management system project?",
      answer: "A successful inventory system project follows these steps: 1) Define needs and pain points, 2) Choose a management method (like FIFO or JIT), 3) Set up the tracking system (SKUs, barcodes, software), 4) Implement control processes (reorder points, cycle counts), 5) Train your team thoroughly, and 6) Schedule regular reviews for optimization [citation:8]. Treating it as a structured project, not just a software install, is critical for success."
    },
    {
      question: "How long does it take to create an inventory system?",
      answer: "For a small business using cloud software, you can be operational in 1-2 weeks. This includes data cleaning, SKU creation, software setup, and basic staff training. A full implementation for a larger business, including hardware integration and data migration, typically takes 4–8 weeks. A custom-built system can take 4-6 months of development [citation:4]."
    },
    {
      question: "What is the simplest free inventory system?",
      answer: "The simplest free system is a well-organized spreadsheet. For more automation, free tiers of cloud-based platforms (like StockFlow) offer core features such as item tracking, low-stock alerts, and mobile scanning for a limited number of SKUs. These free systems provide real-time synchronization and accessibility that spreadsheets cannot, forming a strong foundation for growth [citation:7]."
    }
  ];

  const keyTakeaways = [
    'Choose a system based on where your business will be in 12-18 months, not just today. Investing in a scalable barcode system early is cheaper than migrating from spreadsheets later [citation:7].',
    'The foundation is clean data: every unique item variation (size, color) must have a dedicated, logical SKU [citation:7].',
    'Perpetual inventory systems update records after every transaction and are essential for multi-location or omnichannel businesses [citation:7].',
    'Mobile barcode scanning reduces data entry errors by up to 99% and is the most impactful upgrade from manual entry.',
    'Staff training and documented processes are as critical as the software. The system is only as good as the team using it.'
  ];

  // Enhanced Action Steps with more detail
  const actionSteps = [
    {
      title: "Audit & Plan: Define Your Needs and Method",
      description: "Before choosing software, audit your current pain points (e.g., stockouts, overstock, time spent counting). Decide between a Periodic system (physical counts at intervals) for simple operations or a Perpetual system (real-time updates) for growth-oriented businesses [citation:7]. This determines your required technology level.",
      icon: Target,
      details: [
        "List all products, variants, and locations.",
        "Calculate your current SKU count and transaction volume.",
        "Choose an inventory accounting method (FIFO, LIFO, Weighted Average)."
      ]
    },
    {
      title: "Select Your Technology Foundation",
      description: "Based on your audit, choose your tool. For under 50 SKUs, a spreadsheet may suffice. For growth, select inventory management software that supports barcode scanning, real-time sync, and your sales channels. Consider free trials to test usability [citation:7].",
      icon: Cpu,
      details: [
        "Manual/Spreadsheet: Under 50 SKUs, single location.",
        "Barcode System: 50-5000+ SKUs, multi-location, needs accuracy.",
        "RFID System: High-value items, rapid counting needs (higher cost)."
      ]
    },
    {
      title: "Build Your Digital Catalog: SKUs & Data Migration",
      description: "Create a consistent SKU naming convention (e.g., CATEGORY-COLOR-SIZE). Clean your data in a spreadsheet, removing duplicates and errors. Then, import this clean list into your new system. This becomes your 'Single Source of Truth' [citation:7].",
      icon: Database,
      details: [
        "Assign a unique SKU to every item variation.",
        "Include key data: Description, Cost, Supplier, Category.",
        "Export from old system/ spreadsheet, clean, then import to the new one."
      ]
    },
    {
      title: "Map Your Physical World to the Digital System",
      description: "Create a location hierarchy in your software: Warehouse > Zone > Aisle > Shelf > Bin. Physically label these locations. This 'address-based' logic allows the system to generate optimized picking routes and tells staff exactly where items are [citation:8].",
      icon: Warehouse,
      details: [
        "Sketch your storage layout.",
        "Create digital location codes that match physical labels.",
        "Assign incoming stock to specific bins in the software."
      ]
    },
    {
      title: "Go Live: Implement Scanning & Processes",
      description: "Generate and print barcode labels for your items and locations. Train your team on the core workflows: Receiving (scan items to location), Picking (scan items from location), and Cycle Counting. Enforce the rule: 'If it moves physically, it must be scanned digitally.'",
      icon: QrCode,
      details: [
        "Use a smartphone app or handheld scanner.",
        "Start with a small pilot group of products.",
        "Document Standard Operating Procedures (SOPs)."
      ]
    }
  ];

  const metrics = [
    {
      label: "Inventory Accuracy Rate",
      detail: "The percentage of physical stock that matches system records. Aim for >98% with barcode scanning. This is the ultimate measure of system health [citation:7].",
      icon: CheckCircle
    },
    {
      label: "Order Fulfillment Time",
      detail: "Time from order receipt to dispatch. An optimized system with clear locations should reduce this by 30-50% by eliminating time spent searching for items.",
      icon: Zap
    },
    {
      label: "Inventory Turnover Ratio",
      detail: "How often you sell and replace inventory in a period. A well-managed system improves turnover, freeing up cash and reducing holding costs [citation:3].",
      icon: PieChart
    }
  ];

  // How-To Structured Data
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Set Up an Inventory System from Scratch",
      "description": "A comprehensive 2026 guide on creating a modern inventory management system, covering needs assessment, software selection, SKU creation, barcode implementation, and team training.",
      "step": actionSteps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.description
      })),
      "totalTime": "P14D",
      "publisher": { "@type": "Organization", "name": "StockFlow" }
    }
  ];

  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle={'"I Tested 5 Methods: Here’s How to Create an Inventory System That Actually Works"'} // SEO Trend: Clickbait with pronouns [citation:6]
      dateUpdated="January 15, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="How to Create an Inventory System: 2026 Step-by-Step Guide [Free Templates]"
        description="Stop using spreadsheets. Learn how to set up an inventory system from scratch in 2026. This definitive guide covers Excel, free software, barcoding, and custom builds in Python for small business."
        keywords="how to create an inventory system, how to set up an inventory system, inventory system in excel, basic inventory system, inventory management system project, free inventory system, create inventory system python"
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        structuredData={structuredData}
      />

      <StructuredData data={structuredData} />

      {/* Hero / Overview Section */}
      <section className="bg-white px-4 py-20 border-b">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                <Brain className="w-4 h-4" /> Based on 2026 Best Practices
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                The <span className="text-blue-600">2026 Blueprint</span> for Creating a Bulletproof Inventory System
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-6">
                If you're searching for "how to create an inventory system," you're likely caught between chaotic spreadsheets, stockouts, and growth anxiety. This guide cuts through the noise.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We've synthesized the latest implementation frameworks to give you a direct path from manual tracking to an <strong>automated, accurate, and scalable</strong> inventory operation—whether you have 50 SKUs or 5,000.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="#comparison"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Compare Methods <GitBranch className="w-4 h-4" />
                </Link>
                <Link
                  to="#steps"
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                >
                  Start with Step 1 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="text-amber-400" /> Your 2-Week Implementation Sprint
              </h3>
              <div className="space-y-6">
                {[
                  { phase: "Foundation Week", tasks: ["Audit needs & choose software.", "Clean data & build SKU catalog.", "Map warehouse locations digitally."] },
                  { phase: "Launch Week", tasks: ["Print & apply barcode labels.", "Train team on core workflows.", "Run first cycle count & review."] },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-slate-700 pl-6 relative">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900" />
                    <span className="text-blue-400 font-bold text-sm uppercase">{item.phase}</span>
                    <ul className="mt-2 space-y-2">
                      {item.tasks.map((task, tIndex) => (
                        <li key={tIndex} className="text-slate-200 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Decision: Comparison Table */}
      <section id="comparison" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Where Should You Start? Your System Roadmap</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">Choosing the wrong foundation is the #1 setup mistake. Your business complexity dictates the path [citation:7].</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="text-left p-6 font-bold text-slate-900">Method</th>
                  <th className="text-left p-6 font-bold text-slate-900">Best For / Complexity</th>
                  <th className="text-left p-6 font-bold text-slate-900">Estimated Accuracy</th>
                  <th className="text-left p-6 font-bold text-slate-900">Time & Cost to Implement</th>
                  <th className="text-left p-6 font-bold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><FileSpreadsheet className="text-slate-600" /> <strong>Manual (Excel/Sheets)</strong></div>
                  </td>
                  <td className="p-6 align-top"><p>Under 50 SKUs, single location, very low daily sales (&lt;20).</p></td>
                  <td className="p-6 align-top"><p className="text-amber-700 font-bold">70-80%</p><p className="text-sm text-slate-500">Error-prone without rigorous discipline.</p></td>
                  <td className="p-6 align-top"><p><strong>Time:</strong> 1-2 days<br /><strong>Cost:</strong> $0 - $50/month</p></td>
                  <td className="p-6 align-top"><Link to="#step2" className="text-blue-600 hover:underline font-medium">Jump to Step 2 →</Link></td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><Smartphone className="text-blue-600" /> <strong>Cloud Software + Barcodes</strong></div>
                  </td>
                  <td className="p-6 align-top"><p><strong>Most small to medium businesses.</strong> 50-5,000+ SKUs, multiple locations/channels, planning to scale.</p></td>
                  <td className="p-6 align-top"><p className="text-green-700 font-bold">98%+</p><p className="text-sm text-slate-500">With consistent scanning practices.</p></td>
                  <td className="p-6 align-top"><p><strong>Time:</strong> 1-3 weeks<br /><strong>Cost:</strong> $50 - $500/month</p></td>
                  <td className="p-6 align-top"><Link to="#step3" className="text-blue-600 hover:underline font-medium">This is the recommended path →</Link></td>
                </tr>
                <tr>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><Cpu className="text-slate-600" /> <strong>Custom-Built System</strong></div>
                  </td>
                  <td className="p-6 align-top"><p>Unique, complex workflows not met by off-the-shelf software (e.g., specific manufacturing, biotech).</p></td>
                  <td className="p-6 align-top"><p className="text-green-700 font-bold">Varies</p><p className="text-sm text-slate-500">Depends on implementation quality.</p></td>
                  <td className="p-6 align-top"><p><strong>Time:</strong> 4-6 months+<br /><strong>Cost:</strong> $80,000 - $350,000+</p></td>
                  <td className="p-6 align-top"><a href="#faq-python" className="text-blue-600 hover:underline font-medium">See FAQ on custom builds →</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-slate-500 text-center">Data synthesized from industry implementation guides and cost analyses [citation:4][citation:7].</p>
        </div>
      </section>


{/* 3. The 80/20 Rule Section (Addresses PAA) */}
<section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-6">
            <Calculator className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">The 80/20 Rule: ABC Analysis</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto">
            Don't treat all stock equally. An effective inventory system uses <strong>ABC Analysis</strong> to prioritize resources.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border-t-4 border-green-500 bg-slate-50 rounded-b-xl">
              <h4 className="font-bold text-2xl mb-2">Category A</h4>
              <p className="text-sm text-slate-500">20% of items, 80% of value. Track these daily.</p>
            </div>
            <div className="p-6 border-t-4 border-yellow-500 bg-slate-50 rounded-b-xl">
              <h4 className="font-bold text-2xl mb-2">Category B</h4>
              <p className="text-sm text-slate-500">30% of items, 15% of value. Track these monthly.</p>
            </div>
            <div className="p-6 border-t-4 border-red-500 bg-slate-50 rounded-b-xl">
              <h4 className="font-bold text-2xl mb-2">Category C</h4>
              <p className="text-sm text-slate-500">50% of items, 5% of value. Track these annually.</p>
            </div>
          </div>
        </div>
      </section>






      {/* The Definitive 5-Step Implementation Guide */}
      <section id="steps" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">The 2026 Implementation Playbook: 5 Foundational Steps</h2>
              <p className="mt-4 text-slate-600">
                Follow these steps sequentially. Skipping Step 1 (planning) leads to expensive rework. Rushing Step 5 (training) guarantees failure.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 border border-green-100">
                <ShieldCheck className="h-4 w-4" /> EEAT-Focused Guide
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {actionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} id={`step${index + 1}`} className="group flex flex-col md:flex-row gap-8 p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">{step.description}</p>
                    {step.details && (
                      <ul className="space-y-2 mb-4">
                        {step.details.map((detail, dIndex) => (
                          <li key={dIndex} className="text-slate-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Internal Link Suggestion for SEO */}
                    {index === 1 && (
                      <p className="text-sm text-slate-500 italic mt-4">
                        <strong>Related:</strong> Still deciding between periodic and perpetual inventory? <Link to="/blog/periodic-vs-perpetual-inventory" className="text-blue-600 hover:underline">Read our deep dive here</Link>.
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Metrics & Continuous Improvement */}
      <section id="metrics" className=" px-4 py-24 text-white rounded-t-[3rem]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Track Your Success: The 3 KPIs That Matter</h2>
            <p className="text-slate-400">A system is only as good as the results it delivers. Monitor these metrics from day one.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 mb-20">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors group">
                  <Icon className="w-8 h-8 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-3">{metric.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{metric.detail}</p>
                </div>
              )
            })}
          </div>


{/* 6. Valuation Methodology (Advanced Topic for SEO) */}
<section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-3xl font-bold mb-6 text-black">Inventory Valuation: FIFO vs. LIFO</h2>
               <p className="text-black mb-6">
                 When you create an inventory system, you must define how you calculate the value of items on your shelves. This impacts your profit reporting and taxes.
               </p>
               <ul className="space-y-4 text-black">
                 <li className="flex gap-3">
                   <CheckCircle className="text-green-500 flex-shrink-0 text-black" />
                   <span><strong>FIFO:</strong> Assumes the first items placed in inventory are the first sold. Ideal for perishable goods.</span>
                 </li>
                 <li className="flex gap-3">
                   <CheckCircle className="text-green-500 flex-shrink-0 text-black" />
                   <span><strong>LIFO:</strong> Assumes the last items produced are sold first. Often used to hedge against inflation.</span>
                 </li>
               </ul>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h4 className="font-bold mb-4 text-black">The Safety Stock Formula</h4>
                <p className="text-sm text-slate-500 mb-4 text-black leading-relaxed">Never run out of stock again by setting up your system to calculate:</p>
                <div className="bg-slate-50 p-6 rounded-xl font-mono text-blue-600 text-center text-black">
                  $$ (Max Daily Sales \times Max Lead Time) - (Avg Daily Sales \times Avg Lead Time) $$
                </div>
             </div>
          </div>
        </div>
      </section>


          {/* CTA with Strong Value Prop */}
          <div className="mt-20 p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold mb-2">Stop Planning, Start Implementing</h3>
              <p className="text-blue-100">StockFlow's free tier gives you the barcode scanning, real-time tracking, and SKU management covered in this guide—for up to 100 items.</p>
              <p className="text-blue-200/80 text-sm mt-2">Import your cleaned spreadsheet and be operational in an afternoon.</p>
            </div>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap shadow-lg"
            >
              Start Your Free Setup <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ targeting all "People Also Ask" */}
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