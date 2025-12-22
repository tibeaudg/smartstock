import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { 
  GraduationCap,
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
  BarChart3,
  BookOpen,
  Laptop,
  FlaskConical,
  Microscope
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  IndustryBenchmarks,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics,
  getIndustryBenchmarks
} from '@/components/seo/EnhancedContent';

export default function HigherEducationInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  // Get real customer data for higher education use case
  const relevantCaseStudies = getRelevantCaseStudies('education inventory', 'Education');
  const relevantTestimonials = getRelevantTestimonials('education');
  const metrics = getProprietaryMetrics('education inventory');
  const benchmarks = getIndustryBenchmarks('Education');
  
  const faqData = [
    {
      question: "What is higher education inventory management?",
      answer: "Higher education inventory management is a specialized system for tracking, organizing, and controlling assets and supplies in colleges and universities. This includes research equipment, laboratory supplies, technology devices, library materials, furniture, athletic equipment, and specialized academic resources. The goal is to ensure resources are available when needed, prevent loss or theft, optimize budget allocation, and maintain accountability for institutional assets."
    },
    {
      question: "Why do colleges and universities need inventory management software?",
      answer: "Higher education institutions manage thousands of high-value items across multiple departments, research labs, and buildings with complex budgets. Inventory management prevents duplicate purchases, tracks borrowed equipment (laptops, research tools), ensures equipment maintenance, helps with compliance audits, prevents theft, optimizes supply ordering, and provides accountability for institutional and grant-funded resources."
    },
    {
      question: "How can universities track research equipment and laboratory supplies?",
      answer: "Use barcode or asset tag scanning with serial number tracking. Create checkout systems where faculty, researchers, and students scan equipment in and out. Track equipment location (lab, department, researcher name), maintenance history, calibration records, warranty information, and condition. Set up alerts for overdue returns and automate reminders. This prevents loss and ensures compliance with grant requirements."
    },
    {
      question: "What types of inventory should colleges and universities track?",
      answer: "Essential categories for higher education include: research equipment (microscopes, spectrometers, lab instruments), technology (laptops, tablets, projectors, specialized computing equipment), laboratory supplies and chemicals, library materials and special collections, furniture and classroom equipment, athletic equipment, maintenance supplies, and specialized academic resources (art supplies, music instruments, etc.)."
    },
    {
      question: "How do universities handle equipment checkout for research projects?",
      answer: "Scan equipment as it's checked out to faculty or researchers, tracking equipment ID, serial number, researcher name, department, project/grant number, and condition. Set return dates based on project timelines. At return, scan equipment back and assess condition. Flag damaged equipment and track maintenance needs. This creates accountability and ensures equipment is available for other research projects."
    },
    {
      question: "Can faculty request supplies through the inventory management system?",
      answer: "Yes, modern higher education inventory systems allow faculty and department administrators to submit supply requests digitally. Procurement reviews requests, approves based on budget and grant allocations, and tracks distribution. This prevents over-ordering, ensures fair allocation across departments, creates audit trails for grant compliance, and helps plan annual budgets based on actual usage patterns."
    },
    {
      question: "How much does higher education inventory management software cost?",
      answer: `Costs vary from €200-2,000+/month depending on institution size and features. StockFlow offers education-friendly pricing starting at €0 for up to 100 items, then pay-as-you-grow (€0.004 per item/month for items 101+), making it affordable even for small colleges with limited budgets.`
    },
    {
      question: "How does inventory management help with grant compliance and audits?",
      answer: "Generate comprehensive reports showing all grant-funded assets, their locations, purchase dates, values, and custodians. Track all transactions (purchases, distributions, returns, disposals) with timestamps and user records. Quickly produce depreciation schedules and asset valuations. This makes grant audits fast and demonstrates proper stewardship of grant funds, which is essential for maintaining funding eligibility."
    },
    {
      question: "What's the difference between K-12 and higher education inventory management?",
      answer: "Higher education inventory management typically requires: more complex grant and budget tracking, research equipment calibration and maintenance records, multi-department approval workflows, integration with research management systems, compliance reporting for federal grants, and tracking of specialized academic resources. K-12 systems focus more on student checkout systems and classroom supplies."
    },
    {
      question: "What is the ROI of higher education inventory management?",
      answer: "The ROI is typically very high. Universities see: 60-80% reduction in lost equipment,  in duplicate purchases, improved grant compliance, faster audit processes, better budget allocation, and improved resource utilization. Most institutions see ROI within 6-12 months through loss prevention and cost savings."
    },
    {
      question: "How does higher education inventory management prevent equipment loss?",
      answer: "Higher education inventory management prevents loss by: tracking who checked out which equipment, setting up automated return reminders, maintaining complete audit trails, conducting regular audits, providing accountability, and tracking equipment location in real-time. This reduces equipment loss by 60-80%."
    },
    {
      question: "Can higher education inventory systems track equipment calibration?",
      answer: "Yes, higher education inventory systems track equipment calibration including: calibration schedules, calibration history, calibration certificates, calibration due dates, and compliance requirements. This is essential for research equipment that requires regular calibration for accurate results."
    },
    {
      question: "How does higher education inventory management help with grant compliance?",
      answer: "Higher education inventory management helps with grant compliance by: tracking grant-funded assets separately, maintaining detailed records of purchases and usage, providing audit trails for grant auditors, tracking depreciation for grant reporting, and ensuring proper stewardship of grant funds. This is essential for maintaining funding eligibility."
    },
    {
      question: "Can higher education inventory systems integrate with research management platforms?",
      answer: "Yes, higher education inventory systems integrate with research management platforms through APIs. This enables: automatic equipment reservation for research projects, usage tracking linked to research activities, cost allocation to research grants, and compliance reporting. StockFlow offers API access for research management integration."
    }
  ];

  const keyFeatures = [
    {
      icon: Camera,
      title: "Asset Tagging & Scanning",
      description: "Barcode or QR code tracking for research equipment, technology, library materials, and furniture with mobile scanning."
    },
    {
      icon: Users,
      title: "Faculty & Researcher Checkout",
      description: "Track which faculty member, researcher, or department has which equipment, with automated overdue reminders and return tracking."
    },
    {
      icon: FileText,
      title: "Department & Lab Tracking",
      description: "Organize inventory by building, department, research lab, or faculty member for easy location and accountability."
    },
    {
      icon: DollarSign,
      title: "Grant & Budget Management",
      description: "Track spending by department, grant, and project. Monitor budget allocations and analyze costs for better financial planning."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics & Reporting",
      description: "Identify underutilized assets, track consumption patterns, and optimize purchasing decisions with detailed analytics."
    },
    {
      icon: Shield,
      title: "Maintenance & Calibration Tracking",
      description: "Schedule equipment maintenance, track calibration records, log repair history, and manage service contracts for research equipment."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Lost or Stolen Research Equipment",
      problem: "High-value research equipment and technology disappear without accountability, costing tens of thousands annually.",
      solution: "Check-out/check-in tracking with faculty/researcher assignment creates clear accountability and reduces loss by 85%."
    },
    {
      icon: DollarSign,
      title: "Budget Waste from Duplicate Purchases",
      problem: "Departments over-order supplies because they don't know what's already available in other labs or storage.",
      solution: "Central inventory visibility prevents duplicate purchases and optimizes resource allocation across departments."
    },
    {
      icon: Clock,
      title: "Time-Consuming Manual Counts",
      problem: "Staff spend weeks conducting annual physical inventory counts instead of focusing on research and teaching support.",
      solution: "Mobile scanning and automated reports reduce annual inventory time from weeks to days."
    },
    {
      icon: FileText,
      title: "Difficult Grant Audits & Compliance",
      problem: "Cannot quickly produce asset reports for grant auditors or demonstrate proper fund usage for federal compliance.",
      solution: "Automated reporting provides instant audit trails and asset documentation for grant compliance."
    },
    {
      icon: Boxes,
      title: "No Visibility Into Equipment Locations",
      problem: "Don't know which lab has the spectrometer or which researcher has that specialized equipment, wasting time searching.",
      solution: "Location tracking and search capabilities find equipment instantly across all departments and labs."
    },
    {
      icon: TrendingUp,
      title: "Poor Supply Planning",
      problem: "Over-order some items while running out of others, wasting budget and disrupting research projects.",
      solution: "Usage analytics identify consumption patterns for data-driven purchasing and better budget allocation."
    }
  ];

  const essentialCategories = [
    {
      category: "Research Equipment",
      examples: ["Microscopes & imaging equipment", "Spectrometers & analyzers", "Lab instruments & tools", "Specialized research devices", "Calibration equipment", "Measurement instruments"]
    },
    {
      category: "Technology & Computing",
      examples: ["Laptops & workstations", "Tablets & mobile devices", "Projectors & displays", "Specialized computing equipment", "Servers & networking gear", "Peripherals & accessories"]
    },
    {
      category: "Laboratory Supplies",
      examples: ["Chemicals & reagents", "Lab glassware & consumables", "Safety equipment", "Biological materials", "Sample storage", "Lab furniture"]
    },
    {
      category: "Library Materials",
      examples: ["Books & journals", "Special collections", "Digital resources", "Archival materials", "Reference materials", "Media collections"]
    },
    {
      category: "Classroom & Office Equipment",
      examples: ["Furniture", "AV equipment", "Whiteboards & displays", "Office supplies", "Presentation equipment", "Storage solutions"]
    },
    {
      category: "Specialized Academic Resources",
      examples: ["Art supplies & equipment", "Music instruments", "Athletic equipment", "Theater equipment", "Engineering tools", "Medical training equipment"]
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce budget waste by 25-35%" },
    { icon: Shield, text: "Reduce lost/stolen equipment by 85%" },
    { icon: Clock, text: "Save 60+ hours per year on inventory" },
    { icon: CheckCircle, text: "100% accountability for grant funds" },
    { icon: Target, text: "Instant location visibility for all assets" },
    { icon: BarChart3, text: "Data-driven purchasing decisions" },
    { icon: Star, text: "Simplified grant audits" },
    { icon: Users, text: "Better resource allocation across departments" }
  ];

  return (
    <SeoPageLayout 
      title="Higher Education Inventory Management"
      heroTitle="Higher Education Inventory Management"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Higher Education Inventory Management 2025 - Reduce Loss 85%, Save Time | StockFlow"
        description="Complete higher education inventory management 2025 for colleges and universities. Track research equipment, lab supplies, technology. Reduce loss by 85%, streamline grant audits. Free plan available. Join for Free - no credit card required."
        keywords="higher education inventory management, university inventory management, college inventory management, university asset management, research equipment tracking, lab inventory management, higher education inventory software, university inventory system, college asset tracking, grant compliance inventory, stockflow, stock flow"
        url="https://www.stockflowsystems.com/higher-education-inventory-management"
      />

      {/* Industry Benchmarks */}
      <IndustryBenchmarks 
        industry="Education"
        benchmarks={benchmarks}
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "20 hours/month",
          averageCostSaved: benchmarks.averageSavings,
          keyMetric: benchmarks.typicalResult,
          feature: "Higher Education Inventory Management"
        }}
      />

      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={3}
        />
      )}

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-gray-900 leading-relaxed mb-6">
          Track research equipment, laboratory supplies, technology, and library materials across your college or university. Reduce loss by 85%, streamline grant audits, optimize budgets, and ensure accountability for every institutional and grant dollar.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Higher education institutions manage thousands of high-value assets—from research equipment and laboratory supplies to technology devices and library collections—across multiple departments, research labs, and buildings. With complex budgets, grant compliance requirements, and accountability standards, universities can't afford the 15-20% loss rates common with manual tracking systems.
        </p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Higher Education Needs Specialized Inventory Management</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Colleges and universities manage <strong>thousands of high-value assets</strong>—from research equipment and laboratory supplies to technology devices and library collections—across multiple departments, research labs, and buildings. With <strong>complex budgets, grant compliance requirements</strong>, and accountability standards, universities can't afford the 15-20% loss rates common with manual tracking systems.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A specialized higher education inventory management system provides <strong>grant compliance, budget optimization, audit readiness</strong>, and stewardship of institutional and grant-funded resources—all while saving administrative time and preventing costly losses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <FlaskConical className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€50,000+</h3>
              <p className="text-gray-700">Average annual savings from loss prevention, budget optimization, and time efficiency</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">85%</h3>
              <p className="text-gray-700">Reduction in lost or stolen equipment with check-out/check-in accountability</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <Clock className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">75%</h3>
              <p className="text-gray-700">Reduction in time spent on inventory management and grant audits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Challenges for Higher Education</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These problems waste precious institutional budgets and create compliance headaches—but they're all preventable.
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential Features for Higher Education</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Purpose-built tools that address the unique needs of colleges and universities.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Higher Education Solution</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Multi-Department Support</p>
                  <p className="text-sm text-gray-700">Track inventory across multiple departments, labs, and buildings</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Faculty & Researcher Database</p>
                  <p className="text-sm text-gray-700">Track equipment assignments to faculty and research staff</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Grant & Project Tracking</p>
                  <p className="text-sm text-gray-700">Link equipment to specific grants and research projects</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Calibration & Maintenance Records</p>
                  <p className="text-sm text-gray-700">Track calibration schedules and maintenance history for research equipment</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Supply Request Workflow</p>
                  <p className="text-sm text-gray-700">Faculty request supplies, procurement approves based on budget</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Grant Compliance Reports</p>
                  <p className="text-sm text-gray-700">Comprehensive reports for grant audits and federal compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Categories Section */}
      <section id="essential-categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">What Higher Education Should Track</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Common inventory categories for colleges and universities.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <Boxes className="w-6 h-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong>Start with High-Value Items:</strong> Begin with research equipment and technology devices. Once those systems are working smoothly, expand to laboratory supplies, library materials, and other categories.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits for Higher Education Institutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-10 h-10 text-indigo-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* StockFlow Solution Section */}
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Higher Education</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Affordable, easy-to-use inventory management designed for colleges and universities with complex budgets and compliance requirements. No complex training required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Join for Free</div>
              <div className="text-sm opacity-90">Up to 100 items • Perfect for small colleges</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0.004</div>
              <div className="text-lg font-semibold mb-2">Per Item/Month</div>
              <div className="text-sm opacity-90">Budget-friendly for institutions of all sizes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">We're here to help your institution succeed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Higher Education Needs</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Asset tagging & barcode scanning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Faculty & researcher checkout</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Grant & project tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Department & lab tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Budget & grant management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Calibration & maintenance tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Supply request workflows</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Grant compliance reports</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile access for faculty</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Join for Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 200+ colleges and universities using StockFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Higher Education Inventory Management",
          "description": "Inventory management for colleges and universities with research equipment tracking, grant compliance, and budget management.",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          }
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
        }
      ]} />
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

