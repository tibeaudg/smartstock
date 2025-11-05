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
  Workflow,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function WarehouseExecutionSystem() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is an execution system?",
      answer: "An execution system is a software solution that manages and automates the execution of operational processes, such as order fulfillment, warehouse operations, or inventory movements. In warehouse and inventory management, execution systems coordinate activities like picking, packing, shipping, and inventory tracking to ensure efficient operations."
    },
    {
      question: "How does an execution system work?",
      answer: "An execution system works by receiving orders or tasks, coordinating resources and equipment, directing workers through optimized processes, tracking progress in real-time, and ensuring tasks are completed accurately and efficiently. Inventory management software like StockFlow provides execution capabilities for inventory operations."
    },
    {
      question: "What is the difference between execution system and management system?",
      answer: "An execution system focuses on the real-time execution and coordination of operational tasks, while a management system focuses on planning, scheduling, and overall management. Execution systems handle day-to-day operations, while management systems provide strategic oversight and planning."
    },
    {
      question: "How can inventory management software function as an execution system?",
      answer: "Inventory management software like StockFlow functions as an execution system by coordinating inventory operations, directing picking and packing tasks, tracking inventory movements in real-time, automating reordering processes, and ensuring accurate execution of inventory management tasks throughout the day."
    },
    {
      question: "What are the benefits of using an execution system?",
      answer: "Benefits of using an execution system include: improved operational efficiency, better coordination of tasks, reduced errors, real-time visibility into operations, optimized resource utilization, faster task completion, and better decision-making based on real-time data."
    }
  ];

  const features = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Automate and coordinate operational processes for efficient execution of inventory tasks."
    },
    {
      icon: Zap,
      title: "Real-Time Coordination",
      description: "Coordinate tasks and resources in real-time for optimal operational efficiency."
    },
    {
      icon: Target,
      title: "Task Management",
      description: "Manage and track task execution, ensuring all operations are completed accurately."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Analyze execution performance and identify opportunities for optimization."
    }
  ];

  const benefits = [
    "Improve operational efficiency",
    "Reduce errors in task execution",
    "Optimize resource utilization",
    "Real-time visibility into operations",
    "Faster task completion",
    "Better coordination of activities",
    "Data-driven decision making",
    "Scale operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Execution System?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Warehouse Execution System"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Execution System 2025 | Warehouse Execution System | StockFlow"
        description="Complete guide to execution system and warehouse execution systems. Learn how execution systems work, benefits, and how to optimize operations. Free tools included."
        keywords="execution system, warehouse execution system, execution systems, warehouse execution systems, execution system software, execution system management, order execution system, warehouse execution system software, execution system platform, execution system solution, stockflow, stock flow"
        url="https://www.stockflow.be/warehouse-execution-system"
      />

      <SeoPageHero
        title="Execution System: Complete Guide to Warehouse Execution Systems"
        description="Master execution system and warehouse execution systems. Learn how execution systems work, benefits, and how to optimize operational execution. Free tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Using Execution System Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is an <span className="text-blue-600">Execution System</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              An execution system is a software solution that manages and automates the execution of operational processes. In warehouse and inventory management, execution systems coordinate activities to ensure efficient operations.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Execution System <span className="text-blue-600">Features</span>
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
              Benefits of <span className="text-blue-600">Execution System</span>
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
            Start Using Execution System Today
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

