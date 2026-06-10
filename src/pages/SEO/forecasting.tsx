import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { CheckCircle, TrendingUp, BarChart3, Target } from "lucide-react";

const topicTitle = "Inventory Forecasting: Predict Demand and Avoid Stockouts";
const canonicalPath = "/forecasting";
const metaDescription =
  "Inventory forecasting guide: demand planning methods, moving averages, seasonal adjustments, and how to forecast stock needs without over-ordering.";
const keywords =
  "inventory forecasting, demand forecasting, inventory planning, stock forecasting, demand planning, inventory prediction, forecast accuracy";

const takeaways = [
  "Start with 12+ months of sales history — forecasting without data is guesswork.",
  "Moving average and exponential smoothing work for stable demand; add seasonality factors for peak periods.",
  "Automated forecasting in inventory software reduces stockouts by 40–60% compared to manual reordering.",
];

const actionSteps = [
  {
    title: "Collect clean historical data",
    description:
      "Export 12–24 months of sales by SKU. Remove one-off bulk orders and stockout periods that understate true demand.",
  },
  {
    title: "Choose a forecasting model",
    description:
      "Use simple moving average for steady sellers, weighted moving average for trending products, and seasonal indices for holiday or weather-driven demand.",
  },
  {
    title: "Set safety stock buffers",
    description:
      "Forecast + safety stock = reorder quantity. Safety stock covers supplier delays and demand spikes the forecast misses.",
  },
];

const faqData = [
  {
    question: "What is inventory forecasting?",
    answer:
      "Inventory forecasting predicts future demand for each product using historical sales, trends, and seasonality. Accurate forecasts help you order the right quantity at the right time — reducing both stockouts and excess inventory.",
  },
  {
    question: "What is the simplest forecasting method?",
    answer:
      "A moving average: average sales over the last 3–6 months and use that as next month's forecast. It works well for stable products with low variability. Add a seasonal multiplier for items with predictable peaks.",
  },
  {
    question: "How accurate should inventory forecasts be?",
    answer:
      "Aim for 70–85% accuracy at the SKU level. Perfect accuracy is unrealistic — the goal is to be directionally correct so you rarely run out of bestsellers and rarely overstock slow movers.",
  },
  {
    question: "Can small businesses forecast without expensive software?",
    answer:
      "Yes. Excel's FORECAST.ETS function handles basic seasonal forecasting. Free inventory software like StockFlow adds automated reorder points and demand alerts without spreadsheet maintenance.",
  },
];

export default function ForecastingPage() {
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
        title="Inventory Forecasting Guide | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
      />

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900">Why Forecasting Matters</h2>
          <p className="mt-6 max-w-3xl text-lg text-gray-700 leading-relaxed">
            Businesses lose an estimated $1.8 trillion globally to poor inventory decisions — mostly from stockouts and
            overstock. <strong>Inventory forecasting</strong> turns reactive reordering into proactive planning so you
            always have enough stock without tying up cash in excess inventory.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {actionSteps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-semibold">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Common forecasting models
          </h3>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Method</th>
                  <th className="px-4 py-3 text-left font-semibold">Best for</th>
                  <th className="px-4 py-3 text-left font-semibold">Complexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Moving average</td>
                  <td className="px-4 py-3 text-gray-600">Stable, predictable demand</td>
                  <td className="px-4 py-3 text-gray-600">Low</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Exponential smoothing</td>
                  <td className="px-4 py-3 text-gray-600">Trending products</td>
                  <td className="px-4 py-3 text-gray-600">Medium</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Seasonal decomposition</td>
                  <td className="px-4 py-3 text-gray-600">Holiday/weather-driven items</td>
                  <td className="px-4 py-3 text-gray-600">Medium</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">ML / AI forecasting</td>
                  <td className="px-4 py-3 text-gray-600">Large catalogs, multi-variable</td>
                  <td className="px-4 py-3 text-gray-600">High (automated in software)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-gray-700">
            For a deeper tool comparison, see our{" "}
            <Link to="/inventory-planning-software" className="text-blue-600 hover:underline font-semibold">
              inventory planning software guide
            </Link>{" "}
            or learn how to calculate{" "}
            <Link to="/reorder-point-formula" className="text-blue-600 hover:underline font-semibold">
              reorder points
            </Link>{" "}
            from your forecasts.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {takeaways.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <p className="text-sm text-blue-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
