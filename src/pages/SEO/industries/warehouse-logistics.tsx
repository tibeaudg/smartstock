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
  Truck,
  Warehouse,
  Package,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function WarehouseLogistics() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is warehouse logistics?",
      answer: "Warehouse logistics refers to the management of operations within a warehouse, including receiving, storing, picking, packing, and shipping goods. It involves coordinating the flow of products through the warehouse to ensure efficient operations and timely delivery to customers. Warehouse logistics is a critical component of supply chain management."
    },
    {
      question: "What is warehouse in logistics?",
      answer: "Warehouse in logistics refers to the role warehouses play in the broader logistics and supply chain system. Warehouses serve as strategic points for storing inventory, consolidating shipments, managing distribution, and coordinating the flow of goods between suppliers and customers. Effective warehouse logistics optimizes these operations."
    },
    {
      question: "How does warehouse logistics improve operations?",
      answer: "Warehouse logistics improves operations by optimizing the flow of goods, reducing handling time, improving space utilization, minimizing errors, speeding up order fulfillment, reducing costs, and enhancing customer satisfaction. Inventory management software like StockFlow helps automate and optimize warehouse logistics processes."
    },
    {
      question: "What are the key components of warehouse logistics?",
      answer: "Key components of warehouse logistics include: receiving and inspection of incoming goods, storage and organization of inventory, inventory tracking and management, order picking and packing, shipping and distribution, returns processing, and coordination with transportation and suppliers."
    },
    {
      question: "How can inventory management software help with warehouse logistics?",
      answer: "Inventory management software like StockFlow helps with warehouse logistics by providing real-time inventory tracking, automated picking routes, barcode scanning, order management, shipping integration, space optimization tools, and analytics that help streamline warehouse operations and improve logistics efficiency."
    },
    {
      question: "What is the difference between warehouse logistics and supply chain management?",
      answer: "Warehouse logistics focuses specifically on operations within and from the warehouse, while supply chain management encompasses the entire flow from suppliers to end customers. Warehouse logistics is a subset of supply chain management, focusing on the storage and distribution aspects of the supply chain."
    }
  ];

  const features = [
    {
      icon: Warehouse,
      title: "Warehouse Management",
      description: "Manage warehouse operations including receiving, storing, picking, and shipping with real-time visibility."
    },
    {
      icon: Truck,
      title: "Logistics Coordination",
      description: "Coordinate logistics operations, track shipments, and manage transportation for efficient distribution."
    },
    {
      icon: Package,
      title: "Order Fulfillment",
      description: "Streamline order fulfillment processes from picking to packing and shipping for faster delivery."
    },
    {
      icon: TrendingUp,
      title: "Optimization",
      description: "Optimize warehouse layout, picking routes, and logistics processes for maximum efficiency."
    }
  ];

  const benefits = [
    "Improve warehouse operations efficiency",
    "Reduce logistics costs",
    "Speed up order fulfillment",
    "Optimize warehouse space utilization",
    "Enhance inventory accuracy",
    "Improve customer satisfaction",
    "Streamline supply chain coordination",
    "Scale logistics operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Warehouse Logistics?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Warehouse Logistics"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Warehouse Logistics 2025 | Warehouse in Logistics | Complete Guide | StockFlow"
        description="Complete guide to warehouse logistics and warehouse in logistics. Learn how to optimize warehouse operations, improve logistics efficiency, and streamline supply chain management. Free tools included."
        keywords="warehouse logistics, warehouse in logistics, warehouse logistics management, warehouse logistics system, warehouse logistics software, warehouse logistics operations, warehouse logistics solutions, warehouse logistics optimization, logistics warehouse, warehouse logistics management system, warehouse logistics platform, stockflow, stock flow"
        url="https://www.stockflow.be/warehouse-logistics"
      />

      <SeoPageHero
        title="Warehouse Logistics: Complete Guide to Warehouse in Logistics"
        description="Master warehouse logistics and understand the role of warehouse in logistics. Learn how to optimize warehouse operations, improve logistics efficiency, and streamline supply chain management. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Optimizing Warehouse Logistics Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Warehouse Logistics</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Warehouse logistics refers to the management of operations within a warehouse, including receiving, storing, picking, packing, and shipping goods. Understanding warehouse in logistics helps businesses optimize supply chain operations.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Warehouse Logistics <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Warehouse Logistics</span> Optimization
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
            Start Optimizing Warehouse Logistics Today
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



