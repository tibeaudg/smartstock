import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { useState } from 'react';
import VideoModal from '@/components/VideoModal';
import {
  ArrowRight,
  ExternalLink,
  BarChart3,
  Users,
  Factory,
  ClipboardList,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';


const competitors = [
  {
    name: 'Zoho Inventory (Standard)',
    price: '$39/mo billed monthly or $29/mo billed annually',
    bestFor: 'SMBs already using the Zoho finance stack',
    highlight:
      'Core plan with optional add-ons for extra users, higher order volumes, additional locations, advanced autoscans, and warehousing.',
    source: 'https://www.zoho.com/inventory/pricing/',
  },
  {
    name: 'Cin7 Core (Standard)',
    price: '$349/mo',
    bestFor: 'Multi-channel brands launching structured warehouse processes',
    highlight:
      'Includes the Standard Warehouse Management mobile app (single location) with advanced automation and assembly manufacturing available as add-ons.',
    source: 'https://www.cin7.com/pricing/',
  },
  {
    name: 'Fishbowl Inventory (Essentials)',
    price: '$199/mo (USD)',
    bestFor: 'Product companies that need manufacturing-friendly workflows',
    highlight:
      'Essentials plan bundles inventory tracking, item and SKU management, and cycle counts; higher tiers add fulfillment, AI reporting, and forecasting.',
    source: 'https://www.fishbowlinventory.com/pricing',
  },
];

const differentiators = [
  {
    icon: BarChart3,
    title: 'Forecasting without the spreadsheets',
    description:
      'Generate demand scenarios, safety stock recommendations, and reorder points across every SKU without jumping between BI tools.',
  },
  {
    icon: Users,
    title: 'Operator-first UX',
    description:
      'Floor-ready mobile flows, barcode support, and guardrails keep fast-moving teams on process with fewer clicks and less training.',
  },
  {
    icon: Factory,
    title: 'Hybrid fulfillment',
    description:
      'Natively orchestrate 3PL, in-house, dark-store, and marketplace fulfillment from one control tower instead of stitching separate modules together.',
  },
  {
    icon: ClipboardList,
    title: 'Compliance baked in',
    description:
      'Lot, batch, and serial traceability with recall-ready documentation meets the record-keeping requirements for food, health, and electronics verticals.',
  },
];

const evaluationChecklist = [
  'Confirm the vendor’s pricing model covers your projected order volume, locations, and integrations for at least 18 months.',
  'Validate native workflows with frontline users—especially pick/pack and cycle counting—before you map automations.',
  'Audit how forecasts, replenishment, and purchasing talk to your ERP or accounting system to prevent double work.',
  'Ask for a realistic implementation timeline, including data migration, testing, and user onboarding milestones.',
  'Review support SLAs, change request policies, and roadmap transparency so you’re not surprised after go-live.',
];

export default function CompareInventorySoftware() {
  usePageRefresh();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);



  const faqData = [
    {
      question: "How do I compare inventory software options?",
      answer: "To compare inventory software, evaluate features like real-time tracking, barcode scanning, multi-location support, pricing, integrations, ease of use, and customer support. Create a checklist of must-have features. StockFlow is completely free forever, so you can test it without any commitment."
    },
    {
      question: "What should I look for when comparing inventory management software?",
      answer: "Key factors include pricing transparency, scalability, integration capabilities, mobile access, reporting features, user-friendliness, and customer support quality. Consider your current and future business needs when making comparisons."
    },
    {
      question: "Are there free inventory software options to compare?",
      answer: "StockFlow is completely free forever with unlimited products and all features included. No credit card required, no subscriptions, no hidden fees. You can use it forever without any payment."
    },
    {
      question: "How do pricing models differ between inventory software?",
      answer: "Pricing models vary: some charge per user, others per location or product count, and some offer flat monthly rates. Compare total costs including setup fees, training costs, and any additional charges for integrations or advanced features."
    },
    {
      question: "Can I switch inventory software if I'm not satisfied?",
      answer: "Yes, but switching can be time-consuming. That's why it's important to thoroughly compare options. StockFlow is completely free forever, so you can test it without any commitment. Look for software with good data export capabilities to make future migrations easier."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Compare Inventory Software 2025 - Complete Buyer's Guide",
    description: "Compare top inventory management software 2025. Side-by-side feature comparison, pricing, integrations. Save 50-90% costs vs competitors, free plan available.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Inventory Management Software",
      description: "Compare top inventory management software 2025. StockFlow is completely free forever - save 100% costs vs competitors.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      url: location.pathname,
      features: [
        "Real-time inventory tracking",
        "Barcode scanning",
        "Multi-location support",
        "Automated reordering",
        "Advanced analytics",
        "Free forever plan"
      ],
      image: "https://www.stockflowsystems.com/Inventory-Management.png"
    },
    pageType: 'software',
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split('T')[0],
    includeWebSite: false
  });

  return (
    <SeoPageLayout 
      title="Compare Inventory Software"
      heroTitle="Compare Inventory Software"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Compare Inventory Software 2025 - Save 50-90% Costs, Free Plan | StockFlow"
        description="Compare top inventory management software 2025. Side-by-side feature comparison, pricing, integrations. StockFlow is free forever - save 100% vs competitors."
        keywords="compare inventory software, inventory software comparison, best inventory management software, inventory software pricing, compare inventory systems, inventory software features, best inventory software 2025"
        url="https://www.stockflowsystems.com/compare-inventory-software"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              2025 Inventory Management Buyer’s Guide
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Compare Inventory Software and choose the platform that scales with you
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              We did the legwork on real pricing and packaged capabilities from leading systems—so you can benchmark
              against StockFlow, shortlist faster, and avoid costly mismatches.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Talk to an expert
              </button>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Free for up to 30 products
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Onboarded in weeks, not quarters
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl opacity-60" />
            <img
              src="/Inventory-Management.png"
              alt="Inventory software comparison dashboard"
              className="relative rounded-3xl shadow-2xl border border-blue-100"
            />
          </div>
        </div>
      </section>




      {/* Competitor snapshot */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                How top inventory platforms price and position themselves
              </h2>
              <p className="mt-3 text-slate-600">
                Use the table as a fact-based starting point. Every team’s process looks different—validate the details
                with vendors before you commit budget or timelines.
              </p>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              See StockFlow pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Platform & plan
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Entry pricing (USD)
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ideal profile
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notable capabilities
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {competitors.map((competitor) => (
                  <tr key={competitor.name} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">{competitor.name}</div>
                    </td>
                    <td className="px-6 py-5 text-slate-800 whitespace-pre-line">{competitor.price}</td>
                    <td className="px-6 py-5 text-slate-700">{competitor.bestFor}</td>
                    <td className="px-6 py-5 text-slate-700">{competitor.highlight}</td>
                    <td className="px-6 py-5">
                      <a
                        href={competitor.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Pricing captured November 2025. Always confirm currency, billing cadence, and add-on fees with the vendor.
          </p>
        </div>
      </section>

      {/* StockFlow differentiators */}
      <section className="py-20 px-4 bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">Where StockFlow delivers more leverage</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Modern omnichannel operators need forecasting, fulfillment, and compliance to talk to each other. We
              built StockFlow so planners, buyers, and floor teams stay aligned without duct-taping spreadsheets to your
              ERP.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition"
              >
                <item.icon className="w-10 h-10 text-blue-400" />
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation checklist */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
            Inventory platform evaluation checklist
          </h2>
          <p className="mt-3 text-slate-600 text-center">
            Use these prompts during discovery calls and proof-of-concept sessions to surface gaps before contracts are
            signed.
          </p>
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">
            <ul className="space-y-4">
              {evaluationChecklist.map((item) => (
                <li key={item} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to see StockFlow handle your edge cases?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Bring a messy SKU catalog, multi-location fulfillment, or supplier constraints—we’ll map it in a live
            workspace so you can compare results against your current stack.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Book a tailored walkthrough
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/customer-stories"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Explore customer stories
            </Link>
          </div>
        </div>
      </section>
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </SeoPageLayout>
  );
}

