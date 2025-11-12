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
  UserCheck,
  Package,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function CrmInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is CRM and inventory management software?",
      answer: "CRM and inventory management software combines customer relationship management (CRM) capabilities with inventory management in one integrated platform. This allows businesses to manage customer relationships, sales, and inventory from a single system, providing a unified view of business operations."
    },
    {
      question: "Do I need separate CRM and inventory management software?",
      answer: "While integrated CRM and inventory management software offers convenience, many businesses find that specialized solutions work better. StockFlow provides inventory management that integrates with popular CRM systems, allowing you to use the best tool for each function while maintaining integration."
    },
    {
      question: "How does CRM and inventory management software integration work?",
      answer: "CRM and inventory management software integration connects customer data with inventory information. This allows sales teams to see available inventory when making sales, track customer orders, and manage customer relationships with inventory context. StockFlow integrates with major CRM platforms through APIs."
    },
    {
      question: "What are the benefits of CRM and inventory management integration?",
      answer: "Benefits include: sales teams can check inventory availability in real-time, better customer service with accurate delivery information, automated order processing from CRM to inventory, unified view of customer and inventory data, and improved sales forecasting based on inventory levels."
    },
    {
      question: "Can StockFlow integrate with CRM systems?",
      answer: "Yes, StockFlow can integrate with CRM systems through APIs and data exports. This allows you to use specialized inventory management software while maintaining integration with your CRM for customer management, sales tracking, and customer communication."
    },
    {
      question: "Is integrated CRM and inventory management software better than separate systems?",
      answer: "Integrated systems offer convenience but may lack depth in either function. Using specialized software like StockFlow for inventory with CRM integration provides best-in-class inventory management while maintaining CRM functionality. This often works better than all-in-one solutions."
    }
  ];

  const features = [
    {
      icon: UserCheck,
      title: "CRM Integration",
      description: "Integrate with popular CRM systems to connect customer data with inventory information."
    },
    {
      icon: Package,
      title: "Inventory Visibility",
      description: "Provide real-time inventory visibility to sales teams for accurate customer communications."
    },
    {
      icon: TrendingUp,
      title: "Sales Integration",
      description: "Automate order processing from CRM sales to inventory fulfillment."
    },
    {
      icon: Users,
      title: "Customer Context",
      description: "View inventory data in customer context for better sales and service decisions."
    }
  ];

  const benefits = [
    "Sales teams see real-time inventory",
    "Better customer service with accurate info",
    "Automated order processing",
    "Unified customer and inventory view",
    "Improved sales forecasting",
    "Better inventory planning based on sales",
    "Seamless CRM integration",
    "Best-in-class inventory management"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is CRM and Inventory Management?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="CRM and Inventory Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="CRM and Inventory Management Software 2025 | Integrated CRM Inventory | StockFlow"
        description="Complete guide to CRM and inventory management software. Learn how to integrate CRM with inventory management, benefits, and best practices. Free trial available."
        keywords="crm and inventory management software, crm inventory management, crm inventory software, crm inventory integration, crm inventory management system, crm inventory management software, inventory management crm, crm with inventory management, crm inventory solution, crm inventory platform, integrated crm inventory, crm inventory software solutions, stockflow, stock flow"
        url="https://www.stockflow.be/crm-inventory-management"
      />

      <SeoPageHero
        title="CRM and Inventory Management: Integrated CRM Inventory Solutions"
        description="Complete guide to CRM and inventory management software. Learn how to integrate CRM with inventory management, benefits, and how to connect customer data with inventory information. Free trial available."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "CRM Integration", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start CRM Integration Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">CRM and Inventory Management Software</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              CRM and inventory management software combines customer relationship management with inventory management, providing a unified view of customers and inventory. StockFlow integrates with CRM systems to provide this functionality.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              CRM and Inventory Management <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">CRM and Inventory Integration</span>
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
            Start Integrating CRM and Inventory Today
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



