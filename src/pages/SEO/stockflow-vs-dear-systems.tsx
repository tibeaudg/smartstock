import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, DollarSign, Zap, Star } from 'lucide-react';

export default function StockFlowVsDearSystems() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Small Business Focused', stockflow: true, competitor: false },
    { feature: 'Easy Setup', stockflow: true, competitor: 'Complex' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$249/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs DEAR Systems">
      <SEO
        title="StockFlow vs DEAR Systems: Affordable Alternative 2025"
        description="DEAR Systems is comprehensive but expensive. StockFlow offers what SMEs need at a fraction of the cost. Start free today."
        keywords="stockflow vs dear systems, dear systems alternative, affordable inventory"
        url="https://www.stockflow.be/stockflow-vs-dear-systems"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs DEAR Systems: <span className="text-blue-600">The SMB Alternative</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            DEAR is powerful but enterprise-priced. StockFlow delivers essential features for small businesses, starting free.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ComparisonTable competitorName="DEAR Systems" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Save $2,988+ Annually</h2>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

