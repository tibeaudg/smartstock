import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "What Is A Stockout";
const canonicalPath = "/what-is-a-stockout";
const metaDescription = "Stockouts lose 10-20% of revenue on affected items. 30-40% of customers shop elsewhere after one. Here's what causes stockouts, what they really cost, and how to prevent them.";
const keywords = "what is a stockout, stockout definition, stockout meaning, prevent stockouts, stockout costs, inventory stockout, out of stock";
const heroBadge = "Topic Guide • Updated September 2025";
const summaryCopy = "A stockout occurs when inventory for a product is completely depleted and unavailable for sale. Stockouts result in lost sales, customer dissatisfaction, and potential long-term damage to brand reputation. Common causes include inaccurate demand forecasting, delayed supplier deliveries, inadequate safety stock, and poor inventory management. Preventing stockouts requires accurate tracking, automated reorder points, safety stock buffers, and reliable supplier relationships.";
const takeaways = [
  "Stockouts occur when inventory is completely depleted, resulting in lost sales, customer dissatisfaction, and potential long-term revenue loss.",
  "Common causes include inaccurate forecasting, supplier delays, inadequate safety stock, poor inventory tracking, and unexpected demand spikes.",
  "Prevention strategies include automated reorder points, safety stock buffers, accurate demand forecasting, reliable suppliers, and real-time inventory visibility."
];
const actionSteps = [
  {
    "title": "Set up automated reorder points",
    "description": "Calculate optimal reorder points based on lead times and average demand. Configure automated alerts that notify you when inventory reaches reorder levels, ensuring you order before stockouts occur."
  },
  {
    "title": "Maintain safety stock",
    "description": "Keep safety stock buffers to protect against demand variability and supplier delays. Calculate safety stock based on demand uncertainty and lead time variability to prevent stockouts."
  },
  {
    "title": "Improve demand forecasting",
    "description": "Use historical sales data and trends to forecast demand more accurately. Adjust forecasts for seasonality, promotions, and market changes to better predict inventory needs."
  }
];
const metrics = [
  {
    "label": "Stockout frequency",
    "detail": "Track how often items go out of stock. Aim to reduce stockouts by 40-60% through better forecasting, automated reordering, and safety stock optimization."
  },
  {
    "label": "Lost sales from stockouts",
    "detail": "Estimate revenue lost due to stockouts. Calculate by multiplying out-of-stock days by average daily sales. This metric highlights the true cost of stockouts."
  },
  {
    "label": "Stockout recovery time",
    "detail": "Measure how quickly inventory is replenished after a stockout. Faster recovery minimizes customer impact and lost sales opportunities."
  }
];
const faqData = [
  {
    "question": "What is a stockout?",
    "answer": "A stockout occurs when inventory for a product is completely depleted and unavailable for sale. Stockouts result in lost sales, customer dissatisfaction, and potential long-term damage to brand reputation. They happen when demand exceeds available inventory and no safety stock is maintained."
  },
  {
    "question": "What causes stockouts?",
    "answer": "Common causes include inaccurate demand forecasting, delayed supplier deliveries, inadequate safety stock, poor inventory tracking, unexpected demand spikes, production delays, and supply chain disruptions. Poor inventory management practices are the root cause of most stockouts."
  },
  {
    "question": "How do you prevent stockouts?",
    "answer": "Prevent stockouts by setting automated reorder points, maintaining safety stock buffers, improving demand forecasting, using inventory management software for real-time visibility, building reliable supplier relationships, and conducting regular inventory audits to maintain accuracy."
  },
  {
    "question": "What is the cost of a stockout?",
    "answer": "Stockout costs include lost sales revenue, customer dissatisfaction (potential long-term revenue loss), rush shipping costs to expedite replenishment, and damage to brand reputation. Studies show that stockouts can cost businesses 10-20% of potential revenue for affected items."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is A Stockout",
    "description": "Deep dive into What Is A Stockout. Learn practical ideas, implementation steps, and metrics so your team can apply What Is A Stockout with StockFlow.",
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
    "datePublished": "2025-09-26",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/what-is-a-stockout"
    }
  }
];

export default function SeoWhatIsAStockoutPage() {
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
        title={`What Is A Stockout 2025 - Definition, Causes & Prevention | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What is a Stockout?</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              A <strong>stockout</strong> means you're out of inventory when a customer wants to buy. That costs 10-20% of revenue on affected items. Worse, 30-40% of customers shop elsewhere after experiencing a stockout—and many don't come back. One fashion retailer lost €8,500 in sales over three months from repeated stockouts on bestsellers. Customers switched to competitors, and the business never recovered those relationships.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Stockouts happen when demand spikes or suppliers delay—and you have no safety stock buffer. Most businesses cause their own stockouts: inaccurate forecasting, ignoring reorder points, poor tracking that shows inventory that isn't there. The true cost includes lost sales, rush shipping fees (€50-200 per emergency order), and brand damage. One hardware store lost 15% of regular customers after holiday stockouts.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Preventing stockouts requires accurate inventory tracking, automated reorder points, safety stock buffers, reliable supplier relationships, and real-time visibility. Learn more about <Link to="/how-to-improve-inventory-control" className="text-blue-600 hover:underline font-semibold">how to improve inventory control</Link> or explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> solutions.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">The hidden cost</h3>
              <p className="mt-3 text-base text-blue-900/90">
                Lost sales are just the start. Rush shipping adds €50-200 per emergency order. Customer churn hits hard—30-40% switch to competitors after one stockout. One retailer calculated €12,000 in lost revenue over six months from stockouts on just 10 SKUs. Preventing them through proper reorder points and safety stock costs a fraction of that.
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
