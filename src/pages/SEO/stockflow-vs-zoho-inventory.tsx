import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star } from 'lucide-react';

export default function StockFlowVsZohoInventory() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: 'Trial only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/India only' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'Responsive', competitor: 'Variable' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$59/month' },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Zoho Inventory">
      <SEO
        title="StockFlow vs Zoho Inventory: Best Alternative 2025"
        description="Compare StockFlow and Zoho Inventory. Better pricing, European hosting, and simpler interface. Perfect for SMEs. Start free today."
        keywords="stockflow vs zoho inventory, zoho inventory alternative, inventory management software, cloud inventory"
        url="https://www.stockflow.be/stockflow-vs-zoho-inventory"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs Zoho Inventory: <span className="text-blue-600">The Better Choice for European SMEs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            While Zoho Inventory is feature-rich, StockFlow offers better value with European data hosting, 
            simpler interface, and free plan for small businesses.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Zoho Inventory" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StockFlow is Better for European Businesses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Better Pricing</h3>
              <p className="text-gray-600">Free forever for up to 30 products. Zoho charges $59/month minimum.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">European Privacy</h3>
              <p className="text-gray-600">GDPR-compliant with EU data hosting. Zoho stores data in US/India.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler Interface</h3>
              <p className="text-gray-600">Clean, focused on inventory. Zoho can feel cluttered with features.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with StockFlow Today</h2>
          <p className="text-xl mb-8 opacity-90">Better pricing, European hosting, simpler to use. Start free now.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

