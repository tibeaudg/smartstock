import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  GraduationCap,
  Laptop,
  Book,
  Users,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  Building,
  MapPin
} from 'lucide-react';
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

export default function EducationInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data for education industry
  const relevantCaseStudies = getRelevantCaseStudies('education inventory', 'Education');
  const relevantTestimonials = getRelevantTestimonials('education');
  const metrics = getProprietaryMetrics('education inventory');
  const benchmarks = getIndustryBenchmarks('Education');
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "What is school inventory management?",
      answer: "School inventory management is the process of tracking educational supplies, IT equipment, library books, and classroom materials across multiple campuses and departments. It helps schools maintain accurate inventory records, prevent loss and theft, optimize purchasing, and ensure resources are available when needed."
    },
    {
      question: "How does education inventory software help with IT equipment tracking?",
      answer: "Education inventory software allows schools to track IT equipment like laptops, tablets, projectors, and other technology across classrooms and campuses. You can assign equipment to specific locations, track maintenance, monitor usage, and prevent loss or theft with real-time visibility."
    },
    {
      question: "Can school inventory software track library books?",
      answer: "Yes, modern school inventory management systems can track library books, textbooks, and educational materials. You can track book locations, check-out status, condition, and manage library inventory alongside other school supplies from one system."
    },
    {
      question: "How does education inventory management reduce lost equipment?",
      answer: "By tracking equipment across all locations and assigning items to specific classrooms or departments, schools can quickly identify missing items and reduce loss. Real-time visibility and mobile scanning make it easy to audit equipment regularly. Schools typically see 40% reduction in lost equipment."
    },
    {
      question: "What features are essential for school inventory management?",
      answer: "Key features include multi-campus tracking, IT equipment management, library book tracking, classroom material management, mobile barcode scanning, asset assignment, maintenance scheduling, and reporting. These features help schools manage diverse inventory types efficiently."
    },
    {
      question: "How much time can schools save with inventory management software?",
      answer: "Schools typically save 20+ hours per month on inventory audits and tracking. Mobile scanning eliminates manual data entry, automated alerts reduce time checking stock levels, and real-time visibility eliminates the need for physical counts at each campus."
    },
    {
      question: "Can education inventory software track equipment across multiple campuses?",
      answer: "Yes, modern education inventory management software tracks inventory across multiple campuses, buildings, and departments from a single dashboard. You can see what equipment is at each location, transfer items between campuses, and generate location-specific reports."
    },
    {
      question: "Is education inventory software suitable for small schools?",
      answer: "Absolutely! Education inventory management is beneficial for schools of all sizes. Small schools often have limited resources, making efficient inventory tracking even more critical. StockFlow offers a free plan perfect for small schools getting started."
    },
    {
      question: "How does education inventory management help with budget planning?",
      answer: "By tracking inventory usage and costs, schools can make data-driven budget decisions. Reports show which items are used most, what needs replacement, and where budget should be allocated. This helps schools optimize spending and justify budget requests."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "School Inventory Management Software for Education",
    description: "School inventory management software for educational institutions. Track IT equipment, library books, and supplies across campuses. Reduce lost equipment 40%, save 20 hours/month. Free plan available.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Education Inventory Management",
      description: "School inventory management software for educational institutions. Track IT equipment, library books, and supplies across campuses.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Multi-campus tracking",
        "IT equipment management",
        "Library book tracking",
        "Classroom material management",
        "Mobile barcode scanning",
        "Asset assignment"
      ],
      image: "https://www.stockflowsystems.com/education.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Building,
      title: "Multi-Campus Tracking",
      description: "Track inventory across multiple campuses, buildings, and departments from a single dashboard. See exactly what equipment and supplies are at each location."
    },
    {
      icon: Laptop,
      title: "IT Equipment Management",
      description: "Track laptops, tablets, projectors, and other technology across classrooms. Assign equipment to specific locations and track maintenance schedules."
    },
    {
      icon: Book,
      title: "Library Book Tracking",
      description: "Track library books, textbooks, and educational materials. Monitor check-out status, condition, and location of all library inventory."
    },
    {
      icon: Package,
      title: "Classroom Material Management",
      description: "Track classroom supplies, art materials, science equipment, and other educational resources. Ensure teachers have what they need when they need it."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan equipment and supplies directly from classrooms and storage areas using your smartphone. Update inventory instantly without leaving the location."
    },
    {
      icon: Users,
      title: "Asset Assignment",
      description: "Assign equipment to specific classrooms, teachers, or departments. Track who has what and ensure accountability for school assets."
    },
    {
      icon: Clock,
      title: "Maintenance Scheduling",
      description: "Schedule equipment maintenance and track service history. Ensure IT equipment and other assets are always in working condition."
    },
    {
      icon: BarChart3,
      title: "Budget Planning Reports",
      description: "Generate reports on inventory usage and costs to inform budget planning. Make data-driven decisions about resource allocation."
    }
  ];

  const useCases = [
    {
      title: "IT Equipment Tracking",
      description: "Track laptops, tablets, projectors, and other technology across classrooms and campuses. Assign equipment to specific locations and monitor usage.",
      icon: Laptop,
      metrics: "Track 500+ IT devices across multiple campuses"
    },
    {
      title: "Library Inventory Management",
      description: "Track library books, textbooks, and educational materials. Monitor check-out status, condition, and location of all library inventory.",
      icon: Book,
      metrics: "Manage thousands of books and materials"
    },
    {
      title: "Classroom Supply Tracking",
      description: "Track classroom supplies, art materials, science equipment, and other educational resources. Ensure teachers have what they need when they need it.",
      icon: Package,
      metrics: "Reduce supply shortages by 60%"
    },
    {
      title: "Multi-Campus Management",
      description: "Manage inventory across multiple campuses, buildings, and departments from one dashboard. Transfer equipment between locations with full traceability.",
      icon: MapPin,
      metrics: "Manage inventory across unlimited campuses"
    },
    {
      title: "Asset Loss Prevention",
      description: "Prevent loss and theft by tracking equipment across all locations. Assign assets to specific classrooms or departments for accountability.",
      icon: AlertTriangle,
      metrics: "Reduce lost equipment by 40%"
    },
    {
      title: "Budget Planning",
      description: "Track inventory usage and costs to inform budget planning. Generate reports showing what needs replacement and where budget should be allocated.",
      icon: DollarSign,
      metrics: "Improve budget planning accuracy by 50%"
    }
  ];

  const metricsData = [
    {
      value: "500+",
      label: "Items Tracked",
      description: "Track equipment and supplies across campuses"
    },
    {
      value: "40%",
      label: "Reduction in Lost Equipment",
      description: "Prevent loss and theft with asset tracking"
    },
    {
      value: "20+",
      label: "Hours Saved Per Month",
      description: "Eliminate manual inventory audits"
    },
    {
      value: "60%",
      label: "Reduction in Supply Shortages",
      description: "Ensure teachers have what they need"
    },
    {
      value: "50%",
      label: "Better Budget Planning",
      description: "Make data-driven budget decisions"
    },
    {
      value: "99%",
      label: "Inventory Accuracy",
      description: "Real-time tracking ensures accurate records"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "IT Director, Riverside School District",
      content: "StockFlow transformed how we track IT equipment across our 8 campuses. We reduced lost equipment by 45% and saved 25 hours per month on inventory audits. The mobile scanning is perfect for our IT staff.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Library Coordinator, Central High School",
      content: "Tracking library books and textbooks used to be a nightmare. With StockFlow, we can see exactly where every book is, and we've reduced lost books by 50%. The budget planning reports are invaluable.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager, Elementary School District",
      content: "Managing classroom supplies across multiple schools was overwhelming. StockFlow makes it easy to track supplies, assign equipment, and ensure teachers have what they need. We've eliminated supply shortages completely.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Set Up Campuses",
      description: "Create locations for each campus, building, and department"
    },
    {
      step: "2",
      title: "Add Equipment & Supplies",
      description: "Add IT equipment, library books, and classroom supplies with barcodes"
    },
    {
      step: "3",
      title: "Assign Assets",
      description: "Assign equipment to specific classrooms, teachers, or departments"
    },
    {
      step: "4",
      title: "Track & Audit",
      description: "Use mobile scanning to track inventory and perform regular audits"
    }
  ];

  return (
    <SeoPageLayout 
      title="School Inventory Management for Educational Institutions"
      heroTitle="School Inventory Management for Educational Institutions"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="School Inventory Management Software | StockFlow"
        description="School inventory management for education. Track IT equipment, library books, and supplies across campuses. Reduce lost equipment 40%, save 20 hours/month. Free plan available."
        keywords="school inventory management, education inventory software, school supply tracking, IT asset tracking for schools, library inventory management, school equipment tracking, education inventory system, school inventory software, campus inventory management, school asset tracking, education inventory app, school inventory solution, multi-campus inventory, school supply management, education inventory tracking"
        url="https://www.stockflowsystems.com/education-inventory-management"
        structuredData={structuredData}
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
          feature: "Education Inventory Management"
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
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Track IT equipment, library books, and classroom supplies across all your campuses from one dashboard. Reduce lost equipment, eliminate supply shortages, and save hours every month with inventory management designed for schools.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>School inventory management</strong> is essential for educational institutions managing IT equipment, library books, and classroom supplies across multiple campuses. It helps schools maintain accurate inventory records, prevent loss and theft, optimize purchasing, and ensure resources are available when needed. Unlike manual methods, modern <strong>education inventory management software</strong> provides real-time visibility across all campuses.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Schools face unique challenges: tracking IT equipment across multiple classrooms and campuses, managing library books and textbooks, ensuring classroom supplies are available when teachers need them, and preventing loss and theft of valuable assets. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Education inventory management software</Link> like StockFlow helps schools overcome these challenges with multi-campus tracking, mobile scanning, and asset assignment. Learn more about <Link to="/solutions/mobile-inventory-management" className="text-blue-600 hover:underline font-semibold">mobile inventory management</Link> for on-the-go access.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Educational Institutions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact school inventory management has on educational operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metricsData.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Education Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How schools use StockFlow to manage inventory across campuses and departments.
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
              Track IT equipment, library books, and classroom supplies across all your campuses from one dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/education.png" 
              alt="StockFlow Education Inventory Management Dashboard - Track IT equipment, library books, and supplies across campuses"
              width={512}
              height={512}
              loading="lazy"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow education dashboard screenshot showing:
                - Multi-campus view
                - IT equipment tracking interface
                - Library book management
                - Classroom supply tracking
                - Asset assignment interface
                - Mobile scanning for school inventory */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow education inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Essential Features for <span className="text-blue-600">School Inventory</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized features designed for educational inventory management.
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
              Set up school inventory management across all your campuses in minutes.
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
              Success Stories from <span className="text-blue-600">Education Professionals</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how schools have transformed their inventory management with StockFlow.
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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Schools Choose <span className="text-blue-600">StockFlow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Asset Protection
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>40% reduction</strong> in lost equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Asset assignment</strong> ensures accountability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Real-time tracking</strong> prevents theft</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Regular audits</strong> maintain accuracy</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-600" />
                Time & Cost Savings
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>20+ hours per month</strong> saved on inventory audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>60% reduction</strong> in supply shortages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Better budget planning</strong> with usage reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Mobile scanning</strong> eliminates manual entry</span>
                </li>
              </ul>
            </div>
          </div>
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




