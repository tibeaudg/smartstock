import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  AlertTriangle,
  TrendingDown,
  X
} from 'lucide-react';

export default function AvoidInventoryMistakes() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What are the most common inventory mistakes businesses make?",
      answer: "The most common inventory mistakes include: manual entry errors, lack of real-time synchronization, missing minimum stock level alerts, irregular stock counts, no backup procedures, and insufficient team training. These can lead to stockouts, overstock, and lost revenue."
    },
    {
      question: "How can I prevent inventory tracking errors?",
      answer: "Prevent inventory errors by using digital inventory management software with automatic synchronization, barcode scanning for accuracy, setting minimum stock levels with alerts, implementing regular stock counts, using automated backups, and providing proper team training on the system."
    },
    {
      question: "What inventory management software helps avoid mistakes?",
      answer: "StockFlow inventory management software helps prevent mistakes through automatic real-time updates, barcode scanning (99.9% accuracy), automated reorder point alerts, regular backup procedures, and an intuitive interface that reduces human error. Start free to see the difference."
    },
    {
      question: "How much do inventory mistakes cost businesses?",
      answer: "Inventory mistakes can cost businesses 10-20% of their inventory value annually. This includes costs from stockouts (lost sales), overstock (tied-up capital), expired products, and time wasted on corrections. Digital inventory management typically reduces these costs by 70-80%."
    },
    {
      question: "Can inventory management software eliminate all errors?",
      answer: "While no system can eliminate 100% of errors, modern inventory management software like StockFlow reduces errors by 90-95%. Barcode scanning ensures 99.9% accuracy, automated processes eliminate manual entry mistakes, and real-time sync prevents outdated data issues."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Manual entry errors",
      impact: "High",
      solution: "Use automated inventory software with barcode scanning",
      cost: "5-10% of inventory value"
    },
    {
      mistake: "No real-time synchronization",
      impact: "Medium",
      solution: "Implement cloud-based inventory system with instant updates",
      cost: "Lost sales from stockouts"
    },
    {
      mistake: "Missing minimum stock alerts",
      impact: "High",
      solution: "Set automatic reorder points in inventory software",
      cost: "15-25% of potential revenue"
    },
    {
      mistake: "Irregular stock counts",
      impact: "Medium",
      solution: "Schedule regular inventory audits with digital tracking",
      cost: "Inventory discrepancies"
    },
    {
      mistake: "No backup procedures",
      impact: "High",
      solution: "Use cloud-based system with automatic daily backups",
      cost: "Complete data loss risk"
    },
    {
      mistake: "Insufficient team training",
      impact: "Medium",
      solution: "Provide regular training and use user-friendly software",
      cost: "Continued errors and inefficiency"
    },
    {
      mistake: "Not analyzing inventory data",
      impact: "High",
      solution: "Use analytics and reporting features in inventory software",
      cost: "Missed optimization opportunities"
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
      "headline": "Avoid Inventory Mistakes: 7 Common Errors & Solutions",
      "description": "Learn how to avoid costly inventory mistakes that cost businesses 10-20% of inventory value annually. Discover the 7 most common errors and proven solutions to prevent them.",
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
        "@id": "https://www.stockflow.be/avoid-inventory-mistakes"
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
          "name": "Avoid Inventory Mistakes",
          "item": "https://www.stockflow.be/avoid-inventory-mistakes"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Avoid Inventory Mistakes">
      <SEO
        title="Avoid Inventory Mistakes: 7 Common Errors & Solutions | StockFlow"
        description="Learn how to avoid costly inventory mistakes that cost businesses 10-20% annually. Discover 7 common errors, proven solutions, and prevent stockouts with automated inventory management."
        keywords="inventory mistakes, stock errors, inventory problems, avoid inventory errors, common inventory mistakes, inventory management errors, prevent inventory mistakes, inventory tracking errors"
        url="https://www.stockflow.be/avoid-inventory-mistakes"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/avoid-inventory-mistakes' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-fouten-voorkomen' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Avoid Inventory Mistakes: <span className="text-blue-600">Prevent Costly Errors Before They Happen</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Learn how to avoid costly inventory mistakes. Discover the 7 most common errors and how to prevent them.
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
                alt="Inventory management software preventing common mistakes with automated tracking and alerts"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The 7 Most Common Inventory Mistakes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These mistakes cost businesses 10-20% of their inventory value annually. Learn how to prevent them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-500 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">{item.mistake}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-gray-700 mb-3">
                  <strong>Cost:</strong> {item.cost}
                </p>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Solution:</strong> {item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Strategies Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How to Prevent Inventory Mistakes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Use Digital Inventory Management</h3>
              <p className="text-gray-700 mb-4">
                Replace manual Excel sheets and paper lists with <Link to="/inventory-management-software" className="text-blue-600 font-semibold hover:underline">professional inventory management software</Link>. 
                Digital systems provide real-time updates, automatic calculations, and eliminate manual entry errors.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">99.9% accuracy with barcode scanning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Real-time synchronization across all devices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Automatic backups prevent data loss</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Set Up Automation</h3>
              <p className="text-gray-700 mb-4">
                Automate repetitive tasks and eliminate human error. Use <Link to="/inventory-management-software" className="text-blue-600 font-semibold hover:underline">automated reorder points</Link> and 
                stock level alerts to prevent stockouts and overstock situations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Automatic reorder point alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Scheduled inventory reports</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Integration with sales channels</span>
                </li>
              </ul>
            </div>
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
            <Link to="/inventory-management-tips" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Tips
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Practical tips for efficient inventory management and cost savings.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
            <Link to="/voorraadbeheer-fouten-voorkomen" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Fouten Voorkomen (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - voorkom voorraadbeheer fouten met deze tips.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Discover how professional software prevents inventory mistakes.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prevent Inventory Mistakes with StockFlow
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free with up to 100 products. No credit card required. Reduce errors by 90% with automated inventory management.
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

