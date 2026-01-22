import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Shield, Clock, Database, ShoppingCart } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsVend() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: 'Discontinued (acquired by Lightspeed)' },
    { feature: 'Availability', stockflow: 'Available worldwide', competitor: 'Legacy only, no new signups' },
    { feature: 'Focus', stockflow: 'Inventory-first', competitor: 'POS-first, inventory included' },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: 'Limited' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Global' },
    { feature: 'Migration Path', stockflow: 'Free migration assistance', competitor: 'Migrate to Lightspeed X-Series' },
    { feature: 'Future Development', stockflow: 'Active development', competitor: 'No new features' },
    { feature: 'API Access', stockflow: true, competitor: 'Limited' },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Partial' }
  ];

  const faqData = [
    {
      question: "What happened to Vend POS?",
      answer: "Vend was acquired by Lightspeed in 2021 and is being phased out. Existing Vend customers are being migrated to Lightspeed X-Series. New customers cannot sign up for Vend. StockFlow offers a modern alternative with free migration assistance."
    },
    {
      question: "Can I migrate from Vend to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from Vend including products, warehouses, suppliers, stock levels, and historical data. This is especially valuable since Vend is being discontinued and customers need to migrate anyway. Most migrations complete within 2-3 business days."
    },
    {
      question: "Is StockFlow a good replacement for Vend?",
      answer: "Yes, StockFlow is an excellent replacement for Vend. It offers all core inventory features plus modern advantages: free tier, EU data hosting, GDPR compliance, and active development. StockFlow is inventory-first, making it ideal if you want to keep your existing POS system."
    },
    {
      question: "Should I migrate to Lightspeed X-Series or StockFlow?",
      answer: "If you need a new POS system, Lightspeed X-Series may be appropriate. If you want to keep your existing POS and need better inventory management, StockFlow is the better choice. StockFlow integrates with any POS system via API, giving you flexibility."
    },
    {
      question: "What are the advantages of StockFlow over Vend?",
      answer: "StockFlow advantages: (1) Available for new customers (Vend is discontinued), (2) Free tier vs Vend's paid-only model, (3) EU data hosting and GDPR compliance, (4) Active development and new features, (5) Inventory-first design vs Vend's POS-first approach."
    }
  ];

  const keyTakeaways = [
    'Vend is discontinued (acquired by Lightspeed).',
    'StockFlow offers free migration from Vend.',
    'StockFlow provides free tier vs Vend\'s paid-only model.',
    'StockFlow has EU data hosting; Vend is US/Global.',
    'StockFlow is actively developed; Vend is maintenance mode.'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs Vend"
      heroTitle="StockFlow vs Vend (Migration Guide 2026)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Vend 2026 – Migration from Discontinued POS Platform"
        description="Vend POS is discontinued (acquired by Lightspeed). StockFlow offers free migration, free tier, EU hosting, and active development. Complete comparison and migration guide for Vend users."
        keywords="stockflow vs vend, vend pos alternative, vend migration, vend replacement, inventory software migration"
        url="https://www.stockflowsystems.com/stockflow-vs-vend"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs Vend</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Vend POS is discontinued (acquired by Lightspeed). This guide helps existing Vend users understand StockFlow as a modern replacement with free migration assistance.
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
          <ComparisonTable competitorName="Vend" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Migrate from Vend?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Vend Status</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Acquired by Lightspeed (2021)</li>
                <li>• Being phased out</li>
                <li>• No new customer signups</li>
                <li>• Limited support</li>
                <li>• Migration to Lightspeed X-Series required</li>
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
            name: "StockFlow vs Vend",
            url: "https://www.stockflowsystems.com/stockflow-vs-vend",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}


