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
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function PurchasingInventorySoftware() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is purchasing and inventory software?",
      answer: "Purchasing and inventory software is an integrated solution that manages both purchasing processes (procurement, supplier management, purchase orders) and inventory management (stock tracking, warehouse management, order fulfillment). It streamlines the flow from purchasing to inventory management in one system."
    },
    {
      question: "How does purchasing and inventory software work?",
      answer: "Purchasing and inventory software works by managing the entire procurement cycle: supplier selection, purchase order creation, order tracking, receiving goods, and updating inventory automatically. It also manages inventory levels, tracks stock movements, and helps optimize purchasing decisions based on inventory data."
    },
    {
      question: "What are the benefits of purchasing and inventory software?",
      answer: "Benefits include: streamlined procurement processes, automated inventory updates when goods are received, better supplier management, optimized purchasing decisions, reduced manual work, improved inventory accuracy, cost savings through better purchasing, and unified view of purchasing and inventory."
    },
    {
      question: "Can purchasing and inventory software automate reordering?",
      answer: "Yes, purchasing and inventory software like StockFlow can automate reordering by monitoring inventory levels, calculating reorder points, generating purchase orders automatically, and sending them to suppliers. This ensures optimal inventory levels without manual intervention."
    },
    {
      question: "How does purchasing and inventory software help with supplier management?",
      answer: "Purchasing and inventory software helps manage suppliers by tracking supplier performance, lead times, pricing, order history, and reliability. This data helps make better purchasing decisions, negotiate better terms, and maintain strong supplier relationships."
    },
    {
      question: "Is purchasing and inventory software suitable for small businesses?",
      answer: "Yes, purchasing and inventory software is beneficial for businesses of all sizes. StockFlow offers a free plan for small businesses, making purchasing and inventory management accessible. Small businesses can automate purchasing and better manage suppliers."
    }
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: "Purchase Order Management",
      description: "Create, track, and manage purchase orders with suppliers for efficient procurement."
    },
    {
      icon: Package,
      title: "Inventory Integration",
      description: "Automatically update inventory when purchase orders are received and processed."
    },
    {
      icon: TrendingUp,
      title: "Supplier Management",
      description: "Manage supplier relationships, track performance, and optimize purchasing decisions."
    },
    {
      icon: CheckCircle,
      title: "Automated Reordering",
      description: "Automatically generate purchase orders when inventory reaches reorder points."
    }
  ];

  const benefits = [
    "Streamline purchasing processes",
    "Automate inventory updates from purchases",
    "Better supplier management and negotiations",
    "Optimize purchasing decisions",
    "Reduce manual work and errors",
    "Improve inventory accuracy",
    "Cost savings through better purchasing",
    "Unified purchasing and inventory view"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Purchasing and Inventory Software?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Purchasing and Inventory Software"
      
      
    >
      <SEO
        title="Purchasing Inventory Software 2025 - Purchasing Inventory..."
        description="Discover how purchasing inventory software to choose the best software. Learn how purchasing inventory software to optimize your inventory management.. Get s..."
        keywords="purchasing and inventory software, purchasing inventory software, purchasing inventory management, purchasing inventory system, purchasing inventory solution, purchasing inventory platform, procurement and inventory software, purchasing inventory management software, purchasing inventory system software, stockflow, stock flow"
        url="https://www.stockflow.be/purchasing-inventory-software"
      />      <SeoPageHero
        title="Purchasing and Inventory Software: Integrated Procurement & Inventory"
        description="Complete guide to purchasing and inventory software. Manage purchasing, suppliers, and inventory in one integrated system. Automate procurement and inventory management. Free trial available."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Integrated Solution", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Purchasing & Inventory Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Purchasing and Inventory Software</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Purchasing and inventory software integrates procurement and inventory management in one system, streamlining the flow from purchasing to inventory and automating the entire process.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Purchasing and Inventory Software <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Purchasing and Inventory Software</span>
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
            Start Using Purchasing and Inventory Software Today
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



