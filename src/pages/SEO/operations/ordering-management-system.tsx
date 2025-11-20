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
  ShoppingCart,
  Package,
  Zap,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function OrderingManagementSystem() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is an ordering management system?",
      answer: "An ordering management system is software that manages the process of ordering inventory, including purchase order creation, supplier communication, order tracking, receiving, and inventory updates. It automates the ordering process to ensure adequate stock levels while minimizing excess inventory."
    },
    {
      question: "What is an inventory ordering system?",
      answer: "An inventory ordering system is a software solution that automates the process of ordering inventory based on stock levels, sales forecasts, and reorder points. It helps businesses maintain optimal inventory levels by automatically generating purchase orders when inventory reaches minimum thresholds."
    },
    {
      question: "What is a stock ordering system?",
      answer: "A stock ordering system manages the ordering of stock to maintain adequate inventory levels. It tracks stock levels, calculates reorder points, generates purchase orders, and coordinates with suppliers to ensure timely stock replenishment. Stock ordering systems prevent stockouts while avoiding overstocking."
    },
    {
      question: "How does an ordering management system work?",
      answer: "An ordering management system works by: 1) Monitoring inventory levels in real-time, 2) Calculating when to reorder based on sales velocity and lead times, 3) Automatically generating purchase orders when reorder points are reached, 4) Tracking order status with suppliers, 5) Receiving and processing orders, 6) Updating inventory levels automatically. StockFlow provides all these capabilities."
    },
    {
      question: "What are the benefits of an ordering management system?",
      answer: "Benefits include: preventing stockouts, reducing excess inventory, automating repetitive tasks, improving supplier relationships, better cash flow management, reduced manual errors, time savings, and data-driven ordering decisions. Ordering management systems can save businesses 10+ hours per week on manual ordering tasks."
    },
    {
      question: "Can ordering management systems integrate with suppliers?",
      answer: "Yes, modern ordering management systems like StockFlow can integrate with suppliers through APIs, email automation, and electronic data interchange (EDI). This streamlines the ordering process, reduces communication overhead, and ensures accurate order transmission."
    },
    {
      question: "Is ordering management system suitable for small businesses?",
      answer: "Yes, ordering management systems are beneficial for businesses of all sizes. StockFlow offers a free plan for small businesses, making automated ordering accessible without large upfront costs. Small businesses can automate ordering and focus on growing their business."
    }
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: "Automated Ordering",
      description: "Automatically generate purchase orders when inventory reaches reorder points, eliminating manual ordering tasks."
    },
    {
      icon: Package,
      title: "Order Tracking",
      description: "Track order status from placement to receipt, ensuring timely delivery and inventory updates."
    },
    {
      icon: Zap,
      title: "Smart Reordering",
      description: "Use sales data and forecasts to calculate optimal reorder points and quantities for each product."
    },
    {
      icon: TrendingUp,
      title: "Supplier Management",
      description: "Manage multiple suppliers, track performance, and optimize ordering based on lead times and reliability."
    }
  ];

  const benefits = [
    "Prevent stockouts with automated ordering",
    "Reduce excess inventory and carrying costs",
    "Save 10+ hours per week on manual ordering",
    "Improve supplier relationships and negotiations",
    "Better cash flow management",
    "Reduce ordering errors",
    "Make data-driven ordering decisions",
    "Scale ordering operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Ordering Management System?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Ordering Management System"
      
      
    >
      <SEO
        title="Ordering Management System 2025 - Ordering Management System"
        description="Find out how ordering management system to save time and money. Discover how ordering management system to choose the best software.. Start free today."
        keywords="ordering management system, inventory ordering system, stock ordering system, ordering system, inventory ordering, stock ordering, order management system inventory, automated ordering system, inventory ordering software, stock ordering software, ordering system software, inventory ordering management, stock ordering management, ordering management software, stockflow, stock flow"
        url="https://www.stockflow.be/ordering-management-system"
      />      <SeoPageHero
        title="Ordering Management System: Complete Guide to Inventory & Stock Ordering"
        description="Master ordering management system, inventory ordering system, and stock ordering system. Automate ordering processes, prevent stockouts, and optimize inventory levels. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Automating Ordering Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is an <span className="text-blue-600">Ordering Management System</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              An ordering management system automates the process of ordering inventory and stock. It monitors inventory levels, calculates when to reorder, generates purchase orders, and tracks orders through to receipt. This ensures optimal inventory levels while minimizing manual work.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ordering Management System <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Ordering Management System</span>
            </h2>
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

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Automating Ordering Today
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



