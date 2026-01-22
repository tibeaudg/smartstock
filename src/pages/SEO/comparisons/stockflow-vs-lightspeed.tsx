import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Shield, Clock, Database, ShoppingCart } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsLightspeed() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: '$69-$229/month' },
    { feature: 'Focus', stockflow: 'Inventory-first', competitor: 'POS-first, inventory included' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Canada' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'EU-based, responsive', competitor: 'US/CA-based' },
    { feature: 'Starting Price', stockflow: '€0', competitor: '$69/month' },
    { feature: 'Implementation Time', stockflow: '5–7 days', competitor: '30–60 days' },
    { feature: 'POS Integration', stockflow: 'Via API', competitor: 'Native POS system' },
    { feature: 'API Access', stockflow: true, competitor: true },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Partial' }
  ];

  const faqData = [
    {
      question: "StockFlow vs Lightspeed: Which is better for inventory management?",
      answer: "StockFlow is purpose-built for inventory management with inventory-first design. Lightspeed is a POS system with inventory features included. For businesses focused on inventory accuracy and warehouse operations, StockFlow offers better inventory features, free tier, and EU compliance."
    },
    {
      question: "What is the main difference between StockFlow and Lightspeed?",
      answer: "StockFlow is inventory-first software designed for stock management, warehouses, and barcode scanning. Lightspeed is a POS-first system where inventory is one feature. StockFlow offers free tier and 5-7 day setup; Lightspeed requires $69+/month and focuses on retail POS operations."
    },
    {
      question: "How much does Lightspeed cost compared to StockFlow?",
      answer: "Lightspeed costs $69-$229/month depending on features and locations. StockFlow offers a free tier with paid plans starting around €29/month. Over three years, StockFlow costs €0-€1,044 vs Lightspeed's $2,484-$8,244 (€2,235-€7,420)."
    },
    {
      question: "Do I need Lightspeed if I already have a POS system?",
      answer: "No, if you already have a POS system, StockFlow is a better choice. StockFlow integrates with existing POS systems via API, allowing you to keep your current POS while getting superior inventory management. Lightspeed requires switching to their POS system."
    },
    {
      question: "Can I migrate from Lightspeed to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from Lightspeed including products, warehouses, suppliers, stock levels, and historical data. Most migrations complete within 2-3 business days without downtime."
    }
  ];

  const keyTakeaways = [
    'StockFlow is inventory-first; Lightspeed is POS-first.',
    'StockFlow offers free tier; Lightspeed costs $69-$229/month.',
    'StockFlow integrates with any POS; Lightspeed requires their POS.',
    'StockFlow has EU data hosting; Lightspeed is US/Canada.',
    'StockFlow is better for inventory-focused businesses.'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs Lightspeed"
      heroTitle="StockFlow vs Lightspeed (2026 Full Comparison)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Lightspeed 2026 – Inventory Software vs POS System"
        description="StockFlow vs Lightspeed comparison: inventory-first software (€0) vs POS-first system ($69-$229/month), EU data hosting vs US/CA, and integration approach. Find out which is better for inventory management."
        keywords="stockflow vs lightspeed, lightspeed alternative, inventory software vs pos, lightspeed vs stockflow, inventory management software"
        url="https://www.stockflowsystems.com/stockflow-vs-lightspeed"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs Lightspeed</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comparing inventory-first software vs POS-first system? This breakdown shows StockFlow (inventory-focused) vs Lightspeed (POS-focused with inventory) across pricing, focus, and integration approach.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><Shield className="mx-auto mb-2" />Inventory-first</div>
            <div className="bg-white border rounded-xl p-4"><DollarSign className="mx-auto mb-2" />Free tier</div>
            <div className="bg-white border rounded-xl p-4"><Clock className="mx-auto mb-2" />5-7 days</div>
            <div className="bg-white border rounded-xl p-4"><ShoppingCart className="mx-auto mb-2" />POS agnostic</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Lightspeed" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Inventory-First vs POS-First</h2>
            <p className="text-gray-600 mb-4">
              StockFlow and Lightspeed serve different primary purposes.
            </p>
            <p className="text-gray-600 mb-4">
              Lightspeed is a POS system with inventory features included. It's designed for retail businesses wanting an all-in-one POS and inventory solution, but this means inventory features are secondary to POS functionality.
            </p>
            <p className="text-gray-600">
              StockFlow is inventory-first software designed specifically for stock management, warehouses, and barcode scanning. It integrates with any POS system via API, allowing you to keep your existing POS while getting superior inventory management.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <ul className="space-y-4">
              <li><strong>StockFlow:</strong> Inventory-first, POS-agnostic, free tier, focused.</li>
              <li><strong>Lightspeed:</strong> POS-first, inventory included, $69+/month, comprehensive.</li>
              <li><strong>Result:</strong> StockFlow is better for inventory-focused businesses; Lightspeed is better if you need a new POS system.</li>
            </ul>
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
            name: "StockFlow vs Lightspeed",
            url: "https://www.stockflowsystems.com/stockflow-vs-lightspeed",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}

