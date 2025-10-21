import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, TrendingUp, Clock, Shield, Users, Zap, DollarSign, BarChart3, ArrowRight } from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function InventoryManagementSME() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Why do SMEs need specific inventory management software?",
      answer: "SMEs often have limited resources and time. Inventory management software for SMEs is designed to implement quickly, be affordable and scale with your business. It offers powerful features without unnecessary complexity that only large companies need."
    },
    {
      question: "What does inventory management software for SMEs cost?",
      answer: "StockFlow offers a completely free version for SMEs up to 30 products. For growing SMEs, paid plans start from €29 per month. This makes it accessible for businesses of any size without large initial investment."
    },
    {
      question: "How quickly can an SMB implement inventory management software?",
      answer: "Most SMEs can be fully operational within 1-2 days with inventory management software. StockFlow is specifically designed for quick implementation without technical knowledge. You can start immediately without long training or complex setup."
    },
    {
      question: "Is inventory management software scalable for growing SMEs?",
      answer: "Yes, good inventory management software grows with your SMB. You can start with basic features and gradually expand with more advanced features like multi-location management, automation and integrations as your business grows."
    },
    {
      question: "What ROI can SMEs expect from inventory management software?",
      answer: "SMEs see an average of 70% time savings on inventory tasks, 25% reduction in inventory costs and 15-20% revenue growth through better availability. Most SMEs recoup their investment within 3-6 months."
    }
  ];

  const smeFeatures = [
    {
      icon: DollarSign,
      title: "Affordable & Transparent",
      description: "Start free or choose an affordable plan without hidden costs. Perfect for SMB budgets.",
      color: "green"
    },
    {
      icon: Clock,
      title: "Quick to Implement",
      description: "Start within 1 day. No long implementation or expensive consultants needed.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Easy for the Team",
      description: "Intuitive interface that everyone can use. Minimal training required.",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Grows With You",
      description: "Scalable from 10 to 10,000 products. Grow without switching systems.",
      color: "orange"
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Enterprise security even for small businesses. Your data is always safe.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automatic order notifications and inventory updates save hours per week.",
      color: "yellow"
    }
  ];

  const smeChallenges = [
    {
      challenge: "Limited time and resources",
      solution: "Automate repetitive tasks and save 70% time on inventory management"
    },
    {
      challenge: "Growing inventory complexity",
      solution: "Scalable software that grows without additional complexity"
    },
    {
      challenge: "Error-prone manual processes",
      solution: "Eliminate 90% of errors with automated inventory management"
    },
    {
      challenge: "Limited budget",
      solution: "Start free and upgrade only when you need it"
    },
    {
      challenge: "No technical expertise",
      solution: "User-friendly software without IT knowledge required"
    },
    {
      challenge: "Inventory across multiple locations",
      solution: "Central management of all locations in one system"
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management Software for SMEs">
      <SEO
        title="Inventory Management Software for SMEs | Affordable & Scalable | StockFlow"
        description="Inventory management software specially for SMEs and small businesses. Start free, implement in 1 day and save 70% time. Perfect for growing businesses."
        keywords="inventory management SMB, inventory management small business, inventory software SMB, SMB inventory management, stock management SMB, inventory for small businesses, affordable inventory management, inventory management startups"
        url="https://www.stockflow.be/inventory-management-smb"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/inventory-management-smb" },
          { lang: "nl", url: "https://www.stockflow.be/voorraadbeheer-kmo" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Specially for SMEs & Small Businesses
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory Management Software for <span className="text-yellow-300">SMEs</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Affordable and user-friendly <Link to="/inventory-management-software" className="underline hover:text-yellow-300">inventory management software</Link> perfectly tailored to the needs of SMEs. 
                Start free, implement in 1 day and immediately save time and money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center"
                >
                  Start Free for SMEs
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition text-center"
                >
                  Watch Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Free up to 30 products
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Setup in 1 day
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  No credit card needed
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Why 500+ SMEs choose StockFlow</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">70% Time Savings</div>
                    <div className="text-blue-100 text-sm">Less time on administration</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">25% Cost Savings</div>
                    <div className="text-blue-100 text-sm">On inventory-related costs</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Implement Immediately</div>
                    <div className="text-blue-100 text-sm">Start within 1-2 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SMEs Need This Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why do <span className="text-blue-600">SMEs</span> need specific inventory management software?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              As an SMB, you face unique challenges. You need to be agile, work with limited resources and still grow professionally. 
              Standard inventory management software is often too complex or too expensive. StockFlow is different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smeChallenges.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="mb-3">
                  <span className="text-red-600 font-semibold">Challenge:</span>
                  <p className="text-gray-800 font-medium mt-1">{item.challenge}</p>
                </div>
                <div>
                  <span className="text-green-600 font-semibold">Solution:</span>
                  <p className="text-gray-700 mt-1">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="text-blue-600">SMB Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All features you need to professionally manage your inventory without enterprise complexity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {smeFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                green: 'bg-green-100 text-green-600',
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
                red: 'bg-red-100 text-red-600',
                yellow: 'bg-yellow-100 text-yellow-600'
              };
              
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-blue-600">500+ SMEs</span> Across Europe
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">70%</div>
              <p className="text-gray-600 font-medium">Time Savings</p>
              <p className="text-sm text-gray-500 mt-2">Average across all SMB customers</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl font-bold text-green-600 mb-2">25%</div>
              <p className="text-gray-600 font-medium">Cost Reduction</p>
              <p className="text-sm text-gray-500 mt-2">On inventory-related expenses</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl font-bold text-purple-600 mb-2">1 Day</div>
              <p className="text-gray-600 font-medium">Implementation Time</p>
              <p className="text-sm text-gray-500 mt-2">From signup to fully operational</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your SMB's Inventory Management?
          </h2>
          <p className="text-xl mb-10 leading-relaxed">
            Join 500+ SMEs that already optimized their inventory management with StockFlow. 
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Start Free for SMEs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Contact Sales
            </Link>
          </div>
          <p className="mt-6 text-blue-200">Free up to 30 products • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Schema.org Structured Data */}
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
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Inventory Management for SMEs",
          "description": "Inventory management software specially for SMEs and small businesses. Start free, implement in 1 day and save 70% time.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "SaaS",
          "operatingSystem": "Web Browser",
          "softwareVersion": "2.0",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "32",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Affordable & transparent pricing",
            "Quick implementation",
            "Easy for teams",
            "Scalable",
            "Secure",
            "Automation"
          ],
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
          "url": "https://www.stockflow.be/inventory-management-smb",
          "inLanguage": "en",
          "availableLanguage": ["en", "nl"]
        }
      ]} />
    </SeoPageLayout>
  );
}

