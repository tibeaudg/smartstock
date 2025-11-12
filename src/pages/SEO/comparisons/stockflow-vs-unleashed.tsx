import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Cog,
  Gauge,
  Layers,
  Shield,
  Star
} from 'lucide-react';

const comparisonPoints = [
  {
    title: 'Pricing & Accessibility',
    stockflow: 'Transparent pricing with a free plan for up to 30 products and paid plans starting at €29/month with unlimited users.',
    competitor: 'Unleashed requires paid tiers from day one, with seat-based pricing that quickly becomes expensive for growing teams.'
  },
  {
    title: 'Ease of Use',
    stockflow: 'Designed for SMEs with intuitive workflows, mobile barcode scanning, and fast onboarding without consultants.',
    competitor: 'Unleashed offers powerful features but often requires training and lengthy implementation projects.'
  },
  {
    title: 'Automation',
    stockflow: 'Automate reordering, alerts, workflows and supplier collaboration out of the box.',
    competitor: 'Automation is available, but advanced features often sit behind premium add-ons or integrations.'
  },
  {
    title: 'Reporting & Analytics',
    stockflow: 'Real-time dashboards for inventory valuation, demand forecasting and multi-location visibility.',
    competitor: 'Comprehensive reports available, yet custom analytics usually require BI integrations or additional modules.'
  },
  {
    title: 'Support & Localization',
    stockflow: 'EU-based infrastructure, multilingual support and tailored workflows for European SMEs.',
    competitor: 'Global support network but mostly focused on APAC with limited localisation for EU-specific requirements.'
  }
];

export default function StockflowVsUnleashed() {
  usePageRefresh();

  return (
    <SeoPageLayout title="StockFlow vs Unleashed">
      <SEO
        title="StockFlow vs Unleashed | Modern Inventory Alternative"
        description="Compare StockFlow vs Unleashed. See how StockFlow helps SMEs launch faster with affordable pricing, automation and local support."
        keywords="stockflow vs unleashed, unleashed alternative, unleashed inventory comparison, stockflow comparison"
        url="https://www.stockflow.be/stockflow-vs-unleashed"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                StockFlow vs Unleashed{' '}
                <span className="text-blue-600">Which Fits Growing SMEs?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Unleashed is known for advanced manufacturing features. StockFlow delivers the automation and visibility SMEs need without the enterprise price tag. Explore the key differences.
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
                <span className="text-sm text-gray-600">500+ businesses trust StockFlow</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="StockFlow vs Unleashed comparison"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            StockFlow vs Unleashed: Feature Comparison
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Capability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Unleashed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {comparisonPoints.map((point, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{point.title}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{point.stockflow}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{point.competitor}</td>
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
              Where StockFlow Stands Out
            </h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow was built for modern European SMEs that need automation, clarity and collaboration across inventory, purchasing and sales channels – without enterprise complexity.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Launch in days with intuitive workflows and zero-code configuration.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Automate purchasing, replenishment and supplier collaboration.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Gain real-time dashboards for valuation, margin and demand planning.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Leverage EU-based support with multilingual documentation.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">Key metrics at a glance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementation</p>
                <p className="text-xl font-semibold">Go-live in 2 weeks</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Automation Wins</p>
                <p className="text-xl font-semibold">70% manual work saved</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Cog className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Integrations</p>
                <p className="text-xl font-semibold">Shopify, Exact, POS & more</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Inventory Accuracy</p>
                <p className="text-xl font-semibold">98%+ real-time accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Why Teams Switch from Unleashed to StockFlow
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Lean Implementation',
                description: 'Get live quickly without expensive consulting projects or IT maintenance.'
              },
              {
                icon: Shield,
                title: 'EU-Based Hosting & Support',
                description: 'Meet compliance requirements with EU data residency and local support teams.'
              },
              {
                icon: CheckCircle,
                title: 'Automation Everywhere',
                description: 'StockFlow automates repetitive work – from inbound receiving to replenishment – out of the box.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition">
                <item.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience StockFlow for Yourself</h2>
          <p className="text-xl mb-8 opacity-90">
            Join businesses modernising their inventory operations with StockFlow. Start free, invite your team and see automation in action.
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


