import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import {
  Smartphone,
  QrCode,
  Scan,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Cloud,
  ShieldCheck,
  Clock,
  ListChecks,
  Layers,
  Database,
  Boxes,
  ClipboardCheck,
  Truck
} from 'lucide-react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { 
  CaseStudySection, 

  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

const features = [
  {
    icon: <Scan className="h-6 w-6" />,
    title: 'Lightning-Fast Barcode Capture',
    description: 'Sub-second recognition with auto-focus, glare detection, and vibration feedback for frictionless scanning.'
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Works on Every Device',
    description: 'Use any camera-enabled phone, tablet, rugged scanner, or laptop without installing native apps.'
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'Real-Time Inventory Sync',
    description: 'Update stock counts, reservations, and transfers instantly across warehouses, stores, and channels.'
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Error Prevention Controls',
    description: 'Enforce quantity thresholds, duplicate detection, and lot validation before updates go live.'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Operations Visibility',
    description: 'Track scan activity, top movers, and exceptions with dashboards built for operations and finance.'
  },
  {
    icon: <ListChecks className="h-6 w-6" />,
    title: 'Workflow Automation',
    description: 'Trigger pick lists, replenishment alerts, and quality checks with configurable scan-driven rules.'
  }
];

const metrics = [
  {
    icon: <Clock className="h-5 w-5" />,
    label: '< 1 sec',
    title: 'Average scan time',
    description: 'Designed for high-volume lines, cycle counts, and receiving docks.'
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    label: '99.7%',
    title: 'Scan accuracy',
    description: 'Built-in validation ensures clean data even with damaged labels.'
  },
  {
    icon: <Database className="h-5 w-5" />,
    label: '50K+',
    title: 'SKU records synced',
    description: 'Handles complex catalogs, variants, and serialized items at scale.'
  }
];

const workflowSteps = [
  {
    title: 'Launch the web scanner',
    description: 'Open StockFlow on any secure device and choose the scan workflow that matches your task.'
  },
  {
    title: 'Aim and capture',
    description: 'Our camera assistant guides placement, auto-focusing and verifying codes before submission.'
  },
  {
    title: 'Review in real time',
    description: 'See live product data, quantity prompts, and exception flags so you never miss a detail.'
  },
  {
    title: 'Sync and automate',
    description: 'Updates flow instantly to inventory, fulfillment, and analytics with audit trails for every scan.'
  }
];

const barcodeTypes = [
  {
    name: 'UPC & EAN',
    description: 'Core retail SKUs and consumer packaged goods.'
  },
  {
    name: 'Code 39 & Code 128',
    description: 'Logistics, warehousing, manufacturing, and asset tracking.'
  },
  {
    name: 'QR Code & Data Matrix',
    description: 'Field maintenance, traceability, marketing, and rental fleets.'
  },
  {
    name: 'ITF & GS1 DataBar',
    description: 'Carton labelling, pharmaceuticals, and wholesale distribution.'
  }
];

const useCases = [
  {
    icon: <Boxes className="h-6 w-6" />,
    title: 'Retail & Omnichannel',
    points: [
      'Cycle count store or backroom inventory in minutes.',
      'Keep eCommerce stock levels accurate for every channel.',
      'Empower associates with guided scan flows and smart prompts.'
    ]
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: 'Operations & Compliance',
    points: [
      'Capture lot, batch, and expiration data as you scan.',
      'Generate audit-ready trails automatically for every adjustment.',
      'Run investigations faster with search-ready scan history.'
    ]
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Warehouse & 3PL',
    points: [
      'Accelerate receiving, putaway, and replenishment tasks.',
      'Reduce mis-picks with verification prompts at packing stations.',
      'Integrate with WMS, ERP, and shipping tools through the StockFlow API.'
    ]
  }
];

const faqData = [
  {
    question: 'What are inventory alerts?',
    answer:
      'Inventory alerts are automated notifications that warn you when stock levels are low, when items need reordering, when there are discrepancies, or when important inventory events occur. They help you maintain optimal stock levels and prevent stockouts.'
  },
  {
    question: 'How do inventory alerts work?',
    answer:
      'Inventory alerts work by monitoring your stock levels in real-time. When inventory drops below a set threshold, when items are about to expire, or when other predefined conditions are met, the system automatically sends notifications via email, SMS, or in-app alerts.'
  },
  {
    question: 'What types of alerts can I set up?',
    answer:
      'You can set up alerts for low stock levels, reorder points, stockouts, expiration dates, price changes, unusual activity, and custom conditions. StockFlow allows you to configure alerts based on your specific business needs.'
  },
  {
    question: 'Can I customize alert thresholds?',
    answer:
      'Yes, you can customize alert thresholds for each product or product category. Set different minimum stock levels, reorder points, and alert frequencies based on your inventory turnover rates and business requirements.'
  },
  {
    question: 'How quickly will I receive alerts?',
    answer:
      'Alerts are sent in real-time as soon as the conditions are met. You can receive notifications immediately via email, SMS, or push notifications, ensuring you can take action quickly to prevent stockouts or other issues.'
  },
  {
    question: 'What is the ROI of inventory alerts?',
    answer: 'The ROI is typically very high. Businesses see: prevention of stockouts (which can cost 20% of lost sales), 25% reduction in carrying costs, improved cash flow, and better inventory turnover. Most businesses see ROI within the first month through stockout prevention and cost savings.'
  },
  {
    question: 'Can inventory alerts be customized by product category?',
    answer: 'Yes, StockFlow allows you to set different alert thresholds for different product categories. Fast-moving items can have higher reorder points, while slow-moving items can have lower thresholds. This ensures alerts are relevant and actionable for each product type.'
  },
  {
    question: 'How do inventory alerts prevent stockouts?',
    answer: 'Inventory alerts prevent stockouts by: monitoring stock levels in real-time, sending notifications when levels drop below reorder points, providing lead time information for reordering, and enabling proactive purchasing before stockouts occur. Early warnings give you time to reorder before running out.'
  },
  {
    question: 'Can I set up alerts for expiration dates?',
    answer: 'Yes, StockFlow supports expiration date alerts. You can set alerts to notify you when items are approaching expiration dates, enabling you to sell or use items before they expire. This reduces waste and improves inventory turnover.'
  },
  {
    question: 'How do inventory alerts integrate with purchase orders?',
    answer: 'Inventory alerts can automatically trigger purchase order creation. When stock levels drop below reorder points, the system can generate purchase requisitions or purchase orders automatically. This streamlines procurement and ensures timely reordering. StockFlow integrates alerts with purchase order workflows.'
  },
  {
    question: 'Can I receive alerts on mobile devices?',
    answer: 'Yes, StockFlow sends alerts to mobile devices via push notifications, SMS, or email. You can receive real-time notifications on your smartphone, enabling you to respond quickly to inventory issues even when away from the office.'
  },
  {
    question: 'How do inventory alerts help with inventory optimization?',
    answer: 'Inventory alerts help optimize inventory by: identifying slow-moving items that need attention, highlighting fast-moving items that need higher stock levels, preventing overstock situations, and ensuring optimal stock levels. This improves cash flow and reduces carrying costs.'
  },
  {
    question: 'Can I set up alerts for multiple locations?',
    answer: 'Yes, StockFlow supports location-specific alerts. You can set different reorder points and alert thresholds for each warehouse or location. This ensures alerts are relevant to each location\'s specific inventory needs and turnover rates.'
  }
];

export default function AlertsPage() {
  // Get real customer data for alerts feature
  const relevantCaseStudies = getRelevantCaseStudies('inventory alerts');
  const relevantTestimonials = getRelevantTestimonials('alerts');
  const metrics = getProprietaryMetrics('inventory alerts');
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StockFlow Alerts',
    description:
      'StockFlow Alerts is a browser-based alert solution for real-time inventory control, omni-channel fulfillment, and warehouse accuracy.',
    url: 'https://www.stockflowsystems.com/alerts',
    applicationCategory: 'BusinessApplication',
    operatingSystem: ['iOS', 'Android', 'Windows', 'macOS'],
    featureList: features.map((feature) => feature.title),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://app.stockflowsystems.com/alerts'
      }
    }
  };

  return (
    <SeoPageLayout 
      title="Alerts"
      heroTitle="Alerts"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Alerts 2025 - Prevent Stockouts, Save 25% Costs | StockFlow"
        description="Automated inventory alerts 2025 notify you of low stock, reorder points, stockouts. Prevent stockouts, save 25% costs. Real-time notifications via email, SMS, in-app. Free plan available. Join for Free - no credit card required."
        keywords="inventory alerts, stock alerts, low stock alerts, reorder alerts, inventory notifications, stock level alerts, inventory management alerts, automated inventory alerts, stockout alerts, inventory alert system, stockflow"
        url="https://www.stockflowsystems.com/alerts"
        structuredData={structuredData}
      />
      <StructuredData data={[structuredData, {
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
      }]} />



      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-black leading-relaxed mb-6">
          Inventory alerts are automated notifications that warn you when stock levels are low, when items need reordering, when there are discrepancies, or when important inventory events occur. These alerts help you maintain optimal stock levels and prevent stockouts.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          StockFlow's alert system monitors your inventory in real-time and sends notifications via email, SMS, or in-app alerts when predefined conditions are met. For more details, see our <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> guide and <Link to="/features/barcode-scanning-inventory" className="text-blue-600 hover:underline font-semibold">barcode scanning</Link> features.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Automated Inventory Alerts for Better Control
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              StockFlow's alert system provides real-time notifications for low stock, reorder points, stockouts, expiration dates, and custom conditions—helping you maintain optimal inventory levels and prevent costly stockouts.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how-it-works" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Inventory Alerts Work</h2>
            <p className="text-lg text-gray-600">
              Automated notifications that keep you informed about inventory status, helping you maintain optimal stock levels and prevent stockouts.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-base font-bold">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Barcode Types */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Types of Inventory Alerts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              StockFlow supports multiple alert types to keep you informed about inventory status, helping you maintain optimal stock levels and prevent costly stockouts.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {barcodeTypes.map((barcode, index) => (
              <Card key={index} className="border-indigo-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{barcode.name}</h3>
                  <p className="text-gray-600">{barcode.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Inventory Teams Everywhere</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From high-volume retail to regulated warehousing, StockFlow Scan adapts to your SOPs, devices, and reporting needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Card key={index} className="h-full border-gray-200">
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {useCase.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4">Deploy in Days, Not Months</h2>
              <p className="text-gray-600 mb-6">
                StockFlow Scan is web-first, so you can onboard teams instantly. Share a secure link, configure workflows, and monitor adoption without waiting on app store approvals or device imaging.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Fast configuration</h3>
                    <p className="text-gray-600">
                      Set locations, user roles, barcode validation rules, and automation triggers from one admin console.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ListChecks className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Built-in compliance</h3>
                    <p className="text-gray-600">
                      Enforce SOPs with role-based permissions, device telemetry, and detailed audit logs for every scan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Integrations that scale</h3>
                    <p className="text-gray-600">
                      Connect StockFlow with your ERP, WMS, and analytics stack using REST APIs, webhooks, and native connectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Security & Reliability</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Role-based access, SSO support, and enforced MFA keep your inventory protected.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Global edge infrastructure delivers sub-second performance for distributed teams.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Full audit trails and exports ensure every scan is traceable for compliance checks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to See StockFlow Scan in Action?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Try the scanner with your own barcode labels or connect with our team for a guided walkthrough tailored to your inventory workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100" asChild>
              <a href="https://app.stockflowsystems.com/scan" target="_blank" rel="noopener noreferrer">
                Start Scanning Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="https://www.stockflowsystems.com/contact" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="highlighted"
        />
      )}

    </SeoPageLayout>
  );
}


