import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Truck,
  Wrench,
  Smartphone,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  QrCode,
  CheckCircle,
  Database,
  Users,
  Box,
  Settings
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function HvacInventorySoftwarePage() {
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
      question: 'What is the best HVAC inventory software for field technicians?',
      answer:
        'The best HVAC inventory software is a mobile-first platform that allows technicians to track parts and tools directly from their trucks. StockFlow is highly rated because it enables real-time syncing between the warehouse and the fleet, ensuring technicians never arrive at a job site missing critical components like capacitors or filters.',
    },
    {
      question: 'How do you track HVAC tools and expensive equipment?',
      answer:
        'HVAC businesses track high-value tools (like vacuum pumps and recovery machines) using QR codes or barcodes. By scanning items "in" and "out" of specific trucks, managers maintain a clear chain of custody and automated maintenance schedules.',
    },
    {
      question: 'Can I manage stock across multiple service vans?',
      answer:
        'Yes. Advanced HVAC inventory systems treat each vehicle as a unique sub-location. This allows office managers to see exactly what is on "Truck A" versus "Truck B," facilitating easy stock transfers and reducing redundant purchasing.',
    },
    {
      question: 'Does HVAC software provide low stock alerts?',
      answer:
        'Yes. You can set minimum threshold alerts for common consumables like refrigerant, copper tubing, and fittings. When stock levels dip, the system sends an automated notification to ensure parts are reordered before they run out.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'HVAC Inventory Software – Field Service & Tool Tracking',
    description:
      'Optimize your HVAC business with mobile inventory management. Track parts across trucks, manage tool maintenance, and automate stock alerts.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow HVAC Edition',
      description:
        'Cloud-based HVAC inventory management and tool tracking software designed for heating and cooling service providers.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web Browser',
      price: '0',
      currency: 'USD',
      features: [
        'Fleet vehicle stock tracking',
        'Tool maintenance alerts',
        'Mobile QR/Barcode scanning',
        'Low stock notifications',
        'Multi-location warehouse sync',
        'Field technician access',
      ],
      image: 'https://www.stockflowsystems.com/hvac-inventory.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Truck,
      title: 'Fleet Inventory Management',
      description: 'Track stock levels across your entire service fleet. Know exactly what parts are on which truck in real-time.',
    },
    {
      icon: QrCode,
      title: 'In-Field Scanning',
      description: 'Technicians use their smartphones to scan parts used on a job, instantly updating central inventory levels.',
    },
    {
      icon: AlertTriangle,
      title: 'Maintenance Reminders',
      description: 'Set automated alerts to service expensive recovery equipment, vacuum pumps, and specialized HVAC tools.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Workflow',
      description: 'No extra hardware needed. Manage your entire inventory from the field, the office, or the warehouse.',
    },
    {
      icon: ClipboardList,
      title: 'Custom Parts Catalog',
      description: 'Organize inventory by manufacturer, BTU rating, or compatibility for rapid identification on job sites.',
    },
    {
      icon: BarChart3,
      title: 'Usage Analytics',
      description: 'Generate reports on part consumption to understand seasonal demand and optimize truck stock profiles.',
    },
  ];

  const keyTakeaways = [
    'Real-time truck stock visibility eliminates "dry runs" and second trips for missing parts.',
    'Automated alerts prevent stockouts of critical consumables like refrigerant and filters.',
    'Tool tracking reduces the high cost of lost or misplaced service equipment.',
    'StockFlow scales from individual contractors to large multi-regional HVAC fleets.',
  ];

  return (
    <SeoPageLayout
      title="HVAC Inventory Software – Field Service & Tool Tracking"
      heroTitle="HVAC Inventory Management Built for the Field"
      dateUpdated="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best HVAC Inventory Software 2026 | Tool & Part Tracking | StockFlow"
        description="Streamline your HVAC service business. Manage truck stock, track expensive tools, and automate reordering with our mobile inventory app."
        keywords="hvac inventory software, hvac tool tracking, truck stock management, heating and cooling inventory, field service asset tracking"
        url="https://www.stockflowsystems.com/hvac-inventory-management-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">What Is HVAC Inventory Management Software?</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            HVAC businesses live and die by their response time. <strong>HVAC inventory software</strong> is the digital bridge between your warehouse and your service fleet. It ensures that every <strong>technician</strong> has the right capacitors, motors, and thermostats on their truck before they leave for a service call.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By utilizing <strong>mobile asset tracking</strong>, HVAC companies eliminate the "second trip" problem. When your team can scan parts out of a truck in real-time, the office gains instant visibility into what needs to be replenished, keeping the fleet field-ready at all times.
          </p>
        </div>
      </section>

      {/* Field Efficiency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Optimize Your Fleet & Tool Accountability</h2>
          <div className="prose prose-blue max-w-none text-gray-600">
            <p>
              Managing an <strong>HVAC service business</strong> requires more than just part tracking; it requires tool accountability. High-value equipment like leak detectors and recovery units are often misplaced. <strong>HVAC tool tracking software</strong> creates a digital chain of custody, assigning every piece of equipment to a specific vehicle or technician.
            </p>
            <p>
              Automated <strong>stock alerts</strong> prevent the most common bottleneck in the industry: running out of essential consumables. Whether it's R-410A refrigerant or specific air filters, StockFlow notifies your procurement team as soon as levels dip below your custom threshold.
            </p>
            <p>
              When selecting <strong>the best HVAC inventory app</strong>, prioritize ease of use. Your technicians are busy fixing units, not data-entering. StockFlow's intuitive interface allows for "one-click" scanning, ensuring that your data stays accurate without slowing down the job.
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

      {/* Deep Dive: Maintenance & Analytics */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Data-Driven Service Operations</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Profitability in HVAC comes from efficiency. <strong>StockFlow HVAC Edition</strong> provides the analytics needed to trim waste and maximize tool longevity.
              </p>
              <div className="flex gap-4 items-start">
                <Settings className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Preventative Tool Care:</strong> Track the service history of your machinery to prevent mid-job failures and extend the life of your assets.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Database className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Multi-Warehouse Sync:</strong> Coordinate stock between your main warehouse and satellite storage pods for larger regional projects.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">HVAC Operational Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Refrigerant Tracking</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Serial Number Logging</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Job-Specific Costing</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Vendor Lead-Time Alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Scale Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Solutions for Every HVAC Enterprise</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Owner-Operators</h4>
              <p className="text-sm text-gray-600">Perfect for the solo pro who needs to organize their van and stop losing tools at job sites.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Growing Service Fleets</h4>
              <p className="text-sm text-gray-600">Centralize control for 5-20 trucks with mobile scanning and automated warehouse replenishment.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Commercial HVAC</h4>
              <p className="text-sm text-gray-600">Robust asset management for large-scale equipment, preventative maintenance, and audit-ready reporting.</p>
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