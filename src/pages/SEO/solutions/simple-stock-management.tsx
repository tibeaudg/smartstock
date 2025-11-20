import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function SimpleStockManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is simple stock management?",
      answer: "Simple stock management is an easy-to-use inventory control system that helps businesses track products, monitor stock levels, and automate reordering without complexity. It's designed for businesses that want effective inventory management without the learning curve of complex systems."
    },
    {
      question: "How does simple stock management work?",
      answer: "Simple stock management software tracks your inventory in real-time, sends alerts when stock is low, and provides easy-to-understand reports. You can scan barcodes, update stock levels from your phone, and see everything you need at a glance."
    },
    {
      question: "Is simple stock management suitable for small businesses?",
      answer: "Yes, simple stock management is perfect for small businesses. It's designed to be intuitive and affordable, with free plans available for businesses with up to 30 products. You can start managing your inventory immediately without extensive training."
    },
    {
      question: "What features does simple stock management include?",
      answer: "Simple stock management includes real-time tracking, barcode scanning, automated alerts, basic reporting, mobile access, and multi-user support. It focuses on essential features that most businesses need without overwhelming complexity."
    },
    {
      question: "Can I upgrade from simple stock management to more advanced features?",
      answer: "Yes, most simple stock management systems offer upgrade paths. As your business grows, you can add more advanced features like detailed analytics, advanced reporting, and integrations with other business systems."
    }
  ];

  return (
    <SeoPageLayout 
      title="Simple Stock Management"
      heroTitle="Simple Stock Management: Inventory Control Made Simple"
      faqData={faqData}
      
      
    >
      <SEO
        title="Simple Stock Management 2025 - Simple Stock Management"
        description="Find out how simple stock management to save time and money. Read the guide simple stock management to save time and. Try free now. StockFlow helps businesse..."
        keywords="simple stock management, easy inventory, simple inventory software, straightforward stock control"
        url="https://www.stockflow.be/simple-stock-management"
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Package, title: "Real-Time Tracking", description: "Monitor stock levels in real-time with instant updates" },
              { icon: BarChart3, title: "Analytics & Reports", description: "Make data-driven decisions with comprehensive insights" },
              { icon: Zap, title: "Automation", description: "Automate processes and save hours every week" },
              { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security with automatic backups" },
              { icon: Clock, title: "Save Time", description: "Reduce manual work by up to 70%" },
              { icon: CheckCircle, title: "Easy to Use", description: "Intuitive interface that anyone can master" }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </SeoPageLayout>
  );
}

