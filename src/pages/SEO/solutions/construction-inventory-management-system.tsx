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
  FileText,
  Hammer,
  Truck,
  Building2
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function ConstructionInventoryManagementSystem() {
  usePageRefresh();
  const { formatPrice } = useCurrency();

  const faqData = [
    {
      question: "What is a construction inventory management system?",
      answer: "A construction inventory management system is specialized software for tracking, managing, and optimizing construction materials, tools, equipment, and supplies across job sites. It helps construction companies prevent material waste, reduce theft, optimize purchasing, track equipment locations, manage multiple job sites, and ensure materials are available when needed. Unlike generic inventory systems, construction inventory management accounts for job site logistics, material delivery schedules, and equipment maintenance."
    },
    {
      question: "Why do construction companies need specialized inventory management?",
      answer: "Construction projects face unique challenges: materials stored across multiple job sites, high-value equipment that moves between locations, weather-sensitive materials requiring proper storage, tools and equipment that need maintenance tracking, and materials that can be stolen or damaged. Generic inventory systems don't handle job site logistics, material delivery coordination, or equipment maintenance schedules. Construction-specific systems like StockFlow address these needs."
    },
    {
      question: "What construction materials should be tracked?",
      answer: "Track all materials with significant value or critical to projects: lumber and building materials, concrete and aggregates, steel and rebar, electrical supplies, plumbing materials, HVAC equipment, roofing materials, insulation, drywall, paint and finishes, tools and equipment, safety equipment, and consumables (nails, screws, adhesives). Track materials by job site, supplier, delivery date, and usage."
    },
    {
      question: "How does mobile inventory management work for construction?",
      answer: "Mobile construction inventory apps enable field workers to scan barcodes, update stock levels, check material availability, and request deliveries directly from job sites. Offline capability ensures workers can scan and update inventory even without internet connectivity. When back online, data syncs automatically. StockFlow's mobile app works offline, making it perfect for remote construction sites with poor connectivity."
    },
    {
      question: "Can construction inventory systems track equipment and tools?",
      answer: "Yes, modern construction inventory systems track both materials and equipment. Equipment tracking includes location (which job site), maintenance schedules, service history, operator assignments, and utilization rates. This prevents equipment loss, ensures proper maintenance, and optimizes equipment allocation across multiple projects. StockFlow supports both material and equipment tracking in one system."
    },
    {
      question: "How much does construction inventory management software cost?",
      answer: `Construction inventory software pricing varies. Basic systems start at ${formatPrice(100)}/month. Enterprise solutions for large contractors can cost ${formatPrice(500)}-${formatPrice(2000)}/month. StockFlow offers construction inventory management starting with a free plan for up to 30 products, with scalable pricing (€0.004 per product/month), making it affordable for small contractors and growing construction companies.`
    },
    {
      question: "How do construction inventory systems prevent material theft?",
      answer: "Construction inventory systems prevent theft through: real-time tracking of high-value materials, location monitoring (know where materials are stored), access controls (who can check out materials), usage tracking (materials assigned to specific projects), automated alerts for unusual activity, and audit trails showing material movements. Regular cycle counts and mobile scanning make it easy to detect discrepancies quickly."
    },
    {
      question: "Can construction inventory software integrate with project management tools?",
      answer: "Many construction inventory systems integrate with project management software through APIs. This enables automatic material requirements based on project schedules, real-time material availability for project planning, cost tracking per project, and material delivery coordination. StockFlow offers API access for integration with popular construction management platforms."
    },
    {
      question: "What is the ROI of construction inventory management systems?",
      answer: "The ROI is typically very high. Construction companies see: 15-25% reduction in material waste, 20-30% reduction in material theft, 10-15 hours saved per week on inventory tasks, prevention of project delays from material shortages, and 20-30% reduction in carrying costs. Most companies see ROI within the first month through waste reduction and theft prevention."
    },
    {
      question: "How do construction inventory systems handle material deliveries?",
      answer: "Construction inventory systems manage deliveries by: scheduling deliveries to specific job sites, tracking delivery status in real-time, receiving materials with mobile scanning, verifying quantities against purchase orders, documenting delivery issues (damage, shortages), and updating inventory automatically upon receipt. This ensures materials arrive when needed and are properly accounted for."
    },
    {
      question: "Can construction inventory systems track material usage per project?",
      answer: "Yes, modern construction inventory systems track material usage per project. When materials are used on a project, the system records the project assignment, quantity used, date, and cost. This enables accurate project costing, budget tracking, and material planning for future projects. StockFlow supports project-based material tracking and reporting."
    },
    {
      question: "How do construction inventory systems prevent material waste?",
      answer: "Construction inventory systems prevent waste by: tracking material quantities accurately (preventing over-ordering), monitoring material expiration dates, optimizing purchasing based on project schedules, identifying unused materials for reuse, tracking material usage patterns, and providing alerts for materials approaching expiration. This reduces waste by 15-25%."
    },
    {
      question: "What reporting features do construction inventory systems provide?",
      answer: "Construction inventory systems provide reports on: material usage by project, inventory levels by job site, material costs per project, supplier performance, equipment utilization, theft and loss tracking, and material waste analysis. These reports help optimize purchasing, control costs, and improve project profitability. StockFlow offers comprehensive construction inventory reporting."
    }
  ];

  const keyFeatures = [
    {
      icon: MapPin,
      title: "Multi-Job Site Tracking",
      description: "Track materials and equipment across multiple construction sites with location-specific inventory levels."
    },
    {
      icon: QrCode,
      title: "Mobile Barcode Scanning",
      description: "Scan materials and equipment on job sites with offline-capable mobile apps for instant updates."
    },
    {
      icon: Truck,
      title: "Material Delivery Management",
      description: "Schedule deliveries, track material receipts, and coordinate logistics across job sites."
    },
    {
      icon: Hammer,
      title: "Equipment & Tool Tracking",
      description: "Track construction equipment, tools, and machinery with maintenance schedules and location monitoring."
    },
    {
      icon: BarChart3,
      title: "Project Cost Tracking",
      description: "Allocate materials and equipment costs to specific projects for accurate project budgeting."
    },
    {
      icon: Shield,
      title: "Theft Prevention & Security",
      description: "Real-time tracking, access controls, and audit trails to prevent material theft and loss."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Material Waste & Overstocking",
      problem: "Construction projects waste 10-15% of materials due to poor inventory management, ordering excess, or materials expiring on site.",
      solution: "Real-time tracking and automated reorder points prevent overstocking while ensuring materials are available when needed."
    },
    {
      icon: DollarSign,
      title: "Material Theft & Loss",
      problem: "Construction sites lose 1-2% of material value to theft, with high-value items (copper, tools, equipment) most at risk.",
      solution: "Location tracking, access controls, and regular audits with mobile scanning detect and prevent theft quickly."
    },
    {
      icon: Clock,
      title: "Material Shortages Delaying Projects",
      problem: "Running out of critical materials causes project delays, overtime costs, and contractor penalties.",
      solution: "Automated low-stock alerts and material requirement planning ensure materials arrive before they're needed."
    },
    {
      icon: MapPin,
      title: "Poor Visibility Across Job Sites",
      problem: "Don't know what materials are available at other job sites, leading to duplicate orders and inefficient allocation.",
      solution: "Centralized system with multi-location tracking provides real-time visibility across all construction sites."
    }
  ];

  const materialCategories = [
    {
      category: "Building Materials",
      items: ["Lumber & timber", "Concrete & aggregates", "Steel & rebar", "Bricks & blocks", "Drywall & plaster"],
      tracking: "Quantity by job site, supplier, delivery date, usage per project"
    },
    {
      category: "MEP Supplies",
      items: ["Electrical wire & conduit", "Plumbing pipes & fittings", "HVAC equipment", "Fixtures & fixtures"],
      tracking: "Location, project allocation, installation dates"
    },
    {
      category: "Finishes & Coatings",
      items: ["Paint & primers", "Flooring materials", "Tile & stone", "Insulation", "Roofing materials"],
      tracking: "Expiration dates, storage conditions, project assignments"
    },
    {
      category: "Tools & Equipment",
      items: ["Power tools", "Hand tools", "Heavy machinery", "Safety equipment", "Scaffolding"],
      tracking: "Location, maintenance schedules, operator assignments, utilization"
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce material waste by 15-25%" },
    { icon: Shield, text: "Prevent theft and loss of high-value materials" },
    { icon: Clock, text: "Save 10+ hours per week on inventory tasks" },
    { icon: CheckCircle, text: "Eliminate material shortages delaying projects" },
    { icon: TrendingUp, text: "Optimize purchasing and reduce excess inventory" },
    { icon: BarChart3, text: "Accurate project cost tracking and budgeting" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Construction Inventory Management System 2025",
    "description": "Complete guide to construction inventory management systems. Track materials, equipment, and tools across job sites with mobile scanning and automated alerts. Free plan available.",
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
      "@id": "https://www.stockflow.be/solutions/construction-inventory-management-system"
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
      title="Construction Inventory Management System 2025"
      heroTitle="Construction Inventory Management System: Track Materials & Equipment Across Job Sites"
      description="Complete construction inventory management system. Track materials, equipment, and tools across multiple job sites with mobile scanning, automated alerts, and theft prevention. Free plan available."
      updatedDate="2025-01-15"
      faqData={faqData}
    >
      <SEO
        title="Construction Inventory Management System 2025 - Reduce Waste 15-25%, Save Time | StockFlow"
        description="Construction inventory management system 2025 for tracking materials and equipment across job sites. Mobile scanning, theft prevention, automated alerts. Reduce waste 15-25%, save 10+ hours/week. Free plan for up to 100 products. Start free trial - no credit card required."
        keywords="construction inventory management system, construction inventory software, construction materials tracking, construction inventory app, job site inventory, construction equipment tracking, material management construction, construction inventory control, construction stock management, building materials inventory, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/construction-inventory-management-system"
        structuredData={[structuredData, faqStructuredData]}
      />

      <StructuredData data={[structuredData, faqStructuredData]} />

      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            A <strong>construction inventory management system</strong> is specialized software designed to track, manage, and optimize construction materials, tools, equipment, and supplies across multiple job sites. Construction projects face unique challenges: materials stored at remote locations, high-value equipment that moves between sites, weather-sensitive materials requiring proper storage, and the constant risk of theft or loss. Generic inventory systems can't handle these complexities.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Modern construction inventory management systems like StockFlow provide mobile scanning for field workers, multi-location tracking across job sites, material delivery coordination, equipment maintenance scheduling, and theft prevention through real-time tracking. This specialized approach helps construction companies reduce material waste by 15-25%, prevent theft, eliminate project delays from material shortages, and optimize purchasing decisions.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Unlike basic <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link>, construction-specific systems account for job site logistics, material delivery schedules, equipment maintenance, and multi-project cost allocation. Learn more about <Link to="/uses/contractor-inventory-management" className="text-blue-600 hover:underline font-semibold">contractor inventory management</Link> for field service businesses. Explore <Link to="/solutions/construction-inventory-app" className="text-blue-600 hover:underline font-semibold">construction inventory app</Link> options or see <Link to="/solutions/inventory-management-software-solutions" className="text-blue-600 hover:underline font-semibold">inventory management software solutions</Link>.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features of Construction Inventory Management Systems
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
            Common Challenges in Construction Inventory Management
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
            Benefits of Construction Inventory Management Systems
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
            Construction Materials to Track
          </h2>
          <div className="space-y-6">
            {materialCategories.map((category, index) => (
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
            Getting Started with Construction Inventory Management
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Catalog Materials & Equipment</h3>
                <p className="text-slate-600">Create a comprehensive catalog of all construction materials, tools, and equipment with suppliers, costs, and storage requirements.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Set Up Job Site Locations</h3>
                <p className="text-slate-600">Configure all job sites, storage areas, and material staging locations in the system for multi-location tracking.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Implement Mobile Scanning</h3>
                <p className="text-slate-600">Train field workers to use mobile barcode scanning for material receipts, transfers, and inventory counts on job sites.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Configure Automated Alerts</h3>
                <p className="text-slate-600">Set up low-stock alerts, material delivery reminders, and equipment maintenance schedules to prevent project delays.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

