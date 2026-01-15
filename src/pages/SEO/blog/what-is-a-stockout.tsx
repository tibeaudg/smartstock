import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";
import { generateSidebarContent } from "@/utils/seoPageHelpers";
import { CheckCircle, Target, BarChart3, Lightbulb, AlertTriangle, TrendingDown, Clock, Users, DollarSign, Package, Zap, Shield } from "lucide-react";

const topicTitle = "What Is A Stockout: Complete Guide to Definition, Causes, Costs & Prevention";
const canonicalPath = "/what-is-a-stockout";
const metaDescription = "Complete guide to stockouts: definition, types, causes, and real costs. Learn how stockouts impact revenue (10-20% loss), customer loyalty (30-40% switch), and brand reputation. Discover proven prevention strategies including reorder points, safety stock, and demand forecasting.";
const keywords = "what is a stockout, stockout definition, stockout meaning, prevent stockouts, stockout costs, inventory stockout, out of stock, stockout prevention, stockout causes, stockout impact, safety stock, reorder point, demand forecasting, inventory management, stockout examples, stockout statistics";
const heroBadge = "Topic Guide • Updated September 2025";
const summaryCopy = "A stockout occurs when inventory for a product is completely depleted and unavailable for sale. Stockouts result in lost sales, customer dissatisfaction, and potential long-term damage to brand reputation. Common causes include inaccurate demand forecasting, delayed supplier deliveries, inadequate safety stock, and poor inventory management. Preventing stockouts requires accurate tracking, automated reorder points, safety stock buffers, and reliable supplier relationships.";
const takeaways = [
  "Stockouts occur when inventory is completely depleted, resulting in lost sales, customer dissatisfaction, and potential long-term revenue loss—costing businesses 10-20% of revenue on affected items.",
  "Common causes include inaccurate forecasting, supplier delays, inadequate safety stock, poor inventory tracking, unexpected demand spikes, production delays, and supply chain disruptions.",
  "Prevention strategies include automated reorder points, safety stock buffers, accurate demand forecasting, reliable suppliers, real-time inventory visibility, and regular inventory audits.",
  "The true cost of stockouts extends beyond lost sales to include rush shipping fees, customer churn (30-40% switch to competitors), brand damage, and operational disruptions.",
  "Effective stockout prevention requires a combination of technology (inventory management systems), processes (automated reordering), and relationships (reliable suppliers)."
];
const actionSteps = [
  {
    "title": "Set up automated reorder points",
    "description": "Calculate optimal reorder points based on lead times and average demand. Configure automated alerts that notify you when inventory reaches reorder levels, ensuring you order before stockouts occur."
  },
  {
    "title": "Maintain safety stock",
    "description": "Keep safety stock buffers to protect against demand variability and supplier delays. Calculate safety stock based on demand uncertainty and lead time variability to prevent stockouts."
  },
  {
    "title": "Improve demand forecasting",
    "description": "Use historical sales data and trends to forecast demand more accurately. Adjust forecasts for seasonality, promotions, and market changes to better predict inventory needs."
  }
];
const metrics = [
  {
    "label": "Stockout frequency",
    "detail": "Track how often items go out of stock. Aim to reduce stockouts by 40-60% through better forecasting, automated reordering, and safety stock optimization."
  },
  {
    "label": "Lost sales from stockouts",
    "detail": "Estimate revenue lost due to stockouts. Calculate by multiplying out-of-stock days by average daily sales. This metric highlights the true cost of stockouts."
  },
  {
    "label": "Stockout recovery time",
    "detail": "Measure how quickly inventory is replenished after a stockout. Faster recovery minimizes customer impact and lost sales opportunities."
  }
];
const faqData = [
  {
    "question": "What is a stockout?",
    "answer": "A stockout (also called 'out of stock' or 'OOS') occurs when inventory for a product is completely depleted and unavailable for sale. Stockouts happen when demand exceeds available inventory and no safety stock buffer exists. They result in lost sales, customer dissatisfaction, and potential long-term damage to brand reputation. Stockouts can be temporary (hours or days) or extended (weeks or months), with longer stockouts causing more severe business impact."
  },
  {
    "question": "What causes stockouts?",
    "answer": "Stockouts are caused by multiple factors: inaccurate demand forecasting (underestimating sales), delayed supplier deliveries, inadequate safety stock buffers, poor inventory tracking (showing inventory that doesn't exist), unexpected demand spikes (viral products, promotions), production delays, supply chain disruptions, seasonal demand variations, and human error in ordering. Most stockouts result from poor inventory management practices rather than external factors alone."
  },
  {
    "question": "How do you prevent stockouts?",
    "answer": "Prevent stockouts through: 1) Automated reorder points that trigger orders when stock reaches minimum levels, 2) Safety stock buffers to protect against demand variability, 3) Accurate demand forecasting using historical data and trends, 4) Real-time inventory visibility through management software, 5) Reliable supplier relationships with backup suppliers, 6) Regular inventory audits to maintain accuracy, 7) Lead time monitoring to adjust reorder points, and 8) Multi-location inventory management for better distribution."
  },
  {
    "question": "What is the cost of a stockout?",
    "answer": "Stockout costs include: lost sales revenue (10-20% of potential revenue on affected items), customer dissatisfaction leading to churn (30-40% of customers switch to competitors after one stockout), rush shipping fees (€50-200 per emergency order), brand reputation damage, operational disruptions, and long-term revenue loss from lost customer relationships. One study found that a single stockout can cost a retailer €2,000-€12,000 in lost revenue over six months for just 10 SKUs."
  },
  {
    "question": "What is the difference between a stockout and low stock?",
    "answer": "Low stock means inventory levels are below optimal but items are still available for sale. A stockout means inventory is completely depleted (zero units) and unavailable. Low stock is a warning sign that requires action to prevent a stockout. Stockouts are the result of failing to address low stock situations. Monitoring low stock levels and setting reorder points helps prevent stockouts before they occur."
  },
  {
    "question": "How do you calculate safety stock to prevent stockouts?",
    "answer": "Safety stock is calculated using: (Maximum daily demand × Maximum lead time) - (Average daily demand × Average lead time). This formula accounts for demand variability and supplier lead time uncertainty. For example, if maximum daily demand is 20 units, maximum lead time is 10 days, average daily demand is 15 units, and average lead time is 7 days: (20 × 10) - (15 × 7) = 200 - 105 = 95 units of safety stock. This buffer protects against unexpected demand spikes and supplier delays."
  },
  {
    "question": "What industries are most affected by stockouts?",
    "answer": "Retail (especially fashion and electronics), food service (perishable items), healthcare (medical supplies), automotive parts, and ecommerce are most affected. Retailers lose 8-12% of sales to stockouts. Food service faces waste from expired items if not managed properly. Healthcare stockouts can impact patient care. Ecommerce stockouts result in cart abandonment rates of 20-30%. However, any business with inventory faces stockout risks if proper management isn't in place."
  },
  {
    "question": "How long does it take to recover from a stockout?",
    "answer": "Stockout recovery time varies: immediate recovery (same day) if backup inventory exists at another location, 1-3 days for rush orders from reliable suppliers, 1-2 weeks for standard reordering, and 4+ weeks for custom or imported items. Faster recovery minimizes customer impact. The best strategy is preventing stockouts through proper inventory management rather than reacting to them. Real-time inventory systems can reduce recovery time by enabling faster decision-making."
  }
];
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is A Stockout: Complete Guide to Definition, Causes, Costs & Prevention",
    "description": "Comprehensive guide to stockouts: definition, types, causes, real costs, and proven prevention strategies. Learn how stockouts impact revenue, customer loyalty, and brand reputation, plus actionable steps to prevent them.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2025-09-26",
    "dateModified": "2026-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/what-is-a-stockout"
    },
    "articleSection": "Inventory Management",
    "keywords": "stockout, out of stock, inventory management, stockout prevention, safety stock, reorder point"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
];

export default function SeoWhatIsAStockoutPage() {
  
  const location = useLocation();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));



  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "What Is A Stockout", path: canonicalPath }
  ];

  return (
    <SeoPageLayout 
      breadcrumbItems={breadcrumbItems}
      heroTitle={topicTitle} 
      heroDescription={metaDescription}
      dateUpdated="01/15/2026"
      keyTakeaways={takeaways}
    >
      <SEO
        title={`What Is A Stockout: Complete Guide 2026 - Definition, Causes, Costs & Prevention | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        structuredData={structuredData}
      />

      <StructuredData data={pageStructuredData} />



      {/* Hero / Introduction */}
      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">What is a Stockout? Understanding the Complete Impact</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              A <strong>stockout</strong> (also called "out of stock" or OOS) occurs when inventory for a product is completely depleted and unavailable for sale when a customer wants to purchase it. This seemingly simple definition belies the complex and costly consequences that stockouts create for businesses across industries.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Stockouts cost businesses 10-20% of potential revenue on affected items. More critically, research shows that 30-40% of customers shop elsewhere after experiencing a single stockout, and many never return. A fashion retailer case study revealed €8,500 in lost sales over three months from repeated stockouts on bestsellers. Customers switched to competitors, and the business never recovered those relationships.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Stockouts happen when demand exceeds available inventory and no safety stock buffer exists. While external factors like supplier delays or unexpected demand spikes can trigger stockouts, most businesses cause their own stockouts through poor inventory management: inaccurate forecasting, ignoring reorder points, or poor tracking systems that show inventory that doesn't actually exist.
            </p>
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-xl font-semibold">The Hidden Costs of Stockouts</h3>
              </div>
              <p className="mt-3 text-base text-red-900/90">
                Lost sales are just the beginning. Rush shipping adds €50-200 per emergency order. Customer churn is severe—30-40% switch to competitors after one stockout. One retailer calculated €12,000 in lost revenue over six months from stockouts on just 10 SKUs. Brand reputation damage can persist long after inventory is restored. Preventing stockouts through proper reorder points and safety stock costs a fraction of these losses.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {takeaways.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200"
              >
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Stockouts */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Types of Stockouts: Understanding the Variations</h2>
          <p className="text-lg text-gray-700 mb-8">
            Not all stockouts are created equal. Understanding the different types helps businesses develop targeted prevention strategies.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">Temporary Stockouts</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Short-term stockouts lasting hours to a few days. Often caused by unexpected demand spikes or minor supplier delays. While less severe, they still result in lost sales and customer frustration.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> A popular product sells out on Friday but is restocked by Monday. Customers who wanted it over the weekend go elsewhere.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-900">Extended Stockouts</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Long-term stockouts lasting weeks or months. Usually caused by supply chain disruptions, production issues, or poor inventory planning. These cause the most severe business impact.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> A component shortage prevents restocking for 6 weeks. Customers permanently switch to alternative products or competitors.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">Partial Stockouts</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Some locations or channels have stock while others don't. Common in multi-location businesses without proper inventory visibility. Customers may find the item elsewhere but experience frustration.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Online store shows out of stock, but physical store has inventory. Customers abandon online carts and may not visit the store.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-semibold text-gray-900">Phantom Stockouts</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Inventory appears available in the system but is actually missing due to theft, damage, or tracking errors. These are particularly damaging because they create false expectations.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> System shows 50 units in stock, but physical count reveals zero. Customers place orders that can't be fulfilled, causing immediate frustration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Root Causes Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Root Causes of Stockouts: Why They Happen</h2>
          <p className="text-lg text-gray-700 mb-8">
            Understanding the root causes of stockouts is essential for prevention. Most stockouts result from a combination of factors rather than a single issue.
          </p>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Inaccurate Demand Forecasting
              </h3>
              <p className="text-gray-700 mb-2">
                Underestimating future demand is the most common cause of stockouts. Businesses that rely on guesswork or outdated data consistently run out of popular items. This includes failing to account for seasonality, trends, promotions, or market changes.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> A retailer forecasting 100 units but actually needing 150 will experience stockouts. Without safety stock, even small forecasting errors cause problems.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Supplier Delays and Lead Time Issues
              </h3>
              <p className="text-gray-700 mb-2">
                Delayed deliveries from suppliers, especially when lead times aren't accurately tracked, cause stockouts. This includes production delays, shipping issues, customs problems, or supplier capacity constraints.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> If a supplier's typical 7-day lead time extends to 14 days without adjusting reorder points, stockouts occur during the extended wait period.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Inadequate Safety Stock
              </h3>
              <p className="text-gray-700 mb-2">
                Many businesses maintain insufficient safety stock buffers or eliminate them entirely to reduce carrying costs. This leaves no protection against demand variability or supply disruptions.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> A business with zero safety stock will stockout immediately if demand increases 20% or a supplier is one day late, even with perfect forecasting.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Poor Inventory Tracking and Accuracy
              </h3>
              <p className="text-gray-700 mb-2">
                Inaccurate inventory records showing stock that doesn't exist lead to stockouts. This includes manual counting errors, theft not recorded, damage not removed from system, or system synchronization issues.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> System shows 50 units available, but physical count reveals 10. Customers order expecting availability, but stockouts occur when orders exceed actual inventory.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Unexpected Demand Spikes
              </h3>
              <p className="text-gray-700 mb-2">
                Viral products, social media exposure, seasonal events, or competitor stockouts can cause sudden demand increases that exceed normal inventory levels. Without flexible inventory systems, these spikes cause stockouts.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> A product featured on social media experiences 500% demand increase. Normal inventory of 100 units sells out in hours, causing extended stockouts.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-amber-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Human Error in Ordering
              </h3>
              <p className="text-gray-700 mb-2">
                Manual ordering processes are prone to errors: forgetting to order, ordering wrong quantities, ordering wrong items, or missing reorder point alerts. These human mistakes directly cause stockouts.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Impact:</strong> A manager forgets to place a weekly order, or misreads reorder point and orders 10 units instead of 100. Stockouts occur before the error is discovered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The True Cost of Stockouts */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">The True Cost of Stockouts: Beyond Lost Sales</h2>
          <p className="text-lg text-gray-700 mb-8">
            Stockouts create a cascade of costs that extend far beyond immediate lost sales. Understanding the full financial impact helps justify investment in prevention strategies.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-900">Direct Revenue Loss</h3>
              </div>
              <p className="text-gray-700 mb-3">
                The most visible cost: lost sales from customers who can't purchase out-of-stock items. Studies show businesses lose 10-20% of potential revenue on affected items during stockout periods.
              </p>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-900">Example Calculation:</p>
                <p className="text-sm text-red-800 mt-1">
                  Product with €50 average sale, 20 units/week demand, 2-week stockout = €2,000 in lost revenue. For a business with 50 SKUs experiencing monthly stockouts, annual losses can exceed €50,000.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">Customer Churn and Lost Lifetime Value</h3>
              </div>
              <p className="text-gray-700 mb-3">
                30-40% of customers switch to competitors after experiencing a stockout. The lifetime value of lost customers far exceeds immediate sales loss. A customer worth €500/year who switches represents €2,500-€5,000 in lost value over 5-10 years.
              </p>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-900">Long-term Impact:</p>
                <p className="text-sm text-orange-800 mt-1">
                  Losing 10 customers/month to stockouts at €500/year lifetime value = €60,000 in lost customer value annually, far exceeding direct sales losses.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">Rush Shipping and Emergency Costs</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Expedited shipping to recover from stockouts costs €50-200 per emergency order. These costs eliminate profit margins and create operational stress. Multiple emergency orders compound the financial impact.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900">Cost Breakdown:</p>
                <p className="text-sm text-blue-800 mt-1">
                  Standard shipping: €10. Rush shipping: €150. Difference: €140 per order. 10 emergency orders/month = €1,400 in additional costs, €16,800 annually.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="h-6 w-6 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900">Brand Reputation Damage</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Stockouts create negative customer experiences that damage brand reputation. Social media complaints, negative reviews, and word-of-mouth can persist long after inventory is restored, affecting future sales.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-900">Reputation Impact:</p>
                <p className="text-sm text-purple-800 mt-1">
                  One negative review mentioning stockouts can influence 10-20 potential customers. For businesses relying on reputation, this intangible cost can exceed direct financial losses.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-red-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Total Cost Calculation Example</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">For a single product stockout:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Lost sales: €2,000</li>
                  <li>• Rush shipping: €150</li>
                  <li>• Customer churn (2 customers): €1,000</li>
                  <li>• Operational disruption: €200</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="font-bold text-red-900">Total Cost: €3,350</p>
                <p className="text-xs text-red-700 mt-1">Prevention cost (safety stock): €200-€400</p>
                <p className="text-xs text-red-600 mt-2">ROI: 8-16x return on prevention investment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention Strategies */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Stockout Prevention Strategies: A Comprehensive Approach</h2>
          <p className="text-lg text-gray-700 mb-8">
            Effective stockout prevention requires a multi-layered strategy combining technology, processes, and relationships. No single solution works for all businesses, but these proven strategies form the foundation of effective prevention.
          </p>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-semibold text-gray-900">1. Automated Reorder Points</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Reorder points automatically trigger purchase orders when inventory reaches predetermined levels. This eliminates human error and ensures timely reordering before stockouts occur.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">How to Calculate Reorder Point:</p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Example: If daily demand is 10 units, lead time is 7 days, and safety stock is 30 units: Reorder Point = (10 × 7) + 30 = 100 units. When inventory drops to 100, automatically reorder.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Best Practice:</strong> Review and adjust reorder points quarterly based on actual demand patterns. Seasonal products need different reorder points for different times of year.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-2xl font-semibold text-gray-900">2. Safety Stock Buffers</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Safety stock provides a buffer against demand variability and supply disruptions. It's the extra inventory maintained beyond expected demand to prevent stockouts.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">How to Calculate Safety Stock:</p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Safety Stock = (Maximum Daily Demand × Maximum Lead Time) - (Average Daily Demand × Average Lead Time)</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Example: Maximum daily demand = 20 units, maximum lead time = 10 days, average daily demand = 15 units, average lead time = 7 days. Safety Stock = (20 × 10) - (15 × 7) = 200 - 105 = 95 units.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Best Practice:</strong> Higher safety stock for high-value or critical items. Lower safety stock for low-value, easily replaceable items. Balance carrying costs against stockout risks.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-semibold text-gray-900">3. Accurate Demand Forecasting</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Better forecasting reduces stockouts by predicting demand more accurately. Use historical sales data, trend analysis, seasonality patterns, and market intelligence to forecast demand.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">Forecasting Methods:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Moving Average:</strong> Average of recent periods (simple but effective)</li>
                  <li>• <strong>Exponential Smoothing:</strong> Weighted average giving more weight to recent data</li>
                  <li>• <strong>Seasonal Adjustment:</strong> Account for seasonal patterns (holidays, weather, events)</li>
                  <li>• <strong>Trend Analysis:</strong> Identify growing or declining product demand</li>
                  <li>• <strong>Market Intelligence:</strong> Incorporate external factors (competitor actions, trends, promotions)</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Best Practice:</strong> Combine multiple forecasting methods. Review forecast accuracy monthly and adjust methods based on performance. Use software tools for complex calculations.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-amber-600" />
                <h3 className="text-2xl font-semibold text-gray-900">4. Real-Time Inventory Visibility</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Real-time inventory tracking provides accurate, up-to-the-minute stock levels across all locations. This eliminates phantom stockouts and enables faster response to low stock situations.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">Key Features:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Multi-location inventory tracking</li>
                  <li>• Automated stock level updates</li>
                  <li>• Low stock alerts and notifications</li>
                  <li>• Integration with sales channels (prevent overselling)</li>
                  <li>• Mobile access for on-the-go monitoring</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Best Practice:</strong> Conduct regular physical counts to verify system accuracy. Use barcode scanning to reduce counting errors. Set up automated alerts for low stock levels.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
                <h3 className="text-2xl font-semibold text-gray-900">5. Reliable Supplier Relationships</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Strong supplier relationships reduce stockout risk through consistent delivery, better communication, and priority treatment during shortages. Maintain backup suppliers for critical items.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">Supplier Management Best Practices:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Maintain 2-3 suppliers for critical items</li>
                  <li>• Track supplier performance (on-time delivery, quality)</li>
                  <li>• Communicate demand forecasts to suppliers</li>
                  <li>• Establish service level agreements (SLAs)</li>
                  <li>• Build relationships beyond transactional interactions</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Best Practice:</strong> Diversify suppliers geographically and by capability. Don't rely on a single supplier for critical inventory. Regular supplier reviews help identify risks early.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Considerations */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Industry-Specific Stockout Considerations</h2>
          <p className="text-lg text-gray-700 mb-8">
            Different industries face unique stockout challenges. Understanding industry-specific factors helps develop targeted prevention strategies.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Retail & Ecommerce</h3>
              <p className="text-gray-700 mb-3">
                Stockouts in retail cause immediate sales loss and high customer churn. Ecommerce stockouts result in cart abandonment rates of 20-30%. Fast-moving consumer goods require frequent restocking.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Key Challenge:</strong> Managing inventory across multiple channels (online, physical stores) and preventing overselling when stock is low.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Food Service & Restaurants</h3>
              <p className="text-gray-700 mb-3">
                Stockouts in restaurants mean menu items unavailable, directly impacting customer satisfaction and revenue. Perishable inventory requires careful management to balance stockouts with waste.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Key Challenge:</strong> Managing perishable inventory with short shelf lives while maintaining menu availability. Stockouts of key ingredients can shut down entire menu sections.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare & Medical</h3>
              <p className="text-gray-700 mb-3">
                Medical supply stockouts can impact patient care and safety. Critical items require higher safety stock levels. Regulatory requirements add complexity to inventory management.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Key Challenge:</strong> Balancing cost control with patient safety. Stockouts of critical supplies are unacceptable, requiring robust safety stock and backup suppliers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Manufacturing</h3>
              <p className="text-gray-700 mb-3">
                Component stockouts halt production lines, causing expensive downtime. Just-in-time manufacturing reduces inventory but increases stockout risk. Bill of materials complexity requires careful coordination.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Key Challenge:</strong> Coordinating multiple components and suppliers. A single component stockout can stop entire production, making safety stock critical for key components.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Playbook */}
      <section id="playbook" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Action Playbook: Implementing Stockout Prevention</h2>
              <p className="mt-3 text-base text-gray-600">
                Turn stockout prevention theory into actionable steps. These structured workstreams help align teams, implement tools, and track progress toward eliminating stockouts.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700">
              <Target className="h-4 w-4" />
              Proven Prevention Strategies
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {actionSteps.map((step, index) => (
              <div key={step.title} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">Step {index + 1}</span>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metrics" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Metrics that Matter</h2>
              <p className="mt-3 max-w-2xl text-base text-gray-600">
                Use these scorecards to prove the ROI of {topicTitle.toLowerCase()}. Set a baseline, monitor progress weekly, and
                communicate wins with clarity.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
              <BarChart3 className="h-4 w-4" />
              Track with Inventory Metrics
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{metric.label}</h3>
                <p className="mt-3 text-sm text-gray-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">Frequently Asked Questions About Stockouts</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <summary className="cursor-pointer font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6 text-center">Key Takeaways: Understanding Stockouts</h2>
          <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Stockouts represent one of the most significant challenges in inventory management, with costs extending far beyond immediate lost sales. Understanding what stockouts are, why they occur, and how to prevent them is essential for any business managing inventory.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Stockouts are preventable</p>
                  <p className="text-gray-700 text-sm">
                    Most stockouts result from poor inventory management practices rather than unavoidable external factors. Implementing proper reorder points, safety stock, and accurate forecasting can prevent the majority of stockouts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">The true cost exceeds lost sales</p>
                  <p className="text-gray-700 text-sm">
                    Stockout costs include lost revenue, customer churn, rush shipping, brand damage, and operational disruptions. The total cost often exceeds 10-20% of potential revenue on affected items, with long-term customer value losses compounding the impact.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Prevention requires a multi-layered approach</p>
                  <p className="text-gray-700 text-sm">
                    Effective stockout prevention combines automated reorder points, safety stock buffers, accurate demand forecasting, real-time inventory visibility, and reliable supplier relationships. No single solution works for all businesses or situations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Technology enables better prevention</p>
                  <p className="text-gray-700 text-sm">
                    Modern inventory management systems provide real-time visibility, automated alerts, demand forecasting, and integration capabilities that make stockout prevention more effective and less labor-intensive than manual methods.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                By understanding stockouts comprehensively—their types, causes, costs, and prevention strategies—businesses can develop effective inventory management practices that minimize stockout risk while balancing inventory carrying costs. The investment in prevention strategies typically provides 8-16x return compared to the costs of stockouts themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </SeoPageLayout>
  );
}
