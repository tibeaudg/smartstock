import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb } from "lucide-react";

const topicTitle = "What Is Demand Forecasting";
const canonicalPath = "/blog/what-is-demand-forecasting";
const metaDescription = "Deep dive into What Is Demand Forecasting. Learn practical ideas, implementation steps, and metrics so your team can apply What Is Demand Forecasting with StockFlow.";
const keywords = "What Is Demand Forecasting, What Is Demand Forecasting guide, What Is Demand Forecasting best practices, What Is Demand Forecasting StockFlow, inventory management, operations playbook";
const heroBadge = "Topic Guide • Updated September 2025";
const summaryCopy = "Explore What Is Demand Forecasting through the lens of modern inventory and operations leadership. This StockFlow-exclusive guide synthesizes the best lessons from the original Sortly article and translates them into actionable steps for teams that need structure, visibility, and measurable wins.";
const takeaways = [
  "Understand the core themes behind What Is Demand Forecasting and why they matter for modern operations teams.",
  "Follow a structured framework to translate What Is Demand Forecasting into day-to-day improvements.",
  "Highlight StockFlow capabilities that make what is demand forecasting sustainable at scale."
];
const actionSteps = [
  {
    "title": "Align on the outcome",
    "description": "Confirm what what is demand forecasting should deliver for customers, finance, and frontline teams."
  },
  {
    "title": "Audit current workflows",
    "description": "Document how what is demand forecasting happens today, where gaps exist, and which systems hold the data."
  },
  {
    "title": "Launch targeted improvements",
    "description": "Prototype a lean version of what is demand forecasting inside StockFlow, measure the impact, and expand in sprints."
  }
];
const metrics = [
  {
    "label": "Execution velocity",
    "detail": "Track how quickly what is demand forecasting initiatives move from idea to rollout."
  },
  {
    "label": "Team adoption",
    "detail": "Measure participation rates in the new what is demand forecasting process across locations or departments."
  },
  {
    "label": "Quality & accuracy",
    "detail": "Monitor error rates, rework, or data accuracy tied to what is demand forecasting workflows."
  }
];
const faqData = [
  {
    "question": "What is What Is Demand Forecasting?",
    "answer": "What Is Demand Forecasting refers to the practices, insights, or stories captured in the original Sortly blog article. This guide reframes the topic for StockFlow users who want to move faster, stay organized, and build resilient inventory operations."
  },
  {
    "question": "How can I get started with what is demand forecasting?",
    "answer": "Start by clarifying the objective, mapping the stakeholders, and collecting baseline metrics. Use the action playbook in this article to pilot what is demand forecasting within one team, then expand once you capture early wins."
  },
  {
    "question": "Where does StockFlow add value for what is demand forecasting?",
    "answer": "StockFlow centralizes data, automates alerts, and connects cross-functional teams. That means fewer spreadsheets, faster decisions, and the ability to prove the value of what is demand forecasting with real-time dashboards."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Demand Forecasting",
    "description": "Deep dive into What Is Demand Forecasting. Learn practical ideas, implementation steps, and metrics so your team can apply What Is Demand Forecasting with StockFlow.",
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
    "datePublished": "2025-09-26",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflow.be/blog/what-is-demand-forecasting"
    }
  }
];

export default function SeoWhatIsDemandForecastingPage() {
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
    <SeoPageLayout title={topicTitle} showSidebar sidebarContent={sidebarContent}>
      <SEO
        title={`${topicTitle} | StockFlow Guide`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflow.be${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-white px-6 py-12 shadow-xl sm:px-12">
            <div className="text-center">
              <div className="mb-6 inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                {heroBadge}
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                {topicTitle}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl">{summaryCopy}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#overview"
                  className="inline-flex items-center rounded-xl border border-blue-200 px-6 py-3 text-base font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Jump to Overview
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{topicTitle} in Context</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              {topicTitle} has become a recurring talking point for fast-moving inventory teams. The original Sortly blog
              article sparked interest because it addresses real-world frictions that leaders face every day. This updated guide
              distills those takeaways for StockFlow customers—showing you how to adapt the narrative, build alignment across
              departments, and secure measurable results without adding administrative overhead.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
              <h3 className="text-xl font-semibold">Why it matters now</h3>
              <p className="mt-3 text-base text-blue-900/90">
                Every economic cycle pressures teams to do more with less. {topicTitle} gives you language, tactics, or inspiration
                to modernize inventory, supply chain, and asset management workflows so they scale with confidence.
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
                  Centralize item masters, stock movements, suppliers, and documents so what is demand forecasting decisions never rely on outdated spreadsheets.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Automation & alerts</h3>
                <p className="mt-3 text-sm text-white/85">
                  Trigger workflows, approvals, and reorder points when what is demand forecasting KPIs drift from plan.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Collaboration built in</h3>
                <p className="mt-3 text-sm text-white/85">
                  Give finance, operations, and frontline teams a shared system of record for what is demand forecasting progress.
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
                <p className="mt-3 text-base leading-relaxed text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-20 pt-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-gradient-to-r from-blue-50 via-white to-purple-50 p-10 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Put {topicTitle} into action with StockFlow</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
            Launch faster experiments, share instant dashboards, and keep every stakeholder aligned. Your first workspace
            is live in minutes, and you can invite teammates for free.
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
    </SeoPageLayout>
  );
}
