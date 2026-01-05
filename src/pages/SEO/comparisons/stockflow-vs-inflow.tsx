import { useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { ArrowRight, CheckCircle, DollarSign, Smartphone, Zap, Shield, Star, Clock, Database, Download, Settings, Users } from 'lucide-react';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';


export default function StockFlowVsInFlow() {
  usePageRefresh();


  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Pricing', stockflow: 'Completely Free Forever', competitor: '14-day trial only' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Multi-channel Sales', stockflow: true, competitor: true },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Multi-warehouse', stockflow: true, competitor: true },
    { feature: 'European Data Hosting', stockflow: true, competitor: 'US/Canada only' },
    { feature: 'Bill of Materials (BOM)', stockflow: true, competitor: true },
    { feature: 'Manufacturing Features', stockflow: 'Basic', competitor: 'Advanced' },
    { feature: 'Ease of Use', stockflow: 'Very Easy', competitor: 'Moderate' },
    { feature: 'Customer Support', stockflow: '24/7', competitor: 'Business hours' },
    { feature: 'Starting Price', stockflow: 'Completely Free Forever', competitor: '$71/month' },
    { feature: 'Setup Cost', stockflow: 'Free', competitor: 'May charge extra' },
    { feature: 'Implementation Time', stockflow: '5-7 days', competitor: '30-60 days' },
  ];

  const faqData = [
    {
      question: "StockFlow vs InFlow: Which is better for small businesses?",
      answer: "StockFlow is better for small businesses - it's completely free forever with unlimited SKUs and all features included, 5-7 day implementation, and no payments ever required. InFlow requires $71/month minimum (approximately €65/month), totaling €780/year, and typically takes 30-60 days to implement. StockFlow offers better value and faster setup for growing businesses."
    },
    {
      question: "What is the main difference between StockFlow and InFlow?",
      answer: "The main differences are: (1) Pricing - StockFlow is completely free forever vs. InFlow's $71/month minimum, (2) Implementation - StockFlow goes live in 5-7 days vs. InFlow's 30-60 days, (3) Data hosting - StockFlow uses European servers vs. InFlow's US/Canada hosting, (4) Support - StockFlow offers 24/7 support vs. InFlow's business hours, (5) Ease of use - StockFlow is designed for simplicity vs. InFlow's more complex interface focused on manufacturing."
    },
    {
      question: "Is InFlow better than StockFlow for manufacturing businesses?",
      answer: "InFlow has stronger manufacturing features with advanced BOM management and production workflows. However, StockFlow also supports BOM and basic manufacturing needs. For most businesses, StockFlow being completely free forever, faster implementation, European hosting, and 24/7 support make it the better choice. InFlow may be preferable only for businesses with complex manufacturing requirements and budgets exceeding $850/year."
    },
    {
      question: "How much does InFlow cost compared to StockFlow?",
      answer: "InFlow costs $71/month minimum (approximately €65/month), totaling €780/year. StockFlow is completely free forever with unlimited SKUs and all features included. StockFlow saves you 100% of InFlow's costs (€780/year), plus includes free setup and migration, while InFlow may charge extra."
    },
    {
      question: "Which has better customer support: StockFlow or InFlow?",
      answer: "StockFlow offers 24/7 support via chat, phone, and email with dedicated success managers. InFlow provides business hours support primarily via email and chat. StockFlow's support is included in all plans, while InFlow may require premium tiers for priority support. For European businesses, StockFlow's EU-based support ensures faster response times."
    },
    {
      question: "Can I migrate from InFlow to StockFlow?",
      answer: "Yes, StockFlow offers free data migration from InFlow and other inventory systems. The migration typically takes 2-3 days and includes importing products, stock levels, locations, BOMs, and historical data. StockFlow's success team handles the entire migration process at no additional cost, ensuring a smooth transition from InFlow."
    },
    {
      question: "Does InFlow have better features than StockFlow?",
      answer: "InFlow has stronger manufacturing features with advanced BOM management, production planning, and assembly workflows. However, StockFlow provides all essential inventory management features including BOM support, multi-location tracking, barcode scanning, e-commerce integration, and mobile access. For most businesses, StockFlow's feature set is sufficient and easier to use, while InFlow's complexity may be overkill."
    },
    {
      question: "Which is easier to use: StockFlow or InFlow?",
      answer: "StockFlow is designed for ease of use with an intuitive interface and guided onboarding. InFlow has a steeper learning curve due to its focus on manufacturing workflows and advanced features. Most users find StockFlow easier to learn and use daily, while InFlow requires more training and may feel overwhelming for businesses that don't need advanced manufacturing features."
    },
    {
      question: "Does StockFlow support manufacturing like InFlow?",
      answer: "StockFlow supports basic manufacturing needs including Bill of Materials (BOM), assembly management, and production tracking. InFlow offers more advanced manufacturing features like production planning, work orders, and complex assembly workflows. For most businesses, StockFlow's manufacturing features are sufficient, while InFlow is better suited for complex manufacturing operations."
    },
    {
      question: "Is InFlow's on-premise option better than StockFlow's cloud solution?",
      answer: "InFlow offers both cloud and on-premise options, while StockFlow is cloud-based. Cloud solutions like StockFlow offer automatic updates, anywhere access, and no IT maintenance. On-premise solutions require IT infrastructure, maintenance, and updates. For most businesses, StockFlow's cloud solution is more convenient and cost-effective, while on-premise may be preferred only for businesses with strict data residency requirements."
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
      "@id": "https://www.stockflowsystems.com/stockflow-vs-inflow",
      "name": "StockFlow vs InFlow Comparison",
      "headline": "StockFlow vs InFlow: The Better Choice for Growing Businesses",
      "description": "Compare StockFlow vs InFlow 2025. Free forever vs $71/month, 5-7 day setup vs 30-60 days. EU hosting. Save 100% costs, faster setup.",
      "url": "https://www.stockflowsystems.com/stockflow-vs-inflow",
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflowsystems.com"
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split("T")[0]
    }
  ];

  const migrationSteps = [
    {
      step: 1,
      title: "Export Data from InFlow",
      description: "Export your inventory data from InFlow including products, quantities, locations, BOMs, and historical data. InFlow supports CSV export for most data types.",
      icon: Download,
      timeframe: "1-2 hours"
    },
    {
      step: 2,
      title: "Import to StockFlow",
      description: "Our team provides free setup assistance to import your InFlow data into StockFlow. We'll help map your InFlow structure to StockFlow, including BOMs and product relationships.",
      icon: Database,
      timeframe: "1 day"
    },
    {
      step: 3,
      title: "Configure Manufacturing Features",
      description: "Set up your BOMs, assembly processes, and production workflows in StockFlow. Our team will help migrate your manufacturing data and ensure all relationships are preserved.",
      icon: Settings,
      timeframe: "1-2 days"
    },
    {
      step: 4,
      title: "Train Your Team",
      description: "We provide free training for your team on using StockFlow, including manufacturing features, barcode scanning, and reporting. Most users are productive within a week.",
      icon: Users,
      timeframe: "2-4 hours"
    },
    {
      step: 5,
      title: "Go Live",
      description: "Start using StockFlow for daily operations. Your team can access inventory from any device, manage BOMs, track production, and get real-time updates across all locations.",
      icon: Zap,
      timeframe: "Immediate"
    }
  ];

  return (
    <SeoPageLayout 
      title="StockFlow vs InFlow"
      heroTitle="StockFlow vs InFlow: The Better Choice for Growing Businesses"
      updatedDate={new Date().toISOString().split("T")[0]}
      faqData={faqData}
    >
      <SEO
        title="StockFlow vs InFlow 2025 - Save 55% Costs, 10x Faster Setup | StockFlow"
        description="Compare StockFlow vs InFlow 2025. Free forever vs $71/month, 5-7 day setup vs 30-60 days, European hosting. Save 100% costs, 10x faster setup."
        keywords="stockflow vs inflow, inflow alternative, inflow vs stockflow, inflow inventory management, stockflow vs inflow comparison, inflow pricing, best inflow alternative, inventory management software comparison, manufacturing inventory software, inflow competitor, stockflow inventory software, inflow vs stockflow pricing, inventory management software for small business, best inventory software 2025"
        url="https://www.stockflowsystems.com/stockflow-vs-inflow"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          InFlow costs $71+/month and takes 30-60 days to implement. StockFlow is free forever, goes live in 5-7 days, and stores data in Europe (GDPR compliant). For manufacturing businesses, that's €850+ saved in year one, plus faster time-to-value.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          InFlow works well for complex manufacturing with deep BOM tracking. StockFlow handles light to medium manufacturing while offering faster setup, European hosting, and zero ongoing costs. If you need advanced shop-floor scheduling, InFlow might fit better. For most growing manufacturers, StockFlow delivers the same core features without the price tag.
        </p>
      </div>



      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={2}
        />
      )}

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Feature Comparison: StockFlow vs InFlow</h1>
          <ComparisonTable competitorName="InFlow" features={comparisonFeatures} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StockFlow is Better for Most Businesses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">55% Cost Savings</h3>
              <p className="text-gray-600">Free plan vs. $71/month minimum. StockFlow costs €348/year for 1,000 SKUs vs. InFlow's €780/year.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">10x Faster Setup</h3>
              <p className="text-gray-600">5-7 days vs. 30-60 days. StockFlow's guided onboarding gets you live in under a week.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">European Privacy</h3>
              <p className="text-gray-600">GDPR-compliant with EU data hosting. InFlow stores data in US/Canada servers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock support included. InFlow offers business hours support only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Pricing Comparison: StockFlow vs InFlow</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost Factor</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">InFlow</th>
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
                  <td className="px-6 py-4 text-center text-sm text-gray-600">$71/month (€65/month)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Setup/Implementation</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Free (5-7 days)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">May charge extra (30-60 days)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Year 1 Total (1,000 SKUs)</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">€348</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">€780+</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Data Hosting</td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">European (GDPR)</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">US/Canada</td>
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
              <strong>Cost Savings:</strong> For a business with 1,000 SKUs, StockFlow saves approximately <strong>€432 in year 1</strong> compared to InFlow, representing 55% cost reduction.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Detailed Comparison: StockFlow vs InFlow</h2>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Value</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Completely free forever - unlimited SKUs, all features included. No setup fees, no hidden costs, no payments ever.
                </p>
                <p className="text-gray-700">
                  <strong>InFlow:</strong> $71/month minimum (approximately €65/month), totaling €780/year. Additional setup and implementation costs may apply. Pricing can increase with additional features or users.
                </p>
                <p className="text-green-600 font-semibold mt-2">StockFlow saves businesses 55%+ compared to InFlow's minimum pricing.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Manufacturing Features</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Supports Bill of Materials (BOM), assembly management, and basic production tracking. Suitable for most manufacturing businesses with straightforward needs.
                </p>
                <p className="text-gray-700">
                  <strong>InFlow:</strong> Advanced manufacturing features including complex BOM management, production planning, work orders, and detailed assembly workflows. Better suited for complex manufacturing operations.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ease of Use</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Clean, intuitive interface designed for ease of use. Guided onboarding and simple workflows make it accessible for all team members.
                </p>
                <p className="text-gray-700">
                  <strong>InFlow:</strong> More complex interface focused on manufacturing workflows. Steeper learning curve, especially for users not familiar with manufacturing processes. May require more training.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Implementation Time</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> Most businesses are operational within 5-7 days. Free data migration and guided setup included.
                </p>
                <p className="text-gray-700">
                  <strong>InFlow:</strong> Typically 30-60 days for full implementation, especially for manufacturing setups. May require consultant assistance and additional setup fees.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Data Privacy & Compliance</h4>
                <p className="text-gray-700 mb-2">
                  <strong>StockFlow:</strong> GDPR-compliant with data hosted in the European Union. Your inventory data stays within EU borders, meeting all European data protection requirements.
                </p>
                <p className="text-gray-700">
                  <strong>InFlow:</strong> Data stored in US/Canada servers, which may not fully comply with all European data protection requirements. This can be a concern for businesses handling sensitive inventory data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">When to Choose StockFlow vs InFlow</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose StockFlow If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want a free plan to start (up to 100 SKUs)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You need fast implementation (5-7 days)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You're a European business needing GDPR-compliant data hosting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You need 24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You want a simpler, easier-to-use interface</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You have basic to moderate manufacturing needs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You're a small to medium business (SME)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose InFlow If:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You have complex manufacturing requirements with advanced BOM needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You need detailed production planning and work order management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You prefer on-premise deployment over cloud solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Data location (US/Canada) is not a concern for your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You have budget for $71+/month minimum</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You're okay with 30-60 day implementation timelines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>You're a large enterprise with complex manufacturing operations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Migrate from InFlow to StockFlow</h2>
          <div className="space-y-6">
            {migrationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Step {step.step}: {step.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {step.timeframe}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">Total Migration Time: 5-7 Days</p>
            <p className="text-gray-600">Including data import, BOM setup, and team training - all included free with StockFlow</p>
          </div>
        </div>
      </section>

    </SeoPageLayout>
  );
}

