import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
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

export default function CreateInventoryExcel() {
  usePageRefresh();
  
  return (
    <SeoPageLayout title="Create Inventory Excel">
      <SEO
        title="Create Inventory Excel Spreadsheet: Step-by-Step Guide | StockFlow"
        description="Learn how to create an inventory Excel spreadsheet. Free templates and tips, or discover why software is better."
        keywords="create inventory excel, make inventory spreadsheet, build stock excel, DIY inventory"
        url="https://www.stockflow.be/create-inventory-excel"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Create Inventory Excel: <span className="text-blue-600">Build Your Own Inventory Spreadsheet</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Learn how to create an inventory Excel spreadsheet. Free templates and tips, or discover why software is better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                  View Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ Businesses</span>
              </div>
            </div>
            <div>
              <img 
                src="/Inventory-Management.png" 
                alt="Create Inventory Excel" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 30 products. No credit card required.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}