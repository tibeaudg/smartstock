import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star, Clock } from 'lucide-react';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';

export default function StockFlowVsCin7() {
  usePageRefresh();
  const [roiInputs, setRoiInputs] = useState({
    inventoryValue: '',
    hoursPerWeek: '',
    hourlyRate: '',
    stockoutLosses: ''
  });
  const [roiResult, setRoiResult] = useState<{
    carryingCostSavings: number;
    timeSavings: number;
    stockoutSavings: number;
    netSavings: number;
    roi: number;
  } | null>(null);

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan', stockflow: true, competitor: '14-day trial only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: true, competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Australia only' },
    { feature: 'Implementation Time', stockflow: '5-7 days', competitor: '45-90 days' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Complex' },
    { feature: 'Customer Support', stockflow: '24/7', competitor: 'Business hours' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$300/month' },
    { feature: 'Setup Cost', stockflow: 'Free', competitor: '$2,000-$5,000' },
  ];

  const faqData = [
    {
      question: "StockFlow vs Cin7: Which is better for small businesses?",
      answer: "StockFlow is better for small businesses with its free plan for up to 100 SKUs, 5-7 day implementation, and transparent pricing starting at €0.004 per SKU/month. Cin7 requires $300/month minimum plus $2,000-$5,000 setup costs and 45-90 day implementations, making it better suited for larger enterprises with complex omnichannel needs."
    },
    {
      question: "What is the main difference between StockFlow and Cin7?",
      answer: "The main differences are: (1) Pricing - StockFlow offers free plans vs. Cin7's $300+/month minimum, (2) Implementation - StockFlow goes live in 5-7 days vs. Cin7's 45-90 days, (3) Setup costs - StockFlow is free vs. Cin7's $2,000-$5,000, (4) Data hosting - StockFlow uses European servers vs. Cin7's US/Australia hosting, (5) Support - StockFlow offers 24/7 support vs. Cin7's business hours only."
    },
    {
      question: "Is Cin7 better than StockFlow for omnichannel retail?",
      answer: "Cin7 has strong omnichannel features, but StockFlow also supports multi-channel sales with integrations to Shopify, Amazon, WooCommerce, and 45+ platforms. For most businesses, StockFlow's faster implementation, lower cost, and European data hosting make it the better choice. Cin7 may be preferable only for very large enterprises with complex omnichannel requirements and budgets exceeding $50,000/year."
    },
    {
      question: "How much does Cin7 cost compared to StockFlow?",
      answer: "Cin7 costs $300+/month plus $2,000-$5,000 setup fees, totaling $5,600-$8,600 in year 1. StockFlow offers a free plan for up to 100 SKUs, then €0.004 per SKU/month (€0.48/year per SKU). For 1,000 SKUs, StockFlow costs approximately €348/year vs. Cin7's $3,600+/year, representing 90%+ cost savings."
    },
    {
      question: "Which has better customer support: StockFlow or Cin7?",
      answer: "StockFlow offers 24/7 support via chat, phone, and email with dedicated success managers. Cin7 provides business hours support primarily via email and chat. StockFlow's support is included in all plans, while Cin7 may require premium tiers for priority support."
    },
    {
      question: "Can I migrate from Cin7 to StockFlow?",
      answer: "Yes, StockFlow offers free data migration from Cin7 and other inventory systems. The migration typically takes 2-3 days and includes importing products, stock levels, locations, and historical data. StockFlow's success team handles the entire migration process at no additional cost."
    }
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://www.stockflow.be/stockflow-vs-cin7",
      "name": "StockFlow vs Cin7 Comparison",
      "headline": "StockFlow vs Cin7: The Better Choice for Growing Businesses",
      "description": "Compare StockFlow vs Cin7 2025. Free plan vs $300/month, 5-7 day setup vs 45-90 days, European hosting, better pricing. See detailed comparison and start free trial.",
      "url": "https://www.stockflow.be/stockflow-vs-cin7",
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split("T")[0]
    }
  ];

  return (
    <SeoPageLayout 
      title="StockFlow vs Cin7"
      heroTitle="StockFlow vs Cin7"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Stockflow Vs Cin7 2025 - Stockflow Vs Cin7"
        description="Find out how stockflow vs cin7 to optimize your inventory management. Find out how stockflow vs cin7 to save time and. Start free today. StockFlow helps busi..."
        keywords="stockflow vs cin7, cin7 alternative, cin7 vs stockflow, cin7 inventory management, stockflow vs cin7 comparison, cin7 pricing, best cin7 alternative, inventory management software comparison, omnichannel inventory software, cin7 competitor, stockflow inventory software, cin7 vs stockflow pricing, inventory management software for small business, best inventory software 2025"
        url="https://www.stockflow.be/stockflow-vs-cin7"
        structuredData={structuredData}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          While Cin7 is powerful for large enterprises, StockFlow offers better value with free plans, 5-7 day implementation, European data hosting, and transparent pricing that scales with your business.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          This comparison helps you understand the key differences between StockFlow and Cin7, so you can make an informed decision for your inventory management needs.
        </p>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison: StockFlow vs Cin7</h2>
          <ComparisonTable competitorName="Cin7" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StockFlow is Better for Most Businesses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">90% Cost Savings</h3>
              <p className="text-gray-600">Free plan vs. $300/month minimum. StockFlow costs €348/year for 1,000 SKUs vs. Cin7's $3,600+/year.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">10x Faster Setup</h3>
              <p className="text-gray-600">5-7 days vs. 45-90 days. StockFlow's guided onboarding gets you live in under a week.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">European Privacy</h3>
              <p className="text-gray-600">GDPR-compliant with EU data hosting. Cin7 stores data in US/Australia servers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock support included. Cin7 offers business hours support only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Pricing Comparison: StockFlow vs Cin7</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost Factor</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Cin7</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Free Plan</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">✅ Up to 100 SKUs</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">❌ 14-day trial only</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Starting Price</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">€0/month</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">$300/month</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Setup/Implementation</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Free (5-7 days)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">$2,000-$5,000 (45-90 days)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Year 1 Total (1,000 SKUs)</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">€348</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">$5,600-$8,600</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Data Hosting</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">European (GDPR)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">US/Australia</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Support Availability</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">24/7 included</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Business hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Cost Savings:</strong> For a business with 1,000 SKUs, StockFlow saves approximately <strong>€5,252-€8,252 in year 1</strong> compared to Cin7, representing 90%+ cost reduction.
            </p>
          </div>
        </div>
      </section>


    </SeoPageLayout>
  );
}

