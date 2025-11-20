import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  Eye,
  Activity,
  Camera,
  MapPin,
  Zap
} from 'lucide-react';

export default function InventoryTracker() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is an inventory tracker?",
      answer: "An inventory tracker is a tool or software that monitors and records the movement of inventory items in real-time. It helps businesses keep track of stock levels, locations, and movements to ensure accurate inventory management and prevent stockouts or overstock situations."
    },
    {
      question: "How does an inventory tracker work?",
      answer: "Inventory trackers work by recording every movement of inventory items, including receiving, storage, picking, and shipping. They use barcode scanning, RFID technology, or manual entry to track items and provide real-time visibility into stock levels and locations."
    },
    {
      question: "What are the benefits of using an inventory tracker?",
      answer: "Benefits include real-time visibility, reduced stockouts, improved accuracy, better demand forecasting, automated reorder points, cost savings, enhanced customer service, and detailed reporting for better decision-making."
    },
    {
      question: "Can inventory trackers work offline?",
      answer: "Yes, modern inventory trackers like StockFlow can work offline and sync data when internet connection is restored. This ensures continuous tracking even in areas with poor connectivity."
    },
    {
      question: "Is an inventory tracker suitable for small businesses?",
      answer: "Absolutely! Inventory trackers are especially beneficial for small businesses as they help automate manual processes, reduce errors, and provide insights that were previously only available to large enterprises. StockFlow offers affordable solutions for businesses of all sizes."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Best Inventory Tracker - Real-time Stock Management",
    url: "https://www.stockflow.be/inventory-tracker",
    description: "Track your inventory in real-time with the best inventory tracker. Barcode scanning, movement tracking, and automated alerts.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Inventory Tracker", url: "https://www.stockflow.be/inventory-tracker", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Best Inventory Tracker",
      description: "Track your inventory in real-time with the best inventory tracker. Barcode scanning, movement tracking, and automated alerts.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "150"
      },
      features: [
        "Real-time tracking",
        "Barcode scanning",
        "Movement history",
        "Analytics dashboard",
        "Location tracking",
        "Automated alerts"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/inventory-tracker"
    }
  });

  const features = [
    {
      icon: Eye,
      title: "Real-time Tracking",
      description: "Monitor inventory movements in real-time with instant updates and notifications."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Activity,
      title: "Movement History",
      description: "Track complete history of inventory movements with detailed timestamps and locations."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get insights into inventory patterns, turnover rates, and optimization opportunities."
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Track inventory across multiple locations and zones within your warehouse."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Receive instant notifications for low stock, reorder points, and unusual movements."
    }
  ];

  const benefits = [
    "Eliminate stockouts with real-time tracking",
    "Reduce inventory carrying costs by 25%",
    "Improve inventory accuracy to 99%+",
    "Save 10+ hours per week on manual tracking",
    "Prevent theft and loss with movement tracking",
    "Optimize reorder points automatically",
    "Enhance customer satisfaction",
    "Make data-driven inventory decisions"
  ];

  const trackingTypes = [
    {
      title: "Real-time Tracking",
      description: "Monitor inventory movements as they happen with instant updates.",
      icon: "⚡",
      features: ["Live updates", "Instant notifications", "Movement alerts"]
    },
    {
      title: "Barcode Tracking",
      description: "Use barcode scanning for accurate and fast inventory tracking.",
      icon: "ðŸ“±",
      features: ["Mobile scanning", "Batch operations", "Error reduction"]
    },
    {
      title: "Location Tracking",
      description: "Track inventory across multiple locations and storage zones.",
      icon: "ðŸ“",
      features: ["Multi-location", "Zone management", "Location history"]
    },
    {
      title: "Movement History",
      description: "Complete audit trail of all inventory movements and transactions.",
      icon: "ðŸ“Š",
      features: ["Full history", "Transaction logs", "Audit reports"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Thompson",
      role: "Inventory Manager, Retail Plus",
      content: "StockFlow's inventory tracker eliminated our stockout issues completely. We now have 99% inventory accuracy and our customers are much happier.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Operations Director, TechStore",
      content: "The real-time tracking feature is a game-changer. We can see exactly where every item is at any moment, which has improved our efficiency by 40%.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Warehouse Supervisor, Global Supply",
      content: "The movement history feature helped us identify and fix several inefficiencies in our warehouse operations. Highly recommended!",
      rating: 5
    }
  ];

  const trackingSteps = [
    {
      step: "1",
      title: "Scan Items",
      description: "Use barcode scanning to record inventory movements"
    },
    {
      step: "2",
      title: "Track Locations",
      description: "Monitor where items are stored and moved"
    },
    {
      step: "3",
      title: "Update Levels",
      description: "Automatically update stock levels in real-time"
    },
    {
      step: "4",
      title: "Generate Reports",
      description: "Create detailed reports on inventory movements and trends"
    }
  ];

  return (
    <SeoPageLayout 
      title="Inventory Tracker"
      heroTitle="Inventory Tracker"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Tracker 2025 - Inventory Tracker 2025"
        description="Learn how inventory tracker to automate your processes. Discover how inventory tracker to choose the best software. Track. Start free today. StockFlow helps ..."
        keywords="inventory tracker, stock tracker, inventory tracking, stock tracking, inventory monitoring, stock monitoring, inventory tracking software, stock tracking software, inventory tracking app, stock tracking app, real-time inventory tracking, inventory movement tracking, stock movement tracking, inventory tracking system, stock tracking system, inventory tracker app, stock tracker app, inventory tracking tool, stock tracking tool, inventory tracking solution, stock tracking solution"
        url="https://www.stockflow.be/inventory-tracker"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-tracker' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-app' }
        ]}
        structuredData={structuredData}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Never lose track of your inventory again. Monitor stock levels, track movements, and get instant alerts with the most powerful inventory tracker available.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          An inventory tracker is a tool or software that monitors and records the movement of inventory items in real-time. It helps businesses keep track of stock levels, locations, and movements to ensure accurate inventory management and prevent stockouts or overstock situations.
        </p>
      </div>

      {/* What is Inventory Tracker Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is an <span className="text-blue-600">Inventory Tracker</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                An inventory tracker is a powerful tool that monitors and records every movement of your inventory items in real-time. It provides complete visibility into your stock levels, locations, and movements to ensure accurate inventory management.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Modern inventory trackers use advanced technology like barcode scanning, RFID, and cloud-based systems to provide real-time updates and prevent stockouts or overstock situations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Real-time Visibility</h3>
                  <p className="text-sm text-blue-700">See exactly where your inventory is at any moment</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Prevent Losses</h3>
                  <p className="text-sm text-green-700">Track movements to prevent theft and loss</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Tracking Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Real-time inventory monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Barcode scanning capabilities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Movement history tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Location-based tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Automated alerts and notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful <span className="text-blue-600">Inventory Tracking</span> Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to track your inventory with precision and efficiency.
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
              Benefits of <span className="text-blue-600">Inventory Tracking</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your inventory management with real-time tracking capabilities.
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

      {/* Tracking Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Types of <span className="text-blue-600">Inventory Tracking</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the tracking method that best fits your business needs and operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trackingTypes.map((type, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How <span className="text-blue-600">Inventory Tracking</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to start tracking your inventory with maximum efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trackingSteps.map((step, index) => (
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Inventory Managers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how businesses have transformed their inventory tracking with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
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
            Start Tracking Your Inventory Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow to track their inventory with precision and efficiency.
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about inventory tracking</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
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
            The best inventory tracker for real-time monitoring. Simple, powerful, and designed for accuracy.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory tracking solutions for modern businesses.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}


