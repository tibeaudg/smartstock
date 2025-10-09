import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, DollarSign, Smartphone, Zap, Star } from 'lucide-react';

export default function StockFlowVsTradeGecko() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Active Development', stockflow: true, competitor: 'Discontinued' },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: 'Product discontinued' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs TradeGecko">
      <SEO
        title="StockFlow vs TradeGecko (QuickBooks Commerce): Better Alternative 2025"
        description="TradeGecko is now QuickBooks Commerce and being discontinued. Switch to StockFlow for modern, actively developed inventory management."
        keywords="stockflow vs tradegecko, tradegecko alternative, quickbooks commerce alternative"
        url="https://www.stockflow.be/stockflow-vs-tradegecko"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs TradeGecko: <span className="text-blue-600">The Active Alternative</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            TradeGecko (now QuickBooks Commerce) is being discontinued. Switch to StockFlow 
            for actively developed, modern inventory management.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Switch to StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Comparison Overview</h2>
          <ComparisonTable competitorName="TradeGecko" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Make the Switch Today</h2>
          <p className="text-xl mb-8 opacity-90">Move from TradeGecko to actively developed software.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

