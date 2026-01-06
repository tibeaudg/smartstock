import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { sanitizeBlogContent } from "@/utils/sanitizeHtml";
import {
  CheckCircle,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';

const topicTitle = "What Is Inventory Shrinkage";
const canonicalPath = "/what-is-inventory-shrinkage";
const metaDescription = "Shrinkage costs businesses 1-2% of inventory value annually. Employee theft causes 30% of losses. Here's what causes shrinkage, what it really costs, and how to cut losses by 85%.";
const keywords = "inventory shrinkage, stock shrinkage, inventory loss, inventory theft, reduce shrinkage, inventory accuracy, inventory control, shrinkage prevention, inventory management";
const heroBadge = "Inventory Management Guide • Updated October 2025";
const summaryCopy = "Shrinkage means inventory disappears between your records and physical count. It costs 1-2% of inventory value annually €4,000 on €200,000 inventory. Employee theft causes 30% of losses. Administrative errors cause another 25%. Here's how to cut shrinkage by 85% through barcode scanning, cycle counts, and proper tracking.";
const takeaways = [
  "Inventory shrinkage costs businesses billions annually and typically ranges from 1-2% of total inventory value.",
  "The main causes are employee theft, shoplifting, administrative errors, supplier fraud, and damage.",
  "Implementing barcode scanning, regular cycle counts, and inventory management software can significantly reduce shrinkage."
];
const actionSteps = [
  {
    "title": "Conduct regular inventory audits",
    "description": "Perform cycle counts and physical inventory counts regularly to identify discrepancies early. Use <Link to=\"/cycle-count\" className=\"text-blue-600 hover:underline\">cycle counting</Link> to maintain accuracy without disrupting operations."
  },
  {
    "title": "Implement barcode scanning",
    "description": "Use <Link to=\"/barcode-scanning-inventory\" className=\"text-blue-600 hover:underline\">barcode scanning technology</Link> to eliminate manual entry errors and improve tracking accuracy. Barcode systems reduce human error by up to 99%."
  },
  {
    "title": "Use inventory management software",
    "description": "Deploy <Link to=\"/inventory-management-software\" className=\"text-blue-600 hover:underline\">inventory management software</Link> with real-time tracking, automated alerts, and audit trails to prevent and detect shrinkage."
  }
];
const metrics = [
  {
    "label": "Shrinkage rate",
    "detail": "Track shrinkage as a percentage of total inventory value. Industry average is 1-2%, but best-in-class companies achieve under 0.5%."
  },
  {
    "label": "Inventory accuracy",
    "detail": "Measure the percentage of inventory records that match physical counts. Target 98%+ accuracy through regular audits and automated tracking."
  },
  {
    "label": "Shrinkage by category",
    "detail": "Break down shrinkage by cause (theft, damage, errors) to identify problem areas and focus prevention efforts where they'll have the most impact."
  }
];
const faqData = [
  {
    "question": "What is inventory shrinkage?",
    "answer": "Inventory shrinkage is the loss of inventory between the time it's recorded in your system and when it's physically counted. It's calculated as: Shrinkage = (Recorded Inventory - Physical Inventory) / Recorded Inventory × 100. Shrinkage includes losses from theft, damage, administrative errors, supplier fraud, and obsolescence."
  },
  {
    "question": "What are the main causes of inventory shrinkage?",
    "answer": "The main causes are: (1) Employee theft - internal theft accounts for about 30% of shrinkage, (2) Shoplifting - external theft from retail locations, (3) Administrative errors - data entry mistakes, miscounting, or paperwork errors, (4) Supplier fraud - receiving fewer items than invoiced, and (5) Damage - products damaged during handling, storage, or transit."
  },
  {
    "question": "What is an acceptable inventory shrinkage rate?",
    "answer": "Industry averages vary: retail typically sees 1-2% shrinkage, while best-in-class companies achieve under 0.5%. For most businesses, keeping shrinkage below 1% is a good target. Higher-value items or industries with strict compliance requirements may need even lower rates."
  },
  {
    "question": "How can I reduce inventory shrinkage?",
    "answer": "Reduce shrinkage by implementing barcode scanning for accuracy, conducting regular cycle counts, using inventory management software with real-time tracking, training staff on proper procedures, implementing security measures, and establishing clear accountability. Learn more about <Link to=\"/avoid-inventory-mistakes\" className=\"text-blue-600 hover:underline\">avoiding inventory mistakes</Link>."
  },
  {
    "question": "How does inventory management software help prevent shrinkage?",
    "answer": "Inventory management software prevents shrinkage by providing real-time tracking, automated data entry through barcode scanning, audit trails for all transactions, automated alerts for discrepancies, and detailed reporting to identify patterns. Software like StockFlow helps maintain accurate records and quickly identify when shrinkage occurs."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Inventory Shrinkage? Complete Guide to Understanding and Preventing Inventory Loss",
    "description": "Learn what inventory shrinkage is, its main causes (theft, damage, errors), and proven strategies to reduce shrinkage. Complete guide with prevention tips and best practices.",
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
      "@id": "https://www.stockflowsystems.com/what-is-inventory-shrinkage"
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

export default function SeoWhatIsInventoryShrinkagePage() {
  usePageRefresh();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={topicTitle} 
      updatedDate="06/01/2026"
      faqData={faqData}
       
      
    >
      <SEO
        title={`What Is Inventory Shrinkage? Guide 2025 | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Understanding Inventory Shrinkage</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              <strong>Shrinkage</strong> is the gap between what your records say you have and what's actually on shelves. It costs 1-2% of inventory value annually that's €4,000-8,000 on €400,000 inventory. One retailer discovered €12,000 missing after implementing proper tracking. Employee theft causes 30% of losses. Administrative errors cause 25%. The rest comes from damage, supplier fraud, and shoplifting.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Most businesses don't notice shrinkage until it's significant. Without regular cycle counts and barcode scanning, errors compound. One electronics shop lost €6,500 to shrinkage over six months before realizing it. The impact hits cash flow, profitability, and can signal deeper operational problems. Businesses with proper <Link to="/inventory-control-101" className="text-blue-600 hover:underline font-semibold">inventory control</Link> keep shrinkage under 0.5%.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why it matters now</h3>
              <p className="mt-3 text-base text-blue-900/90">
                With rising costs and economic pressures, every dollar lost to shrinkage directly impacts your bottom line. Modern <Link to="/inventory-management-software" className="text-blue-700 hover:underline font-semibold">inventory management systems</Link> provide the tools and visibility needed to detect, prevent, and reduce shrinkage before it becomes a significant problem.
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
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How to Reduce Inventory Shrinkage</h2>
              <p className="mt-3 text-base text-gray-600">
                Implement these proven strategies to minimize shrinkage and protect your inventory investment. These actionable steps have helped businesses reduce shrinkage by 50-80%.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-blue-700 shadow">
              <Target className="h-4 w-4" />
              Proven Strategies
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
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Additional Prevention Strategies</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Implement security measures like cameras, access controls, and employee training on theft prevention</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Establish clear accountability and authorization processes for inventory movements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Train staff on proper <Link to="/how-to-improve-inventory-control" className="text-blue-600 hover:underline">inventory control</Link> procedures and the importance of accuracy</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Review and reconcile supplier invoices against received goods to catch supplier fraud</span>
              </li>
            </ul>
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
