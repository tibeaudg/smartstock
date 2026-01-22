import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Shield, Clock, Database, Layers } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsOdoo() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: '€24.90/user/month' },
    { feature: 'Deployment', stockflow: 'Cloud SaaS', competitor: 'Cloud or self-hosted' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'EU available' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate-Complex' },
    { feature: 'Customer Support', stockflow: 'EU-based, responsive', competitor: 'Community or paid' },
    { feature: 'Starting Price', stockflow: '€0', competitor: '€24.90/user/month' },
    { feature: 'Implementation Time', stockflow: '5–7 days', competitor: '30–60 days' },
    { feature: 'Focus', stockflow: 'Inventory-first', competitor: 'Full ERP suite' },
    { feature: 'API Access', stockflow: true, competitor: true },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Available' }
  ];

  const faqData = [
    {
      question: "StockFlow vs Odoo: Which is better for inventory management?",
      answer: "StockFlow is purpose-built for inventory management with inventory-first design. Odoo is a full ERP suite where inventory is one module among many. For businesses focused on inventory accuracy and warehouse operations, StockFlow offers simpler setup, faster implementation, and lower cost."
    },
    {
      question: "What is the main difference between StockFlow and Odoo?",
      answer: "StockFlow is inventory-first software designed specifically for stock management, warehouses, and barcode scanning. Odoo is a full ERP suite (CRM, accounting, inventory, manufacturing, etc.) where inventory is one module. StockFlow offers free tier and 5-7 day setup; Odoo requires €24.90/user/month and 30-60 day implementations."
    },
    {
      question: "How much does Odoo cost compared to StockFlow?",
      answer: "Odoo costs €24.90 per user per month (minimum 1 user = €24.90/month). For 5 users, that's €124.50/month or €1,494/year. StockFlow offers a free tier with paid plans starting around €29/month for unlimited users. Over three years, StockFlow costs €0-€1,044 vs Odoo's €1,494-€7,470+ (depending on users)."
    },
    {
      question: "Is Odoo overkill if I only need inventory management?",
      answer: "Yes, if you only need inventory management, Odoo's full ERP suite is likely overkill. StockFlow provides focused inventory features (multi-warehouse, barcode scanning, stock tracking) without the complexity and cost of unused ERP modules like CRM and accounting."
    },
    {
      question: "Can I migrate from Odoo to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from Odoo including products, warehouses, suppliers, stock levels, and historical data. Odoo's export capabilities make data extraction straightforward. Most migrations complete within 2-3 business days."
    },
    {
      question: "Which has better inventory features: StockFlow or Odoo?",
      answer: "StockFlow has superior inventory-focused features: faster barcode scanning workflows, optimized warehouse management, and inventory-first design. Odoo's inventory module is part of a larger ERP, making it more complex and less optimized for pure inventory operations."
    }
  ];

  const keyTakeaways = [
    'StockFlow is inventory-first; Odoo is full ERP suite.',
    'StockFlow offers free tier; Odoo costs €24.90/user/month.',
    'StockFlow setup takes 5-7 days; Odoo takes 30-60 days.',
    'StockFlow is better for inventory-focused businesses.',
    'Odoo is better if you need full ERP (CRM, accounting, etc.).'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs Odoo"
      heroTitle="StockFlow vs Odoo (2026 Full Comparison)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Odoo 2026 – Inventory Software vs Full ERP, Pricing"
        description="StockFlow vs Odoo comparison: inventory-first software (€0) vs full ERP suite (€24.90/user/month), setup time, and focus. Find out which is better for inventory management vs full business management."
        keywords="stockflow vs odoo, odoo alternative, inventory software vs erp, odoo inventory module, inventory management software"
        url="https://www.stockflowsystems.com/stockflow-vs-odoo"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs Odoo</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comparing inventory-first software vs full ERP suite? This breakdown shows when StockFlow (inventory-focused) makes more sense than Odoo (full ERP) for inventory management needs.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><Shield className="mx-auto mb-2" />Inventory-first</div>
            <div className="bg-white border rounded-xl p-4"><DollarSign className="mx-auto mb-2" />Free tier</div>
            <div className="bg-white border rounded-xl p-4"><Clock className="mx-auto mb-2" />5-7 days</div>
            <div className="bg-white border rounded-xl p-4"><Layers className="mx-auto mb-2" />Focused</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Odoo" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Inventory-First vs Full ERP</h2>
            <p className="text-gray-600 mb-4">
              StockFlow and Odoo serve different purposes.
            </p>
            <p className="text-gray-600 mb-4">
              Odoo is a full ERP suite with modules for CRM, accounting, inventory, manufacturing, e-commerce, and more. It's designed for businesses wanting to manage everything in one system, but this comes with complexity and per-user pricing.
            </p>
            <p className="text-gray-600">
              StockFlow is inventory-first software designed specifically for stock management, warehouses, and barcode scanning. It focuses on doing inventory exceptionally well without the complexity of unused ERP modules.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <ul className="space-y-4">
              <li><strong>StockFlow:</strong> Inventory-first, free tier, fast setup, focused.</li>
              <li><strong>Odoo:</strong> Full ERP, €24.90/user/month, complex setup, comprehensive.</li>
              <li><strong>Result:</strong> StockFlow is better for inventory-focused businesses; Odoo is better if you need full ERP.</li>
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
                <li>• Unlimited users: Included</li>
              </ul>
              <p className="mt-4 font-semibold">3-year estimate: €0-€1,044</p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Odoo</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Licenses: €1,494-€7,470 (5-25 users)</li>
                <li>• Setup: €500-€2,000</li>
                <li>• Training: €300-€1,000</li>
                <li>• Annual support: Included</li>
              </ul>
              <p className="mt-4 font-semibold">3-year estimate: €2,294-€10,470+</p>
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
                <li>✓ You primarily need inventory management</li>
                <li>✓ You want free/low-cost options</li>
                <li>✓ You prefer fast setup (5-7 days)</li>
                <li>✓ You want inventory-first design</li>
                <li>✓ You have many users (unlimited in free tier)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-4">Choose Odoo if:</h3>
              <ul className="space-y-2">
                <li>• You need full ERP (CRM, accounting, etc.)</li>
                <li>• You want everything in one system</li>
                <li>• You can afford €24.90/user/month</li>
                <li>• You need advanced manufacturing features</li>
                <li>• You prefer self-hosted options</li>
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
            name: "StockFlow vs Odoo",
            url: "https://www.stockflowsystems.com/stockflow-vs-odoo",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}

