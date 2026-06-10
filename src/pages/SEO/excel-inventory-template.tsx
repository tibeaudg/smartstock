import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, Calculator, BarChart3 } from "lucide-react";

const topicTitle = "Free Excel Inventory Template: Track Stock Without Software";
const canonicalPath = "/excel-inventory-template";
const metaDescription =
  "Free Excel inventory template guide: columns to include, formulas for stock levels, reorder alerts, and when to upgrade from spreadsheets to inventory software.";
const keywords =
  "excel inventory template, inventory spreadsheet, free inventory template, excel stock tracking, inventory management excel, inventory formula excel";

const takeaways = [
  "A basic Excel inventory template needs: SKU, item name, quantity on hand, reorder point, unit cost, and location.",
  "Use =SUMIFS() and conditional formatting to flag low-stock items automatically.",
  "Excel works for under 200 SKUs; beyond that, errors and version conflicts make dedicated software cheaper.",
];

const faqData = [
  {
    question: "What columns should an Excel inventory template include?",
    answer:
      "At minimum: SKU/ID, item name, category, quantity on hand, unit cost, reorder point, supplier, and location. Add columns for last count date, expiry date (for perishables), and barcode number if you scan labels.",
  },
  {
    question: "How do I calculate inventory in Excel?",
    answer:
      "Current stock = Opening quantity + SUM(purchases) - SUM(sales/usage). Use a separate Transactions sheet and =SUMIFS() to aggregate by SKU. For reorder alerts, use =IF(quantity<=reorder_point,\"ORDER\",\"OK\").",
  },
  {
    question: "Is Excel good enough for inventory management?",
    answer:
      "Excel is fine for micro-businesses with fewer than 200 SKUs and one location. It breaks down with multiple users, real-time updates, barcode scanning, and audit trails. Most growing businesses switch to inventory software within 12–18 months.",
  },
  {
    question: "Can I forecast demand in Excel?",
    answer:
      "Yes — Excel's FORECAST.ETS function predicts demand from historical sales data. It works for simple seasonal patterns but lacks the automation and accuracy of dedicated forecasting tools. See our forecasting guide for more.",
  },
];

export default function ExcelInventoryTemplatePage() {
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
        title="Free Excel Inventory Template Guide | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">Build Your Excel Inventory Template</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            An Excel inventory template is the fastest way to start tracking stock — no software cost, no learning curve.
            The key is structure: separate your master item list from transaction logs so formulas stay accurate as volume
            grows.
          </p>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Essential sheets
          </h3>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li>
              <strong>Items</strong> — master list with SKU, name, category, unit cost, reorder point, and supplier.
            </li>
            <li>
              <strong>Transactions</strong> — log every purchase, sale, and adjustment with date, SKU, quantity, and
              type.
            </li>
            <li>
              <strong>Dashboard</strong> — summary view with current stock, stock value, and low-stock alerts.
            </li>
          </ul>

          <div className="mt-8 rounded-xl bg-slate-900 p-6 font-mono text-sm text-blue-300">
            <p>Current Stock = Opening + SUMIFS(Transactions!Qty, SKU, A2, Type, "IN")</p>
            <p className="mt-2">{"           - SUMIFS(Transactions!Qty, SKU, A2, Type, \"OUT\")"}</p>
            <p className="mt-4">Reorder Alert = IF(CurrentStock &lt;= ReorderPoint, "ORDER NOW", "OK")</p>
          </div>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            When to move beyond Excel
          </h3>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Switch to inventory software when you need barcode scanning, multi-location sync, or more than one person
            updating stock simultaneously. Manual spreadsheets typically have a 15–20% error rate — that cost exceeds
            most software subscriptions quickly.
          </p>
          <p className="mt-4 text-gray-700">
            Compare options in our{" "}
            <Link to="/best-stock-management-software" className="text-blue-600 hover:underline font-semibold">
              best stock management software guide
            </Link>{" "}
            or start free with{" "}
            <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">
              StockFlow
            </Link>
            .
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
