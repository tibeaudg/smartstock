import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  UtensilsCrossed,
  BedDouble,
  Wine,
  BarChart3,
  ClipboardList,
  Zap,
  Shield,
  ArrowRight,
  Star
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryForHospitality() {
  usePageRefresh();

  const benefits = [
    {
      icon: UtensilsCrossed,
      title: 'Restaurants & Catering',
      description:
        'Track ingredients, recipe costs and prep lists. Automate purchase orders when stock drops below par levels.'
    },
    {
      icon: BedDouble,
      title: 'Hotels & Resorts',
      description:
        'Manage housekeeping supplies, minibar items and maintenance inventory across every property and floor.'
    },
    {
      icon: Wine,
      title: 'Bars & Breweries',
      description:
        'Monitor keg usage, batch numbers and lot traceability. Reduce shrinkage with mobile cycle counts and alerts.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Cost Insights',
      description:
        'Understand consumption trends, forecast demand, and set accurate menu pricing with detailed analytics.'
    },
    {
      icon: ClipboardList,
      title: 'Centralised Ordering',
      description:
        'Consolidate supplier ordering, deliveries and transfers so every outlet is replenished on time.'
    },
    {
      icon: Shield,
      title: 'Compliance Ready',
      description:
        'Maintain full traceability on allergens, expiry dates and batch information to meet safety regulations.'
    }
  ];

  const faq = [
    {
      question: 'Can StockFlow handle recipes and bill of materials?',
      answer:
        'Yes. Create recipes with ingredient breakdowns, yield percentages and allergen notes. StockFlow deducts ingredients automatically when a dish or package is sold or prepared.'
    },
    {
      question: 'How does multi-location inventory work?',
      answer:
        'Manage each site, bar or kitchen as separate locations. Transfers, counts and ordering can be localised while head office gets a consolidated picture for reporting.'
    },
    {
      question: 'Does StockFlow integrate with point-of-sale systems?',
      answer:
        'We integrate with leading hospitality POS platforms so sales and consumption data sync in real time. This keeps inventory, menu engineering and forecasting aligned.'
    },
    {
      question: 'Can I manage suppliers and purchasing?',
      answer:
        'Create supplier catalogues, automate purchase orders, track delivery discrepancies and analyse spend. StockFlow keeps finance and operations on the same page.'
    }
  ];

  return (
    <SeoPageLayout title="Inventory for Hospitality">
      <SEO
        title="Hospitality Inventory Software 2025 | Restaurants, Hotels & Bars"
        description="Complete inventory management for hospitality businesses. Track recipes, reduce waste 30%, automate purchasing. Free trial. Trusted by 500+ venues."
        keywords="hospitality inventory management, restaurant stock control, hotel inventory software, bar inventory tracking, hospitality inventory system, restaurant inventory software, hotel stock management, bar stock control, food inventory management, beverage inventory tracking, hospitality cost control, restaurant waste reduction"
        url="https://www.stockflow.be/inventory-for-hospitality"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory for Hospitality{' '}
                <span className="text-blue-600">That Keeps Guests Happy</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Control food and beverage cost, manage housekeeping supplies, and streamline purchasing across every venue. StockFlow gives hospitality teams the visibility they need.
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
                <span className="text-sm text-gray-600">Trusted by hotels, restaurants & venues</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Hospitality inventory dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Run Every Operation on Accurate Inventory Data
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto text-center">
            Minimise waste, control COGS and ensure every guest experience meets your standards. StockFlow standardises inventory processes across your hospitality group.
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
              Align Culinary, Operations & Finance in One Platform
            </h2>
            <p className="text-lg opacity-90">
              From daily prep lists to monthly reporting, every team sees the same inventory truth. Automate replenishment, track waste, and forecast demand for events or seasonal peaks.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Key workflows</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Map recipes and ingredients to menu items</li>
                <li>• Schedule cycle counts with mobile scanning</li>
                <li>• Automate supplier ordering and approvals</li>
                <li>• Track wastage and donation activities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Analytics & alerts</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Cost of goods sold by menu or outlet</li>
                <li>• Variance between theoretical and actual usage</li>
                <li>• Expiry and allergen compliance warnings</li>
                <li>• Forecasts for events, seasons and catering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Hospitality Businesses Need Specialized Inventory Management</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The hospitality industry faces unique inventory challenges that generic inventory systems can't address. From perishable ingredients with strict expiry dates to complex recipe costing and seasonal demand fluctuations, hospitality inventory management requires specialized tools designed for the industry's specific needs.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            StockFlow's hospitality inventory management software addresses these challenges with features like recipe management, batch tracking, allergen compliance, and real-time cost analysis. Whether you're running a single restaurant, managing a hotel chain, or operating multiple bars, having accurate inventory data directly impacts your bottom line and guest satisfaction.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Benefits for Hospitality Operations</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hospitality inventory management software like StockFlow helps businesses:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Reduce food waste by up to 30% through better demand forecasting and expiry tracking</li>
            <li>Control food costs with accurate recipe costing and real-time COGS analysis</li>
            <li>Maintain compliance with allergen tracking and batch traceability for recalls</li>
            <li>Streamline operations with automated purchase orders and supplier management</li>
            <li>Improve profitability through detailed margin analysis by menu item or outlet</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Integration with Hospitality Systems</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Modern hospitality inventory management requires seamless integration with your existing systems. StockFlow integrates with leading POS systems, accounting software, and e-commerce platforms to ensure data flows automatically between systems. This eliminates manual data entry, reduces errors, and provides real-time visibility across all operations.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            For restaurants, integration with POS systems means sales data automatically updates inventory levels. For hotels, integration with property management systems ensures housekeeping supplies are tracked alongside guest services. Bars benefit from real-time keg tracking and automated reordering when stock levels drop.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
            <p className="text-gray-800 leading-relaxed font-medium">
              Ready to transform your hospitality inventory management? <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-semibold">Start your free trial</Link> today and see how StockFlow helps hospitality businesses reduce costs, minimize waste, and improve guest satisfaction.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Deliver Perfect Guest Experiences</h2>
          <p className="text-xl mb-8 opacity-90">
            StockFlow gives hospitality leaders the tools to control costs and keep service running smoothly. Start a free trial and see the difference in days.
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
          "name": "StockFlow - Hospitality Inventory Management Software",
          "description": "Complete inventory management software for restaurants, hotels, and bars. Track recipes, reduce waste, automate purchasing, and control costs with specialized hospitality features.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Start managing hospitality inventory for free",
              "availability": "https://schema.org/InStock"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "ratingCount": "150",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Recipe and ingredient management",
            "Batch and lot tracking",
            "Allergen compliance tracking",
            "Multi-location support",
            "POS system integration",
            "Real-time cost analysis",
            "Automated purchase orders",
            "Expiry date tracking"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Hospitality Inventory Management Software | StockFlow",
          "description": "Complete inventory management for hospitality businesses. Track recipes, reduce waste, automate purchasing.",
          "url": "https://www.stockflow.be/inventory-for-hospitality",
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
                "name": "Hospitality Inventory Management",
                "item": "https://www.stockflow.be/inventory-for-hospitality"
              }
            ]
          }
        }
      ]} />
    </SeoPageLayout>
  );
}


