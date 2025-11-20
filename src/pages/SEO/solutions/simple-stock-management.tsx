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
  
  return (
    <SeoPageLayout 
      title="Simple Stock Management"
      heroTitle="Simple Stock Management: Inventory Control Made Simple"
      heroBadges={[
        { text: "5.0/5 rating" },
        { text: "500+ Businesses" },
        { text: "Free for up to 30 products" }
      ]}
      heroCTAs={[
        { label: "Start Free Trial", href: "/auth", variant: "primary" },
        { label: "View Pricing", href: "/pricing", variant: "secondary" }
      ]}
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

