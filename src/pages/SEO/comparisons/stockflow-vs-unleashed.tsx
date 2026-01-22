import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { DollarSign, Shield, Clock, Database } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function StockFlowVsUnleashed() {
  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Free core plan + low-cost scaling', competitor: 'NZ$99-$249/month' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API & webhooks', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'New Zealand/Australia' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'EU-based, responsive', competitor: 'NZ/AU-based' },
    { feature: 'Starting Price', stockflow: '€0', competitor: 'NZ$99/month (€60)' },
    { feature: 'Implementation Time', stockflow: '5–7 days', competitor: '30–60 days' },
    { feature: 'Data Migration Assistance', stockflow: 'Free, done-for-you', competitor: 'Paid' },
    { feature: 'API Access', stockflow: true, competitor: true },
    { feature: 'GDPR Tooling (DPA, exports)', stockflow: true, competitor: 'Partial' }
  ];

  const faqData = [
    {
      question: "StockFlow vs Unleashed: Which is better for European businesses?",
      answer: "StockFlow is better for European businesses with EU-only data hosting, GDPR compliance, and EU-based support. Unleashed is New Zealand/Australia-focused with data hosting outside the EU. StockFlow also offers a free tier vs Unleashed's NZ$99/month minimum."
    },
    {
      question: "What is the main difference between StockFlow and Unleashed?",
      answer: "StockFlow is modern cloud-based inventory software with free tier and EU hosting. Unleashed is established inventory software starting at NZ$99/month (€60) with NZ/AU focus. StockFlow offers faster setup (5-7 days vs 30-60 days) and better GDPR compliance for European businesses."
    },
    {
      question: "How much does Unleashed cost compared to StockFlow?",
      answer: "Unleashed costs NZ$99-$249/month (€60-€150) depending on features. StockFlow offers a free tier with paid plans starting around €29/month. Over three years, StockFlow costs €0-€1,044 vs Unleashed's €2,160-€5,400."
    },
    {
      question: "Can I migrate from Unleashed to StockFlow?",
      answer: "Yes. StockFlow provides free assisted migration from Unleashed including products, warehouses, suppliers, stock levels, historical movements, and SKUs. Most migrations complete within 2-3 business days without downtime."
    },
    {
      question: "Which has better inventory features: StockFlow or Unleashed?",
      answer: "Both offer comprehensive inventory features. StockFlow excels in ease of use, EU compliance, and free tier. Unleashed offers strong manufacturing features and NZ/AU market focus. For European businesses, StockFlow provides better value, compliance, and regional support."
    }
  ];

  const keyTakeaways = [
    'StockFlow offers free tier; Unleashed costs NZ$99-$249/month.',
    'StockFlow has EU data hosting; Unleashed is NZ/AU.',
    'StockFlow setup takes 5-7 days; Unleashed takes 30-60 days.',
    'StockFlow is better for European businesses needing GDPR compliance.',
    'Unleashed is better for NZ/AU businesses needing local support.'
  ];

  return (
    <SeoPageLayout
      title="StockFlow vs Unleashed"
      heroTitle="StockFlow vs Unleashed (2026 Full Comparison)"
      dateUpdated="22/01/2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Unleashed 2026 – Pricing, GDPR, EU Hosting"
        description="StockFlow vs Unleashed comparison: free tier vs NZ$99-$249/month, EU data hosting vs NZ/AU, GDPR compliance, and setup time. Find out which inventory software is better for European businesses."
        keywords="stockflow vs unleashed, unleashed alternative, gdpr inventory software, eu inventory software, unleashed vs stockflow"
        url="https://www.stockflowsystems.com/stockflow-vs-unleashed"
        publishedTime="2026-01-22T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">StockFlow vs Unleashed</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comparing modern European inventory software vs established NZ/AU platform? This breakdown shows StockFlow (EU-focused, free tier) vs Unleashed (NZ/AU-focused, NZ$99+/month) across pricing, compliance, and regional support.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><Shield className="mx-auto mb-2" />EU-focused</div>
            <div className="bg-white border rounded-xl p-4"><DollarSign className="mx-auto mb-2" />Free tier</div>
            <div className="bg-white border rounded-xl p-4"><Clock className="mx-auto mb-2" />5-7 days</div>
            <div className="bg-white border rounded-xl p-4"><Database className="mx-auto mb-2" />EU hosting</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Unleashed" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Regional Focus: EU vs NZ/AU</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-4">StockFlow (EU-Focused)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ EU-only data hosting</li>
                <li>✓ GDPR compliance built-in</li>
                <li>✓ EU-based customer support</li>
                <li>✓ VAT-ready workflows</li>
                <li>✓ Multilingual support</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Unleashed (NZ/AU-Focused)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• New Zealand/Australia data hosting</li>
                <li>• GDPR requires additional setup</li>
                <li>• NZ/AU-based support</li>
                <li>• NZ/AU tax workflows</li>
                <li>• English-focused</li>
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
            name: "StockFlow vs Unleashed",
            url: "https://www.stockflowsystems.com/stockflow-vs-unleashed",
            datePublished: "2026-01-22",
            dateModified: new Date().toISOString().split('T')[0]
          }
        ]}
      />
    </SeoPageLayout>
  );
}


