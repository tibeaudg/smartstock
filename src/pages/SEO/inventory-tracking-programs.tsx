import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { SeoPageHero } from '../../components/seo/SeoPageHero';
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
  TrendingUp,
  Monitor
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';

export default function InventoryTrackingPrograms() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What are inventory tracking programs?",
      answer: "Inventory tracking programs are software applications designed to monitor, track, and manage inventory levels, stock movements, and product information in real-time. These programs help businesses maintain accurate inventory records, prevent stockouts, reduce overstocking, and streamline inventory operations."
    },
    {
      question: "What features do inventory tracking programs have?",
      answer: "The best inventory tracking programs include real-time inventory monitoring, barcode scanning, automated reorder alerts, multi-location tracking, reporting and analytics, batch processing, supplier management, and integration with other business systems. StockFlow includes all these features and more."
    },
    {
      question: "How do inventory tracking programs work?",
      answer: "Inventory tracking programs work by maintaining a central database of all inventory items, tracking stock movements (receipts, sales, transfers), calculating current stock levels in real-time, and providing alerts when inventory reaches reorder points. Users can access the system via web browser or mobile app to view and update inventory."
    },
    {
      question: "Are inventory tracking programs cloud-based?",
      answer: "Modern inventory tracking programs like StockFlow are cloud-based, meaning they're accessible from any device with an internet connection. This allows real-time synchronization across multiple users and locations, automatic backups, and no need for on-premise servers or IT infrastructure."
    },
    {
      question: "Can inventory tracking programs integrate with other systems?",
      answer: "Yes, most inventory tracking programs can integrate with accounting software, e-commerce platforms, POS systems, shipping providers, and other business tools. StockFlow offers API access and integrations to connect with your existing business systems."
    },
    {
      question: "How much do inventory tracking programs cost?",
      answer: "Inventory tracking program costs vary widely. Enterprise solutions can cost thousands per month, while StockFlow offers a free plan for small businesses and affordable pay-as-you-grow pricing starting at €0.004 per product per month. Most programs offer free trials to test before committing."
    },
    {
      question: "What is the best inventory tracking program for small businesses?",
      answer: "StockFlow is ideal for small businesses because it offers a free plan, easy setup, intuitive interface, mobile access, and all essential inventory tracking features. It scales as your business grows without requiring expensive upgrades or complex implementations."
    },
    {
      question: "Do inventory tracking programs require training?",
      answer: "Good inventory tracking programs like StockFlow are designed to be intuitive and user-friendly, requiring minimal training. Most users can start tracking inventory within minutes. StockFlow provides helpful guides and 24/7 support to help you get started quickly."
    }
  ];

  const features = [
    {
      icon: Monitor,
      title: "Real-Time Tracking",
      description: "Monitor inventory levels in real-time across all locations. See stock updates instantly as items are received, sold, or transferred."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan barcodes with your smartphone to quickly update inventory. No special hardware required - works with any mobile device."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Get automatic notifications when inventory reaches reorder points, preventing stockouts and ensuring you always have the right stock levels."
    },
    {
      icon: BarChart3,
      title: "Reporting & Analytics",
      description: "Generate detailed reports on inventory levels, sales trends, turnover rates, and more. Make data-driven decisions about your inventory."
    },
    {
      icon: Database,
      title: "Multi-Location Support",
      description: "Track inventory across multiple warehouses, stores, or locations. See stock levels at each location and transfer items between locations."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your inventory data is securely stored in the cloud with automatic backups, SSL encryption, and GDPR compliance."
    }
  ];

  const benefits = [
    "Prevent stockouts and lost sales",
    "Reduce overstocking and carrying costs",
    "Improve inventory accuracy",
    "Save time on manual tracking",
    "Make data-driven purchasing decisions",
    "Scale operations efficiently",
    "Access inventory from anywhere",
    "Integrate with existing systems"
  ];

  const useCases = [
    {
      title: "Retail Stores",
      description: "Track inventory across multiple store locations, manage stock levels, and prevent stockouts during peak seasons.",
      icon: "🏪"
    },
    {
      title: "E-commerce",
      description: "Sync inventory across online channels, manage fulfillment, and prevent overselling with real-time stock tracking.",
      icon: "🛒"
    },
    {
      title: "Warehouses",
      description: "Manage large inventories, track stock movements, optimize space utilization, and streamline picking and packing.",
      icon: "📦"
    },
    {
      title: "Manufacturing",
      description: "Track raw materials, work-in-progress, and finished goods across production stages and multiple locations.",
      icon: "🏭"
    },
    {
      title: "Wholesale & Distribution",
      description: "Handle bulk inventory, manage multiple warehouses, track supplier deliveries, and optimize inventory turnover.",
      icon: "🚚"
    },
    {
      title: "Small Business",
      description: "Start tracking inventory affordably with a free plan, scale as you grow, and maintain accurate stock records.",
      icon: "💼"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Adams",
      role: "Store Manager, Retail Plus",
      content: "StockFlow is the best inventory tracking program we've used. Real-time updates across all our locations help us prevent stockouts and reduce excess inventory. The mobile app makes it so easy to track inventory on the go.",
      rating: 5
    },
    {
      name: "Robert Kim",
      role: "Operations Manager, TechSupply Co",
      content: "We switched from spreadsheets to StockFlow and it transformed our inventory tracking. The automated alerts and barcode scanning save us hours every week. Highly recommend this inventory tracking program.",
      rating: 5
    },
    {
      name: "Amanda Foster",
      role: "Owner, Fashion Forward",
      content: "As a small business, we needed an affordable inventory tracking program. StockFlow's free plan was perfect to start, and we've grown with it. The reporting features help us make better purchasing decisions.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'use-cases', title: 'Use Cases', level: 1 },
    { id: 'testimonials', title: 'What Users Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Inventory Tracking Programs"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Inventory Tracking Programs 2025 | Best Inventory Tracking Software | StockFlow"
        description="Best inventory tracking programs for businesses of all sizes. Real-time inventory tracking, barcode scanning, automated alerts. Free plan available - no credit card required. Start tracking inventory today!"
        keywords="inventory tracking programs, inventory tracking software, inventory tracking program, inventory tracking system, inventory tracking app, inventory tracking solution, inventory tracking platform, inventory tracking tool, inventory tracking software free, inventory tracking program free, best inventory tracking program, inventory tracking software for small business, inventory tracking software online, cloud inventory tracking, inventory tracking software comparison, inventory tracking software reviews, inventory tracking software features, inventory tracking software cost, stockflow, stock flow"
        url="https://www.stockflow.be/inventory-tracking-programs"
      />

      <SeoPageHero
        title="Inventory Tracking Programs: Best Inventory Tracking Software 2025"
        description="Find the best inventory tracking programs for your business. Real-time tracking, barcode scanning, automated alerts, and multi-location support. Free plan available. Start tracking inventory today!"
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 Inventory Tracking", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Tracking Inventory Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inventory Tracking Program <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need in an inventory tracking program to manage your stock effectively.
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
              Benefits of <span className="text-blue-600">Inventory Tracking Programs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why businesses choose inventory tracking programs to manage their stock.
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
              Perfect for All Types of <span className="text-blue-600">Businesses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you run a retail store, e-commerce business, warehouse, or manufacturing facility, inventory tracking programs help you manage stock efficiently.
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
              What Users Say About <span className="text-blue-600">Inventory Tracking Programs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using StockFlow as their inventory tracking program.
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
            Start Tracking Inventory Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of businesses using StockFlow as their inventory tracking program.
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
              Free plan available
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Start in 5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about inventory tracking programs</p>
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
          "@id": "https://www.stockflow.be/inventory-tracking-programs",
          "name": "Inventory Tracking Programs 2025",
          "description": "Best inventory tracking programs for businesses of all sizes. Real-time inventory tracking, barcode scanning, automated alerts. Free plan available.",
          "url": "https://www.stockflow.be/inventory-tracking-programs",
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
                "name": "Inventory Tracking Programs",
                "item": "https://www.stockflow.be/inventory-tracking-programs"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Inventory Tracking Program",
          "description": "Best inventory tracking program for businesses of all sizes. Real-time inventory tracking, barcode scanning, automated alerts, and multi-location support.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Tracking Program",
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
            "ratingCount": "1000",
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
            "@id": "https://www.stockflow.be/inventory-tracking-programs"
          },
          "featureList": [
            "Real-time inventory tracking",
            "Barcode scanning",
            "Automated alerts",
            "Multi-location support",
            "Reporting and analytics",
            "Mobile access"
          ]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow Inventory Tracking Program"
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

