import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

const faqData = [
  {
    question: 'What does an inventory management provider do?',
    answer: 'An inventory management provider delivers the software, onboarding, and strategic guidance needed to control stock levels, automate purchasing, and connect sales channels. Providers like StockFlow combine technology with expert support to shorten implementation time and deliver measurable ROI.'
  },
  {
    question: 'How do I choose the right inventory management provider?',
    answer: 'Evaluate providers on reliability, onboarding speed, integrations, pricing transparency, and ongoing support. Schedule a demo, ask about migration assistance, and look for case studies in industries similar to yours.'
  },
  {
    question: 'Does StockFlow support multi-location businesses?',
    answer: 'Yes. StockFlow was built for scaling brands with multiple warehouses or stores. Real-time dashboards, barcode workflows, and mobile apps keep every location aligned.'
  },
  {
    question: 'How quickly can we go live with StockFlow?',
    answer: 'Most teams launch in 7-14 days thanks to guided onboarding, data import templates, and pre-built workflows for purchasing, fulfillment, and counting.'
  },
  {
    question: 'Is there a free plan available?',
    answer: 'StockFlow offers a free forever plan for up to 30 products so you can experience the platform before upgrading to advanced automation.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Inventory Management Provider | StockFlow',
  url: 'https://www.stockflow.be/inventory-management-provider',
  description:
    'StockFlow is the inventory management provider for SMEs that need fast implementation, barcode workflows, and real-time analytics. Start free today.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be/', position: 1 },
    { name: 'Inventory Management Provider', url: 'https://www.stockflow.be/inventory-management-provider', position: 2 }
  ],
  faqData,
  softwareData: {
    name: 'StockFlow Inventory Management Provider',
    description:
      'Implementation, onboarding, and ongoing support for inventory management software tailored to retailers, wholesalers, and manufacturers.',
    category: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: {
      value: '4.8',
      count: '127'
    },
    features: [
      'Onboarding and training',
      'Barcode and mobile workflows',
      'Multi-location inventory',
      'Analytics dashboards',
      'Supplier and purchase order automation'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/inventory-management-provider'
  }
});

export default function InventoryManagementProviderPage() {
  usePageRefresh();

  return (
    <SeoPageLayout title="Inventory Management Provider">
      <SEO
        title="Inventory Management Provider 2025 | StockFlow"
        description="Meet StockFlow, the inventory management provider trusted by growing brands. Guided onboarding, barcode automation, analytics & integrations. Launch in 14 days – start free."
        keywords="inventory management provider, inventory software provider, cloud inventory provider, stock management provider, inventory management service, inventory system provider, inventory software partner, stockflow"
        url="https://www.stockflow.be/inventory-management-provider"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="bg-blue-50 rounded-3xl px-6 sm:px-10 py-12 shadow-sm">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center max-w-6xl mx-auto">
          <div>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-blue-600 bg-white/80 px-3 py-1 rounded-full">
              🔍 Inventory Management Provider
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
              StockFlow: The Inventory Management Provider for Ambitious Teams
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-5 leading-relaxed max-w-2xl">
              Replace disconnected spreadsheets with a cloud platform built for fulfilment, purchasing, and analytics. StockFlow delivers inventory management software, barcode workflows, and hands-on experts so you hit value in weeks, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-center"
              >
                Start Free Today
              </Link>
              <Link
                to="/demo"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg text-center"
              >
                Book a Provider Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">No credit card • Guided onboarding • Belgian support</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-gray-800">Why teams switch to StockFlow</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>✅ Barcode & mobile apps included</li>
              <li>✅ Integrations with Shopify, Exact, and WooCommerce</li>
              <li>✅ Dashboards for finance, operations, and sales</li>
              <li>✅ Dedicated onboarding manager</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Provider Value */}
      <section className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            A Strategic Inventory Management Provider – Not Just Software
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Choosing the right <strong>inventory management provider</strong> means partnering with a team that understands forecasting, procurement, warehouse flows, and data migration. StockFlow blends technology with expert services so your KPIs improve fast.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Implementation Sprint</h3>
              <p className="text-sm text-gray-600 mt-2">Migration templates, barcode set-up, and training sessions tailored to your industry so teams adopt StockFlow quickly.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Automation Playbooks</h3>
              <p className="text-sm text-gray-600 mt-2">We configure purchase planning, cycle counts, and reorder rules that mirror your demand curve.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Executive Dashboards</h3>
              <p className="text-sm text-gray-600 mt-2">Monitor gross margin, dead stock, and supplier performance in one platform.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Local Support Team</h3>
              <p className="text-sm text-gray-600 mt-2">Belgian and Dutch support specialists respond within minutes when you need help.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-800">Provider Checklist</h3>
          <p className="text-sm text-gray-600 mt-3">Score each potential provider on the essentials:</p>
          <ul className="mt-5 space-y-3 text-sm text-gray-700">
            <li>• Roadmap for going live inside 30 days</li>
            <li>• Barcode and mobile scanning availability</li>
            <li>• Integrations with your ERP, accounting, and sales channels</li>
            <li>• Local language support & SLA-backed response times</li>
            <li>• Transparent pricing that scales with your catalogue</li>
          </ul>
          <Link
            to="/contact"
            className="inline-flex mt-6 text-blue-600 font-semibold hover:underline"
          >
            Download the full provider checklist →
          </Link>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="max-w-6xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Proven Results with StockFlow as Your Provider
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl font-extrabold text-blue-600">-35%</p>
            <p className="text-sm text-gray-600">Average reduction in holding costs within 90 days</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">+18%</p>
            <p className="text-sm text-gray-600">Increase in perfect order rate after implementing barcode workflows</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">7 days</p>
            <p className="text-sm text-gray-600">Median time to import SKUs and go live for SMB teams</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">24/5</p>
            <p className="text-sm text-gray-600">Regional support coverage in Dutch, English, and French</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto mt-16 bg-blue-600 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold">Switch to a proactive inventory management provider</h2>
        <p className="mt-4 text-base sm:text-lg opacity-90">
          Test StockFlow with your own products, invite teammates, and access onboarding specialists the moment you sign up.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/auth" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow">
            Create Free Account
          </Link>
          <Link to="/demo" className="border border-white text-white font-semibold px-6 py-3 rounded-lg">
            Schedule Consultation
          </Link>
        </div>
        <p className="text-xs mt-4 opacity-80">Works on web, iOS, and Android • Secure EU data hosting</p>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">FAQs about Inventory Management Providers</h2>
        <div className="mt-8 space-y-4">
          {faqData.map((item, index) => (
            <details key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">{item.question}</summary>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </SeoPageLayout>
  );
}


