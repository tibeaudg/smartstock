import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  Croissant,
  ClipboardList,
  Timer,
  TrendingDown,
  BarChart3,
  Truck,
  ShieldCheck,
  ArrowRight,
  Star
} from 'lucide-react';

export default function InventoryManagementBakery() {
  usePageRefresh();

  const benefits = [
    {
      icon: Croissant,
      title: 'Track Ingredients & Batches',
      description:
        'Monitor flour, yeast, butter and fillings down to batch numbers. Preserve quality with allergen and expiry tracking.'
    },
    {
      icon: ClipboardList,
      title: 'Plan Production Precisely',
      description:
        'Build recipes with bill-of-materials, calculate required ingredients and convert demand into production runs.'
    },
    {
      icon: Timer,
      title: 'Reduce Waste & Spoilage',
      description:
        'Forecast demand with real-time sales data. Automate alerts for time-sensitive ingredients and prepared items.'
    },
    {
      icon: TrendingDown,
      title: 'Lower Cost of Goods',
      description:
        'Analyse margins by product line, supplier and store. Identify shrinkage and negotiate smarter purchasing terms.'
    },
    {
      icon: Truck,
      title: 'Streamline Supplier Orders',
      description:
        'Create standing orders, approve deliveries on mobile and reconcile invoices quickly with audit-ready records.'
    },
    {
      icon: ShieldCheck,
      title: 'Stay Compliant',
      description:
        'Maintain traceability, handle recalls with confidence and provide accurate product labelling for your customers.'
    }
  ];

  const faq = [
    {
      question: 'Can StockFlow handle bakery recipes?',
      answer:
        'Yes. Build recipes with step-by-step instructions, units of measure and yield factors. StockFlow deducts ingredients automatically when product is produced or sold.'
    },
    {
      question: 'How do bakeries forecast demand with StockFlow?',
      answer:
        'Combine historical sales, seasonal patterns and upcoming orders to predict required production. StockFlow translates forecasts into ingredient needs and reorder alerts.'
    },
    {
      question: 'Does StockFlow manage multi-location bakeries?',
      answer:
        'Absolutely. Manage central production plus satellite stores or cafés. Transfer finished goods, monitor returns and maintain a consolidated inventory view.'
    },
    {
      question: 'Can I track packaging and supplies?',
      answer:
        'Track every resource: packaging, cleaning supplies, uniforms and equipment parts. Keep purchasing aligned with actual consumption.'
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management for Bakeries">
      <SEO
        title="Bakery Inventory Management Software | StockFlow"
        description="Control ingredient costs, recipes and production in your bakery. StockFlow helps artisan and multi-location bakeries reduce waste and stay compliant."
        keywords="bakery inventory management, bakery recipe software, bakery production planning, bakery stock control"
        url="https://www.stockflow.be/inventory-management-bakery"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory Management for Bakeries{' '}
                <span className="text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Keep ingredient costs under control, forecast production and ensure every baguette, pastry and cake is delivered on time. StockFlow keeps artisan and industrial bakeries aligned.
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
                <span className="text-sm text-gray-600">Loved by artisan & multi-site bakeries</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Bakery inventory dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Manage Every Batch from Ingredient to Showcase
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto text-center">
            StockFlow gives bakers and production teams real-time visibility into ingredients, semi-finished goods and finished products – across central kitchens and retail outlets.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <benefit.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Focus on Baking, Not Spreadsheets
            </h2>
            <p className="text-lg opacity-90">
              StockFlow automates your purchasing, production planning and quality control. Replace manual spreadsheets with a single source of truth that every baker, manager and accountant can rely on.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Key capabilities</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Recipe & formula management with yield control</li>
                <li>• Demand planning with seasonal adjustments</li>
                <li>• Mobile cycle counts & intake verification</li>
                <li>• Supplier performance tracking & pricing history</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Insights you gain</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Cost of goods sold per product line</li>
                <li>• Waste trends by ingredient or location</li>
                <li>• Production efficiency & labour allocation</li>
                <li>• Profitability forecasts for new launches</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bake with Confidence</h2>
          <p className="text-xl mb-8 opacity-90">
            Join growing bakeries that rely on StockFlow to control costs, minimise waste and scale operations. Start your free trial today.
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


