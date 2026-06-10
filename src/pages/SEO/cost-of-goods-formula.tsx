import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, Calculator } from "lucide-react";

const topicTitle = "Cost of Goods Sold (COGS) Formula: Calculate It Correctly";
const canonicalPath = "/cost-of-goods-formula";
const metaDescription =
  "COGS formula explained: Beginning Inventory + Purchases - Ending Inventory. Learn how to calculate cost of goods sold for retail, manufacturing, and inventory valuation.";
const keywords =
  "cost of goods sold formula, COGS formula, how to calculate COGS, cost of goods sold calculation, inventory COGS, COGS accounting";

const takeaways = [
  "Basic formula: COGS = Beginning Inventory + Purchases - Ending Inventory.",
  "COGS directly reduces gross profit — accurate inventory counts are essential.",
  "Your inventory valuation method (FIFO, LIFO, weighted average) changes which costs flow into COGS.",
];

const faqData = [
  {
    question: "What is the cost of goods sold formula?",
    answer:
      "COGS = Beginning Inventory + Purchases (or Production Costs) - Ending Inventory. This calculates the direct cost of inventory sold during a period, including materials, labor, and overhead directly tied to production.",
  },
  {
    question: "What is included in COGS?",
    answer:
      "For retailers: purchase cost of goods sold. For manufacturers: raw materials, direct labor, and manufacturing overhead. Excluded: marketing, admin salaries, rent, and shipping to customers (those are operating expenses).",
  },
  {
    question: "How does inventory method affect COGS?",
    answer:
      "Under FIFO, oldest (usually cheapest) costs hit COGS first. Under LIFO, newest costs hit first. Weighted average blends all costs. The method you choose changes reported COGS and gross margin — see our FIFO vs LIFO guide.",
  },
  {
    question: "Why is accurate COGS important?",
    answer:
      "COGS determines gross profit, tax liability, and inventory turnover ratio. A 5% error in ending inventory count can swing COGS significantly for businesses with thin margins.",
  },
];

export default function CostOfGoodsFormulaPage() {
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
        title="Cost of Goods Sold (COGS) Formula | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">The COGS Formula</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            <strong>Cost of Goods Sold (COGS)</strong> is the direct cost of producing or purchasing the products you sold
            during a period. It is the largest line item affecting gross profit for product businesses.
          </p>

          <div className="mt-8 rounded-xl bg-slate-900 p-6 text-center">
            <p className="font-mono text-lg text-blue-300">
              COGS = Beginning Inventory + Purchases - Ending Inventory
            </p>
            <p className="mt-4 font-mono text-sm text-slate-400">
              Gross Profit = Revenue - COGS
            </p>
          </div>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Retail example
          </h3>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-700">
            <p>Beginning inventory: €50,000</p>
            <p>Purchases during period: €200,000</p>
            <p>Ending inventory: €60,000</p>
            <p className="mt-4 font-semibold text-gray-900">COGS = €50,000 + €200,000 - €60,000 = €190,000</p>
            <p className="mt-2">If revenue was €350,000 → Gross Profit = €160,000 (45.7% margin)</p>
          </div>

          <h3 className="mt-10 text-2xl font-bold text-gray-900">Manufacturing COGS</h3>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Manufacturers add direct labor and factory overhead to the formula. COGS = Beginning WIP + Manufacturing
            Costs - Ending WIP + Beginning Finished Goods - Ending Finished Goods. Track raw materials separately for
            better cost control.
          </p>

          <p className="mt-8 text-gray-700">
            COGS feeds directly into{" "}
            <Link to="/inventory-turnover" className="text-blue-600 hover:underline font-semibold">
              inventory turnover
            </Link>
            . Your valuation method matters too — compare{" "}
            <Link to="/fifo-vs-lifo" className="text-blue-600 hover:underline font-semibold">
              FIFO vs LIFO
            </Link>{" "}
            to see how each affects reported costs.
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
