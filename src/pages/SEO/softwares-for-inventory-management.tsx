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
  Grid3X3,
  Cloud
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function SoftwaresForInventoryManagement() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What are the best softwares for inventory management?",
      answer: "The best softwares for inventory management include StockFlow, which offers comprehensive features, easy setup, and affordable pricing. Other top options include enterprise solutions for larger organizations, but StockFlow is ideal for small to medium businesses."
    },
    {
      question: "How do I choose between different softwares for inventory management?",
      answer: "Consider factors like your business size, budget, required features, ease of use, integration capabilities, and customer support. Look for softwares that offer free trials so you can test them before committing. StockFlow offers a free plan to get started."
    },
    {
      question: "Are there free softwares for inventory management?",
      answer: "Yes, StockFlow offers a free plan for small businesses with up to 30 products. This allows you to test the software and see if it meets your needs before upgrading to a paid plan with advanced features."
    },
    {
      question: "What features should softwares for inventory management have?",
      answer: "Essential features include real-time tracking, barcode scanning, automated alerts, reporting capabilities, mobile access, multi-user support, and integration options. StockFlow includes all these features and more."
    },
    {
      question: "Can softwares for inventory management integrate with other systems?",
      answer: "Yes, modern softwares like StockFlow integrate with accounting systems, e-commerce platforms, POS systems, and other business tools. This ensures seamless data flow across your entire business ecosystem."
    }
  ];

  const features = [
    {
      icon: Grid3X3,
      title: "Multiple Software Options",
      description: "Choose from various software solutions designed for different business needs and sizes."
    },
    {
      icon: Grid3X3,
      title: "Modular Approach",
      description: "Mix and match different software modules to create your perfect inventory management system."
    },
    {
      icon: Camera,
      title: "Barcode Integration",
      description: "Use barcode scanning across different software platforms for consistent inventory tracking."
    },
    {
      icon: BarChart3,
      title: "Unified Reporting",
      description: "Generate comprehensive reports from multiple software systems in one dashboard."
    },
    {
      icon: Users,
      title: "Cross-Platform Access",
      description: "Access your inventory management across different software platforms and devices."
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamlessly integrate multiple cloud-based software solutions for your inventory needs."
    }
  ];

  const benefits = [
    "Choose the best software combination for your needs",
    "Integrate multiple software solutions seamlessly",
    "Scale your software stack as you grow",
    "Reduce vendor lock-in with flexible options",
    "Optimize costs with targeted software selection",
    "Improve efficiency with specialized tools",
    "Access from multiple platforms and devices",
    "Get support for your entire software ecosystem"
  ];

  const softwareCategorys = [
    {
      title: "Cloud-based Softwares",
      description: "Modern cloud solutions for flexible inventory management.",
      icon: "☁️",
      features: ["Remote access", "Automatic updates", "Scalable pricing"]
    },
    {
      title: "Mobile Softwares",
      description: "Mobile-first solutions for on-the-go inventory management.",
      icon: "📱",
      features: ["Mobile scanning", "Offline capability", "Push notifications"]
    },
    {
      title: "Desktop Softwares",
      description: "Traditional desktop applications for local inventory control.",
      icon: "💻",
      features: ["Local storage", "Fast performance", "Offline access"]
    },
    {
      title: "Integrated Softwares",
      description: "Software suites that integrate multiple business functions.",
      icon: "🔗",
      features: ["ERP integration", "Accounting sync", "E-commerce connection"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "IT Director, MultiTech Solutions",
      content: "We use multiple softwares for inventory management, and StockFlow integrates perfectly with our existing systems. It's the missing piece we needed.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Operations Manager, Global Supply",
      content: "The flexibility to choose different softwares for different aspects of our inventory management has been game-changing. StockFlow works great with our other tools.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "CEO, TechStart",
      content: "We tried several softwares for inventory management before finding the right combination. StockFlow is now our core solution that everything else integrates with.",
      rating: 5
    }
  ];

  const softwareComparison = [
    {
      category: "Ease of Use",
      stockflow: "Excellent",
      competitor1: "Good",
      competitor2: "Fair"
    },
    {
      category: "Integration Options",
      stockflow: "Extensive",
      competitor1: "Limited",
      competitor2: "Basic"
    },
    {
      category: "Mobile Support",
      stockflow: "Full-featured",
      competitor1: "Limited",
      competitor2: "Basic"
    },
    {
      category: "Pricing",
      stockflow: "Affordable",
      competitor1: "Expensive",
      competitor2: "Moderate"
    },
    {
      category: "Customer Support",
      stockflow: "24/7",
      competitor1: "Business hours",
      competitor2: "Email only"
    }
  ];

  return (
    <SeoPageLayout title="Softwares for Inventory Management">
      <SEO
        title="Best Softwares for Inventory Management 2025: Free Trial | Compare"
        description="Compare the best softwares for inventory management 2025! Find your perfect solution. Trusted by 10,000+ businesses. Compare features, pricing & reviews. Start FREE trial - no credit card!"
        keywords="softwares for inventory management, inventory management softwares, best softwares for inventory management, inventory management software options, softwares for inventory tracking, inventory management software solutions, softwares for stock management, inventory management software comparison, softwares for inventory control, inventory management software alternatives, softwares for inventory optimization, inventory management software reviews, softwares for inventory planning, inventory management software selection, softwares for inventory analysis, inventory management software evaluation, softwares for inventory automation, inventory management software recommendations, best inventory management software, stockflow, inventory management software, stock flow"
        url="https://www.stockflow.be/softwares-for-inventory-management"
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
              Best <span className="text-blue-400">Softwares for Inventory Management</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Explore the top softwares for inventory management. Compare features, pricing, and find the perfect solution for your business needs. From simple tracking to enterprise solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
         
            </div>
            <p className="text-sm text-gray-200">Compare the best softwares for inventory management</p>
          </div>
        </div>
      </section>

      {/* What are Softwares for Inventory Management Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What are <span className="text-blue-600">Softwares for Inventory Management</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Softwares for inventory management are digital tools and applications designed to help businesses track, control, and optimize their inventory operations. These solutions range from simple tracking tools to comprehensive enterprise systems.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Modern softwares for inventory management offer various features including real-time tracking, automated alerts, barcode scanning, reporting, and integration capabilities to streamline business operations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Multiple Options</h3>
                  <p className="text-sm text-blue-700">Choose from various software solutions</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Flexible Integration</h3>
                  <p className="text-sm text-green-700">Mix and match different software tools</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Types of Softwares Available</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Cloud-based inventory management softwares</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Mobile-first inventory tracking softwares</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Desktop inventory management applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Integrated ERP and inventory softwares</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Specialized industry-specific softwares</span>
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
              Key Features of <span className="text-blue-600">Inventory Management Softwares</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential features to look for when choosing softwares for inventory management.
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
              Benefits of <span className="text-blue-600">Multiple Softwares</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why using the right combination of softwares for inventory management matters.
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

      {/* Software categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              categories of <span className="text-blue-600">Inventory Management Softwares</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Different types of softwares available for various inventory management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {softwareCategorys.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
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
              StockFlow vs Other <span className="text-blue-600">Softwares</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other softwares for inventory management.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor A</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {softwareComparison.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
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
              Real feedback from businesses using StockFlow among other softwares for inventory management.
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
            Choose the Best Softwares for Inventory Management
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow as their core inventory management software.
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
            <p className="text-lg text-gray-600">Everything you need to know about softwares for inventory management</p>
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
            The best softwares for inventory management. Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Softwares for inventory management solutions.
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
                "name": "StockFlow - Best Softwares for Inventory Management",
                "description": "Discover the best softwares for inventory management. Compare options, features, and find the perfect solution for your business.",
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
                  "@id": "https://www.stockflow.be/softwares-for-inventory-management"
                },
                "featureList": [
                  "Multiple software options",
                  "Modular approach",
                  "Barcode integration",
                  "Unified reporting",
                  "Cross-platform access",
                  "Cloud integration"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}
