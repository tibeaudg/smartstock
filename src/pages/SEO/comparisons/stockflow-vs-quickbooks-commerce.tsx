import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Shield, Clock, Database } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsQuickBooksCommerce() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: 'Discontinued for new customers' },
    { feature: 'Availability', stockflow: 'Available worldwide', competitor: 'Legacy only, no new signups' },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: 'Limited' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Global' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'EU-based, responsive', competitor: 'Limited support' },
    { feature: 'Starting Price', stockflow: '€0', competitor: 'N/A (discontinued)' },
    { feature: 'Migration Path', stockflow: 'Free migration assistance', competitor: 'Complex, requires help' },
    { feature: 'Future Development', stockflow: 'Active development', competitor: 'No new features' },
    { feature: 'API Access', stockflow: true, competitor: 'Limited' },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Partial' }
  ];

  const faqData = [
    {
      question: "What happened to QuickBooks Commerce (formerly TradeGecko)?",
      answer: "QuickBooks Commerce (formerly TradeGecko) was discontinued for new customers in 2023. Existing customers can continue using it but cannot add new users or access new features. StockFlow offers a modern alternative with active development and free migration assistance."
    },
    {
      question: "Can I migrate from QuickBooks Commerce to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from QuickBooks Commerce/TradeGecko including products, warehouses, suppliers, stock levels, historical movements, and SKUs. Most migrations complete within 2-3 business days. This is especially valuable since QuickBooks Commerce is no longer accepting new customers."
    },
    {
      question: "Is StockFlow a good replacement for QuickBooks Commerce?",
      answer: "Yes, StockFlow is an excellent replacement for QuickBooks Commerce. It offers all core inventory features (multi-warehouse, barcode scanning, multi-channel sales) plus modern advantages: free tier, EU data hosting, GDPR compliance, and active development. StockFlow is purpose-built for European SMEs."
    },
    {
      question: "What are the advantages of StockFlow over QuickBooks Commerce?",
      answer: "StockFlow advantages: (1) Available for new customers (QuickBooks Commerce is discontinued), (2) Free tier vs paid-only, (3) EU data hosting and GDPR compliance, (4) Active development and new features, (5) Faster setup (5-7 days vs 30-60 days), (6) Lower cost (€0-€29/month vs $99-€299/month)."
    },
    {
      question: "Will QuickBooks Commerce be supported long-term?",
      answer: "No. QuickBooks Commerce is in maintenance mode with no new features or major updates. Existing customers should plan migration to modern alternatives like StockFlow to avoid future disruption and access new capabilities."
    }
  ];

  const keyTakeaways = [
    'QuickBooks Commerce is discontinued for new customers.',
    'StockFlow offers free migration from QuickBooks Commerce/TradeGecko.',
    'StockFlow provides free tier vs QuickBooks Commerce\'s paid-only model.',
    'StockFlow has EU data hosting; QuickBooks Commerce is US/Global.',
    'StockFlow is actively developed; QuickBooks Commerce is maintenance mode.'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs QuickBooks Commerce"
      heroTitle="StockFlow vs QuickBooks Commerce (Migration Guide 2026)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs QuickBooks Commerce 2026 – Migration from Discontinued Platform"
        description="QuickBooks Commerce (TradeGecko) is discontinued. StockFlow offers free migration, free tier, EU hosting, and active development. Complete comparison and migration guide for QuickBooks Commerce users."
        keywords="stockflow vs quickbooks commerce, tradegecko alternative, quickbooks commerce migration, tradegecko replacement, inventory software migration"
        url="https://www.stockflowsystems.com/stockflow-vs-quickbooks-commerce"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs QuickBooks Commerce</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            QuickBooks Commerce (formerly TradeGecko) is discontinued for new customers. This guide helps existing users understand StockFlow as a modern replacement with free migration assistance.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><Shield className="mx-auto mb-2" />Active development</div>
            <div className="bg-white border rounded-xl p-4"><DollarSign className="mx-auto mb-2" />Free migration</div>
            <div className="bg-white border rounded-xl p-4"><Clock className="mx-auto mb-2" />Available now</div>
            <div className="bg-white border rounded-xl p-4"><Database className="mx-auto mb-2" />EU hosting</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="QuickBooks Commerce" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Migrate from QuickBooks Commerce?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-4">QuickBooks Commerce Status</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Discontinued for new customers (2023)</li>
                <li>• No new features or major updates</li>
                <li>• Maintenance mode only</li>
                <li>• Limited support available</li>
                <li>• Future uncertainty</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold mb-4">StockFlow Advantages</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Available for new customers</li>
                <li>✓ Active development and new features</li>
                <li>✓ Free tier available</li>
                <li>✓ EU data hosting and GDPR compliance</li>
                <li>✓ Free migration assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Migration Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-xl border"><strong>1.</strong> Data export from QuickBooks Commerce</div>
            <div className="bg-gray-50 p-5 rounded-xl border"><strong>2.</strong> Data validation and mapping</div>
            <div className="bg-gray-50 p-5 rounded-xl border"><strong>3.</strong> Import to StockFlow</div>
            <div className="bg-gray-50 p-5 rounded-xl border"><strong>4.</strong> Verification and training</div>
          </div>
          <p className="mt-6 text-gray-600 max-w-3xl">
            StockFlow provides free migration assistance including products, warehouses, suppliers, stock levels, historical movements, and SKUs. Most migrations complete within 2-3 business days without downtime.
          </p>
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
            name: "StockFlow vs QuickBooks Commerce",
            url: "https://www.stockflowsystems.com/stockflow-vs-quickbooks-commerce",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}


