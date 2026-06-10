import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, Target, BarChart3 } from "lucide-react";

const topicTitle = "FIFO vs LIFO: Which Inventory Valuation Method Is Right for You?";
const canonicalPath = "/fifo-vs-lifo";
const metaDescription =
  "FIFO vs LIFO explained: how each inventory valuation method affects COGS, taxes, and financial reporting. Compare pros, cons, and when to use each.";
const keywords =
  "FIFO vs LIFO, FIFO inventory, LIFO inventory, inventory valuation methods, first in first out, last in first out, COGS calculation, inventory accounting";

const takeaways = [
  "FIFO (First In, First Out) sells oldest stock first — best for perishables and rising-cost environments.",
  "LIFO (Last In, First Out) sells newest stock first — can lower taxable income when prices rise, but is banned under IFRS.",
  "Most small businesses use FIFO or weighted average because they are simpler and accepted internationally.",
];

const actionSteps = [
  {
    title: "Identify your cost trend",
    description:
      "If purchase costs are rising, LIFO increases COGS and lowers reported profit. FIFO does the opposite. Know your trend before choosing a method.",
  },
  {
    title: "Check accounting standards",
    description:
      "IFRS prohibits LIFO. US GAAP allows it. Confirm with your accountant which methods you can use before changing valuation.",
  },
  {
    title: "Align physical flow with method",
    description:
      "FIFO matches how most warehouses actually rotate stock. Even if you use FIFO for accounting, enforce oldest-first picking to reduce waste.",
  },
];

const metrics = [
  {
    label: "Gross margin impact",
    detail:
      "Track how your chosen method affects COGS month over month. Switching methods can shift reported margins by 5–15% in inflationary periods.",
  },
  {
    label: "Inventory age",
    detail:
      "FIFO naturally clears older stock. Monitor days-on-hand to catch slow movers before they become write-offs.",
  },
  {
    label: "Tax liability",
    detail:
      "Work with your accountant to model tax outcomes under FIFO vs LIFO before year-end. The difference can be significant for high-volume businesses.",
  },
];

const faqData = [
  {
    question: "What is the difference between FIFO and LIFO?",
    answer:
      "FIFO (First In, First Out) assumes the oldest inventory is sold first. LIFO (Last In, First Out) assumes the newest inventory is sold first. This changes which unit costs flow into Cost of Goods Sold and ending inventory value.",
  },
  {
    question: "Which is better, FIFO or LIFO?",
    answer:
      "FIFO is better for perishable goods and is required under IFRS. LIFO can reduce taxable income when costs rise but is only permitted under US GAAP. Most small businesses choose FIFO for simplicity and international compatibility.",
  },
  {
    question: "How does FIFO affect COGS?",
    answer:
      "Under FIFO, COGS uses the cost of your oldest inventory. When prices rise, FIFO produces lower COGS and higher ending inventory value compared to LIFO.",
  },
  {
    question: "Can I switch from LIFO to FIFO?",
    answer:
      "Switching methods requires IRS approval in the US and retrospective adjustment under IFRS. Consult your accountant — the change affects tax filings, financial statements, and comparability with prior periods.",
  },
];

export default function FifoVsLifoPage() {
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
        title="FIFO vs LIFO: Inventory Valuation Guide | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Understanding FIFO and LIFO</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              <strong>FIFO</strong> (First In, First Out) and <strong>LIFO</strong> (Last In, First Out) are the two most
              common inventory valuation methods. They determine which unit costs you assign to Cost of Goods Sold (COGS)
              when you sell stock — and that directly affects your gross margin, balance sheet, and tax bill.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              FIFO assumes you sell the oldest units first. LIFO assumes you sell the newest units first. In a warehouse
              that actually rotates stock oldest-first, FIFO aligns accounting with physical reality. LIFO is mainly a
              tax and reporting strategy used by some US businesses when purchase costs are climbing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              See our{" "}
              <Link to="/cost-of-goods-formula" className="text-blue-600 hover:underline font-semibold">
                COGS formula guide
              </Link>{" "}
              for how valuation methods feed into profitability calculations, or explore{" "}
              <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">
                inventory management software
              </Link>{" "}
              that tracks lot dates automatically.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Factor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">FIFO</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">LIFO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium">Physical flow match</td>
                    <td className="px-4 py-3 text-gray-600">High — matches typical warehouse practice</td>
                    <td className="px-4 py-3 text-gray-600">Low — newest stock sold first on paper</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">IFRS accepted</td>
                    <td className="px-4 py-3 text-gray-600">Yes</td>
                    <td className="px-4 py-3 text-gray-600">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Rising cost environment</td>
                    <td className="px-4 py-3 text-gray-600">Lower COGS, higher profit</td>
                    <td className="px-4 py-3 text-gray-600">Higher COGS, lower taxable profit</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Best for</td>
                    <td className="px-4 py-3 text-gray-600">Perishables, global businesses</td>
                    <td className="px-4 py-3 text-gray-600">US tax planning (non-perishables)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            {takeaways.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm"
              >
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="playbook" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How to Choose a Valuation Method</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {actionSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-semibold text-blue-600">Step {index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metrics" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Metrics to Track</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{metric.label}</h3>
                <p className="mt-3 text-sm text-gray-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
