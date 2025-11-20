import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Trophy,
  Database,
  Package,
  Truck,
  TrendingUp
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';

export default function WholesalerInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is wholesaler inventory management?",
      answer: "Wholesaler inventory management is a specialized system for managing large volumes of products, tracking stock across multiple warehouses, handling bulk orders, managing supplier relationships, and optimizing inventory turnover. It's designed for businesses that buy and sell products in large quantities to retailers and other businesses."
    },
    {
      question: "Why do wholesalers and distributors need inventory management software?",
      answer: "Wholesalers and distributors need inventory management software to handle high-volume transactions, manage multiple warehouses, track inventory across locations, optimize stock levels, prevent stockouts, reduce carrying costs, manage supplier relationships, and streamline order fulfillment processes."
    },
    {
      question: "What features should wholesaler inventory management software have?",
      answer: "The best wholesaler inventory management software should include multi-warehouse support, bulk order processing, advanced reporting and analytics, supplier management, purchase order management, automated reorder points, inventory turnover tracking, batch processing, and integration with accounting and shipping systems."
    },
    {
      question: "How does wholesaler inventory management differ from retail inventory management?",
      answer: "Wholesaler inventory management handles much larger volumes, focuses on bulk transactions, manages multiple warehouses, tracks supplier relationships, processes large purchase orders, and optimizes inventory turnover rates. Retail inventory management typically focuses on individual store locations and smaller quantities."
    },
    {
      question: "Can wholesaler inventory software track inventory across multiple warehouses?",
      answer: "Yes, StockFlow supports multi-warehouse inventory management, allowing wholesalers and distributors to track inventory across unlimited warehouse locations. You can see stock levels at each location, transfer inventory between warehouses, and get real-time visibility into all your inventory."
    },
    {
      question: "How do wholesalers and distributors optimize inventory turnover?",
      answer: "Wholesalers and distributors optimize inventory turnover by tracking sales velocity, setting automated reorder points, analyzing demand patterns, reducing slow-moving inventory, improving forecasting accuracy, and using inventory management software to identify trends and make data-driven purchasing decisions."
    },
    {
      question: "Is there inventory management software specifically for wholesalers and distributors?",
      answer: "Yes, StockFlow offers specialized features for wholesalers and distributors including bulk order processing, multi-warehouse management, supplier management, advanced analytics, and inventory turnover tracking. The software scales from small distributors to large wholesale operations."
    },
    {
      question: "How can wholesaler inventory management reduce costs?",
      answer: "Wholesaler inventory management reduces costs by preventing overstocking and understocking, optimizing inventory turnover, reducing carrying costs, minimizing waste and obsolescence, improving supplier negotiations with better data, and automating manual processes to save labor costs."
    }
  ];

  const features = [
    {
      icon: Package,
      title: "Multi-Warehouse Management",
      description: "Track inventory across multiple warehouses and distribution centers with real-time visibility into stock levels at each location."
    },
    {
      icon: TrendingUp,
      title: "Inventory Turnover Tracking",
      description: "Monitor inventory turnover rates, identify slow-moving stock, and optimize purchasing decisions based on sales velocity."
    },
    {
      icon: Truck,
      title: "Bulk Order Processing",
      description: "Handle large volume orders efficiently with batch processing, automated fulfillment, and streamlined order management."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into sales trends, demand forecasting, supplier performance, and inventory optimization opportunities."
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Manage relationships with multiple suppliers, track purchase orders, and optimize supplier performance and pricing."
    },
    {
      icon: Zap,
      title: "Automated Reordering",
      description: "Set up automated reorder points based on sales velocity, lead times, and demand forecasts to prevent stockouts."
    }
  ];

  const benefits = [
    "Reduce inventory carrying costs by up to 30%",
    "Improve inventory turnover rates",
    "Prevent stockouts and lost sales",
    "Optimize warehouse space utilization",
    "Streamline bulk order processing",
    "Better supplier relationship management",
    "Reduce manual errors and improve accuracy",
    "Scale operations efficiently"
  ];

  const useCases = [
    {
      title: "Wholesale Distributors",
      description: "Manage large volumes of products across multiple warehouses, track inventory turnover, and optimize stock levels.",
      icon: "📦"
    },
    {
      title: "B2B Wholesalers",
      description: "Handle bulk orders from retailers and businesses, manage supplier relationships, and track order fulfillment.",
      icon: "🏢"
    },
    {
      title: "Wholesaler and Distributor Networks",
      description: "Manage inventory across distributor networks, track transfers between locations, and maintain centralized control.",
      icon: "🌐"
    },
    {
      title: "Import/Export Wholesalers",
      description: "Track inventory from suppliers through warehouses to customers, manage customs documentation, and optimize logistics.",
      icon: "🚢"
    },
    {
      title: "Regional Distributors",
      description: "Manage inventory across regional warehouses, optimize stock allocation, and ensure products are available where needed.",
      icon: "🗺️"
    },
    {
      title: "Specialty Wholesalers",
      description: "Manage specialized product lines, track compliance requirements, and maintain detailed inventory records for regulatory purposes.",
      icon: "?"
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      role: "Operations Director, Global Wholesale Solutions",
      content: "StockFlow transformed our wholesale operations. We can now track inventory across 5 warehouses in real-time, and our inventory turnover improved by 25% in the first quarter.",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Inventory Manager, Premium Distributors",
      content: "As a wholesaler and distributor, we needed software that could handle bulk orders and multiple warehouses. StockFlow delivers exactly what we need, and the supplier management features are excellent.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "CEO, Regional Wholesale Network",
      content: "The multi-warehouse tracking and inventory turnover analytics help us optimize stock levels across all our distribution centers. We've reduced carrying costs significantly.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'use-cases', title: 'Use Cases', level: 1 },
    { id: 'testimonials', title: 'What Wholesalers Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Wholesaler Inventory Management"
      
      
    >
      <SEO
        title="Wholesaler Inventory Management 2025 - Wholesaler Invento..."
        description="Read the guide wholesaler inventory management to save time and money. Read the guide wholesaler inventory management to optimize your inventory. Try free now."
        keywords="wholesaler inventory management, wholesaler inventory software, distributor inventory management, wholesaler inventory system, distributor inventory software, wholesaler and distributor, distributors and wholesalers, wholesale inventory management, distributor inventory system, wholesaler inventory app, distributor inventory app, wholesale inventory software, distributor inventory solution, wholesaler inventory platform, wholesale inventory tracking, distributor inventory tracking, wholesaler stock management, distributor stock management, wholesale inventory control, distributor inventory control, stockflow, stock flow"
        url="https://www.stockflow.be/wholesaler-inventory-management"
      />      <SeoPageHero
        title="Wholesaler Inventory Management: For Distributors and Wholesalers"
        description="The best wholesaler inventory management software for distributors and wholesalers. Manage inventory across multiple warehouses, optimize inventory turnover, process bulk orders, and streamline operations. Start free today!"
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 for Wholesalers", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "500+ Wholesalers", variant: 'info' }
        ]}
        ctaText="Start Free Trial - No Credit Card"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Wholesaler Inventory Management <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything wholesalers and distributors need to manage inventory efficiently across multiple warehouses.
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
              Benefits for <span className="text-blue-600">Wholesalers and Distributors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how wholesaler inventory management software helps distributors optimize operations and reduce costs.
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
              Perfect for All Types of <span className="text-blue-600">Wholesalers and Distributors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're a regional distributor, B2B wholesaler, or part of a distribution network, StockFlow helps you manage inventory efficiently.
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
              What <span className="text-blue-600">Wholesalers and Distributors</span> Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from wholesalers and distributors using StockFlow for inventory management.
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
            Start Managing Your Wholesaler Inventory Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of wholesalers and distributors who use StockFlow to manage inventory across multiple warehouses.
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
              Multi-warehouse support
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
            <p className="text-lg text-gray-600">Everything you need to know about wholesaler inventory management</p>
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
          "@id": "https://www.stockflow.be/wholesaler-inventory-management",
          "name": "Wholesaler Inventory Management Software 2025",
          "description": "Best wholesaler inventory management software for distributors and wholesalers. Manage inventory across multiple warehouses, optimize turnover, and process bulk orders.",
          "url": "https://www.stockflow.be/wholesaler-inventory-management",
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
                "name": "Wholesaler Inventory Management",
                "item": "https://www.stockflow.be/wholesaler-inventory-management"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Wholesaler Inventory Management",
          "description": "Wholesaler inventory management software for distributors and wholesalers. Manage inventory across multiple warehouses, optimize turnover, and process bulk orders.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Wholesaler Inventory Management Software",
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
            "@id": "https://www.stockflow.be/wholesaler-inventory-management"
          },
          "featureList": [
            "Multi-warehouse inventory tracking",
            "Bulk order processing",
            "Inventory turnover tracking",
            "Supplier management",
            "Advanced analytics",
            "Automated reordering"
          ]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow Wholesaler Inventory Management"
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



