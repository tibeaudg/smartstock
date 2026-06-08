import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';

const canonicalPath = '/bill-of-materials-software-free';
const PAGE_TITLE = 'Free BOM Software 2026 — Stop Spreadsheets | StockFlow';
const PAGE_DESCRIPTION =
  'Free bill of materials software for small manufacturers. Multi-level BOMs, live stock deduction, and cost rollup — no spreadsheet chaos. Start for free.';
const DATE_MODIFIED = '2026-06-08';

const faqData = [
  {
    question: 'What is BOM software?',
    answer:
      'BOM software lets manufacturers create, manage, and version multi-level lists of components, raw materials, and sub-assemblies needed to build a product. It replaces manual spreadsheets with live stock links, costing, and production handoff workflows.',
  },
  {
    question: 'Is there free bill of materials software?',
    answer:
      'Yes. StockFlow offers permanently free BOM software with multi-level BOM creation, component cost tracking, and live inventory deduction when you run a production order — no credit card required.',
  },
  {
    question: 'How do I manage a BOM without Excel?',
    answer:
      'Import your spreadsheet into StockFlow, map SKUs and quantities, then link each BOM line to live inventory. When you run production, StockFlow deducts components automatically and rolls up costs — no manual copy-paste or version conflicts.',
  },
  {
    question: 'What is the difference between BOM and MRP?',
    answer:
      'A BOM is the structured recipe for a product. MRP (Material Requirements Planning) uses BOMs alongside demand forecasts and lead times to calculate what to purchase and when. BOM software is the foundation; MRP adds the planning layer on top.',
  },
  {
    question: 'Can I import my existing BOM spreadsheet?',
    answer:
      'StockFlow supports CSV import for products and components. You can map your existing columns to fields like SKU, quantity, and unit cost, and have your BOM structure live within minutes.',
  },
  {
    question: 'How does free BOM software handle multi-level bills of materials?',
    answer:
      'Multi-level BOMs (also called nested BOMs) have sub-assemblies that are themselves made from components. StockFlow supports unlimited nesting — a finished good can contain sub-assemblies which each have their own component lists, with costs and stock levels rolling up automatically.',
  },
];

const comparisonRows = [
  ['StockFlow', 'Free forever', 'Multi-level BOM, live inventory deduction, cost rollup, CSV import', 'Less suited to complex MRP scheduling'],
  ['Odoo (Community)', 'Free self-hosted', 'Very configurable, broad ERP modules', 'Significant setup and maintenance effort'],
  ['inFlow', 'Paid (trial only)', 'Strong manufacturing depth', 'No meaningful free tier'],
  ['Katana MRP', 'Paid (trial only)', 'Production scheduling focus', 'Higher cost profile; free tier removed'],
  ['Google Sheets', 'Free', 'Familiar, flexible', 'No live inventory link, breaks at scale, no audit trail'],
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StockFlow — Free Bill of Materials Software',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `https://www.stockflowsystems.com${canonicalPath}`,
    description:
      'Free bill of materials software with multi-level BOM creation, live inventory deduction, component cost rollup, and CSV import.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    datePublished: '2026-06-02',
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
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  },
];

export default function BillOfMaterialsSoftwareFree() {
  return (
    <SeoPageLayout
      title={PAGE_TITLE}
      seoDescription={PAGE_DESCRIPTION}
      heroTitle="Free Bill of Materials Software (2026)"
      dateUpdated="June 2026"
      faqData={faqData}
      structuredData={structuredData}
    >
      <p className="text-sm text-slate-500 mb-6">Last updated: June 2026</p>

      {/* Intro */}
      <section className="py-10 space-y-4">
        <p className="text-slate-700 leading-7">
          Most small manufacturers and product-based businesses start with a spreadsheet BOM in 2026. It works until it doesn't:
          a component changes price, a sub-assembly gets updated, or two people edit the file at the same time and the
          version history becomes unusable. Free bill of materials software solves this without the cost of a full ERP.
        </p>
        <p className="text-slate-700 leading-7">
          This page explains what to look for in BOM software, how the main free options compare, and what StockFlow
          specifically offers at no cost. If you are already sold on trying it, you can{' '}
          <Link to="/auth" className="text-blue-600 underline">
            create a free account
          </Link>{' '}
          and import your first BOM in under ten minutes.
        </p>
      </section>

      {/* What is a BOM */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">What Is a Bill of Materials?</h2>
        <p className="text-slate-700 leading-7">
          A bill of materials (BOM) is a structured list of every raw material, component, sub-assembly, and quantity
          required to manufacture one unit of a finished product. Think of it as the recipe: the finished good is the
          dish, and the BOM lists every ingredient with exact amounts.
        </p>
        <p className="text-slate-700 leading-7">
          BOMs exist in several forms depending on where they are used in the business:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 leading-7 ml-2">
          <li>
            <strong>Engineering BOM (EBOM)</strong> — the design-intent structure from the engineering or product team,
            often including part numbers and tolerances.
          </li>
          <li>
            <strong>Manufacturing BOM (MBOM)</strong> — the production-ready version that maps to actual purchased
            parts, sub-assemblies, and work instructions on the shop floor.
          </li>
          <li>
            <strong>Sales BOM</strong> — used to configure a product that is sold as a kit or bundle, where the
            individual components appear on the sales order rather than the finished good.
          </li>
          <li>
            <strong>Service BOM</strong> — lists spare parts and consumables needed to maintain or repair a product
            in the field.
          </li>
        </ul>
        <p className="text-slate-700 leading-7">
          For most small manufacturers, the manufacturing BOM is what matters most day-to-day. It answers: "If I want
          to make 50 units, do I have enough components in stock, and what do I need to order?"
        </p>
      </section>

      {/* Why spreadsheets fail */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Why Spreadsheet BOMs Break Down</h2>
        <p className="text-slate-700 leading-7">
          Spreadsheets are a natural starting point. The problems emerge at scale:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['No live inventory link', 'You have to manually check stock levels against your BOM every time you plan a production run. One out-of-date cell and you commit to a run you cannot complete.'],
            ['Version chaos', 'When a supplier changes a component, updating every BOM that references it is a manual audit. With 30+ products this becomes a weekly risk.'],
            ['No cost rollup', 'Calculating the true manufactured cost of a product — including nested sub-assemblies — requires complex formulas that break when the BOM structure changes.'],
            ['No audit trail', 'Knowing who changed what and when is almost impossible without version history tooling layered on top of your spreadsheet platform.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border p-5 bg-slate-50">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-6">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What good free BOM software does */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">What Good Free BOM Software Must Do</h2>
        <p className="text-slate-700 leading-7">
          Not all free BOM tools are equal. Before choosing one, verify it handles the following:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7 ml-2">
          <li>
            <strong>Multi-level (nested) BOMs</strong> — a finished good must be able to contain sub-assemblies that
            themselves have component lists, with costs rolling up automatically.
          </li>
          <li>
            <strong>Live inventory deduction</strong> — when you run a production order, the software should
            automatically reduce component stock levels and increase finished-good stock.
          </li>
          <li>
            <strong>Component cost tracking</strong> — you need to know the material cost of each finished good,
            updated dynamically when supplier prices change.
          </li>
          <li>
            <strong>Import from spreadsheet</strong> — if you have an existing BOM in Excel or Google Sheets, a
            CSV import path is essential to avoid rebuilding from scratch.
          </li>
          <li>
            <strong>No meaningful tier wall</strong> — many "free" tools limit the number of BOMs, products, or
            users on the free plan. Check the cap before committing time to setup.
          </li>
        </ol>
      </section>

      {/* Comparison table */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">Free Bill of Materials Software Comparison (2026)</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Platform</th>
                <th className="p-3 text-left">Free tier</th>
                <th className="p-3 text-left">BOM capabilities</th>
                <th className="p-3 text-left">Trade-offs</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]} className="border-t align-top">
                  <td className="p-3 font-semibold">{row[0]}</td>
                  <td className="p-3">{row[1]}</td>
                  <td className="p-3">{row[2]}</td>
                  <td className="p-3">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Pricing based on public information as of June 2026. Always verify current tiers on vendor sites.</p>
      </section>

      {/* StockFlow specifics */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">What StockFlow's Free BOM Plan Includes</h2>
        <p className="text-slate-700 leading-7">
          StockFlow is a free-first inventory and BOM platform. The free plan has no product or user limit. Here is
          exactly what you get at no cost:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 leading-7 ml-2">
          <li>Multi-level bill of materials with unlimited nesting depth</li>
          <li>Live stock deduction when a production order is completed</li>
          <li>Component cost tracking with automatic finished-good cost rollup</li>
          <li>CSV import for products and BOM lines</li>
          <li>Barcode scanning to receive components and dispatch finished goods</li>
          <li>Low-stock alerts at the component level so you never start a build you cannot finish</li>
          <li>Purchase order creation from a BOM — generate a PO for missing components in one click</li>
          <li>Multi-location support if your components are stored across warehouses</li>
        </ul>
        <p className="text-slate-700 leading-7">
          There is no credit card required and no time-limited trial. The free plan is permanently free.
        </p>
        <div className="mt-4">
          <Link
            to="/auth"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start free — no credit card →
          </Link>
        </div>
      </section>

      {/* How to migrate */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">How to Migrate a Spreadsheet BOM to Software</h2>
        <p className="text-slate-700 leading-7">
          The migration is simpler than most teams expect. A practical sequence:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7 ml-2">
          <li>
            <strong>Export your component list</strong> from your spreadsheet as a CSV with columns: SKU, name,
            unit of measure, current stock quantity, and unit cost.
          </li>
          <li>
            <strong>Import components as products</strong> into StockFlow via the CSV import. Map your columns to
            the corresponding fields. This typically takes under five minutes.
          </li>
          <li>
            <strong>Create your finished goods</strong> as separate products. Set their type to "Manufactured" or
            similar, then attach the imported components via the BOM builder.
          </li>
          <li>
            <strong>Set quantities per unit</strong> — how many of each component goes into one finished good. Add
            a unit cost override if the component cost differs from the purchased price (e.g., scrap allowance).
          </li>
          <li>
            <strong>Run a test production order</strong> with a small quantity to confirm stock deductions behave
            as expected before cutting over fully.
          </li>
        </ol>
      </section>

      {/* Internal links */}
      <section className="py-8 space-y-3">
        <h2 className="text-2xl font-bold mb-2">Related Guides</h2>
        <ul className="space-y-2 text-slate-700">
          <li>
            <Link to="/free-mrp-software" className="text-blue-600 underline">
              Free MRP software for small manufacturers
            </Link>{' '}
            — when you need demand-driven production scheduling on top of your BOM.
          </li>
          <li>
            <Link to="/best-free-inventory-software-with-barcode-scanning" className="text-blue-600 underline">
              Best free inventory software with barcode scanning
            </Link>{' '}
            — if barcode-driven receiving and picking is your primary need.
          </li>
          <li>
            <Link to="/nl/gratis-stuklijst-software" className="text-blue-600 underline">
              Gratis stuklijst beheer software
            </Link>{' '}
            — deze pagina in het Nederlands.
          </li>
        </ul>
      </section>

    </SeoPageLayout>
  );
}
