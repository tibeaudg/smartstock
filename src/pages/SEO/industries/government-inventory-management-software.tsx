import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ShieldCheck,
  Smartphone,
  BarChart3,
  Search,
  ClipboardCheck,
  FileText,
  Users,
  Building2,
  Lock,
  History,
  CheckCircle,
  QrCode
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function GovernmentInventorySoftwarePage() {
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
      question: 'What is the best inventory software for government agencies?',
      answer:
        'The best government inventory software provides high-level security, audit-ready reporting, and multi-department visibility. StockFlow is preferred by public sector organizations because it offers secure asset tracking, mobile QR scanning for field work, and customizable permissions that meet strict government oversight requirements.',
    },
    {
      question: 'How do public sector organizations track fixed assets?',
      answer:
        'Government agencies track fixed assets like vehicles, IT equipment, and furniture using digital inventory systems that support barcode/QR tagging. This creates a permanent digital paper trail of an asset’s location, condition, and depreciation for annual audits.',
    },
    {
      question: 'Can I manage inventory across multiple government departments?',
      answer:
        'Yes. Advanced government tracking systems allow for a centralized dashboard where administrators can view stock across different facilities, offices, and warehouses while restricting department-specific access to local staff.',
    },
    {
      question: 'Why is reporting critical for government inventory systems?',
      answer:
        'Accurate reporting is essential for fiscal responsibility and transparency. Government software allows for instant generation of budget reports, asset valuation, and usage history, which are critical for procurement planning and legislative audits.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Government Inventory Software – Secure Asset & Supply Tracking',
    description:
      'Modernize public sector operations with secure government inventory management. Track assets, manage supplies, and generate audit-ready reports across departments.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Government Edition',
      description:
        'Secure, cloud-based inventory and asset management software specifically designed for local, state, and federal government agencies.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Multi-department asset tracking',
        'Audit-ready reporting',
        'Role-based access control',
        'Mobile QR/Barcode scanning',
        'Fixed asset lifecycle management',
        'Low stock alerts for supplies',
      ],
      image: 'https://www.stockflowsystems.com/government-inventory.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: ShieldCheck,
      title: 'Audit-Ready Compliance',
      description: 'Generate instant reports for fiscal year-end audits, grant accounting, and internal budgeting.',
    },
    {
      icon: Building2,
      title: 'Inter-Departmental Visibility',
      description: 'Track supplies and equipment across multiple municipal buildings or regional offices from one login.',
    },
    {
      icon: QrCode,
      title: 'Asset Tagging & Scanning',
      description: 'Check electronics, vehicles, and tools in and out using mobile devices to maintain a precise chain of custody.',
    },
    {
      icon: Lock,
      title: 'Granular Permissions',
      description: 'Control user access levels to protect sensitive data while allowing staff to update local inventory.',
    },
    {
      icon: History,
      title: 'Condition Monitoring',
      description: 'Upload high-res photos to track the lifecycle and maintenance history of high-value public assets.',
    },
    {
      icon: Smartphone,
      title: 'Field-Ready Access',
      description: 'Update inventory from the office, in transit, or at remote sites using any modern smartphone or tablet.',
    },
  ];

  const keyTakeaways = [
    'Digital tracking eliminates the risk of human error inherent in paper-based or spreadsheet systems.',
    'Automated stock alerts prevent shortages of essential supplies, ensuring uninterrupted public service.',
    'Mobile scanning simplifies the physical verification of assets during annual inventory counts.',
    'StockFlow provides the security and scalability required for multi-department government operations.',
  ];

  return (
    <SeoPageLayout
      title="Government Inventory Software – Secure Asset & Supply Tracking"
      heroTitle="Public Sector Inventory Management Built for Transparency"
      dateUpdated="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Government Inventory Software 2026 | Asset Tracking | StockFlow"
        description="Empower your government agency with professional inventory management. Track fixed assets, monitor supplies, and ensure audit compliance with ease."
        keywords="government inventory software, public sector asset tracking, municipal supply management, federal inventory system, state agency asset software"
        url="https://www.stockflowsystems.com/government-inventory-management-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">What Is Government Inventory Management Software?</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Government organizations operate under strict mandates for fiscal accountability and transparency. <strong>Government inventory software</strong> is a centralized digital system designed to track the <strong>fixed assets</strong>, IT equipment, and consumables that fuel public service.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Unlike commercial solutions, <strong>public sector asset tracking</strong> must prioritize a robust audit trail. By moving away from manual spreadsheets, agencies can ensure that every taxpayer-funded resource from fleet vehicles to office supplies is accounted for across multiple locations and departments.
          </p>
        </div>
      </section>

      {/* Efficiency & Budgeting Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Maximize Taxpayer Value Through Efficiency</h2>
          <div className="prose prose-blue max-w-none text-gray-600">
            <p>
              Administrative time is a finite resource. <strong>Inventory software for government agencies</strong> eliminates the need for "hunting" for misplaced assets. With real-time visibility, managers can see exactly what is in storage and what is in use, preventing the redundant purchasing of items already in the organization’s possession.
            </p>
            <p>
              StockFlow’s <strong>automated stock alerts</strong> provide a proactive approach to procurement. By setting inventory minimums for essential consumables like postage or field supplies, your team is notified well before a shortage occurs. This prevents last-minute, over-budget emergency purchases from external vendors.
            </p>
            <p>
              For <strong>IT and facility managers</strong>, the ability to generate data-rich reports with a single click simplifies the budgeting process. Whether you are presenting to a board or preparing for a state audit, StockFlow provides the accurate, real-time data required for high-stakes decision-making.
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

      {/* Deep Dive: Security & Compliance */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Security, Compliance & Oversight</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Trust is the foundation of public service. <strong>StockFlow Government Edition</strong> ensures that your organization maintains the highest standards of resource oversight.
              </p>
              <div className="flex gap-4 items-start">
                <FileText className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Custom Fields:</strong> Track specific government details like manufacturer, purchase order numbers, and handling instructions for hazardous materials.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Users className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Scalable Collaboration:</strong> Easily onboard volunteers or temporary contractors with specific, restricted access to inventory updates.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Government Oversight Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Full Transaction Logs</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Fixed Asset Valuation</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Depreciation Schedule Tracking</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Multi-Site Inventory Sync</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Scale Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Solutions for Every Level of Government</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Local Municipalities</h4>
              <p className="text-sm text-gray-600">Manage city hall supplies, park maintenance tools, and public works assets with ease.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">State & Regional Agencies</h4>
              <p className="text-sm text-gray-600">Coordinate inventory across large geographic regions with real-time cloud synchronization.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Federal Departments</h4>
              <p className="text-sm text-gray-600">Enterprise-level oversight for complex asset lifecycles, global logistics, and high-security storage.</p>
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