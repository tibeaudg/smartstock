import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Utensils,
  Smartphone,
  AlertCircle,
  QrCode,
  LineChart,
  Users,
  IceCream,
  Wine,
  ClipboardList,
  History,
  ShieldCheck,
  CheckCircle,
  WifiOff,
  Clock
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function RestaurantInventoryManagementPage() {
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
      question: 'What is the best way to track restaurant inventory?',
      answer:
        'The most effective method is using a mobile-first inventory app that allows staff to perform counts directly in walk-ins, bars, and dry storage. StockFlow enables real-time updates and barcode scanning from any smartphone, eliminating the errors and delays associated with paper lists.',
    },
    {
      question: 'How do restaurants reduce food waste with inventory software?',
      answer:
        'By setting low stock alerts and tracking usage patterns, restaurants can maintain "par levels" and avoid over-ordering perishable goods. Real-time visibility into stock ensures that older inventory is used first and that managers are alerted before items reach their expiration dates.',
    },
    {
      question: 'Can I manage inventory for multiple restaurant locations?',
      answer:
        'Yes. StockFlow allows you to create unique folders for different locations, bars, or storage areas. This provides a centralized view for owners to monitor stock levels, identify theft or waste, and facilitate transfers between sites.',
    },
    {
      question: 'Is it hard to train kitchen staff on inventory software?',
      answer:
        'No. StockFlow is designed with an intuitive interface that requires zero formal training. If your team can use a smartphone, they can scan QR codes and update quantities in seconds, making it easy to incorporate into a busy shift.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Restaurant Inventory Management Software | StockFlow',
    description:
      'Optimize your kitchen operations and reduce food waste. Track bar stock, dry goods, and perishables with our mobile-first restaurant inventory app.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Hospitality Edition',
      description:
        'A mobile inventory management solution tailored for restaurants, bars, and catering businesses to track stock and automate reordering.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Mobile QR/Barcode counting',
        'Perishable stock alerts',
        'Multi-location bar & kitchen tracking',
        'Offline counting mode',
        'Usage analytics & waste reporting',
        'Supplier management',
      ],
      image: 'https://www.stockflowsystems.com/restaurant-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Smartphone,
      title: 'Walk-In Ready Mobile App',
      description: 'Perform counts on the fly. Staff can update quantities from the walk-in, bar, or dry storage using their own devices.',
    },
    {
      icon: AlertCircle,
      title: 'Low Stock & Par Alerts',
      description: 'Receive notifications before you run out of key ingredients. Always maintain the "just right" amount of inventory.',
    },
    {
      icon: QrCode,
      title: 'Bar & Bottle Scanning',
      description: 'Use the in-app scanner to rapidly audit liquor stock and dry goods. Compatible with existing UPCs and custom QR codes.',
    },
    {
      icon: LineChart,
      title: 'Waste & Usage Analytics',
      description: 'Identify high-waste areas and low-profit items with detailed reporting to protect your margins.',
    },
    {
      icon: WifiOff,
      title: 'Offline Counting Mode',
      description: 'Inventory doesn’t stop in dead zones. Update counts in basements or freezers; data syncs once reconnected.',
    },
    {
      icon: ShieldCheck,
      title: 'Custom User Permissions',
      description: 'Control who can edit stock levels or view costs. Grant different access levels to FOH and BOH teams.',
    },
  ];

  const keyTakeaways = [
    'Real-time inventory visibility reduces food waste and prevents 86’d items during service.',
    'Mobile scanning speeds up end-of-night bar audits and weekly kitchen counts by up to 50%.',
    'Low stock thresholds enable automated, accurate reordering from multiple suppliers.',
    'StockFlow scales from single boutique bistros to multi-unit regional restaurant groups.',
  ];

  return (
    <SeoPageLayout
      title="Restaurant Inventory Management – Simplified Control"
      heroTitle="Restaurant Inventory Software Built for Busy Kitchens"
      updatedDate="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Restaurant Inventory Software 2026 | Bar & Kitchen Tracking | StockFlow"
        description="Streamline your restaurant operations. Reduce waste, track bar stock, and automate kitchen inventory with our easy-to-use mobile app."
        keywords="restaurant inventory software, bar inventory app, kitchen stock management, food waste tracking, liquor inventory system"
        url="https://www.stockflowsystems.com/restaurant-inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Hospitality Inventory Management, Refined</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Managing a profitable restaurant is a high-stakes balancing act. <strong>Restaurant inventory software</strong> is the critical tool that ensures your kitchen is stocked for success without excessive waste. <strong>StockFlow</strong> replaces error-prone clipboards with a real-time digital system accessible to your entire team.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            From tracking <strong>high-turnover perishables</strong> in the walk-in to auditing expensive liquor stock at the bar, our app provides a <strong>centralized dashboard</strong> for owners and managers. Gain the visibility needed to identify shrinkage, optimize your menu costs, and keep your customers satisfied.
          </p>
        </div>
      </section>

      {/* Operational Efficiency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Drive ROI with Better Inventory Control</h2>
          <div className="grid md:grid-cols-2 gap-12 text-gray-600">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <IceCream className="text-blue-600" /> Kitchen & Dry Goods
              </h3>
              <p className="mb-6">
                Monitor essential ingredients across multiple storage areas. Use <strong>custom folders</strong> to mirror your kitchen’s layout, making the counting process fast and logical for prep cooks.
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Wine className="text-blue-600" /> Bar & Beverage Audit
              </h3>
              <p>
                Liquor and wine represent some of your highest margins. <strong>Mobile scanning</strong> allows for rapid bottle-by-bottle counts, helping to spot discrepancies and prevent shrinkage immediately.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Clock className="text-blue-600" /> Real-Time Collaboration
              </h3>
              <p className="mb-6">
                Your team can update inventory in seconds during a shift. Whether it's receiving a shipment or recording a wasted item, <strong>cross-device syncing</strong> ensures management always sees the true count.
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <ClipboardList className="text-blue-600" /> Supplier Management
              </h3>
              <p>
                Link items to specific suppliers and costs. Generate <strong>purchase orders</strong> and pick lists directly from the app to streamline the procurement cycle for every department.
              </p>
            </div>
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

      {/* Deep Dive: Analytics & Accountability */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Data-Driven Hospitality Operations</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Profitability in the food industry is found in the details. <strong>StockFlow Hospitality Edition</strong> provides the oversight needed to eliminate waste.
              </p>
              <div className="flex gap-4 items-start">
                <History className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Activity History:</strong> Audit every update to see exactly who moved stock or updated a quantity, enhancing employee accountability across shifts.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Item Photos:</strong> Add photos to item entries to verify proper presentation, track ingredient condition, or record waste visually for insurance or audits.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Operational Restaurant Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Automated Par Level Alerts</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Custom Field for Supplier Info</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Multi-Location Quantity Sync</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Exportable Audit Reports (PDF/CSV)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Guide / Industry Scale */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Solutions for Every Segment of Food & Bev</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Independent Bars & Cafes</h4>
              <p className="text-sm text-gray-600">Stop the guessing game. Use mobile scanning for weekly audits and manage high-value liquor with precision.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Full-Service Restaurants</h4>
              <p className="text-sm text-gray-600">Coordinate between BOH prep and FOH beverage service while keeping a strict eye on food waste and par levels.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Catering & Multi-Unit</h4>
              <p className="text-sm text-gray-600">Manage off-site inventory for events or track stock across multiple restaurant locations from a single admin login.</p>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}