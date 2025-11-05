import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  BarChart3, 
  Users, 
  Camera, 
  Warehouse,
  CheckCircle,
  Star,
  Cloud,
  Cpu,
  Database
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function InventorySoftwareManagement() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is inventory software management?",
      answer: "Inventory software management refers to the comprehensive system of using digital tools and software to oversee, control, and optimize all aspects of inventory operations. It encompasses tracking, ordering, storage, and analysis of inventory items through specialized software solutions."
    },
    {
      question: "How does inventory software management work?",
      answer: "Inventory software management works by centralizing all inventory data in a digital system, automating routine tasks like reordering, providing real-time visibility into stock levels, and generating reports for better decision-making. It integrates with other business systems for seamless operations."
    },
    {
      question: "What are the key components of inventory software management?",
      answer: "Key components include real-time tracking, automated reorder points, barcode scanning, multi-location support, reporting and analytics, integration capabilities, user access control, and mobile accessibility for comprehensive inventory oversight."
    },
    {
      question: "Why is inventory software management important for businesses?",
      answer: "Inventory software management is crucial because it prevents stockouts, reduces overstock, improves cash flow, enhances customer satisfaction, provides data-driven insights, automates manual processes, and helps businesses scale efficiently while maintaining control over their inventory."
    },
    {
      question: "What features should good inventory software management have?",
      answer: "Good inventory software management should include real-time tracking, automated alerts, barcode scanning, mobile access, reporting capabilities, integration options, user role management, and scalability to grow with your business needs."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Centralized Management",
      description: "Manage all your inventory from one central location with real-time updates and synchronization."
    },
    {
      icon: Cpu,
      title: "Automated Processes",
      description: "Automate routine tasks like reordering, alerts, and reporting to save time and reduce errors."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into inventory performance, trends, and optimization opportunities."
    },
    {
      icon: Camera,
      title: "Barcode Integration",
      description: "Scan barcodes with your mobile device for quick and accurate inventory updates."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enable multiple users with different access levels to manage inventory efficiently."
    },
    {
      icon: Cloud,
      title: "Cloud-Based Access",
      description: "Access your inventory management system from anywhere with secure cloud storage."
    }
  ];

  const benefits = [
    "Streamline inventory operations with automation",
    "Reduce manual errors by up to 95%",
    "Improve inventory accuracy and visibility",
    "Save 15+ hours per week on manual tasks",
    "Optimize stock levels and reduce carrying costs",
    "Enhance decision-making with data insights",
    "Scale your business with confidence",
    "Integrate with existing business systems"
  ];

  const managementTypes = [
    {
      title: "Real-time Management",
      description: "Monitor inventory levels and movements as they happen with instant updates.",
      icon: "⚡",
      features: ["Live tracking", "Instant alerts", "Real-time sync"]
    },
    {
      title: "Automated Management",
      description: "Set up rules and triggers to automate routine inventory management tasks.",
      icon: "🤖",
      features: ["Auto reordering", "Smart alerts", "Workflow automation"]
    },
    {
      title: "Analytical Management",
      description: "Use data and analytics to make informed inventory management decisions.",
      icon: "📊",
      features: ["Trend analysis", "Forecasting", "Performance metrics"]
    },
    {
      title: "Collaborative Management",
      description: "Enable team members to work together on inventory management tasks.",
      icon: "👥",
      features: ["Role-based access", "Team workflows", "Shared insights"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Operations Director, TechCorp",
      content: "StockFlow's inventory software management transformed our operations. We now have complete visibility and control over our inventory with minimal manual effort.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Warehouse Manager, Global Supply",
      content: "The automated management features saved us countless hours. Our inventory accuracy improved from 85% to 99% in just two months.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "CEO, Retail Plus",
      content: "The analytical management capabilities helped us identify optimization opportunities we never knew existed. Highly recommended!",
      rating: 5
    }
  ];

  const managementSteps = [
    {
      step: "1",
      title: "Setup & Configuration",
      description: "Configure your inventory management system with your business rules and preferences"
    },
    {
      step: "2",
      title: "Data Integration",
      description: "Import existing inventory data and integrate with other business systems"
    },
    {
      step: "3",
      title: "Automation Setup",
      description: "Set up automated rules for reordering, alerts, and reporting"
    },
    {
      step: "4",
      title: "Team Training",
      description: "Train your team on the new system and establish workflows"
    }
  ];

  return (
    <SeoPageLayout title="Inventory Software Management">
      <SEO
        title="Inventory Software Management - Complete Solution | StockFlow"
        description="Master inventory software management with StockFlow. Automated tracking, real-time analytics, and comprehensive management tools. Start free trial today!"
        keywords="inventory software management, inventory management software, software inventory management, inventory management system, inventory software solution, inventory management platform, inventory software tools, inventory management tools, inventory software system, inventory management software solution, inventory software platform, inventory management software tools, inventory software management system, inventory management software platform, inventory software management tools, inventory management software system, inventory software management platform, inventory management software solution, inventory software management solution, inventory tracking programs, softwares for inventory management"
        url="https://www.stockflow.be/inventory-software-management"
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
              Complete <span className="text-blue-400">Inventory Software Management</span> Solution
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Take control of your inventory with comprehensive software management tools. Automate processes, gain insights, and optimize your operations with StockFlow's complete inventory management solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>

            </div>
            <p className="text-sm text-gray-200">Trusted by 500+ businesses for inventory software management</p>
          </div>
        </div>
      </section>

      {/* What is Inventory Software Management Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is <span className="text-blue-600">Inventory Software Management</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Inventory software management is the comprehensive approach to managing all aspects of your inventory using specialized software tools. It combines tracking, automation, analytics, and team collaboration to create an efficient inventory management ecosystem.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Modern inventory software management goes beyond simple tracking to provide intelligent automation, predictive analytics, and seamless integration with your entire business operation.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Centralized Control</h3>
                  <p className="text-sm text-blue-700">Manage all inventory operations from one platform</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Automated Efficiency</h3>
                  <p className="text-sm text-green-700">Reduce manual work with intelligent automation</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Management Components</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Real-time inventory tracking and monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Automated reorder points and alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Advanced analytics and reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Team collaboration and access control</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Integration with business systems</span>
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
              Comprehensive <span className="text-blue-600">Management Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your inventory effectively with powerful software tools.
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
              Benefits of <span className="text-blue-600">Software Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your inventory operations with comprehensive software management.
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

      {/* Management Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Types of <span className="text-blue-600">Software Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the management approach that best fits your business needs and operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementTypes.map((type, index) => (
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
              How <span className="text-blue-600">Software Management</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to implement comprehensive inventory software management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementSteps.map((step, index) => (
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
              Success Stories from <span className="text-blue-600">Management Teams</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how businesses have transformed their inventory management with StockFlow.
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
            Start Your Inventory Software Management Journey
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow for comprehensive inventory software management.
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
            <p className="text-lg text-gray-600">Everything you need to know about inventory software management</p>
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
            Complete inventory software management solution. Simple, powerful, and designed for efficiency.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory software management solutions for modern businesses.
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
                "name": "StockFlow - Inventory Software Management",
                "description": "Master inventory software management with StockFlow. Automated tracking, real-time analytics, and comprehensive management tools.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "description": "Free plan - Basic inventory software management",
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
                  "@id": "https://www.stockflow.be/inventory-software-management"
                },
                "featureList": [
                  "Centralized management",
                  "Automated processes",
                  "Advanced analytics",
                  "Barcode integration",
                  "Team collaboration",
                  "Cloud-based access"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}
