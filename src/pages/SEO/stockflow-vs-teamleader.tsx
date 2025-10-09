import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star } from 'lucide-react';

export default function StockFlowVsTeamleader() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Inventory Focus', stockflow: 'Primary', competitor: 'Secondary to CRM' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'CRM focused' },
    { feature: 'Multi-location', stockflow: true, competitor: 'Limited' },
    { feature: 'Dutch Language', stockflow: true, competitor: true },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '€50/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Teamleader">
      <SEO
        title="StockFlow vs Teamleader: Better for Pure Inventory Management 2025"
        description="Teamleader focuses on CRM. For dedicated inventory management, StockFlow is better equipped and more affordable. Start free today."
        keywords="stockflow vs teamleader, teamleader alternatief, voorraadbeheer software, teamleader inventory alternative"
        url="https://www.stockflow.be/stockflow-vs-teamleader"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Teamleader: <span className="text-blue-600">Better for Inventory Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Teamleader excels at CRM, but for dedicated inventory management, StockFlow offers 
              better features at lower cost. Perfect for Belgian and Dutch businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />))}
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Teamleader" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose StockFlow for Inventory?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lower Cost</h3>
              <p className="text-gray-600">Free to start vs €50/month minimum for Teamleader.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inventory-Focused Mobile App</h3>
              <p className="text-gray-600">Full inventory features on mobile. Teamleader mobile is CRM-focused.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Barcode Scanning</h3>
              <p className="text-gray-600">Built-in barcode scanning. Not available in Teamleader.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">When to Choose Each</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Choose StockFlow if you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Need dedicated inventory management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Want barcode scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Need multi-location support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Want to start free</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Choose Teamleader if you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Primarily need CRM functionality</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Inventory is a minor need</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Want all-in-one business software</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Already use Teamleader for CRM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Dedicated Inventory Management?</h2>
          <p className="text-xl mb-8 opacity-90">Perfect for Belgian and Dutch businesses. Start free today.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

