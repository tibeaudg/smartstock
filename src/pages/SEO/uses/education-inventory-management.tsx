import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
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
  Palette
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';

export default function EducationInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is education inventory management?",
      answer: "Education inventory management is a system for tracking, organizing, and controlling assets and supplies in schools, colleges, and universities. This includes textbooks, technology (laptops, tablets, projectors), classroom supplies, science lab equipment, art supplies, athletic equipment, library materials, and furniture. The goal is to ensure resources are available when needed, prevent loss or theft, and optimize budget allocation."
    },
    {
      question: "Why do schools need inventory management software?",
      answer: "Schools manage thousands of items across multiple classrooms, departments, and buildings with limited budgets. Inventory management prevents duplicate purchases, tracks borrowed items (laptops, textbooks), ensures equipment maintenance, helps with annual audits, prevents theft, optimizes supply ordering, and provides accountability for taxpayer-funded resources."
    },
    {
      question: "How can schools track technology devices like laptops and tablets?",
      answer: "Use barcode or asset tag scanning with serial number tracking. Create checkout systems where students/staff scan devices in and out. Track device location (classroom, student name, home use), maintenance history, warranty information, and condition. Set up alerts for overdue returns and automate reminders. This prevents loss and ensures accountability."
    },
    {
      question: "What types of inventory should schools track?",
      answer: "Essential categories include: textbooks (by title, edition, condition), technology (computers, tablets, projectors, chargers), science lab equipment and chemicals, art supplies and tools, athletic equipment, furniture, library books, classroom supplies (markers, paper, etc.), maintenance supplies, and cafeteria equipment."
    },
    {
      question: "How do schools handle textbook distribution and collection?",
      answer: "Scan textbooks as they're distributed to students at the start of the term, tracking book ID, ISBN, student name, and condition. At term end, scan books as they're returned and assess condition. Flag damaged books and bill students for lost copies. This creates accountability and reduces loss from 15-20% to under 2%."
    },
    {
      question: "Can teachers request supplies through the system?",
      answer: "Yes, modern education inventory systems allow teachers to submit supply requests digitally. Administrators review requests, approve based on budget, and track distribution. This prevents over-ordering, ensures fair allocation, creates audit trails, and helps plan annual budgets based on actual usage patterns."
    },
    {
      question: "How much does school inventory management software cost?",
      answer: "Costs vary from €100-1,000+/month depending on student population and features. StockFlow offers education-friendly pricing starting at €0 for up to 100 items, then pay-as-you-grow (€0.004 per item/month for items 101+), making it affordable even for small schools with limited budgets."
    },
    {
      question: "How does inventory management help with annual audits?",
      answer: "Generate comprehensive reports showing all assets, their locations, purchase dates, values, and custodians. Track all transactions (purchases, distributions, returns, disposals) with timestamps and user records. Quickly produce depreciation schedules and asset valuations. This makes annual audits fast and demonstrates proper stewardship of funds."
    },
    {
      question: "What is the ROI of education inventory management?",
      answer: "The ROI is typically very high. Schools see: 60-80% reduction in lost textbooks and devices, 20-30% reduction in duplicate purchases, improved budget allocation, faster annual audits, and better resource utilization. Most schools see ROI within 6-12 months through loss prevention and cost savings."
    },
    {
      question: "How does education inventory management prevent device loss?",
      answer: "Education inventory management prevents loss by: tracking who checked out which devices, setting up automated return reminders, maintaining complete audit trails, conducting regular audits, and providing accountability. This reduces device loss from 15-20% to under 2%."
    },
    {
      question: "Can education inventory systems track software licenses?",
      answer: "Yes, education inventory systems can track software licenses including: license keys, expiration dates, number of seats, assigned users, and renewal dates. This helps schools manage software compliance and optimize license costs."
    },
    {
      question: "How does education inventory management help with budget planning?",
      answer: "Education inventory management helps with budget planning by: tracking spending by department, analyzing usage patterns, identifying underutilized assets, forecasting future needs, and providing cost reports. This enables data-driven budget decisions and optimal resource allocation."
    },
    {
      question: "Can education inventory systems handle asset disposal?",
      answer: "Yes, education inventory systems handle asset disposal by: tracking disposal dates, reasons for disposal, disposal methods, and maintaining records for audits. This ensures proper asset lifecycle management and compliance with disposal regulations."
    }
  ];

  const keyFeatures = [
    {
      icon: Camera,
      title: "Asset Tagging & Scanning",
      description: "Barcode or QR code tracking for technology, textbooks, equipment, and furniture with mobile scanning."
    },
    {
      icon: Users,
      title: "Check-Out/Check-In System",
      description: "Track which student or teacher has which items, with automated overdue reminders and return tracking."
    },
    {
      icon: FileText,
      title: "Department & Classroom Tracking",
      description: "Organize inventory by building, room, department, or teacher for easy location and accountability."
    },
    {
      icon: DollarSign,
      title: "Budget Management",
      description: "Track spending by department, monitor budget allocations, and analyze costs for better financial planning."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics & Reporting",
      description: "Identify underutilized assets, track consumption patterns, and optimize purchasing decisions."
    },
    {
      icon: Shield,
      title: "Maintenance & Warranty Tracking",
      description: "Schedule equipment maintenance, track warranties, log repair history, and manage service contracts."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Lost or Stolen Items",
      problem: "Technology, textbooks, and equipment disappear without accountability, costing thousands annually.",
      solution: "Check-out/check-in tracking with student/staff assignment creates clear accountability and reduces loss by 85%."
    },
    {
      icon: DollarSign,
      title: "Budget Waste from Duplicate Purchases",
      problem: "Departments over-order supplies because they don't know what's already available in storage.",
      solution: "Central inventory visibility prevents duplicate purchases and optimizes resource allocation."
    },
    {
      icon: Clock,
      title: "Time-Consuming Manual Counts",
      problem: "Staff spend days conducting annual physical inventory counts instead of focusing on students.",
      solution: "Mobile scanning and automated reports reduce annual inventory time from days to hours."
    },
    {
      icon: FileText,
      title: "Difficult Audits & Compliance",
      problem: "Cannot quickly produce asset reports for auditors or demonstrate proper fund usage.",
      solution: "Automated reporting provides instant audit trails and asset documentation."
    },
    {
      icon: Boxes,
      title: "No Visibility Into Item Locations",
      problem: "Don't know which classroom has the projector or who has that textbook, wasting time searching.",
      solution: "Location tracking and search capabilities find items instantly."
    },
    {
      icon: TrendingUp,
      title: "Poor Supply Planning",
      problem: "Over-order some items while running out of others, wasting budget and disrupting teaching.",
      solution: "Usage analytics identify consumption patterns for data-driven purchasing."
    }
  ];

  const essentialCategories = [
    {
      category: "Technology & Devices",
      examples: ["Laptops & tablets", "Chromebooks", "Projectors & displays", "Cameras & equipment", "Chargers & accessories", "Smartboards"]
    },
    {
      category: "Textbooks & Materials",
      examples: ["Textbooks (by subject)", "Workbooks", "Reference materials", "Digital learning materials", "E-book licenses", "Teacher editions"]
    },
    {
      category: "Science Lab Equipment",
      examples: ["Microscopes", "Lab glassware", "Safety equipment", "Chemicals & reagents", "Models & specimens", "Measurement tools"]
    },
    {
      category: "Art Supplies",
      examples: ["Paints & brushes", "Canvas & paper", "Clay & sculpting tools", "Drawing supplies", "Craft materials", "Art equipment"]
    },
    {
      category: "Athletic Equipment",
      examples: ["Sports balls", "Protective gear", "Fitness equipment", "Uniforms", "Training aids", "PE supplies"]
    },
    {
      category: "Classroom Supplies",
      examples: ["Markers & pens", "Paper & notebooks", "Staplers & scissors", "Cleaning supplies", "Classroom decor", "Storage bins"]
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Reduce budget waste by 20-30%" },
    { icon: Shield, text: "Reduce lost/stolen items by 85%" },
    { icon: Clock, text: "Save 40+ hours per year on inventory" },
    { icon: CheckCircle, text: "100% accountability for taxpayer funds" },
    { icon: Target, text: "Instant location visibility for all assets" },
    { icon: BarChart3, text: "Data-driven purchasing decisions" },
    { icon: Star, text: "Simplified annual audits" },
    { icon: Users, text: "Better resource allocation across departments" }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Catalog All Assets & Supplies",
      description: "List all technology, textbooks, equipment, and supplies. Add details like serial numbers, purchase dates, values, and current locations."
    },
    {
      step: "2",
      title: "Create Organizational Structure",
      description: "Set up buildings, rooms, departments, and staff members. Define who is responsible for inventory in each area."
    },
    {
      step: "3",
      title: "Label Items with Barcodes/Tags",
      description: "Apply asset tags or barcode labels to technology, textbooks, and equipment. Use durable labels for items that travel."
    },
    {
      step: "4",
      title: "Conduct Initial Physical Count",
      description: "Scan all items to establish accurate baseline. Record condition, location, and custodian for each item."
    },
    {
      step: "5",
      title: "Set Up Check-Out System",
      description: "Create workflows for students/staff to check out devices, textbooks, or equipment. Define return dates and policies."
    },
    {
      step: "6",
      title: "Configure Budget Tracking",
      description: "Set up department budgets, spending categories, and approval workflows for supply requests."
    },
    {
      step: "7",
      title: "Train Staff & Students",
      description: "Train teachers, librarians, IT staff, and administrators on scanning, check-out procedures, and reporting."
    },
    {
      step: "8",
      title: "Implement Regular Audits",
      description: "Schedule monthly or quarterly spot checks of high-value items and annual comprehensive inventories."
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "Director of Operations, Lincoln High School",
      content: "StockFlow has been transformative for our school. We reduced textbook loss from 18% to under 2%, saved over €15,000 by preventing duplicate technology purchases, and cut our annual inventory time from 5 days to 6 hours.",
      rating: 5,
      business: "1,200 students, 80 staff"
    },
    {
      name: "Dr. Robert Chen",
      role: "Principal, Riverside Middle School",
      content: "Our teachers love the supply request system. I can see exactly what each department needs, approve requests based on budget, and track actual usage. No more surprise stockouts or wasted supplies sitting in storage.",
      rating: 5,
      business: "K-8 school district"
    },
    {
      name: "Sarah Williams",
      role: "IT Coordinator, Oakwood School District",
      content: "Managing 800+ laptops and tablets across 5 schools used to be a nightmare. Now every device is tracked, we know who has what, and our device recovery rate went from 92% to 99.5%. This paid for itself in the first semester.",
      rating: 5,
      business: "Multi-school district"
    }
  ];

  const costSavings = [
    {
      title: "Prevented Lost Items",
      before: "€20,000/year lost to missing devices & textbooks",
      after: "€3,000/year—85% reduction",
      savings: "€17,000/year recovered"
    },
    {
      title: "Eliminated Duplicate Purchases",
      before: "€12,000/year wasted on unnecessary purchases",
      after: "€2,000/year—83% reduction",
      savings: "€10,000/year saved"
    },
    {
      title: "Reduced Admin Time",
      before: "120 hours/year on inventory management",
      after: "30 hours/year—75% reduction",
      savings: "€3,600/year at €40/hr"
    },
    {
      title: "Optimized Supply Spending",
      before: "€50,000/year in supply budgets with 20% waste",
      after: "€42,000/year with minimal waste",
      savings: "€8,000/year saved"
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'challenges', title: 'Common Challenges', level: 1 },
    { id: 'features', title: 'Key Features', level: 1 },
    { id: 'essential-categories', title: 'What to Track', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'cost-savings', title: 'Cost Savings', level: 1 },
    { id: 'implementation', title: 'Implementation Guide', level: 1 },
    { id: 'stockflow-solution', title: 'StockFlow for Schools', level: 1 },
    { id: 'testimonials', title: 'Success Stories', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Education Inventory Management"
      heroTitle="Education Inventory Management"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Education Inventory Management 2025 - School Software | StockFlow"
        description="Complete education inventory management for schools. Track textbooks, technology, supplies, equipment. Checkout system, budget tracking, asset management. Reduce loss by 85%. Start free trial."
        keywords="school inventory management, education inventory software, textbook tracking, school asset management, technology checkout system, K-12 inventory, college inventory management, school supplies tracking, educational institution inventory"
        url="https://www.stockflow.be/education-inventory-management"
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Track textbooks, technology, equipment, and supplies across your educational institution. Reduce loss by 85%, streamline audits, optimize budgets, and ensure accountability for every taxpayer dollar.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Educational institutions manage thousands of valuable assets—from technology devices and textbooks to science equipment and athletic gear—across multiple buildings, classrooms, and departments. With limited budgets and accountability requirements, schools can't afford the 15-20% loss rates common with manual tracking systems.
        </p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Schools Need Specialized Inventory Management</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Educational institutions manage <strong>thousands of valuable assets</strong>—from technology devices and textbooks to science equipment and athletic gear—across multiple buildings, classrooms, and departments. With <strong>limited budgets</strong> and accountability requirements, schools can't afford the 15-20% loss rates common with manual tracking systems.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A specialized school inventory management system provides <strong>accountability, budget optimization, audit readiness</strong>, and stewardship of taxpayer-funded resources—all while saving administrative time and preventing costly losses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€38,600+</h3>
              <p className="text-gray-700">Average annual savings from loss prevention, budget optimization, and time efficiency</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">85%</h3>
              <p className="text-gray-700">Reduction in lost or stolen items with check-out/check-in accountability</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <Clock className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">75%</h3>
              <p className="text-gray-700">Reduction in time spent on inventory management and annual audits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Challenges for Schools</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These problems waste precious educational budgets and create administrative headaches—but they're all preventable.
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Essential Features for Education</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Purpose-built tools that address the unique needs of educational institutions.
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
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Education Solution</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Multi-Building Support</p>
                  <p className="text-sm text-gray-700">Track inventory across multiple campuses or buildings</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Student/Staff Database</p>
                  <p className="text-sm text-gray-700">Integrate with student information systems</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Overdue Notifications</p>
                  <p className="text-sm text-gray-700">Automated reminders for unreturned items</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Damage & Loss Billing</p>
                  <p className="text-sm text-gray-700">Track damages and generate bills for lost items</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Supply Request Workflow</p>
                  <p className="text-sm text-gray-700">Teachers request supplies, admins approve</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Audit Reports</p>
                  <p className="text-sm text-gray-700">Comprehensive reports for annual audits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Categories Section */}
      <section id="essential-categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">What Schools Should Track</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Common inventory categories for educational institutions.
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
              <strong>Start Small:</strong> Begin with high-value items like technology devices and textbooks. Once those systems are working smoothly, expand to other categories like lab equipment, athletic gear, and consumable supplies.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits for Educational Institutions</h2>
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

      {/* Cost Savings Section */}
      <section id="cost-savings" className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Real Savings for Schools</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Based on data from a high school with 1,200 students managing technology, textbooks, and supplies.
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
            <h3 className="text-3xl font-bold text-green-600 mb-4">Total Annual Savings: €38,600+</h3>
            <p className="text-xl text-gray-700">
              Money that can be redirected to student programs, teacher salaries, or facility improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Implementation Guide for Schools</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Step-by-step guide to implementing inventory management in your school.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationSteps.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
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
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Education</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Affordable, easy-to-use inventory management designed for schools with limited budgets and busy staff. No complex training required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Start Free</div>
              <div className="text-sm opacity-90">Up to 100 items • Perfect for small schools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0.004</div>
              <div className="text-lg font-semibold mb-2">Per Item/Month</div>
              <div className="text-sm opacity-90">Budget-friendly for schools of all sizes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">We're here to help your school succeed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Schools Need</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Asset tagging & barcode scanning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Check-out/Check-in tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Student & staff management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Department & room tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Budget management & reporting</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Maintenance & warranty tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Supply request workflows</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Audit-ready reports</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile access for teachers</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 400+ schools using StockFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Schools</h2>
            <p className="text-lg text-gray-600">Real results from educational institutions using StockFlow</p>
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



      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - School Inventory Management Software",
          "description": "Inventory management for educational institutions with asset tracking, check-out systems, and budget management.",
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
    </SeoPageLayout>
  );
}

