import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Gauge,
  Layers,
  Shield,
  Star,
  Users
} from 'lucide-react';

const comparisonData = [
  {
    title: 'Modern Operations Platform',
    stockflow:
      'StockFlow combines inventory, purchasing and analytics in one platform built for European SMEs.',
    competitor:
      'TradeGecko (now QuickBooks Commerce) was discontinued for new customers; existing accounts require complex migrations.'
  },
  {
    title: 'Pricing & Availability',
    stockflow:
      'Affordable plans starting at €29/month with a free tier for smaller catalogues, hosted in the EU.',
    competitor:
      'TradeGecko pricing was tied to order volume and user seats. QuickBooks Commerce is no longer available in many regions.'
  },
  {
    title: 'Automation & Integrations',
    stockflow:
      'Automate reordering, approvals and alerts. Integrate Shopify, WooCommerce, Exact, Stripe, POS systems and more.',
    competitor:
      'TradeGecko supported ecommerce integrations but required manual setup and had limited workflow automation.'
  },
  {
    title: 'Support & Localisation',
    stockflow: 'EU-based support, multilingual documentation and VAT-ready workflows.',
    competitor: 'Support focused on North America; limited localisation for Benelux and EU teams.'
  },
  {
    title: 'Migration Path',
    stockflow:
      'Purpose-built import tools and onboarding specialists help TradeGecko users migrate historical data quickly.',
    competitor:
      'QuickBooks offers basic export options but no easy migration path to modern inventory platforms.'
  }
];

export default function StockflowVsTradegecko() {
  usePageRefresh();

  return (
    <SeoPageLayout title="StockFlow vs TradeGecko">
      <SEO
        title="StockFlow vs TradeGecko | The Inventory Upgrade"
        description="TradeGecko was discontinued. Discover why fast-growing brands choose StockFlow as the modern alternative with automation, analytics and EU support."
        keywords="stockflow vs tradegecko, tradegecko alternative, quickbooks commerce replacement, stockflow comparison"
        url="https://www.stockflow.be/stockflow-vs-tradegecko"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                StockFlow vs TradeGecko{' '}
                <span className="text-blue-600">The Modern Alternative</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                TradeGecko helped early ecommerce brands digitise inventory, but the platform sunset left teams searching for a future-proof solution. StockFlow delivers automation, analytics and EU support in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  View Pricing
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
                <span className="text-sm text-gray-600">Migrating from TradeGecko? We’ll help.</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="StockFlow vs TradeGecko comparison"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            StockFlow vs TradeGecko: Feature Overview
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Capability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">TradeGecko</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {comparisonData.map((row, index) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Brands Choose StockFlow After TradeGecko
            </h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow bridges ecommerce, wholesale and retail inventory in one platform. Automations keep teams focused on growth instead of admin.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Launch in a few days with guided onboarding and data migration support.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Automate purchasing, replenishment and channel-specific workflows.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Consolidate sales orders from Shopify, B2B portals and marketplaces.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Stay compliant with EU hosting, VAT-ready invoicing and multilingual support.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">StockFlow Highlights</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementation</p>
                <p className="text-xl font-semibold">Go live in 2 weeks</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Automation Impact</p>
                <p className="text-xl font-semibold">70% less manual admin</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Channel Coverage</p>
                <p className="text-xl font-semibold">Ecommerce, POS & wholesale</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Users className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Users Included</p>
                <p className="text-xl font-semibold">Unlimited collaborators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Migrating from TradeGecko?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Layers className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Structured Data Imports</h3>
              <p className="text-gray-600">
                Import products, suppliers, customers, orders and stock history directly from your TradeGecko export. Our team helps map fields and verify balances.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Seamless Continuity</h3>
              <p className="text-gray-600">
                Keep your operations running while switching systems. StockFlow staging environments let you test automations before cutting over.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upgrade from TradeGecko Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience a modern inventory platform that scales with your business. Start StockFlow for free, explore automation and invite your team when ready.
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


