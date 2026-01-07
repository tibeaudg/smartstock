import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import {
  CheckCircle,
  Globe,
  Layers,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Zap,
  BarChart3,
  XCircle,
  Smartphone,
  Maximize2
} from "lucide-react";

const topicTitle = "Inventory Management Software for Small Businesses (2026 Guide)";
const canonicalPath = "/inventory-management-software-for-small-businesses";
const metaDescription = "Compare Excel, Zoho, and StockFlow. Discover why StockFlow is the only professional, truly free inventory system for small businesses in 2026.";
const keywords = "inventory management software for small businesses, free inventory software, small business inventory system, stockflow inventory, zoho inventory free, excel inventory management";

const takeaways = [
  "Small businesses lose margin through visibility gaps, not pricing.",
  "Most 'free' SMB tools impose hard caps that penalize growth.",
  "StockFlow provides production-grade features with zero subscription costs."
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": topicTitle,
    "description": metaDescription,
    "author": { "@type": "Organization", name: "StockFlow Systems" },
    "datePublished": "2026-01-06",
  },
];

const comparisonData = [
  { feature: "Base Cost", excel: "Included", zoho: "Free (Limited)", stockflow: "Free" },
  { feature: "SKU/Order Caps", excel: "Unlimited", zoho: "Strict Limits", stockflow: "Unlimited" },
  { feature: "Barcode Scanning", excel: "Manual/No", zoho: "Paid Tiers", stockflow: "Included" },
  { feature: "Audit Trails", excel: "None", zoho: "Basic", stockflow: "Comprehensive" },
  { feature: "Multi-User Sync", excel: "Fragile", zoho: "Paid Tiers", stockflow: "Native" },
];

export default function SeoInventorySoftwareSmallBusinessPage() {
  usePageRefresh();

  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle={topicTitle}
      updatedDate="January 6, 2026"
      keyTakeaways={takeaways}
    >
      <SEO title={`${topicTitle} | StockFlow`} description={metaDescription} keywords={keywords} canonical={canonicalPath} />
      <StructuredData data={structuredData} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-green-500 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-300 ring-1 ring-inset ring-blue-500/30">
            <Globe className="h-4 w-4" /> 2026 INDUSTRY REPORT
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Inventory Management for <span className="text-blue-400">Small Businesses</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Stop paying growth taxes. Transition from fragile spreadsheets to professional automation without the enterprise price tag.
          </p>
        </div>
      </section>

      {/* CRITICAL COMPARISON TABLE */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">Market Comparison: Small Business Viability</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Excel</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Zoho (Free)</th>
                  <th className="px-6 py-4 font-semibold text-blue-600 font-bold">StockFlow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{row.feature}</td>
                    <td className="px-6 py-4 text-slate-600">{row.excel}</td>
                    <td className="px-6 py-4 text-slate-600">{row.zoho}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 bg-blue-50/30">{row.stockflow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CORE ANALYSIS: THE COST OF "FREE" */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">The "Free" Software Trap</h2>
              <p className="mt-6 text-lg text-slate-700 leading-relaxed">
                Legacy providers use "Free" tiers as a high-friction funnel. These plans are designed to fail exactly when your business succeeds. SKU limits and order caps act as a tax on your growth.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-slate-700 font-medium">Zoho: Caps orders monthly, forcing upgrades during peak seasons.</p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-slate-700 font-medium">Sortly: Locks barcode scanning and multi-user access behind paywalls.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <ShieldCheck className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">StockFlow's Paradigm</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                StockFlow is architected for production, not promotion. We provide enterprise-grade primitives—barcode logic, multi-location support, and full audit trails—permanently free. No hidden thresholds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SUPERIORITY OVER EXCEL */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Why Small Businesses Must Evolve Beyond Excel</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Real-time Sync", desc: "Excel creates data silos. StockFlow ensures every device sees the same stock levels instantly." },
              { icon: Smartphone, title: "Mobile Ready", desc: "Turn any smartphone into a professional barcode scanner. No manual data entry." },
              { icon: Maximize2, title: "Scalability", desc: "Handle 10,000+ SKUs with the same speed as 10. No fragile formulas or cell errors." }
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-6">
                <item.icon className="mb-4 h-8 w-8 text-blue-600" />
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL DIRECTIVE */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Modernize Your Inventory Today</h2>
          <p className="mt-4 text-xl text-blue-100">
            Professional stock control shouldn't be a liability. Join thousands of small businesses operating on StockFlow.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-lg hover:bg-blue-50">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}