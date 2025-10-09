import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star } from 'lucide-react';

export default function StockFlowVsCin7() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Small Business Focused', stockflow: true, competitor: false },
    { feature: 'Easy Setup', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-channel', stockflow: 'Via API', competitor: 'Advanced' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$299/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Cin7">
      <SEO
        title="StockFlow vs Cin7: Affordable Alternative for SMEs 2025"
        description="Compare StockFlow and Cin7. StockFlow offers better value for small businesses. Free to start vs $299/month. Start today."
        keywords="stockflow vs cin7, cin7 alternative, affordable inventory management, small business inventory"
        url="https://www.stockflow.be/stockflow-vs-cin7"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs Cin7: <span className="text-blue-600">The Affordable Alternative</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cin7 is powerful but enterprise-priced at $299/month minimum. StockFlow delivers 
            what SMEs need, starting free.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Comparison Overview</h2>
          <ComparisonTable competitorName="Cin7" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Small Businesses Choose StockFlow</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Huge Cost Savings</h3>
              <p className="text-gray-600">Free vs $299/month. Save $3,588+ annually.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler to Use</h3>
              <p className="text-gray-600">Clean interface focused on what matters. No feature overload.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Better for SMEs</h3>
              <p className="text-gray-600">Built specifically for small businesses, not scaled-down enterprise.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Save Thousands on Inventory Software</h2>
          <p className="text-xl mb-8 opacity-90">Get the features you need without the enterprise price.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

