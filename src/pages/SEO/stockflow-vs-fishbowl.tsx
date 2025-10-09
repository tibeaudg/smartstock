import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Smartphone, 
  Zap,
  Shield,
  Users,
  Star
} from 'lucide-react';

export default function StockFlowVsFishbowl() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Cloud-Based', stockflow: true, competitor: 'Desktop software' },
    { feature: 'Easy Setup', stockflow: true, competitor: false },
    { feature: 'Small Business Focused', stockflow: true, competitor: false },
    { feature: 'Manufacturing Features', stockflow: 'Basic', competitor: 'Advanced' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-location', stockflow: true, competitor: true },
    { feature: 'QuickBooks Integration', stockflow: 'Via API', competitor: 'Native' },
    { feature: 'Learning Curve', stockflow: 'Easy', competitor: 'Complex' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$4,395/year' },
    { feature: 'Installation Required', stockflow: false, competitor: true },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Fishbowl">
      <SEO
        title="StockFlow vs Fishbowl Inventory: Better Alternative for 2025"
        description="Compare StockFlow and Fishbowl Inventory. See why StockFlow is the better, more affordable choice for small businesses. Cloud-based, free to start, no installation."
        keywords="stockflow vs fishbowl, fishbowl alternative, fishbowl inventory alternative, cloud inventory software, affordable inventory management"
        url="https://www.stockflow.be/stockflow-vs-fishbowl"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Fishbowl: <span className="text-blue-600">The Modern Alternative</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Fishbowl is powerful but outdated and expensive. StockFlow offers modern, 
              cloud-based inventory management that's easier to use and free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try StockFlow Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-lg">StockFlow Starting Price</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">vs</div>
              <p className="text-lg opacity-90">Compare</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$4,395/yr</div>
              <p className="text-lg">Fishbowl Minimum</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Quick Comparison: StockFlow vs Fishbowl
          </h2>
          <ComparisonTable 
            competitorName="Fishbowl" 
            features={comparisonFeatures}
          />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Choose StockFlow Over Fishbowl?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Much Lower Cost</h3>
              <p className="text-gray-600">
                Start free vs $4,395/year. Save thousands annually on inventory software.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">True Cloud Solution</h3>
              <p className="text-gray-600">
                Access from anywhere. Fishbowl requires desktop installation and VPN for remote access.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
              <p className="text-gray-600">
                Start in minutes, not days. No installation or IT support needed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easier to Use</h3>
              <p className="text-gray-600">
                Modern, intuitive interface. Fishbowl's UI feels outdated and complex.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Maintenance</h3>
              <p className="text-gray-600">
                Automatic updates. Fishbowl requires manual updates and IT maintenance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Better for SMBs</h3>
              <p className="text-gray-600">
                Built for small businesses. Fishbowl is designed for larger operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Is StockFlow as powerful as Fishbowl?</h3>
              <p className="text-gray-600">
                For small to medium businesses, yes. StockFlow provides all essential inventory features. 
                Fishbowl has more advanced manufacturing features, but most SMBs don't need that complexity.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Can I switch from Fishbowl to StockFlow?</h3>
              <p className="text-gray-600">
                Yes! Export your data from Fishbowl and import it into StockFlow using CSV. 
                We offer migration support to make the transition smooth.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Does StockFlow integrate with QuickBooks?</h3>
              <p className="text-gray-600">
                Yes, StockFlow offers API integration with QuickBooks and other accounting software. 
                You can also export data for manual import.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Switch to Modern Inventory Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join businesses switching from Fishbowl to StockFlow. Start free today.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

