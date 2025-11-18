import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  Camera,
  Scan,
  Zap,
  Shield
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryScanningSystem() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is an inventory scanning system?",
      answer: "An inventory scanning system is a technology solution that uses barcode scanners, QR code readers, or RFID technology to quickly and accurately track inventory. It automates data entry, reduces errors, speeds up inventory operations, and provides real-time updates. Inventory scanning systems are essential for efficient inventory management."
    },
    {
      question: "How does an inventory scanning system work?",
      answer: "An inventory scanning system works by: 1) Products are labeled with barcodes or QR codes, 2) Scanners read the codes to identify products instantly, 3) The system automatically updates inventory records, 4) Data is synchronized in real-time across all devices, 5) Reports and analytics are generated automatically. Modern systems like StockFlow use smartphone cameras as scanners."
    },
    {
      question: "What are the benefits of an inventory scanning system?",
      answer: "Benefits of an inventory scanning system include: faster inventory operations, reduced manual errors, improved accuracy, real-time inventory updates, time savings, easier training for staff, better data collection, and integration with inventory management software. Scanning systems can improve inventory accuracy from 85% to 99%+."
    },
    {
      question: "Do I need special hardware for an inventory scanning system?",
      answer: "Modern inventory scanning systems like StockFlow don't require special hardware. You can use any smartphone or tablet camera to scan barcodes and QR codes. This eliminates the need for expensive dedicated scanners, making inventory scanning accessible to businesses of all sizes."
    },
    {
      question: "Can inventory scanning systems work offline?",
      answer: "Yes, many inventory scanning systems like StockFlow support offline scanning. Scans are stored locally when offline and automatically synchronized when internet connection is restored. This is essential for warehouses or locations with unreliable internet connectivity."
    },
    {
      question: "How much does an inventory scanning system cost?",
      answer: "Inventory scanning system costs vary. StockFlow offers inventory scanning as part of its inventory management software, starting with a free plan. No special hardware is needed - just use your smartphone. This makes inventory scanning accessible and affordable for businesses of all sizes."
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "Mobile Scanning",
      description: "Use any smartphone camera to scan barcodes and QR codes. No special hardware required."
    },
    {
      icon: Scan,
      title: "Multiple Formats",
      description: "Support for UPC, EAN, Code 128, QR codes, and other barcode formats."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Inventory updates instantly when items are scanned, providing immediate visibility."
    },
    {
      icon: Shield,
      title: "Offline Support",
      description: "Scan items offline and sync automatically when connection is restored."
    }
  ];

  const benefits = [
    "Improve inventory accuracy to 99%+",
    "Speed up inventory operations by 10x",
    "Reduce manual data entry errors",
    "Eliminate the need for manual counting",
    "Get real-time inventory updates",
    "Use existing smartphones as scanners",
    "Train staff quickly and easily",
    "Scale scanning operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Inventory Scanning System?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Inventory Scanning System"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Inventory Scanning System 2025 - Inventory Scanning System"
        description="Read the guide inventory scanning system to optimize your inventory management. Learn how inventory scanning system to choose the best software.. Try free now."
        keywords="inventory scanning system, inventory scanning, inventory scanning software, inventory scanning app, barcode scanning inventory, inventory barcode scanning, inventory scanning solution, inventory scanning technology, inventory scanning system software, inventory scanning system app, inventory scanning tools, stockflow, stock flow"
        url="https://www.stockflow.be/inventory-scanning-system"
      />


              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Inventory Scanning System</h1>
      <SeoPageHero
        title="Inventory Scanning System: Complete Guide to Barcode Scanning"
        description="Master inventory scanning system and barcode scanning for inventory. Learn how scanning systems work, benefits, and how to implement them. Free inventory scanning tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Scanning Inventory Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is an <span className="text-blue-600">Inventory Scanning System</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              An inventory scanning system uses barcode scanners or QR code readers to quickly and accurately track inventory. It automates data entry, reduces errors, and provides real-time inventory updates.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inventory Scanning System <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Inventory Scanning System</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Using Inventory Scanning System Today
          </h2>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        }
      ]} />
    </SeoPageLayout>
  );
}



