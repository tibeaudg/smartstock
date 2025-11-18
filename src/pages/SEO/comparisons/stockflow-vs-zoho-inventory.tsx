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
    { feature: 'Free Plan', stockflow: true, competitor: 'Trial only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: 'Via API', competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/India only' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: 'Responsive', competitor: 'Variable' },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$59/month' },
  ];

  const faqData = [
    {
      question: "StockFlow vs Zoho Inventory: Which is better for European businesses?",
      answer: "StockFlow is better for European businesses due to GDPR-compliant EU data hosting, free plan for small businesses, and simpler interface. Zoho Inventory stores data in US/India servers and requires $59/month minimum. StockFlow offers better value for European SMEs with local data hosting and pricing in euros."
    },
    {
      question: "What is the main difference between StockFlow and Zoho Inventory?",
      answer: "StockFlow offers a free plan for up to 30 products, European data hosting, and a simpler interface focused on inventory management. Zoho Inventory requires $59/month minimum, stores data in US/India, and has a more complex interface with many features. StockFlow is better for small businesses, while Zoho suits larger operations already using Zoho's ecosystem."
    },
    {
      question: "Is Zoho Inventory more feature-rich than StockFlow?",
      answer: "Zoho Inventory has more features as part of the Zoho ecosystem, including advanced reporting and integration with other Zoho products. However, StockFlow provides all essential inventory management features with a cleaner, more focused interface. For most SMEs, StockFlow's feature set is sufficient and easier to use."
    },
    {
      question: "How much does Zoho Inventory cost compared to StockFlow?",
      answer: "Zoho Inventory costs $59/month minimum (approximately €54/month), totaling €648/year. StockFlow offers a free plan for up to 30 products, then tiered pricing starting at €29/month. For small businesses, StockFlow can save over €600/year compared to Zoho's minimum pricing."
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
    <SeoPageLayout title="StockFlow vs Zoho Inventory">
      <SEO
        title="Stockflow Vs Zoho Inventory 2025 - Stockflow Vs Zoho"
        description="Discover how stockflow vs zoho inventory to optimize your inventory management. Read the guide stockflow vs zoho inventory to automate your. Start free today."
        keywords="stockflow vs zoho inventory, zoho inventory alternative, inventory management software, cloud inventory, zoho inventory comparison, stockflow vs zoho, best zoho alternative, zoho inventory vs stockflow, european inventory software, gdpr compliant inventory"
        url="https://www.stockflow.be/stockflow-vs-zoho-inventory"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            StockFlow vs Zoho Inventory: <span className="text-blue-600">The Better Choice for European SMEs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Better Pricing</h3>
              <p className="text-gray-600">Free forever for up to 30 products. Zoho charges $59/month minimum.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">European Privacy</h3>
              <p className="text-gray-600">GDPR-compliant with EU data hosting. Zoho stores data in US/India.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simpler Interface</h3>
              <p className="text-gray-600">Clean, focused on inventory. Zoho can feel cluttered with features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Calculate Your Savings: StockFlow vs Zoho Inventory
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how much you can save by choosing StockFlow over Zoho Inventory with our interactive ROI calculator.
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
                    onChange={(e) => setRoiInputs({...roiInputs, inventoryValue: e.target.value})}
                    placeholder="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent on Inventory/Week</label>
                  <input
                    type="number"
                    value={roiInputs.hoursPerWeek}
                    onChange={(e) => setRoiInputs({...roiInputs, hoursPerWeek: e.target.value})}
                    placeholder="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (€)</label>
                  <input
                    type="number"
                    value={roiInputs.hourlyRate}
                    onChange={(e) => setRoiInputs({...roiInputs, hourlyRate: e.target.value})}
                    placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Stockout Losses (€)</label>
                  <input
                    type="number"
                    value={roiInputs.stockoutLosses}
                    onChange={(e) => setRoiInputs({...roiInputs, stockoutLosses: e.target.value})}
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
                    const zohoCost = 708; // €59/month * 12
                    const stockflowCost = 174; // Annual cost
                    const costSavings = zohoCost - stockflowCost;
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
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your Potential Annual Savings vs Zoho</h4>
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
                        <span className="text-gray-600">Cost savings vs Zoho:</span>
                        <span className="font-bold text-green-600 ml-2">€534/year</span>
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

      {/* Video Demo Section */}
      <section id="video-demo" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch how StockFlow compares to Zoho Inventory and why European businesses choose StockFlow.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2">Product Demo Video</p>
                <p className="text-sm text-gray-300">Click to watch 3-minute overview</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-20"></div>
              <div className="absolute inset-0" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3}}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              <Link to="/demo" className="text-blue-600 hover:underline font-semibold">
                Schedule a personalized demo →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Buyer's Guide Download Section */}
      <section id="buyers-guide" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Download Free Comparison Guide</h2>
            <p className="text-lg mb-6 opacity-90">
              Get our comprehensive guide: "StockFlow vs Zoho Inventory: Complete Comparison 2025"
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What's Inside:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ Feature-by-feature comparison</li>
                  <li>✓ Pricing breakdown</li>
                  <li>✓ Implementation timeline</li>
                  <li>✓ ROI calculation worksheet</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">You'll Learn:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ Which platform fits your needs</li>
                  <li>✓ Hidden costs to watch for</li>
                  <li>✓ Migration considerations</li>
                  <li>✓ Best practices for switching</li>
                </ul>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Download Free Guide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm mt-4 opacity-75">No credit card required. Instant download.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions: StockFlow vs Zoho Inventory</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about choosing between StockFlow and Zoho Inventory for inventory management.
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
          <p className="text-xl mb-8 opacity-90">Better pricing, European hosting, simpler to use. Start free now.</p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
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



