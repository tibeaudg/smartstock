import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ScanLine,
  Smartphone,
  DollarSign,
  Zap,
  ShieldCheck,
  PackageCheck,
  Maximize,
  AlertCircle,
  CheckCircle,
  Construction,
  Bluetooth,
  LayoutGrid
} from 'lucide-react';

export default function HandheldScannersGuidePage() {
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
      question: 'What is the difference between a dedicated handheld scanner and a smartphone scanner?',
      answer:
        'A dedicated handheld scanner is a standalone device often connected via Bluetooth, designed solely for high-volume scanning. A smartphone scanner uses an app like StockFlow to turn the device’s built-in camera into a scanner. Smartphones are more cost-effective and eliminate the need for extra hardware, while dedicated scanners are sometimes preferred for extreme industrial environments.',
    },
    {
      question: 'Why are QR codes often preferred over traditional barcodes for handheld scanning?',
      answer:
        'QR codes can be scanned from any angle (360 degrees), whereas traditional barcodes typically require horizontal alignment. This makes QR codes much faster to scan in hard-to-reach warehouse locations or when items are stored in unusual positions.',
    },
    {
      question: 'Are handheld scanners expensive to implement?',
      answer:
        'Yes, dedicated hardware can be costly, especially for large teams. Beyond the initial purchase, businesses must account for maintenance, lost devices, and battery replacements. This is why many businesses shift to mobile-first apps that utilize devices employees already own.',
    },
    {
      question: 'Do handheld scanners help reduce human error?',
      answer:
        'Absolutely. Scanning a unique barcode or QR code ensures the user is directed to the exact digital item profile, eliminating errors caused by manual data entry or confusing items with similar names.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Handheld Inventory Scanners: Pros, Cons & Alternatives | StockFlow',
    description:
      'Evaluate the benefits and drawbacks of handheld inventory scanners. Learn how to choose between dedicated hardware and mobile scanning apps.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Mobile Scanner',
      description:
        'A high-performance inventory app that transforms any smartphone into a professional-grade barcode and QR code scanner.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Built-in camera scanning',
        'QR & Barcode compatibility',
        'Batch scanning mode',
        'Offline data sync',
        'Third-party Bluetooth support',
      ],
      image: 'https://www.stockflowsystems.com/handheld-scanner-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const pros = [
    {
      icon: Zap,
      title: 'Rapid Mobility',
      description: 'Scan items "on the go" anywhere in the warehouse or on a job site without being tethered to a workstation.',
    },
    {
      icon: PackageCheck,
      title: 'Perpetual Accuracy',
      description: 'Facilitates real-time check-in/out, ensuring your digital inventory list is always an exact reflection of physical stock.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Error Entry',
      description: 'Eliminate manual typos. Every unique scan takes you directly to the correct item profile, regardless of similar product names.',
    },
  ];

  const cons = [
    {
      icon: DollarSign,
      title: 'High Initial Investment',
      description: 'Outfitting a large team with dedicated hardware can cost thousands, plus ongoing maintenance and replacement costs.',
    },
    {
      icon: Construction,
      title: 'Clunky Hardware',
      description: 'Larger, cheaper scanners can be cumbersome, leading to lower employee adoption and decreased workflow efficiency.',
    },
    {
      icon: AlertCircle,
      title: 'Asset Bloat',
      description: 'Buying dedicated scanners adds another category of assets to manage, track, and secure within your own inventory.',
    },
  ];

  const keyTakeaways = [
    'Handheld scanning is essential for perpetual inventory management and eliminating manual data entry errors.',
    'QR codes offer a significant speed advantage over barcodes due to their 360-degree scannability.',
    'Dedicated scanners add significant overhead in terms of hardware costs and device management.',
    'Mobile-first apps provide the same professional scanning power using the smartphones your team already carries.',
  ];

  return (
    <SeoPageLayout
      title="Handheld Inventory Scanners: Pros and Cons"
      heroTitle="Is Dedicated Scanning Hardware Right for Your Business?"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Handheld Inventory Scanners Guide 2026 | Pros, Cons & Costs"
        description="Explore the pros and cons of handheld inventory scanners. Compare dedicated hardware with mobile scanning apps to find the best fit for your warehouse."
        keywords="handheld inventory scanner, barcode scanner pros and cons, mobile inventory app, QR code scanning hardware, stockflow scanner"
        url="https://www.stockflowsystems.com/handheld-inventory-scanners-pros-cons"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Automation at Your Fingertips</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In modern manufacturing and warehousing, scanning is no longer optional—it's the backbone of accuracy. While <strong>handheld inventory scanners</strong> have been the industry standard for decades, new mobile technologies are challenging the need for dedicated hardware.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you use <strong>Bluetooth-enabled handhelds</strong> or <strong>smartphone-based apps</strong>, the goal remains the same: eliminating the human error of manual logs and achieving a truly perpetual inventory system.
          </p>
        </div>
      </section>

      {/* Pros & Cons Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Pros */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <CheckCircle className="text-green-600" /> The Advantages
              </h2>
              <div className="space-y-8">
                {pros.map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <XCircle className="text-red-600" /> The Drawbacks
              </h2>
              <div className="space-y-8">
                {cons.map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Alternative Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-blue-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex-1 p-12 text-white">
              <Smartphone className="w-12 h-12 text-blue-400 mb-6" />
              <h2 className="text-3xl font-bold mb-6">The Smartphone Revolution</h2>
              <p className="text-blue-100 leading-relaxed mb-6">
                Why buy extra hardware when your team already carries a powerful scanner in their pocket? <strong>StockFlow</strong> transforms any mobile device into a professional-grade scanner.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">1</div>
                  <span><strong>Zero Hardware Costs:</strong> Eliminate the need for $500+ handheld units.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">2</div>
                  <span><strong>Instant Adoption:</strong> No training required for devices employees already use daily.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">3</div>
                  <span><strong>Hybrid Flexibility:</strong> Still prefer hardware? StockFlow syncs perfectly with third-party Bluetooth scanners.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 p-12 bg-blue-800/50 h-full flex items-center justify-center">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <Bluetooth className="text-blue-300 mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">BT Support</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <ScanLine className="text-blue-300 mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">QR/Barcode</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <LayoutGrid className="text-blue-300 mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">Batch Scan</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <Maximize className="text-blue-300 mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">Any Angle</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Summary */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">The Verdict: Hardware vs. Software</h2>
          <p className="text-lg text-gray-600 mb-12">
            The best scanner is the one your team will actually use. While dedicated scanners offer durability in heavy industrial settings, the <strong>flexibility and cost-savings</strong> of mobile inventory apps like StockFlow make them the superior choice for growing businesses.
          </p>
          <div className="inline-flex flex-col md:flex-row gap-6">
            <div className="p-4 bg-white border rounded-xl flex items-center gap-3 shadow-sm">
              <ScanLine className="text-blue-600" />
              <span className="text-sm font-semibold">Supports All 1D/2D Barcode Types</span>
            </div>
            <div className="p-4 bg-white border rounded-xl flex items-center gap-3 shadow-sm">
              <Smartphone className="text-blue-600" />
              <span className="text-sm font-semibold">Optimized for iOS & Android</span>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

function XCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}