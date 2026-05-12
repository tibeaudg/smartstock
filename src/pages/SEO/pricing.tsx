import SEO from '@/components/SEO';
import { useLocation, Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { StructuredData } from '@/components/StructuredData';
import { Check, Star } from 'lucide-react';

/**
 * StockFlow Pricing Page
 * Targets: prix abonnement stockflow inventory management, pricing, subscription
 * Updated: May 2026
 */

interface PlanFeature {
  text: string;
  isHighlight?: boolean;
}

interface Plan {
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number | null;
  features: PlanFeature[];
  isPopular: boolean;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const PLANS: Plan[] = [
  {
    name: 'starter',
    displayName: 'Starter',
    description: 'Best for getting started.',
    monthlyPrice: 0,
    features: [
      { text: '100 Unique Items' },
      { text: '1 User License' },
      { text: 'Core inventory features' },
    ],
    isPopular: false,
    primaryCta: { label: 'Sign Up Free', href: '/auth' },
  },
  {
    name: 'professional',
    displayName: 'Professional',
    description: 'Best for simplifying day-to-day inventory tasks.',
    monthlyPrice: 9,
    features: [
      { text: '2,000 Unique Items' },
      { text: '5 User Licenses' },
      { text: '2 Branches' },
      { text: '+ Unlimited QR Code & Barcode Label Creation', isHighlight: true },
      { text: '+ Purchase Orders', isHighlight: true },
      { text: '+ Orders Management', isHighlight: true },
    ],
    isPopular: true,
    primaryCta: { label: 'Start Free Trial', href: '/auth' },
    secondaryCta: { label: 'Buy Now', href: '/auth?plan=professional' },
  },
  {
    name: 'business',
    displayName: 'Business',
    description: 'Best for streamlining inventory processes and oversight.',
    monthlyPrice: 29,
    features: [
      { text: '5,000 Unique Items' },
      { text: '8 User Licenses' },
      { text: '5 Branches' },
      { text: '+ Customizable Role Permissions', isHighlight: true },
      { text: '+ QuickBooks Online Integration', isHighlight: true },
      { text: '+ Purchase Orders', isHighlight: true },
    ],
    isPopular: false,
    primaryCta: { label: 'Start Free Trial', href: '/auth' },
    secondaryCta: { label: 'Talk to Sales', href: 'mailto:sales@stockflowsystems.com' },
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'Best for customized inventory processes and control.',
    monthlyPrice: 59,
    features: [
      { text: '10,000+ Unique Items' },
      { text: '12+ User Licenses' },
      { text: '+ API and Webhooks', isHighlight: true },
      { text: '+ Dedicated Customer Success Manager', isHighlight: true },
    ],
    isPopular: false,
    primaryCta: { label: 'Start Free Trial', href: '/auth' },
  },
];

export default function PricingPage() {
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1,
  }));

  const faqData = [
    {
      question: 'Does StockFlow have a free plan?',
      answer:
        'Yes! StockFlow offers a free Starter plan with up to 100 unique items and 1 user license. No credit card required. You can upgrade to a paid plan at any time to unlock more capacity and features.',
    },
    {
      question: 'Can I try a paid plan before paying?',
      answer:
        'Yes. The Professional plan comes with a 14-day free trial. No credit card is required to start your trial. You only pay after the trial ends if you choose to continue.',
    },
    {
      question: 'How does billing work after the free trial?',
      answer:
        'You provide a payment method when you start the trial. After 14 days, your plan automatically continues and you are charged the monthly rate. You can cancel anytime before the trial ends at no cost.',
    },
    {
      question: 'Wat kost StockFlow? Is StockFlow gratis?',
      answer:
        'StockFlow biedt een gratis Starter-plan met 100 unieke items en 1 gebruiker. Betaalde abonnementen starten bij $9/maand voor het Professional-plan. Geen verborgen kosten.',
    },
  ];

  const keyTakeaways = [
    'Free Starter plan: 100 unique items, 1 user, no credit card.',
    'Professional at $9/mo: 2,000 items, 5 users, purchase orders.',
    'Business at $29/mo: 5,000 items, 8 users, QuickBooks integration.',
    '14-day free trial on the Professional plan.',
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'StockFlow Pricing – Plans from $0 | Prix Abonnement',
    description:
      'StockFlow pricing: Starter (free), Professional $9/mo, Business $29/mo, Enterprise $59/mo. Prix abonnement StockFlow inventory management.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Inventory Management',
      description: 'Inventory management software with tiered plans from free to enterprise.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Up to 10,000+ unique items',
        'Multi-user support',
        'QR code & barcode label creation',
        'Purchase orders',
        'QuickBooks Online integration',
        'API and webhooks',
      ],
      url: location.pathname,
      offers: [
        { price: '0',  priceCurrency: 'USD', description: 'Starter – free forever' },
        { price: '9',  priceCurrency: 'USD', description: 'Professional – monthly' },
        { price: '29', priceCurrency: 'USD', description: 'Business – monthly' },
        { price: '59', priceCurrency: 'USD', description: 'Enterprise – monthly' },
      ],
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const breadcrumbItems = breadcrumbs.map((b) => ({ name: b.name, path: b.url }));

  return (
    <SeoPageLayout
      breadcrumbItems={breadcrumbItems}
      heroTitle="StockFlow Pricing"
      dateUpdated="2026-05-08"
      heroDescription="Simple, transparent pricing. Start free and scale as you grow. Professional plan includes a 14-day free trial."
      keyTakeaways={keyTakeaways}
      pageLanguage="en"
    >
      <SEO
        title="StockFlow Pricing | Plans from $0 – Prix Abonnement Inventory Management"
        description="StockFlow pricing: Starter free, Professional $9/mo, Business $29/mo, Enterprise $59/mo. Prix abonnement stockflow inventory management."
        keywords="stockflow pricing, prix abonnement stockflow, stockflow plans, inventory management price, stockflow kosten, stockflow abonnement"
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
        <div className="max-w-5xl mx-auto">
          <h2 id="pricing-plans" className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Professional plan includes a 14-day free trial
            — no credit card required.
          </p>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-white rounded-2xl p-6 shadow-sm border-2 ${
                  plan.isPopular ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <p className="font-bold text-xl text-gray-900 mb-1">{plan.displayName}</p>
                <p className="text-xs text-gray-500 mb-4 min-h-[2.5rem]">{plan.description}</p>

                {plan.monthlyPrice === null ? (
                  <p className="text-2xl font-bold text-gray-900 mb-1">Get a Quote</p>
                ) : plan.monthlyPrice === 0 ? (
                  <p className="text-3xl font-bold text-gray-900">Free</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    ${plan.monthlyPrice}
                    <span className="text-sm font-normal text-gray-500 ml-1">/mo.</span>
                  </p>
                )}

                {/* CTAs */}
                <div className="mt-5 space-y-2">
                  <Link
                    to={plan.primaryCta.href}
                    className={`block text-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                      plan.name === 'starter'
                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {plan.primaryCta.label}
                  </Link>
                  {plan.secondaryCta && (
                    <Link
                      to={plan.secondaryCta.href}
                      className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {plan.secondaryCta.label}
                    </Link>
                  )}
                </div>

                <div className="my-5 border-t border-gray-100" />

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          f.isHighlight ? 'text-blue-500' : 'text-green-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          f.isHighlight ? 'text-gray-700 font-medium' : 'text-gray-600'
                        }`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            * 14-day free trial on Professional. No credit card required to start your trial.
            Extra branches +$5/mo · Extra users +$2/mo, beyond what's included in your plan.
          </p>

          {/* FAQ */}
          <h2 id="faq" className="text-2xl font-bold text-gray-900 mb-6 mt-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
