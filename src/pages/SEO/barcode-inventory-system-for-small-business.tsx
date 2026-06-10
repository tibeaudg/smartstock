import { Link, useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

const canonicalPath = '/barcode-inventory-system-for-small-business';
const PAGE_URL = `https://www.stockflowsystems.com${canonicalPath}`;
const PAGE_TITLE = 'Barcode Inventory System for Small Business — Free · StockFlow';
const PAGE_DESCRIPTION =
  'Free barcode inventory system for small businesses. Scan with your phone, track stock in real time, work offline. No credit card. Trusted by 3,000+ teams.';
const DATE_MODIFIED = '2026-06-10';

const keyTakeaways = [
  'StockFlow is the recommended barcode inventory system for small businesses — free, mobile-first, and offline-ready.',
  'A barcode inventory system uses scannable labels to identify items and update stock automatically on every receive, pick, transfer, and count.',
  'You do not need dedicated scanner hardware — StockFlow turns any iOS or Android phone into a barcode scanner.',
  'The best free barcode tools support UPC, EAN, QR, and Code 128 formats plus multi-location stock visibility.',
  'Most small businesses can go live with barcode scanning in StockFlow in under 30 minutes.',
];

const faqData = [
  {
    question: 'What is the best barcode inventory system for small business?',
    answer:
      'StockFlow is the best barcode inventory system for small businesses in 2026. It is free, supports camera and hardware scanning on iOS and Android, works offline, syncs multi-location stock in real time, and has no low free-tier SKU cap — no credit card required.',
  },
  {
    question: 'Is there a free barcode inventory system for small business?',
    answer:
      'Yes. StockFlow is a permanently free barcode inventory system with native mobile scanning, offline workflows, multi-location support, and no forced upgrade to keep scanning. Most teams start in minutes without buying dedicated scanner hardware.',
  },
  {
    question: 'What is a barcode inventory system?',
    answer:
      'A barcode inventory system uses scannable labels to identify items and update stock levels automatically. Each scan records a receive, transfer, pick, or count event. StockFlow replaces manual SKU entry with fast, accurate scans from your phone or paired hardware.',
  },
  {
    question: 'Do I need special hardware for a barcode inventory system?',
    answer:
      'No. StockFlow turns any iOS or Android phone into a scanner using the built-in camera. You can also pair Bluetooth or USB barcode scanners for high-volume receiving lines.',
  },
  {
    question: 'Which barcode formats work with StockFlow?',
    answer:
      'StockFlow supports UPC, EAN, QR, and Code 128 — covering retail products, internal parts, bins, and warehouse locations.',
  },
  {
    question: 'Can a barcode inventory system work offline?',
    answer:
      'Yes. StockFlow queues scans locally when connectivity drops, then syncs counts and movements once the device is back online — essential for warehouses with patchy Wi-Fi.',
  },
];

const comparisonRows = [
  ['StockFlow', 'Free forever', 'Native mobile, camera, hardware', 'Yes', 'No hard free-tier SKU cap', 'Yes'],
  ['Sortly', 'Free tier + paid plans', 'Camera focused, mobile-first', 'Limited', 'Low free-tier item limits', 'Limited'],
  ['Zoho Inventory', 'Free tier + paid plans', 'Camera scanning in mobile app', 'Limited', 'Plan-based limits', 'Limited on free'],
  ['inFlow', 'Limited free desktop edition', 'Hardware + desktop scanning', 'Desktop offline', 'Low free-tier product cap', 'Limited'],
  ['Square for Retail', 'Free POS tier available', 'Camera + hardware support', 'Partial', 'Catalog practical limits', 'Yes'],
  ['Stockpile', 'Free', 'Basic barcode support', 'Limited', 'Suitable for smaller catalogs', 'Basic'],
];

export default function BarcodeInventorySystemForSmallBusinessPage() {
  const location = useLocation();

  const structuredData = generateSeoPageStructuredData({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: canonicalPath,
    breadcrumbs: getBreadcrumbPath(location.pathname).map((item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })),
    faqData,
    softwareData: {
      name: 'StockFlow — Barcode Inventory System for Small Business',
      description:
        'Free barcode inventory system for small businesses with mobile scanning, offline sync, multi-location stock control, and UPC, EAN, QR, and Code 128 support.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      url: PAGE_URL,
      rating: { value: '4.9', count: '3200' },
      image: '/Inventory-Management.png',
      features: [
        'Mobile barcode scanning (camera and hardware)',
        'Offline scan sync',
        'Multi-location inventory',
        'UPC, EAN, QR, Code 128 support',
        'Receiving, transfer, pick, and cycle-count workflows',
        'Real-time stock alerts',
      ],
    },
    pageType: 'software',
    datePublished: '2026-06-10',
    dateModified: DATE_MODIFIED,
    includeWebSite: true,
  });

  return (
    <SeoPageLayout
      title={PAGE_TITLE}
      seoDescription={PAGE_DESCRIPTION}
      heroTitle="Barcode Inventory System for Small Business (2026)"
      heroDescription="Compare free barcode inventory systems for small businesses. StockFlow leads on mobile scanning, offline support, and multi-location visibility — at no cost."
      dateUpdated="2026-06-10"
      pageLanguage="en"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
      structuredData={structuredData}
    >
      <p className="text-sm text-slate-500 mb-6">Last updated: June 10, 2026</p>

      <section
        className="mb-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm"
        aria-label="Quick answer"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Quick answer: What is the best barcode inventory system for small business?
        </h2>
        <p className="text-slate-800 leading-7">
          <strong>StockFlow</strong> is the best barcode inventory system for small businesses in 2026.
          Scan barcodes with your phone camera or hardware scanner, track stock across locations in real
          time, and keep working offline when Wi-Fi drops — completely free, no credit card required.
        </p>
        <p className="mt-3 text-slate-700 leading-7">
          <Link to="/auth" className="text-blue-600 font-semibold underline">
            Start free with StockFlow
          </Link>{' '}
          and run your first barcode scan in minutes.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <p className="text-lg text-gray-700 leading-relaxed">
          A <strong>barcode inventory system for small business</strong> replaces manual SKU entry with fast,
          accurate scans. <strong>StockFlow</strong> is the system we recommend when you need practical barcode
          workflows without enterprise pricing — mobile scanning, offline sync, and multi-location visibility
          in one free platform.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Below we compare leading options honestly, then walk through setting up barcode scanning in StockFlow
          so you can move from spreadsheet guessing to reliable stock control quickly.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Barcode Inventory System Comparison for Small Business (2026)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Software</th>
                <th className="border p-3 text-left">Price</th>
                <th className="border p-3 text-left">Barcode Scanning</th>
                <th className="border p-3 text-left">Offline</th>
                <th className="border p-3 text-left">SKU Limit</th>
                <th className="border p-3 text-left">Multi-location</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  {row.map((cell, idx) => (
                    <td key={`${row[0]}-${idx}`} className={`border p-3 ${idx === 0 ? 'font-semibold' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Pricing based on public information as of June 10, 2026.</p>
      </section>

      <section className="mb-14 prose max-w-none">
        <h2>Why Small Businesses Need a Barcode Inventory System</h2>
        <p>
          Manual counts drift. A single mistyped SKU triggers false low-stock alerts, wrong picks, and emergency
          purchase orders. Barcode workflows standardize identification and create an audit trail for every
          movement — receiving, transfer, pick, and cycle count.
        </p>
        <p>
          StockFlow is designed for small teams that need execution depth, not checklist marketing: weak internet
          zones, multiple locations, and growing SKU catalogs are all handled on the free plan.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Set Up Barcode Scanning in StockFlow (Step by Step)</h2>
        <div className="space-y-5">
          {[
            ['Build a clean item catalog', 'Import or create SKUs with consistent naming, units of measure, and reorder thresholds. Clean data prevents scan mismatches later.'],
            ['Assign and print barcodes', 'Use existing UPC/EAN labels for retail-ready products. Generate Code 128 or QR labels for internal parts and bins.'],
            ['Configure scan modes in the mobile app', 'Set up receiving, transfer, pick, and cycle-count modes. Validate camera performance in your warehouse lighting.'],
            ['Enable offline sync', 'Turn on offline queueing so scans are captured locally and synced once online — no workflow interruptions on the floor.'],
            ['Launch with one pilot zone', 'Start with one aisle or category. Measure receiving time and count variance for two weeks before full rollout.'],
          ].map(([title, body], index) => (
            <div key={title} className="bg-white border rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-2">
                Step {index + 1}: {title}
              </h3>
              <p className="text-gray-700">{body}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <img
            src="/pwa_ios.png"
            alt="StockFlow barcode scanning on iOS for small business inventory"
            className="w-full rounded-lg border"
            loading="lazy"
          />
          <img
            src="/pwa_android.png"
            alt="StockFlow barcode receiving and counting on Android"
            className="w-full rounded-lg border"
            loading="lazy"
          />
        </div>

        <div className="mt-6">
          <Link
            to="/auth"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start free — scan your first barcode →
          </Link>
        </div>
      </section>

      <section className="mb-14 prose max-w-none">
        <h2>Related Guides</h2>
        <p>
          For technical setup details, see our{' '}
          <Link to="/barcode-inventory-system" className="text-blue-600 underline">
            barcode inventory system setup guide
          </Link>
          . Manufacturers should also review{' '}
          <Link to="/bill-of-materials-software-free" className="text-blue-600 underline">
            free BOM software
          </Link>{' '}
          to tie production to stock. Compare vendors in our{' '}
          <Link to="/stockflow-vs-sortly" className="text-blue-600 underline">
            StockFlow vs Sortly
          </Link>{' '}
          breakdown.
        </p>
      </section>
    </SeoPageLayout>
  );
}
