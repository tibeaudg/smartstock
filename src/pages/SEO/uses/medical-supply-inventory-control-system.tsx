import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Shield,
  QrCode,
  Calendar,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  Activity
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function MedicalSupplyInventoryControlSystem() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is a medical supply inventory control system?",
      answer: "A medical supply inventory control system is specialized software for tracking, managing, and controlling medical supplies, pharmaceuticals, and equipment in healthcare facilities. It ensures proper stock levels, expiration tracking, lot/serial number traceability, regulatory compliance (FDA, ISO 13485), patient safety, and cost control. Unlike generic inventory systems, medical supply inventory control systems handle expiration dates, lot tracking, recall management, and regulatory compliance requirements."
    },
    {
      question: "Why do healthcare facilities need specialized inventory control systems?",
      answer: "Medical supplies have unique requirements: expiration dates must be tracked (FEFO rotation), lot and serial numbers are required for recalls, regulatory compliance (FDA, ISO 13485) is mandatory, patient safety depends on accurate tracking, high costs (30-40% of non-labor expenses) require optimization, and stockouts can delay critical procedures. Generic inventory systems can't handle these complexities, leading to compliance violations, waste, and patient safety risks."
    },
    {
      question: "What medical supplies need inventory control?",
      answer: "All medical supplies should be tracked, especially: pharmaceuticals (prescription drugs, IV solutions, controlled substances), surgical supplies (sutures, gloves, instruments), implantable devices (pacemakers, stents, joint replacements), diagnostic supplies (lab reagents, test strips), patient care supplies (bandages, syringes, PPE), and medical equipment (monitors, defibrillators, infusion pumps). High-value items and those requiring lot/serial tracking need the most control."
    },
    {
      question: "How does expiration date tracking work in medical inventory control?",
      answer: "Medical supply inventory control systems track expiration dates for all time-sensitive items. FEFO (First Expired, First Out) rotation ensures oldest items are used first. Automated alerts notify staff 30/60/90 days before expiration. Barcode scanning flags expired products at point of use. Reports show items approaching expiration for proactive management. StockFlow's medical inventory system includes automated expiration tracking with customizable alert thresholds."
    },
    {
      question: "What is lot and serial number tracking in medical inventory?",
      answer: "Lot and serial number tracking records the specific batch (lot) or individual unit (serial) for each medical supply. This is critical for recalls - when a manufacturer issues a recall, the system can instantly identify all affected products by lot/serial number and remove them from use. Implantable devices, pharmaceuticals, and high-risk supplies require complete lot/serial tracking for patient safety and regulatory compliance."
    },
    {
      question: "How much does a medical supply inventory control system cost?",
      answer: `Medical inventory control system pricing varies. Basic systems start at ${formatPrice(200)}/month. Enterprise healthcare-specific systems can cost ${formatPrice(1000)}-${formatPrice(10000)}/month. StockFlow offers medical supply inventory control starting with a free plan for up to 100 products, with scalable pricing (€0.004 per product/month for products 101+), making it affordable for clinics, pharmacies, and small healthcare facilities.`
    },
    {
      question: "Can medical inventory control systems integrate with EMR/EHR systems?",
      answer: "Yes, modern medical inventory control systems integrate with Electronic Medical Records (EMR) and Electronic Health Records (EHR) through APIs. This enables automatic inventory deduction when supplies are used for patient care, links supply costs to patient billing, provides complete audit trails from receipt to patient use, and ensures inventory levels reflect actual usage. StockFlow offers API access for EMR/EHR integration."
    },
    {
      question: "How do medical inventory control systems help reduce waste?",
      answer: "Medical inventory control systems reduce waste through: FEFO rotation (use oldest items first), automated expiration alerts (proactive management), usage analytics (identify waste patterns), par level optimization (right-size inventory), preference cards (optimize surgical supply usage), and cycle counting (maintain accurate records). Healthcare facilities typically reduce supply waste by 25-40% with proper inventory control."
    },
    {
      question: "What is the ROI of medical supply inventory control systems?",
      answer: "The ROI is typically very high. Healthcare facilities see: 25-40% reduction in supply waste, 20-30% reduction in carrying costs, prevention of expired product waste, improved patient safety, faster recall response, and better compliance. Most facilities see ROI within 6-12 months through waste reduction and cost savings."
    },
    {
      question: "How do medical inventory control systems handle controlled substances?",
      answer: "Medical inventory control systems handle controlled substances with: strict access controls, detailed audit trails, automated reporting for DEA compliance, lot/serial number tracking, usage documentation, and reconciliation requirements. This ensures compliance with controlled substance regulations and prevents diversion."
    },
    {
      question: "Can medical inventory control systems track implantable devices?",
      answer: "Yes, medical inventory control systems track implantable devices with: serial number tracking, patient assignment, lot number traceability, expiration dates, recall management, and complete audit trails. This is essential for patient safety, regulatory compliance, and product liability."
    },
    {
      question: "How does medical inventory control help with patient billing?",
      answer: "Medical inventory control helps with patient billing by: tracking supply usage per patient, linking supplies to procedures, providing itemized cost reports, ensuring accurate charge capture, and integrating with billing systems. This improves revenue capture and ensures patients are billed correctly."
    },
    {
      question: "Can medical inventory control systems track temperature-sensitive supplies?",
      answer: "Yes, medical inventory control systems can track temperature-sensitive supplies including: storage location (refrigerated, frozen, room temperature), temperature monitoring, expiration dates, and compliance requirements. This ensures supplies are stored properly and remain viable for patient use."
    }
  ];

  const keyFeatures = [
    {
      icon: Calendar,
      title: "Expiration Date Management",
      description: "Automated FEFO rotation, expiration alerts (30/60/90 days), and disposal tracking for time-sensitive medical supplies."
    },
    {
      icon: QrCode,
      title: "Lot & Serial Number Tracking",
      description: "Complete traceability for medical devices, implants, and pharmaceuticals with automated lot/serial capture and recall management."
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Maintain FDA, ISO 13485, and healthcare regulation compliance with complete audit trails, documentation, and recall management."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics & Reporting",
      description: "Analyze consumption patterns, identify waste, optimize par levels, and track costs per department or procedure."
    },
    {
      icon: FileText,
      title: "Complete Audit Trails",
      description: "Track every movement, usage, and disposal with complete audit trails for regulatory compliance and accountability."
    },
    {
      icon: AlertCircle,
      title: "Recall Management",
      description: "Instantly identify and remove recalled items by lot/serial number, ensuring patient safety and regulatory compliance."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Expired Medications & Supplies",
      problem: "10-30% of medical supplies expire before use, wasting thousands in inventory costs and compromising patient care.",
      solution: "Automated expiration tracking with FEFO rotation and proactive alerts ensures oldest items are used first, reducing waste by 60-80%."
    },
    {
      icon: Shield,
      title: "Regulatory Compliance & Recalls",
      problem: "Inability to quickly identify and remove recalled items puts patients at risk and violates FDA regulations.",
      solution: "Complete lot/serial tracking enables instant identification of affected products during recalls, ensuring patient safety."
    },
    {
      icon: DollarSign,
      title: "High Inventory Carrying Costs",
      problem: "Medical supplies represent 30-40% of non-labor operating costs, tying up valuable capital in excess inventory.",
      solution: "Data-driven par level optimization reduces excess inventory while maintaining adequate stock for patient care."
    },
    {
      icon: Clock,
      title: "Stockouts of Critical Items",
      problem: "Running out of essential supplies can delay procedures, compromise patient care, and increase costs.",
      solution: "Automated reorder points with real-time tracking prevent stockouts while avoiding overstocking."
    }
  ];

  const supplyCategories = [
    {
      category: "Pharmaceuticals",
      items: ["Prescription medications", "Over-the-counter drugs", "IV solutions", "Controlled substances", "Vaccines"],
      tracking: "Lot numbers, expiration dates, NDC codes, controlled substance logs"
    },
    {
      category: "Surgical Supplies",
      items: ["Sutures", "Surgical gloves", "Drapes & gowns", "Sponges & gauze", "Surgical instruments"],
      tracking: "Lot numbers, expiration dates, sterilization records"
    },
    {
      category: "Implantable Devices",
      items: ["Orthopedic implants", "Cardiac devices", "Stents", "Mesh & grafts"],
      tracking: "Serial numbers, UDI, patient implant records, manufacturer details"
    },
    {
      category: "Patient Care Supplies",
      items: ["Bandages & dressings", "Syringes & needles", "Gloves", "Masks & PPE", "IV supplies"],
      tracking: "Lot numbers, expiration dates, usage by department"
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce supply costs by 15-30%" },
    { icon: Clock, text: "Save 15+ hours per week on inventory tasks" },
    { icon: CheckCircle, text: "Eliminate stockouts of critical supplies" },
    { icon: Shield, text: "100% regulatory compliance & traceability" },
    { icon: TrendingUp, text: "Reduce waste from expired items by 60-80%" },
    { icon: Activity, text: "Improve patient safety with recall management" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Medical Supply Inventory Control System 2025",
    "description": "Complete guide to medical supply inventory control systems. Track medical supplies, pharmaceuticals, and equipment with expiration tracking, lot/serial numbers, and regulatory compliance. Free plan available.",
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
      "@id": "https://www.stockflow.be/uses/medical-supply-inventory-control-system"
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
      title="Medical Supply Inventory Control System 2025"
      heroTitle="Medical Supply Inventory Control System: Track Supplies, Pharmaceuticals & Equipment"
      description="Complete medical supply inventory control system. Track medical supplies, pharmaceuticals, and equipment with expiration tracking, lot/serial numbers, and regulatory compliance. Free plan available."
      updatedDate="2025-01-15"
      faqData={faqData}
    >
      <SEO
        title="Medical Supply Inventory Control System 2025 - Reduce Waste 30%, Free Plan | StockFlow"
        description="Medical supply inventory control system 2025. Track supplies, pharmaceuticals, equipment. Expiration tracking, lot/serial numbers, regulatory compliance. Reduce waste 30%, save costs. Free plan available. Start free trial - no credit card required."
        keywords="medical supply inventory control system, medical inventory control system, medical supply management, healthcare inventory control, medical inventory system, hospital inventory control, medical supply tracking, healthcare inventory management, medical inventory software, medical supply software"
        url="https://www.stockflow.be/uses/medical-supply-inventory-control-system"
        structuredData={[structuredData, faqStructuredData]}
      />

      <StructuredData data={[structuredData, faqStructuredData]} />

      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            A <strong>medical supply inventory control system</strong> is specialized software designed to track, manage, and control medical supplies, pharmaceuticals, and equipment in healthcare facilities. Unlike generic inventory systems, medical supply inventory control systems handle unique requirements: expiration date tracking with FEFO (First Expired, First Out) rotation, lot and serial number traceability for recalls, regulatory compliance (FDA, ISO 13485), patient safety through accurate tracking, and cost control for supplies that represent 30-40% of non-labor expenses.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Effective medical supply inventory control prevents expired product use, enables instant recall management, ensures regulatory compliance, reduces waste by 25-40%, prevents stockouts of critical supplies, and optimizes inventory carrying costs. Modern systems like StockFlow combine expiration tracking, lot/serial number management, automated alerts, and complete audit trails in one platform.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Learn more about <Link to="/uses/medical-inventory-management" className="text-blue-600 hover:underline font-semibold">medical inventory management</Link> for comprehensive healthcare inventory solutions, or explore <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> for general inventory control.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features of Medical Supply Inventory Control Systems
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
            Common Challenges in Medical Supply Inventory Control
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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

      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Benefits of Medical Supply Inventory Control Systems
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Medical Supplies to Track
          </h2>
          <div className="space-y-6">
            {supplyCategories.map((category, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{category.category}</h3>
                <p className="text-slate-600 mb-2"><strong>Items:</strong> {category.items.join(", ")}</p>
                <p className="text-slate-600"><strong>Tracking:</strong> {category.tracking}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Getting Started with Medical Supply Inventory Control
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Catalog Medical Supplies</h3>
                <p className="text-slate-600">Create comprehensive catalog with NDC codes, UDI, lot/serial requirements, expiration tracking needs, and par levels for each item.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Set Up Expiration Tracking</h3>
                <p className="text-slate-600">Configure FEFO rotation, expiration alerts (30/60/90 days), and disposal workflows for time-sensitive supplies.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Implement Lot/Serial Tracking</h3>
                <p className="text-slate-600">Enable lot and serial number capture for implantable devices, pharmaceuticals, and high-risk supplies requiring traceability.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Configure Automated Alerts</h3>
                <p className="text-slate-600">Set up low-stock alerts, expiration warnings, and recall notifications to ensure patient safety and regulatory compliance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

