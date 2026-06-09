import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateFAQSchema, generateHowToSchema } from '@/lib/structuredData';

const canonicalPath = '/barcode-inventory-system';
const PAGE_TITLE = 'Barcode Inventory System — Setup Guide 2026 | StockFlow';
const PAGE_DESCRIPTION =
  'Barcode inventory system guide for small businesses. Set up labels, mobile scanning, and real-time stock in StockFlow. Free, no credit card. See how it works.';
const DATE_MODIFIED = '2026-06-08';

const faqData = [
  {
    question: 'What is a barcode inventory system?',
    answer:
      'A barcode inventory system uses scannable labels to identify items and update stock levels automatically. Each scan records a receive, transfer, pick, or count event so teams spend less time typing SKUs and make fewer mistakes.',
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
      'Yes. StockFlow queues scans locally when connectivity drops, then syncs counts and movements once the device is back online.',
  },
];

const howToSteps = [
  {
    name: 'Import or create your product catalog',
    text: 'Upload a CSV or add SKUs manually in StockFlow. Include item name, SKU, unit of measure, and reorder thresholds so scans map to the right record.',
  },
  {
    name: 'Assign barcodes to every trackable item',
    text: 'Use existing UPC/EAN labels on retail goods. Generate Code 128 or QR labels for internal parts, bins, and kits. Print and place labels consistently.',
  },
  {
    name: 'Configure mobile scan workflows',
    text: 'Open StockFlow on iOS or Android and enable receiving, transfer, pick, and cycle-count modes. Test camera scanning in your warehouse lighting.',
  },
  {
    name: 'Enable offline scan queueing',
    text: 'Turn on offline mode for floor teams. Scans are stored on the device and sync automatically when Wi-Fi or cellular returns.',
  },
  {
    name: 'Run a pilot count and roll out',
    text: 'Start with one aisle or product category. Compare count variance and receiving time against your spreadsheet baseline, then expand site-wide.',
  },
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    datePublished: 'June 9, 2026',
    dateModified: DATE_MODIFIED,
    author: { '@type': 'Organization', name: 'StockFlow' },
    publisher: {
      '@type': 'Organization',
      name: 'StockFlow',
      logo: { '@type': 'ImageObject', url: 'https://www.stockflowsystems.com/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.stockflowsystems.com${canonicalPath}`,
    },
  },
  generateFAQSchema(faqData),
  generateHowToSchema({
    name: 'How to set up a barcode inventory system with StockFlow',
    description: 'Step-by-step guide to launching a barcode-based stock management system using StockFlow.',
    url: `https://www.stockflowsystems.com${canonicalPath}`,
    steps: howToSteps,
  }),
];

export default function BarcodeInventorySystemPage() {
  return (
    <SeoPageLayout
      title={PAGE_TITLE}
      seoDescription={PAGE_DESCRIPTION}
      heroTitle="Barcode Inventory System: Complete Setup Guide (2026)"
      heroDescription="Learn how to build a barcode-based stock management system with labels, mobile scanning, and real-time inventory updates."
      dateUpdated="June 9, 2026"
      faqData={faqData}
      structuredData={structuredData}
    >
      <p className="text-sm text-slate-500 mb-6">Last updated: June 9, 2026</p>

      <section className="mb-12 space-y-4">
        <p className="text-lg text-gray-700 leading-relaxed">
          A <strong>barcode inventory system</strong> replaces manual SKU entry with fast, accurate scans. For most small businesses in 2026, the fastest path is a free platform with mobile scanning, offline support, and multi-location visibility — not a spreadsheet with a USB scanner bolted on.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          StockFlow is built for this workflow. If you are comparing vendors first, start with our{' '}
          <Link to="/best-free-inventory-software-with-barcode-scanning" className="text-blue-600 underline">
            free barcode inventory software
          </Link>{' '}
          roundup. Manufacturers should also review{' '}
          <Link to="/bill-of-materials-software-free" className="text-blue-600 underline">
            free BOM software
          </Link>{' '}
          to tie production to stock.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">How to Set Up a Barcode Inventory System in StockFlow</h2>
        <ol className="space-y-5 list-none">
          {howToSteps.map((step, index) => (
            <li key={step.name} className="bg-white border rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-2">
                Step {index + 1}: {step.name}
              </h3>
              <p className="text-gray-700">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12 prose max-w-none">
        <h2>Why Teams Switch to Barcode-Based Stock Management</h2>
        <p>
          Manual counts drift. A single mistyped SKU triggers false low-stock alerts, wrong picks, and emergency purchase orders. Barcode workflows standardize identification and create an audit trail for every movement — receiving, transfer, pick, and cycle count.
        </p>
        <p>
          Good labeling is the foundation. See our{' '}
          <Link to="/how-to-label-inventory" className="text-blue-600 underline">
            how to label inventory
          </Link>{' '}
          guide for label design and placement tips before you print thousands of stickers.
        </p>
      </section>
    </SeoPageLayout>
  );
}
