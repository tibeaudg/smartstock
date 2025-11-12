import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Factory,
  Gauge,
  Layers,
  Shield,
  Star,
  Workflow
} from 'lucide-react';

const comparisonRows = [
  {
    title: 'Who It’s Built For',
    stockflow: 'Operations teams that need real-time visibility across purchasing, stock and fulfilment. Ideal for SMEs scaling ecommerce, retail or light manufacturing.',
    competitor: 'Katana focuses on manufacturers that need production scheduling and shop-floor control. Less emphasis on downstream distribution and retail workflows.'
  },
  {
    title: 'Implementation Speed',
    stockflow: 'Launch in days with ready-to-use templates, guided onboarding and EU-based support.',
    competitor: 'Implementation often requires consultant support to configure production routing and shop-floor features.'
  },
  {
    title: 'Automation',
    stockflow: 'Automate replenishment, approvals, notifications and supplier collaboration without extra modules.',
    competitor: 'Automation is available but often tied to manufacturing-specific flows or paid add-ons.'
  },
  {
    title: 'Integrations',
    stockflow: 'Connect ecommerce, POS, accounting and logistics tools (Shopify, WooCommerce, Exact, Stripe, etc.).',
    competitor: 'Strong ERP and accounting connectors, but fewer native retail and POS integrations for omnichannel teams.'
  },
  {
    title: 'Pricing',
    stockflow: 'Free plan to start, predictable tiered pricing without user limits, designed for scaling SMEs.',
    competitor: 'Pricing increases with sales orders and shop-floor operators, which can become costly as production grows.'
  }
];

export default function StockflowVsKatana() {
  usePageRefresh();

  return (
    <SeoPageLayout title="StockFlow vs Katana">
      <SEO
        title="StockFlow vs Katana | Inventory & Operations Comparison"
        description="See how StockFlow compares with Katana. Discover which platform delivers faster implementation, automation and scalability for modern SMEs."
        keywords="stockflow vs katana, katana alternative, katana inventory comparison, stockflow comparison"
        url="https://www.stockflow.be/stockflow-vs-katana"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                StockFlow vs Katana{' '}
                <span className="text-blue-600">Which Supports Your Expansion?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Katana focuses on shop-floor scheduling. StockFlow unifies inventory, procurement and fulfilment for teams managing multiple sales channels. Compare the strengths of each platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Try StockFlow Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Compare Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ teams modernise operations with StockFlow</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="StockFlow vs Katana comparison"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            StockFlow vs Katana: Feature Breakdown
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Capability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Katana</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {comparisonRows.map((row, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{row.title}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.stockflow}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SMEs Pick StockFlow</h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow puts inventory, procurement, manufacturing light-assembly and fulfilment on a single platform. Automations, approvals and analytics work across every channel you sell through.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Intuitive UI lets teams adopt StockFlow without intensive training.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Automate purchase orders, safety stock and supplier collaboration.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Gain omnichannel visibility, from ecommerce to wholesale and retail.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>EU-based hosting, GDPR compliance and multilingual support teams.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">StockFlow at a glance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementation</p>
                <p className="text-xl font-semibold">2-3 week rollout</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Automation Impact</p>
                <p className="text-xl font-semibold">70% manual tasks removed</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Workflow className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Workflows</p>
                <p className="text-xl font-semibold">Custom approvals & alerts</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Integrations</p>
                <p className="text-xl font-semibold">Shopify, Exact, POS & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">When Katana Is a Better Fit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Factory className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Deep Shop-Floor Control</h3>
              <p className="text-gray-600">
                If you require advanced production scheduling, routing and shop-floor terminals, Katana may suit complex manufacturing operations better.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Layers className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Engineer-to-Order Processes</h3>
              <p className="text-gray-600">
                Katana provides strong BOM versioning and production planning for engineer-to-order businesses. StockFlow focuses on standard, make-to-stock workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See StockFlow in Action</h2>
          <p className="text-xl mb-8 opacity-90">
            Replace fragmented spreadsheets with a connected operations platform. Start free, explore automations and invite your team when ready.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}


