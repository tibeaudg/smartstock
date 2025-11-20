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
  Cloud,
  Zap,
  Shield
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryPlatform() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is an inventory platform?",
      answer: "An inventory platform is a software solution that provides comprehensive inventory management capabilities, including tracking, reporting, automation, and integrations. Inventory platforms serve as the central system for managing all inventory-related operations."
    },
    {
      question: "What is inventory platform software?",
      answer: "Inventory platform software is a comprehensive solution that provides tools for inventory tracking, management, automation, and integration. StockFlow is an inventory platform software that offers all essential inventory management features in one system."
    },
    {
      question: "What are automated inventory control platforms?",
      answer: "Automated inventory control platforms use automation to manage inventory operations, including automatic reordering, stock level monitoring, alert generation, and inventory updates. These platforms reduce manual work and improve accuracy."
    },
    {
      question: "How does an inventory platform work?",
      answer: "An inventory platform works by centralizing inventory data, providing real-time tracking, automating processes, integrating with other systems, and offering analytics and reporting. StockFlow provides all these capabilities as a unified inventory platform."
    }
  ];

  const features = [
    {
      icon: Cloud,
      title: "Cloud-Based Platform",
      description: "Access your inventory platform from anywhere with cloud-based technology."
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate inventory control processes for efficiency and accuracy."
    },
    {
      icon: Shield,
      title: "Integration",
      description: "Integrate with e-commerce, accounting, and other business systems."
    }
  ];

  const benefits = [
    "Centralized inventory management",
    "Automated inventory control",
    "Real-time visibility",
    "Scalable platform",
    "Integration capabilities",
    "Advanced analytics"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Inventory Platform?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Inventory Platform"
      
      
    >
      <SEO
        title="Inventory Platform 2025 - Inventory Platform 2025"
        description="Learn how inventory platform to save time and money. Discover how inventory platform to optimize your inventory management. Best. Start free today. StockFlow..."
        keywords="inventory platform, inventory platform software, automated inventory control platforms, inventory platform solution, inventory platform system, inventory management platform, inventory control platform, inventory platform services, stockflow, stock flow"
        url="https://www.stockflow.be/inventory-platform"
      />


              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Inventory Platform</h1>
      <SeoPageHero
        title="Inventory Platform: Complete Inventory Management Platform"
        description="Best inventory platform and inventory platform software. Automated inventory control platforms for comprehensive inventory management. Free trial available."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Platform", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Automated Control", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Using Inventory Platform Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is an <span className="text-blue-600">Inventory Platform</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              An inventory platform provides comprehensive inventory management capabilities, including tracking, automation, and integrations, all in one unified system.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inventory Platform <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Inventory Platform</span>
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
            Start Using Inventory Platform Today
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



