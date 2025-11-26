import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Smartphone,
  QrCode,
  MapPin,
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Camera,
  WifiOff
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function ConstructionInventoryApp() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is a construction inventory app?",
      answer: "A construction inventory app is mobile software that enables construction workers to track materials, tools, and equipment directly from job sites using smartphones or tablets. It includes barcode scanning, offline capability for remote sites, real-time inventory updates, material receipt tracking, equipment location monitoring, and multi-job site management. Construction inventory apps eliminate the need to return to the office to update inventory, saving time and improving accuracy."
    },
    {
      question: "Why do construction companies need mobile inventory apps?",
      answer: "Construction sites are often remote with poor internet connectivity. Materials are stored across multiple job sites. Field workers need to update inventory in real-time. Traditional desktop inventory systems require workers to return to the office, causing delays and errors. Mobile construction inventory apps enable field workers to scan materials, update stock levels, check availability, and request deliveries directly from job sites, even without internet connectivity."
    },
    {
      question: "How does offline functionality work in construction inventory apps?",
      answer: "Offline-capable construction inventory apps store data locally on the device when internet is unavailable. Workers can scan barcodes, update inventory, and check stock levels offline. When internet connectivity is restored, the app automatically syncs all changes to the cloud. This is critical for remote construction sites with poor connectivity. StockFlow's mobile app works completely offline, making it perfect for construction sites."
    },
    {
      question: "What features should a construction inventory app have?",
      answer: "Essential features include: mobile barcode scanning, offline capability, multi-job site tracking, material receipt tracking, equipment location monitoring, photo attachments, real-time sync when online, low-stock alerts, material transfer between sites, and reporting. StockFlow's mobile app includes all these features, making it ideal for construction companies."
    },
    {
      question: "Can construction inventory apps track equipment and tools?",
      answer: "Yes, modern construction inventory apps track both materials and equipment. Equipment tracking includes current location (which job site), maintenance schedules, service history, operator assignments, and utilization rates. This prevents equipment loss, ensures proper maintenance, and optimizes equipment allocation across multiple projects. StockFlow supports both material and equipment tracking in the mobile app."
    },
    {
      question: "How much does a construction inventory app cost?",
      answer: `Construction inventory app pricing varies. Basic apps start at ${formatPrice(50)}/month. Enterprise solutions can cost ${formatPrice(200)}-${formatPrice(1000)}/month. StockFlow offers a construction inventory app starting with a free plan for up to 30 products, with scalable pricing (€0.004 per product/month), making it affordable for small contractors and growing construction companies.`
    },
    {
      question: "Do construction inventory apps work on iOS and Android?",
      answer: "Yes, modern construction inventory apps are available for both iOS (iPhone, iPad) and Android devices. This ensures all workers can use the app regardless of their device. StockFlow's mobile app works on both iOS and Android, with offline capability on both platforms."
    },
    {
      question: "How do construction inventory apps prevent material theft?",
      answer: "Construction inventory apps prevent theft through: real-time tracking of high-value materials, location monitoring (know where materials are stored), access controls (who can check out materials), usage tracking (materials assigned to specific projects), automated alerts for unusual activity, and regular audits with mobile scanning. Quick detection of discrepancies helps identify and prevent theft."
    }
  ];

  const keyFeatures = [
    {
      icon: QrCode,
      title: "Mobile Barcode Scanning",
      description: "Scan materials and equipment on job sites with smartphone cameras for instant inventory updates."
    },
    {
      icon: WifiOff,
      title: "Offline Capability",
      description: "Work completely offline on remote construction sites. Data syncs automatically when connectivity is restored."
    },
    {
      icon: MapPin,
      title: "Multi-Job Site Tracking",
      description: "Track materials and equipment across multiple construction sites with location-specific inventory levels."
    },
    {
      icon: Camera,
      title: "Photo Attachments",
      description: "Attach photos to inventory records for documentation, damage reporting, and visual verification."
    },
    {
      icon: BarChart3,
      title: "Real-Time Reporting",
      description: "View inventory levels, material usage, and equipment status in real-time from any job site."
    },
    {
      icon: Shield,
      title: "Theft Prevention",
      description: "Real-time tracking, access controls, and audit trails to prevent material theft and loss."
    }
  ];

  const benefits = [
    { icon: Clock, text: "Save 10+ hours per week on inventory tasks" },
    { icon: CheckCircle, text: "Update inventory in real-time from job sites" },
    { icon: DollarSign, text: "Reduce material waste by 15-25%" },
    { icon: Shield, text: "Prevent theft and loss of high-value materials" },
    { icon: TrendingUp, text: "Improve inventory accuracy to 99%+" },
    { icon: MapPin, text: "Track materials across multiple job sites" }
  ];

  const useCases = [
    {
      title: "Material Receipt on Job Sites",
      description: "Scan materials as they arrive on job sites, update inventory instantly, and track deliveries without returning to the office.",
      icon: "📦"
    },
    {
      title: "Equipment Location Tracking",
      description: "Track construction equipment and tools across multiple job sites, knowing exactly where each item is located.",
      icon: "🚜"
    },
    {
      title: "Inventory Audits",
      description: "Conduct quick inventory audits on job sites using mobile scanning, identifying discrepancies immediately.",
      icon: "📋"
    },
    {
      title: "Material Transfers",
      description: "Transfer materials between job sites with mobile tracking, ensuring accurate inventory across all locations.",
      icon: "🚚"
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Remote Job Sites with Poor Connectivity",
      problem: "Construction sites are often remote with no internet, making it impossible to use cloud-based inventory systems.",
      solution: "Offline-capable mobile apps work without internet, syncing data automatically when connectivity is restored."
    },
    {
      icon: Clock,
      title: "Delayed Inventory Updates",
      problem: "Field workers must return to the office to update inventory, causing delays and errors in stock levels.",
      solution: "Mobile apps enable real-time inventory updates directly from job sites, eliminating delays."
    },
    {
      icon: DollarSign,
      title: "Material Theft & Loss",
      problem: "Construction sites lose 1-2% of material value to theft, with high-value items most at risk.",
      solution: "Real-time tracking and mobile audits detect discrepancies quickly, preventing and identifying theft."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Construction Inventory App 2025",
    "description": "Complete guide to construction inventory apps. Track materials, tools, and equipment from job sites with mobile scanning, offline capability, and real-time updates. Free plan available.",
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
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflow.be/solutions/construction-inventory-app"
    }
  };

  const faqStructuredData = {
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
  };

  return (
    <SeoPageLayout
      title="Construction Inventory App 2025"
      heroTitle="Construction Inventory App: Track Materials & Equipment from Job Sites"
      description="Complete construction inventory app guide. Track materials, tools, and equipment from job sites with mobile scanning, offline capability, and real-time updates. Free plan available."
      updatedDate="2025-01-15"
      faqData={faqData}
    >
      <SEO
        title="Construction Inventory App 2025 | Free Plan | StockFlow"
        description="Learn how construction inventory apps help track materials and equipment from job sites. Mobile scanning, offline capability, real-time updates. Start free today."
        keywords="construction inventory app, construction inventory mobile app, construction materials app, job site inventory app, construction inventory tracking app, mobile construction inventory, construction inventory software mobile, construction app inventory, construction materials tracking app, construction inventory management app"
        url="https://www.stockflow.be/solutions/construction-inventory-app"
        structuredData={[structuredData, faqStructuredData]}
      />

      <StructuredData data={[structuredData, faqStructuredData]} />

      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            A <strong>construction inventory app</strong> is mobile software that enables construction workers to track materials, tools, and equipment directly from job sites using smartphones or tablets. Unlike desktop inventory systems that require workers to return to the office, construction inventory apps enable field workers to scan materials, update stock levels, check availability, and request deliveries directly from job sites, even without internet connectivity.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Construction sites face unique challenges: remote locations with poor internet connectivity, materials stored across multiple job sites, and the need for real-time inventory updates. Mobile <Link to="/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> apps like StockFlow solve these challenges with offline capability, multi-job site tracking, and real-time sync when connectivity is available.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Learn more about <Link to="/solutions/construction-inventory-management-system" className="text-blue-600 hover:underline font-semibold">construction inventory management systems</Link> for comprehensive construction inventory solutions, or explore <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> for general inventory control.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features of Construction Inventory Apps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Common Use Cases for Construction Inventory Apps
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Benefits of Construction Inventory Apps
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-lg">
                <benefit.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Common Challenges Solved by Construction Inventory Apps
          </h2>
          <div className="grid md:grid-cols-1 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <challenge.icon className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{challenge.title}</h3>
                <p className="text-slate-600 mb-3"><strong>Problem:</strong> {challenge.problem}</p>
                <p className="text-slate-700"><strong>Solution:</strong> {challenge.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Getting Started with Construction Inventory Apps
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Download Mobile App</h3>
                <p className="text-slate-600">Download StockFlow's mobile app on iOS or Android devices for all field workers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Set Up Job Site Locations</h3>
                <p className="text-slate-600">Configure all job sites and storage areas in the system for multi-location tracking.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Train Workers on Mobile Scanning</h3>
                <p className="text-slate-600">Train field workers to use mobile barcode scanning for material receipts, transfers, and inventory counts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Enable Offline Mode</h3>
                <p className="text-slate-600">Use offline mode on remote job sites. Data syncs automatically when connectivity is restored.</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-slate-700">
            StockFlow's construction inventory app works on both iOS and Android, with complete offline capability for remote job sites. Start with a free plan and scale as your construction business grows.
          </p>
        </div>
      </section>
    </SeoPageLayout>
  );
}

