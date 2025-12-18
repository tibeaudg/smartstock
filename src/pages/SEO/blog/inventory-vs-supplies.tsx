import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "Inventory Vs Supplies";
const canonicalPath = "/inventory-vs-supplies";
const metaDescription = "Understand the difference between inventory and supplies. Learn how to categorize and manage both effectively. Key distinctions for accounting and inventory management.";
const keywords = "inventory vs supplies, difference between inventory and supplies, inventory definition, supplies definition, inventory accounting, supplies accounting, inventory management";
const heroBadge = "Topic Guide • Updated October 2025";
const summaryCopy = "Inventory refers to products held for sale to customers (finished goods, raw materials, work-in-progress), while supplies are items used in business operations but not sold (office supplies, cleaning materials, maintenance items). Key differences: inventory is tracked as an asset on the balance sheet and affects COGS when sold, while supplies are expensed when purchased and don't directly generate revenue. Proper categorization is important for accounting, financial reporting, and inventory management accuracy.";
const takeaways = [
  "Inventory includes products held for sale (finished goods, raw materials, WIP) and is tracked as an asset affecting COGS when sold.",
  "Supplies are items used in operations but not sold (office supplies, cleaning materials) and are expensed when purchased.",
  "Key difference: inventory generates revenue when sold, while supplies support operations but don't directly generate revenue. Proper categorization is essential for accounting accuracy."
];
const actionSteps = [
  {
    "title": "Categorize items correctly",
    "description": "Identify which items are inventory (products for sale) vs supplies (operational items). Inventory includes finished goods, raw materials, and work-in-progress. Supplies include office materials, cleaning products, and maintenance items."
  },
  {
    "title": "Set up separate tracking",
    "description": "Use inventory management software to track inventory and supplies separately. This ensures accurate accounting, proper financial reporting, and better management of both categories."
  },
  {
    "title": "Review accounting treatment",
    "description": "Ensure proper accounting: inventory is tracked as an asset and affects COGS when sold, while supplies are expensed when purchased. Consult with an accountant to ensure correct categorization."
  }
];
const metrics = [
  {
    "label": "Categorization accuracy",
    "detail": "Track how accurately items are categorized as inventory vs supplies. Proper categorization ensures accurate financial reporting and inventory management. Target 100% accuracy."
  },
  {
    "label": "Inventory vs supplies ratio",
    "detail": "Monitor the ratio of inventory value to supplies value. This helps understand business focus and ensures proper resource allocation between revenue-generating inventory and operational supplies."
  },
  {
    "label": "Accounting accuracy",
    "detail": "Measure accuracy of financial reporting based on proper categorization. Correct categorization ensures accurate balance sheets, COGS calculations, and expense reporting."
  }
];
const faqData = [
  {
    "question": "What is the difference between inventory and supplies?",
    "answer": "Inventory refers to products held for sale to customers (finished goods, raw materials, work-in-progress) and is tracked as an asset affecting COGS when sold. Supplies are items used in business operations but not sold (office supplies, cleaning materials, maintenance items) and are expensed when purchased. Inventory generates revenue when sold, while supplies support operations."
  },
  {
    "question": "How do you categorize inventory vs supplies?",
    "answer": "Categorize based on purpose: inventory includes products for sale (finished goods, raw materials, WIP), while supplies include operational items (office materials, cleaning products, maintenance items). Ask: 'Will this be sold to customers?' If yes, it's inventory. If no, it's supplies."
  },
  {
    "question": "Why is it important to distinguish inventory from supplies?",
    "answer": "Distinguishing is important for accurate accounting, financial reporting, and inventory management. Inventory is tracked as an asset and affects COGS when sold, while supplies are expensed when purchased. Proper categorization ensures accurate balance sheets, profit calculations, and inventory optimization."
  },
  {
    "question": "How does accounting differ for inventory vs supplies?",
    "answer": "Inventory is tracked as an asset on the balance sheet and affects Cost of Goods Sold (COGS) when sold. Supplies are expensed when purchased and appear as operating expenses. This difference impacts financial reporting, profit calculations, and tax treatment."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Inventory Vs Supplies",
    "description": "Deep dive into Inventory Vs Supplies. Learn practical ideas, implementation steps, and metrics so your team can apply Inventory Vs Supplies with StockFlow.",
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
    "datePublished": "2025-10-22",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/inventory-vs-supplies"
    }
  }
];

export default function SeoInventoryVsSuppliesPage() {
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
        title={`Inventory Vs Supplies 2025 - Key Differences Explained | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Inventory vs Supplies: Key Differences</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              <strong>Inventory</strong> refers to products held for sale to customers (finished goods, raw materials, work-in-progress) and is tracked as an asset on the balance sheet, affecting Cost of Goods Sold (COGS) when sold. <strong>Supplies</strong> are items used in business operations but not sold (office supplies, cleaning materials, maintenance items) and are expensed when purchased.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              The key difference is that inventory generates revenue when sold, while supplies support operations but don't directly generate revenue. Proper categorization is essential for accurate accounting, financial reporting, and inventory management. Inventory is tracked as an asset and affects COGS, while supplies are expensed immediately.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              To categorize correctly, ask: 'Will this be sold to customers?' If yes, it's inventory. If no, it's supplies. Use inventory management software to track both categories separately for accurate accounting and better management. Learn more about <Link to="/inventory-management-101" className="text-blue-600 hover:underline font-semibold">inventory management basics</Link> or explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> solutions.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why the distinction matters</h3>
              <p className="mt-3 text-base text-blue-900/90">
                Proper categorization ensures accurate accounting, financial reporting, and inventory management. Inventory affects balance sheets and COGS, while supplies affect operating expenses. Incorrect categorization leads to inaccurate financial statements, profit calculations, and inventory optimization decisions."
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
