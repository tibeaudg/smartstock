import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

const getStructuredData = (faqItems: Array<{ q: string; a: string }>) => [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockFlow",
    "description": "Free inventory management software with barcode scanning, bill of materials, and real-time multi-location sync.",
    "url": "https://www.stockflowsystems.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free forever - no credit card required"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.stockflowsystems.com" },
      { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://www.stockflowsystems.com/pricing" }
    ]
  }
];

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'For individuals and very small teams getting started.',
    items: '100 items',
    users: '1 user',
    warehouses: '1 warehouse',
    features: [
      'Core inventory tracking',
      'Barcode & QR code scanning',
      'Mobile app access',
      'Low stock alerts',
      'CSV import & export',
    ],
    notIncluded: [
      'Sales & purchase orders',
      'Pick lists',
      'Role permissions',
      'QuickBooks integration',
      'API access',
    ],
    cta: 'Get Started Free',
    popular: false,
    highlight: false,
  },
  {
    name: 'Professional',
    price: 9,
    description: 'Best for simplifying day-to-day inventory tasks.',
    items: '2,000 items',
    users: '5 users',
    warehouses: '2 warehouses',
    features: [
      'Everything in Starter',
      'Sales order management',
      'Purchase order management',
      'Pick lists',
      'Stock counts',
      'Customers & suppliers',
      'QR code label creation',
    ],
    notIncluded: [
      'Role permissions',
      'QuickBooks integration',
      'API access',
      'Dedicated success manager',
    ],
    cta: 'Start Free Trial',
    popular: true,
    highlight: true,
  },
  {
    name: 'Business',
    price: 29,
    description: 'Best for streamlining inventory processes and oversight.',
    items: '5,000 items',
    users: '8 users',
    warehouses: '5 warehouses',
    features: [
      'Everything in Professional',
      'Customizable role permissions',
      'QuickBooks Online integration',
      'Advanced reporting',
      'Priority support',
    ],
    notIncluded: [
      'API access',
      'Dedicated success manager',
    ],
    cta: 'Start Free Trial',
    popular: false,
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 59,
    description: 'Best for customized inventory processes and control.',
    items: '10,000+ items',
    users: '12+ users',
    warehouses: 'Unlimited',
    features: [
      'Everything in Business',
      'Dedicated customer success manager',
      'Custom onboarding',
      'SLA guarantee',
    ],
    notIncluded: [],
    cta: 'Start Free Trial',
    popular: false,
    highlight: false,
  },
];

const comparisonFeatures = [
  { label: 'Unique items', starter: '100', pro: '2,000', business: '5,000', enterprise: '10,000+' },
  { label: 'User licenses', starter: '1', pro: '5', business: '8', enterprise: '12+' },
  { label: 'Warehouses', starter: '1', pro: '2', business: '5', enterprise: 'Unlimited' },
  { label: 'Barcode scanning', starter: true, pro: true, business: true, enterprise: true },
  { label: 'Mobile app', starter: true, pro: true, business: true, enterprise: true },
  { label: 'Low stock alerts', starter: true, pro: true, business: true, enterprise: true },
  { label: 'Sales orders', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Purchase orders', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Pick lists', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Stock counts', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Customers & Suppliers', starter: false, pro: true, business: true, enterprise: true },
  { label: 'Role permissions', starter: false, pro: false, business: true, enterprise: true },
  { label: 'QuickBooks integration', starter: false, pro: false, business: true, enterprise: true },
  { label: 'API & webhooks', starter: false, pro: false, business: false, enterprise: true },
  { label: 'Dedicated success manager', starter: false, pro: false, business: false, enterprise: true },
];

const faqs = [
  {
    q: 'Is the Starter plan really free forever?',
    a: 'Yes. The Starter plan is completely free with no time limit and no credit card required. You get access to all core inventory features for up to 100 items.',
  },
  {
    q: 'Do I need a credit card to start a free trial?',
    a: 'No. You can start a 14-day free trial of any paid plan without entering payment details. You only need to add a card if you decide to continue after the trial ends.',
  },
  {
    q: 'Can I upgrade or downgrade my plan at any time?',
    a: 'Absolutely. You can upgrade instantly from within your StockFlow dashboard. Downgrades take effect at the end of your current billing period so you never lose access mid-cycle.',
  },
  {
    q: 'Can I add extra users or warehouses beyond my plan?',
    a: 'Yes. You can add extra user licenses for $2/month each and extra warehouses for $5/month each, on top of what\'s already included in your plan.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your data is always safe and never deleted. If your item count exceeds the limit of a lower plan, you can still view existing items but won\'t be able to add new ones until you\'re within the limit again.',
  },
  {
    q: 'Is there a discount for annual billing?',
    a: 'Contact our team for annual billing options and enterprise pricing. We offer discounts for teams committing to a full year.',
  },
  {
    q: 'Can I migrate from spreadsheets or another tool?',
    a: 'Yes. StockFlow supports CSV import so you can migrate your existing inventory in minutes. Our customer success team is also available to assist with complex migrations.',
  },
];

function PlanCard({ plan, onCta }: { plan: typeof plans[0]; onCta: () => void }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.highlight
          ? 'border-blue-500 shadow-xl shadow-blue-100 bg-white ring-2 ring-blue-500'
          : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-black text-gray-900">${plan.price}</span>
        {plan.price > 0 && <span className="text-gray-500 mb-1">/month</span>}
        {plan.price === 0 && <span className="text-gray-500 mb-1 text-lg font-semibold">Free forever</span>}
      </div>
      <p className="mt-1 text-xs text-gray-400">{plan.price > 0 ? '14-day free trial, no credit card' : 'No credit card required'}</p>

      <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
        <span className="font-medium text-gray-800">{plan.items} • {plan.users} • {plan.warehouses}</span>
      </div>

      <Button
        onClick={onCta}
        className={`mt-6 w-full rounded-full font-semibold ${
          plan.highlight
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {plan.cta}
      </Button>

      <ul className="mt-8 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
        {plan.notIncluded.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
            <X className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-gray-900 font-medium hover:text-blue-600 transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="h-5 w-5 flex-shrink-0 text-blue-600" /> : <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />}
      </button>
      {open && <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

function CellValue({ val }: { val: string | boolean }) {
  if (val === true) return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  if (val === false) return <X className="h-4 w-4 text-gray-300 mx-auto" />;
  return <span className="text-sm font-medium text-gray-800">{val}</span>;
}

export default function PricingPage() {
  const navigate = useNavigate();
  const toAuth = () => navigate('/auth?mode=register');

  return (
    <>
      <SEO
        title="StockFlow Pricing — Free Inventory Software Plans"
        description="Start free with StockFlow's Starter plan or unlock more with Professional ($9/mo), Business ($29/mo), or Enterprise ($59/mo). No credit card required to start."
        keywords="stockflow pricing, inventory management software pricing, free inventory software, inventory software plans"
        url="https://www.stockflowsystems.com/pricing"
        structuredData={getStructuredData(faqs)}
      />

      <Header onLoginClick={() => navigate('/auth?mode=login')} onNavigate={() => {}} simplifiedNav={false} hideNotifications={true} />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-50 to-blue-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Start free. Scale when you're ready.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Every plan includes a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} onCta={toAuth} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Need more? Add extra users for <strong>$2/month</strong> and extra warehouses for <strong>$5/month</strong>.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Compare all features</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 w-1/3">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Starter</th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-blue-700 bg-blue-50/50">Professional</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Business</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Enterprise</th>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs text-gray-400">Price / month</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900">Free</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-blue-700 bg-blue-50/50">$9</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900">$29</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900">$59</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonFeatures.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm text-gray-700">{row.label}</td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.starter} /></td>
                    <td className="px-4 py-4 text-center bg-blue-50/20"><CellValue val={row.pro} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.business} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">"Completely transformed how we manage stock"</p>
          <p className="text-gray-600 mb-4">Rated 4.8/5 by 500+ small businesses across Belgium and beyond.</p>
          <Button onClick={toAuth} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg">
            Start for Free — No Card Needed
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently asked questions</h2>
          <div>
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <p className="text-center mt-10 text-gray-600">
            Still have questions?{' '}
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact our team</a>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
