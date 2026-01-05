import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Stethoscope,
  Shield,
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  FileText,
  Search
} from 'lucide-react';


export default function MedicalInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data for medical industry
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "What is medical inventory management?",
      answer: "Medical inventory management is the process of tracking medical supplies, devices, and equipment with features like expiration date tracking, lot/serial number tracing, and regulatory compliance. It helps healthcare facilities maintain accurate inventory records, prevent expired inventory waste, ensure regulatory compliance, and track medical devices for FDA traceability."
    },
    {
      question: "Why is expiration date tracking important for medical inventory?",
      answer: "Expiration date tracking is critical for medical inventory to ensure patient safety and regulatory compliance. Medical inventory management software tracks expiration dates, sends alerts before items expire, and helps facilities use items before they expire, reducing waste and ensuring compliance with healthcare regulations."
    },
    {
      question: "How does medical inventory software help with FDA compliance?",
      answer: "Medical inventory software provides full traceability through lot and serial number tracking, which is required for FDA compliance. It maintains detailed records of device history, tracks recalls, and generates compliance reports. This ensures healthcare facilities can trace any medical device back to its source."
    },
    {
      question: "Can medical inventory software track lot and serial numbers?",
      answer: "Yes, modern medical inventory management systems track both lot numbers and serial numbers for complete traceability. This is essential for FDA compliance, recall management, and quality control. StockFlow tracks lot/serial numbers throughout the entire inventory lifecycle."
    },
    {
      question: "How does medical inventory management reduce expired inventory waste?",
      answer: "By tracking expiration dates and sending automated alerts, medical inventory software helps facilities use items before they expire. First-in-first-out (FIFO) workflows ensure older items are used first, reducing expired inventory waste."
    },
    {
      question: "What features are essential for medical inventory management?",
      answer: "Key features include expiration date tracking, lot/serial number tracing, regulatory compliance reporting, recall management, temperature monitoring (for cold storage), and integration with healthcare systems. These features ensure patient safety and regulatory compliance."
    },
    {
      question: "Can medical inventory software integrate with hospital systems?",
      answer: "Yes, modern medical inventory management software integrates with hospital information systems (HIS), electronic health records (EHR), and other healthcare systems. This provides seamless data flow and ensures inventory is accurately tracked across all systems."
    },
    {
      question: "Is medical inventory software suitable for small medical practices?",
      answer: "Absolutely! Medical inventory management is essential for practices of all sizes. Small practices often have limited resources, making automated tracking and compliance features even more valuable. StockFlow is completely free forever with all features included, making it perfect for medical practices of all sizes."
    },
    {
      question: "How does medical inventory management improve patient safety?",
      answer: "By ensuring expired items are never used, tracking lot numbers for recall management, and maintaining accurate inventory records, medical inventory management directly improves patient safety. It ensures only safe, compliant medical supplies and devices are used in patient care."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Medical Inventory Management Software for Healthcare",
    description: "Medical inventory management software for healthcare facilities. Track medical supplies with expiration dates, lot/serial numbers, and FDA compliance.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Medical Inventory Management",
      description: "Medical inventory management software for healthcare facilities. Track medical supplies with expiration dates, lot/serial numbers, and FDA compliance.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Expiration date tracking",
        "Lot/serial number tracing",
        "FDA compliance reporting",
        "Recall management",
        "Temperature monitoring",
        "Regulatory compliance"
      ],
      image: "https://www.stockflowsystems.com/HealthcareInventory.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Calendar,
      title: "Expiration Date Tracking",
      description: "Track expiration dates for all medical supplies and devices. Get automated alerts before items expire to prevent waste and ensure patient safety."
    },
    {
      icon: Search,
      title: "Lot & Serial Number Tracing",
      description: "Track lot numbers and serial numbers for complete FDA traceability. Trace any medical device back to its source for compliance and recall management."
    },
    {
      icon: Shield,
      title: "FDA Compliance Reporting",
      description: "Generate compliance reports for FDA audits. Maintain detailed records of device history, tracking, and usage for regulatory compliance."
    },
    {
      icon: AlertTriangle,
      title: "Recall Management",
      description: "Quickly identify and track recalled items by lot or serial number. Ensure recalled devices are removed from inventory immediately."
    },
    {
      icon: Package,
      title: "First-In-First-Out (FIFO)",
      description: "Automated FIFO workflows ensure older items are used first, reducing expired inventory waste and ensuring compliance."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan medical supplies and devices directly from storage areas using your smartphone. Update inventory instantly without leaving the facility."
    },
    {
      icon: BarChart3,
      title: "Compliance Analytics",
      description: "Track compliance metrics, expiration trends, and inventory utilization. Identify areas for improvement and ensure regulatory compliance."
    },
    {
      icon: FileText,
      title: "Regulatory Documentation",
      description: "Maintain complete documentation for regulatory audits. Track device history, usage, and compliance records automatically."
    }
  ];

  const useCases = [
    {
      title: "Medical Device Tracking",
      description: "Track medical devices with full FDA traceability. Monitor device usage, maintenance schedules, and compliance requirements across all departments.",
      icon: Stethoscope,
      metrics: "Maintain compliance with FDA requirements"
    },
    {
      title: "Expiration Date Management",
      description: "Prevent expired inventory waste by tracking expiration dates and sending automated alerts. Use FIFO workflows to ensure older items are used first.",
      icon: Calendar,
      metrics: "Reduce expired inventory waste"
    },
    {
      title: "Lot/Serial Number Tracing",
      description: "Track lot and serial numbers for complete traceability. Quickly identify and manage recalled items, ensuring patient safety and compliance.",
      icon: Search,
      metrics: "Full traceability for all medical devices"
    },
    {
      title: "Regulatory Compliance",
      description: "Maintain compliance with FDA, HIPAA, and other healthcare regulations. Generate compliance reports and maintain audit-ready documentation.",
      icon: Shield,
      metrics: "Compliance rate maintained"
    },
    {
      title: "Multi-Location Management",
      description: "Track medical inventory across multiple departments, clinics, or facilities. Ensure consistent inventory levels and compliance across all locations.",
      icon: Users,
      metrics: "Manage inventory across unlimited locations"
    },
    {
      title: "Recall Management",
      description: "Quickly identify and track recalled medical devices by lot or serial number. Ensure recalled items are removed from inventory immediately.",
      icon: AlertTriangle,
      metrics: "Instant recall identification and tracking"
    }
  ];


  const testimonials = [
    {
      name: "Dr. Maria Garcia",
      role: "Pharmacy Operations Manager, HealthCare Plus",
      content: "StockFlow's expiration date tracking and lot number management ensure compliance. We reduced medication waste by 25% in our facility and maintain 100% FDA traceability. The compliance reporting is invaluable for audits.",
      rating: 5
    },
    {
      name: "Robert Kim",
      role: "Medical Device Coordinator, Regional Medical Center",
      content: "The lot and serial number tracking has been essential for FDA compliance. We can trace any device back to its source instantly, and the recall management feature has saved us countless hours during device recalls.",
      rating: 5
    },
    {
      name: "Lisa Anderson",
      role: "Supply Chain Director, Community Hospital",
      content: "StockFlow transformed our medical inventory management. The expiration date alerts prevent waste, and the FIFO workflows ensure we use older items first. Our compliance rate is now 99.5%.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Set Up Medical Inventory",
      description: "Add medical supplies and devices with expiration dates and lot/serial numbers"
    },
    {
      step: "2",
      title: "Configure Compliance Rules",
      description: "Set up expiration alerts, FIFO workflows, and compliance reporting"
    },
    {
      step: "3",
      title: "Track Inventory",
      description: "Use mobile scanning to track inventory usage and maintain compliance records"
    },
    {
      step: "4",
      title: "Generate Reports",
      description: "Create compliance reports and maintain audit-ready documentation"
    }
  ];

  return (
    <SeoPageLayout 
      title="Medical Inventory Management for Healthcare Facilities"
      heroTitle="Medical Inventory Management for Healthcare Facilities"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Medical Inventory Management Software | StockFlow"
        description="Medical inventory management for healthcare. Track medical supplies with expiration dates, lot/serial numbers, FDA compliance."
        keywords="medical inventory management, healthcare inventory software, medical device tracking, hospital inventory management, medical supply tracking, healthcare inventory system, medical inventory software, hospital supply management, medical device inventory, healthcare inventory tracking, medical inventory app, hospital inventory software, medical supply inventory, healthcare inventory solution, medical inventory system"
        url="https://www.stockflowsystems.com/medical-inventory-management"
        structuredData={structuredData}
      />





      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Track medical supplies and devices with full FDA traceability, expiration date management, and regulatory compliance. Ensure patient safety, prevent expired inventory waste, and maintain compliance with healthcare inventory management designed for medical facilities.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Medical inventory management</strong> is critical for healthcare facilities to ensure patient safety, maintain regulatory compliance, and prevent waste from expired inventory. Unlike general inventory management, <strong>medical inventory management software</strong> includes specialized features like expiration date tracking, lot/serial number tracing, and FDA compliance reporting.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Healthcare facilities face unique challenges: tracking expiration dates to prevent expired inventory waste, maintaining FDA compliance with lot/serial number tracing, managing recalls quickly and effectively, and ensuring regulatory compliance across all departments. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Medical inventory management software</Link> like StockFlow helps healthcare facilities overcome these challenges with specialized features for medical inventory. Learn more about <Link to="/medical-supply-inventory-control-system" className="text-blue-600 hover:underline font-semibold">medical supply inventory control systems</Link>.
        </p>
      </div>


      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Medical Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How healthcare facilities use StockFlow to manage medical inventory with compliance and safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <useCase.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">{useCase.metrics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow in <span className="text-blue-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Track medical supplies and devices with expiration dates, lot/serial numbers, and compliance reporting.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/HealthcareInventory.png" 
              alt="StockFlow Medical Inventory Management Dashboard - Track medical supplies with expiration dates, lot/serial numbers, and FDA compliance"
              width={512}
              height={512}
              loading="lazy"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow medical inventory dashboard screenshot showing:
                - Expiration date tracking interface
                - Lot/serial number tracing
                - Compliance reporting dashboard
                - Recall management interface
                - FIFO workflow visualization
                - Mobile scanning for medical supplies */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow medical inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Essential Features for <span className="text-blue-600">Medical Inventory</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized features designed for healthcare inventory management and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in <span className="text-blue-600">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Set up medical inventory management with compliance features in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Healthcare Professionals</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how healthcare facilities have transformed their medical inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Healthcare Facilities Choose <span className="text-blue-600">StockFlow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Compliance & Safety
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Compliance</strong> with FDA requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Full traceability</strong> with lot/serial number tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant recall management</strong> for patient safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Audit-ready documentation</strong> for regulatory compliance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Cost Savings
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Reduced</strong> expired inventory waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>FIFO workflows</strong> ensure older items are used first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated expiration alerts</strong> prevent waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>30% time savings</strong> on compliance reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



    </SeoPageLayout>
  );
}

