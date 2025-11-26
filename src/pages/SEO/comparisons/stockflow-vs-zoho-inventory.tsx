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
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Zoho Inventory 2025 - European Alternative | StockFlow"
        description="Compare StockFlow vs Zoho Inventory 2025. Free plan vs $59/month, European data hosting, GDPR compliance, simpler interface. See detailed comparison for European businesses. Start free trial."
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



