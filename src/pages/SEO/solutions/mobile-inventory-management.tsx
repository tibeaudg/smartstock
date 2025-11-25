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
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function MobileInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is mobile inventory management?",
      answer: "Mobile inventory management allows you to track and manage inventory from your smartphone or tablet. You can scan barcodes, update stock levels, check inventory status, and generate reports from anywhere - whether you're in the warehouse, on the shop floor, or traveling."
    },
    {
      question: "Can mobile inventory management work offline?",
      answer: "Yes! StockFlow's mobile app works offline and syncs data when you reconnect to the internet. This is essential for warehouses or locations with poor connectivity. You can scan products, update counts, and make changes offline - everything syncs automatically when connection is restored."
    },
    {
      question: "Do I need special hardware for mobile inventory management?",
      answer: "No special hardware needed! StockFlow uses your smartphone's built-in camera as a barcode scanner. This works on both iOS and Android devices. While dedicated barcode scanners can be used, your phone camera is perfectly capable and free to use."
    },
    {
      question: "Is mobile inventory management secure?",
      answer: "Absolutely. StockFlow uses bank-level encryption, secure authentication, and GDPR-compliant data storage. Your inventory data is encrypted both in transit and at rest. Role-based access ensures only authorized team members can access sensitive information."
    },
    {
      question: "How accurate is mobile barcode scanning for inventory?",
      answer: "Mobile barcode scanning achieves 99.9% accuracy - far better than manual entry which has an 88% error rate. The camera-based scanner reads standard barcodes (UPC, EAN, Code 128) instantly and updates inventory in real-time across all devices."
    }
  ];

  const mobileFeatures = [
    {
      icon: Smartphone,
      title: "Barcode Scanning",
      description: "Use your phone camera to scan barcodes instantly. No expensive hardware needed."
    },
    {
      icon: Wifi,
      title: "Real-Time Sync",
      description: "All updates sync instantly across desktop, tablet, and mobile devices."
    },
    {
      icon: WifiOff,
      title: "Offline Mode",
      description: "Work without internet. Changes sync automatically when connection is restored."
    },
    {
      icon: Zap,
      title: "Fast Updates",
      description: "Update inventory in seconds. Much faster than manual entry or paper lists."
    },
    {
      icon: BarChart3,
      title: "Mobile Reports",
      description: "View inventory reports, analytics, and insights on your mobile device."
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Secure login with role-based permissions. Enterprise-grade security."
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
      "name": "StockFlow - Mobile Inventory Management",
      "description": "Manage inventory from anywhere with mobile inventory management. Real-time updates, barcode scanning with phone camera, and offline mode. iOS and Android apps available.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "iOS, Android, Web Browser",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "2.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free plan includes mobile access",
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
      "url": "https://www.stockflow.be/mobile-inventory-management",
      "screenshot": "https://www.stockflow.be/mobile.png"
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
          "name": "Mobile Inventory Management",
          "item": "https://www.stockflow.be/mobile-inventory-management"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout 
      title="Mobile Inventory Management"
      heroTitle="Mobile Inventory Management"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Mobile Inventory Management 2025 - Mobile Inventory Manag..."
        description="Find out how mobile inventory management to optimize your inventory management. Find out how mobile inventory management to optimize your inventory. Get star..."
        keywords="mobile inventory management, mobile stock control, inventory mobile app, on-the-go inventory, mobile inventory tracking, inventory app, mobile warehouse management, barcode scanner app"
        url="https://www.stockflow.be/solutions/mobile-inventory-management"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/mobile-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/mobiel-voorraadbeheer' }
        ]}
        structuredData={structuredData}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Manage inventory from anywhere with mobile inventory management. Real-time updates, barcode scanning, and offline mode.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Mobile inventory management allows you to track and manage inventory from your smartphone or tablet. You can scan barcodes, update stock levels, check inventory status, and generate reports from anywhere - whether you're in the warehouse, on the shop floor, or traveling.
        </p>
      </div>

      {/* Mobile Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Inventory Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage inventory from your smartphone or tablet
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mobileFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Use Mobile Inventory Management?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Manage Inventory Anywhere</h3>
              <p className="text-gray-700 mb-4">
                Check stock levels, scan products, and update inventory from anywhere - warehouse, shop floor, 
                or while traveling. No need to be tied to a desktop computer.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Access from any location</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Update inventory on-the-go</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Real-time sync across all devices</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Faster & More Accurate</h3>
              <p className="text-gray-700 mb-4">
                Mobile barcode scanning is 5x faster than manual entry and achieves 99.9% accuracy. 
                Scan products in seconds and eliminate data entry errors.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">99.9% accuracy with barcode scanning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">5x faster than manual entry</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">No paper lists or spreadsheets needed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Mode Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Works Offline Too
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Many warehouses have poor internet connectivity. StockFlow's mobile app works perfectly offline. 
                Scan products, update counts, and make changes - everything syncs automatically when you reconnect.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <WifiOff className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Offline Scanning</h3>
                    <p className="text-gray-600">Scan barcodes and update inventory without internet connection</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Wifi className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Automatic Sync</h3>
                    <p className="text-gray-600">All offline changes sync instantly when connection is restored</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Data Integrity</h3>
                    <p className="text-gray-600">No data loss. All changes are saved and synchronized safely</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Mobile App Stats</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">99.9%</div>
                  <div className="text-gray-600 text-sm">Barcode Scan Accuracy</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">1.2 sec</div>
                  <div className="text-gray-600 text-sm">Average Scan Time</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                  <div className="text-gray-600 text-sm">Available Offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/mobiel-voorraadbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Mobiel Voorraadbeheer (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - voorraadbeheer op je mobiel.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer ?</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete inventory management with mobile access.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more ?</div>
              </div>
            </Link>
            <Link to="/mobile-app" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Mobile App Details
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn more about our mobile inventory app features.
                </p>
                <div className="text-blue-600 text-sm font-semibold">View app ?</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Managing Inventory on Your Mobile Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free mobile app for up to 100 products. Scan barcodes with your phone camera. Works offline. 
            No credit card required. Available on iOS and Android.
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

