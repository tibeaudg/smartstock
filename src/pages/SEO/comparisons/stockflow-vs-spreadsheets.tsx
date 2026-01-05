import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star, Clock, AlertCircle, Database, FileText, Users, TrendingUp, MapPin } from 'lucide-react';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { 
  CaseStudySection, 

  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

export default function StockFlowVsSpreadsheets() {
  usePageRefresh();
  
  // Get real customer data
  const relevantCaseStudies = getRelevantCaseStudies('inventory software');
  const relevantTestimonials = getRelevantTestimonials('inventory');
  const metrics = getProprietaryMetrics('inventory software');

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Real-Time Inventory Tracking', stockflow: true, competitor: false },
    { feature: 'Barcode Scanning', stockflow: true, competitor: false },
    { feature: 'Mobile App Access', stockflow: true, competitor: false },
    { feature: 'Automated Reorder Points', stockflow: true, competitor: false },
    { feature: 'Multi-Location Support', stockflow: true, competitor: 'Manual setup' },
    { feature: 'Multi-User Collaboration', stockflow: true, competitor: 'File sharing issues' },
    { feature: 'Data Backup & Security', stockflow: true, competitor: 'Manual backups' },
    { feature: 'Integration with E-commerce', stockflow: true, competitor: false },
    { feature: 'Automated Reports', stockflow: true, competitor: 'Manual creation' },
    { feature: 'Audit Trail', stockflow: true, competitor: false },
    { feature: 'Low Stock Alerts', stockflow: true, competitor: false },
    { feature: 'Cost', stockflow: 'Completely free forever', competitor: 'Free (but time-consuming)' },
    { feature: 'Setup Time', stockflow: '5-7 days', competitor: 'Ongoing maintenance' },
    { feature: 'Error Prevention', stockflow: 'Built-in validation', competitor: 'Manual errors common' },
  ];

  const faqData = [
    {
      question: "Why should I switch from spreadsheets to StockFlow?",
      answer: "StockFlow eliminates manual data entry errors, provides real-time inventory tracking across multiple locations, offers barcode scanning for accuracy, sends automated low stock alerts, integrates with e-commerce platforms, and provides mobile access. Spreadsheets require constant manual updates, are prone to errors, don't sync in real-time, and can't integrate with sales channels. StockFlow saves hours weekly and prevents costly stockouts and overstocking."
    },
    {
      question: "What are the main problems with using spreadsheets for inventory management?",
      answer: "Spreadsheets have several critical limitations: (1) Manual data entry leads to errors and inconsistencies, (2) No real-time synchronization across locations or users, (3) No barcode scanning capability, (4) Difficult to track inventory changes and history, (5) No automated alerts for low stock, (6) Limited collaboration features leading to version conflicts, (7) No integration with e-commerce platforms or POS systems, (8) Time-consuming to maintain and update, (9) Risk of data loss without proper backups, (10) No mobile access for warehouse operations."
    },
    {
      question: "How much time does StockFlow save compared to spreadsheets?",
      answer: "StockFlow typically saves 10-20 hours per week for businesses managing inventory with spreadsheets. This includes time saved on manual data entry (5-8 hours/week), creating reports (2-3 hours/week), reconciling discrepancies (3-5 hours/week), and managing multiple spreadsheet versions (2-4 hours/week). With barcode scanning and automated workflows, StockFlow eliminates most manual inventory tasks."
    },
    {
      question: "Can I import my spreadsheet data into StockFlow?",
      answer: "Yes, StockFlow offers free data import from spreadsheets. Simply export your inventory data to CSV format, and our team will help you import it into StockFlow with proper mapping of products, quantities, locations, and categories. The migration typically takes 1-2 days and is included in our free setup service. We ensure all your historical data transfers accurately."
    },
    {
      question: "Is StockFlow more expensive than using spreadsheets?",
      answer: "While spreadsheets are technically 'free,' they have hidden costs: time spent on manual data entry (10-20 hours/week), errors leading to stockouts or overstocking, inability to scale, and lack of integration capabilities. StockFlow is completely free forever with unlimited products and all features included. For most businesses, the time savings and error prevention make StockFlow far superior to spreadsheets at no cost."
    },
    {
      question: "What happens if I make a mistake in StockFlow vs spreadsheets?",
      answer: "StockFlow has built-in validation and audit trails, making it easy to identify and correct mistakes. You can see who made changes and when, and roll back errors if needed. Spreadsheets have no audit trail, making it difficult to track errors, and mistakes can go unnoticed for days or weeks, leading to inventory discrepancies and potential stockouts."
    },
    {
      question: "Can multiple people use StockFlow at the same time, unlike spreadsheets?",
      answer: "Yes, StockFlow is designed for multi-user collaboration with real-time synchronization. Multiple team members can update inventory simultaneously from different locations without conflicts. Spreadsheets require file sharing, which leads to version conflicts, lost updates, and the need to manually merge changes. StockFlow ensures everyone always sees the latest inventory data."
    },
    {
      question: "Does StockFlow work on mobile devices like spreadsheets?",
      answer: "StockFlow has a dedicated mobile app for iOS and Android that's optimized for inventory management, including barcode scanning, stock adjustments, and receiving. While spreadsheets can be accessed on mobile, they're not designed for inventory operations and are difficult to use on small screens. StockFlow's mobile app is built specifically for warehouse and field operations."
    },
    {
      question: "How long does it take to set up StockFlow compared to creating a spreadsheet?",
      answer: "While you can create a basic spreadsheet in minutes, setting up a proper inventory management system in spreadsheets takes weeks of work and ongoing maintenance. StockFlow can be set up and operational in 5-7 days with free guided onboarding, data import, and team training. Once set up, StockFlow requires minimal maintenance compared to constantly updating spreadsheets."
    },
    {
      question: "What if I'm comfortable with spreadsheets - is StockFlow hard to learn?",
      answer: "StockFlow is designed to be intuitive and user-friendly. If you're comfortable with spreadsheets, you'll find StockFlow's interface familiar but more powerful. We provide free onboarding, training materials, and 24/7 support to help your team transition smoothly. Most users find StockFlow easier to use than complex spreadsheet formulas and macros."
    }
  ];

  const structuredData = [
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
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/stockflow-vs-spreadsheets",
      "name": "StockFlow vs Spreadsheets Comparison",
      "headline": "StockFlow vs Spreadsheets: Why Professional Inventory Software Beats Manual Tracking",
      "description": "Compare StockFlow vs spreadsheets for inventory management. Real-time tracking, barcode scanning, automation, and integrations vs manual data entry. Save 10-20 hours/week. StockFlow is completely free forever - Join for Free.",
      "url": "https://www.stockflowsystems.com/stockflow-vs-spreadsheets",
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflowsystems.com"
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split("T")[0]
    }
  ];

  const migrationSteps = [
    {
      step: 1,
      title: "Export Your Spreadsheet Data",
      description: "Export your inventory data from Excel or Google Sheets to CSV format. Include columns for product names, SKUs, quantities, locations, and categories.",
      icon: FileText,
      timeframe: "30 minutes"
    },
    {
      step: 2,
      title: "Import to StockFlow",
      description: "Our team provides free setup assistance to import your spreadsheet data into StockFlow. We'll help map your columns and ensure all data transfers accurately.",
      icon: Database,
      timeframe: "1 day"
    },
    {
      step: 3,
      title: "Set Up Locations & Categories",
      description: "Configure your warehouse locations, product categories, and any custom fields you need. StockFlow's guided setup makes this quick and easy.",
      icon: MapPin,
      timeframe: "1-2 hours"
    },
    {
      step: 4,
      title: "Train Your Team",
      description: "We provide free training for your team on using StockFlow, including barcode scanning, stock adjustments, and generating reports. Most users are productive within a day.",
      icon: Users,
      timeframe: "2-4 hours"
    },
    {
      step: 5,
      title: "Go Live",
      description: "Start using StockFlow for daily operations. Your team can access inventory from any device, scan barcodes, and get real-time updates across all locations.",
      icon: Zap,
      timeframe: "Immediate"
    }
  ];

  return (
    <SeoPageLayout 
      title="StockFlow vs Spreadsheets"
      heroTitle="StockFlow vs Spreadsheets: Why Professional Software Beats Manual Tracking"
      updatedDate={new Date().toISOString().split("T")[0]}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Spreadsheets 2025 - Save 10-20 Hours/Week | StockFlow"
        description="Compare StockFlow vs spreadsheets for inventory management. Real-time tracking, barcode scanning, automation vs manual data entry. Save 10-20 hours/week."
        keywords="stockflow vs spreadsheets, excel inventory management, google sheets inventory, inventory software vs excel, replace excel inventory, spreadsheet inventory management, inventory management software, barcode scanning inventory, real-time inventory tracking, automated inventory management, inventory software free, stockflow vs excel"
        url="https://www.stockflowsystems.com/stockflow-vs-spreadsheets"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Spreadsheets feel free—until you calculate the real cost. Manual data entry wastes 10-20 hours weekly. Error rates hover around 10-15%. Multi-user access causes version conflicts. StockFlow eliminates these problems with real-time tracking, barcode scanning, and automation that spreadsheets can't match.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Hundreds of businesses have migrated from Excel to StockFlow. Here's what changed: 75% reduction in counting time, 90% fewer errors, real-time sync across locations, automated reorder alerts. The comparison below shows exactly where spreadsheets fail.
        </p>
      </div>



      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison: StockFlow vs Spreadsheets</h2>
          <ComparisonTable competitorName="Spreadsheets (Excel/Sheets)" features={comparisonFeatures} />
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">The Hidden Costs of Using Spreadsheets for Inventory</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <AlertCircle className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Manual Data Entry Errors</h3>
              <p className="text-gray-600">Typos, wrong quantities, and formula mistakes lead to inventory discrepancies, stockouts, and lost sales. Studies show 88% of spreadsheets contain errors.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <Clock className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">10-20 Hours/Week Lost</h3>
              <p className="text-gray-600">Manual data entry, creating reports, reconciling discrepancies, and managing multiple spreadsheet versions consume valuable time that could be spent growing your business.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <Users className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Version Control Issues</h3>
              <p className="text-gray-600">Multiple people editing spreadsheets leads to conflicts, lost updates, and confusion about which version is current. No real-time collaboration.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <FileText className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Integration Capabilities</h3>
              <p className="text-gray-600">Can't connect to e-commerce platforms, POS systems, or accounting software. Requires manual data entry for every sale and purchase.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <Database className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Audit Trail</h3>
              <p className="text-gray-600">Can't track who made changes, when, or why. Difficult to identify and fix errors. No history of inventory movements.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <Smartphone className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Mobile Access</h3>
              <p className="text-gray-600">Can't update inventory from the warehouse floor. Requires going back to a computer, leading to delays and forgotten updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StockFlow is Better Than Spreadsheets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">Inventory updates instantly across all locations and users. No more waiting for spreadsheet updates or version conflicts.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Barcode Scanning</h3>
              <p className="text-gray-600">Scan barcodes with your phone to update inventory instantly. Eliminates manual data entry errors and saves hours daily.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automated Alerts</h3>
              <p className="text-gray-600">Get notified when stock is low, items are expiring, or reorder points are reached. Never run out of stock again.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <Database className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">E-commerce Integration</h3>
              <p className="text-gray-600">Automatically sync inventory with Shopify, Amazon, WooCommerce, and 45+ platforms. No manual updates needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Migrate from Spreadsheets to StockFlow</h2>
          <div className="space-y-6">
            {migrationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Step {step.step}: {step.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {step.timeframe}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">Total Migration Time: 5-7 Days</p>
            <p className="text-gray-600">Including data import, setup, and team training - all included free with StockFlow</p>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Cost Comparison: StockFlow vs Spreadsheets</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost Factor</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Spreadsheets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Software Cost</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Completely free forever (unlimited)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Free (Excel/Sheets)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Time Spent Weekly</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">1-2 hours (automated)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">10-20 hours (manual)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Error Rate</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Near zero (validation)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">High (88% have errors)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Integration Costs</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Included (45+ platforms)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Manual work required</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Mobile Access</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">✅ Native app</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">❌ Limited/awkward</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Scalability</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited products</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Becomes unwieldy</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Hidden Costs of Spreadsheets:</strong> At 15 hours/week × €25/hour × 52 weeks = <strong>€19,500/year in lost productivity</strong>. StockFlow eliminates most of this manual work and is completely free forever, making it far more cost-effective than spreadsheets.
            </p>
          </div>
        </div>
      </section>

      {/* When to Choose Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">When to Choose StockFlow vs Spreadsheets</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose StockFlow If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You spend more than 5 hours/week managing inventory</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You have multiple locations or warehouses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You sell on multiple channels (online, retail, etc.)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You need real-time inventory visibility</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want to prevent stockouts and overstocking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You need barcode scanning capabilities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want to scale your business</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Spreadsheets May Work If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You have fewer than 20 products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You have a single location</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You don't sell online or through multiple channels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You don't need real-time updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You're okay with spending 10+ hours/week on manual data entry</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You don't plan to grow your inventory</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="default"
        />
      )}
    </SeoPageLayout>
  );
}

