import React from 'react';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Users,
  ShieldCheck,
  Workflow,
  BarChart3,
  Building2,
  RefreshCcw,
  Globe,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const heroHighlights = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Unified supplier directory',
    description: 'Keep every vendor profile, contract, and contact centralized and searchable.',
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: 'Automated purchasing workflows',
    description: 'Trigger smart replenishment, approvals, and notifications based on live stock levels.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Real-time performance analytics',
    description: 'Track on-time delivery, cost trends, and fill rate across every supplier at a glance.',
  },
];

const advantages = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Accurate supplier records',
    description:
      'Enforce complete profiles with required fields, attachments, and custom tags so teams always work from the latest data.',
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: 'Streamlined reordering',
    description:
      'Convert low-stock alerts into purchase orders in one click, pre-filled with negotiated pricing, delivery terms, and lead times.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Cross-team collaboration',
    description:
      'Share visibility between operations, finance, and procurement with permissions that keep sensitive data protected.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global supplier coverage',
    description:
      'Manage domestic and international vendors, compliance documents, and multi-currency pricing in the same workspace.',
  },
];

const metrics = [
  {
    value: '35%',
    label: 'Faster supplier onboarding',
    description: 'Collect complete information with guided forms and reusable templates.',
  },
  {
    value: '40%',
    label: 'Reduction in stockouts',
    description: 'Automated reorder points keep essential items available when you need them.',
  },
  {
    value: '99.5%',
    label: 'Data accuracy',
    description: 'Audit trails and validation rules keep supplier data clean across teams.',
  },
];

const faqItems = [
  {
    question: 'Can StockFlow import my existing supplier list?',
    answer:
      'Yes. Upload spreadsheets or connect your ERP to bring in vendors, contact details, payment terms, and products in minutes. Our onboarding team helps you map data accurately.',
  },
  {
    question: 'How does supplier performance tracking work?',
    answer:
      'StockFlow monitors on-time deliveries, fulfillment accuracy, and cost changes automatically. Dashboards highlight at-risk vendors and opportunities for negotiation.',
  },
  {
    question: 'Is it possible to collaborate with suppliers directly?',
    answer:
      'You can share purchase orders, delivery schedules, and shipment updates with suppliers via secure portals and email automation—no extra logins required for them.',
  },
  {
    question: 'Do you support multi-location purchasing teams?',
    answer:
      'Absolutely. Assign suppliers to specific branches, restrict access with roles, and roll up purchasing insights across every location in real time.',
  },
];

export default function SuppliersSolutionPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StockFlow Supplier Management',
    description:
      'StockFlow centralizes supplier data, automates purchasing workflows, and tracks vendor performance for modern inventory teams.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: ['iOS', 'Android', 'macOS', 'Windows'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    featureList: heroHighlights.map(highlight => highlight.title),
    url: 'https://www.stockflow.be/suppliers',
    publisher: {
      '@type': 'Organization',
      name: 'StockFlow',
      url: 'https://www.stockflow.be',
    },
  };

  return (
    <SeoPageLayout title="Suppliers">
      <SEO
        title="Suppliers 2025 - Suppliers 2025 -"
        description="Discover how suppliers to optimize your inventory management. Read the guide suppliers to automate your processes. Simplify vendor. Start free today. StockFl..."
        keywords="supplier management software, vendor management, purchase order automation, supplier portal, procurement workflow"
        url="https://www.stockflow.be/suppliers"
        structuredData={structuredData}
      />

      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-white/10 text-white">Supplier Management</Badge>
            <h1 className="text-4xl font-bold md:text-5xl">
              Build a resilient supplier network with StockFlow
            </h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Replace spreadsheets with a unified system for sourcing, purchasing, and monitoring every
              vendor. StockFlow keeps suppliers accountable while saving teams hours every week.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="https://app.stockflow.be/auth?mode=register" target="_blank" rel="noopener noreferrer">
                  Start managing suppliers
                </a>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <a href="https://cal.com/stockflow/demo" target="_blank" rel="noopener noreferrer">
                  Book a demo
                </a>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map(feature => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30"
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-white" />
                <p className="text-sm uppercase tracking-wide text-blue-100">Trusted by modern operations teams</p>
              </div>
              <ul className="space-y-3 text-blue-50">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-1 h-4 w-4" />
                  <span>Pre-built supplier scoring, delivery KPIs, and contract reminders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-1 h-4 w-4" />
                  <span>Direct integrations with StockFlow inventory, purchasing, and analytics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-1 h-4 w-4" />
                  <span>Configurable approvals and audit trails for every change.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
              Everything you need for supplier lifecycle management
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              StockFlow helps fast-growing teams source better vendors, automate purchasing processes, and
              build transparency across the entire supply chain.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {advantages.map(advantage => (
              <div key={advantage.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{advantage.title}</h3>
                <p className="mt-2 text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {metrics.map(metric => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-4xl font-bold text-blue-200">{metric.value}</div>
                <div className="mt-2 text-lg font-semibold">{metric.label}</div>
                <p className="mt-2 text-sm text-blue-100">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">Supplier management FAQs</h2>
          <div className="mt-10 space-y-6">
            {faqItems.map(item => (
              <details
                key={item.question}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                  {item.question}
                  <ChevronRight className="h-5 w-5 transition group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to modernize supplier management?</h2>
          <p className="text-lg text-blue-100">
            Launch StockFlow for free, invite your team, and centralize every vendor relationship in one secure
            workspace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <a href="https://app.stockflow.be/auth?mode=register" target="_blank" rel="noopener noreferrer">
                Get started free
              </a>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="https://cal.com/stockflow/demo" target="_blank" rel="noopener noreferrer">
                Talk to sales
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

