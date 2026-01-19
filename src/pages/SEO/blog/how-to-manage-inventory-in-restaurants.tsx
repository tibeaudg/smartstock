import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";
import { 
  CheckCircle, Target, BarChart3, Lightbulb, Calendar, TrendingDown, 
  Shield, Calculator, Clock, Package, FileSpreadsheet, Smartphone, 
  RefreshCw, AlertTriangle, DollarSign, Users, ChefHat
} from "lucide-react";

const topicTitle = "How To Manage Inventory In Restaurants: Complete 2026 Guide";
const canonicalPath = "/how-to-manage-inventory-in-restaurants";
const metaDescription = "Complete 2026 guide to restaurant inventory management. Learn food inventory tracking, FIFO implementation, waste reduction (saves 4-10% revenue), COGS control, and best restaurant inventory software solutions.";
const keywords = "restaurant inventory management, restaurant inventory, food inventory management, restaurant stock management, FIFO restaurant, restaurant waste reduction, food cost control, restaurant inventory software, restaurant COGS";
const heroBadge = "2026 Industry Guide • Updated January 2026";
const summaryCopy = "Restaurant inventory management is the systematic tracking and control of food, beverages, and supplies from procurement to consumption. Effective management reduces food costs by 20-30%, minimizes waste (which typically costs 4-10% of revenue), prevents stockouts, and maximizes profitability through data-driven purchasing and FIFO (First In, First Out) rotation. This comprehensive guide covers everything from basic Excel tracking to advanced restaurant inventory software implementation.";

const takeaways = [
  "Restaurant inventory management reduces food costs by 20-30% through systematic tracking, FIFO implementation, and waste reduction.",
  "Food waste costs restaurants 4-10% of revenue annually - proper inventory management can cut this by 50% or more.",
  "Implementing FIFO (First In, First Out) rotation prevents expired food usage, ensures compliance, and reduces waste by 25-40%.",
  "Daily tracking of perishable items and setting par levels based on historical data prevents both overstocking and stockouts.",
  "Restaurant-specific inventory software with expiration tracking reduces counting time by 70% and improves accuracy to 98%+.",
  "Regular inventory analysis (weekly counts for perishables, monthly for non-perishables) is essential for accurate COGS calculation."
];

const actionSteps = [
  {
    "title": "Establish Daily & Weekly Counting Routines",
    "description": "Implement structured counting schedules: daily for high-value perishables (meat, seafood, produce), weekly for all food items, and monthly for dry goods and supplies. Consistent tracking prevents shrinkage and provides accurate COGS data.",
    "icon": Calendar,
    "details": ["Count perishables daily at opening or closing", "Full inventory count weekly", "Document counts in standardized format"]
  },
  {
    "title": "Implement Comprehensive FIFO Systems",
    "description": "Organize all storage areas (walk-ins, freezers, dry storage) using First In, First Out methodology. Label all items with receiving dates and expiration dates. Train staff to rotate stock during every restocking.",
    "icon": RefreshCw,
    "details": ["Color-coded labeling system by date", "Clear shelf organization with oldest in front", "Staff training on rotation procedures"]
  },
  {
    "title": "Set Data-Driven Par Levels",
    "description": "Establish minimum and maximum stock levels for every item based on historical usage, seasonality, and menu changes. Update par levels quarterly to reflect changing business patterns.",
    "icon": TrendingDown,
    "details": ["Calculate usage rates from 3-6 months of data", "Adjust for weekends, holidays, and events", "Build 10-15% buffer for unexpected demand"]
  },
  {
    "title": "Implement Restaurant Inventory Software",
    "description": "Move from spreadsheets to specialized restaurant inventory software that integrates with your POS system. Look for features like expiration tracking, waste analysis, recipe costing, and mobile accessibility.",
    "icon": Smartphone,
    "details": ["Choose software with POS integration", "Ensure mobile accessibility for kitchen staff", "Select systems with waste tracking features"]
  }
];

const metrics = [
  {
    "label": "Food Cost Percentage (COGS)",
    "detail": "The most critical restaurant metric. Calculate as (Beginning Inventory + Purchases - Ending Inventory) ÷ Food Sales. Industry standard is 28-35%; aim to reduce by 3-5% through better inventory management.",
    "icon": Calculator,
    "target": "28-35% of food sales"
  },
  {
    "label": "Inventory Turnover Rate",
    "detail": "How quickly you use and replace inventory. Calculate as Cost of Goods Sold ÷ Average Inventory Value. Ideal range: 4-6 times monthly for perishables. Higher turnover indicates efficient purchasing and minimal waste.",
    "icon": BarChart3,
    "target": "4-6 turns monthly"
  },
  {
    "label": "Theoretical vs. Actual Food Cost",
    "detail": "Compare what your food should cost (theoretical, based on recipes) with actual costs (from inventory counts). The variance (typically 1-3%) reveals shrinkage, waste, or portion control issues.",
    "icon": AlertTriangle,
    "target": "< 2% variance"
  },
  {
    "label": "Waste as Percentage of Sales",
    "detail": "Track both spoilage waste (expired items) and preparation waste (trimming, errors). Industry average is 4-10% of food sales. Effective inventory management should reduce this to 2-4%.",
    "icon": DollarSign,
    "target": "< 4% of food sales"
  }
];

const faqData = [
  {
    "question": "What is restaurant inventory management?",
    "answer": "Restaurant inventory management is the systematic process of tracking, controlling, and optimizing all food, beverage, and supply items from procurement through storage to usage. It involves regular counting, FIFO rotation, waste tracking, and data analysis to minimize food costs (typically 28-35% of sales), reduce waste (which averages 4-10% of revenue), prevent stockouts, and maximize profitability through informed purchasing decisions based on actual consumption patterns."
  },
  {
    "question": "How do restaurants conduct inventory counts?",
    "answer": "Restaurants should follow a tiered counting approach: 1) Daily counts of high-value perishables (meat, seafood) using quick sheets or mobile apps; 2) Weekly full inventory counts covering all food items, ideally on slow days before deliveries; 3) Monthly comprehensive counts including dry goods and supplies. Best practices include using standardized count sheets, counting in consistent order, having two staff members verify counts, and immediately investigating significant variances. Counting time typically reduces by 60-70% when switching from manual methods to mobile inventory apps."
  },
  {
    "question": "How often should restaurants do inventory?",
    "answer": "Frequency depends on item type: 1) High-cost perishables (meat, seafood, specialty produce) should be counted DAILY; 2) Regular perishables (dairy, vegetables) counted 2-3 times WEEKLY; 3) All food items counted WEEKLY for accurate COGS calculation; 4) Dry goods, beverages, and supplies counted MONTHLY. Most restaurants benefit from a full inventory count weekly - research shows restaurants doing weekly counts have 22% lower food costs than those counting monthly or less frequently."
  },
  {
    "question": "What's the best restaurant inventory management software?",
    "answer": "The best software depends on restaurant size: 1) For small restaurants (<$500K revenue): Free options like Excel templates or basic apps work for starters; 2) For growing restaurants ($500K-$2M revenue): Mid-tier systems like MarketMan or Upserve offer good value with POS integration; 3) For larger/multi-location restaurants: Enterprise systems like Oracle NetSuite Restaurant Edition or Crunchtime. Key features to prioritize: POS integration, mobile accessibility, expiration tracking, waste analysis, recipe costing, and vendor management. Most systems offer free trials - test at least two options during your slow season."
  },
  {
    "question": "Can I use Excel for restaurant inventory management?",
    "answer": "Yes, Excel can work for very small restaurants with under 100 SKUs. Create templates with columns for: Item Name, Category, Unit, Par Level, Current Count, Usage Rate, and Order Quantity. However, spreadsheets have significant limitations: no real-time updates, prone to human error (12-15% error rate), no automatic expiration alerts, and difficult to analyze trends. Most restaurants outgrow Excel within 6-12 months. Free downloadable restaurant inventory templates are available, but consider upgrading to dedicated software when food costs exceed $5,000 monthly."
  },
  {
    "question": "How does FIFO work in restaurant inventory?",
    "answer": "FIFO (First In, First Out) ensures oldest inventory is used first. Implementation requires: 1) Labeling every item with receive/expiration dates; 2) Organizing storage so oldest items are in front/easiest to reach; 3) Training all kitchen staff on rotation procedures during restocking; 4) Regular audits to ensure compliance. Proper FIFO reduces waste by 25-40%, prevents expired food service (critical for health compliance), and ensures consistent food quality. Some restaurants implement a color-coded labeling system (different colors for different weeks) for visual management."
  },
  {
    "question": "How can restaurants reduce food waste through inventory management?",
    "answer": "Reduce waste by: 1) Tracking all waste (separate spoilage vs. preparation waste); 2) Analyzing waste patterns weekly to identify problem items; 3) Adjusting par levels based on actual usage (not guesswork); 4) Implementing strict FIFO rotation; 5) Training kitchen staff on proper storage and portion control; 6) Creating specials to use items nearing expiration. Restaurants that systematically track waste reduce it by 50% on average, saving 2-5% of total revenue. Inventory software with waste tracking features typically pays for itself within 3-6 months through waste reduction alone."
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How To Manage Inventory In Restaurants: Complete 2026 Guide",
    "description": "Comprehensive guide to restaurant inventory management covering FIFO implementation, waste reduction strategies, COGS control, inventory counting procedures, and software selection.",
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
    "datePublished": "2025-09-08",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/how-to-manage-inventory-in-restaurants"
    }
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

export default function SeoHowToManageInventoryInRestaurantsPage() {
  
  const location = useLocation();

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={"Restaurant Inventory Management: The 2026 Playbook to Reduce Food Costs by 20-30%"}
      dateUpdated="January 15, 2026"
      faqData={faqData}
      keyTakeaways={takeaways}
    >
      <SEO
        title={topicTitle}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        structuredData={structuredData}
      />

      <StructuredData data={structuredData} />

      {/* Hero Section with Problem/Solution Framework */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                <ChefHat className="w-4 h-4" /> 2026 Restaurant Operations Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                Tired of <span className="text-blue-600">Food Waste Eating Your Profits?</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                The average restaurant loses <strong>4-10% of revenue</strong> to food waste and poor inventory control. But top-performing restaurants using systematic inventory management reduce food costs by <strong>20-30%</strong> while virtually eliminating stockouts.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                This isn't about counting cans—it's about transforming your restaurant's profitability through <strong>FIFO implementation, data-driven par levels, waste tracking, and modern inventory software.</strong> Whether you're using Excel or ready for dedicated software, this guide provides actionable steps validated by hundreds of restaurants.
              </p>
         
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="text-green-400" /> The Financial Impact
              </h3>
              <div className="space-y-6">
                {[
                  { metric: "Average Food Waste", value: "4-10%", detail: "of restaurant revenue lost annually" },
                  { metric: "Potential Reduction", value: "20-30%", detail: "food cost savings with proper management" },
                  { metric: "Inventory Accuracy", value: "60% → 98%+", detail: "improvement with software vs spreadsheets" },
                  { metric: "Counting Time Saved", value: "70%", detail: "reduction with mobile inventory apps" },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-gray-700 pl-6 relative">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-300 font-medium">{item.metric}</span>
                      <span className="text-2xl font-bold text-white">{item.value}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The "Shelf-to-Sheet" Gold Standard</h2>
            <p className="text-lg text-gray-600 mb-6">
              Most errors in restaurant inventory happen because staff look at a list and try to find the item (Sheet-to-Shelf). For 98%+ accuracy, use the <strong>Shelf-to-Sheet method</strong>.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Shelf-to-Sheet</p>
                  <p className="text-sm text-gray-600">Count what you see on the shelf first, then record it. This ensures "ghost inventory" (items in stock but not on the list) is actually captured.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 border border-red-100 opacity-80">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Avoid: Sheet-to-Shelf</p>
                  <p className="text-xs text-gray-600">Searching for items based on a list leads to "pencil whipping" (guessing numbers) when an item isn't immediately found.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Pro Counting Tips</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700 italic">"Count in pairs: One person calls out the weight/count, the other records it in the app. This cuts time by 50%."</li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="font-bold text-blue-600">01.</span> Standardize units (e.g., always count flour by the 50lb bag, not individual scoops).
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="font-bold text-blue-600">02.</span> Map your storage. Your inventory app should follow the exact physical path of your walk-in.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>










      {/* What is Restaurant Inventory Management? */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is Restaurant Inventory Management?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Understanding the complete ecosystem from receiving to plate</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <Package className="w-12 h-12 text-blue-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">Tracking & Counting</h4>
              <p className="text-gray-600">
                Regular physical counts of all food, beverage, and supply items. Includes daily counts of high-value perishables, weekly full inventory, and monthly comprehensive counts. Accuracy is critical for calculating true <strong>Cost of Goods Sold (COGS)</strong>.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <RefreshCw className="w-12 h-12 text-blue-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">Rotation & Storage</h4>
              <p className="text-gray-600">
                Implementing <strong>FIFO (First In, First Out)</strong> systems to ensure oldest items are used first. Proper storage organization, labeling with dates, and temperature control to maximize shelf life and prevent spoilage.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <Calculator className="w-12 h-12 text-blue-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">Analysis & Optimization</h4>
              <p className="text-gray-600">
                Using inventory data to set <strong>par levels</strong>, identify waste patterns, optimize purchasing, and calculate key metrics like food cost percentage and inventory turnover. Turning data into actionable business decisions.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Shield className="text-blue-600" /> Why It Matters More Than Ever in 2026
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Financial Impact</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Food typically represents 28-35% of restaurant revenue</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Waste reduction directly improves profit margins</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Accurate COGS calculation enables better pricing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Operational Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Prevents stockouts during peak service</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Reduces time spent searching for items</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Ensures compliance with health regulations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Playbook */}
      <section id="steps" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">4-Step Implementation Playbook</h2>
              <p className="mt-3 text-gray-600">
                Follow these steps sequentially. Most restaurants try to implement software before establishing counting routines—this leads to failure.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-bold text-green-700 border border-green-100">
              <Target className="h-4 w-4" />
              Proven Framework
            </div>
          </div>
          
          <div className="space-y-8">
            {actionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="group flex flex-col md:flex-row gap-8 p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                    {step.details && (
                      <ul className="space-y-2 mb-4">
                        {step.details.map((detail, dIndex) => (
                          <li key={dIndex} className="text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <section className="py-16 bg-blue-900 text-white overflow-hidden relative">
  <div className="max-w-6xl mx-auto px-4 relative z-10">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Connecting Inventory to the Plate</h2>
      <p className="text-blue-200">Inventory management is useless if your recipes aren't costed correctly.</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
        <ChefHat className="w-10 h-10 text-blue-300 mb-6" />
        <h3 className="text-xl font-bold mb-4">Dynamic Recipe Costing</h3>
        <p className="text-blue-100 mb-6">As your supplier prices fluctuate (the "Actual" cost), your recipe costs must update automatically. If your steak price rises by 15%, your software should alert you that your margin on the Filet Mignon has dropped below your target.</p>
        <div className="bg-blue-800/50 p-4 rounded-lg text-sm">
          <strong>2026 Trend:</strong> AI-driven price fetching from digital invoices now allows for real-time menu profitability tracking.
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
        <Target className="w-10 h-10 text-green-300 mb-6" />
        <h3 className="text-xl font-bold mb-4">The Menu Engineering Matrix</h3>
        <p className="text-blue-100 mb-4">Classify your menu based on inventory usage and profitability:</p>
        <ul className="space-y-3 text-sm">
          <li><span className="text-green-400 font-bold">Stars:</span> High Profit / High Popularity (Highlight these)</li>
          <li><span className="text-yellow-400 font-bold">Plowhorses:</span> Low Profit / High Popularity (Raise price or lower portion)</li>
          <li><span className="text-orange-400 font-bold">Puzzles:</span> High Profit / Low Popularity (Promote these)</li>
          <li><span className="text-red-400 font-bold">Dogs:</span> Low Profit / Low Popularity (Remove from menu)</li>
        </ul>
      </div>
    </div>
  </div>
</section>



<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Top 3 Reasons Inventory Systems Fail</h2>
    <div className="space-y-6">
      {[
        {
          title: "The 'Everything' Trap",
          desc: "Trying to track every salt packet and garnish. Focus on the 'Vital Few' (Top 20% of items that represent 80% of your spend).",
          fix: "Use ABC Analysis: Track 'A' items (Proteins/Alcohol) daily, 'B' items weekly, and 'C' items monthly."
        },
        {
          title: "Ignoring Transfers",
          desc: "When the bar takes lemons from the kitchen, or Location A sends meat to Location B, your data dies without a transfer log.",
          fix: "Implement a digital 'Internal Transfer' button on your mobile inventory app."
        },
        {
          title: "Measuring Without Action",
          desc: "Counting every Sunday but never looking at the variance report until the end of the quarter.",
          fix: "Mandate a Monday morning 'Variance Meeting' to discuss the top 5 missing items from the previous week."
        }
      ].map((pitfall, i) => (
        <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-gray-200">0{i+1}</div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">{pitfall.title}</h4>
            <p className="text-gray-600 mb-3">{pitfall.desc}</p>
            <p className="text-sm font-semibold text-blue-600 flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> The Fix: {pitfall.fix}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Software Comparison Section */}
      <section id="software" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choosing Your Technology: From Excel to Enterprise</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Select the right tool based on your restaurant's size, complexity, and growth stage</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm mb-12">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-6 font-bold text-gray-900">Solution</th>
                  <th className="text-left p-6 font-bold text-gray-900">Best For</th>
                  <th className="text-left p-6 font-bold text-gray-900">Cost Range</th>
                  <th className="text-left p-6 font-bold text-gray-900">Pros & Cons</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><FileSpreadsheet className="text-gray-600" /> <strong>Excel/Google Sheets</strong></div>
                  </td>
                  <td className="p-6 align-top"><p>Startups, under 100 SKUs, testing processes</p></td>
                  <td className="p-6 align-top"><p>$0 - $20/month</p></td>
                  <td className="p-6 align-top">
                    <p><span className="text-green-600">✓</span> Completely customizable<br/>
                    <span className="text-green-600">✓</span> No learning curve for basics<br/>
                    <span className="text-red-600">✗</span> No real-time updates<br/>
                    <span className="text-red-600">✗</span> High error rate (12-15%)</p>
                  </td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><Smartphone className="text-blue-600" /> <strong>Mobile Inventory Apps</strong></div>
                  </td>
                  <td className="p-6 align-top"><p><strong>Most small-medium restaurants</strong><br/>100-500 SKUs, single location</p></td>
                  <td className="p-6 align-top"><p>$50 - $300/month</p></td>
                  <td className="p-6 align-top">
                    <p><span className="text-green-600">✓</span> Real-time counting on phones<br/>
                    <span className="text-green-600">✓</span> Expiration alerts<br/>
                    <span className="text-green-600">✓</span> Basic reporting<br/>
                    <span className="text-red-600">✗</span> Limited POS integration</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3"><Calculator className="text-gray-600" /> <strong>Restaurant-Specific Software</strong></div>
                  </td>
                  <td className="p-6 align-top"><p>Growing restaurants, multi-location, high volume</p></td>
                  <td className="p-6 align-top"><p>$200 - $800+/month</p></td>
                  <td className="p-6 align-top">
                    <p><span className="text-green-600">✓</span> Full POS integration<br/>
                    <span className="text-green-600">✓</span> Recipe costing<br/>
                    <span className="text-green-600">✓</span> Advanced analytics<br/>
                    <span className="text-red-600">✗</span> Higher cost<br/>
                    <span className="text-red-600">✗</span> Implementation time</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Software Features to Prioritize</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Must-Have Features</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Mobile counting capabilities</li>
                  <li>Expiration date tracking with alerts</li>
                  <li>Basic waste/spoilage tracking</li>
                  <li>Simple reporting (usage, costs)</li>
                  <li>Vendor/order management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Advanced Features</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>POS system integration</li>
                  <li>Recipe costing and menu engineering</li>
                  <li>Theoretical vs actual cost analysis</li>
                  <li>Automated par level suggestions</li>
                  <li>Multi-location management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Track These 4 Key Metrics</h2>
              <p className="mt-3 text-gray-600">
                What gets measured gets managed. These metrics reveal your inventory health and profitability.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700">
              <BarChart3 className="h-4 w-4" />
              Build dashboards in StockFlow
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-8 hover:border-blue-300 transition-colors group">
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{metric.target}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{metric.label}</h3>
                  <p className="text-gray-600">{metric.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900">Physical Organization: The Foundation</h2>
        <p className="text-gray-600 mt-2">Digital tracking only works if your physical shelves are organized for speed and visibility.</p>
      </div>
      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
        <Package className="w-4 h-4" /> Optimize for 2026 Efficiency
      </div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Clear Labeling", text: "Every bin must have a label with the item name, unit, and a QR code for quick scanning." },
        { label: "The 6-Inch Rule", text: "Health safety: Keep all items at least 6 inches off the floor to prevent contamination and ease cleaning." },
        { label: "Date-First Facing", text: "Rotate products so the 'Received' or 'Exp' date is always facing forward for the checker." },
        { label: "Declutter 'Dead Stock'", text: "Unused items take up mental space. If you haven't used it in 60 days, sell it or toss it." }
      ].map((tip, i) => (
        <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
          <h4 className="font-bold text-gray-900 mb-3">{tip.label}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>





    </SeoPageLayout>
  );
}