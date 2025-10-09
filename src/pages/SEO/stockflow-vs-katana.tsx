import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, DollarSign, Zap, Star } from 'lucide-react';

export default function StockFlowVsKatana() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'General Inventory', stockflow: true, competitor: 'Manufacturing focus' },
    { feature: 'Easy Setup', stockflow: true, competitor: 'Complex' },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$179/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Katana">
      <SEO
        title="StockFlow vs Katana: Better for General Inventory 2025"
        description="Katana specializes in manufacturing. StockFlow is better for general inventory needs at a fraction of the cost. Start free."
        keywords="stockflow vs katana, katana alternative, general inventory management"
        url="https://www.stockflow.be/stockflow-vs-katana"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs Katana: <span className="text-blue-600">Better for General Inventory</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Katana focuses on manufacturing. For general inventory management, StockFlow 
            is simpler and more affordable.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ComparisonTable competitorName="Katana" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Much Lower Cost</h3>
              <p className="text-gray-600">Free vs $179/month. Save $2,148 annually.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler Interface</h3>
              <p className="text-gray-600">Clean, focused inventory. No manufacturing complexity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with Simple Inventory Management</h2>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

