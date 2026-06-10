import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateFAQSchema } from '@/lib/structuredData';

const canonicalPath = '/barcodes-vs-qr-codes-for-inventory-management';
const PAGE_TITLE = 'Barcodes vs QR Codes for Inventory Management (2026) | StockFlow';
const PAGE_DESCRIPTION =
  'Compare barcodes vs QR codes for inventory tracking. Learn which to choose for field teams, warehouses, and trade contractors — with setup tips for StockFlow.';
const DATE_MODIFIED = '2026-06-10';

const comparisonRows = [
  ['Data capacity', '10–20 characters (SKU/UPC)', 'Up to 4,296 characters'],
  ['Scan angle', 'Line-of-sight required', 'Readable from any angle'],
  ['Hardware', 'Works with all scanners', 'Smartphone camera or 2D scanner'],
  ['Label size', 'Smaller, lower print cost', 'Larger, more visible'],
  ['Best for', 'Retail SKUs, high-volume lines', 'Field teams, rich item data, job sites'],
  ['Accuracy vs manual', '95–99%', '95–99% with error correction'],
];

const faqData = [
  {
    question: 'What is the difference between barcodes and QR codes for inventory?',
    answer:
      'Barcodes (1D) encode a short identifier like a SKU or UPC. QR codes (2D) store much more data — product details, URLs, batch numbers — and can be scanned from any angle with a smartphone camera. Both dramatically reduce manual entry errors compared to typing SKUs.',
  },
  {
    question: 'Which is better for inventory management — barcodes or QR codes?',
    answer:
      'Use barcodes when products already have UPC/EAN labels or you need the smallest, cheapest labels on a high-volume line. Use QR codes when technicians work in the field, you want smartphone-only scanning, or you need to store more than a SKU on the label.',
  },
  {
    question: 'Can I use both barcodes and QR codes in the same system?',
    answer:
      'Yes. StockFlow supports UPC, EAN, Code 128, and QR codes in one catalog. Many teams keep existing retail barcodes and generate QR labels for internal parts, bins, and kits.',
  },
  {
    question: 'Do QR codes work with traditional barcode scanners?',
    answer:
      'Most modern 2D imager scanners read both 1D barcodes and QR codes. Older laser scanners may only read 1D barcodes. QR codes also work with any smartphone camera through the StockFlow mobile app.',
  },
  {
    question: 'Which code type do HVAC, electrical, and construction teams prefer?',
    answer:
      'Field-based trade teams typically prefer QR codes because technicians already carry smartphones, labels can include part specs and job references, and scanning works in tight spaces without perfect line-of-sight.',
  },
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    datePublished: '2026-06-10',
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
];

export default function BarcodesVsQRCodesForInventoryManagementPage() {
  return (
    <SeoPageLayout
      title={PAGE_TITLE}
      seoDescription={PAGE_DESCRIPTION}
      heroTitle="Barcodes vs QR Codes for Inventory Management"
      heroDescription="A practical comparison to help you choose the right label type for your warehouse, shop floor, or field team — and how to deploy both in StockFlow."
      dateUpdated="June 10, 2026"
      faqData={faqData}
      structuredData={structuredData}
    >
      <p className="text-sm text-slate-500 mb-6">Last updated: June 10, 2026</p>

      <section className="mb-12 space-y-4">
        <p className="text-lg text-gray-700 leading-relaxed">
          Choosing between <strong>barcodes and QR codes for inventory management</strong> affects scan speed, label cost, and how much information travels with each item. Both beat manual SKU entry — accuracy jumps from 60–80% to 95–99% — but they solve different problems.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          If you are evaluating software first, start with our{' '}
          <Link to="/best-free-inventory-software-with-barcode-scanning" className="text-blue-600 underline">
            best free inventory software with barcode scanning
          </Link>{' '}
          guide. For hands-on setup, see the{' '}
          <Link to="/barcode-inventory-system" className="text-blue-600 underline">
            barcode inventory system
          </Link>{' '}
          walkthrough.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Barcodes vs QR Codes: Side-by-Side Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Factor</th>
                <th className="border p-3 text-left">1D Barcodes</th>
                <th className="border p-3 text-left">QR Codes</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  <td className="border p-3 font-semibold">{row[0]}</td>
                  <td className="border p-3">{row[1]}</td>
                  <td className="border p-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-14 prose max-w-none">
        <h2>When to Choose Barcodes</h2>
        <p>
          Barcodes are the right default when products already ship with UPC or EAN labels, you run a high-volume receiving line with dedicated scanners, or you only need to encode a short SKU. They are smaller to print and universally supported by every scanner model.
        </p>
        <h2>When to Choose QR Codes</h2>
        <p>
          QR codes win when your team scans with smartphones, works in the field or on job sites, or needs to store richer data — batch numbers, URLs, location codes — directly on the label. The larger format and error correction make them more forgiving in dusty or low-light environments.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Industry-Specific Barcode &amp; QR Code Guides</h2>
        <p className="text-gray-700 mb-4">
          Trade and field-service teams face different scanning constraints than warehouse operators. These vertical guides show how barcode and QR workflows apply in your industry:
        </p>
        <ul className="space-y-3">
          <li>
            <Link to="/hvac-inventory-management" className="text-blue-600 underline font-medium">
              HVAC inventory management
            </Link>{' '}
            — track parts across service vehicles, seasonal demand, and emergency repairs.
          </li>
          <li>
            <Link to="/electrical-inventory-management" className="text-blue-600 underline font-medium">
              Electrical inventory management
            </Link>{' '}
            — manage wire, conduit, fixtures, and tools across multiple job sites.
          </li>
          <li>
            <Link to="/contractor-inventory-management" className="text-blue-600 underline font-medium">
              Contractor inventory management
            </Link>{' '}
            — control materials, tools, and equipment for construction crews.
          </li>
        </ul>
      </section>

      <section className="mb-12 prose max-w-none">
        <h2>How to Deploy Both in StockFlow</h2>
        <p>
          StockFlow accepts UPC, EAN, Code 128, and QR codes in a single catalog. A practical rollout: keep existing retail barcodes on finished goods, generate QR labels for internal parts and bin locations, then train floor teams on mobile scan modes for receiving, transfers, and cycle counts. Enable offline queueing if your team works in areas with patchy connectivity.
        </p>
        <p>
          Manufacturers should also connect scanning to production via{' '}
          <Link to="/bill-of-materials-software-free" className="text-blue-600 underline">
            free BOM software
          </Link>{' '}
          so component scans automatically update live stock levels.
        </p>
      </section>
    </SeoPageLayout>
  );
}
