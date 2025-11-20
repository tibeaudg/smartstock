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

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs Cin7: <span className="text-blue-600">The Better Choice for Growing Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            While Cin7 is powerful for large enterprises, StockFlow offers better value with free plans,
            5-7 day implementation, European data hosting, and transparent pricing that scales with your business.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Try StockFlow Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (<Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">4.8/5</div>
              <div className="text-sm text-gray-600">Based on 326 reviews</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Calculate Your Savings: StockFlow vs Cin7
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how much you can save by choosing StockFlow over Cin7 with our interactive ROI calculator.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Interactive ROI Calculator</h3>
            <p className="text-center text-gray-600 mb-8">Enter your numbers to see potential savings</p>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Inventory Value (€)</label>
                  <input
                    type="number"
                    value={roiInputs.inventoryValue}
                    onChange={(e) => setRoiInputs({ ...roiInputs, inventoryValue: e.target.value })}
                    placeholder="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent on Inventory/Week</label>
                  <input
                    type="number"
                    value={roiInputs.hoursPerWeek}
                    onChange={(e) => setRoiInputs({ ...roiInputs, hoursPerWeek: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (€)</label>
                  <input
                    type="number"
                    value={roiInputs.hourlyRate}
                    onChange={(e) => setRoiInputs({ ...roiInputs, hourlyRate: e.target.value })}
                    placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Stockout Losses (€)</label>
                  <input
                    type="number"
                    value={roiInputs.stockoutLosses}
                    onChange={(e) => setRoiInputs({ ...roiInputs, stockoutLosses: e.target.value })}
                    placeholder="12000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    const inventoryValue = parseFloat(roiInputs.inventoryValue || '0');
                    const hoursPerWeek = parseFloat(roiInputs.hoursPerWeek || '0');
                    const hourlyRate = parseFloat(roiInputs.hourlyRate || '0');
                    const stockoutLosses = parseFloat(roiInputs.stockoutLosses || '0');

                    const carryingCostSavings = inventoryValue * 0.35;
                    const timeSavings = hoursPerWeek * hourlyRate * 52;
                    const stockoutSavings = stockoutLosses * 0.8;
                    const cin7Cost = 3600; // $300/month * 12
                    const cin7Setup = 3500; // Average setup cost
                    const stockflowCost = 348; // Annual cost for 1,000 SKUs
                    const costSavings = (cin7Cost + cin7Setup) - stockflowCost;
                    const netSavings = carryingCostSavings + timeSavings + stockoutSavings + costSavings - stockflowCost;
                    const roi = stockflowCost > 0 ? ((netSavings / stockflowCost) * 100) : 0;

                    setRoiResult({
                      carryingCostSavings,
                      timeSavings,
                      stockoutSavings,
                      netSavings,
                      roi
                    });
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Calculate My ROI
                </button>
                {roiResult && (
                  <div className="mt-6 p-6 bg-green-50 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your Potential Annual Savings vs Cin7</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Carrying cost savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.carryingCostSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.timeSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stockout reduction:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.stockoutSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost savings vs Cin7:</span>
                        <span className="font-bold text-green-600 ml-2">€6,752/year</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Net Annual Savings:</span>
                        <span className="text-2xl font-bold text-green-600">€{roiResult.netSavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ROI:</span>
                        <span className="text-2xl font-bold text-green-600">{roiResult.roi.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions: StockFlow vs Cin7</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about choosing between StockFlow and Cin7 for inventory management.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="flex items-center justify-between px-6 py-5 text-left text-xl font-semibold hover:text-primary transition-colors">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-600 text-lg leading-relaxed">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with StockFlow Today</h2>
          <p className="text-xl mb-8 opacity-90">90% cost savings, 10x faster setup, European hosting. Start free now.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

