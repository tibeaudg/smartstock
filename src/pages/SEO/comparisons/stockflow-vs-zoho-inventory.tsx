import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';

export default function StockFlowVsZohoInventory() {
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
    { feature: 'Pricing', stockflow: 'Completely Free Forever', competitor: 'Trial only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/India only' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'Responsive', competitor: 'Variable' },
    { feature: 'Starting Price', stockflow: 'Completely Free Forever', competitor: '$59/month' },
  ];

  const faqData = [
    {
      question: "StockFlow vs Zoho Inventory: Which is better for European businesses?",
      answer: "StockFlow is better for European businesses due to GDPR-compliant EU data hosting, completely free forever with all features included, and simpler interface. Zoho Inventory stores data in US/India servers and requires $59/month minimum. StockFlow offers better value for European SMEs with local data hosting and no costs ever."
    },
    {
      question: "What is the main difference between StockFlow and Zoho Inventory?",
      answer: "StockFlow is completely free forever with unlimited products, European data hosting, and a simpler interface focused on inventory management. Zoho Inventory requires $59/month minimum, stores data in US/India, and has a more complex interface with many features. StockFlow is better for small businesses, while Zoho suits larger operations already using Zoho's ecosystem."
    },
    {
      question: "Is Zoho Inventory more feature-rich than StockFlow?",
      answer: "Zoho Inventory has more features as part of the Zoho ecosystem, including advanced reporting and integration with other Zoho products. However, StockFlow provides all essential inventory management features with a cleaner, more focused interface. For most SMEs, StockFlow's feature set is sufficient and easier to use."
    },
    {
      question: "How much does Zoho Inventory cost compared to StockFlow?",
      answer: "Zoho Inventory costs $59/month minimum (approximately �54/month), totaling �648/year. StockFlow offers a free plan for up to 30 products, then tiered pricing starting at �29/month. For small businesses, StockFlow can save over �600/year compared to Zoho's minimum pricing."
    },
    {
      question: "Which has better data privacy: StockFlow or Zoho Inventory?",
      answer: "StockFlow has better data privacy for European businesses with GDPR-compliant EU data hosting. Zoho Inventory stores data in US/India servers, which may not meet all European data protection requirements. StockFlow ensures your inventory data stays within the EU."
    },
    {
      question: "Can I migrate from Zoho Inventory to StockFlow?",
      answer: "Yes, StockFlow offers free data migration from Zoho Inventory and other inventory systems. The migration typically takes 2-3 days and includes importing products, stock levels, locations, and historical data. StockFlow's success team handles the entire migration process at no additional cost."
    }
  ];

  return (
    <SeoPageLayout 
      title="StockFlow vs Zoho Inventory"
      heroTitle="StockFlow vs Zoho Inventory"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Zoho Inventory 2025 - Save €600/Year, EU Hosting | StockFlow"
        description="Compare StockFlow vs Zoho Inventory 2025. Completely free forever vs $59/month, save 100% costs. European data hosting, GDPR compliance, simpler interface. Better for European SMEs. Start free - no credit card required."
        keywords="stockflow vs zoho inventory, zoho inventory alternative, inventory management software, cloud inventory, zoho inventory comparison, stockflow vs zoho, best zoho alternative, zoho inventory vs stockflow, european inventory software, gdpr compliant inventory"
        url="https://www.stockflow.be/stockflow-vs-zoho-inventory"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            While Zoho Inventory is feature-rich, StockFlow offers better value with European data hosting, 
            simpler interface, and free plan for small businesses.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison</h2>
          <ComparisonTable competitorName="Zoho Inventory" features={comparisonFeatures} />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StockFlow is Better for European Businesses</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Better Pricing</h3>
              <p className="text-gray-600 mb-3">Free forever for up to 100 products. Zoho charges $59/month minimum.</p>
              <p className="text-lg font-bold text-green-600">Save €600+ per year</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">European Privacy</h3>
              <p className="text-gray-600 mb-3">GDPR-compliant with EU data hosting. Zoho stores data in US/India.</p>
              <p className="text-lg font-bold text-blue-600">100% GDPR compliant</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler Interface</h3>
              <p className="text-gray-600 mb-3">Clean, focused on inventory. Zoho can feel cluttered with features.</p>
              <p className="text-lg font-bold text-purple-600">Easier to use</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Comparison: StockFlow vs Zoho Inventory</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Value</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Completely free forever - unlimited products, all features included. No setup fees, no hidden costs, no payments ever.
                </p>
                <p className="text-gray-700">
                  <strong>Zoho Inventory:</strong> $59/month minimum (approximately €54/month), totaling €648/year. Additional setup and integration costs may apply.
                </p>
                <p className="text-green-600 font-semibold mt-2">StockFlow saves small businesses over €600/year compared to Zoho's minimum pricing.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Data Privacy & Compliance</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> GDPR-compliant with data hosted in the European Union. Your inventory data stays within EU borders, meeting all European data protection requirements.
                </p>
                <p className="text-gray-700">
                  <strong>Zoho Inventory:</strong> Data stored in US/India servers, which may not fully comply with all European data protection requirements. This can be a concern for businesses handling sensitive inventory data.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ease of Use</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Clean, intuitive interface focused specifically on inventory management. Designed for small to medium businesses, with guided onboarding and simple workflows.
                </p>
                <p className="text-gray-700">
                  <strong>Zoho Inventory:</strong> Part of the larger Zoho ecosystem, which can feel overwhelming for businesses that only need inventory management. More features mean more complexity.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Implementation Time</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Most businesses are operational within 5-7 days. Free data migration and guided setup included.
                </p>
                <p className="text-gray-700">
                  <strong>Zoho Inventory:</strong> Typically 30-60 days for full implementation, especially if integrating with other Zoho products. May require consultant assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">When to Choose StockFlow vs Zoho Inventory</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose StockFlow If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You're a European business needing GDPR-compliant data hosting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want a free plan to start (up to 100 products)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You need a simple, focused inventory management solution</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want fast implementation (5-7 days)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You're a small to medium business (SME)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Zoho Inventory If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You're already using multiple Zoho products and want ecosystem integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You need advanced reporting and analytics beyond inventory</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You're a large enterprise with complex requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Data location (US/India) is not a concern for your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You have budget for $59+/month minimum</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Cost Comparison: StockFlow vs Zoho Inventory</h2>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-r border-gray-200 pr-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">StockFlow</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Free Plan (100 products)</span>
                    <span className="font-bold text-green-600">€0/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Growth Plan (500 products)</span>
                    <span className="font-bold text-blue-600">€14.50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Setup & Migration</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="text-lg font-semibold">Year 1 Total (500 products)</span>
                    <span className="text-lg font-bold text-green-600">€174</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">Zoho Inventory</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Standard Plan</span>
                    <span className="font-bold text-gray-600">€54/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Setup & Integration</span>
                    <span className="font-bold text-gray-600">€500-€1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Training (optional)</span>
                    <span className="font-bold text-gray-600">€200-€500</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="text-lg font-semibold">Year 1 Total</span>
                    <span className="text-lg font-bold text-gray-600">€1,200-€3,600</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
              <p className="text-xl font-bold text-green-700 mb-2">StockFlow saves €1,000-€3,400 in the first year</p>
              <p className="text-gray-700">Plus free plan option and faster implementation</p>
            </div>
          </div>
        </div>
      </section>




      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with StockFlow Today</h2>
          <p className="text-xl mb-8 opacity-90">Better pricing, European hosting, simpler to use. Start free now.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={[
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
          "@id": "https://www.stockflow.be/stockflow-vs-zoho-inventory",
          "name": "StockFlow vs Zoho Inventory Comparison",
          "headline": "StockFlow vs Zoho Inventory: The Better Choice for European SMEs",
          "description": "Compare StockFlow vs Zoho Inventory: Free plan vs $59/month, European hosting, simpler interface. See detailed comparison.",
          "url": "https://www.stockflow.be/stockflow-vs-zoho-inventory",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split("T")[0]
        }
      ]} />
    </SeoPageLayout>
  );
}



