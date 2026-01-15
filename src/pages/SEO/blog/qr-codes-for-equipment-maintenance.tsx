import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  QrCode,
  Wrench,
  Smartphone,
  ClipboardList,
  History,
  Bell,
  FileText,
  ShieldCheck,
  CheckCircle,
  Printer,
  Scaling,
  Zap
} from 'lucide-react';

export default function EquipmentMaintenanceQRPage() {
  
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
      question: 'How do QR codes simplify equipment maintenance tracking?',
      answer:
        'QR codes act as a digital bridge. By scanning a code on a machine, a technician instantly accesses its full service history, digital manuals, and warranty details without searching through paper files. This ensures maintenance is performed correctly and documented immediately.',
    },
    {
      question: 'Can I use my smartphone as a maintenance scanner?',
      answer:
        'Yes. Modern platforms like StockFlow allow employees to use their existing smartphones or tablets to scan QR codes. This eliminates the need for expensive proprietary hardware and allows for "on-the-go" updates from the shop floor or field.',
    },
    {
      question: 'How do I generate QR codes for my existing equipment?',
      answer:
        'If your equipment doesn\'t have manufacturer codes, you can use an inventory app to generate unique QR codes. These can be printed on standard label paper and attached to your assets, instantly linking the physical machine to its digital record.',
    },
    {
      question: 'What information should be included in a maintenance SOP?',
      answer:
        'An SOP should detail how equipment is cataloged, which attachments (manuals/warranties) are required in the app, the frequency of audits, and the specific workflow for scheduling and logging service appointments using the QR system.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'How to Use QR Codes for Equipment Maintenance | StockFlow',
    description:
      'A 3-step guide to implementing a QR code system for tracking equipment service, maintenance history, and preventative schedules.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Asset Maintenance Suite',
      description:
        'Specialized asset tracking software that utilizes QR codes to manage preventative maintenance, service logs, and digital equipment manuals.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Custom QR code generation',
        'Mobile scan-to-view history',
        'Automated service reminders',
        'Digital manual attachments',
        'Depreciation & audit reporting',
      ],
      image: 'https://www.stockflowsystems.com/equipment-maintenance-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const steps = [
    {
      icon: Smartphone,
      title: '1. Select an Intuitive System',
      description: 'Choose a mobile-first solution that doesn\'t require external hardware. Look for apps that allow "scanning on the go" via standard smartphones and tablets.',
    },
    {
      icon: QrCode,
      title: '2. Organize & Link Assets',
      description: 'Upload your equipment list with manuals and warranties. Sync each item to a QR code—either existing manufacturer codes or custom labels you generate.',
    },
    {
      icon: ClipboardList,
      title: '3. Standardize the SOP',
      description: 'Create a Standard Operating Procedure that defines how data is captured, how service is logged, and who is responsible for periodic audits.',
    },
  ];

  const keyTakeaways = [
    'QR codes provide instant access to manuals and service logs, reducing downtime during repairs.',
    'Automated alerts ensure preventative maintenance is never missed, extending the lifespan of high-value assets.',
    'Mobile scanning allows technicians to update maintenance records in real-time directly from the machine.',
    'Digital maintenance histories simplify tax depreciation claims and improve audit compliance.',
  ];

  return (
    <SeoPageLayout
      title="How to Use QR Codes for Equipment Maintenance"
      heroTitle="Streamline Asset Care with Smart QR Tracking"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="QR Codes for Equipment Maintenance | Asset Management 2026"
        description="Learn the 3-step process to implement QR codes for equipment maintenance. Track service history, set reminders, and access digital manuals on the go."
        keywords="QR code maintenance, equipment tracking software, asset management QR, preventative maintenance system, stockflow qr"
        url="https://www.stockflowsystems.com/qr-codes-equipment-maintenance"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Modern Asset Management: The End of the Paper Trail</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Rifling through filing cabinets for a machine manual or an old repair invoice is a waste of your team's time. By implementing a <strong>QR code system for equipment maintenance</strong>, you turn every asset into a digital hub of information.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Scanning a code on a piece of equipment instantly reveals its <strong>service history, warranty status, and upcoming maintenance needs</strong>, allowing your business to stay productive and audit-ready at all times.
          </p>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">3 Steps to QR-Powered Maintenance</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-6">
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Deep Dive */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Bridging Physical Assets & Digital Data</h2>
              <p className="text-gray-600 leading-relaxed">
                Effective maintenance relies on accuracy. When you organize your inventory with <strong>StockFlow</strong>, you can attach high-resolution photos, PDF manuals, and warranties directly to the digital item profile.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Bell className="text-blue-600 shrink-0 w-5 h-5" />
                  <span className="text-sm">Automated Service Reminders</span>
                </div>
                <div className="flex items-start gap-2">
                  <History className="text-blue-600 shrink-0 w-5 h-5" />
                  <span className="text-sm">Permanent Audit Trails</span>
                </div>
                <div className="flex items-start gap-2">
                  <Printer className="text-blue-600 shrink-0 w-5 h-5" />
                  <span className="text-sm">Instant Custom Label Printing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Scaling className="text-blue-600 shrink-0 w-5 h-5" />
                  <span className="text-sm">Scalable for 1000+ Assets</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-2xl">
              <Wrench className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">Preventative Power</h4>
              <p className="opacity-90 mb-6">Don't wait for machines to break. Use QR data to drive a proactive strategy:</p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Instant Retrieval:</strong> Vendors can scan the code to see what work was performed last.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Depreciation Support:</strong> Automatically track declining value through detailed condition logs.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Safety Compliance:</strong> Ensure operators can scan to see safety checklists before use.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SOP Section */}
      <section className="py-20 bg-gray-50 border-y">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Standardize Your Workflow</h2>
          <p className="text-lg text-gray-600 mb-8">
            A tool is only as effective as the process behind it. Formalizing your QR maintenance strategy in a <strong>Standard Operating Procedure (SOP)</strong> ensures that every employee—from new hires to veterans—knows exactly how to catalog, audit, and schedule service.
          </p>
          <div className="bg-white p-6 rounded-lg border text-left inline-block shadow-sm">
            <h5 className="font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="text-green-600" /> Key SOP Components:
            </h5>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Physical storage and organization protocols</li>
              <li>• Required digital attachments (Warranties/Manuals)</li>
              <li>• Periodic audit frequency and responsibility</li>
              <li>• Approved vendor contact lists linked to items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Icons Footer */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-800">Scan on the Go</p>
          </div>
          <div className="text-center">
            <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-800">Custom Labels</p>
          </div>
          <div className="text-center">
            <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-800">Maintenance Alerts</p>
          </div>
          <div className="text-center">
            <History className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-800">Audit Trails</p>
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