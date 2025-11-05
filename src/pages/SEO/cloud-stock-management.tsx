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
  Cloud,
  Shield,
  Zap
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function CloudStockManagement() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is a cloud based stock management system?",
      answer: "A cloud based stock management system is inventory management software hosted in the cloud, accessible from any device with internet connection. It eliminates the need for on-premise servers and provides real-time access to inventory data from anywhere."
    },
    {
      question: "What are the benefits of cloud based stock management?",
      answer: "Benefits include: access from anywhere, no hardware installation, automatic updates, data backup and security, scalability, lower upfront costs, multi-user access, and real-time synchronization across devices."
    },
    {
      question: "Is cloud based stock management secure?",
      answer: "Yes, cloud based stock management systems like StockFlow use bank-level security, encryption, regular backups, and compliance with data protection regulations. Cloud systems are often more secure than on-premise solutions."
    }
  ];

  const features = [
    {
      icon: Cloud,
      title: "Cloud Access",
      description: "Access your stock management system from anywhere with internet connection."
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Bank-level security and automatic backups for your inventory data."
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Real-time synchronization across all devices and users."
    }
  ];

  const benefits = [
    "Access from anywhere",
    "No hardware installation",
    "Automatic updates",
    "Secure data backup",
    "Scalable solution",
    "Lower upfront costs"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Cloud Stock Management?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Cloud Stock Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Cloud Based Stock Management System 2025 | Cloud Stock Management | StockFlow"
        description="Best cloud based stock management system. Access inventory from anywhere, secure cloud storage, automatic backups. Free trial available."
        keywords="cloud based stock management system, cloud stock management, cloud stock management system, cloud based stock management, cloud stock management software, cloud stock management solution, cloud inventory management, cloud stock system, stockflow, stock flow"
        url="https://www.stockflow.be/cloud-stock-management"
      />

      <SeoPageHero
        title="Cloud Based Stock Management System: Access Inventory Anywhere"
        description="Best cloud based stock management system. Access inventory from anywhere, secure cloud storage, automatic backups. Free trial available."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Cloud-Based", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Secure", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Cloud Stock Management Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Cloud Based Stock Management System</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A cloud based stock management system is inventory software hosted in the cloud, accessible from any device, providing secure and scalable stock management.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cloud Stock Management <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              Benefits of <span className="text-blue-600">Cloud Stock Management</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Start Using Cloud Stock Management Today
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

