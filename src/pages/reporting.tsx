import { SEO } from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Download, 
  Filter,
  Calendar,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  LineChart,
  Activity,
  DollarSign,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Reporting() {
  usePageRefresh();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Reporting & Analytics - StockFlow",
    "description": "Generate powerful, data-driven insights instantly with StockFlow's comprehensive reporting and analytics features.",
    "url": "https://www.stockflow.be/reporting",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow Reporting",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      }
    }
  };

  const reportTypes = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Sales Performance Reports",
      description: "Track sales trends, revenue growth, and product performance over time.",
      features: [
        "Revenue by product category",
        "Sales velocity analysis",
        "Top-selling products",
        "Seasonal trend identification"
      ]
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Inventory Analysis",
      description: "Comprehensive insights into your stock levels, turnover, and movement patterns.",
      features: [
        "Stock level reports",
        "Turnover rate analysis",
        "ABC analysis",
        "Stock movement history"
      ]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Financial Reports",
      description: "Monitor profitability, margins, and financial health of your inventory.",
      features: [
        "Profit margin analysis",
        "Cost of goods sold",
        "Inventory valuation",
        "ROI calculations"
      ]
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Operational Reports",
      description: "Track operational efficiency and identify areas for improvement.",
      features: [
        "Order fulfillment rates",
        "Stockout frequency",
        "Reorder point analysis",
        "Supplier performance"
      ]
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Trend Analysis",
      description: "Identify patterns and forecast future inventory needs.",
      features: [
        "Demand forecasting",
        "Seasonal patterns",
        "Growth trends",
        "Predictive analytics"
      ]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Custom Reports",
      description: "Create tailored reports that match your specific business needs.",
      features: [
        "Flexible date ranges",
        "Multi-location filtering",
        "Custom metrics",
        "Export capabilities"
      ]
    }
  ];

  const keyFeatures = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-Time Data",
      description: "All reports are generated from live data, ensuring you always have the most current insights."
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Export Options",
      description: "Export reports in multiple formats including PDF, Excel, and CSV for further analysis."
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: "Advanced Filtering",
      description: "Filter reports by date range, location, product category, and more to get exactly what you need."
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Scheduled Reports",
      description: "Automatically generate and email reports on a schedule that works for you."
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Visual Dashboards",
      description: "Beautiful charts and graphs make it easy to understand your data at a glance."
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Data Accuracy",
      description: "Built-in validation ensures your reports are accurate and reliable."
    }
  ];

  return (
    <SeoPageLayout title="Reporting & Analytics">
      <SEO
        title="Reporting & Analytics - Generate Powerful Data-Driven Insights | StockFlow"
        description="Generate powerful, data-driven insights instantly with StockFlow's comprehensive reporting and analytics. Track sales, inventory, and financial performance with real-time reports."
        keywords="inventory reporting, stock reporting, analytics software, business intelligence, inventory analytics, sales reports, inventory reports, data-driven insights, business reporting, inventory management reports, stock analysis, financial reports, operational reports, custom reports, export reports"
        url="https://www.stockflow.be/reporting"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Reporting & <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate powerful, data-driven insights instantly. Make informed decisions with comprehensive reporting and analytics tools designed for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/demo">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Reporting Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand your inventory performance and make data-driven decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Report Types
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From sales performance to inventory analysis, get the insights you need to grow your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reportTypes.map((report, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {report.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {report.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {report.description}
                </p>
                <ul className="space-y-2">
                  {report.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Make Better Decisions with Data
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                StockFlow's reporting and analytics tools give you the insights you need to optimize your inventory, reduce costs, and increase profitability. With real-time data and comprehensive reports, you can:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Identify Trends</h3>
                    <p className="text-gray-600">Spot patterns in sales and inventory movement to anticipate demand.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reduce Waste</h3>
                    <p className="text-gray-600">Identify slow-moving inventory and dead stock before it becomes a problem.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Optimize Stock Levels</h3>
                    <p className="text-gray-600">Maintain optimal inventory levels to reduce carrying costs while avoiding stockouts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Improve Profitability</h3>
                    <p className="text-gray-600">Track margins and identify opportunities to increase revenue.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Sales Performance</h3>
                  <span className="text-sm text-green-600 font-medium">+23%</span>
                </div>
                <div className="h-32 bg-gray-100 rounded flex items-end justify-around p-2">
                  <div className="w-8 bg-blue-600 rounded-t" style={{ height: '60%' }}></div>
                  <div className="w-8 bg-blue-600 rounded-t" style={{ height: '80%' }}></div>
                  <div className="w-8 bg-blue-600 rounded-t" style={{ height: '100%' }}></div>
                  <div className="w-8 bg-blue-600 rounded-t" style={{ height: '75%' }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Product A</span>
                    <span className="text-sm font-semibold text-gray-900">€12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Product B</span>
                    <span className="text-sm font-semibold text-gray-900">€9,230</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Product C</span>
                    <span className="text-sm font-semibold text-gray-900">€7,890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Generating Powerful Insights Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using StockFlow's reporting and analytics to make better inventory decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/demo">
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}




