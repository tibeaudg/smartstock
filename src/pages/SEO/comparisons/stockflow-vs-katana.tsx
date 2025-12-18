import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Factory,
  Gauge,
  Layers,
  Shield,
  Star,
  Workflow
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

const comparisonRows = [
  {
    title: 'Who It’s Built For',
    stockflow: 'Operations teams that need real-time visibility across purchasing, stock and fulfilment. Ideal for SMEs scaling ecommerce, retail or light manufacturing.',
    competitor: 'Katana focuses on manufacturers that need production scheduling and shop-floor control. Less emphasis on downstream distribution and retail workflows.'
  },
  {
    title: 'Implementation Speed',
    stockflow: 'Launch in days with ready-to-use templates, guided onboarding and EU-based support.',
    competitor: 'Implementation often requires consultant support to configure production routing and shop-floor features.'
  },
  {
    title: 'Automation',
    stockflow: 'Automate replenishment, approvals, notifications and supplier collaboration without extra modules.',
    competitor: 'Automation is available but often tied to manufacturing-specific flows or paid add-ons.'
  },
  {
    title: 'Integrations',
    stockflow: 'Connect ecommerce, POS, accounting and logistics tools (Shopify, WooCommerce, Exact, Stripe, etc.).',
    competitor: 'Strong ERP and accounting connectors, but fewer native retail and POS integrations for omnichannel teams.'
  },
  {
    title: 'Pricing',
    stockflow: 'Completely free forever - unlimited products, unlimited users, all features included at no cost.',
    competitor: 'Pricing increases with sales orders and shop-floor operators, which can become costly as production grows.'
  }
];

export default function StockflowVsKatana() {
  usePageRefresh();
  
  // Get real customer data
  const relevantCaseStudies = getRelevantCaseStudies('inventory software');
  const relevantTestimonials = getRelevantTestimonials('inventory');
  const metrics = getProprietaryMetrics('inventory software');

  const faqData = [
    {
      question: "StockFlow vs Katana: Which is better for small to medium businesses?",
      answer: "StockFlow is better for SMEs that need fast implementation, omnichannel inventory management, and e-commerce integrations. Katana is better for manufacturers requiring deep shop-floor control and production scheduling. StockFlow is completely free forever and launches in days, while Katana requires more setup time and focuses on manufacturing workflows."
    },
    {
      question: "What is the main difference between StockFlow and Katana?",
      answer: "StockFlow unifies inventory, procurement, and fulfillment across multiple sales channels (e-commerce, retail, wholesale) with fast implementation. Katana focuses on manufacturing with production scheduling, shop-floor control, and BOM management. StockFlow is better for distribution and retail, while Katana excels at complex manufacturing operations."
    },
    {
      question: "Does Katana have better manufacturing features than StockFlow?",
      answer: "Yes, Katana has stronger manufacturing features including advanced production scheduling, shop-floor terminals, routing, and engineer-to-order workflows. StockFlow supports light manufacturing and assembly but focuses more on inventory management, procurement, and multi-channel fulfillment. Choose Katana for complex manufacturing, StockFlow for inventory and distribution."
    },
    {
      question: "How much does Katana cost compared to StockFlow?",
      answer: "StockFlow is completely free forever with unlimited products and all features included. Katana pricing increases with sales orders and shop-floor operators, typically starting higher and becoming more expensive as production scales. StockFlow eliminates all costs for growing SMEs."
    },
    {
      question: "Which has faster implementation: StockFlow or Katana?",
      answer: "StockFlow launches in 2-3 weeks with ready-to-use templates and guided onboarding. Katana implementation often requires consultant support to configure production routing and shop-floor features, typically taking longer. StockFlow's simpler setup makes it ideal for businesses wanting to go live quickly."
    },
    {
      question: "Can I integrate StockFlow with e-commerce platforms like Katana?",
      answer: "Yes, StockFlow has strong e-commerce integrations with Shopify, WooCommerce, and other platforms, plus POS and accounting connectors. Katana has strong ERP and accounting connectors but fewer native retail and POS integrations. StockFlow is better for omnichannel businesses selling through multiple channels."
    }
  ];

  return (
    <SeoPageLayout 
      title="StockFlow vs Katana"
      heroTitle="StockFlow vs Katana"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs Katana 2025 - Save 50% Costs, Faster Setup | StockFlow"
        description="Compare StockFlow vs Katana 2025. StockFlow for e-commerce/distribution, Katana for manufacturing. Completely free forever vs paid, 5-7 day setup vs 30+ days. Save 100% costs, faster implementation. Start free - no credit card required."
        keywords="stockflow vs katana, katana alternative, katana inventory comparison, stockflow comparison, katana vs stockflow, manufacturing inventory software, e-commerce inventory management, katana alternative for sme, stockflow vs katana pricing, inventory software comparison"
        url="https://www.stockflowsystems.com/stockflow-vs-katana"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>              <p className="text-xl text-gray-600 mb-8">
                Katana focuses on shop-floor scheduling. StockFlow unifies inventory, procurement and fulfilment for teams managing multiple sales channels. Compare the strengths of each platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Try StockFlow Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Compare Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ teams modernise operations with StockFlow</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="StockFlow vs Katana comparison"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved,
          averageCostSaved: metrics.averageCostSaved,
          keyMetric: metrics.keyMetric,
          feature: "Inventory Software"
        }}
        variant="compact"
      />

      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={2}
        />
      )}

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            StockFlow vs Katana: Feature Breakdown
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Capability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Katana</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {comparisonRows.map((row, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{row.title}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.stockflow}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SMEs Pick StockFlow</h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow puts inventory, procurement, manufacturing light-assembly and fulfilment on a single platform. Automations, approvals and analytics work across every channel you sell through.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Intuitive UI lets teams adopt StockFlow without intensive training.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Automate purchase orders, safety stock and supplier collaboration.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Gain omnichannel visibility, from ecommerce to wholesale and retail.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>EU-based hosting, GDPR compliance and multilingual support teams.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">StockFlow at a glance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementation</p>
                <p className="text-xl font-semibold">2-3 week rollout</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Automation Impact</p>
                <p className="text-xl font-semibold">70% manual tasks removed</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Workflow className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Workflows</p>
                <p className="text-xl font-semibold">Custom approvals & alerts</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Integrations</p>
                <p className="text-xl font-semibold">Shopify, Exact, POS & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">When Katana Is a Better Fit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Factory className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Deep Shop-Floor Control</h3>
              <p className="text-gray-600">
                If you require advanced production scheduling, routing and shop-floor terminals, Katana may suit complex manufacturing operations better.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Layers className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Engineer-to-Order Processes</h3>
              <p className="text-gray-600">
                Katana provides strong BOM versioning and production planning for engineer-to-order businesses. StockFlow focuses on standard, make-to-stock workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="default"
        />
      )}

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
          "@id": "https://www.stockflowsystems.com/stockflow-vs-katana",
          "name": "StockFlow vs Katana Comparison",
          "headline": "StockFlow vs Katana: Which Supports Your Expansion?",
          "description": "Compare StockFlow vs Katana: Free plan vs paid, 2-3 week setup vs longer, e-commerce focus vs manufacturing. See which fits your business.",
          "url": "https://www.stockflowsystems.com/stockflow-vs-katana",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflowsystems.com"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split("T")[0]
        }
      ]} />
    </SeoPageLayout>
  );
}


