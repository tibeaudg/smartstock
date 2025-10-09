import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, DollarSign, Zap, Star } from 'lucide-react';

export default function StockFlowVsSKULabs() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'General Inventory', stockflow: true, competitor: 'E-commerce focus' },
    { feature: 'Easy Setup', stockflow: true, competitor: 'Moderate' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$199/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs SKULabs">
      <SEO
        title="StockFlow vs SKULabs: Better for General Inventory 2025"
        description="SKULabs focuses on e-commerce. StockFlow is better for general inventory at lower cost. Start free today."
        keywords="stockflow vs skulabs, skulabs alternative"
        url="https://www.stockflow.be/stockflow-vs-skulabs"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs SKULabs: <span className="text-blue-600">The General Inventory Solution</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            SKULabs specializes in e-commerce. For general inventory, StockFlow is simpler and more affordable.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ComparisonTable competitorName="SKULabs" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with Simple Inventory</h2>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

