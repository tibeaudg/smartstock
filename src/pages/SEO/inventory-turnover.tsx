import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, Calculator, BarChart3 } from "lucide-react";

const topicTitle = "Inventory Turnover: Formula, Benchmarks, and How to Improve It";
const canonicalPath = "/inventory-turnover";
const metaDescription =
  "Inventory turnover formula explained: COGS ÷ average inventory, what a good ratio looks like by industry, and proven ways to turn stock faster.";
const keywords =
  "inventory turnover, inventory turnover ratio, inventory turnover formula, stock turnover, how to calculate inventory turnover, good inventory turnover ratio";

const takeaways = [
  "Formula: Inventory Turnover = Cost of Goods Sold ÷ Average Inventory.",
  "Higher turnover means stock moves faster — freeing cash and reducing storage costs.",
  "Retail averages 5–10x/year; manufacturing 4–8x. Compare within your industry, not across it.",
];

const faqData = [
  {
    question: "How do you calculate inventory turnover?",
    answer:
      "Inventory Turnover = Cost of Goods Sold (COGS) ÷ Average Inventory. Average Inventory = (Beginning Inventory + Ending Inventory) ÷ 2. The result shows how many times you sell and replace your entire stock per year.",
  },
  {
    question: "What is a good inventory turnover ratio?",
    answer:
      "It varies by industry. Grocery stores target 14–20x/year; fashion retail 4–6x; manufacturing 4–8x. Too high may mean stockouts; too low means excess inventory tying up cash. Benchmark against your industry peers.",
  },
  {
    question: "What causes low inventory turnover?",
    answer:
      "Common causes: over-ordering, poor demand forecasting, obsolete or seasonal dead stock, pricing issues, and SKU proliferation. Run ABC analysis to find which items drag down your ratio.",
  },
  {
    question: "How can I improve inventory turnover?",
    answer:
      "Reduce slow-moving SKUs, improve demand forecasting, negotiate shorter supplier lead times, run promotions on aging stock, and set automated reorder points to prevent overstocking.",
  },
];

export default function InventoryTurnoverPage() {
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
        title="Inventory Turnover Ratio Guide | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">The Inventory Turnover Formula</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            <strong>Inventory turnover</strong> measures how efficiently you convert stock into sales. A ratio of 6 means
            you sell and replace your entire inventory six times per year — roughly every two months.
          </p>

          <div className="mt-8 rounded-xl bg-slate-900 p-6 text-center">
            <p className="font-mono text-lg text-blue-300">
              Inventory Turnover = COGS ÷ Average Inventory
            </p>
            <p className="mt-3 font-mono text-sm text-slate-400">
              Average Inventory = (Beginning Inventory + Ending Inventory) ÷ 2
            </p>
          </div>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Worked example
          </h3>
          <p className="mt-4 text-gray-700 leading-relaxed">
            A retailer with COGS of €600,000 and average inventory of €100,000 has a turnover ratio of 6. That means
            inventory sits for about 60 days on average (365 ÷ 6). Days Sales of Inventory (DSI) is the companion metric:
            <strong> DSI = 365 ÷ Turnover</strong>.
          </p>

          <h3 className="mt-10 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Industry benchmarks
          </h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Industry</th>
                  <th className="px-4 py-3 text-left font-semibold">Typical turnover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-3">Grocery / perishables</td><td className="px-4 py-3 text-gray-600">14–20x</td></tr>
                <tr><td className="px-4 py-3">Fashion retail</td><td className="px-4 py-3 text-gray-600">4–6x</td></tr>
                <tr><td className="px-4 py-3">Manufacturing</td><td className="px-4 py-3 text-gray-600">4–8x</td></tr>
                <tr><td className="px-4 py-3">Wholesale distribution</td><td className="px-4 py-3 text-gray-600">6–12x</td></tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-gray-700">
            See all key formulas in our{" "}
            <Link to="/inventory-formulas-and-ratios" className="text-blue-600 hover:underline font-semibold">
              inventory formulas guide
            </Link>{" "}
            or learn how{" "}
            <Link to="/cost-of-goods-formula" className="text-blue-600 hover:underline font-semibold">
              COGS
            </Link>{" "}
            feeds into turnover calculations.
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
