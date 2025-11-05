import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
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

import { StructuredData } from '../../components/StructuredData';
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
      icon: "📱",
      features: ["Mobile scanning", "Offline capability", "Push notifications"]
    },
    {
      title: "Desktop Software",
      description: "Traditional software installed on your computer for local management.",
      icon: "💻",
      features: ["Local storage", "Fast performance", "Offline access"]
    },
    {
      title: "Integrated Software",
      description: "Software that integrates with other business systems and tools.",
      icon: "🔗",
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
    <SeoPageLayout title="Software for Inventory Management">
      <SEO
        title="Best Software for Inventory Management 2024 | StockFlow"
        description="Discover the best software for inventory management. Real-time tracking, automated alerts, barcode scanning, and more. Start free trial today!"
        keywords="software for inventory management, inventory management software, software inventory management, best software for inventory management, inventory management software tools, software for inventory tracking, inventory management software solution, software for stock management, inventory management software platform, software for inventory control, inventory management software system, software for inventory optimization, inventory management software tools, software for inventory planning, inventory management software solution, software for inventory analysis, inventory management software platform, software for inventory automation, softwares for inventory management, inventory tracking programs"
        url="https://www.stockflow.be/software-for-inventory-management"
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
              The Best <span className="text-blue-400">Software for Inventory Management</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Discover powerful software designed specifically for inventory management. Real-time tracking, automated alerts, and comprehensive tools to optimize your inventory operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
    
            </div>
            <p className="text-sm text-gray-200">Trusted by 500+ businesses for inventory management</p>
          </div>
        </div>
      </section>

      {/* What is Software for Inventory Management Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is <span className="text-blue-600">Software for Inventory Management</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Software for inventory management is specialized digital tools designed to help businesses track, control, and optimize their inventory operations. These tools provide real-time visibility, automate routine tasks, and provide insights for better decision-making.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Modern software for inventory management goes beyond simple tracking to offer comprehensive solutions that integrate with other business systems and provide advanced analytics and automation capabilities.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Comprehensive Tools</h3>
                  <p className="text-sm text-blue-700">All-in-one solution for inventory management needs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Easy to Use</h3>
                  <p className="text-sm text-green-700">Intuitive interface designed for business users</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Software Features</h3>
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
                  <span>Barcode scanning and mobile access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Advanced reporting and analytics</span>
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
              See how StockFlow compares to other software for inventory management.
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

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about software for inventory management</p>
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
            The best software for inventory management. Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Software for inventory management solutions.
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
                  "@id": "https://www.stockflow.be/software-for-inventory-management"
                },
                "featureList": [
                  "Comprehensive tools",
                  "Easy configuration",
                  "Barcode scanning",
                  "Advanced reporting",
                  "Multi-user support",
                  "Cloud-based solution"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}
