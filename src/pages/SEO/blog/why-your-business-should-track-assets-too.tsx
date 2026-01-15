import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ShieldAlert,
  Wrench,
  Calculator,
  MapPin,
  QrCode,
  Bell,
  FileText,
  History,
  Truck,
  CheckCircle,
  HardHat,
  Construction
} from 'lucide-react';

export default function AssetTrackingImportancePage() {
  
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map(
    (item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })
  );

  const faqData = [
    {
      question: 'What is the main difference between tracking inventory and tracking assets?',
      answer:
        'Inventory consists of items intended for sale or consumption (like raw materials). Assets are high-value items the business owns and uses repeatedly over time, such as machinery, vehicles, or IT equipment. Assets require tracking for location, maintenance, and depreciation, rather than just stock levels.',
    },
    {
      question: 'How does asset tracking prevent financial loss?',
      answer:
        'Asset tracking prevents loss by providing real-time visibility into who has an item and where it is located. Using QR codes and check-in/check-out systems reduces "shrinkage" from theft or misplacement and eliminates the cost of repurchasing items that are simply lost in the field.',
    },
    {
      question: 'Can tracking software help with equipment maintenance?',
      answer:
        'Yes. Professional tracking software allows you to set automated alerts for preventative maintenance and warranty expirations. This ensures equipment remains in peak condition, extending its lifecycle and preventing costly project delays due to unexpected breakdowns.',
    },
    {
      question: 'Why is asset tracking important for tax purposes?',
      answer:
        'Many business assets depreciate over time. Accurate tracking of an asset’s age, condition, and value allows businesses to properly claim depreciation, which can significantly lower tax liability during end-of-year reporting.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Why Your Business Should Track Assets | StockFlow Guide',
    description:
      'Discover 4 critical reasons to implement asset tracking. Protect high-value equipment, automate maintenance, and simplify tax depreciation.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Asset Tracker',
      description:
        'Comprehensive asset management software designed to track high-value equipment, tools, and IT assets with QR scanning and maintenance alerts.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time location tracking',
        'Check-in / Check-out system',
        'Automated maintenance alerts',
        'Depreciation reporting',
        'Photo & document attachments',
      ],
      image: 'https://www.stockflowsystems.com/asset-tracking-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const assetBenefits = [
    {
      icon: MapPin,
      title: '1. Location Visibility',
      description: 'Knowing where your assets are is crucial for project timelines. Misplacing a crane or a critical tool creates logistical nightmares that hit your bottom line.',
    },
    {
      icon: ShieldAlert,
      title: '2. Theft & Loss Prevention',
      description: 'High-value assets are prime targets for theft. A perpetual tracking system using QR codes ensures every move is recorded, significantly reducing shrinkage.',
    },
    {
      icon: Wrench,
      title: '3. Predictive Maintenance',
      description: 'Automated alerts for service dates and warranty expirations keep equipment functional, preventing expensive downtime and extending asset life.',
    },
    {
      icon: Calculator,
      title: '4. Tax & Depreciation',
      description: 'Properly tracking asset lifecycle and condition simplifies end-of-year reporting, ensuring you claim the full depreciation value to lower tax liability.',
    },
  ];

  const keyTakeaways = [
    'Real-time tracking of raw materials prevents costly production delays and downtime.',
    'Mobile-first scanning increases data accuracy on the shop floor compared to manual logs.',
    'Detailed reporting helps identify inventory usage patterns to optimize procurement and lean operations.',
    'StockFlow scales with your production volume, supporting multiple sites and unlimited items.',
  ];

  return (
    <SeoPageLayout
      title="Why Your Business Should Track Assets, Too"
      heroTitle="Protect Your High-Value Investments"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Why Asset Tracking is Essential for Business | StockFlow 2026"
        description="Learn why tracking assets is just as important as tracking inventory. Discover how to reduce theft, automate maintenance, and simplify tax depreciation."
        keywords="asset tracking, equipment management, tool tracking, depreciation tracking, stockflow assets"
        url="https://www.stockflowsystems.com/why-track-assets"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">High Value Demands High Precision</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Virtually every business handles two types of physical items: <strong>inventory</strong> (which moves out) and <strong>assets</strong> (which stay to do the work). While stock levels are often prioritized, high-value assets like machinery, IT hardware, and specialized tools often lack the same tracking rigor.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Implementing <strong>asset tracking</strong> isn't just about organization; it’s about protecting your capital, ensuring project continuity, and maximizing the lifecycle of the tools that power your revenue.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">4 Pillars of Modern Asset Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assetBenefits.map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <benefit.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case: Construction & Staging */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Logistics Without the Nightmares</h2>
              <p className="text-gray-600 leading-relaxed">
                Whether it's a <strong>crane</strong> on a job site or a <strong>staging sofa</strong> for a home install, misplacing an asset isn't just a minor error—it's a productivity killer. Reputation and profit depend on having the right equipment at the right place at the right time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <HardHat className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Construction Teams</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Construction className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Field Service Providers</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Truck className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Logistics & Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">IT & Office Assets</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <QrCode className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">StockFlow for Assets</h4>
              <p className="opacity-90 mb-6">Apply professional-grade tracking to your high-value gear:</p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Check-In/Out:</strong> Know exactly which employee has custody of which tool.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Bell className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Service Alerts:</strong> Automated reminders for oil changes, calibrations, or inspections.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <History className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Service History:</strong> Attach photos and reports directly to the asset’s profile.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Action Callout */}
      <section className="py-20 bg-gray-50 border-t border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Assets?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't leave your most expensive investments to chance. By using <strong>StockFlow</strong> to track both inventory and assets, you gain a 360-degree view of your business’s physical resources, reducing costs and boosting productivity from day one.
          </p>
          <div className="bg-white p-6 rounded-lg border shadow-sm inline-block text-left">
            <h5 className="font-bold mb-2">Next Step: Asset Inventory</h5>
            <p className="text-sm text-gray-500">Tag your 10 most expensive pieces of equipment with QR codes and begin a "Check-In/Out" protocol today.</p>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}