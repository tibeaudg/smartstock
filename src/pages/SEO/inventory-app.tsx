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
  Smartphone,
  Download
} from 'lucide-react';

export default function InventoryApp() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is an inventory app?",
      answer: "An inventory app is a mobile application that allows you to manage inventory from your smartphone or tablet. You can track stock levels, scan barcodes, update inventory, view reports, and manage orders from anywhere - whether in the warehouse, shop floor, or on the go."
    },
    {
      question: "Do I need special hardware to use an inventory app?",
      answer: "No! StockFlow's inventory app uses your smartphone's built-in camera as a barcode scanner. No expensive hardware needed. The app works on both iOS and Android devices, so you can use the phone you already have."
    },
    {
      question: "Can inventory apps work offline?",
      answer: "Yes! StockFlow's inventory app works offline and syncs data when you reconnect to the internet. This is essential for warehouses with poor connectivity. You can scan products, update counts, and make changes offline - everything syncs automatically when connection is restored."
    },
    {
      question: "Is mobile inventory app secure?",
      answer: "Absolutely. StockFlow uses bank-level encryption, secure authentication, and GDPR-compliant data storage. Your inventory data is encrypted both in transit and at rest. Role-based access ensures only authorized team members can access sensitive information."
    },
    {
      question: "How accurate is barcode scanning in inventory apps?",
      answer: "Mobile barcode scanning achieves 99.9% accuracy - far better than manual entry which has an 88% error rate. The camera-based scanner reads standard barcodes (UPC, EAN, Code 128) instantly and updates inventory in real-time across all devices."
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
      "name": "StockFlow - Inventory App",
      "description": "The best inventory app for businesses. Track stock in real-time, scan barcodes, manage orders from your mobile device. iOS and Android apps available. Works offline.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "iOS, Android",
      "softwareVersion": "2.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free plan includes mobile app",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "200",
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
      "url": "https://www.stockflow.be/inventory-app",
      "screenshot": "https://www.stockflow.be/mobile.png",
      "downloadUrl": "https://www.stockflow.be/auth"
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
          "name": "Inventory App",
          "item": "https://www.stockflow.be/inventory-app"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Inventory App">
      <SEO
        title="Inventory App: Best Mobile Inventory Solution 2025 | StockFlow"
        description="The best inventory app for businesses. Track stock in real-time, scan barcodes with phone camera, manage orders from mobile. Works offline. iOS & Android. Free trial."
        keywords="inventory app, mobile inventory, stock app, warehouse app, inventory management app, inventory mobile app, stock tracking app, mobile inventory software, inventory app iOS, inventory app Android, barcode scanner app"
        url="https://www.stockflow.be/inventory-app"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-app' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-app' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory App: <span className="text-blue-600">Powerful Inventory Control in Your Pocket</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The best inventory app for businesses. Track stock, scan barcodes, manage orders from your mobile device.
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
                src="/mobile.png" 
                alt="Inventory management mobile app showing barcode scanning, real-time stock tracking, and offline capabilities on smartphone screen"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Inventory App Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage inventory from your mobile device
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: "Barcode Scanning", description: "Use your phone camera to scan barcodes. No expensive hardware needed. 99.9% accuracy." },
              { icon: Package, title: "Real-Time Tracking", description: "Monitor stock levels in real-time with instant updates across all devices" },
              { icon: Zap, title: "Offline Mode", description: "Work without internet. All changes sync automatically when connection is restored." },
              { icon: BarChart3, title: "Mobile Reports", description: "View inventory reports, analytics, and insights directly on your mobile device." },
              { icon: Shield, title: "Secure Access", description: "Secure login with role-based permissions. Enterprise-grade security." },
              { icon: Clock, title: "Fast Updates", description: "Update inventory in seconds. Much faster than manual entry or paper lists." }
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

      {/* Download Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Available on iOS and Android
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Download StockFlow's inventory app from the App Store or Google Play. Works seamlessly with the web version - 
                sync your data across all devices automatically.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Download className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold">iOS App Store</div>
                    <div className="text-sm text-gray-600">Available for iPhone and iPad</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Download className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold">Google Play Store</div>
                    <div className="text-sm text-gray-600">Available for Android phones and tablets</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-6">App Capabilities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Scan barcodes with phone camera</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Real-time inventory updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Works completely offline</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">View reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Multi-user collaboration</span>
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
            <Link to="/voorraadbeheer-app" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer App (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - voorraadbeheer app voor mobiele devices.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
            <Link to="/mobile-inventory-management" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Mobile Inventory Management
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn more about mobile inventory management capabilities.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete inventory solution with mobile app included.
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
            Download the Inventory App Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. Mobile app included. Scan barcodes, track inventory, manage orders on-the-go. 
            Works offline. No credit card required.
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