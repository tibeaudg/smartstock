import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ShieldAlert,
  Thermometer,
  Droplets,
  Wind,
  Warehouse,
  ClipboardList,
  Smartphone,
  QrCode,
  Box,
  Flame,
  CheckCircle,
  History
} from 'lucide-react';

export default function RawMaterialStorageGuidePage() {
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
      question: 'How should different raw materials be stored to prevent damage?',
      answer:
        'Storage requirements vary by material type. Metals require low humidity and high airflow to prevent corrosion, while lumber must be stored horizontally with support boards to prevent warping. Plastics should be kept at room temperature away from UV light to maintain structural integrity.',
    },
    {
      question: 'What is the best way to track raw material inventory levels?',
      answer:
        'Using specialized inventory software is the most effective method. Unlike spreadsheets, software allows you to attach handling SOPs, set environmental alerts, and use mobile scanning to update stock levels as materials are moved from storage to production.',
    },
    {
      question: 'Why is humidity control critical for raw materials?',
      answer:
        'Many materials are hygroscopic (like wood) or corrosive (like metal). Excess moisture can lead to rot, warping, or rust, which ruins the quality of the raw material and leads to significant financial loss.',
    },
    {
      question: 'How can I ensure safety when storing hazardous raw materials?',
      answer:
        'Create a detailed Standard Operating Procedure (SOP) and attach it directly to the item record in your inventory system. Use software that supports digital attachments so staff can access handling and disposal instructions instantly via QR code.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'A Guide to Storing Raw Materials | StockFlow',
    description:
      'Master the science of raw material storage. Learn how to protect metals, lumber, and plastics from environmental damage with professional inventory control.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Manufacturing Inventory',
      description:
        'Advanced inventory system designed to track raw material storage conditions, handling instructions, and real-time stock levels.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Environmental storage alerts',
        'SOP document attachments',
        'Mobile QR scanning',
        'Low stock reorder triggers',
        'Batch & lot tracking',
      ],
      image: 'https://www.stockflowsystems.com/raw-materials-storage-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const materialTips = [
    {
      icon: ShieldAlert,
      title: 'Metals & Corrosion',
      description: 'Keep relative humidity low and ensure high air circulation. Store away from windows and vents to prevent oxidation.',
    },
    {
      icon: Droplets,
      title: 'Lumber & Moisture',
      description: 'Store horizontally with support boards every 18 inches. Prioritize humidity-controlled zones to prevent warping.',
    },
    {
      icon: Thermometer,
      title: 'Plastics & UV',
      description: 'Store at room temperature and avoid direct sunlight. Prolonged heat exposure causes cracks, chips, and structural failure.',
    },
    {
      icon: Flame,
      title: 'Oils & Chemicals',
      description: 'Maintain original containers and strictly follow supplier heat/light requirements to prevent degradation or fire hazards.',
    },
  ];

  const keyTakeaways = [
    'Proper climate control for metals and lumber prevents material degradation and financial loss.',
    'Digital Standard Operating Procedures (SOPs) ensure all staff handle sensitive materials safely.',
    'Mobile-first tracking allows for real-time updates as raw materials move into the production phase.',
    'Inventory software provides a visual and data-rich history of material condition and usage patterns.',
  ];

  return (
    <SeoPageLayout
      title="A Comprehensive Guide to Storing Raw Materials"
      heroTitle="Protect Your Assets with Smarter Raw Material Storage"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Raw Material Storage Guide 2026 | Manufacturing Inventory Tips"
        description="Learn how to store metal, lumber, and plastics correctly. Improve your manufacturing efficiency with a standardized raw material storage system."
        keywords="raw material storage, metal storage tips, lumber inventory management, plastic storage conditions, manufacturing sop, stockflow"
        url="https://www.stockflowsystems.com/storing-raw-materials-guide"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Preserving Quality from Receiving to Production</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Raw materials are the foundation of your finished product, but they are often the most vulnerable to environmental damage. Effectively <strong>storing and organizing raw materials</strong> requires a balance between accessibility and strict climate control.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            From <strong>hygroscopic wood</strong> that warps in humidity to <strong>silver and copper</strong> that require high security, a standardized storage system is essential for minimizing waste and maximizing your manufacturing ROI.
          </p>
        </div>
      </section>

      {/* Material Specifics Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Material-Specific Storage Guidelines</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {materialTips.map((tip, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <tip.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOP & Infrastructure Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Standardizing Your Storage System</h2>
              <p className="text-gray-600 leading-relaxed">
                A physical space is only as good as the process managing it. Creating a <strong>Standard Operating Procedure (SOP)</strong> ensures that every team member knows exactly how to receive, store, and move materials.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Warehouse className="text-blue-600 shrink-0" />
                  <span><strong>Physical Infrastructure:</strong> Invest in heavy-duty shelving, separators, and climate monitors.</span>
                </li>
                <li className="flex gap-3">
                  <ClipboardList className="text-blue-600 shrink-0" />
                  <span><strong>Digital Documentation:</strong> Attach supplier specs and safety data sheets directly to item records in your app.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-400" /> Mobile Tracking Power
              </h4>
              <p className="opacity-90 mb-6">Stop using paper logs for raw goods. StockFlow enables your shop floor team to:</p>
              <ul className="space-y-3">
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Scan QR codes for instant handling info</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Set alerts for expiration or maintenance</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Attach high-res photos to track condition</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Sync multi-location stock in real-time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Strategy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Building a Resilient Storage Workflow</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <Wind className="text-blue-600 mb-4 w-10 h-10" />
              <h4 className="text-xl font-bold mb-3">Environmental Monitoring</h4>
              <p className="text-gray-600">Combine physical humidifiers/dehumidifiers with digital tracking. Note storage temperatures in the "Custom Fields" of your inventory app for long-term quality auditing.</p>
            </div>
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <History className="text-blue-600 mb-4 w-10 h-10" />
              <h4 className="text-xl font-bold mb-3">Audit-Ready History</h4>
              <p className="text-gray-600">Maintain a digital trail of every material movement. Know exactly when a batch of metal arrived and who moved it to the production floor to identify any points of contamination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Capabilities Footer */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">QR Code Ready</p>
            </div>
            <div className="text-center">
              <Box className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Batch Tracking</p>
            </div>
            <div className="text-center">
              <ShieldAlert className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Safety Alerts</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Offline Access</p>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}