import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '../../components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  Truck,
  Warehouse,
  ArrowRight,
  Zap
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function CrossDockWarehouse() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is a cross dock warehouse?",
      answer: "A cross dock warehouse is a distribution facility where incoming goods are received and immediately sorted for outbound shipment without being stored in inventory. Products are transferred directly from incoming trucks to outgoing trucks, minimizing storage time and handling. Cross dock warehouses reduce handling costs and speed up distribution."
    },
    {
      question: "How does cross dock warehouse work?",
      answer: "Cross dock warehouse operations work by: 1) Receiving goods from suppliers, 2) Quickly sorting and consolidating items for outbound shipments, 3) Transferring items directly to outbound trucks without storage, 4) Coordinating timing between inbound and outbound shipments, 5) Minimizing inventory holding time. This requires efficient inventory management and coordination."
    },
    {
      question: "What are the benefits of cross dock warehouse?",
      answer: "Benefits of cross dock warehouse include: reduced storage costs, faster order fulfillment, lower handling costs, reduced inventory holding time, improved cash flow, faster product delivery to customers, reduced risk of damage from multiple handlings, and better coordination of supply chain operations."
    },
    {
      question: "What types of businesses use cross dock warehouse?",
      answer: "Businesses that use cross dock warehouse include: retailers with multiple store locations, e-commerce fulfillment centers, distributors with time-sensitive products, businesses with perishable goods, companies with high-volume, fast-moving inventory, and logistics providers coordinating shipments between suppliers and customers."
    },
    {
      question: "How can inventory management software help with cross dock warehouse?",
      answer: "Inventory management software like StockFlow helps with cross dock warehouse by providing real-time tracking of incoming and outgoing shipments, coordinating dock schedules, managing sorting and consolidation, tracking items through the cross-docking process, and ensuring accurate inventory movements without traditional storage."
    },
    {
      question: "What is the difference between cross dock warehouse and traditional warehouse?",
      answer: "Cross dock warehouse minimizes or eliminates storage time - goods move directly from inbound to outbound. Traditional warehouses store inventory for extended periods before shipping. Cross dock is faster and has lower storage costs, while traditional warehouses provide buffer inventory and longer-term storage."
    }
  ];

  const features = [
    {
      icon: Truck,
      title: "Inbound Management",
      description: "Track and manage incoming shipments, schedule receiving, and coordinate dock assignments."
    },
    {
      icon: ArrowRight,
      title: "Cross-Dock Processing",
      description: "Process and sort items quickly for direct transfer from inbound to outbound shipments."
    },
    {
      icon: Warehouse,
      title: "Outbound Coordination",
      description: "Coordinate outbound shipments, consolidate orders, and ensure timely delivery."
    },
    {
      icon: Zap,
      title: "Real-Time Tracking",
      description: "Track items through the cross-docking process in real-time for complete visibility."
    }
  ];

  const benefits = [
    "Reduce storage and handling costs",
    "Speed up order fulfillment",
    "Minimize inventory holding time",
    "Improve cash flow",
    "Reduce product damage",
    "Faster delivery to customers",
    "Better supply chain coordination",
    "Scale operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Cross Dock Warehouse?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Cross Dock Warehouse"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Cross Dock Warehouse 2025 | Cross-Docking Operations Guide | StockFlow"
        description="Complete guide to cross dock warehouse and cross-docking operations. Learn how cross-docking works, benefits, and how to optimize cross-dock warehouse operations. Free tools included."
        keywords="cross dock warehouse, cross dock, cross-docking, cross dock warehouse operations, cross dock warehouse management, cross dock warehouse system, cross dock warehouse software, cross docking warehouse, cross dock distribution, cross dock logistics, cross dock facility, cross dock warehouse management system, stockflow, stock flow"
        url="https://www.stockflow.be/cross-dock-warehouse"
      />

      <SeoPageHero
        title="Cross Dock Warehouse: Complete Guide to Cross-Docking Operations"
        description="Master cross dock warehouse and cross-docking operations. Learn how cross-docking works, benefits, and how to optimize cross-dock warehouse operations for faster fulfillment. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Managing Cross-Dock Operations Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is a <span className="text-blue-600">Cross Dock Warehouse</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A cross dock warehouse is a distribution facility where goods are received and immediately sorted for outbound shipment without being stored. Products move directly from inbound trucks to outbound trucks, minimizing storage time and costs.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cross Dock Warehouse <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Cross Dock Warehouse</span>
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
            Start Managing Cross-Dock Operations Today
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

