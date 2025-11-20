import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  Zap,
  Shield,
  Package,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventorySystemForSmallBusiness() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is the best inventory system for small business?",
      answer: "The best inventory system for small business is one that is affordable, easy to use, scalable, and includes essential features like real-time tracking, barcode scanning, automated alerts, and mobile access. StockFlow offers a free plan perfect for small businesses, with pay-as-you-grow pricing that scales with your business."
    },
    {
      question: "Do small businesses need inventory management software?",
      answer: "Yes, small businesses benefit significantly from inventory management software. It helps prevent stockouts, reduce overstocking, save time on manual tracking, improve cash flow, and scale operations. Even small businesses with limited products can benefit from organized inventory management."
    },
    {
      question: "How much does an inventory system for small business cost?",
      answer: "Inventory systems for small businesses vary in cost. StockFlow offers a free plan for small businesses with up to 100 products, making it accessible for startups and small operations. Premium plans start at affordable pay-as-you-grow pricing (€0.004 per product/month), much cheaper than enterprise solutions."
    },
    {
      question: "What features should an inventory system for small business have?",
      answer: "An inventory system for small business should include: real-time inventory tracking, barcode scanning, automated low stock alerts, mobile access, basic reporting, multi-user support, and easy setup. StockFlow includes all these features in its free plan, perfect for small businesses."
    },
    {
      question: "Can small businesses use cloud-based inventory systems?",
      answer: "Yes, cloud-based inventory systems like StockFlow are ideal for small businesses. They require no IT infrastructure, are accessible from anywhere, provide automatic backups, and scale as your business grows. Cloud systems are typically more affordable than on-premise solutions."
    },
    {
      question: "How long does it take to set up an inventory system for small business?",
      answer: "Setting up an inventory system for small business can take as little as 5 minutes with StockFlow. Simply create an account, add your products, and start tracking. No complex installations or training required. The intuitive interface makes it easy for small business owners to get started quickly."
    }
  ];

  const features = [
    {
      icon: Package,
      title: "Real-Time Tracking",
      description: "Track inventory levels in real-time across all your products. Always know what you have in stock."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Get automatic notifications when stock runs low, helping you reorder before running out."
    },
    {
      icon: Shield,
      title: "Free Plan Available",
      description: "Start with our free plan for up to 100 products. Perfect for small businesses getting started."
    },
    {
      icon: TrendingUp,
      title: "Grows With You",
      description: "Scalable pricing means you only pay for what you need as your business grows."
    }
  ];

  const benefits = [
    "Start free with up to 100 products",
    "No complex setup or training needed",
    "Access inventory from anywhere with mobile app",
    "Prevent stockouts and lost sales",
    "Reduce overstocking and waste",
    "Save time on manual tracking",
    "Improve cash flow management",
    "Scale as your business grows"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Owner, Local Gift Shop",
      content: "StockFlow is the perfect inventory system for small business. We started with the free plan and it's been a game-changer. No more spreadsheets or guessing what we have in stock!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Founder, Tech Accessories Store",
      content: "As a small business, we needed an affordable inventory system. StockFlow's free plan was perfect to start, and we've grown with it. The mobile app is so convenient.",
      rating: 5
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'testimonials', title: 'What Small Businesses Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Inventory System for Small Business"
      
      
    >
      <SEO
        title="Inventory System For Small Business 2025"
        description="Read the guide inventory system for small business to automate your processes. Read the guide inventory system for small business to save. Get started free."
        keywords="inventory system for small business, inventory management software small business, inventory management software for small business, inventory management software for small businesses, inventory management system small business, inventory tracking software for small business, stock management software for small business, inventory programs for small business, small business inventory system, inventory system small business, inventory management for small business, inventory software for small business, small business inventory software, inventory system for small companies, small business inventory management, inventory tracking for small business, small business inventory app, stockflow, stock flow"
        url="https://www.stockflow.be/inventory-system-for-small-business"
      />      <SeoPageHero
        title="Inventory System for Small Business: Free & Easy to Use"
        description="The best inventory system for small business. Free plan available for up to 100 products. Real-time tracking, automated alerts, mobile access. Perfect for small businesses. Start free today!"
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Free Plan Available", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Small Businesses", variant: 'info' }
        ]}
        ctaText="Start Free - No Credit Card"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inventory System for Small Business <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything small businesses need in an inventory system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <section id="benefits" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits for <span className="text-blue-600">Small Businesses</span>
            </h2>
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

      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What <span className="text-blue-600">Small Businesses</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Small Business Inventory System Today
          </h2>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
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
        }
      ]} />
    </SeoPageLayout>
  );
}



