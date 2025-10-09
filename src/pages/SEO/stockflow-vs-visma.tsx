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
  TrendingUp,
  Star
} from 'lucide-react';
import { generateFAQSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

export default function StockFlowVsVisma() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan Available', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Real-time Sync', stockflow: true, competitor: true },
    { feature: 'Multi-branch Support', stockflow: true, competitor: 'Enterprise only' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Low Stock Alerts', stockflow: true, competitor: true },
    { feature: 'Custom Reports', stockflow: true, competitor: 'Limited' },
    { feature: 'Multi-user Access', stockflow: 'Unlimited', competitor: 'Paid tiers' },
    { feature: 'API Access', stockflow: true, competitor: 'Enterprise only' },
    { feature: 'Belgian Market Focus', stockflow: true, competitor: 'Nordic focus' },
    { feature: 'Dutch Language Support', stockflow: true, competitor: 'Limited' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '€50+/month' },
  ];

  const faqData = [
    {
      question: "What's the main difference between StockFlow and Visma?",
      answer: "StockFlow offers a free plan and is specifically designed for Belgian and Dutch SMEs with full native language support. Visma is primarily focused on Nordic markets with higher pricing tiers starting at €50+/month and limited support for Belgian businesses."
    },
    {
      question: "Is StockFlow better than Visma for small businesses?",
      answer: "For small businesses in Belgium and the Netherlands, StockFlow is often the better choice due to its free tier, local support, full Dutch language interface, and features specifically designed for SMEs. Visma tends to be more expensive and is optimized for larger Nordic enterprises."
    },
    {
      question: "Can I migrate from Visma to StockFlow?",
      answer: "Yes, you can easily migrate from Visma to StockFlow. Our team can help you import your product data, customers, and inventory history. The migration process typically takes less than a day for most businesses."
    },
    {
      question: "Does StockFlow have the same features as Visma?",
      answer: "StockFlow offers all essential inventory management features including multi-location support, barcode scanning, real-time tracking, and advanced reporting. While Visma has more enterprise-focused features, StockFlow provides everything SMEs need at a fraction of the cost."
    },
    {
      question: "How much can I save by switching from Visma to StockFlow?",
      answer: "Most small businesses save €600-1200 per year by switching from Visma to StockFlow. With our free plan for up to 30 products and premium plans starting at €29/month, the savings are significant compared to Visma's €50+/month starting price."
    }
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Better Pricing',
      description: 'Start free with up to 30 products. Premium plans from €29/month. Visma charges €50+/month minimum.',
    },
    {
      icon: Shield,
      title: 'Belgian Focus',
      description: 'Designed for Belgian and Dutch businesses with local support and compliance. Visma focuses on Nordic markets.',
    },
    {
      icon: Smartphone,
      title: 'Superior Mobile App',
      description: 'Full-featured mobile app with offline mode. Manage inventory from anywhere, anytime.',
    },
    {
      icon: Users,
      title: 'Unlimited Users',
      description: 'Add your entire team without per-user fees. Collaborate freely without extra costs.',
    },
    {
      icon: Zap,
      title: 'Faster Setup',
      description: 'Get started in minutes with our intuitive interface. No complex ERP implementation required.',
    },
    {
      icon: TrendingUp,
      title: 'Better for SMEs',
      description: 'Built specifically for small and medium businesses. Not over-engineered for enterprises.',
    },
  ];

  // Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
    { name: 'Comparisons', url: 'https://www.stockflow.be', position: 2 },
    { name: 'StockFlow vs Visma', url: 'https://www.stockflow.be/stockflow-vs-visma', position: 3 }
  ]);

  const faqSchema = generateFAQSchema(faqData);

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'StockFlow - Inventory Management',
    description: 'Free inventory management software for Belgian and Dutch SMEs',
    category: 'BusinessApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: { value: '4.8', count: '32' },
    url: 'https://www.stockflow.be',
    image: 'https://www.stockflow.be/Inventory-Management.png'
  });

  return (
    <SeoPageLayout title="StockFlow vs Visma">
      <SEO
        title="StockFlow vs Visma: Which is Better for Belgian SMEs in 2025?"
        description="Compare StockFlow and Visma inventory management software. See features, pricing, and why StockFlow is the better choice for Belgian businesses. Start free today."
        keywords="stockflow vs visma, visma alternative, inventory management Belgium, visma vs stockflow, free inventory software, Belgian inventory software"
        url="https://www.stockflow.be/stockflow-vs-visma"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-visma" },
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-visma" }
        ]}
        structuredData={[breadcrumbSchema, faqSchema, softwareSchema]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Visma: <span className="text-blue-600">The Complete Comparison</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choosing between StockFlow and Visma for inventory management? 
              See why Belgian businesses choose StockFlow for its better pricing, 
              local support, and SME-focused features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try StockFlow Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Free</div>
              <div className="text-gray-600">StockFlow Starting Price</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">€50+</div>
              <div className="text-gray-600">Visma Starting Price</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">€600+</div>
              <div className="text-gray-600">Annual Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Feature-by-Feature <span className="text-blue-600">Comparison</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how StockFlow and Visma stack up across key features
            </p>
          </div>
          
          <ComparisonTable 
            features={comparisonFeatures}
            competitorName="Visma"
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Belgian Businesses Choose <span className="text-blue-600">StockFlow</span>
            </h2>
            <p className="text-xl text-gray-600">
              Built for the Belgian and Dutch markets with local support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pricing <span className="text-blue-600">Comparison</span>
            </h2>
            <p className="text-xl text-gray-600">
              Transparent pricing that saves you money
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* StockFlow Pricing */}
            <div className="border-4 border-blue-600 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Free - €29</div>
                <div className="text-gray-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Free tier: Up to 30 products</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Premium: €29/month unlimited products</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Unlimited users included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobile app included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Dutch language support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Belgian customer support</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Visma Pricing */}
            <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Visma</h3>
                <div className="text-4xl font-bold text-gray-700 mb-2">€50+</div>
                <div className="text-gray-600">per month (minimum)</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>No free tier</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Starting at €50+/month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Per-user licensing fees</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Mobile app extra cost</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Limited Dutch support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Nordic-focused support</span>
                </li>
              </ul>
              <a 
                href="https://www.visma.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Visit Visma
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Switch from Visma?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of Belgian businesses saving time and money with StockFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

