import { SEO } from '@/components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  Globe, 
  BarChart3, 
  Clock, 
  Smartphone, 
  Target, 
  FileQuestionMark
} from 'lucide-react';

import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';







export default function About() {
  

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "description": "Cloud-based Inventory Management for SMEs.",
    "url": "https://www.stockflowsystems.com",
    "logo": "https://www.stockflowsystems.com/logo.png",
    "address": { "@type": "PostalAddress", "addressCountry": "Belgium" }
  };

  return (
      <>
    
      <SEO
        title="Our Story | StockFlow Inventory Management"
        description="Founded in 2020 to democratize enterprise-grade inventory tools. Helping 500+ businesses save 20 hours weekly."
        keywords="about stockflow, inventory mission, inventory software team"
        url="https://www.stockflowsystems.com/about"
        structuredData={structuredData}
      />

<Header />



      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-slate-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileQuestionMark className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Enterprise power shouldn't require an enterprise budget. Since 2020, we've helped 500+ businesses stop the spreadsheet chaos.
            </p>
          </div>
        </div>
      </div>



      {/* The Problem/Solution Split */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Why We Exist</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  We watched a Brussels retailer lose <span className="font-bold text-red-600">€12,000</span> in a single month due to stockouts and expired goods. The tools to fix it cost more than their profit margin.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: <Clock className="w-5 h-5" />, label: "Save 20hrs/week" },
                    { icon: <Target className="w-5 h-5" />, label: "Zero Stockouts" },
                    { icon: <Zap className="w-5 h-5" />, label: "Instant Sync" },
                    { icon: <BarChart3 className="w-5 h-5" />, label: "Dead Stock Alerts" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-blue-600">{item.icon}</div>
                      <span className="font-semibold text-gray-800">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-2xl overflow-hidden">
                 <div className="w-full h-full bg-white rounded-[22px] p-8 flex flex-col justify-center">
                    <blockquote className="text-2xl font-medium text-gray-900 italic mb-6">
                      "Small businesses waste up to $8,000 annually on inventory errors. We built StockFlow to bring that number to zero."
                    </blockquote>
                    <p className="font-bold text-gray-900">— The StockFlow Founding Team</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Grid */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "500+", label: "Global Users" },
              { val: "99.9%", label: "Uptime" },
              { val: "75%", label: "Faster Counting" },
              { val: "24/7", label: "Monitoring" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.val}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values - High Contrast Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center tracking-tight">Our Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Smartphone className="w-6 h-6" />}
              title="Accessibility First"
              desc="Mobile-first scanning and multi-location tracking should be a right, not a luxury. We provide professional tools at zero cost."
            />
            <ValueCard 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Ironclad Security"
              desc="SOC 2 compliant infrastructure with role-based access. Your inventory data is encrypted and remains strictly private."
            />
            <ValueCard 
              icon={<Globe className="w-6 h-6" />}
              title="Community Driven"
              desc="We build features based on real conversations. When our users ask for a specific workflow, we ship it within weeks."
            />
          </div>
        </div>
      </section>

      {/* Team - Minimalist Aesthetic */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">The Minds Behind StockFlow</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <TeamBlock 
              name="Engineering"
              desc="Alumni from Shopify and Zendesk. Experts in handling 10k+ SKU catalogs without performance degradation."
            />
            <TeamBlock 
              name="Customer Success"
              desc="Retail veterans who personally guide your migration from spreadsheets to automated flows in under 7 days."
            />
            <TeamBlock 
              name="Product Design"
              desc="Obsessed with friction-less UI. We use heatmaps and user interviews to ensure StockFlow remains intuitive."
            />
          </div>
        </div>
      </section>



      <Footer />
    </>
  );
}



function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function TeamBlock({ name, desc }: { name: string, desc: string }) {
  return (
    <div className="group">
      <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:border-blue-500 transition-colors">
        <div className="w-12 h-12 bg-gray-100 rounded-full" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{name}</h3>
      <p className="text-gray-500 leading-relaxed text-sm max-w-xs mx-auto">{desc}</p>
    </div>
  );
}