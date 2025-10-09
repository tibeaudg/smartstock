import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star } from 'lucide-react';

export default function StockFlowVsInFlow() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Cloud-Based', stockflow: true, competitor: 'Desktop + Cloud' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-location', stockflow: true, competitor: true },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Multi-currency', stockflow: true, competitor: true },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$71/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs inFlow">
      <SEO
        title="StockFlow vs inFlow Inventory: Better Alternative 2025"
        description="Compare StockFlow and inFlow Inventory. Cloud-based, free to start, and easier to use. Perfect for small businesses."
        keywords="stockflow vs inflow, inflow alternative, inventory management software, cloud inventory"
        url="https://www.stockflow.be/stockflow-vs-inflow"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs inFlow: <span className="text-blue-600">The Cloud-First Alternative</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            inFlow is solid but expensive and partially desktop-based. StockFlow is fully cloud-based, 
            free to start, and easier to use.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />))}
              <span className="ml-2 text-sm text-gray-600">5.0/5</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Quick Comparison</h2>
          <ComparisonTable competitorName="inFlow" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose StockFlow?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free to Start</h3>
              <p className="text-gray-600">Free for up to 30 products. inFlow starts at $71/month.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fully Cloud-Based</h3>
              <p className="text-gray-600">Access anywhere. inFlow requires desktop software for full features.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler Setup</h3>
              <p className="text-gray-600">Start in minutes. No software installation needed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with Modern Cloud Inventory</h2>
          <p className="text-xl mb-8 opacity-90">Free to start, fully cloud-based, no desktop software needed.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

