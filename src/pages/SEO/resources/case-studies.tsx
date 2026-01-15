import CaseStudiesPage from '@/pages/case-studies';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

const faqData = [
  {
    question: "What results do businesses see with StockFlow?",
    answer: "Businesses using StockFlow typically see: 70% time savings on inventory tasks, 25% reduction in carrying costs, 90% reduction in errors, 99%+ inventory accuracy, elimination of stockouts, and 15-20% revenue growth from better availability. Most businesses see ROI within the first month."
  },
  {
    question: "What types of businesses use StockFlow?",
    answer: "StockFlow is used by businesses across industries including retail, e-commerce, manufacturing, wholesale, healthcare, hospitality, construction, and field services. From small businesses with 10 products to enterprises with 10,000+ SKUs, StockFlow scales to meet any business size."
  },
  {
    question: "How quickly do businesses see results with StockFlow?",
    answer: "Most businesses see immediate results within the first week. Time savings become apparent immediately as manual processes are automated. Cost savings and error reduction typically show measurable results within the first month. Full ROI is usually realized within 3-6 months."
  },
  {
    question: "What is the typical ROI of StockFlow?",
    answer: "The typical ROI is very high. For a business spending 10 hours/week on inventory management at €50/hour, StockFlow saves €2,000/month in time alone. Combined with 25% reduction in carrying costs and elimination of stockouts, most businesses see 300-500% ROI in the first year."
  },
  {
    question: "Can StockFlow handle multi-location businesses?",
    answer: "Yes, StockFlow excels at multi-location inventory management. Businesses with multiple warehouses, stores, or distribution centers use StockFlow to track inventory across all locations in real-time, transfer stock between locations, and maintain accurate counts everywhere."
  },
  {
    question: "How do businesses migrate to StockFlow?",
    answer: "StockFlow offers free data migration from Excel, other inventory systems, or manual processes. Our team imports your product data, stock levels, locations, and historical information. Most migrations are completed in 1-3 days with zero downtime."
  },
  {
    question: "What support do businesses receive with StockFlow?",
    answer: "StockFlow provides 24/7 support via chat, email, and phone. All customers receive onboarding assistance, training resources, and dedicated success managers. Premium plans include priority support and custom training sessions for your team."
  },
  {
    question: "Are there case studies for specific industries?",
    answer: "Yes, we have case studies covering retail, e-commerce, manufacturing, healthcare, hospitality, construction, and more. Each case study details the specific challenges, implementation process, and results achieved. Contact us to see case studies relevant to your industry."
  }
];

const successMetrics = [
  {
    icon: Clock,
    metric: "70%",
    label: "Time Savings",
    description: "Businesses save 10+ hours weekly on inventory management tasks"
  },
  {
    icon: DollarSign,
    metric: "25%",
    label: "Cost Reduction",
    description: "Average reduction in inventory carrying costs through optimization"
  },
  {
    icon: CheckCircle,
    metric: "99%+",
    label: "Accuracy Rate",
    description: "Inventory accuracy achieved with automated tracking and barcode scanning"
  },
  {
    icon: TrendingUp,
    metric: "15-20%",
    label: "Revenue Growth",
    description: "Average revenue increase from better stock availability and fewer stockouts"
  }
];

const caseStudyCategories = [
  {
    title: "Retail & E-commerce",
    description: "See how retailers and online stores use StockFlow to manage multi-channel inventory, prevent overselling, and improve fulfillment accuracy.",
    results: ["Eliminated overselling across channels", "Reduced stockouts by 90%", "Saved 15 hours/week on inventory tasks"]
  },
  {
    title: "Manufacturing & Wholesale",
    description: "Learn how manufacturers and wholesalers optimize inventory levels, manage BOMs, and streamline production workflows.",
    results: ["Reduced carrying costs by 30%", "Improved production planning", "Eliminated material shortages"]
  },
  {
    title: "Healthcare & Hospitality",
    description: "Discover how healthcare facilities and hospitality businesses track supplies, manage expiration dates, and ensure compliance.",
    results: ["Reduced waste by 25%", "Improved compliance tracking", "Streamlined supply management"]
  },
  {
    title: "Field Services & Construction",
    description: "See how field service teams and construction companies manage mobile inventory, track tools, and optimize van stock.",
    results: ["Improved field efficiency", "Reduced tool loss", "Better project planning"]
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Inventory Management Case Studies - StockFlow",
    "description": "See how businesses use StockFlow to improve inventory management. Real success stories from electronics, retail, food, and logistics companies. Learn about ROI, time savings, and results.",
    "url": "https://www.stockflowsystems.com/resources/case-studies",
    "mainEntity": {
      "@type": "ItemList",
      "name": "StockFlow Case Studies",
      "description": "Success stories from businesses using StockFlow"
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
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.stockflowsystems.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resources",
        "item": "https://www.stockflowsystems.com/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Case Studies",
        "item": "https://www.stockflowsystems.com/resources/case-studies"
      }
    ]
  }
];

export default function SEOCaseStudiesPage() {
  

  return (
    <SeoPageLayout 
      title="Inventory Management Case Studies"
      heroTitle="Inventory Management Case Studies"
      dateUpdated="06/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Case Studies 2026 - Success Stories | StockFlow"
        description="See how businesses use StockFlow to improve inventory management. Real success stories from electronics, retail, food, and logistics companies. Learn about ROI, time savings, and results."
        keywords="case studies, success stories, inventory management, business results, ROI, testimonials, inventory software case studies, inventory management success stories, stockflow case studies"
        url="https://www.stockflowsystems.com/resources/case-studies"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Real Results from <span className="text-blue-600">Real Businesses</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              See how businesses across industries use StockFlow to transform their inventory management, reduce costs, save time, and grow revenue. These case studies showcase real-world results from companies just like yours.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              From small retailers to large manufacturers, businesses using StockFlow consistently see significant improvements in efficiency, accuracy, and profitability. Read their stories to learn how StockFlow can help your business achieve similar results.
            </p>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Average Results Across All StockFlow Customers
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center shadow-sm">
                <metric.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{metric.metric}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{metric.label}</div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories by Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore case studies from businesses in your industry to see how StockFlow addresses specific challenges and delivers measurable results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudyCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.results.map((result, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Businesses Choose StockFlow
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <Zap className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Implementation</h3>
              <p className="text-gray-600">Most businesses are up and running in 5-7 days, not months. Our guided onboarding gets you productive quickly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface means minimal training. Your team will be productive from day one without extensive onboarding.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Consistent results across industries. Businesses see measurable improvements in efficiency, accuracy, and profitability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Hundreds of Successful Businesses
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your success story today. Try StockFlow free for up to 100 products and see results within your first week.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Join for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Component Wrapper */}
      <CaseStudiesPage />
    </SeoPageLayout>
  );
}

