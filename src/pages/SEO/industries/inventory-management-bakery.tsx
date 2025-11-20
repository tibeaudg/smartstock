import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  Croissant,
  ClipboardList,
  Timer,
  TrendingDown,
  BarChart3,
  Truck,
  ShieldCheck,
  ArrowRight,
  Star
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryManagementBakery() {
  usePageRefresh();

  const benefits = [
    {
      icon: Croissant,
      title: 'Track Ingredients & Batches',
      description:
        'Monitor flour, yeast, butter and fillings down to batch numbers. Preserve quality with allergen and expiry tracking.'
    },
    {
      icon: ClipboardList,
      title: 'Plan Production Precisely',
      description:
        'Build recipes with bill-of-materials, calculate required ingredients and convert demand into production runs.'
    },
    {
      icon: Timer,
      title: 'Reduce Waste & Spoilage',
      description:
        'Forecast demand with real-time sales data. Automate alerts for time-sensitive ingredients and prepared items.'
    },
    {
      icon: TrendingDown,
      title: 'Lower Cost of Goods',
      description:
        'Analyse margins by product line, supplier and store. Identify shrinkage and negotiate smarter purchasing terms.'
    },
    {
      icon: Truck,
      title: 'Streamline Supplier Orders',
      description:
        'Create standing orders, approve deliveries on mobile and reconcile invoices quickly with audit-ready records.'
    },
    {
      icon: ShieldCheck,
      title: 'Stay Compliant',
      description:
        'Maintain traceability, handle recalls with confidence and provide accurate product labelling for your customers.'
    }
  ];

  const faqData = [
    {
      question: 'Can StockFlow handle bakery recipes?',
      answer:
        'Yes. Build recipes with step-by-step instructions, units of measure and yield factors. StockFlow deducts ingredients automatically when product is produced or sold.'
    },
    {
      question: 'How do bakeries forecast demand with StockFlow?',
      answer:
        'Combine historical sales, seasonal patterns and upcoming orders to predict required production. StockFlow translates forecasts into ingredient needs and reorder alerts.'
    },
    {
      question: 'Does StockFlow manage multi-location bakeries?',
      answer:
        'Absolutely. Manage central production plus satellite stores or cafés. Transfer finished goods, monitor returns and maintain a consolidated inventory view.'
    },
    {
      question: 'Can I track packaging and supplies?',
      answer:
        'Track every resource: packaging, cleaning supplies, uniforms and equipment parts. Keep purchasing aligned with actual consumption.'
    },
    {
      question: 'What inventory management features are essential for bakeries?',
      answer:
        'Essential features for bakeries include recipe management, ingredient tracking with expiry dates, batch tracking, production planning, waste reduction tools, multi-location support, and compliance tracking for food safety regulations.'
    }
  ];

  return (
    <SeoPageLayout 
      title="Inventory Management for Bakeries"
      heroTitle="Inventory Management for Bakeries"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Bakery 2025 - Inventory Management B..."
        description="Learn how inventory management bakery to optimize your inventory management. Discover how inventory management bakery to optimize your inventory management....."
        keywords="bakery inventory management, bakery recipe software, bakery production planning, bakery stock control, bakery inventory system, ingredient tracking bakery, bakery cost control, bakery waste reduction, bakery production management, multi-location bakery software"
        url="https://www.stockflow.be/inventory-management-bakery"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory Management for Bakeries{' '}
                <span className="text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Keep ingredient costs under control, forecast production and ensure every baguette, pastry and cake is delivered on time. StockFlow keeps artisan and industrial bakeries aligned.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  View Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">Loved by artisan & multi-site bakeries</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Bakery inventory dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Manage Every Batch from Ingredient to Showcase
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto text-center">
            StockFlow gives bakers and production teams real-time visibility into ingredients, semi-finished goods and finished products – across central kitchens and retail outlets.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <benefit.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Focus on Baking, Not Spreadsheets
            </h2>
            <p className="text-lg opacity-90">
              StockFlow automates your purchasing, production planning and quality control. Replace manual spreadsheets with a single source of truth that every baker, manager and accountant can rely on.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Key capabilities</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Recipe & formula management with yield control</li>
                <li>• Demand planning with seasonal adjustments</li>
                <li>• Mobile cycle counts & intake verification</li>
                <li>• Supplier performance tracking & pricing history</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Insights you gain</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Cost of goods sold per product line</li>
                <li>• Waste trends by ingredient or location</li>
                <li>• Production efficiency & labour allocation</li>
                <li>• Profitability forecasts for new launches</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Unique Challenges of Bakery Inventory Management</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Bakery inventory management presents unique challenges that generic inventory systems struggle to address. From tracking perishable ingredients with strict expiry dates to managing complex recipes with multiple components, bakeries need specialized inventory management software that understands the industry's specific requirements.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            StockFlow's bakery inventory management software is designed specifically for bakeries, whether you're an artisan bakery with a single location or a multi-site operation with central production and retail outlets. The system handles everything from ingredient tracking and recipe management to production planning and waste reduction.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features for Bakeries</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Effective bakery inventory management requires several specialized features:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li><strong>Recipe Management:</strong> Build detailed recipes with ingredient breakdowns, yield factors, and allergen information. Automatically calculate ingredient needs based on production schedules.</li>
            <li><strong>Batch Tracking:</strong> Track ingredients and finished products by batch number for complete traceability, essential for recalls and quality control.</li>
            <li><strong>Expiry Date Management:</strong> Monitor ingredient expiry dates and alert staff before items expire, reducing waste and ensuring product quality.</li>
            <li><strong>Production Planning:</strong> Convert sales forecasts into production requirements, ensuring you have the right ingredients at the right time.</li>
            <li><strong>Cost Control:</strong> Track cost of goods sold (COGS) by product line, identify waste patterns, and optimize purchasing decisions.</li>
            <li><strong>Multi-Location Support:</strong> Manage central production facilities and multiple retail locations from a single system.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reducing Waste and Improving Profitability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Food waste is one of the biggest profit drains in the bakery industry. Effective inventory management can reduce waste by 25-30% through:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Better demand forecasting based on historical sales data and seasonal patterns</li>
            <li>Automated alerts for ingredients approaching expiry dates</li>
            <li>Optimized production planning to match actual demand</li>
            <li>Real-time visibility into inventory levels across all locations</li>
            <li>Detailed waste tracking to identify patterns and improvement opportunities</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            By reducing waste and optimizing ingredient purchasing, bakeries can significantly improve their profit margins while maintaining product quality and freshness.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
            <p className="text-gray-800 leading-relaxed font-medium">
              Ready to take control of your bakery inventory? <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-semibold">Start your free trial</Link> today and see how StockFlow helps bakeries reduce waste, control costs, and scale operations efficiently.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bake with Confidence</h2>
          <p className="text-xl mb-8 opacity-90">
            Join growing bakeries that rely on StockFlow to control costs, minimise waste and scale operations. Start your free trial today.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Bakery Inventory Management Software",
          "description": "Complete inventory management software for bakeries. Track ingredients, manage recipes, reduce waste, and control costs with specialized bakery features.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free trial - Start managing bakery inventory today",
              "availability": "https://schema.org/InStock"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "ratingCount": "120",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Recipe and ingredient management",
            "Batch and lot tracking",
            "Expiry date tracking",
            "Production planning",
            "Multi-location support",
            "Cost of goods sold analysis",
            "Waste tracking and reduction",
            "Supplier management"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Bakery Inventory Management Software | StockFlow",
          "description": "Complete inventory management for bakeries. Track ingredients, manage recipes, reduce waste, control costs.",
          "url": "https://www.stockflow.be/inventory-management-bakery",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.stockflow.be"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Bakery Inventory Management",
                "item": "https://www.stockflow.be/inventory-management-bakery"
              }
            ]
          }
        }
      ]} />
    </SeoPageLayout>
  );
}


