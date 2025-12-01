import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  BarChart3, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Cloud,
  Database,
  Zap
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function InventorySoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is inventory software?",
      answer: "Inventory software is a digital solution that helps businesses track, manage, and optimize their stock levels, orders, and warehouse operations. It provides real-time visibility into inventory levels, automates reordering processes, and helps prevent stockouts or overstock situations. Modern inventory software includes features like barcode scanning, multi-location support, reporting, and integration capabilities."
    },
    {
      question: "What are the benefits of using inventory software?",
      answer: "Inventory software provides benefits like real-time tracking, automated reorder points, reduced human errors, better demand forecasting, improved cash flow, enhanced customer service, detailed analytics, and integration with other business systems. It also helps reduce carrying costs, prevent stockouts, optimize stock levels, and save time through automation."
    },
    {
      question: "How much does inventory software cost?",
      answer: `Inventory software pricing varies, but StockFlow offers a free plan for small businesses with up to 30 products. Premium plans start at ${formatPrice(29)}/month for advanced features. Most solutions offer free trials to test the software before committing. Enterprise solutions may cost more but typically include advanced features and dedicated support.`
    },
    {
      question: "Can inventory software integrate with other systems?",
      answer: "Yes, modern inventory software like StockFlow integrates with accounting systems, e-commerce platforms, POS systems, and ERP software. This ensures seamless data flow across your entire business ecosystem. Integration eliminates manual data entry, reduces errors, and provides a unified view of your operations."
    },
    {
      question: "Is inventory software suitable for small businesses?",
      answer: "Absolutely! Inventory software is especially beneficial for small businesses as it helps automate processes, reduce errors, and provides insights that were previously only available to large enterprises. StockFlow is specifically designed for SMEs and growing businesses, with affordable pricing and easy setup."
    },
    {
      question: "What features should I look for in inventory software?",
      answer: "Key features to look for include real-time inventory tracking, barcode scanning, mobile access, automated reorder alerts, multi-location support, reporting and analytics, integration capabilities, user access control, and scalability. The best inventory software should be easy to use while providing powerful features that grow with your business."
    },
    {
      question: "How long does it take to implement inventory software?",
      answer: "Implementation time varies depending on the complexity of your inventory and the software chosen. StockFlow can typically be set up and running within a week, including data import, configuration, and basic training. More complex implementations with extensive integrations may take longer, but most businesses see value within the first month."
    },
    {
      question: "Can I use inventory software on mobile devices?",
      answer: "Yes, most modern inventory software including StockFlow offers mobile apps for iOS and Android devices. Mobile access allows you to scan barcodes, update inventory, check stock levels, and manage inventory from anywhere. This is especially valuable for field service businesses and multi-location operations."
    },
    {
      question: "What is the difference between inventory software and inventory management software?",
      answer: "The terms are often used interchangeably, but inventory software typically refers to the technology platform, while inventory management software emphasizes the management processes and workflows. Both refer to systems that help businesses track, control, and optimize inventory. StockFlow provides comprehensive inventory management software with all the tools needed for effective inventory control."
    },
    {
      question: "Do I need special hardware for inventory software?",
      answer: "No, modern inventory software like StockFlow works with standard devices. You can use your smartphone's camera for barcode scanning, eliminating the need for expensive specialized hardware. The software works on computers, tablets, and smartphones, making it accessible and affordable for businesses of all sizes."
    },
    {
      question: "How does inventory software help prevent stockouts?",
      answer: "Inventory software prevents stockouts by providing real-time visibility into stock levels, setting automated low stock alerts, calculating optimal reorder points based on usage patterns, and enabling proactive purchasing. When inventory reaches predetermined levels, the system automatically alerts you to reorder, ensuring you never run out of critical items."
    },
    {
      question: "Can inventory software help reduce inventory costs?",
      answer: "Yes, inventory software helps reduce costs by optimizing stock levels to minimize carrying costs, identifying slow-moving or obsolete inventory, preventing overstocking, reducing waste, and improving purchasing decisions through data-driven insights. Businesses typically see 20-35% reduction in inventory carrying costs with effective inventory software."
    },
    {
      question: "What is the difference between cloud-based and on-premise inventory software?",
      answer: "Cloud-based inventory software is hosted online and accessible from anywhere, with automatic updates and no IT infrastructure needed. On-premise software requires local installation, servers, and IT maintenance. Cloud-based solutions like StockFlow are more affordable, flexible, and suitable for most businesses, while on-premise is typically only for very large enterprises."
    },
    {
      question: "How does inventory software improve customer satisfaction?",
      answer: "Inventory software improves customer satisfaction by: preventing stockouts so products are always available, ensuring accurate order fulfillment, providing real-time availability information, enabling faster order processing, and reducing shipping delays. Happy customers lead to repeat business and positive reviews."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Tracking",
      description: "Monitor your inventory levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Access",
      description: "Collaborate with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Cloud,
      title: "Cloud-based",
      description: "Access your inventory data from anywhere with secure cloud storage and automatic backups."
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 30%",
    "Eliminate stockouts and overstock situations",
    "Improve cash flow with better inventory turnover",
    "Save 10+ hours per week on manual tracking",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Integrate with existing systems"
  ];

  const useCases = [
    {
      title: "Small Business",
      description: "Perfect for small businesses looking to automate their inventory management without complex setup.",
      icon: "ðŸª",
      features: ["Easy setup", "Affordable pricing", "Essential features"]
    },
    {
      title: "E-commerce",
      description: "Ideal for online stores managing inventory across multiple sales channels.",
      icon: "ðŸ’»",
      features: ["Multi-channel sync", "Real-time updates", "Order management"]
    },
    {
      title: "Retail",
      description: "Great for retail stores needing real-time inventory tracking and point-of-sale integration.",
      icon: "ðŸ›ï¸",
      features: ["POS integration", "Barcode scanning", "Customer insights"]
    },
    {
      title: "Wholesale",
      description: "Essential for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "ðŸ“¦",
      features: ["Bulk operations", "Supplier management", "Advanced reporting"]
    }
  ];

  const testimonials = [
    {
      name: "David Wilson",
      role: "Owner, Wilson Electronics",
      content: "StockFlow's inventory software saved us 15 hours per week. The automated reorder points are a game-changer for our business.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Operations Manager, Fashion Hub",
      content: "The real-time tracking feature helped us reduce stockouts by 95%. Our customer satisfaction has never been higher.",
      rating: 5
    },
    {
      name: "John Smith",
      role: "CEO, Tech Solutions",
      content: "We tried several inventory software solutions, but StockFlow was the only one that was both powerful and easy to use.",
      rating: 5
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Real-time tracking",
      stockflow: "✓",
      competitors: "Limited"
    },
    {
      feature: "Mobile access",
      stockflow: "✓",
      competitors: "Extra cost"
    },
    {
      feature: "Barcode scanning",
      stockflow: "✓",
      competitors: "Premium only"
    },
    {
      feature: "Multi-location",
      stockflow: "✓",
      competitors: "Enterprise only"
    },
    {
      feature: "Free plan",
      stockflow: "✓",
      competitors: "✗"
    }
  ];

  return (
    <SeoPageLayout 
      title="Inventory Software"
      heroTitle="Inventory Software"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Software 2025 | Best Inventory System Software | StockFlow"
        description="Best inventory software 2025. Real-time tracking, barcode scanning, automated alerts. Reduce costs 30% & save 15 hours/week. Free plan for up to 100 products. Start free today - no credit card required."
        keywords="inventory software, stock management software, inventory tracking software, inventory management software, stock software, inventory control software, warehouse management software, inventory system software, stock tracking software, inventory software for small business, best inventory software, inventory software free, cloud inventory software, inventory software comparison, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/inventory-software"
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Streamline your inventory management with powerful software that tracks stock levels, automates reordering, and provides real-time insights. Join 500+ businesses using StockFlow to optimize their inventory.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          <strong>Inventory software</strong> is a digital solution that helps businesses track, manage, and optimize their stock levels, orders, and warehouse operations. It provides real-time visibility into inventory levels, automates reordering processes, and helps prevent stockouts or overstock situations. StockFlow's <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> combines powerful features with intuitive design, making it accessible for businesses of all sizes. Explore <Link to="/solutions/online-inventory-software" className="text-blue-600 hover:underline font-semibold">online inventory software</Link> options or learn about <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:underline font-semibold">inventory management software solutions</Link>.
        </p>
      </div>

      {/* Why Choose StockFlow Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose <span className="text-blue-600">StockFlow</span> Inventory Software?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow is designed specifically for growing businesses that need powerful inventory management without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Business with <span className="text-blue-600">Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See immediate results with our comprehensive inventory software solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
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
              Perfect for Every <span className="text-blue-600">Business Type</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're a small business or a growing enterprise, StockFlow adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
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

      {/* Implementation Guide Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How to Implement <span className="text-blue-600">Inventory Software</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Implementing inventory software doesn't have to be complicated. Follow this step-by-step guide to get your inventory management system up and running quickly.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Step 1: Assess Your Needs</h3>
              <p className="text-gray-700">
                Evaluate your current inventory management challenges, identify required features, and determine your budget. Consider factors like number of products, locations, users, and integration needs. This assessment helps you choose the right inventory software solution.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Step 2: Choose Your Inventory Software</h3>
              <p className="text-gray-700">
                Select inventory software that matches your business size and requirements. Look for features like real-time tracking, mobile access, barcode scanning, reporting, and scalability. StockFlow offers flexible plans that grow with your business.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Step 3: Set Up Your System</h3>
              <p className="text-gray-700">
                Import your existing inventory data, configure settings like reorder points and alerts, set up user permissions, and integrate with other business systems. StockFlow's intuitive setup process gets you started quickly.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Step 4: Train Your Team</h3>
              <p className="text-gray-700">
                Provide training on key features and workflows. Start with core users and expand training gradually. StockFlow offers comprehensive training resources and support to ensure your team can use the inventory software effectively.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Step 5: Go Live and Optimize</h3>
              <p className="text-gray-700">
                Launch your inventory software and monitor performance. Use analytics to identify optimization opportunities, refine processes, and continuously improve your inventory management. Regular reviews ensure you're getting maximum value from your inventory software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Calculate Your <span className="text-blue-600">ROI with Inventory Software</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Inventory software delivers measurable returns through cost savings, efficiency improvements, and revenue growth. Here's how to calculate your potential ROI.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Cost Savings</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Reduced Carrying Costs:</strong> Optimize inventory levels to reduce storage and financing costs by 20-35%
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Less Waste:</strong> Identify and reduce obsolete inventory, saving 5-15% annually
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Fewer Emergency Orders:</strong> Prevent stockouts and reduce rush order premiums
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Labor Savings:</strong> Automate manual tasks, saving 10-20 hours per week
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Revenue Growth</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Reduced Stockouts:</strong> Maintain optimal stock levels to capture more sales
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Faster Fulfillment:</strong> Improve order processing speed and customer satisfaction
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Better Customer Service:</strong> Accurate inventory data enables better customer interactions
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Scalable Growth:</strong> Support business expansion without proportional cost increases
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center">Typical ROI Timeline</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1-3 Months</div>
                <p className="text-gray-700">Initial setup and team training. Start seeing time savings from automation.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3-6 Months</div>
                <p className="text-gray-700">Significant cost reductions from optimized inventory levels and reduced waste.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">6-12 Months</div>
                <p className="text-gray-700">Full ROI realization with improved efficiency, reduced costs, and revenue growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Inventory Software for <span className="text-blue-600">Every Industry</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Discover how different industries use inventory software to improve operations and drive growth.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Retail</h3>
              <p className="text-gray-700 mb-4">
                Retailers use inventory software to manage stock across multiple channels, prevent overselling, and optimize reorder points. Real-time tracking ensures accurate stock levels.
              </p>
              <Link to="/retail-inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
              <p className="text-gray-700 mb-4">
                Online stores rely on inventory software to synchronize stock across marketplaces, manage fulfillment, and prevent overselling. Multi-channel integration is essential.
              </p>
              <Link to="/ecommerce-inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Manufacturing</h3>
              <p className="text-gray-700 mb-4">
                Manufacturers use inventory software to track raw materials, manage work-in-progress, and optimize production schedules. BOM management is critical.
              </p>
              <Link to="/inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Field Service</h3>
              <p className="text-gray-700 mb-4">
                Contractors and service businesses use inventory software to track parts and tools across vehicles, ensure technicians have what they need, and reduce return trips.
              </p>
              <Link to="/contractor-inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Healthcare</h3>
              <p className="text-gray-700 mb-4">
                Healthcare facilities use inventory software to track medical supplies, manage expiration dates, ensure compliance, and maintain critical stock levels.
              </p>
              <Link to="/medical-inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Wholesale</h3>
              <p className="text-gray-700 mb-4">
                Wholesalers use inventory software to manage large quantities, track multiple suppliers, optimize bulk ordering, and maintain accurate stock levels across warehouses.
              </p>
              <Link to="/wholesaler-inventory-management" className="text-blue-600 hover:underline font-semibold text-sm">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other inventory software solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using StockFlow inventory software.
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

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(0)}<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 30 products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic inventory tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Mobile access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center block hover:bg-blue-700 transition"
              >
                Start Free
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Growth Plan</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(29)}<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Barcode scanning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center block hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow to optimize their inventory management.
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
                "name": "StockFlow - Best Inventory Software",
                "description": "Discover the best inventory software for your business. Real-time tracking, barcode scanning, automated alerts, and more.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": [
                  {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR",
                    "description": "Free plan - Up to 30 products",
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "price": "29",
                    "priceCurrency": "EUR",
                    "description": "Growth plan - Unlimited products with advanced features",
                    "availability": "https://schema.org/InStock"
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
                "image": "https://www.stockflow.be/Inventory-Management.png",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/solutions/inventory-software"
                },
                "featureList": [
                  "Real-time inventory tracking",
                  "Barcode scanning",
                  "Automated reorder points",
                  "Multi-location support",
                  "Advanced analytics",
                  "Mobile access",
                  "Team collaboration",
                  "Cloud-based storage"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}


