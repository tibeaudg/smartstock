import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  BarChart3,
  CheckCircle,
  Star,
  ShoppingCart,
  Store,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  IndustryBenchmarks,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics,
  getIndustryBenchmarks
} from '@/components/seo/EnhancedContent';

export default function RetailInventoryManagement() {
  // Use the page refresh hook
  usePageRefresh();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  // Get real customer data for retail industry
  const relevantCaseStudies = getRelevantCaseStudies('retail inventory', 'Retail');
  const relevantTestimonials = getRelevantTestimonials('retail');
  const metrics = getProprietaryMetrics('retail inventory');
  const benchmarks = getIndustryBenchmarks('Retail');

  const faqData = [
    {
      question: "Why do small retail shops need inventory management software?",
      answer: "Small retail shops face unique challenges like limited storage space, seasonal demand fluctuations, and tight profit margins. Inventory management software helps prevent stockouts during peak seasons, reduces overstock costs, and provides real-time insights to make better purchasing decisions."
    },
    {
      question: "How can retail inventory management help with seasonal demand?",
      answer: "Retail inventory management software tracks historical sales data to predict seasonal demand patterns. It helps you prepare for busy periods by optimizing stock levels, identifying trending products, and ensuring you have enough inventory without overstocking."
    },
    {
      question: "What features are most important for small retail shops?",
      answer: "Key features include barcode scanning for quick updates, real-time stock tracking, low stock alerts, sales reporting, supplier management, and mobile access. These features help small shops compete with larger retailers while maintaining efficiency."
    },
    {
      question: "Can retail inventory management integrate with my POS system?",
      answer: "Yes, modern inventory management systems like StockFlow can integrate with most POS systems to automatically update stock levels when sales occur. This ensures your inventory is always accurate and reduces manual counting."
    },
    {
      question: "How much can small retail shops save with inventory management?",
      answer: "Small retail shops typically save 15-30% on inventory costs by reducing overstock, preventing stockouts, and optimizing purchasing. This translates to thousands of dollars in savings annually, making the ROI very attractive for small businesses."
    }
  ];

  // Generate structured data
  const structuredData = generateSeoPageStructuredData({
    title: "Retail Inventory Management Software for Small Shops",
    description: "Complete retail inventory management solution for small shops. Track stock, prevent stockouts, and boost profits with real-time inventory control.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Retail Inventory Management",
      description: "Complete retail inventory management solution for small shops. Track stock, prevent stockouts, and boost profits with real-time inventory control.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Real-time stock tracking",
        "Barcode scanning",
        "Low stock alerts",
        "Sales analytics",
        "Supplier management",
        "Mobile access"
      ],
      image: "https://www.stockflowsystems.com/Inventory-Management.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: ShoppingCart,
      title: "Real-time Stock Tracking",
      description: "Monitor your inventory levels in real-time as customers make purchases. Never run out of popular items again."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan barcodes with your smartphone to quickly update stock levels and check product information on the go."
    },
    {
      icon: AlertTriangle,
      title: "Low Stock Alerts",
      description: "Get instant notifications when inventory levels drop below your set thresholds. Stay ahead of stockouts."
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Track your best-selling products, seasonal trends, and profit margins to make smarter purchasing decisions."
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Keep track of your suppliers, order history, and delivery schedules to streamline your purchasing process."
    },
    {
      icon: Store,
      title: "Multi-location Support",
      description: "Manage inventory across multiple store locations or departments from a single dashboard."
    }
  ];

  const benefits = [
    "Reduce inventory costs by 25%",
    "Prevent stockouts during peak seasons",
    "Eliminate manual counting errors",
    "Improve cash flow management",
    "Increase customer satisfaction",
    "Save  on inventory tasks",
    "Make data-driven purchasing decisions",
    "Scale your business efficiently"
  ];

  const retailChallenges = [
    {
      title: "Seasonal Demand Spikes",
      description: "Retail shops face unpredictable demand during holidays and seasons. Our system tracks patterns to help you prepare.",
      icon: "ðŸ“ˆ",
      solution: "Historical data analysis and demand forecasting"
    },
    {
      title: "Limited Storage Space",
      description: "Small shops have limited space for inventory. Optimize your stock levels with intelligent reorder points.",
      icon: "ðŸ“¦",
      solution: "Space-efficient inventory optimization"
    },
    {
      title: "Cash Flow Management",
      description: "Tight profit margins require careful inventory investment. Track ROI and optimize purchasing decisions.",
      icon: "ðŸ’°",
      solution: "Financial tracking and cost optimization"
    },
    {
      title: "Competition with Big Retailers",
      description: "Compete with larger stores by having the right products in stock when customers need them.",
      icon: "ðŸª",
      solution: "Real-time visibility and quick restocking"
    }
  ];

  const testimonials = [
    {
      name: "Emma Johnson",
      role: "Owner, Boutique Fashion Store",
      content: "StockFlow transformed our seasonal inventory management. We no longer run out of popular items during peak shopping periods, and our profits increased by 35%.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Manager, Electronics Shop",
      content: "The barcode scanning feature saves us hours every week. We can now focus on customer service instead of manual inventory counting.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Owner, Gift Shop",
      content: "The sales analytics helped us identify our best-selling products and optimize our purchasing. We've reduced overstock by 40%.",
      rating: 5
    }
  ];

  const useCases = [
    {
      title: "Multi-Store Inventory Sync",
      description: "Sync inventory across multiple retail locations in real-time. See what's in stock at each store and transfer items between locations as needed.",
      icon: Store,
      metrics: "Manage inventory across unlimited store locations"
    },
    {
      title: "Seasonal Demand Management",
      description: "Track historical sales data to predict seasonal demand patterns. Prepare for busy periods by optimizing stock levels and identifying trending products.",
      icon: TrendingUp,
      metrics: " in stockouts during peak seasons"
    },
    {
      title: "POS Integration",
      description: "Integrate with POS systems to automatically update stock levels when sales occur. Ensure inventory is always accurate across all sales channels.",
      icon: ShoppingCart,
      metrics: "Real-time inventory sync with POS systems"
    },
    {
      title: "Supplier Management",
      description: "Track suppliers, order history, and delivery schedules. Streamline purchasing and ensure timely restocking of popular items.",
      icon: Users,
      metrics: "25% improvement in supplier relationships"
    },
    {
      title: "E-commerce Integration",
      description: "Sync inventory with online stores and marketplaces. Prevent overselling and ensure accurate stock availability across all sales channels.",
      icon: Package,
      metrics: " in overselling incidents"
    },
    {
      title: "Inventory Audits",
      description: "Perform regular inventory audits with mobile barcode scanning. Maintain accuracy year-round and identify discrepancies quickly.",
      icon: Smartphone,
      metrics: "10+ hours saved per week on inventory counts"
    }
  ];

  const metricsData = [
    {
      value: "35%",
      label: "Reduction in Stockouts",
      description: "Prevent lost sales during peak seasons"
    },
    {
      value: "25%",
      label: "Cost Savings",
      description: "Reduce inventory carrying costs"
    },
    {
      value: "10+",
      label: "Hours Saved Per Week",
      description: "Eliminate manual inventory tracking"
    },
    {
      value: "95%",
      label: "Reduction in Overselling",
      description: "Real-time sync prevents overselling"
    },
    {
      value: "40%",
      label: "Reduction in Overstock",
      description: "Optimize purchasing decisions"
    },
    {
      value: "99%",
      label: "Inventory Accuracy",
      description: "Real-time tracking ensures accuracy"
    }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Set Up Your Products",
      description: "Add your products with barcodes and set optimal stock levels"
    },
    {
      step: "2",
      title: "Configure Alerts",
      description: "Set low stock alerts and reorder points for each product"
    },
    {
      step: "3",
      title: "Train Your Staff",
      description: "Train your team on barcode scanning and daily procedures"
    },
    {
      step: "4",
      title: "Monitor & Optimize",
      description: "Use analytics to continuously improve your inventory management"
    }
  ];

  return (
    <SeoPageLayout 
      title="Retail Inventory Management"
      heroTitle="Retail Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Retail Inventory Management Software | StockFlow"
        description="Retail inventory software for small shops. Real-time tracking, barcode scanning, prevent stockouts. Reduce costs 25%, save 10+ hours/week. StockFlow is completely free forever - all features included."
        keywords="retail inventory management, small retail shop software, retail stock management, shop inventory system, retail inventory tracking, small business inventory, retail POS integration, inventory management for retailers, retail stock control, shop management software, retail inventory software, small shop inventory, retail inventory solution, shop stock tracking, retail inventory app"
        url="https://www.stockflowsystems.com/retail-inventory-management"
        structuredData={structuredData}
      />

      {/* Industry Benchmarks */}
      <IndustryBenchmarks 
        industry="Retail"
        benchmarks={benchmarks}
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "6 hours/week",
          averageCostSaved: benchmarks.averageSavings,
          keyMetric: benchmarks.typicalResult,
          feature: "Retail Inventory Management"
        }}
      />

      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={3}
        />
      )}

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Stop losing sales to stockouts. Manage your retail inventory like a pro with real-time tracking, smart alerts, and powerful analytics designed for small shops.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Retail inventory management</strong> is the process of tracking and controlling stock levels in retail stores to ensure products are available when customers need them, while minimizing carrying costs and preventing overstock situations. For small retail shops, effective inventory management is crucial for competing with larger retailers and maintaining profitability.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Small retail businesses face unique challenges: limited storage space, seasonal demand fluctuations, tight profit margins, and competition with larger stores. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Retail inventory management software</Link> helps small shops overcome these challenges by providing real-time visibility, automated alerts, and data-driven insights. Learn more about <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> for on-the-go access or explore <Link to="/solutions/stock-management-software" className="text-blue-600 hover:underline font-semibold">stock management software</Link> solutions.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Retail Shops</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact retail inventory management has on shop operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metricsData.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Retail Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How retail shops use StockFlow to manage inventory and boost profits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <useCase.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">{useCase.metrics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow in <span className="text-blue-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Manage retail inventory with real-time tracking, POS integration, and multi-store sync.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/dashboard.png" 
              alt="StockFlow Retail Inventory Management Dashboard - Real-time tracking, POS integration, and multi-store sync"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow retail dashboard screenshot showing:
                - Multi-store inventory view
                - POS integration interface
                - Real-time stock tracking
                - Seasonal demand analytics
                - Supplier management dashboard
                - Mobile scanning for retail inventory */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow retail inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Retail Challenges Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Common <span className="text-blue-600">Retail Challenges</span> We Solve
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Small retail shops face unique inventory challenges. Here's how we help you overcome them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {retailChallenges.map((challenge, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{challenge.title}</h3>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">Our Solution:</p>
                  <p className="text-sm text-blue-700">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need for <span className="text-blue-600">Retail Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for small retail shops and independent stores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your <span className="text-blue-600">Retail Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of retail shops that have improved their operations with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in <span className="text-blue-600">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Set up your retail inventory management system in minutes, not weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {implementationSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Retail Shop Owners</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how retail shops have transformed their inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            ROI of Retail Inventory Management
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cost Savings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Inventory cost reduction</span>
                  <span className="text-2xl font-bold text-green-600">25%</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Overstock reduction</span>
                  <span className="text-2xl font-bold text-blue-600">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Stockout prevention</span>
                  <span className="text-2xl font-bold text-purple-600">95%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Time Savings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Hours saved per week</span>
                  <span className="text-2xl font-bold text-green-600">10+</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-gray-700">Faster inventory counts</span>
                  <span className="text-2xl font-bold text-blue-600">5x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Error reduction</span>
                  <span className="text-2xl font-bold text-purple-600">90%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-blue-600 text-white rounded-lg p-6 text-center">
            <p className="text-xl font-semibold mb-2">Most retail shops see ROI within the first month</p>
            <p className="text-lg opacity-90">Through cost savings, time savings, and improved customer satisfaction</p>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Best Practices for Retail Inventory Management
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Set Accurate Reorder Points</h3>
              <p className="text-gray-700">
                Calculate reorder points based on lead time, average daily sales, and safety stock. This ensures you reorder before running out while avoiding overstock. <Link to="/glossary/what-is-lead-time" className="text-blue-600 hover:underline font-semibold">Learn more about lead time</Link> and how it affects reorder points.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Use ABC Analysis</h3>
              <p className="text-gray-700">
                Focus your attention on high-value items (A-items) that drive most of your revenue. These items need tighter control and more frequent monitoring than low-value items.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Regular Cycle Counting</h3>
              <p className="text-gray-700">
                Instead of annual physical counts, perform regular cycle counts of high-value items. This maintains accuracy year-round and identifies discrepancies quickly.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Track Seasonal Trends</h3>
              <p className="text-gray-700">
                Monitor historical sales data to identify seasonal patterns. Adjust stock levels before peak seasons to ensure you have adequate inventory when demand spikes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Retail Inventory?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of retail shops using StockFlow to manage their inventory more efficiently and profitably. StockFlow is completely free forever with unlimited products and all features included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Get Started Free →
            </Link>
            <Link
              to="/solutions/inventory-management-software"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completely free forever
            </div>
          </div>
        </div>
      </section>





    </SeoPageLayout>
  );
}


