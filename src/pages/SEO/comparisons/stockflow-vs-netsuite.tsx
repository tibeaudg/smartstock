import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Smartphone, Shield, Clock, Database, Lock, Globe } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsNetSuite() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: '$999-$4,999/month' },
    { feature: 'Target Market', stockflow: 'SMEs (small to medium)', competitor: 'Enterprise only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Global' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Complex, requires consultants' },
    { feature: 'Customer Support', stockflow: 'EU-based, responsive', competitor: 'Enterprise support tiers' },
    { feature: 'Starting Price', stockflow: '€0', competitor: '$999/month minimum' },
    { feature: 'Implementation Time', stockflow: '5–7 days', competitor: '3–12 months' },
    { feature: 'Data Migration Assistance', stockflow: 'Free, done-for-you', competitor: 'Paid, requires consultants' },
    { feature: 'API Access', stockflow: true, competitor: true },
    { feature: 'Setup Complexity', stockflow: 'Simple, self-service', competitor: 'Complex, requires consultants' },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Available but complex' }
  ];

  const faqData = [
    {
      question: "StockFlow vs NetSuite: Which is better for small businesses?",
      answer: "StockFlow is designed specifically for SMEs with a free tier and simple setup. NetSuite is enterprise software starting at $999/month, requiring consultants and 3-12 month implementations. For small to medium businesses, StockFlow offers better value, faster setup, and lower total cost."
    },
    {
      question: "What is the main difference between StockFlow and NetSuite?",
      answer: "StockFlow is inventory-focused software for SMEs, while NetSuite is a full ERP suite for large enterprises. StockFlow offers free tier, 5-7 day setup, and EU hosting. NetSuite requires $999+/month, 3-12 month implementations, and is designed for companies with $50M+ revenue."
    },
    {
      question: "How much does NetSuite cost compared to StockFlow?",
      answer: "NetSuite starts at $999/month (€900+) with typical implementations costing $10,000-$50,000+. StockFlow offers a free tier with paid plans starting around €29/month. Over three years, StockFlow costs €0-€1,044 vs NetSuite's €36,000-€200,000+."
    },
    {
      question: "Is NetSuite overkill for small businesses?",
      answer: "Yes, NetSuite is enterprise software designed for large companies. Small businesses typically don't need full ERP suites. StockFlow provides inventory management, multi-warehouse, barcode scanning, and integrations at a fraction of the cost, making it ideal for SMEs."
    },
    {
      question: "Can I migrate from NetSuite to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from NetSuite including products, warehouses, suppliers, stock levels, and historical data. NetSuite's export capabilities make data extraction possible, though complex customizations may require additional work."
    },
    {
      question: "Which has better GDPR compliance: StockFlow or NetSuite?",
      answer: "StockFlow has superior GDPR compliance for European businesses with EU-only data hosting and built-in GDPR tooling. NetSuite offers GDPR features but stores data globally, requiring additional configuration and legal agreements for EU compliance."
    }
  ];

  const keyTakeaways = [
    'StockFlow is for SMEs; NetSuite is enterprise-only ($999+/month).',
    'StockFlow setup takes 5-7 days; NetSuite takes 3-12 months.',
    'StockFlow costs €0-€1,044 over 3 years vs NetSuite\'s €36,000-€200,000+.',
    'StockFlow offers EU data hosting; NetSuite is global/US-focused.',
    'StockFlow is better for businesses under $50M revenue.'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs NetSuite"
      heroTitle="StockFlow vs NetSuite (2026 Full Comparison)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs NetSuite 2026 – SME vs Enterprise, Pricing, Setup Time"
        description="StockFlow vs NetSuite comparison: SME inventory software (€0) vs enterprise ERP ($999+/month), implementation time (5-7 days vs 3-12 months), and total cost. Find out which is better for your business size."
        keywords="stockflow vs netsuite, netsuite alternative, sme inventory software, enterprise erp vs inventory software, netsuite vs stockflow"
        url="https://www.stockflowsystems.com/stockflow-vs-netsuite"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs NetSuite</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comparing SME-focused inventory software vs enterprise ERP? This breakdown shows when StockFlow (inventory-first for SMEs) makes more sense than NetSuite (full ERP for enterprises).
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><Shield className="mx-auto mb-2" />SME-focused</div>
            <div className="bg-white border rounded-xl p-4"><DollarSign className="mx-auto mb-2" />Free tier</div>
            <div className="bg-white border rounded-xl p-4"><Clock className="mx-auto mb-2" />5-7 days</div>
            <div className="bg-white border rounded-xl p-4"><Database className="mx-auto mb-2" />EU hosting</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="NetSuite" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">SME vs Enterprise: Different Needs</h2>
            <p className="text-gray-600 mb-4">
              StockFlow and NetSuite serve fundamentally different markets.
            </p>
            <p className="text-gray-600 mb-4">
              NetSuite is enterprise ERP software designed for large companies ($50M+ revenue) needing full financial, CRM, and supply chain management. It requires consultants, 3-12 month implementations, and $999-$4,999/month minimum.
            </p>
            <p className="text-gray-600">
              StockFlow is inventory-first software for SMEs needing accurate stock tracking, multi-warehouse management, and barcode scanning. It offers free tier, 5-7 day setup, and focuses on operational inventory execution rather than full ERP.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <ul className="space-y-4">
              <li><strong>StockFlow:</strong> Inventory-first, SME-focused, free tier, fast setup.</li>
              <li><strong>NetSuite:</strong> Full ERP, enterprise-only, $999+/month, complex setup.</li>
              <li><strong>Result:</strong> StockFlow is better for 95% of businesses under $50M revenue.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">3-Year Total Cost of Ownership</h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">StockFlow</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Software licenses: FREE</li>
                <li>• Setup & migration: €0</li>
                <li>• Training: Included</li>
                <li>• Support: Included</li>
              </ul>
              <p className="mt-4 font-semibold">3-year estimate: €0-€1,044</p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">NetSuite</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Licenses: €36,000-€180,000</li>
                <li>• Implementation: €9,000-€45,000</li>
                <li>• Training: €3,000-€15,000</li>
                <li>• Annual support: €10,800-€54,000</li>
              </ul>
              <p className="mt-4 font-semibold">3-year estimate: €58,800-€294,000+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Which One Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-bold mb-4">Choose StockFlow if:</h3>
              <ul className="space-y-2">
                <li>✓ Revenue under $50M</li>
                <li>✓ You need inventory management, not full ERP</li>
                <li>✓ You want fast setup (5-7 days)</li>
                <li>✓ You prefer free/low-cost options</li>
                <li>✓ You're EU-based</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-4">Choose NetSuite if:</h3>
              <ul className="space-y-2">
                <li>• Revenue $50M+</li>
                <li>• You need full ERP (finance, CRM, supply chain)</li>
                <li>• You have budget for $999+/month</li>
                <li>• You can wait 3-12 months for implementation</li>
                <li>• You need enterprise-level customization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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

      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "StockFlow vs NetSuite",
            url: "https://www.stockflowsystems.com/stockflow-vs-netsuite",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}


