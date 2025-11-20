import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import InternalLinkingWidget from "@/components/seo/InternalLinkingWidget";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "Inventory Management 101";
const canonicalPath = "/blog/inventory-management-101";
const metaDescription = "Complete beginner's guide to inventory management. Learn the fundamentals, key concepts, types of inventory, and essential strategies for effective stock control. Perfect for small businesses.";
const keywords = "inventory management 101, inventory management basics, inventory management fundamentals, inventory management guide, inventory management for beginners, stock management basics, inventory control basics";
const heroBadge = "Beginner's Guide • Updated September 2025";
const summaryCopy = "Inventory Management 101 is your complete introduction to managing inventory effectively. Learn what inventory management is, why it matters, the different types of inventory, key concepts like reorder points and safety stock, and essential strategies that help businesses maintain optimal stock levels while minimizing costs.";
const takeaways = [
  "Inventory management is the process of ordering, storing, tracking, and controlling inventory to meet customer demand while minimizing costs.",
  "The four main types of inventory are raw materials, work-in-progress, finished goods, and MRO (maintenance, repair, operations) supplies.",
  "Key concepts include reorder points, safety stock, economic order quantity (EOQ), and inventory turnover ratios."
];
const actionSteps = [
  {
    "title": "Understand inventory types",
    "description": "Learn the four main types: raw materials, work-in-progress (WIP), finished goods, and MRO inventory. Each type requires different management approaches. Read more about <Link to=\"/glossary/inventory\" className=\"text-blue-600 hover:underline\">inventory types</Link> in our glossary."
  },
  {
    "title": "Set up basic tracking",
    "description": "Start with simple tracking using spreadsheets or free <Link to=\"/inventory-management-software\" className=\"text-blue-600 hover:underline\">inventory management software</Link>. Track item names, quantities, locations, and reorder points."
  },
  {
    "title": "Implement reorder points",
    "description": "Set minimum stock levels (reorder points) for each item to prevent stockouts. When inventory reaches the reorder point, place a new order. Learn about <Link to=\"/glossary/safety-stock\" className=\"text-blue-600 hover:underline\">safety stock</Link> to buffer against demand variability."
  }
];
const metrics = [
  {
    "label": "Inventory turnover",
    "detail": "Measure how many times you sell and replace inventory per year. Higher turnover indicates efficient inventory management. Learn about <Link to=\"/glossary/inventory-turnover\" className=\"text-blue-600 hover:underline\">inventory turnover ratios</Link>."
  },
  {
    "label": "Stockout frequency",
    "detail": "Track how often items are out of stock. Aim for zero stockouts on critical items by maintaining appropriate safety stock levels."
  },
  {
    "label": "Inventory accuracy",
    "detail": "Measure the percentage of inventory records that match physical counts. Target 95%+ accuracy through regular audits and automated tracking."
  }
];
const faqData = [
  {
    "question": "What is inventory management?",
    "answer": "Inventory management is the process of ordering, storing, tracking, and controlling inventory to ensure you have the right products in the right quantities at the right time. It helps businesses meet customer demand while minimizing costs from overstocking, stockouts, and waste. Effective inventory management balances service levels with inventory investment."
  },
  {
    "question": "What are the main types of inventory?",
    "answer": "The four main types are: (1) Raw materials - inputs used to create products, (2) Work-in-progress (WIP) - items being manufactured, (3) Finished goods - products ready for sale, and (4) MRO inventory - maintenance, repair, and operations supplies. Each type requires different management strategies. Learn more in our <Link to=\"/glossary/inventory-management\" className=\"text-blue-600 hover:underline\">inventory management glossary</Link>."
  },
  {
    "question": "What is a reorder point?",
    "answer": "A reorder point is the minimum inventory level at which you should place a new order to avoid stockouts. It's calculated based on average daily usage, lead time (time to receive new stock), and safety stock. When inventory reaches the reorder point, you place an order so new stock arrives before running out."
  },
  {
    "question": "How do I get started with inventory management?",
    "answer": "Start by cataloging all your inventory items, setting up basic tracking (spreadsheet or software), establishing reorder points for key items, and conducting regular counts to maintain accuracy. For businesses with 50+ items, consider <Link to=\"/inventory-management-software\" className=\"text-blue-600 hover:underline\">inventory management software</Link> to automate tracking and reordering."
  },
  {
    "question": "What is safety stock?",
    "answer": "Safety stock is extra inventory kept on hand as a buffer against unexpected demand spikes, supplier delays, or forecasting errors. It helps prevent stockouts when things don't go as planned. The amount of safety stock depends on demand variability and supplier reliability. Learn how to <Link to=\"/how-to-calculate-safety-stock\" className=\"text-blue-600 hover:underline\">calculate safety stock</Link>."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Inventory Management 101: Complete Beginner's Guide",
    "description": "Complete beginner's guide to inventory management. Learn the fundamentals, key concepts, types of inventory, and essential strategies for effective stock control. Perfect for small businesses.",
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
    "datePublished": "2025-09-08",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflow.be/blog/inventory-management-101"
    }
  }
];

export default function SeoInventoryManagement101Page() {
  usePageRefresh();
  const location = useLocation();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: "overview", title: `${topicTitle} Overview`, level: 1 },
    { id: "playbook", title: "Action Playbook", level: 1 },
    { id: "metrics", title: "Metrics that Matter", level: 1 },
    { id: "stockflow-advantage", title: "Why StockFlow", level: 1 },
    { id: "faq", title: "FAQ", level: 1 },
  ]);

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={topicTitle} 
      updatedDate="20/11/2025"
      faqData={faqData}
       
      
    >
      <SEO
        title={`Inventory Management 101: Complete Beginner's Guide 2025`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflow.be${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What is Inventory Management?</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Inventory management is the systematic process of ordering, storing, tracking, and controlling inventory to ensure businesses have the right products in the right quantities at the right time. It's a critical business function that balances customer demand satisfaction with cost minimization, helping businesses avoid both stockouts (lost sales) and overstocking (tied-up capital).
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Effective inventory management involves understanding different <Link to="/glossary/inventory" className="text-blue-600 hover:underline font-semibold">inventory types</Link>, setting appropriate reorder points and safety stock levels, tracking inventory turnover, and using data to make informed purchasing decisions. Whether you're a small retailer or a large manufacturer, mastering inventory management fundamentals is essential for profitability and growth.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why inventory management matters</h3>
              <p className="mt-3 text-base text-blue-900/90">
                Poor inventory management leads to stockouts (lost sales), overstocking (tied-up capital), waste from obsolescence, and inefficient operations. Good inventory management improves cash flow, reduces costs, increases customer satisfaction, and provides better visibility into business operations. Modern <Link to="/inventory-management-software" className="text-blue-700 hover:underline font-semibold">inventory management software</Link> makes these practices accessible to businesses of all sizes.
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
                <p className="mt-3 text-sm leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: step.description }} />
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
                <p className="mt-3 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: metric.detail }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stockflow-advantage" className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-white/10 p-8 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Why StockFlow Makes {topicTitle} Stick</h2>
                <p className="mt-4 max-w-2xl text-base text-white/85">
                  Transform ideas into measurable outcomes. StockFlow connects inventory data, automates notifications,
                  and keeps every stakeholder aligned—even across warehouses, regions, or partner networks.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">
                <Lightbulb className="h-4 w-4" />
                Built for continuous improvement
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Unified data foundation</h3>
                <p className="mt-3 text-sm text-white/85">
                  Centralize item masters, stock movements, suppliers, and documents so inventory management 101 decisions never rely on outdated spreadsheets.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Automation & alerts</h3>
                <p className="mt-3 text-sm text-white/85">
                  Trigger workflows, approvals, and reorder points when inventory management 101 KPIs drift from plan.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Collaboration built in</h3>
                <p className="mt-3 text-sm text-white/85">
                  Give finance, operations, and frontline teams a shared system of record for inventory management 101 progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-base text-gray-600">
              Still exploring {topicTitle.toLowerCase()}? These answers help you take the next confident step.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {faqData.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200"
              >
                <summary className="cursor-pointer text-lg font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-3 text-base leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-20 pt-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50 via-white to-purple-50 p-10 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Start Managing Inventory with StockFlow</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
            Put inventory management fundamentals into practice with StockFlow. Track inventory, set reorder points, and automate reordering—all from one easy-to-use platform. Start free with up to 100 products.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center rounded-xl bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-purple-700"
            >
              Create Your Account
            </Link>
            <a
              href="/pricing"
              className="inline-flex items-center rounded-xl border border-purple-200 px-6 py-3 text-base font-semibold text-purple-700 transition hover:bg-purple-50"
            >
              See Plans & Pricing
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <InternalLinkingWidget
            currentPath={location.pathname}
            variant="inline"
            limit={5}
            title="Related Articles"
          />
        </div>
      </section>
    </SeoPageLayout>
  );
}
