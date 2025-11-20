import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SeoPageLayout from '@/components/SeoPageLayout';
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

const faqs = [
  {
    question: 'Do I need dedicated hardware to use StockFlow Scan?',
    answer:
      'No special hardware is required. Any modern device with a camera—iOS, Android, Zebra, Windows, or macOS—can run the StockFlow scanner securely in the browser.'
  },
  {
    question: 'Can the scanner work offline?',
    answer:
      'Yes. Teams can continue scanning without connectivity. StockFlow queues changes locally and syncs them automatically once a connection is restored.'
  },
  {
    question: 'How does StockFlow maintain scan accuracy?',
    answer:
      'We combine checksum validation, duplicate detection, and product-level rules to stop incorrect submissions before they reach inventory records.'
  },
  {
    question: 'Does StockFlow support GS1 barcodes and serialization?',
    answer:
      'Absolutely. We parse GS1 application identifiers, serial numbers, lots, and expiration dates so you can meet compliance requirements without manual entry.'
  },
  {
    question: 'How quickly can we roll out StockFlow Scan?',
    answer:
      'Most teams go live in days. Invite your users, configure workflows, and share a secure URL—no app store approvals or device imaging needed.'
  }
];

export default function InventoryPhotosPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StockFlow Inventory Photos',
    description:
      'StockFlow Inventory Photos is a browser-based inventory photo solution for real-time inventory control, omni-channel fulfillment, and warehouse accuracy.',
    url: 'https://www.stockflow.be/inventory-photos',
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
        urlTemplate: 'https://app.stockflow.be/inventory-photos'
      }
    }
  };

  return (
    <SeoPageLayout title="Inventory Photos">
      <SEO
        title="Inventory Photos 2025 - Inventory Photos 2025"
        description="Find out how inventory photos to automate your processes. Find out how inventory photos to save time and money.. Try free now. StockFlow helps businesses man..."
        keywords="inventory photos, inventory photo solution, inventory photo management, inventory photo system, inventory photo software, inventory photo app, inventory photo platform, inventory photo service, inventory photo tool, inventory photo technology, inventory photo innovation, inventory photo solution for inventory management, inventory photo solution for inventory tracking, inventory photo solution for inventory control, inventory photo solution for inventory optimization, inventory photo solution for inventory visibility, inventory photo solution for inventory accuracy, inventory photo solution for inventory efficiency, inventory photo solution for inventory compliance, inventory photo solution for inventory security, inventory photo solution for inventory cost reduction, inventory photo solution for inventory growth, inventory photo solution for inventory success, inventory photo solution for inventory future"
        url="https://www.stockflow.be/inventory-photos"
        structuredData={structuredData}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <Badge className="bg-white/15 text-white uppercase tracking-wider mb-6">
                Inventory Photos
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                StockFlow Scan for Real-Time Inventory Accuracy
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-xl">
                Give every team member a lightning-fast barcode scanner that runs in the browser. Capture codes, validate data, and sync stock levels across every channel without installing native apps.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-indigo-100">
                      {metric.icon}
                      {metric.title}
                    </div>
                    <div className="mt-2 text-3xl font-semibold">{metric.label}</div>
                    <p className="mt-2 text-sm text-indigo-100/80">{metric.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-indigo-100/80">
                <span className="inline-flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  GS1 & QR compatible
                </span>
                <span className="inline-flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Works online & offline
                </span>
              </div>
            </div>
            <div className="relative ">
              <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-3xl" />
                  <img
                    src="/scanner2.png"
                    alt="StockFlow barcode scanner interface"
                    className="h-[96] w-64 object-cover rounded-3xl"
                  />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Barcode Scanning Built for High-Velocity Operations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              StockFlow Scan powers inventory teams with rapid data capture, validation, and automation—without the friction of installing traditional scanning apps.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How StockFlow Scan Works</h2>
            <p className="text-lg text-gray-600">
              A guided scanning workflow that keeps teams fast, compliant, and confident at every step.
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
            <h2 className="text-3xl font-bold mb-4">Support for the Codes Your Supply Chain Runs On</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              StockFlow reads common retail symbologies, GS1 identifiers, and 2D codes so you can consolidate scanning workflows into one platform.
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
              <a href="https://app.stockflow.be/scan" target="_blank" rel="noopener noreferrer">
                Start Scanning Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="https://www.stockflow.be/contact" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SeoPageLayout>
  );
}


