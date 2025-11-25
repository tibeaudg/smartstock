import React from 'react';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
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

const faqData = [
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
  {
    question: 'What is supplier management software?',
    answer:
      'Supplier management software helps businesses centralize vendor information, automate purchasing workflows, track supplier performance, and streamline procurement processes. It enables better supplier relationships and reduces procurement costs.'
  }
];

export default function SuppliersSolutionPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Supplier Management Software - Complete Guide 2025',
      description: 'Complete guide to supplier management software. Learn how to centralize vendor information, automate purchasing workflows, and track supplier performance. Discover unified supplier directories and procurement automation.',
      image: 'https://www.stockflow.be/supplier-management.png',
      author: {
        '@type': 'Organization',
        name: 'StockFlow'
      },
      publisher: {
        '@type': 'Organization',
        name: 'StockFlow',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.stockflow.be/logo.png'
        }
      },
      datePublished: '2025-11-25',
      dateModified: '2025-11-25',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.stockflow.be/solutions/suppliers'
      },
      keywords: 'supplier management software, vendor management, procurement automation'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    },
    {
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
    }
  ];

  return (
    <SeoPageLayout 
      title="Suppliers"
      heroTitle="Suppliers"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Supplier Management Software 2025 | Vendor Management Platform | StockFlow"
        description="Centralize supplier data, automate purchasing workflows, and track vendor performance. Unified supplier directory, automated reordering, and real-time analytics. Start free."
        keywords="supplier management software, vendor management, purchase order automation, supplier portal, procurement workflow, supplier tracking, vendor relationship management, supplier performance, supplier management system, vendor management software, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/suppliers"
        structuredData={structuredData}
      />

      {/* What is Supplier Management Software Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Supplier Management Software</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Supplier management software helps businesses centralize vendor information, automate purchasing workflows, track supplier performance, and streamline procurement processes. It enables better supplier relationships and reduces procurement costs by providing a unified platform for managing all supplier-related operations. Modern supplier management software integrates seamlessly with inventory systems to create efficient supply chain operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Centralized Supplier Directory</h3>
              <p className="text-gray-700 mb-4">
                Supplier management software maintains a comprehensive directory of all vendors, including contact information, payment terms, delivery schedules, and product catalogs. This centralized approach eliminates the need to search through emails, spreadsheets, or paper files to find supplier information. All vendor data is organized, searchable, and accessible from a single platform.
              </p>
              <p className="text-gray-700">
                The software integrates with <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:text-blue-800 underline">inventory management software</Link> solutions, ensuring that supplier data flows automatically into purchasing and inventory systems. This integration enables automated reordering based on stock levels and supplier performance metrics.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Automated Purchasing Workflows</h3>
              <p className="text-gray-700 mb-4">
                Modern supplier management software automates purchasing workflows, converting low-stock alerts into purchase orders automatically. The system pre-fills purchase orders with negotiated pricing, delivery terms, and lead times, reducing manual data entry and ensuring consistency. <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:text-blue-800 underline">Mobile inventory management</Link> capabilities allow purchasing teams to approve and manage orders from anywhere.
              </p>
              <p className="text-gray-700">
                Integration with <Link to="/solutions/online-inventory-management" className="text-blue-600 hover:text-blue-800 underline">online inventory management</Link> systems ensures that purchase orders are automatically synchronized with inventory levels, maintaining accurate stock records and preventing stockouts.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">How Supplier Management Software Transforms Procurement</h3>
            <p className="text-gray-700 mb-4">
              Supplier management software transforms procurement operations by providing real-time visibility into supplier performance, automating routine purchasing tasks, and enabling data-driven decision-making. Instead of managing supplier relationships through emails and spreadsheets, businesses can use a unified platform that tracks all supplier interactions and performance metrics.
            </p>
            <p className="text-gray-700 mb-4">
              The software tracks key performance indicators like on-time delivery rates, fulfillment accuracy, and cost trends, enabling businesses to identify top-performing suppliers and opportunities for improvement. This performance tracking helps businesses negotiate better terms and build stronger supplier relationships.
            </p>
            <p className="text-gray-700 mb-6">
              Integration with <Link to="/solutions/inventory-software-management" className="text-blue-600 hover:text-blue-800 underline">inventory software management</Link> platforms ensures that supplier data is synchronized with inventory operations, creating a seamless flow from supplier selection to inventory receipt. This integration eliminates data silos and ensures consistency across all procurement and inventory processes.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Key Features of Supplier Management Software</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Supplier Directory</h4>
                  <p className="text-gray-700">Centralized database of all suppliers with complete profiles, contact information, contracts, and performance history.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Purchase Order Automation</h4>
                  <p className="text-gray-700">Automated generation of purchase orders based on inventory levels, with pre-filled supplier information and negotiated pricing.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Performance Tracking</h4>
                  <p className="text-gray-700">Real-time monitoring of supplier performance metrics including on-time delivery, fulfillment accuracy, and cost trends.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Collaboration Tools</h4>
                  <p className="text-gray-700">Secure portals and communication tools that enable collaboration with suppliers while maintaining data security. Integration with <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:text-blue-800 underline">inventory management software solutions</Link> enhances collaboration capabilities.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Why Businesses Choose Supplier Management Software</h3>
              <p className="text-gray-700 mb-4">
                Businesses implement supplier management software to streamline procurement operations, reduce costs, and improve supplier relationships. The centralized supplier directory eliminates time spent searching for vendor information, while automated workflows reduce manual data entry and errors. Performance tracking enables businesses to make informed decisions about supplier selection and negotiation.
              </p>
              <p className="text-gray-700">
                The integration capabilities of supplier management software ensure that supplier data flows seamlessly into inventory and accounting systems, maintaining consistency and eliminating duplicate data entry. This integration creates a unified view of the entire supply chain, from supplier selection to customer delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}

