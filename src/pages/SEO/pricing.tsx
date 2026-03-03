import SEO from '@/components/SEO';
import { useLocation, Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { StructuredData } from '@/components/StructuredData';
import { CheckCircle, ArrowRight, Zap, Users, Package } from 'lucide-react';

/**
 * StockFlow Pricing Page
 * Targets: prix abonnement stockflow inventory management, pricing, subscription
 * Updated: March 2026
 */
export default function PricingPage() {
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1,
  }));

  const faqData = [
    {
      question: 'What does StockFlow cost? Is there a free plan?',
      answer:
        'StockFlow is completely free forever. There is no credit card required, no time limits, and no artificial caps on products, users, or locations. All core features including inventory tracking, barcode scanning, BOM management, and reporting are included at no cost.',
    },
    {
      question: 'Is there a catch with the free plan?',
      answer:
        'No catch. StockFlow offers free inventory management to help growing businesses succeed. We only charge for optional enterprise features or very large-scale operations. Your data is always yours and you can export it anytime.',
    },
    {
      question: 'How does StockFlow compare to paid inventory software?',
      answer:
        'StockFlow delivers the same core features as paid alternatives like Fishbowl, Sortly, or Zoho Inventory—real-time tracking, barcode scanning, multi-location support, BOM management—but at zero cost. Most businesses save $500–$5,000 per year by switching.',
    },
    {
      question: 'Wat kost StockFlow? Is StockFlow gratis?',
      answer:
        'StockFlow is volledig gratis voor altijd. Geen creditcard vereist, geen abonnementskosten. Alle functies zijn inbegrepen: onbeperkte producten, gebruikers, vestigingen, BOM-beheer en rapportage. Ideaal voor Belgische en Nederlandse bedrijven.',
    },
  ];

  const keyTakeaways = [
    'StockFlow is free forever with no credit card required.',
    'Unlimited products, users, branches, and orders included.',
    'All features: BOM management, barcode scanning, reporting—at no cost.',
    'Optional paid tiers only for enterprise-scale or custom needs.',
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'StockFlow Pricing – Free Inventory Management | Prix Abonnement',
    description:
      'StockFlow pricing: free forever. No credit card, unlimited products & users. Prix abonnement StockFlow inventory management – completely free.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Inventory Management',
      description:
        'Free inventory management software with BOM, barcode scanning, and multi-location tracking.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'EUR',
      features: [
        'Unlimited products and users',
        'BOM management',
        'Barcode scanning',
        'Multi-location tracking',
        'Automated reorder alerts',
        'Advanced reporting',
      ],
      url: location.pathname,
      offers: [{ price: '0', priceCurrency: 'EUR', description: 'Free forever' }],
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const breadcrumbItems = breadcrumbs.map((b) => ({ name: b.name, path: b.url }));

  return (
    <SeoPageLayout
      breadcrumbItems={breadcrumbItems}
      heroTitle="StockFlow Pricing – Free Forever"
      dateUpdated="2026-03-03"
      heroDescription="Prix abonnement StockFlow: free inventory management software. No credit card, unlimited products, BOM, barcode scanning. Start free today."
      keyTakeaways={keyTakeaways}
      pageLanguage="en"
    >
      <SEO
        title="StockFlow Pricing | Free Forever – Prix Abonnement Inventory Management"
        description="StockFlow pricing: free forever. No credit card. Unlimited products, users, BOM. Prix abonnement stockflow inventory management – start free today."
        keywords="stockflow pricing, prix abonnement stockflow, stockflow inventory management price, free inventory software, stockflow kosten, stockflow abonnement"
        url="https://www.stockflowsystems.com/pricing"
        structuredData={structuredData}
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/pricing' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraad-software' },
          { lang: 'fr-BE', url: 'https://www.stockflowsystems.com/pricing' },
        ]}
      />

      <StructuredData data={structuredData} />

      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 id="pricing-plans" className="text-2xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            <strong>StockFlow inventory management</strong> is free forever. No hidden fees, no credit card
            required. Whether you are a small shop or a growing business, you get full access to all core
            features at zero cost.
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Free Plan</h3>
                <p className="text-3xl font-bold text-blue-600 mt-1">€0 / month</p>
                <p className="text-gray-600 mt-2">Forever free. No credit card required.</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited products and SKUs',
                'Unlimited users and branches',
                'Bill of Materials (BOM) management',
                'Barcode & QR code scanning',
                'Multi-location inventory tracking',
                'Automated low-stock alerts',
                'Purchase orders & sales orders',
                'Advanced reporting & analytics',
                'Mobile app (iOS & Android)',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <h2 id="why-free" className="text-2xl font-bold text-gray-900 mb-6 mt-12">
            Why StockFlow Is Free
          </h2>
          <p className="text-gray-700 mb-6">
            We believe every business deserves professional <strong>inventory management software</strong>{' '}
            without the barrier of subscription fees. StockFlow helps retailers, manufacturers, and
            distributors save thousands per year—money you can reinvest in growth.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <Zap className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">No Credit Card</h4>
              <p className="text-gray-600 text-sm">Sign up in 2 minutes. Start tracking immediately.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Scale</h4>
              <p className="text-gray-600 text-sm">Grow without hitting product or user limits.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <Package className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">All Features Included</h4>
              <p className="text-gray-600 text-sm">BOM, barcode scanning, reporting—all free.</p>
            </div>
          </div>

          <h2 id="faq" className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
