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
  Building,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function EnterpriseInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is enterprise inventory management software?",
      answer: "Enterprise inventory management software is a comprehensive solution designed for large organizations with complex inventory needs, multiple locations, high-volume operations, and advanced requirements. It provides advanced features, scalability, security, and integration capabilities needed for enterprise-level operations."
    },
    {
      question: "What features should enterprise inventory management software have?",
      answer: "Enterprise inventory management software should include: multi-location/warehouse support, advanced analytics and reporting, API integrations, role-based access control, scalability for high volumes, security compliance, advanced automation, supplier management, and dedicated support. StockFlow offers enterprise features at affordable pricing."
    },
    {
      question: "How much does enterprise inventory management software cost?",
      answer: "Enterprise inventory management software typically costs $10,000+ per month for large deployments. However, StockFlow offers enterprise-level features starting at affordable pay-as-you-grow pricing (â‚¬0.004 per product/month), making enterprise capabilities accessible to growing businesses without massive upfront costs."
    },
    {
      question: "Is StockFlow suitable for enterprise inventory management?",
      answer: "Yes, StockFlow is suitable for enterprise inventory management. It provides multi-warehouse support, advanced analytics, API access, role-based permissions, scalability, security compliance, and all features needed for enterprise operations - at a fraction of traditional enterprise software costs."
    },
    {
      question: "What is the difference between enterprise and small business inventory software?",
      answer: "Enterprise inventory management software is designed for large organizations with complex needs, multiple locations, high volumes, and advanced requirements. Small business software is simpler and more affordable. StockFlow bridges this gap by offering enterprise features with small business pricing."
    },
    {
      question: "Can enterprise inventory management software scale?",
      answer: "Yes, StockFlow scales from small businesses to large enterprises. It handles unlimited products, multiple warehouses, high transaction volumes, and complex operations. The pay-as-you-grow pricing model means you only pay for what you use as you scale."
    }
  ];

  const features = [
    {
      icon: Building,
      title: "Multi-Location Support",
      description: "Manage inventory across unlimited warehouses, distribution centers, and locations with centralized control."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security, compliance, role-based access control, and data protection for enterprise operations."
    },
    {
      icon: Zap,
      title: "Advanced Automation",
      description: "Automate complex workflows, reordering, and inventory processes for enterprise-scale operations."
    },
    {
      icon: TrendingUp,
      title: "Scalability",
      description: "Scale from startup to enterprise with unlimited products, users, and transaction volumes."
    }
  ];

  const benefits = [
    "Scale operations without limits",
    "Manage multiple warehouses efficiently",
    "Enterprise-grade security and compliance",
    "Advanced analytics and reporting",
    "API integrations with enterprise systems",
    "Dedicated support for enterprise customers",
    "Role-based access control",
    "Cost-effective enterprise solution"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Enterprise Inventory Management?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Enterprise Inventory Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Enterprise Inventory Management Software 2025 | Enterprise Inventory System | StockFlow"
        description="Best enterprise inventory management software for large organizations. Multi-warehouse support, advanced analytics, enterprise security, and scalability. Affordable enterprise solution."
        keywords="enterprise inventory management software, enterprise inventory management, enterprise inventory software, enterprise inventory system, enterprise inventory management system, enterprise inventory solution, enterprise inventory platform, enterprise inventory software solutions, enterprise inventory management platform, enterprise inventory software features, enterprise inventory management features, stockflow, stock flow"
        url="https://www.stockflow.be/enterprise-inventory-management"
      />

      <SeoPageHero
        title="Enterprise Inventory Management Software: Complete Enterprise Solution"
        description="Best enterprise inventory management software for large organizations. Multi-warehouse support, advanced analytics, enterprise security, and scalability. Affordable enterprise solution starting at â‚¬0.004/product/month."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "#1 Enterprise Solution", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Enterprise Features", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "500+ Enterprises", variant: 'info' }
        ]}
        ctaText="Start Enterprise Trial Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-blue-600">Enterprise Inventory Management Software</span> for Large Organizations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enterprise inventory management software designed for large organizations with complex needs, multiple locations, and high-volume operations. StockFlow provides enterprise capabilities at affordable pricing.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise Inventory Management <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Enterprise Inventory Management</span>
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
            Start Enterprise Inventory Management Today
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



