import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  Calendar,
  TrendingUp,
  Snowflake,
  Sun,
  Leaf,
  DollarSign,
  Users,
  Package,
  AlertTriangle
} from 'lucide-react';

export default function RetailSeasonalInventory() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is seasonal inventory management and why is it important for retail?",
      answer: "Seasonal inventory management involves planning and managing stock levels based on seasonal demand patterns. It's crucial for retail businesses because demand for products varies significantly throughout the year. Effective seasonal management helps you stock up before peak seasons, avoid overstock during slow periods, and maximize profits during high-demand periods."
    },
    {
      question: "How can I predict seasonal demand for my retail business?",
      answer: "StockFlow's seasonal inventory management uses historical sales data, market trends, and predictive analytics to forecast seasonal demand. The system analyzes your past sales patterns, identifies seasonal trends, and provides recommendations for optimal stock levels throughout the year."
    },
    {
      question: "What are the main seasonal periods that retail businesses need to plan for?",
      answer: "Key seasonal periods include: Holiday season (November-December), Back-to-school (August-September), Summer season (June-August), Spring cleaning (March-May), Valentine's Day, Mother's Day, Father's Day, and Black Friday/Cyber Monday. Each season requires different inventory strategies and planning."
    },
    {
      question: "How can seasonal inventory management help reduce costs?",
      answer: "Effective seasonal management prevents overstocking during slow periods (reducing carrying costs) and ensures adequate stock during peak seasons (preventing lost sales). It also helps optimize purchasing timing, negotiate better supplier terms, and improve cash flow management throughout the year."
    },
    {
      question: "Can seasonal inventory management help with clearance and markdowns?",
      answer: "Yes! The system tracks seasonal product lifecycles and alerts you when items are approaching their seasonal end. This helps you plan clearance sales, markdowns, and promotional strategies to move seasonal inventory before it becomes obsolete."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Seasonal Inventory Management for Retail - Plan for Peak Seasons",
    url: "https://www.stockflow.be/retail-seasonal-inventory",
    description: "Master seasonal inventory management for retail. Plan for peak seasons, avoid overstock, and maximize profits with seasonal demand forecasting.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Seasonal Inventory Management", url: "https://www.stockflow.be/retail-seasonal-inventory", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Seasonal Inventory Management",
      description: "Master seasonal inventory management for retail. Plan for peak seasons, avoid overstock, and maximize profits with seasonal demand forecasting.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.9",
        count: "160"
      },
      features: [
        "Seasonal forecasting",
        "Demand planning",
        "Peak season preparation",
        "Clearance management",
        "Historical analysis",
        "Automated alerts"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/retail-seasonal-inventory"
    }
  });

  const features = [
    {
      icon: Calendar,
      title: "Seasonal Forecasting",
      description: "Predict seasonal demand patterns using historical data and market trends. Plan your inventory months in advance for optimal results."
    },
    {
      icon: TrendingUp,
      title: "Peak Season Preparation",
      description: "Get alerts and recommendations for upcoming peak seasons. Ensure you have adequate stock before demand spikes."
    },
    {
      icon: BarChart3,
      title: "Historical Analysis",
      description: "Analyze past seasonal performance to identify trends, best-selling products, and optimal stock levels for each season."
    },
    {
      icon: AlertTriangle,
      title: "Seasonal Alerts",
      description: "Receive notifications for seasonal transitions, clearance deadlines, and optimal ordering times for each product category."
    },
    {
      icon: Package,
      title: "Clearance Management",
      description: "Track seasonal product lifecycles and plan clearance sales to move inventory before it becomes obsolete."
    },
    {
      icon: DollarSign,
      title: "Profit Optimization",
      description: "Maximize profits during peak seasons while minimizing losses from overstock during slow periods."
    }
  ];

  const benefits = [
    "Increase seasonal profits by 40%",
    "Reduce overstock costs by 35%",
    "Never miss peak season opportunities",
    "Optimize clearance and markdown timing",
    "Improve cash flow management",
    "Make data-driven seasonal decisions",
    "Plan inventory months in advance",
    "Compete effectively with larger retailers"
  ];

  const seasonalPeriods = [
    {
      season: "Holiday Season",
      months: "Nov - Dec",
      icon: "🎄",
      description: "Highest sales period for most retail businesses",
      strategy: "Stock up early, plan for gift items and decorations"
    },
    {
      season: "Back-to-School",
      months: "Aug - Sep",
      icon: "📚",
      description: "Peak demand for school supplies and clothing",
      strategy: "Focus on educational products and youth fashion"
    },
    {
      season: "Summer Season",
      months: "Jun - Aug",
      icon: "☀️",
      description: "High demand for outdoor and summer products",
      strategy: "Stock seasonal items, plan for vacation sales"
    },
    {
      season: "Spring Cleaning",
      months: "Mar - May",
      icon: "🌸",
      description: "Increased demand for home improvement products",
      strategy: "Focus on cleaning supplies and home organization"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Walsh",
      role: "Owner, Seasonal Gift Shop",
      content: "StockFlow's seasonal forecasting helped us prepare perfectly for the holiday season. We increased our holiday profits by 45% and avoided the overstock issues we had in previous years.",
      rating: 5
    },
    {
      name: "Michael Torres",
      role: "Manager, Fashion Retail Store",
      content: "The seasonal alerts are invaluable. We now know exactly when to order summer clothing and when to start clearance sales. It's transformed our seasonal planning.",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Owner, Home Decor Store",
      content: "Historical analysis helped us identify which seasonal products perform best. We've optimized our inventory mix and reduced seasonal overstock by 40%.",
      rating: 5
    }
  ];

  const seasonalSteps = [
    {
      step: "1",
      title: "Analyze History",
      description: "Review past seasonal sales data to identify patterns and trends"
    },
    {
      step: "2",
      title: "Plan Ahead",
      description: "Use forecasting to plan inventory levels for upcoming seasons"
    },
    {
      step: "3",
      title: "Prepare Stock",
      description: "Order seasonal inventory well in advance of peak demand"
    },
    {
      step: "4",
      title: "Monitor & Adjust",
      description: "Track sales and adjust inventory levels throughout the season"
    }
  ];

  return (
    <SeoPageLayout title="Seasonal Inventory Management">
      <SEO
        title="Seasonal Inventory Management for Retail - Plan for Peak Seasons 2024 | StockFlow"
        description="Master seasonal inventory management for retail. Plan for peak seasons, avoid overstock, maximize profits. Free trial available!"
        keywords="seasonal inventory management, retail seasonal planning, seasonal demand forecasting, peak season inventory, seasonal stock management, retail seasonal trends, holiday inventory planning, seasonal inventory software, retail seasonal strategy, seasonal inventory optimization, peak season preparation, seasonal clearance management, retail seasonal analytics, seasonal inventory planning, retail seasonal forecasting"
        url="https://www.stockflow.be/retail-seasonal-inventory"
        structuredData={structuredData}
      />

      {/* Hero Section with Background */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Master <span className="text-blue-400">Seasonal Inventory</span> Management
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Plan for peak seasons, avoid overstock, and maximize profits with intelligent seasonal inventory management. Never miss a seasonal opportunity again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
     
            </div>
            <p className="text-sm text-gray-200">Trusted by 300+ retail businesses for seasonal planning</p>
          </div>
        </div>
      </section>

      {/* Seasonal Periods Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key <span className="text-blue-600">Seasonal Periods</span> to Plan For
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding seasonal patterns is crucial for successful retail inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seasonalPeriods.map((period, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{period.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{period.season}</h3>
                <p className="text-blue-600 font-semibold mb-3">{period.months}</p>
                <p className="text-gray-600 mb-4">{period.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">Strategy:</p>
                  <p className="text-sm text-blue-700">{period.strategy}</p>
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
              Powerful <span className="text-blue-600">Seasonal Management</span> Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to master seasonal inventory management and maximize seasonal profits.
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
              Why <span className="text-blue-600">Seasonal Management</span> Matters
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your seasonal operations and maximize profits throughout the year.
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
              Master Seasonal Planning in <span className="text-blue-600">4 Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our proven process for successful seasonal inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seasonalSteps.map((step, index) => (
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
              Success Stories from <span className="text-blue-600">Seasonal Retailers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how retail businesses have mastered seasonal inventory management with StockFlow.
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

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Seasonal Inventory?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of retail businesses using StockFlow for intelligent seasonal inventory management and maximum seasonal profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Trial
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
              Free trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about seasonal inventory management</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Seasonal inventory management for retail success. Plan for peak seasons and maximize profits year-round.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Seasonal inventory management solutions for retail businesses.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
