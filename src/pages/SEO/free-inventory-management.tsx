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
  Star
} from 'lucide-react';

export default function FreeInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is there really free inventory management software available?",
      answer: "Yes! StockFlow offers completely free inventory management for up to 100 products. No credit card required, no hidden fees. You get real-time tracking, mobile access, and basic reporting at no cost. Perfect for small businesses and startups."
    },
    {
      question: "What features are included in the free inventory management plan?",
      answer: "The free plan includes: tracking up to 100 products, real-time inventory updates, mobile barcode scanning, basic analytics and reports, email support, and automatic backups. All essential features to get started with professional inventory management."
    },
    {
      question: "Can I upgrade from free inventory management when I grow?",
      answer: "Absolutely! StockFlow scales with your business. When you exceed 100 products, you simply pay €0.004 per additional product per month. There's no lock-in, and you can upgrade or downgrade at any time. Start free and grow seamlessly."
    },
    {
      question: "How does free inventory management compare to paid plans?",
      answer: "Free inventory management gives you all core features for up to 100 products. Paid plans unlock unlimited products, advanced analytics, priority support, API access, and multi-location management. But the free plan is perfect for getting started."
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
      "@type": "SoftwareApplication",
      "name": "StockFlow - Free Inventory Management",
      "description": "Start with free inventory management software. Track up to 100 products at no cost with real-time updates, mobile scanning, and basic analytics. No credit card required.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free plan - up to 100 products",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
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
      "url": "https://www.stockflow.be/free-inventory-management"
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
          "name": "Free Inventory Management",
          "item": "https://www.stockflow.be/free-inventory-management"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Free Inventory Management">
      <SEO
        title="Free Inventory Management Software | Track 100 Products Free | StockFlow"
        description="Start with free inventory management software. Track up to 100 products at no cost with real-time updates, mobile scanning, and basic analytics. No credit card required, upgrade when you grow."
        keywords="free inventory management, free stock software, no cost inventory, free warehouse management, free inventory tracking, free stock management software, gratis voorraadbeheer"
        url="https://www.stockflow.be/free-inventory-management"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/free-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/gratis-voorraadbeheer' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Free Inventory Management: <span className="text-blue-600">Get Started Without Spending a Dollar</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Start with free inventory management. Track up to 30 products at no cost. Upgrade when you grow.
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
                alt="Free inventory management software dashboard showing real-time stock tracking and analytics"
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
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Gratis Voorraadbeheer (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - start gratis met voorraadbeheer.
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
                  Discover all features of professional inventory management.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/pricing" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Pricing Plans
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  See pricing options and upgrade paths.
                </p>
                <div className="text-blue-600 text-sm font-semibold">View pricing →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started with Free Inventory Management
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. No credit card required. Upgrade when you grow.
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