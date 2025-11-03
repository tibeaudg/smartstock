import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '../../components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Bell
} from 'lucide-react';

export default function AutomateInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What does it mean to automate inventory management?",
      answer: "Automating inventory management means using software to automatically handle repetitive tasks like tracking stock levels, generating reorder alerts, updating inventory counts, and synchronizing data across locations. This eliminates manual work and reduces errors by up to 90%."
    },
    {
      question: "How much time can I save by automating inventory management?",
      answer: "Most businesses save 10-15 hours per week by automating inventory management. Tasks like manual counting, data entry, reorder calculations, and report generation become automatic, allowing you to focus on growing your business instead of administrative tasks."
    },
    {
      question: "What inventory processes can be automated?",
      answer: "You can automate: stock level tracking, reorder point alerts, inventory calculations, data synchronization, report generation, low stock notifications, expiry date alerts, and movement tracking. StockFlow handles all these automatically with no manual intervention needed."
    },
    {
      question: "Is inventory automation expensive?",
      answer: "Not at all! StockFlow offers free inventory automation for up to 100 products. After that, automation costs just €0.004 per product per month. The time savings alone (10+ hours/week) typically pay for the software within days, not months."
    },
    {
      question: "Can I automate inventory if I'm currently using Excel?",
      answer: "Absolutely! Switching from Excel to automated inventory software is easy. StockFlow allows you to import your Excel data in minutes, and then all processes become automated. Most businesses see immediate time savings and error reduction."
    }
  ];

  const automationFeatures = [
    {
      feature: "Automatic Reorder Alerts",
      benefit: "Never run out of stock",
      timeSaved: "5-10 hours/week"
    },
    {
      feature: "Real-Time Stock Updates",
      benefit: "Always accurate inventory data",
      timeSaved: "3-5 hours/week"
    },
    {
      feature: "Automated Reports",
      benefit: "Instant insights without manual work",
      timeSaved: "2-3 hours/week"
    },
    {
      feature: "Barcode Scanning",
      benefit: "99.9% accuracy, no manual entry",
      timeSaved: "4-6 hours/week"
    }
  ];

  const structuredData = [
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
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Automate Inventory Management: Save 70% Time with Automation",
      "description": "Automate your inventory processes and save 10-15 hours weekly. Learn how auto-reordering, alerts, and streamlined workflows eliminate manual work and reduce errors by 90%.",
      "image": "https://www.stockflow.be/Inventory-Management.png",
      "author": {
        "@type": "Organization",
        "name": "StockFlow"
      },
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.stockflow.be/logo.png"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.stockflow.be/automate-inventory-management"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Automate Inventory Management",
          "item": "https://www.stockflow.be/automate-inventory-management"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Automate Inventory Management">
      <SEO
        title="Automate Inventory Management: Save 70% Time | StockFlow"
        description="Automate inventory processes and save 10-15 hours weekly. Auto-reordering, alerts, real-time sync reduce errors by 90%. Start free automation today - no credit card required."
        keywords="automate inventory, inventory automation, automated stock management, inventory process automation, automatic inventory tracking, inventory automation software, automate stock control"
        url="https://www.stockflow.be/automate-inventory-management"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/automate-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-automatiseren' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Automate Inventory Management: <span className="text-blue-600">Work Smarter, Not Harder</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Automate your inventory processes and save hours every week. Auto-reordering, alerts, and streamlined workflows.
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
                alt="Automated inventory management dashboard showing real-time stock tracking, automatic alerts, and streamlined workflows"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Time Savings Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Inventory Automation Saves Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Automate repetitive tasks and focus on growing your business instead of managing spreadsheets
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {automationFeatures.map((item, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <Zap className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">{item.feature}</h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Benefit:</strong> {item.benefit}
                </p>
                <div className="flex items-center text-green-600 font-semibold">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Time Saved: {item.timeSaved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Key Automation Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Bell, title: "Auto Reorder Alerts", description: "Get notified automatically when stock drops below minimum levels. Set once, forget about it." },
              { icon: Zap, title: "Real-Time Sync", description: "All inventory updates sync instantly across devices and locations. No manual data entry needed." },
              { icon: BarChart3, title: "Automated Reports", description: "Generate inventory reports automatically on schedule. No more manual calculations or spreadsheets." },
              { icon: Package, title: "Barcode Automation", description: "Scan products once - inventory updates automatically across the system with 99.9% accuracy." },
              { icon: TrendingUp, title: "Smart Forecasting", description: "AI-powered demand forecasting helps predict when to reorder based on sales patterns." },
              { icon: Shield, title: "Automated Backups", description: "Your data is backed up automatically every day. Never worry about losing inventory information." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Return on Investment: Inventory Automation
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">10-15</div>
              <div className="text-lg">Hours Saved/Week</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-lg">Error Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">€2,000+</div>
              <div className="text-lg">Monthly Savings</div>
            </div>
          </div>
          <p className="text-xl opacity-90">
            At €50/hour, saving 10 hours weekly = €2,000/month in time savings alone. Inventory automation typically pays for itself within the first week.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-automatiseren" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Automatiseren (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - automatiseer je voorraadbeheer en bespaar tijd.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Discover how inventory software automates processes.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/voorraadbeheer-automatiseren-5-stappen" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  5 Steps to Automate
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Step-by-step guide to automating your inventory.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Automating Your Inventory Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. Automate reordering, alerts, and reports. Save 10-15 hours weekly. No credit card required.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}