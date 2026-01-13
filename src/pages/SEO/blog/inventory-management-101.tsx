import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";
import { sanitizeBlogContent } from "@/utils/sanitizeHtml";

const topicTitle = "Inventory Management 101";
const canonicalPath = "/inventory-management-101";
const metaDescription = "Stop losing €4,000-8,000 annually on inventory mistakes. Complete beginner's guide covers what inventory management is, why it matters, how to set reorder points, and practical strategies that prevent stockouts and overstock.";
const keywords = "inventory management 101, inventory management basics, inventory management fundamentals, inventory management guide, inventory management for beginners, stock management basics, inventory control basics";
const heroBadge = "Beginner's Guide • Updated September 2025";
const summaryCopy = "Stop losing money to stockouts and overstock. Inventory management 101 covers the basics: what it is, why small businesses waste €4,000-8,000 annually without it, how to set reorder points that actually work, and the four inventory types every business owner should know. No MBA required just practical strategies that prevent costly mistakes.";
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
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2025-09-08",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/inventory-management-101"
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
        "text": faq.answer.replace(/<Link[^>]*>.*?<\/Link>/g, '').replace(/className="[^"]*"/g, '')
      }
    }))
  }
];

export default function SeoInventoryManagement101Page() {
  usePageRefresh();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={topicTitle} 
      dateUpdated="06/01/2026"
      faqData={faqData}
       
      
    >
      <SEO
        title={`Inventory Management 101: Beginner's Guide 2025`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">What is Inventory Management?</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Inventory management means ordering, storing, tracking, and controlling stock so you have the right products at the right time without wasting capital on overstock or losing sales from stockouts. Small businesses lose €4,000-8,000 annually when they skip this. Get it right, and you'll prevent stockouts, free up cash, and slash waste.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Here's what actually matters: knowing the four <Link to="/glossary/inventory" className="text-blue-600 hover:underline font-semibold">inventory types</Link> (raw materials, WIP, finished goods, MRO), setting reorder points that account for lead times, maintaining safety stock for unpredictable demand, and tracking turnover ratios. Most retailers get reorder points wrong they set them based on gut feeling, not data. We've seen businesses reduce stockouts by 85% just by calculating reorder points properly.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">The real cost of ignoring this</h3>
              <p className="mt-3 text-base text-blue-900/90">
                A Brussels coffee shop lost €4,800 last year from expired beans and overstock. A fashion boutique tied up €8,500 in slow-moving inventory. These aren't edge cases they're typical for businesses without proper inventory management. Good management prevents these losses. Modern <Link to="/inventory-management-software" className="text-blue-700 hover:underline font-semibold">inventory management software</Link> makes professional practices accessible to small businesses at zero cost.
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
                Actionable steps to implement inventory management without overthinking it. Start with these three, track progress, and expand as you see results.
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
                <p className="mt-3 text-sm leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(step.description) }} />
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
                Track these three metrics monthly. Most businesses see measurable improvements within 90 days when they focus on accuracy, stockout frequency, and turnover.
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
                <p className="mt-3 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(metric.detail) }} />
              </div>
            ))}
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
