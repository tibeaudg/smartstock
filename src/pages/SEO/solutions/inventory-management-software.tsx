import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import { RelatedArticles } from '@/components/seo/RelatedArticles';
import { TopicClusterNav } from '@/components/seo/TopicClusterNav';
import { englishMainCluster, getRelatedPages } from '@/config/topicClusters';

import { StructuredData } from '@/components/StructuredData';
export default function InventoryManagementSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  // Get related pages from topic cluster
  const relatedPages = getRelatedPages('/inventory-management-software', 6);
  
  const faqData = [
    {
      question: "What is inventory management software?",
      answer: "Inventory management software is a digital solution that helps businesses track, manage, and optimize their stock levels, orders, and warehouse operations. It provides real-time visibility into inventory levels, automates reordering processes, and helps prevent stockouts or overstock situations."
    },
    {
      question: "What features should inventory management software have?",
      answer: "The best inventory management software includes real-time tracking, barcode scanning, automated reorder points, multi-location support, reporting and analytics, integration capabilities, mobile access, and user role management. These features ensure efficient inventory control and business growth."
    },
    {
      question: "How much does inventory management software cost?",
      answer: `Inventory management software pricing varies, but StockFlow offers a free plan for small businesses with up to 30 products. Premium plans start at ${formatPrice(29)}/month for advanced features. Most solutions offer free trials to test the software before committing.`
    },
    {
      question: "Can inventory management software integrate with other systems?",
      answer: "Yes, modern inventory management software like StockFlow integrates with accounting systems, e-commerce platforms, POS systems, and ERP software. This ensures seamless data flow across your entire business ecosystem."
    },
    {
      question: "Is inventory management software suitable for small businesses?",
      answer: "Absolutely! Inventory management software is especially beneficial for small businesses as it helps automate processes, reduce errors, and provides insights that were previously only available to large enterprises. StockFlow is specifically designed for SMEs and growing businesses."
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Optimize Your Cashflow",
      description: "Prevent excess inventory and dead stock. Get precise insight into what you need, when you need it.",
    },
    {
      icon: Zap,
      title: "Save Time and Reduce Errors",
      description: "Automate orders and minimize manual counts. Focus on growth, not administration.",
    },
    {
      icon: Users,
      title: "Seamless Team Collaboration",
      description: "Work efficiently with your team thanks to clear user roles and real-time data updates.",
    },
    {
      icon: Shield,
      title: "Safe and Always Available",
      description: "Your data is safe in the cloud. Always and everywhere accessible, with daily backups.",
    },
  ];
  
  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const benefits = [
    "No hidden costs or commitments",
    "Start immediately, no installation required",
    "User-friendly mobile interface",
    "Real-time synchronization between devices",
    "Automatic low stock notifications",
    "Barcode scanning functionality",
    "Professional reporting and analytics",
    "24/7 access from anywhere"
  ];

  const useCases = [
    {
      title: "E-commerce",
      description: "Perfect for online stores managing multiple product lines and seasonal inventory fluctuations.",
      icon: "ðŸ›’"
    },
    {
      title: "Retail",
      description: "Ideal for physical stores needing real-time inventory tracking and point-of-sale integration.",
      icon: "ðŸª"
    },
    {
      title: "Wholesale",
      description: "Great for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "ðŸ“¦"
    },
    {
      title: "Manufacturing",
      description: "Essential for manufacturers tracking raw materials, work-in-progress, and finished goods.",
      icon: "ðŸ­"
    }
  ];

  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager, TechStore",
      content: "StockFlow transformed our inventory management. We went from manual tracking to 95% automation in just 2 weeks.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Owner, Fashion Forward",
      content: "The barcode scanning feature alone saved us 3 hours per day. Our inventory accuracy improved from 85% to 99%.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Warehouse Manager, AutoParts Plus",
      content: "Real-time visibility into our inventory levels helped us reduce stockouts by 80% and improve customer satisfaction.",
      rating: 5
    }
  ];

  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const steps = [
    {
      step: "1",
      title: "Connect Your Data",
      description: "Import your existing inventory data or start fresh. Our inventory management software works with any business size."
    },
    {
      step: "2", 
      title: "Set Up Automation",
      description: "Configure automatic reorder points and notifications. Let the software handle routine inventory decisions."
    },
    {
      step: "3",
      title: "Train Your Team",
      description: "Get your team up and running quickly with our intuitive interface and comprehensive training resources."
    },
    {
      step: "4",
      title: "Optimize & Scale",
      description: "Use analytics to optimize your inventory levels and scale your operations as your business grows."
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management Software">
      <SEO
        title="Inventory Management Software 2025: Best Cloud Solution | Free Trial"
        description="Discover the best inventory management software for your business. Real-time tracking, automated alerts, barcode scanning. Start FREE - no credit card. Join 500+ businesses. âœ“"
        keywords="inventory management software, inventory software management, software for inventory management, softwares for inventory management, inventory management software best, stock management software, inventory tracking, stock control, warehouse management, inventory system, inventory management software best, inventory management online, inventory tracking programs, inventory software, inventory management system, stockflow, stock flow"
        url="https://www.stockflow.be/inventory-management-software"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-software' }
        ]}
      />

      {/* Hero Section - Improved Above the Fold */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-blue-500 to-blue-900"
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 500+ businesses
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              StockFlow Inventory Management<br />
              <span className="text-blue-300">for growing businesses</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                The only inventory management software that makes <strong>100% automatic decisions</strong> for small businesses. Stop manual tracking, prevent stockouts, and grow your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-center"
                >
                  Start Your Free Trial
                </Link>
         
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-blue-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Setup in 5 minutes
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual Demo */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6">
                {/* Demo Interface Mockup */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Live Inventory Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="text-green-600 font-bold text-lg">1,247</div>
                      <div className="text-green-600 text-sm">Products in Stock</div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <div className="text-orange-600 font-bold text-lg">23</div>
                      <div className="text-orange-600 text-sm">Low Stock Alert</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">ðŸ“± Smartphone Case</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Reorder</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">ðŸ’» Laptop Charger</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">In Stock</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">ðŸŽ§ Wireless Headphones</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Out of Stock</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Badge */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                  âœ“ Auto-Reorder Active
                </div>
              </div>
              
              {/* Background Decorative Elements */}
              <div className="absolute -z-10 top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -z-10 bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Trusted by Growing Businesses Across Industries
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of small businesses that have transformed their inventory management and saved thousands of euros
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <p className="text-gray-600">Active Businesses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatPrice(2300000)}</div>
              <p className="text-gray-600">Cost Savings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <p className="text-gray-600">Time Saved</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>

          {/* Real Customer Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"We started with 80% product availability. That has now risen to 95%. Our revenue increased by 30% in just 6 months."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marco Janssen</p>
                  <p className="text-sm text-gray-600">Owner, TechStore Belgium</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"Our two purchasers went from a full workday to just 15 minutes per day. StockFlow handles everything automatically."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  LR
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
                  <p className="text-sm text-gray-600">Operations Manager, Fashion Forward</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"The barcode scanning feature alone saved us 3 hours per day. Our inventory accuracy improved from 85% to 99%."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">Warehouse Manager, AutoParts Plus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">Trusted and Secure</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="font-medium">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Finally, a way to make 100% automatic inventory decisions
            </h2>
            <p className="text-lg text-gray-600">
              StockFlow uses all your data to always order the right products at the right time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without StockFlow */}
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-red-800 mb-6">Without StockFlow</h3>
              <p className="text-red-700 mb-6">Too much or too little inventory due to time-consuming, manual purchasing</p>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  Manual purchasing based on gut feeling
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  Reactive purchasing when you're often already too late
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  Time spent on what, when, where and how much to purchase
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  Not knowing if inventory is balanced
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  High inventory but still stockouts
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">âœ—</span>
                  No clear insight into purchasing needs and moments
                </li>
              </ul>
            </div>

            {/* With StockFlow */}
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-6">With StockFlow</h3>
              <p className="text-green-700 mb-6">Purchase the right inventory based on all available data and trends</p>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  Automatic data-driven purchasing
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  Proactive purchasing based on trends and seasons
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  Optimize purchasing decisions and data
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  Optimal inventory for more revenue and cashflow control
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  More revenue with less inventory
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">âœ“</span>
                  Optimize daily purchasing decisions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results with StockFlow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of businesses that have transformed their inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Inventory Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">80%</div>
              <p className="text-gray-600">Time Saved</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">25%</div>
              <p className="text-gray-600">Cost Reduction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section with Visual Demo */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How StockFlow Solves Your Biggest Inventory Problems
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stop losing money on stockouts and overstock. See how our inventory management software transforms your business in real-time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Demo</h3>
                  <p className="text-gray-600">See StockFlow in action</p>
                </div>
                
                {/* Mobile App Mockup */}
                <div className="bg-gray-900 rounded-2xl p-4 mx-auto max-w-xs">
                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">StockFlow</h4>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">iPhone Case</div>
                          <div className="text-sm text-gray-600">Stock: 45 units</div>
                        </div>
                        <div className="text-green-600 font-bold">âœ“</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">Laptop Charger</div>
                          <div className="text-sm text-gray-600">Stock: 3 units</div>
                        </div>
                        <div className="text-orange-600 font-bold">âš ï¸</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">Wireless Mouse</div>
                          <div className="text-sm text-gray-600">Stock: 0 units</div>
                        </div>
                        <div className="text-red-600 font-bold">ðŸš¨</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Auto-Reorder Alert</div>
                      <div className="text-xs text-blue-600">Order 50 Wireless Mice now</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                Live Updates
              </div>
            </div>
          </div>

          {/* Feature Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reduce Stockouts by 95%</h3>
              <p className="text-gray-600">Never lose a sale due to out-of-stock products. Our smart algorithms predict demand and reorder automatically.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save 10+ Hours Weekly</h3>
              <p className="text-gray-600">Automate inventory tracking, reordering, and reporting. Focus on growing your business instead of managing spreadsheets.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Increase Profit Margins</h3>
              <p className="text-gray-600">Optimize inventory levels to reduce carrying costs while maximizing sales opportunities. Turn inventory into profit.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Smarter inventory management
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-blue-600">
              for e-commerce, warehouses and physical stores
            </h3>
            <p className="text-lg text-gray-600">
              Discover how e-commerce inventory teams use StockFlow for strategic, automatic purchasing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Security & Trust Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your data is protected with bank-level security and industry-standard compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">SSL Encryption</h3>
              <p className="text-gray-600 text-sm">256-bit SSL encryption for all data transmission</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Full compliance with European data protection laws</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Daily Backups</h3>
              <p className="text-gray-600 text-sm">Automated daily backups with 99.9% uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Demo Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Camera className="w-4 h-4 mr-2" />
                Interactive Demo Available
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                See StockFlow in Action
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Watch our 2-minute demo and discover how StockFlow can transform your inventory management. See real features, real results, and real savings.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Live inventory tracking demonstration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Barcode scanning in real-time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Automatic reorder point setup</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Mobile app walkthrough</span>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section - Screenshot Style */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            Get Started Free
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-yellow-400">
            No credit card required
          </h3>
          
          {/* Sub-headline */}
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Get Started Free and see how StockFlow can help your business.
          </p>
          
          {/* Key Benefits Above CTA */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-lg">Start within 2 minutes.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-lg">100% safe and free.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="text-lg">Professional support.</span>
            </div>
          </div>
          
          {/* Primary CTA Button */}
          <div className="mb-12">
            <Link
              to="/auth"
              className="inline-flex items-center px-16 py-6 bg-blue-600 hover:bg-blue-700 border-2 border-white text-white rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Zap className="w-6 h-6 mr-3" />
              Get Started Free
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
          
          {/* Trust Signals Below CTA */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-lg">No credit card required.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-lg">Instant access.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-lg">GDPR-compliant.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-lg">100% secure.</span>
            </div>
          </div>
          
          {/* Highlighted Value Proposition */}
          <div className="bg-yellow-400 bg-opacity-10 border-l-4 border-yellow-400 rounded-lg p-8 mb-16 max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
              Get started today and save hours every week with our inventory management system
            </p>
            <p className="text-lg text-white opacity-90">
              Get started today and save hours every week with our inventory management system
            </p>
          </div>
          
          {/* Social Proof Statistics */}
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-lg text-yellow-400">Active SMEs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-lg text-yellow-400">Hours Time saved/week</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-lg text-yellow-400">Customer satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about inventory management software</p>
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

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Related Articles</h2>
          <p className="text-center text-gray-600 mb-8">Explore more about inventory management</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± Dutch Version</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse gids voor professionele voorraadbeheer software.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/magazijnbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± Dutch Version</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Magazijnbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Warehouse management voor Nederlandse en Belgische markt.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± Dutch Version</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Automation Guide
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete gids voor het automatiseren van je voorraad.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± For SMEs</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory for Small Businesses
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Affordable inventory solutions voor KMO's.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± E-commerce</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  E-commerce Inventory Management
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Voorraadbeheer speciaal voor webshops en e-commerce.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ‡³ðŸ‡± Comparison</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Excel vs Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Why switch from Excel to professional software.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className="text-sm text-blue-600 font-semibold mb-2">ðŸ  Homepage</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  StockFlow Homepage
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Discover StockFlow - free inventory management software for growing businesses.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Visit homepage â†’</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <RelatedArticles 
        articles={relatedPages}
        title="Explore More About Inventory Management"
        language="en"
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Professional inventory management software for growing businesses.
            Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory management software for modern businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
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
        {"@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StockFlow - Inventory Management Software",
                "description": "Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "browserRequirements": "Requires JavaScript. Requires HTML5.",
                "softwareVersion": "1.0",
                "datePublished": "2024-01-01",
                "dateModified": "new Date().toISOString().split('T')[0]",
                "offers": [
                  {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR",
                    "description": "Free plan - 100% free inventory management for SMEs",
                    "availability": "https://schema.org/InStock",
                    "validFrom": "2024-01-01"
                  },
                  {
                    "@type": "Offer",
                    "price": "29",
                    "priceCurrency": "EUR",
                    "description": "Growth plan - Advanced features for growing businesses",
                    "availability": "https://schema.org/InStock",
                    "validFrom": "2024-01-01"
                  }
                ],
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "150",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "author": {
                  "@type": "Organization",
                  "name": "StockFlow"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "StockFlow",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.stockflow.be/logo.png"
                  }
                },
                "image": [
                  "https://www.stockflow.be/Inventory-Management.png",
                  "https://www.stockflow.be/optimized/desktop.png"
                ],
                "screenshot": "https://www.stockflow.be/optimized/desktop.png",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/inventory-management-software"
                },
                "featureList": [
                  "Real-time inventory tracking",
                  "Barcode scanning",
                  "Automated reorder points",
                  "Multi-location support",
                  "Advanced analytics",
                  "Mobile access",
                  "Team collaboration",
                  "Integration capabilities"
                  ],
                  "keywords": "inventory management software, stock management, inventory control, warehouse management, inventory tracking, stock management software, inventory system, warehouse software, inventory optimization, stock control software, inventory management system, warehouse management system, inventory tracking software, stock management system, inventory software, warehouse tracking, inventory control system, stock tracking software, inventory management solution, warehouse inventory software, inventory management platform, inventory tracking programs, softwares for inventory management, inventory and stock management software, manage inventory, inventory planning software"
        },
        {
          "@context": "https://schema.org",
                "@type": "Organization",
                "name": "StockFlow",
                "url": "https://www.stockflow.be",
                "logo": "https://www.stockflow.be/logo.png",
                "description": "Professional inventory management software for growing businesses",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "BE"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "info@stockflow.be"
                },
                "sameAs": [
                  "https://www.linkedin.com/company/stockflow"
                ]        },        {"@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Inventory Management Software - StockFlow",
                "description": "Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform.",
                "url": "https://www.stockflow.be/inventory-management-software",
                "mainEntity": {
                  "@type": "SoftwareApplication",
                  "name": "StockFlow - Inventory Management Software"
                },
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://www.stockflow.be"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Inventory Management Software",
                      "item": "https://www.stockflow.be/inventory-management-software"
                    }
                    ]
                  }
        }
      ]} />
      </SeoPageLayout>
  );
}


