import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { StructuredData } from '@/components/StructuredData';

export default function ContractorInventoryManagement() {
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is contractor inventory management?",
      answer: "Contractor inventory management is a specialized system for tracking tools, equipment, materials, and supplies used in construction, renovation, and maintenance projects. It helps contractors manage inventory across multiple job sites, track tool usage, prevent equipment loss, and optimize material ordering."
    },
    {
      question: "Why do contractors need inventory management software?",
      answer: "Contractors need inventory management software to track expensive tools and equipment across multiple job sites, prevent theft and loss, manage material costs, ensure the right supplies are available when needed, and maintain accurate records for project billing and tax purposes."
    },
    {
      question: "What features should contractor inventory management software have?",
      answer: "The best contractor inventory management software should include multi-location tracking, mobile barcode scanning, equipment maintenance scheduling, tool checkout/check-in, project-based inventory allocation, material cost tracking, and integration with accounting systems for project billing."
    },
    {
      question: "Can contractor inventory management software track tools and equipment?",
      answer: "Yes, modern contractor inventory management software like StockFlow can track tools, equipment, materials, and supplies. You can assign items to specific job sites, track who has checked out tools, set up maintenance reminders, and monitor equipment usage across all your projects."
    },
    {
      question: "How does contractor inventory management help with project costs?",
      answer: "Contractor inventory management helps control project costs by tracking material usage per project, preventing over-ordering, identifying cost overruns early, optimizing tool utilization, reducing equipment rental costs, and ensuring accurate project billing."
    },
    {
      question: "Is there a free contractor inventory management solution?",
      answer: "Yes, StockFlow offers a free plan for contractors with up to 100 items. This allows you to track tools, equipment, and materials across multiple job sites without any upfront costs. Perfect for small contracting businesses getting started."
    },
    {
      question: "Can contractor inventory software work across multiple job sites?",
      answer: "Yes, StockFlow supports multi-location inventory management, allowing contractors to track inventory across unlimited job sites. You can see what tools and materials are at each location, transfer items between sites, and get real-time visibility into all your project inventory."
    },
    {
      question: "How do contractors prevent tool theft with inventory management?",
      answer: "Contractor inventory management software helps prevent tool theft by maintaining detailed records of who checked out which tools, when they were checked out, and when they should be returned. Regular inventory audits, tool checkout tracking, and automated reminders help ensure accountability and reduce loss."
    }
  ];

  const features = [
    {
      icon: Building,
      title: "Multi-Site Management",
      description: "Track tools, equipment, and materials across unlimited job sites with real-time visibility into what's where."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan tools and equipment with your smartphone to quickly check items in and out, reducing manual errors."
    },
    {
      icon: Wrench,
      title: "Tool Checkout System",
      description: "Track who has which tools, when they were checked out, and when they're due back. Prevent equipment loss."
    },
    {
      icon: BarChart3,
      title: "Project Cost Tracking",
      description: "Allocate materials and equipment to specific projects for accurate job costing and client billing."
    },
    {
      icon: Shield,
      title: "Equipment Maintenance",
      description: "Schedule maintenance reminders for tools and equipment to extend their lifespan and prevent breakdowns."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Get notified when tools aren't returned on time, materials are running low, or equipment needs maintenance."
    }
  ];

  const benefits = [
    "Reduce tool and equipment loss by up to 60%",
    "Save 10+ hours per week on inventory tracking",
    "Improve project profitability with accurate cost tracking",
    "Prevent material waste and over-ordering",
    "Ensure tools are available when needed",
    "Streamline project billing with itemized costs",
    "Maintain compliance with equipment records",
    "Scale your contracting business efficiently"
  ];

  const useCases = [
    {
      title: "General Contractors",
      description: "Manage materials, tools, and equipment across multiple construction projects simultaneously.",
      icon: "🏗️"
    },
    {
      title: "Electrical Contractors",
      description: "Track electrical supplies, tools, and equipment across residential and commercial job sites.",
      icon: "?"
    },
    {
      title: "Plumbing Contractors",
      description: "Manage plumbing supplies, parts, and specialized tools for service and installation projects.",
      icon: "🔧"
    },
    {
      title: "HVAC Contractors",
      description: "Track HVAC equipment, parts, and tools for installation and maintenance services.",
      icon: "??"
    },
    {
      title: "Landscaping Contractors",
      description: "Manage equipment, supplies, and materials for landscaping and outdoor construction projects.",
      icon: "🌳"
    },
    {
      title: "Renovation Contractors",
      description: "Track materials, tools, and equipment for home renovation and remodeling projects.",
      icon: "🏠"
    }
  ];

  const testimonials = [
    {
      name: "Mike Johnson",
      role: "Owner, MJ Construction",
      content: "StockFlow transformed how we track tools and materials. We went from losing $500+ in tools per month to zero. The multi-site tracking is a game-changer.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Operations Manager, Premier Electric",
      content: "Being able to see what tools are at which job site in real-time has saved us countless hours. The barcode scanning makes checkouts so much faster.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Project Manager, Coastal Plumbing",
      content: "The project cost tracking feature helps us bill clients accurately and identify cost overruns early. It's paid for itself in the first month.",
      rating: 5
    }
  ];

  return (
    <SeoPageLayout 
      title="Contractor Inventory Management"
      heroTitle="Contractor Inventory Management"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Contractor Inventory Management 2025 - Contractor Invento..."
        description="Read the guide contractor inventory management to optimize your inventory management. Read the guide contractor inventory management to automate your process..."
        keywords="contractor inventory management, contractor inventory software, construction inventory management, tool tracking software, equipment inventory management, contractor inventory system, construction inventory software, tool management software, contractor equipment tracking, construction inventory tracking, contractor inventory app, construction tool tracking, contractor material management, contractor inventory solution, contractor inventory platform, construction equipment management, contractor inventory control, construction inventory app, contractor tool management, construction material tracking, stockflow, stock flow"
        url="https://www.stockflow.be/contractor-inventory-management"
      />

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Contractor Inventory Management <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage tools, equipment, and materials across all your job sites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of Contractor Inventory Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how contractor inventory management software helps construction businesses save time and money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
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
      <section id="use-cases" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for All Types of <span className="text-blue-600">Contractors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're a general contractor, electrician, plumber, or specialize in HVAC or landscaping, StockFlow helps you manage your inventory efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What <span className="text-blue-600">Contractors Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from contractors using StockFlow for inventory management.
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
            Start Managing Your Contractor Inventory Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of contractors who use StockFlow to track tools, equipment, and materials across all their job sites.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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
              Free plan available
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about contractor inventory management</p>
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
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/contractor-inventory-management",
          "name": "Contractor Inventory Management Software 2025",
          "description": "Best contractor inventory management software for tracking tools, equipment, and materials across multiple job sites. Prevent tool loss, optimize costs, and streamline project billing.",
          "url": "https://www.stockflow.be/contractor-inventory-management",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "datePublished": "2024-01-15",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/Inventory-Management.png"
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
                "name": "Contractor Inventory Management",
                "item": "https://www.stockflow.be/contractor-inventory-management"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Contractor Inventory Management",
          "description": "Contractor inventory management software for tracking tools, equipment, and materials across multiple job sites. Prevent tool loss, optimize costs, and streamline project billing.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Contractor Inventory Management Software",
          "operatingSystem": "Web Browser",
          "softwareVersion": "2.0",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 items",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "500",
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Organization",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
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
            "@id": "https://www.stockflow.be/contractor-inventory-management"
          },
          "featureList": [
            "Multi-site inventory tracking",
            "Tool checkout/check-in system",
            "Barcode scanning",
            "Equipment maintenance scheduling",
            "Project cost tracking",
            "Material allocation"
          ]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow Contractor Inventory Management"
          },
          "author": {
            "@type": "Person",
            "name": testimonial.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": testimonial.content
        }))
      ]} />
    </SeoPageLayout>
  );
}



