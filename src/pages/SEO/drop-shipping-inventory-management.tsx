import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, Package, RefreshCw, AlertTriangle } from "lucide-react";

const topicTitle = "Drop Shipping Inventory Management: Track Stock You Don't Own";
const canonicalPath = "/drop-shipping-inventory-management";
const metaDescription =
  "Drop shipping inventory management guide: sync supplier stock, prevent overselling, automate order routing, and manage multi-supplier catalogs.";
const keywords =
  "drop shipping inventory management, dropshipping inventory, dropship stock sync, supplier inventory sync, prevent overselling dropshipping, dropship fulfillment";

const takeaways = [
  "You don't hold stock in dropshipping — but you still need real-time supplier inventory feeds to prevent overselling.",
  "Multi-supplier catalogs require automated stock sync every 15–60 minutes, not daily CSV uploads.",
  "Route orders to the supplier with available stock and lowest cost automatically to protect margins.",
];

const faqData = [
  {
    question: "How do you manage inventory in drop shipping?",
    answer:
      "Connect supplier inventory feeds (API, EDI, or CSV) to your sales channels. Sync stock levels in real time so you never sell what suppliers can't fulfill. Use inventory software that aggregates multiple supplier catalogs into one view.",
  },
  {
    question: "What causes overselling in drop shipping?",
    answer:
      "Stale inventory data is the main cause. If supplier stock updates hourly but you sync daily, you will oversell during that gap. Set safety stock buffers (e.g., show 0 when supplier has fewer than 5 units) as an extra safeguard.",
  },
  {
    question: "Do I need inventory software for drop shipping?",
    answer:
      "Yes, once you have more than one supplier or sales channel. Manual tracking breaks down quickly. Software automates stock sync, order routing, and low-stock alerts across your entire supplier network.",
  },
  {
    question: "How do I handle multiple suppliers for the same product?",
    answer:
      "Map each SKU to primary and backup suppliers with priority rules. When the primary is out of stock, route automatically to the backup. Track cost per supplier to protect margins on every order.",
  },
];

export default function DropShippingInventoryPage() {
  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle={topicTitle}
      seoDescription={metaDescription}
      seoKeywords={keywords}
      dateUpdated="2026-06-10"
      faqData={faqData}
      keyTakeaways={takeaways}
    >
      <SEO
        title="Drop Shipping Inventory Management | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">Managing Inventory You Never Touch</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            In <strong>drop shipping</strong>, your supplier holds the stock — but your customers hold you responsible
            when items are out of stock. Effective drop shipping inventory management means treating supplier stock as
            your own: sync it, monitor it, and never sell what isn't available.
          </p>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            Core workflow
          </h3>
          <ol className="mt-4 space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
              <span><strong>Import supplier catalogs</strong> — map supplier SKUs to your store SKUs with cost and lead time.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
              <span><strong>Sync stock automatically</strong> — API or scheduled feed updates every 15–60 minutes.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</span>
              <span><strong>Set safety buffers</strong> — hide listings or show out-of-stock when supplier quantity drops below threshold.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">4</span>
              <span><strong>Route orders automatically</strong> — send fulfillment to the supplier with stock and best margin.</span>
            </li>
          </ol>

          <div className="mt-10 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-900">Common mistake</h4>
              <p className="mt-1 text-sm text-amber-800">
                Listing all supplier products without stock sync. One viral product sells out at the supplier while your
                store still shows 500 in stock — resulting in cancelled orders and damaged reputation.
              </p>
            </div>
          </div>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Tools you need
          </h3>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>Multi-channel inventory software with supplier feed integration</li>
            <li>Automated order routing to suppliers (email, API, or EDI)</li>
            <li>Low-stock alerts when supplier quantities drop</li>
            <li>Margin tracking per supplier to compare fulfillment costs</li>
          </ul>

          <p className="mt-8 text-gray-700">
            Learn about{" "}
            <Link to="/forecasting" className="text-blue-600 hover:underline font-semibold">
              demand forecasting
            </Link>{" "}
            to decide which supplier products to list, and explore{" "}
            <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">
              inventory management software
            </Link>{" "}
            that supports multi-supplier workflows.
          </p>

          <div className="mt-10 space-y-4">
            {takeaways.map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
