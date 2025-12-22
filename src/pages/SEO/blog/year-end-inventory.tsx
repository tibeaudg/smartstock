import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "Year End Inventory";
const canonicalPath = "/year-end-inventory";
const metaDescription = "Year-end inventory counts take 2-3 days without preparation. Use cycle counts throughout the year and proper software to cut time to 4-6 hours. Here's how to do it right.";
const keywords = "year end inventory, year-end inventory, end of year inventory, year end inventory count, closing inventory, year end inventory accounting, inventory year end";
const heroBadge = "Topic Guide • Updated October 2025";
const summaryCopy = "Year-end inventory is the physical count and valuation of all inventory at the end of the fiscal year for financial reporting and tax purposes. It involves counting all items, valuing inventory (FIFO, LIFO, or weighted average), reconciling discrepancies, and reporting values for accounting. Year-end inventory is required for accurate financial statements, tax calculations, and compliance. Best practices include: preparing in advance, using cycle counts throughout the year, using inventory management software for accuracy, and reconciling discrepancies promptly.";
const takeaways = [
  "Year-end inventory is the physical count and valuation of all inventory at fiscal year-end for financial reporting and tax purposes.",
  "It involves counting all items, valuing inventory (FIFO, LIFO, or weighted average), reconciling discrepancies, and reporting values for accounting.",
  "Best practices include preparing in advance, using cycle counts throughout the year, using inventory management software, and reconciling discrepancies promptly."
];
const actionSteps = [
  {
    "title": "Prepare in advance",
    "description": "Plan year-end inventory count weeks in advance. Organize inventory, ensure all items are accessible, prepare counting sheets or use inventory management software, and schedule staff for counting."
  },
  {
    "title": "Conduct physical count",
    "description": "Count all inventory items accurately. Use barcode scanning or inventory management software for efficiency and accuracy. Count systematically by location or category to avoid missing items."
  },
  {
    "title": "Value and reconcile",
    "description": "Value inventory using your chosen method (FIFO, LIFO, or weighted average). Reconcile physical counts with system records, investigate discrepancies, and adjust records. Report values for accounting and tax purposes."
  }
];
const metrics = [
  {
    "label": "Count accuracy",
    "detail": "Measure accuracy of year-end inventory counts. Target 95-99% accuracy. Use inventory management software and barcode scanning to improve accuracy and reduce errors."
  },
  {
    "label": "Time to complete",
    "detail": "Track time spent on year-end inventory. Effective preparation and software use reduce time significantly. Cycle counts throughout the year make year-end counts faster."
  },
  {
    "label": "Discrepancy rate",
    "detail": "Monitor discrepancies between physical counts and system records. Lower discrepancy rates indicate better ongoing inventory management. Investigate and resolve discrepancies promptly."
  }
];
const faqData = [
  {
    "question": "What is year-end inventory?",
    "answer": "Year-end inventory is the physical count and valuation of all inventory at the end of the fiscal year for financial reporting and tax purposes. It involves counting all items, valuing inventory (FIFO, LIFO, or weighted average), reconciling discrepancies, and reporting values for accounting."
  },
  {
    "question": "Why is year-end inventory important?",
    "answer": "Year-end inventory is required for accurate financial statements, tax calculations, and compliance. It provides the ending inventory value used in cost of goods sold calculations and financial reporting. Accurate year-end inventory is essential for proper accounting."
  },
  {
    "question": "How do you conduct year-end inventory?",
    "answer": "Conduct by: preparing in advance, organizing inventory, counting all items accurately (using barcode scanning or software), valuing inventory using your chosen method, reconciling with system records, investigating discrepancies, and reporting values for accounting."
  },
  {
    "question": "Can inventory software help with year-end inventory?",
    "answer": "Yes, inventory management software helps by: maintaining accurate records throughout the year, enabling efficient counting with barcode scanning, providing valuation methods, generating reports, and reducing discrepancies. Software makes year-end inventory faster and more accurate."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Year End Inventory",
    "description": "Deep dive into Year End Inventory. Learn practical ideas, implementation steps, and metrics so your team can apply Year End Inventory with StockFlow.",
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
    "datePublished": "2025-10-29",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/year-end-inventory"
    }
  }
];

export default function SeoYearEndInventoryPage() {
  usePageRefresh();
  const location = useLocation();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));



  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={topicTitle} 
      updatedDate="3/12/2025"
      faqData={faqData}
       
      
    >
      <SEO
        title={`Year End Inventory Guide 2025 | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Year End Inventory</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              <strong>Year-end inventory</strong> means counting and valuing all stock at fiscal year-end for accounting and taxes. Without preparation, it takes 2-3 days and disrupts operations. One hardware store spent 3 days counting 2,500 SKUs manually—then found €8,500 in discrepancies to reconcile.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Year-end counts are required for financial statements and tax reporting. The ending inventory value goes into cost of goods sold calculations. Smart businesses use cycle counts throughout the year (so year-end is mostly verification) and inventory software for accuracy. One retailer cut year-end counting from 3 days to 4 hours by doing monthly cycle counts and using barcode scanning.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Effective year-end inventory processes reduce time spent, improve accuracy, and ensure compliance. Inventory management software helps by maintaining accurate records throughout the year, enabling efficient counting with barcode scanning, and generating reports. Learn more about <Link to="/perpetual-inventory-and-physical-inventory" className="text-blue-600 hover:underline font-semibold">physical inventory counts</Link> or explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> solutions.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why year-end inventory matters</h3>
              <p className="mt-3 text-base text-blue-900/90">
                Year-end inventory is required for accurate financial statements, tax calculations, and compliance. It provides the ending inventory value used in cost of goods sold calculations. Accurate year-end inventory is essential for proper accounting and financial reporting."
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {takeaways.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200"
              >
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="playbook" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Action Playbook</h2>
              <p className="mt-3 text-base text-gray-600">
                Turn the big ideas behind {topicTitle.toLowerCase()} into structured workstreams. Align leaders, give teams the tools
                they need, and track momentum every step of the way.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-blue-700 shadow">
              <Target className="h-4 w-4" />
              Proven by StockFlow teams
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {actionSteps.map((step, index) => (
              <div key={step.title} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">Step {index + 1}</span>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metrics" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Metrics that Matter</h2>
              <p className="mt-3 max-w-2xl text-base text-gray-600">
                Use these scorecards to prove the ROI of {topicTitle.toLowerCase()}. Set a baseline, monitor progress weekly, and
                communicate wins with clarity.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
              <BarChart3 className="h-4 w-4" />
              Build dashboards in StockFlow
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{metric.label}</h3>
                <p className="mt-3 text-sm text-gray-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </SeoPageLayout>
  );
}
