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
  TrendingUp,
  Package,
  Factory
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';

export default function RawMaterialsInventory() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What are raw materials?",
      answer: "Raw materials are the basic materials used in manufacturing and production processes. They are the unprocessed inputs that are transformed into finished goods. Examples include metals, plastics, wood, chemicals, fabrics, and components that manufacturers purchase and use to create products."
    },
    {
      question: "How do you manage raw materials inventory?",
      answer: "Raw materials inventory is managed by tracking quantities, monitoring usage rates, setting reorder points, maintaining supplier relationships, ensuring quality standards, and optimizing stock levels to balance production needs with carrying costs. Inventory management software like StockFlow helps automate raw materials tracking and reordering."
    },
    {
      question: "Why is raw materials inventory management important?",
      answer: "Raw materials inventory management is crucial because it ensures production continuity, prevents production delays, optimizes cash flow, reduces waste, maintains quality control, and helps manage supplier relationships. Poor raw materials management can lead to production stoppages, excess inventory costs, or quality issues."
    },
    {
      question: "What is the difference between raw materials and finished goods inventory?",
      answer: "Raw materials are unprocessed inputs used in production, while finished goods are completed products ready for sale. Raw materials inventory requires tracking for production planning and supplier management, while finished goods inventory focuses on sales forecasting and customer demand."
    },
    {
      question: "How can inventory management software help with raw materials?",
      answer: "Inventory management software like StockFlow helps with raw materials by providing real-time tracking, automated reorder points, supplier management, quality control tracking, production planning integration, cost analysis, and alerts when raw materials reach minimum levels. This ensures production continuity and cost optimization."
    },
    {
      question: "What are the challenges of managing raw materials inventory?",
      answer: "Challenges include: fluctuating supplier lead times, quality variations, price volatility, storage requirements, perishability, minimum order quantities, supplier reliability, and balancing stock levels between production needs and carrying costs. Proper inventory management software helps address these challenges."
    },
    {
      question: "How do you calculate raw materials inventory value?",
      answer: "Raw materials inventory value is calculated by multiplying the quantity of each raw material by its cost per unit. Costs typically include purchase price, shipping, handling, and any processing costs. Inventory management software automatically tracks and calculates raw materials inventory values based on your purchase records."
    },
    {
      question: "Can raw materials inventory be managed with cloud software?",
      answer: "Yes, cloud-based inventory management software like StockFlow is ideal for managing raw materials inventory. It provides real-time access from anywhere, automatic backups, supplier integration, and scalable features that grow with your manufacturing operations."
    }
  ];

  const features = [
    {
      icon: Package,
      title: "Raw Materials Tracking",
      description: "Track all raw materials in real-time, monitor quantities, locations, and usage rates across your production facilities."
    },
    {
      icon: Factory,
      title: "Production Integration",
      description: "Integrate raw materials inventory with production planning to ensure materials are available when needed for manufacturing."
    },
    {
      icon: TrendingUp,
      title: "Usage Analytics",
      description: "Analyze raw materials consumption patterns to optimize ordering, reduce waste, and improve production planning."
    },
    {
      icon: Zap,
      title: "Automated Reordering",
      description: "Set up automated reorder points for raw materials based on production schedules and supplier lead times."
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Manage relationships with multiple raw materials suppliers, track performance, and optimize sourcing decisions."
    },
    {
      icon: BarChart3,
      title: "Cost Analysis",
      description: "Track raw materials costs, analyze price trends, and optimize purchasing decisions to reduce production costs."
    }
  ];

  const benefits = [
    "Ensure production continuity with adequate raw materials",
    "Reduce raw materials carrying costs",
    "Optimize purchasing decisions based on usage",
    "Improve supplier relationships and negotiations",
    "Prevent production delays from material shortages",
    "Reduce waste and obsolescence",
    "Maintain quality control standards",
    "Scale production efficiently"
  ];

  const useCases = [
    {
      title: "Manufacturing",
      description: "Manage raw materials for production lines, ensuring materials are available when needed for manufacturing processes.",
      icon: "🏭"
    },
    {
      title: "Food Production",
      description: "Track perishable raw materials, manage expiration dates, and ensure food safety compliance.",
      icon: "🍞"
    },
    {
      title: "Textile Industry",
      description: "Manage fabric, yarn, and other textile raw materials across multiple production stages.",
      icon: "🧵"
    },
    {
      title: "Electronics",
      description: "Track components, chips, and electronic raw materials for complex manufacturing processes.",
      icon: "🔌"
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      role: "Production Manager, Global Manufacturing",
      content: "StockFlow's raw materials inventory management transformed our production planning. We can now ensure materials are always available when needed, reducing production delays by 90%.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Operations Director, TechSupply Co",
      content: "Managing raw materials inventory with StockFlow is so much easier. The automated reordering and supplier management features help us maintain optimal stock levels without excess inventory.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "CEO, Fashion Forward",
      content: "The raw materials tracking features are excellent. We can see exactly what materials we have, where they are, and when we need to reorder. This has improved our production efficiency significantly.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What are Raw Materials?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'use-cases', title: 'Use Cases', level: 1 },
    { id: 'testimonials', title: 'What Users Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Raw Materials Inventory"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Raw Materials Inventory Management 2025 | Track & Manage Raw Materials | StockFlow"
        description="Complete guide to raw materials inventory management. Track raw materials, optimize production planning, manage suppliers, and reduce costs. Free inventory management software for raw materials."
        keywords="raw materials, raw materials inventory, raw materials management, raw materials tracking, raw materials inventory management, raw materials inventory system, raw materials inventory software, raw materials tracking software, raw materials management system, raw materials inventory control, raw materials warehouse, raw materials storage, raw materials planning, raw materials procurement, raw materials cost, stockflow, stock flow"
        url="https://www.stockflow.be/raw-materials-inventory"
      />

      <SeoPageHero
        title="Raw Materials Inventory Management: Track & Optimize Your Raw Materials"
        description="Complete guide to raw materials inventory management. Track raw materials in real-time, optimize production planning, manage suppliers efficiently, and reduce costs. Free inventory management software included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 for Manufacturing", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "500+ Manufacturers", variant: 'info' }
        ]}
        ctaText="Start Managing Raw Materials Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      {/* What Is Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What are <span className="text-blue-600">Raw Materials</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Raw materials are the basic, unprocessed inputs used in manufacturing and production processes. Effective raw materials inventory management is essential for production continuity, cost control, and operational efficiency.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Types of Raw Materials</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Direct Materials:</strong> Materials directly used in finished products (e.g., metals, plastics, fabrics)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Indirect Materials:</strong> Materials used in production but not part of finished products (e.g., lubricants, cleaning supplies)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Components:</strong> Semi-finished parts used in assembly (e.g., circuit boards, fasteners)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Consumables:</strong> Materials consumed during production (e.g., chemicals, solvents)</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Why Raw Materials Management Matters</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Ensures production continuity</li>
                <li>✓ Prevents production delays</li>
                <li>✓ Optimizes cash flow</li>
                <li>✓ Reduces waste and obsolescence</li>
                <li>✓ Maintains quality standards</li>
                <li>✓ Improves supplier relationships</li>
                <li>✓ Controls production costs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Raw Materials Inventory <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow provides comprehensive tools for managing raw materials inventory effectively.
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
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Raw Materials Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why effective raw materials inventory management is essential for manufacturing success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
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
      <section id="use-cases" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for All Types of <span className="text-blue-600">Manufacturing</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Raw materials inventory management benefits manufacturers across industries.
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Manufacturers Say About <span className="text-blue-600">Raw Materials Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from manufacturers using StockFlow for raw materials inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
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
            Start Managing Raw Materials Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of manufacturers using StockFlow to manage raw materials inventory efficiently.
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
              Free raw materials tracking
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about raw materials inventory management</p>
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
          "@id": "https://www.stockflow.be/raw-materials-inventory",
          "name": "Raw Materials Inventory Management 2025",
          "description": "Complete guide to raw materials inventory management. Track raw materials, optimize production planning, and reduce costs.",
          "url": "https://www.stockflow.be/raw-materials-inventory",
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
                "name": "Raw Materials Inventory",
                "item": "https://www.stockflow.be/raw-materials-inventory"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Raw Materials Inventory Management",
          "description": "Raw materials inventory management software for manufacturers. Track raw materials, optimize production planning, and manage suppliers.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Raw Materials Inventory Management",
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
            "@id": "https://www.stockflow.be/raw-materials-inventory"
          },
          "featureList": [
            "Raw materials tracking",
            "Production integration",
            "Supplier management",
            "Automated reordering",
            "Cost analysis",
            "Usage analytics"
          ]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow Raw Materials Inventory Management"
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

