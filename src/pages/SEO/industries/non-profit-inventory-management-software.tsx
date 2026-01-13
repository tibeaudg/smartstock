import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  BarChart3,
  Users,
  Warehouse,
  CheckCircle,
  Boxes,
  Target,
  Database,
  ShieldCheck,
  Zap,
  Smartphone,
  ClipboardCheck,
  HeartHandshake
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function NonProfitInventorySoftwarePage() {
  usePageRefresh();
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
      question: 'What is the best inventory software for non-profits?',
      answer:
        'The best inventory software for non-profits balances ease of use with robust tracking. StockFlow is highly rated for non-profits because it offers mobile-first asset tracking, donor-ready reporting, and scalable pricing that fits restricted budgets.',
    },
    {
      question: 'How do non-profits track donated goods?',
      answer:
        'Non-profits track donated goods using inventory systems that support barcode scanning and custom fields. This allows teams to categorize items by donor, condition, and intended program, ensuring full accountability for every physical donation.',
    },
    {
      question: 'Can I track assets across multiple non-profit locations?',
      answer:
        'Yes. Modern cloud-based inventory systems allow non-profits to monitor supplies and equipment across various offices, storage units, and field sites in real-time from a single dashboard.',
    },
    {
      question: 'Why is automated stock alerting important for non-profits?',
      answer:
        'Automated alerts prevent service interruptions. By setting minimum stock thresholds, non-profits receive notifications before essential supplies (like medical kits or outreach materials) run out, preventing emergency overspending.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Non-Profit Inventory Software – Efficient Resource Tracking',
    description:
      'Manage donations, assets, and supplies with the best inventory software for non-profits. Optimize your mission with real-time tracking and automated reporting.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Non-Profit Edition',
      description:
        'Specialized inventory management and asset tracking software designed for non-profit organizations and NGOs.',
      category: 'BusinessApplication',
      operatingSystem: 'Web Browser, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Donation tracking',
        'Asset management',
        'Multi-location support',
        'Low stock alerts',
        'Audit-ready reports',
        'Mobile QR scanning',
      ],
      image: 'https://www.stockflowsystems.com/non-profit-inventory.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Warehouse,
      title: 'Multi-Location Tracking',
      description: 'Visibility into supplies across storage units, regional offices, and mobile field sites.',
    },
    {
      icon: Smartphone,
      title: 'Mobile QR/Barcode Scanning',
      description: 'Enable volunteers to check items in and out using their own smartphones.',
    },
    {
      icon: ClipboardCheck,
      title: 'Audit-Ready Reporting',
      description: 'Generate instant reports for grant compliance, tax filings, and board meetings.',
    },
    {
      icon: Database,
      title: 'Donation Management',
      description: 'Track the lifecycle of donated goods from intake to final distribution.',
    },
    {
      icon: Zap,
      title: 'Automated Stock Alerts',
      description: 'Get notified before essential items hit zero to prevent mission downtime.',
    },
    {
      icon: HeartHandshake,
      title: 'Volunteer Friendly',
      description: 'An intuitive interface that requires zero technical training for temporary staff.',
    },
  ];

  const keyTakeaways = [
    'Inventory software eliminates waste by preventing over-ordering and asset loss.',
    'Real-time data improves donor transparency and grant acquittal accuracy.',
    'Mobile scanning allows for decentralized tracking in remote or field environments.',
    'StockFlow provides the scalability needed for growing non-profit operations.',
  ];

  return (
    <SeoPageLayout
      title="Non-Profit Inventory Software – Efficient Resource Tracking"
      heroTitle="Inventory Software Built for Mission-Driven Teams"
      updatedDate="01/08/2026"
      faqData={faqData}
      keyTakeaways={<KeyTakeaways items={keyTakeaways} />}
    >
      <SEO
        title="Best Non-Profit Inventory Software 2026 | Asset Tracking | StockFlow"
        description="Optimize your non-profit with specialized inventory management. Track donations, assets, and supplies across multiple locations with ease."
        keywords="non-profit inventory software, asset tracking for non-profits, donation tracking system, inventory management for NGOs, free non-profit software"
        url="https://www.stockflowsystems.com/non-profit-inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">What Is Non-Profit Inventory Management?</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            For non-profits, inventory isn't just "stock" it's the lifeblood of your mission. Whether you are managing <strong>donated medical supplies</strong>, outreach materials, or <strong>high-value IT assets</strong>, a manual spreadsheet is a liability. <strong>Inventory software for non-profits</strong> provides the visibility needed to ensure resources reach those in need.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Modern <strong>non-profit asset tracking</strong> systems leverage cloud technology and mobile scanning to create a transparent chain of custody. This ensures your team spends less time in storage units and more time in the community.
          </p>
        </div>
      </section>

      {/* Why it Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Stop Wasting Resources on Manual Tracking</h2>
          <div className="prose prose-blue max-w-none text-gray-600">
            <p>
              Navigating <strong>inventory management for non-profits</strong> in 2026 requires speed and accountability. Every dollar spent replacing a "lost" tablet or over-ordering printer paper is a dollar taken away from your cause. 
            </p>
            <p>
              Using <strong>best-in-class inventory software</strong> allows your organization to set automated minimum stock levels. When supplies run low, your team receives an alert, allowing for proactive procurement. This level of precision is critical for <strong>grant compliance</strong> and donor reporting, where every item must be accounted for.
            </p>
            <p>
              When evaluating <strong>inventory software for small non-profits</strong>, look for systems that offer a "time-to-value" of minutes, not months. StockFlow is designed to be deployed instantly, allowing volunteers to start scanning assets with devices they already own.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <f.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive: Accountability */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Donor Transparency & Accountability</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Donors want to know their contributions are making an impact. <strong>Inventory software for NGOs</strong> provides the data required to prove efficiency.
              </p>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Condition Tracking:</strong> Upload high-resolution photos of assets to monitor wear and tear or document damage for insurance claims.</p>
              </div>
              <div className="flex gap-4 items-start">
                <BarChart3 className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Custom Reporting:</strong> Instantly export CSV or PDF reports filtered by program, location, or donor for audit season.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Compliance Checklist</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Full Chain of Custody</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Grant-Specific Tagging</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Expiration Date Monitoring</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Multi-User Access Logs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison/Choice Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Choosing the Right System</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Small Charities</h4>
              <p className="text-sm text-gray-600">Focus on mobile-first solutions that require zero training and have low-cost entry points.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Growing NGOs</h4>
              <p className="text-sm text-gray-600">Prioritize multi-location support and automated stock alerts to manage scaling complexity.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Large Organizations</h4>
              <p className="text-sm text-gray-600">Demand robust API integrations and deep role-based permissions for enterprise-level security.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>

    </SeoPageLayout>
  );
}