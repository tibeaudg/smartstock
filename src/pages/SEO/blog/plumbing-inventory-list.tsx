import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "Plumbing Inventory List";
const canonicalPath = "/plumbing-inventory-list";
const metaDescription = "Essential plumbing inventory list template. Learn what items to track, how to organize plumbing supplies, and best practices for managing plumbing inventory for contractors.";
const keywords = "plumbing inventory list, plumbing inventory, plumbing supplies inventory, plumbing parts inventory, contractor inventory, plumbing materials list";
const heroBadge = "Topic Guide • Updated July 2024";
const summaryCopy = "A plumbing inventory list should include: pipes and fittings (PVC, copper, PEX), fixtures (faucets, sinks, toilets), valves and connectors, tools (wrenches, pipe cutters), sealants and adhesives, and common replacement parts. Organize by category (pipes, fittings, fixtures, tools), track quantities, set reorder points for frequently used items, and use inventory management software for contractors. Essential items vary by business type: residential plumbers need common fixtures and fittings, commercial plumbers need larger quantities and specialized items. Mobile inventory tracking helps plumbers track materials across job sites.";
const takeaways = [
  "Essential items include: pipes and fittings (PVC, copper, PEX), fixtures (faucets, sinks, toilets), valves and connectors, tools, sealants, and common replacement parts.",
  "Organize by category (pipes, fittings, fixtures, tools), track quantities, set reorder points for frequently used items, and use inventory management software for contractors.",
  "Mobile inventory tracking helps plumbers track materials across job sites, ensuring they have what they need when they need it."
];
const actionSteps = [
  {
    "title": "Create comprehensive list",
    "description": "List all plumbing items: pipes (PVC, copper, PEX), fittings, fixtures (faucets, sinks, toilets), valves, connectors, tools, sealants, and replacement parts. Organize by category for easy management."
  },
  {
    "title": "Set up tracking system",
    "description": "Use inventory management software designed for contractors. Track quantities, set reorder points for frequently used items, and use mobile apps to track inventory across job sites. This ensures materials are available when needed."
  },
  {
    "title": "Organize and maintain",
    "description": "Organize inventory by category and location. Maintain accurate records, conduct regular counts, and update quantities as items are used. Mobile tracking helps plumbers manage inventory across multiple job sites."
  }
];
const metrics = [
  {
    "label": "Inventory availability",
    "detail": "Measure how often needed items are available when needed. Effective tracking ensures plumbers have materials on hand, reducing delays and improving job completion times."
  },
  {
    "label": "Stockout reduction",
    "detail": "Track reduction in stockouts of frequently used items. Setting appropriate reorder points and maintaining accurate records prevents stockouts that delay jobs."
  },
  {
    "label": "Job site efficiency",
    "detail": "Monitor improvements in job site efficiency from better inventory management. Having the right materials when needed reduces delays, improves customer satisfaction, and increases productivity."
  }
];
const faqData = [
  {
    "question": "What should be on a plumbing inventory list?",
    "answer": "Essential items include: pipes and fittings (PVC, copper, PEX), fixtures (faucets, sinks, toilets), valves and connectors, tools (wrenches, pipe cutters), sealants and adhesives, and common replacement parts. Organize by category and track quantities for each item."
  },
  {
    "question": "How do plumbers track inventory?",
    "answer": "Plumbers track inventory using: inventory management software designed for contractors, mobile apps for tracking across job sites, barcode scanning for quick updates, and organized storage systems. Mobile tracking is essential for plumbers working across multiple job sites."
  },
  {
    "question": "What inventory software is best for plumbers?",
    "answer": "Best software for plumbers: mobile apps for job site tracking, barcode scanning support, multi-location tracking, contractor-specific features, and easy-to-use interface. Software should help plumbers track materials across job sites efficiently."
  },
  {
    "question": "How do you organize plumbing inventory?",
    "answer": "Organize by: category (pipes, fittings, fixtures, tools), size/type, frequency of use, and location. Use clear labeling, maintain organized storage, and track quantities accurately. Good organization makes it easy to find items and maintain accurate records."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Plumbing Inventory List",
    "description": "Deep dive into Plumbing Inventory List. Learn practical ideas, implementation steps, and metrics so your team can apply Plumbing Inventory List with StockFlow.",
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
    "datePublished": "2024-07-09",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/plumbing-inventory-list"
    }
  }
];

export default function SeoPlumbingInventoryListPage() {
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
        title={`Plumbing Inventory List 2025 - Complete Template & Guide | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />



      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Essential Plumbing Inventory List</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Running to the hardware store mid-job costs time and money—we've seen plumbers waste €150+ per day on unnecessary trips. A well-organized plumbing inventory list prevents these delays and keeps jobs moving. The key is tracking the items you actually use, not everything that exists.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              A plumbing inventory list should include: <strong>pipes and fittings</strong> (PVC, copper, PEX in common sizes), <strong>fixtures</strong> (faucets, sinks, toilets for common jobs), <strong>valves and connectors</strong> (standard sizes you use frequently), <strong>tools</strong> (wrenches, pipe cutters, specialized equipment), <strong>sealants and adhesives</strong> (pipe dope, thread tape, PVC cement), and <strong>common replacement parts</strong> (washers, O-rings, connectors).
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Organize by category (pipes, fittings, fixtures, tools), track quantities, set reorder points for frequently used items, and use inventory management software for contractors. Essential items vary by business type: residential plumbers need common fixtures and fittings, commercial plumbers need larger quantities and specialized items. Mobile inventory tracking helps plumbers track materials across job sites, ensuring they have what they need when they need it. Learn more about <Link to="/blog/how-to-store-construction-materials" className="text-blue-600 hover:underline font-semibold">storing construction materials</Link> or explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> for contractors.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why a plumbing inventory list matters</h3>
              <p className="mt-3 text-base text-blue-900/90">
                A well-organized inventory list prevents job delays (no mid-job store trips), saves money (buy in bulk, avoid rush purchases), and improves efficiency (materials ready when needed). Mobile tracking helps plumbers manage inventory across multiple job sites, ensuring materials are available when needed without overstocking.
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
