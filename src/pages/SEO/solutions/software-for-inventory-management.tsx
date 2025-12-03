import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  BarChart3, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Cloud,
  Wrench
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function SoftwareForInventoryManagement() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What software is used for inventory management?",
      answer: "Software for inventory management includes specialized tools like StockFlow, which provide real-time tracking, automated reordering, barcode scanning, reporting, and integration capabilities. These tools help businesses maintain optimal stock levels and streamline operations."
    },
    {
      question: "What are the best software options for inventory management?",
      answer: "The best software for inventory management depends on your business needs. StockFlow is ideal for small to medium businesses, offering comprehensive features, easy setup, and affordable pricing. Other options include enterprise solutions for larger organizations."
    },
    {
      question: "How do I choose software for inventory management?",
      answer: "Consider factors like your business size, inventory complexity, budget, required features, integration needs, and ease of use. Look for software with real-time tracking, mobile access, reporting capabilities, and good customer support. StockFlow offers a free trial to test features."
    },
    {
      question: "Is there free software for inventory management?",
      answer: "Yes, StockFlow offers a free plan for small businesses with up to 30 products. This allows you to test the software and see if it meets your needs before upgrading to a paid plan with advanced features."
    },
    {
      question: "What features should software for inventory management have?",
      answer: "Essential features include real-time tracking, barcode scanning, automated alerts, reporting and analytics, mobile access, multi-user support, integration capabilities, and scalability. StockFlow includes all these features and more."
    },
    {
      question: "How much does software for inventory management cost?",
      answer: "Costs vary widely. StockFlow offers a free plan for up to 30 products, perfect for small businesses. Premium plans start at €29/month for unlimited products and advanced features. Enterprise solutions can cost hundreds or thousands per month. Most businesses find cloud-based solutions like StockFlow offer the best value."
    },
    {
      question: "Is software for inventory management difficult to learn?",
      answer: "Modern software for inventory management like StockFlow is designed to be intuitive and easy to learn. The interface is user-friendly, setup is straightforward, and no technical knowledge is required. Most users can start managing inventory within hours of signing up. Training and support are available if needed."
    },
    {
      question: "Can software for inventory management work offline?",
      answer: "Many modern software solutions for inventory management offer offline capabilities through mobile apps. You can scan barcodes, update inventory, and make changes offline. Data is stored locally and automatically syncs when you reconnect to the internet. This is essential for warehouses or locations with unreliable connectivity."
    },
    {
      question: "How does software for inventory management improve accuracy?",
      answer: "Software for inventory management improves accuracy by: eliminating manual data entry errors through barcode scanning (99.9% accuracy), providing real-time updates preventing outdated information, automating calculations reducing math errors, and maintaining audit trails for accountability. This reduces errors from 88% (manual) to less than 1% (automated)."
    },
    {
      question: "What is the ROI of software for inventory management?",
      answer: "The ROI is typically very high. Businesses see: 70% time savings on inventory tasks, 25% reduction in carrying costs, 90% reduction in errors, prevention of stockouts (which can cost 20% of lost sales), and 15-20% revenue growth from better availability. Most businesses see ROI within the first month."
    },
    {
      question: "Can software for inventory management handle multiple locations?",
      answer: "Yes, most software for inventory management supports multiple locations. You can track inventory across warehouses, stores, and distribution centers from a single dashboard. Location-specific reporting helps you optimize stock levels at each location, and you can transfer stock between locations seamlessly."
    },
    {
      question: "How long does it take to implement software for inventory management?",
      answer: "Cloud-based software for inventory management like StockFlow can be implemented quickly. Most businesses are operational within 1-2 days: create an account, import products, configure settings, and start tracking. This is much faster than on-premise solutions which can take weeks or months."
    },
    {
      question: "Is software for inventory management secure?",
      answer: "Reputable software for inventory management uses enterprise-grade security including SSL encryption, encrypted data storage, regular backups, GDPR compliance, and role-based access controls. StockFlow uses bank-level security to protect your inventory data, ensuring it's as secure as your financial information."
    }
  ];

  const features = [
    {
      icon: Wrench,
      title: "Comprehensive Tools",
      description: "Complete set of tools for all inventory management needs, from tracking to reporting."
    },
    {
      icon: Wrench,
      title: "Easy Configuration",
      description: "Simple setup and configuration process that doesn't require technical expertise."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Use your mobile device to scan barcodes for quick and accurate inventory updates."
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description: "Generate detailed reports and analytics to make informed business decisions."
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description: "Enable team collaboration with role-based access and permissions."
    },
    {
      icon: Cloud,
      title: "Cloud-based Solution",
      description: "Access your inventory management software from anywhere with secure cloud storage."
    }
  ];

  const benefits = [
    "Streamline inventory operations with powerful tools",
    "Reduce manual errors and improve accuracy",
    "Save time with automated processes",
    "Gain insights with comprehensive reporting",
    "Scale your business efficiently",
    "Integrate with existing business systems",
    "Access from anywhere with mobile support",
    "Get support when you need it"
  ];

  const softwareTypes = [
    {
      title: "Cloud-based Software",
      description: "Access your inventory management from anywhere with internet connection.",
      icon: "☁️",
      features: ["Remote access", "Automatic updates", "Data backup"]
    },
    {
      title: "Mobile Software",
      description: "Manage inventory on the go with mobile-optimized software.",
      icon: "ðŸ“±",
      features: ["Mobile scanning", "Offline capability", "Push notifications"]
    },
    {
      title: "Desktop Software",
      description: "Traditional software installed on your computer for local management.",
      icon: "ðŸ’»",
      features: ["Local storage", "Fast performance", "Offline access"]
    },
    {
      title: "Integrated Software",
      description: "Software that integrates with other business systems and tools.",
      icon: "ðŸ”—",
      features: ["ERP integration", "Accounting sync", "E-commerce connection"]
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      role: "Operations Manager, Retail Solutions",
      content: "StockFlow is the best software for inventory management we've used. It's intuitive, powerful, and has everything we need to manage our inventory effectively.",
      rating: 5
    },
    {
      name: "Jennifer Lee",
      role: "Owner, Fashion Boutique",
      content: "The mobile software features are fantastic. I can manage my inventory from anywhere, and the barcode scanning makes updates so quick and easy.",
      rating: 5
    },
    {
      name: "Robert Garcia",
      role: "Warehouse Supervisor, Tech Supply",
      content: "The reporting features in this software are incredible. We can now make data-driven decisions about our inventory management.",
      rating: 5
    }
  ];

  const softwareComparison = [
    {
      feature: "Real-time tracking",
      stockflow: "✓",
      competitor1: "Limited",
      competitor2: "Premium only"
    },
    {
      feature: "Mobile access",
      stockflow: "✓",
      competitor1: "Extra cost",
      competitor2: "Limited"
    },
    {
      feature: "Barcode scanning",
      stockflow: "✓",
      competitor1: "Premium only",
      competitor2: "Extra cost"
    },
    {
      feature: "Free plan",
      stockflow: "✓",
      competitor1: "✗",
      competitor2: "✗"
    },
    {
      feature: "Customer support",
      stockflow: "24/7",
      competitor1: "Business hours",
      competitor2: "Email only"
    }
  ];

  return (
    <SeoPageLayout 
      title="Software for Inventory Management"
      heroTitle="Software for Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Software 2025: Save 70% Time, 25% Costs | StockFlow"
        description="Best software for inventory management 2025. FREE plan (100 SKUs), real-time tracking, barcode scanning. Save 70% time, 25% costs. Trusted by 1,000+ businesses. Start free - no credit card required."
        keywords="software for inventory management, inventory management software, software inventory management, best software for inventory management, inventory management software tools, software for inventory tracking, inventory management software solution, software for stock management, inventory management software platform, software for inventory control, inventory management software system, software for inventory optimization, inventory management software tools, software for inventory planning, inventory management software solution, software for inventory analysis, inventory management software platform, software for inventory automation, softwares for inventory management, inventory tracking programs, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/software-for-inventory-management"
      />

      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Software for Inventory Management Matters</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            Businesses using <strong>software for inventory management</strong> see dramatic improvements: <strong>70% time savings</strong> on inventory tasks, <strong>25% reduction</strong> in carrying costs, and <strong>99% accuracy</strong> (vs 85% with manual methods). This comprehensive guide shows you how to choose and implement the right solution.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">70%</div>
              <div className="text-xs text-gray-600">Time Saved</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">25%</div>
              <div className="text-xs text-gray-600">Cost Reduction</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">99%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>
        <p className="text-lg text-slate-800 leading-relaxed mb-6">
          Discover powerful <strong>software for inventory management</strong> designed specifically to optimize your inventory operations. Real-time tracking, automated alerts, and comprehensive tools help businesses maintain optimal stock levels and streamline operations.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          <strong>Software for inventory management</strong> includes specialized tools like StockFlow, which provide real-time tracking, automated reordering, barcode scanning, reporting, and integration capabilities. These tools help businesses maintain optimal stock levels and streamline operations. Explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> solutions, compare options in our <Link to="/best-of/best-inventory-management-software" className="text-blue-600 hover:underline font-semibold">best inventory management software</Link> guide, or learn about <Link to="/solutions/inventory-software-management" className="text-blue-600 hover:underline font-semibold">inventory software management</Link> best practices. For manufacturing businesses, consider <Link to="/bill-of-material-management-software-free" className="text-blue-600 hover:underline font-semibold">free BOM management software</Link> options.
        </p>
      </div>

      {/* What is Software for Inventory Management Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Software for Inventory Management</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Software for inventory management is specialized digital tools designed to help businesses track, control, and optimize their inventory operations. These tools provide real-time visibility, automate routine tasks, and provide insights for better decision-making. Modern software for inventory management goes beyond simple tracking to offer comprehensive solutions that integrate with other business systems and provide advanced analytics and automation capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Comprehensive Digital Tools</h3>
              <p className="text-gray-700 mb-4">
                Software for inventory management encompasses a range of digital tools that work together to provide complete inventory control. These tools include real-time tracking systems, automated reorder point calculators, barcode scanning capabilities, and comprehensive reporting dashboards. The software integrates all these functions into a unified platform that eliminates the need for multiple disconnected systems.
              </p>
              <p className="text-gray-700">
                The best software for inventory management integrates seamlessly with <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:text-blue-800 underline">inventory management software</Link> solutions, providing a complete ecosystem for inventory control. This integration ensures that data flows automatically between systems, maintaining consistency and eliminating manual data entry.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Automation & Intelligence</h3>
              <p className="text-gray-700 mb-4">
                Modern software for inventory management leverages automation to handle routine tasks like reorder point calculations, low stock alerts, and purchase order generation. <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:text-blue-800 underline">Mobile inventory management</Link> capabilities allow businesses to manage inventory from smartphones and tablets, with barcode scanning for quick and accurate updates. This automation reduces manual work while improving accuracy.
              </p>
              <p className="text-gray-700">
                Integration with <Link to="/solutions/online-inventory-management" className="text-blue-600 hover:text-blue-800 underline">online inventory management</Link> systems enables businesses to maintain accurate stock levels across e-commerce channels, preventing overselling and ensuring customer satisfaction. The software becomes the foundation for comprehensive inventory control across all sales channels.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">How Software for Inventory Management Transforms Operations</h3>
            <p className="text-gray-700 mb-4">
              Software for inventory management transforms inventory operations by providing real-time visibility, automating routine tasks, and enabling data-driven decision-making. Instead of managing inventory through spreadsheets or manual processes, businesses can use specialized software that tracks inventory continuously, provides instant updates, and generates insights automatically.
            </p>
            <p className="text-gray-700 mb-4">
              The automation capabilities of inventory management software eliminate manual data entry, reducing errors and saving time. Automated alerts notify managers when stock levels require attention, ensuring timely responses to inventory changes. Integration with other business systems ensures that inventory data is synchronized across sales, accounting, and fulfillment platforms, maintaining consistency and accuracy.
            </p>
            <p className="text-gray-700 mb-6">
              For businesses with multiple locations, software for inventory management provides unified visibility across all warehouses, stores, and distribution centers. Integration with <Link to="/solutions/inventory-software-management" className="text-blue-600 hover:text-blue-800 underline">inventory software management</Link> platforms enhances these capabilities, providing comprehensive tools for multi-location inventory control.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Key Features of Software for Inventory Management</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Real-Time Tracking</h4>
                  <p className="text-gray-700">Continuous monitoring of inventory levels and movements with instant updates across all devices and locations, providing immediate visibility into stock status.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Automated Alerts</h4>
                  <p className="text-gray-700">Intelligent alerting system that notifies managers when inventory reaches reorder points, preventing stockouts and ensuring timely replenishment.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Barcode Scanning</h4>
                  <p className="text-gray-700">Mobile barcode scanning capabilities that enable quick and accurate inventory updates, eliminating manual entry errors and speeding up operations.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Advanced Analytics</h4>
                  <p className="text-gray-700">Comprehensive reporting and analytics that provide insights into inventory performance, turnover rates, and optimization opportunities. Explore <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:text-blue-800 underline">inventory management software solutions</Link> to find systems with advanced analytics capabilities.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Why Businesses Choose Software for Inventory Management: Real Results</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-gray-700 mb-3">
                    Businesses implement <strong>software for inventory management</strong> to achieve accuracy rates of <strong>99% or higher</strong>, compared to 85-90% with manual methods. The time savings are equally impressive, with inventory operations completing <strong>10 times faster</strong> than manual processes.
                  </p>
                  <p className="text-gray-700">
                    This efficiency translates directly to <strong>reduced labor costs</strong> and <strong>improved customer service</strong> through better inventory visibility.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Typical ROI Timeline:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Week 1:</strong> Setup and data migration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Month 1:</strong> Visible time savings and accuracy improvements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Month 3:</strong> 25% cost reduction and 70% time savings</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700">
                Whether you're managing a small retail store or a large distribution network, <strong>software for inventory management</strong> provides the foundation for efficient inventory operations. The investment in specialized software pays dividends through improved accuracy, reduced errors, and streamlined operations that scale with your business growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful <span className="text-blue-600">Software Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need in software for inventory management, designed for modern businesses.
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
              Benefits of <span className="text-blue-600">Inventory Management Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your inventory operations with powerful software solutions.
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

      {/* Software Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Types of <span className="text-blue-600">Inventory Management Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the software type that best fits your business needs and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {softwareTypes.map((type, index) => (
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

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other software for inventory management. For a comprehensive comparison of the best inventory management software platforms, see our detailed <Link to="/best-inventory-management-software" className="text-blue-600 hover:underline font-semibold">best inventory management software</Link> guide.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor A</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {softwareComparison.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitor1}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitor2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using StockFlow software for inventory management.
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
            Get the Best Software for Inventory Management
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow for comprehensive inventory management.
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

            

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Software for Inventory Management - Complete Guide 2025",
          "description": "Complete guide to software for inventory management. Learn about specialized digital tools that help businesses track, control, and optimize inventory operations. Discover comprehensive solutions with real-time tracking and automation.",
          "image": "https://www.stockflow.be/software-inventory-management.png",
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
          "datePublished": "2024-01-01",
          "dateModified": "2025-11-26",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/solutions/software-for-inventory-management"
          },
          "keywords": "software for inventory management, inventory management software, inventory software tools"
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
        {"@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StockFlow - Best Software for Inventory Management",
                "description": "Discover the best software for inventory management. Real-time tracking, automated alerts, barcode scanning, and more.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "description": "Free plan - Basic inventory management software",
                  "availability": "https://schema.org/InStock"
                },
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
                "image": "https://www.stockflow.be/Inventory-Management.png",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/solutions/software-for-inventory-management"
                },
          "featureList": [
            "Real-time inventory tracking",
            "Automated reorder alerts",
            "Barcode scanning",
            "Advanced reporting and analytics",
            "Multi-user support",
            "Cloud-based solution",
            "Mobile access",
            "Multi-location support",
            "Integration capabilities"
          ]
              }
        ]} />
    </SeoPageLayout>
  );
}


