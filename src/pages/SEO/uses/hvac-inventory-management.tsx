import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Package,
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
  Wrench,
  Thermometer,
  Truck
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { 
  CaseStudySection, 

  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

export default function HvacInventoryManagement() {
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  // Get real customer data for HVAC contractor use case
  const relevantCaseStudies = getRelevantCaseStudies('construction inventory', 'Construction');
  const relevantTestimonials = getRelevantTestimonials('construction');
  const metrics = getProprietaryMetrics('construction inventory');

  const faqData = [
    {
      question: "What is HVAC inventory management?",
      answer: "HVAC inventory management is specialized software for tracking, managing, and controlling HVAC (Heating, Ventilation, and Air Conditioning) parts, equipment, and supplies. It helps HVAC contractors and service companies track parts inventory, manage service vehicles, schedule maintenance, track equipment installations, manage warranties, and optimize parts purchasing. Unlike generic inventory systems, HVAC inventory management accounts for seasonal demand, emergency parts needs, and service vehicle stock."
    },
    {
      question: "Why do HVAC contractors need specialized inventory management?",
      answer: "HVAC contractors face unique challenges: parts stored in service vehicles, emergency parts needs for urgent repairs, seasonal demand fluctuations (AC parts in summer, heating parts in winter), high-value equipment requiring tracking, warranty management for installed equipment, and multiple job sites with parts needs. Generic inventory systems can't handle these complexities, leading to stockouts during peak seasons, excess inventory during off-seasons, and inefficient parts management."
    },
    {
      question: "What HVAC parts and equipment should be tracked?",
      answer: "Track all HVAC parts and equipment: compressors, motors, fans, coils, filters, refrigerants, thermostats, ductwork, electrical components, tools, and safety equipment. Also track installed equipment (furnaces, air conditioners, heat pumps) with warranty information, service history, and maintenance schedules. High-value items and frequently used parts need the most attention."
    },
    {
      question: "How does mobile inventory management work for HVAC contractors?",
      answer: "Mobile HVAC inventory apps enable technicians to check parts availability, update vehicle stock, scan parts for installations, and request parts deliveries directly from job sites. Offline capability ensures technicians can work without internet connectivity. When back online, data syncs automatically. StockFlow's mobile app works offline, making it perfect for HVAC field service."
    },
    {
      question: "Can HVAC inventory systems track service vehicles?",
      answer: "Yes, modern HVAC inventory systems track parts inventory in service vehicles. This includes: which parts are in which vehicle, parts usage per vehicle, restocking alerts when vehicle stock is low, and parts transfers between vehicles. This ensures technicians have the right parts when they arrive at job sites, reducing return trips and improving service efficiency."
    },
    {
      question: "How much does HVAC inventory management software cost?",
      answer: `HVAC inventory software pricing varies. Basic systems start at ${formatPrice(100)}/month. Enterprise solutions for large HVAC companies can cost ${formatPrice(500)}-${formatPrice(2000)}/month. StockFlow offers HVAC inventory management starting with a free plan for up to 30 products, with scalable pricing (€0.004 per product/month), making it affordable for small HVAC contractors and growing service companies.`
    },
    {
      question: "How do HVAC inventory systems handle seasonal demand?",
      answer: "HVAC inventory systems handle seasonal demand through: demand forecasting based on historical patterns, seasonal reorder point adjustments (higher in peak seasons), automated alerts for seasonal parts preparation, and analysis of seasonal usage patterns. This ensures adequate stock during peak seasons (AC parts in summer, heating parts in winter) while avoiding excess inventory during off-seasons."
    },
    {
      question: "Can HVAC inventory systems integrate with service scheduling?",
      answer: "Yes, modern HVAC inventory systems integrate with service scheduling software. This enables: automatic parts reservation when jobs are scheduled, parts availability checks before scheduling, parts preparation for upcoming jobs, and service history tracking linked to inventory usage. StockFlow offers API access for integration with popular HVAC service management platforms."
    },
    {
      question: "What is the ROI of HVAC inventory management?",
      answer: "The ROI is typically very high. HVAC contractors see: 30-40% reduction in service callbacks, 15-25% reduction in parts inventory costs, improved first-visit completion rates, and better customer satisfaction. Most contractors see ROI within 3-6 months through reduced callbacks and optimized parts purchasing."
    },
    {
      question: "How does HVAC inventory management prevent service callbacks?",
      answer: "HVAC inventory management prevents callbacks by: ensuring technicians have the right parts on the first visit, tracking parts availability in real-time, enabling quick parts ordering from job sites, and maintaining accurate vehicle stock levels. This reduces callbacks by 30-40%."
    },
    {
      question: "Can HVAC inventory systems track warranty information?",
      answer: "Yes, HVAC inventory systems track warranty information for installed equipment including: warranty expiration dates, warranty terms, service history, and warranty claim tracking. This helps contractors manage warranties effectively and ensure proper service coverage."
    },
    {
      question: "How does HVAC inventory management handle emergency parts needs?",
      answer: "HVAC inventory management handles emergencies by: providing real-time visibility into parts availability across all vehicles and warehouses, enabling quick parts transfers between vehicles, supporting urgent parts ordering, and tracking emergency parts usage. This ensures urgent repairs can be completed quickly."
    },
    {
      question: "Can HVAC inventory systems track refrigerant usage?",
      answer: "Yes, HVAC inventory systems can track refrigerant usage including: refrigerant type, quantity, lot numbers, expiration dates, and compliance requirements. This is essential for environmental compliance and proper refrigerant management."
    }
  ];

  const keyFeatures = [
    {
      icon: QrCode,
      title: "Mobile Parts Tracking",
      description: "Track HVAC parts in service vehicles and warehouses with mobile barcode scanning for instant updates."
    },
    {
      icon: Truck,
      title: "Service Vehicle Management",
      description: "Track parts inventory in service vehicles, manage vehicle stock, and optimize parts allocation across vehicles."
    },
    {
      icon: Thermometer,
      title: "Seasonal Demand Management",
      description: "Handle seasonal demand fluctuations with forecasting, seasonal reorder points, and automated alerts."
    },
    {
      icon: Wrench,
      title: "Equipment & Warranty Tracking",
      description: "Track installed HVAC equipment with warranty information, service history, and maintenance schedules."
    },
    {
      icon: BarChart3,
      title: "Parts Usage Analytics",
      description: "Analyze parts usage patterns, identify frequently used parts, and optimize purchasing decisions."
    },
    {
      icon: Shield,
      title: "Emergency Parts Management",
      description: "Quick access to emergency parts inventory, availability checks, and urgent parts ordering."
    }
  ];

  const benefits = [
    { icon: Clock, text: "Reduce service callbacks by 30-40%" },
    { icon: DollarSign, text: "Reduce parts inventory costs by 15-25%" },
    { icon: CheckCircle, text: "Ensure technicians have right parts on first visit" },
    { icon: TrendingUp, text: "Optimize seasonal parts purchasing" },
    { icon: MapPin, text: "Track parts across vehicles and warehouses" },
    { icon: Shield, text: "Manage equipment warranties and service history" }
  ];

  const useCases = [
    {
      title: "Service Vehicle Parts Management",
      description: "Track parts inventory in service vehicles, ensure technicians have needed parts, and optimize vehicle stock levels.",
      icon: "🚚"
    },
    {
      title: "Emergency Parts Availability",
      description: "Quickly check parts availability for urgent repairs, reducing service callbacks and improving customer satisfaction.",
      icon: "🚨"
    },
    {
      title: "Seasonal Parts Preparation",
      description: "Prepare for peak seasons (AC parts in summer, heating parts in winter) with seasonal demand forecasting.",
      icon: "📅"
    },
    {
      title: "Equipment Installation Tracking",
      description: "Track installed HVAC equipment with warranty information, service history, and maintenance schedules.",
      icon: "🏠"
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Service Callbacks Due to Missing Parts",
      problem: "Technicians arrive at job sites without needed parts, requiring return trips that waste time and reduce customer satisfaction.",
      solution: "Service vehicle inventory tracking ensures technicians have the right parts on first visit, reducing callbacks by 30-40%."
    },
    {
      icon: DollarSign,
      title: "Excess Inventory During Off-Seasons",
      problem: "HVAC contractors overstock parts during peak seasons, then carry excess inventory during off-seasons, tying up capital.",
      solution: "Seasonal demand forecasting and reorder point optimization ensure adequate stock during peak seasons while avoiding excess during off-seasons."
    },
    {
      icon: Clock,
      title: "Poor Visibility into Vehicle Stock",
      problem: "Don't know what parts are in which service vehicle, leading to duplicate orders and inefficient parts allocation.",
      solution: "Real-time vehicle inventory tracking provides visibility into vehicle stock, optimizing parts allocation across vehicles."
    }
  ];

  const partsCategories = [
    {
      category: "Compressors & Motors",
      items: ["Compressors", "Motors", "Fan motors", "Blower motors", "Capacitors"],
      tracking: "Serial numbers, warranty info, service history, vehicle location"
    },
    {
      category: "Refrigerants & Coils",
      items: ["Refrigerants", "Evaporator coils", "Condenser coils", "Heat exchangers"],
      tracking: "Quantity, expiration dates, vehicle stock, usage per job"
    },
    {
      category: "Controls & Thermostats",
      items: ["Thermostats", "Control boards", "Sensors", "Relays", "Contactors"],
      tracking: "Model numbers, compatibility, vehicle stock, installation records"
    },
    {
      category: "Filters & Ductwork",
      items: ["Air filters", "Ductwork", "Vents", "Registers", "Grilles"],
      tracking: "Sizes, quantities, vehicle stock, seasonal demand"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "HVAC Inventory Management 2025",
    "description": "Complete guide to HVAC inventory management. Track HVAC parts, equipment, and supplies with mobile scanning, service vehicle management, and seasonal demand optimization. Free plan available.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflowsystems.com/hvac-inventory-management"
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
      title="HVAC Inventory Management 2025"
      heroTitle="HVAC Inventory Management: Track Parts, Equipment & Service Vehicles"
      description="Complete HVAC inventory management guide. Track HVAC parts, equipment, and supplies with mobile scanning, service vehicle management, and seasonal demand optimization. Free plan available."
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="HVAC Inventory Management 2025 - Save 10+ Hours/Week, Free Plan | StockFlow"
        description="Complete HVAC inventory management 2025. Track parts and equipment, mobile scanning, service vehicle management. Save 10+ hours/week, optimize seasonal demand. Free plan available. Join for Free - no credit card required."
        keywords="hvac inventory management, hvac parts inventory, hvac inventory software, hvac inventory system, hvac parts tracking, hvac equipment management, hvac service inventory, hvac inventory app, hvac parts management, hvac contractor inventory"
        url="https://www.stockflowsystems.com/hvac-inventory-management"
        structuredData={[structuredData, faqStructuredData]}
      />

      <StructuredData data={[structuredData, faqStructuredData]} />





      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            <strong>HVAC inventory management</strong> is specialized software for tracking, managing, and controlling HVAC (Heating, Ventilation, and Air Conditioning) parts, equipment, and supplies. HVAC contractors and service companies face unique challenges: parts stored in service vehicles, emergency parts needs for urgent repairs, seasonal demand fluctuations (AC parts in summer, heating parts in winter), and multiple job sites with parts needs.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Effective HVAC inventory management ensures technicians have the right parts on first visit (reducing callbacks by 30-40%), optimizes seasonal parts purchasing, tracks service vehicle inventory, manages equipment warranties, and provides real-time visibility into parts availability. Modern <Link to="/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> apps like StockFlow enable technicians to check parts availability, update vehicle stock, and request parts deliveries directly from job sites.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Learn more about <Link to="/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> for comprehensive inventory solutions, or explore <Link to="/contractor-inventory-management" className="text-blue-600 hover:underline font-semibold">contractor inventory management</Link> for field service businesses.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features of HVAC Inventory Management
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
            Common Use Cases for HVAC Inventory Management
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
            Benefits of HVAC Inventory Management
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
            Common Challenges in HVAC Inventory Management
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
            HVAC Parts to Track
          </h2>
          <div className="space-y-6">
            {partsCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{category.category}</h3>
                <p className="text-slate-600 mb-2"><strong>Items:</strong> {category.items.join(", ")}</p>
                <p className="text-slate-600"><strong>Tracking:</strong> {category.tracking}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Getting Started with HVAC Inventory Management
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Catalog HVAC Parts & Equipment</h3>
                <p className="text-slate-600">Create comprehensive catalog of all HVAC parts, equipment, and supplies with suppliers, costs, and seasonal demand patterns.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Set Up Service Vehicle Tracking</h3>
                <p className="text-slate-600">Configure service vehicles in the system and track parts inventory in each vehicle for optimal parts allocation.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Implement Mobile Scanning</h3>
                <p className="text-slate-600">Train technicians to use mobile barcode scanning for parts usage, vehicle stock updates, and equipment installations.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Configure Seasonal Alerts</h3>
                <p className="text-slate-600">Set up seasonal reorder points and alerts to prepare for peak seasons (AC parts in summer, heating parts in winter).</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-slate-700">
            StockFlow's HVAC inventory management works on mobile devices with offline capability, making it perfect for field service. Start with a free plan and scale as your HVAC business grows.
          </p>
        </div>
      </section>
      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="highlighted"
        />
      )}
    </SeoPageLayout>
  );
}

