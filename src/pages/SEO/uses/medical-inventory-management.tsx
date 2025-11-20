import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  TrendingUp,
  Package,
  Clock,
  DollarSign,
  AlertCircle,
  Target,
  Boxes,
  FileText,
  Settings,
  Stethoscope,
  HeartPulse,
  Truck,
  BarChart3,
  MapPin,
  QrCode,
  Calendar,
  Activity
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';

export default function MedicalInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is medical inventory management?",
      answer: "Medical inventory management is a specialized system for tracking, controlling, and managing medical supplies, pharmaceuticals, equipment, and devices in healthcare facilities. It ensures proper stock levels, expiration tracking, lot/serial number traceability, regulatory compliance (FDA, ISO 13485), and patient safety while minimizing waste and costs."
    },
    {
      question: "Why is inventory management critical in healthcare?",
      answer: "Medical inventory directly impacts patient safety and care quality. Stockouts can delay treatments or surgeries, while overstocking ties up capital in expensive supplies that may expire. Proper tracking ensures regulatory compliance, prevents expired product use, enables recalls, reduces waste (healthcare facilities waste 10-30% of supplies), and protects patients through full traceability."
    },
    {
      question: "What medical supplies need lot and serial number tracking?",
      answer: "Implantable devices (pacemakers, joint replacements, stents), surgical instruments, pharmaceuticals, blood products, vaccines, contrast agents, high-value equipment, and any items subject to FDA recalls must have complete lot/serial tracking. This enables immediate identification and removal of affected products during recalls."
    },
    {
      question: "How do you manage expiration dates in medical inventory?",
      answer: "Implement FEFO (First Expired, First Out) rotation, use automated expiration alerts (30/60/90 days before expiry), conduct regular audits of expiring items, integrate barcode scanning to flag expired products at point of use, and generate reports showing items approaching expiration for proactive management and disposition."
    },
    {
      question: "What are the biggest challenges in medical inventory management?",
      answer: "Top challenges include: managing thousands of SKUs with varying storage requirements, tracking expiration dates and lot numbers, regulatory compliance and documentation, high costs of medical supplies (30-40% of non-labor costs), preventing stockouts of critical items, managing par levels across multiple departments, reducing waste from expiration, and maintaining audit trails for compliance."
    },
    {
      question: "How much does medical inventory management software cost?",
      answer: "Costs vary significantly. Basic systems start at €100-500/month. Enterprise healthcare-specific systems can cost €1,000-10,000+/month. StockFlow offers a scalable solution starting with a free plan for up to 100 products, with pay-as-you-grow pricing (€0.004 per product/month for products 101+), making it affordable for clinics, pharmacies, and small healthcare facilities."
    },
    {
      question: "Does medical inventory software integrate with EMR/EHR systems?",
      answer: "Modern inventory systems can integrate with Electronic Medical Records (EMR) and Electronic Health Records (EHR) through APIs. This enables automatic inventory deduction when supplies are used for patient care, links supply costs to patient billing, and provides a complete audit trail from receipt to patient use."
    },
    {
      question: "How can healthcare facilities reduce medical supply waste?",
      answer: "Implement proper expiration tracking with FEFO rotation, use automated alerts for approaching expiration, conduct cycle counting to maintain accurate records, analyze usage patterns to optimize par levels, implement preference cards for surgical procedures, train staff on proper storage and handling, and use data analytics to identify waste patterns."
    }
  ];

  const keyFeatures = [
    {
      icon: QrCode,
      title: "Lot & Serial Number Tracking",
      description: "Complete traceability for medical devices, implants, and pharmaceuticals with automated lot/serial capture."
    },
    {
      icon: Calendar,
      title: "Expiration Date Management",
      description: "Automated alerts for expiring items with FEFO (First Expired, First Out) rotation and disposal tracking."
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Maintain FDA, ISO 13485, and healthcare regulation compliance with complete audit trails and documentation."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan GS1 barcodes on medical supplies for instant receipt, dispensing, and usage tracking."
    },
    {
      icon: MapPin,
      title: "Multi-Location Management",
      description: "Track inventory across departments, storage areas, crash carts, and satellite locations in real-time."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics & Reporting",
      description: "Analyze consumption patterns, identify waste, optimize par levels, and track costs per department or procedure."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Expired Medications & Supplies",
      problem: "10-30% of medical supplies expire before use, wasting thousands in inventory costs.",
      solution: "Automated expiration tracking with 30/60/90-day alerts and FEFO rotation ensures oldest items are used first."
    },
    {
      icon: Target,
      title: "Stockouts of Critical Items",
      problem: "Running out of essential supplies can delay procedures and compromise patient care.",
      solution: "Automated reorder points with real-time tracking prevent stockouts while avoiding overstocking."
    },
    {
      icon: FileText,
      title: "Regulatory Compliance & Recalls",
      problem: "Inability to quickly identify and remove recalled items puts patients at risk and violates regulations.",
      solution: "Complete lot/serial tracking enables instant identification of affected products during recalls."
    },
    {
      icon: DollarSign,
      title: "High Inventory Carrying Costs",
      problem: "Medical supplies represent 30-40% of non-labor operating costs, tying up valuable capital.",
      solution: "Data-driven par level optimization reduces excess inventory while maintaining adequate stock."
    },
    {
      icon: Activity,
      title: "Manual Counting & Documentation",
      problem: "Staff spend hours counting inventory manually, taking time away from patient care.",
      solution: "Mobile barcode scanning and cycle counting reduce inventory management time by 75%."
    },
    {
      icon: Boxes,
      title: "Poor Visibility Across Departments",
      problem: "Don't know what's available in other departments, leading to duplicate orders and hoarding.",
      solution: "Centralized system with multi-location tracking provides real-time visibility across entire facility."
    }
  ];

  const essentialCategories = [
    {
      category: "Pharmaceuticals",
      items: ["Prescription medications", "Over-the-counter drugs", "IV solutions", "Controlled substances", "Vaccines", "Biologics"],
      tracking: "Lot numbers, expiration dates, NDC codes, controlled substance logs"
    },
    {
      category: "Surgical Supplies",
      items: ["Sutures", "Surgical gloves", "Drapes & gowns", "Sponges & gauze", "Catheters", "Surgical instruments"],
      tracking: "Lot numbers, expiration dates, sterilization records"
    },
    {
      category: "Implantable Devices",
      items: ["Orthopedic implants", "Cardiac devices", "Stents", "Mesh & grafts", "Screws & plates"],
      tracking: "Serial numbers, UDI, patient implant records, manufacturer details"
    },
    {
      category: "Diagnostic Supplies",
      items: ["Lab reagents", "Test strips", "Specimen containers", "Blood collection tubes", "Culture media"],
      tracking: "Lot numbers, expiration dates, calibration records"
    },
    {
      category: "Patient Care Supplies",
      items: ["Bandages & dressings", "Syringes & needles", "Gloves", "Masks & PPE", "IV supplies", "Wound care"],
      tracking: "Lot numbers, expiration dates, usage by department"
    },
    {
      category: "Medical Equipment",
      items: ["Monitors", "Defibrillators", "Infusion pumps", "Ventilators", "Diagnostic devices"],
      tracking: "Serial numbers, maintenance schedules, calibration dates, location"
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce supply costs by 15-30%" },
    { icon: Clock, text: "Save 15+ hours per week on inventory tasks" },
    { icon: CheckCircle, text: "Eliminate stockouts of critical supplies" },
    { icon: Shield, text: "100% regulatory compliance & traceability" },
    { icon: TrendingUp, text: "Reduce waste from expired items by 60-80%" },
    { icon: Target, text: "Improve patient safety with recall management" },
    { icon: BarChart3, text: "Better cost allocation to departments/procedures" },
    { icon: Star, text: "More time for patient care, less admin work" }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Catalog Medical Supplies",
      description: "Create comprehensive catalog with NDC codes, UDI, lot/serial requirements, expiration tracking needs, storage requirements, and par levels for each item."
    },
    {
      step: "2",
      title: "Set Up Location Hierarchy",
      description: "Define departments, storage rooms, medication rooms, crash carts, and satellite locations. Establish par levels for each location based on usage patterns."
    },
    {
      step: "3",
      title: "Implement Barcode Scanning",
      description: "Equip staff with mobile devices or scanners. Ensure capability to scan GS1 barcodes containing lot, serial, and expiration data automatically."
    },
    {
      step: "4",
      title: "Configure Expiration Alerts",
      description: "Set up automated alerts at 90, 60, and 30 days before expiration. Configure FEFO rotation rules and near-expiry reports."
    },
    {
      step: "5",
      title: "Establish Reorder Points",
      description: "Set minimum and maximum par levels for each item/location. Configure automated reorder alerts and purchase order generation."
    },
    {
      step: "6",
      title: "Enable Lot/Serial Tracking",
      description: "Configure mandatory lot/serial capture for implants, devices, and critical supplies. Set up patient implant logging for traceability."
    },
    {
      step: "7",
      title: "Train Clinical & Supply Staff",
      description: "Train on scanning procedures, expiration checking, proper storage, and documentation requirements. Emphasize patient safety and compliance."
    },
    {
      step: "8",
      title: "Implement Cycle Counting",
      description: "Establish regular cycle counting schedules by department. Use mobile scanning for fast, accurate counts without disrupting operations."
    },
    {
      step: "9",
      title: "Monitor & Optimize",
      description: "Review expiration reports, usage analytics, and cost data monthly. Adjust par levels based on actual consumption patterns and seasonal variations."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Emily Richardson",
      role: "Medical Director, Community Health Clinic",
      content: "StockFlow's expiration tracking has been a lifesaver. We reduced waste from expired medications by 75% in the first 6 months. The lot tracking gives us complete confidence in our recall response capabilities.",
      rating: 5,
      business: "Multi-location clinic, 25 staff"
    },
    {
      name: "James Martinez",
      role: "Supply Chain Manager, Regional Hospital",
      content: "We manage 5,000+ medical SKUs across 12 departments. StockFlow's mobile scanning and multi-location tracking cut our inventory management time from 20 hours to 5 hours per week while improving accuracy to 99%+.",
      rating: 5,
      business: "200-bed hospital"
    },
    {
      name: "Sarah Kim",
      role: "Pharmacy Manager, Specialty Pharmacy",
      content: "The lot number tracking and expiration management are exactly what we needed for regulatory compliance. Automated alerts ensure we never dispense expired medications, and audit trails make inspections effortless.",
      rating: 5,
      business: "Specialty pharmacy"
    }
  ];

  const regulatoryRequirements = [
    {
      title: "FDA Medical Device Tracking",
      requirements: [
        "Track implantable devices from receipt to patient",
        "Maintain records of lot/serial numbers",
        "Document patient implant information",
        "Enable rapid response to device recalls"
      ]
    },
    {
      title: "Drug Supply Chain Security Act (DSCSA)",
      requirements: [
        "Serialize pharmaceutical products",
        "Verify legitimate product sources",
        "Detect and remove counterfeit drugs",
        "Maintain chain of custody documentation"
      ]
    },
    {
      title: "ISO 13485 / Quality Management",
      requirements: [
        "Document inventory procedures",
        "Maintain traceability records",
        "Implement CAPA for inventory issues",
        "Conduct regular audits and reviews"
      ]
    },
    {
      title: "Joint Commission Standards",
      requirements: [
        "Proper storage of medications",
        "Expired medication removal process",
        "Medication security and access control",
        "Regular inventory audits"
      ]
    }
  ];

  const costSavings = [
    {
      title: "Reduced Expired Product Waste",
      before: "€15,000/year lost to expired medications",
      after: "€3,000/year—80% reduction",
      savings: "€12,000/year saved"
    },
    {
      title: "Optimized Inventory Levels",
      before: "€200,000 tied up in excess inventory",
      after: "€120,000—40% reduction",
      savings: "€80,000 freed up for other needs"
    },
    {
      title: "Labor Time Savings",
      before: "20 hours/week on manual inventory management",
      after: "5 hours/week—75% reduction",
      savings: "€30,000+/year at €40/hr loaded cost"
    },
    {
      title: "Prevented Stockouts",
      before: "5-10 supply shortages per month",
      after: "Less than 1 per month",
      savings: "Improved patient care & procedure efficiency"
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'challenges', title: 'Healthcare Challenges', level: 1 },
    { id: 'features', title: 'Key Features', level: 1 },
    { id: 'essential-categories', title: 'What to Track', level: 1 },
    { id: 'regulatory', title: 'Regulatory Requirements', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'cost-savings', title: 'Cost Savings', level: 1 },
    { id: 'implementation', title: 'Implementation Guide', level: 1 },
    { id: 'stockflow-solution', title: 'StockFlow for Healthcare', level: 1 },
    { id: 'testimonials', title: 'Success Stories', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Medical Inventory Management"
      heroTitle="Medical Inventory Management"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Medical Inventory Management 2025 - Medical Inventory Man..."
        description="Discover how medical inventory management to save time and money. Read the guide medical inventory management to optimize your inventory. Get started free."
        keywords="medical inventory management, healthcare inventory software, hospital inventory system, pharmacy inventory management, medical supply tracking, expiration date tracking, lot number tracking, medical device traceability, FDA compliance, ISO 13485, healthcare supply chain"
        url="https://www.stockflow.be/medical-inventory-management"
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Track medical supplies, pharmaceuticals, and devices with full expiration management, lot/serial traceability, and regulatory compliance. Reduce waste, prevent stockouts, and ensure patient safety.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Medical inventory management is fundamentally different from general inventory control. Healthcare facilities must track expiration dates, maintain complete lot and serial number traceability, ensure regulatory compliance, prevent use of expired or recalled products, and manage thousands of SKUs with varying storage requirements.
        </p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Healthcare Facilities Need Specialized Inventory Management</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Medical inventory management is fundamentally different from general inventory control. Healthcare facilities must track <strong>expiration dates</strong>, maintain complete <strong>lot and serial number traceability</strong>, ensure <strong>regulatory compliance</strong> (FDA, ISO 13485, Joint Commission), prevent use of expired or recalled products, and manage thousands of SKUs with varying storage requirements—all while reducing waste and controlling costs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Medical supplies typically represent <strong>30-40% of non-labor operating costs</strong> for healthcare facilities, yet 10-30% of supplies expire before use. A specialized medical inventory system addresses these unique challenges while improving patient safety and operational efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <HeartPulse className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Patient Safety</h3>
              <p className="text-gray-700">Complete traceability prevents use of expired/recalled items and enables immediate recall response</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <DollarSign className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€122K+</h3>
              <p className="text-gray-700">Average annual savings from reduced waste, optimized stock levels, and labor efficiency</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100% Compliant</h3>
              <p className="text-gray-700">Meet FDA, ISO 13485, and Joint Commission requirements with complete audit trails</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Healthcare Inventory Challenges</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These challenges cost healthcare facilities thousands in waste, compromise patient safety, and increase regulatory risk.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <challenge.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-600 mb-1">Problem:</p>
                  <p className="text-sm text-gray-700 mb-3">{challenge.problem}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-1">Solution:</p>
                  <p className="text-sm text-green-700">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential Features for Healthcare</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Purpose-built features that address the unique needs of medical inventory management.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Healthcare Solution</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">GS1 Barcode Support</p>
                  <p className="text-sm text-gray-700">Automatic extraction of lot, serial, and expiration from GS1 barcodes</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Patient Implant Logs</p>
                  <p className="text-sm text-gray-700">Link implantable devices to patient records for complete traceability</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Recall Management</p>
                  <p className="text-sm text-gray-700">Instantly identify affected products and patients during recalls</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Temperature Monitoring</p>
                  <p className="text-sm text-gray-700">Track storage conditions for temperature-sensitive items</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Controlled Substance Tracking</p>
                  <p className="text-sm text-gray-700">Special logging and security for Schedule II-V medications</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Audit Trail</p>
                  <p className="text-sm text-gray-700">Complete history of all transactions for regulatory compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Categories Section */}
      <section id="essential-categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Medical Supply Categories to Track</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Common medical inventory categories and their specific tracking requirements.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <Boxes className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Tracking Required:</p>
                  <p className="text-xs text-blue-700">{category.tracking}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Section */}
      <section id="regulatory" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Regulatory Compliance Requirements</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Healthcare inventory systems must comply with multiple regulatory standards and requirements.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {regulatoryRequirements.map((reg, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">{reg.title}</h3>
                </div>
                <ul className="space-y-2">
                  {reg.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong>Compliance Note:</strong> StockFlow provides the tracking and documentation capabilities required for FDA, ISO 13485, and Joint Commission compliance. However, facilities remain responsible for establishing proper procedures, training staff, and conducting regular audits to maintain compliance with all applicable regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits of Medical Inventory Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-10 h-10 text-blue-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Savings Section */}
      <section id="cost-savings" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Real Cost Savings for Healthcare Facilities</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Based on actual data from a 200-bed regional hospital using StockFlow.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {costSavings.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-800 mb-1">Before:</p>
                    <p className="text-gray-700">{item.before}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">After StockFlow:</p>
                    <p className="text-gray-700">{item.after}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-lg font-bold text-blue-900">{item.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-xl p-8 border border-gray-200 text-center">
            <h3 className="text-3xl font-bold text-green-600 mb-4">Total Annual Savings: €122,000+</h3>
            <p className="text-xl text-gray-700">
              Plus immeasurable benefits in patient safety, regulatory compliance, and staff satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Guide Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Implementation Guide for Healthcare</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Step-by-step guide to implementing medical inventory management in your facility.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {implementationSteps.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* StockFlow Solution Section */}
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Stethoscope className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Healthcare</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Medical inventory management designed for patient safety, regulatory compliance, and operational efficiency—at a price that works for facilities of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Start Free</div>
              <div className="text-sm opacity-90">Up to 100 products • No credit card • Full features</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0.004</div>
              <div className="text-lg font-semibold mb-2">Per Product/Month</div>
              <div className="text-sm opacity-90">Scalable pricing for growing facilities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">Healthcare never sleeps—neither do we</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Healthcare Needs</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Expiration date tracking & FEFO</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Lot & serial number traceability</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>GS1 barcode scanning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Multi-location tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Automated reorder alerts</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Patient implant logging</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Recall management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Complete audit trails</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Usage analytics & reporting</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Start Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 100+ healthcare facilities using StockFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Healthcare</h2>
            <p className="text-lg text-gray-600">Real results from medical facilities using StockFlow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything healthcare facilities need to know about medical inventory management</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <AccordionTrigger className="flex items-center justify-between px-6 py-5 text-left text-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <Stethoscope className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Patient Safety & Reduce Waste?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join healthcare facilities reducing waste, ensuring compliance, and improving patient safety with StockFlow's medical inventory management software.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Start Free Trial
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center bg-white text-gray-800 font-semibold px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all text-lg"
              >
                Schedule Demo
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-6">
              Free plan • HIPAA compliant • FDA-ready tracking
            </p>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "StockFlow Medical Inventory Management",
          "description": "Medical inventory management software with expiration tracking, lot/serial traceability, and regulatory compliance for healthcare facilities.",
          "url": "https://www.stockflow.be/medical-inventory-management"
        },
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
          "name": "StockFlow - Medical Inventory Management Software",
          "description": "Healthcare inventory management with expiration tracking, lot/serial traceability, regulatory compliance, and barcode scanning.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Medical Inventory Management Software",
          "operatingSystem": "Web Browser, iOS, Android",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 products",
              "availability": "https://schema.org/InStock"
            }
          ],
          "featureList": [
            "Expiration date tracking",
            "Lot and serial number traceability",
            "GS1 barcode scanning",
            "Regulatory compliance",
            "Multi-location tracking",
            "Patient implant logging"
          ]
        }
      ]} />
    </SeoPageLayout>
  );
}

