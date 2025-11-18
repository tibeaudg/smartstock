import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  Palette,
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
  MapPin,
  Sofa,
  Lightbulb,
  Image,
  Ruler
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Link } from 'react-router-dom';

export default function InteriorDesignInventoryManagement() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is interior design inventory management?",
      answer: "Interior design inventory management is a specialized system for tracking furniture, fixtures, fabrics, accessories, samples, and materials across multiple client projects, showrooms, and warehouses. It helps designers maintain visual catalogs, track items by project, manage client orders, monitor supplier deliveries, and coordinate installations."
    },
    {
      question: "Why do interior designers need specialized inventory software?",
      answer: "Interior designers manage diverse inventory across multiple client projects simultaneously, need visual catalogs with photos and specifications, track items by room and project, coordinate with multiple suppliers and trade accounts, manage client deposits and final payments, schedule deliveries and installations, and need to quickly find specific items or samples."
    },
    {
      question: "How can interior designers track inventory across multiple projects?",
      answer: "Use project-based inventory management where each item can be allocated to specific client projects. Tag items by project name, room, and status (ordered, in transit, received, installed). This provides clear visibility into what's ordered for each client and prevents mixing up items between projects."
    },
    {
      question: "Can I manage both physical inventory and client orders?",
      answer: "Yes, comprehensive interior design inventory systems handle both owned inventory (samples, staging furniture, accessories) and client-specific orders. Track purchased items from order placement through delivery and installation, while maintaining separate inventory for your showroom and samples."
    },
    {
      question: "How do I handle supplier lead times and delivery tracking?",
      answer: "Track expected delivery dates for each item, set up alerts for delayed shipments, maintain supplier performance metrics, and provide clients with real-time updates on order status. Link items to suppliers with their contact information, trade account numbers, and typical lead times."
    },
    {
      question: "Can I include photos and specifications in my inventory?",
      answer: "Yes, visual inventory management for interior design includes photo uploads, fabric swatches, finish samples, dimensions, specifications, supplier information, pricing, and client notes. Create visual catalogs that you can share with clients during the selection process."
    },
    {
      question: "How much does interior design inventory software cost?",
      answer: "Costs range from €50-500+/month depending on features and project volume. StockFlow offers a free plan for up to 100 products with full features, then pay-as-you-grow pricing (€0.004 per product/month for products 101+), making it affordable for solo designers and growing firms."
    },
    {
      question: "Can I generate reports for client billing and project costs?",
      answer: "Yes, generate reports showing all items ordered for a specific project, their costs, markups, and client prices. Track deposits received, payments made to suppliers, and outstanding balances. Export reports for client invoicing and project profitability analysis."
    }
  ];

  const keyFeatures = [
    {
      icon: Image,
      title: "Visual Inventory Catalogs",
      description: "Upload photos, fabric swatches, and finish samples. Create visual catalogs to share with clients during selection."
    },
    {
      icon: Target,
      title: "Project-Based Tracking",
      description: "Allocate items to specific client projects and rooms. Track status from selection through installation."
    },
    {
      icon: Package,
      title: "Supplier & Order Management",
      description: "Manage trade accounts, track purchase orders, monitor delivery dates, and maintain supplier contacts."
    },
    {
      icon: BarChart3,
      title: "Client Pricing & Billing",
      description: "Track your cost, markup, and client price for each item. Generate invoices and track payments."
    },
    {
      icon: MapPin,
      title: "Multi-Location Tracking",
      description: "Track inventory in your showroom, warehouse, in transit, at installation, and at client locations."
    },
    {
      icon: Camera,
      title: "Mobile Access",
      description: "Access inventory on-site during client meetings, at showrooms, or during installation using mobile devices."
    }
  ];

  const challenges = [
    {
      icon: AlertCircle,
      title: "Lost Track of Project Items",
      problem: "Managing multiple projects simultaneously leads to confusion about what's been ordered for which client.",
      solution: "Project-based tagging ensures every item is linked to the correct client and room, with clear status tracking."
    },
    {
      icon: Clock,
      title: "Supplier Delays & Tracking",
      problem: "Unable to provide clients with accurate delivery timelines, causing frustration and scheduling issues.",
      solution: "Track expected delivery dates, receive alerts for delays, and proactively communicate with clients."
    },
    {
      icon: DollarSign,
      title: "Pricing & Markup Errors",
      problem: "Manually calculating markups leads to pricing errors, reducing profitability or overcharging clients.",
      solution: "Automated markup calculation ensures consistent pricing and accurate client invoices."
    },
    {
      icon: FileText,
      title: "Disorganized Documentation",
      problem: "Specifications, invoices, and photos scattered across emails and folders, wasting time searching.",
      solution: "Centralized system with all product details, photos, specs, and documents in one searchable location."
    },
    {
      icon: Boxes,
      title: "Sample & Showroom Management",
      problem: "Can't find samples when needed for client presentations, or don't know what's available in showroom.",
      solution: "Visual catalog with search and filtering makes finding the right items instant."
    },
    {
      icon: Users,
      title: "Client Communication Gaps",
      problem: "Clients constantly asking for order status updates, taking up valuable design time.",
      solution: "Generate status reports showing all items, their current status, and expected delivery dates."
    }
  ];

  const essentialCategories = [
    {
      category: "Furniture",
      examples: ["Sofas & sectionals", "Chairs & seating", "Tables & desks", "Beds & headboards", "Storage & cabinets", "Outdoor furniture"]
    },
    {
      category: "Fabrics & Textiles",
      examples: ["Upholstery fabrics", "Drapery & curtains", "Bedding & linens", "Rugs & carpets", "Pillows & throws", "Fabric samples"]
    },
    {
      category: "Lighting",
      examples: ["Chandeliers & pendants", "Table & floor lamps", "Sconces & wall lights", "Recessed lighting", "Track lighting", "Decorative lighting"]
    },
    {
      category: "Accessories & Decor",
      examples: ["Artwork & mirrors", "Vases & decorative objects", "Candles & holders", "Books & magazines", "Plants & planters", "Decorative pillows"]
    },
    {
      category: "Window Treatments",
      examples: ["Curtains & drapes", "Blinds & shades", "Hardware & rods", "Valances & cornices", "Shutters", "Motorized systems"]
    },
    {
      category: "Finishes & Materials",
      examples: ["Paint samples", "Wallpaper", "Tile samples", "Wood finishes", "Stone samples", "Hardware & fixtures"]
    }
  ];

  const benefits = [
    { icon: DollarSign, text: "Increase profitability with accurate markup tracking" },
    { icon: Clock, text: "Save 10+ hours per week on project management" },
    { icon: CheckCircle, text: "Never mix up items between client projects" },
    { icon: Star, text: "Improve client satisfaction with status updates" },
    { icon: TrendingUp, text: "Grow your business with scalable systems" },
    { icon: Target, text: "Complete project visibility from order to install" },
    { icon: BarChart3, text: "Better project profitability analysis" },
    { icon: Shield, text: "Protect deposits and track client payments" }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Create Visual Catalog",
      description: "Upload photos and specifications for your furniture, fabrics, accessories, and samples. Include supplier info, pricing, and lead times."
    },
    {
      step: "2",
      title: "Set Up Project Structure",
      description: "Create projects for each client. Define rooms/spaces within each project. Set up custom tags for item categories and status."
    },
    {
      step: "3",
      title: "Add Supplier Information",
      description: "Enter your trade accounts, contact information, typical lead times, and payment terms for each supplier you work with."
    },
    {
      step: "4",
      title: "Configure Pricing Rules",
      description: "Set default markup percentages by category. Configure cost vs. client price tracking for accurate invoicing and profitability."
    },
    {
      step: "5",
      title: "Allocate Items to Projects",
      description: "As clients make selections, allocate items to their projects and rooms. Track status: specified, ordered, in transit, received, installed."
    },
    {
      step: "6",
      title: "Track Orders & Deliveries",
      description: "Log purchase orders, expected delivery dates, and tracking information. Set up alerts for delayed shipments."
    },
    {
      step: "7",
      title: "Generate Client Reports",
      description: "Create professional reports showing selections, costs, delivery status, and payment schedules for client communication."
    },
    {
      step: "8",
      title: "Monitor & Optimize",
      description: "Review project profitability, supplier performance, and delivery accuracy. Optimize your inventory and sourcing strategies."
    }
  ];

  const testimonials = [
    {
      name: "Alexandra Morgan",
      role: "Principal Designer, Morgan Interiors",
      content: "StockFlow transformed how I manage multiple client projects. The visual catalog and project-based tracking mean I never mix up orders, and clients love the detailed status reports I can now provide.",
      rating: 5,
      business: "Residential interior design"
    },
    {
      name: "David Chen",
      role: "Owner, Urban Design Studio",
      content: "We manage 15-20 projects simultaneously. StockFlow's supplier tracking and automated markup calculations have saved us countless hours and improved our profit margins by helping us catch pricing errors.",
      rating: 5,
      business: "Commercial & residential design"
    },
    {
      name: "Sophie Laurent",
      role: "Interior Designer",
      content: "The mobile access is fantastic for showroom visits and client meetings. I can instantly check if we've specified similar items for other clients and see real-time availability and pricing.",
      rating: 5,
      business: "Luxury residential design"
    }
  ];

  const costSavings = [
    {
      title: "Recovered Lost Revenue",
      before: "€8,000/year lost to markup calculation errors",
      after: "€500/year—95% reduction in pricing errors",
      savings: "€7,500/year recovered revenue"
    },
    {
      title: "Time Savings",
      before: "12 hours/week managing projects and tracking orders",
      after: "3 hours/week—75% time reduction",
      savings: "Worth €18,000/year at €50/hr"
    },
    {
      title: "Improved Cash Flow",
      before: "€15,000 tied up in untracked client deposits",
      after: "Complete visibility into deposits and payments",
      savings: "Better cash management & client relations"
    },
    {
      title: "Client Satisfaction",
      before: "Frequent client complaints about lack of updates",
      after: "Proactive status reports, happier clients",
      savings: "Higher referral rates & repeat business"
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
    { id: 'stockflow-solution', title: 'StockFlow for Designers', level: 1 },
    { id: 'testimonials', title: 'Success Stories', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Interior Design Inventory Management"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Interior Design Inventory Management 2025"
        description="Find out how interior design inventory management to optimize your inventory management. Discover how interior design inventory management to optimize your i..."
        keywords="interior design inventory management, interior designer software, furniture tracking, project-based inventory, design inventory system, supplier management, client project tracking, interior design business software"
        url="https://www.stockflow.be/interior-design-inventory-management"
      />

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full mb-6 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              For Interior Designers & Decorators
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interior Design Inventory Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              Visually manage furniture, fabrics, and accessories across multiple client projects. Track supplier orders, pricing, deliveries, and installations—all in one beautiful, intuitive system.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Visual catalogs with photos</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Project-based tracking</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Client pricing & reports</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Palette className="w-5 h-5 mr-2" />
                Start Free Trial
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center bg-white text-gray-800 font-semibold px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Interior Designers Need Specialized Inventory Management</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Interior designers face unique inventory challenges: managing <strong>dozens of items across multiple active client projects</strong>, tracking furniture and accessories from specification through installation, coordinating with numerous suppliers and trade accounts, maintaining visual catalogs for client presentations, and ensuring accurate <strong>pricing, markups, and billing</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A visual, project-based inventory system designed for interior design eliminates the chaos of spreadsheets and scattered notes, providing complete visibility into what's been specified, ordered, received, and installed for each client—with photos, pricing, and delivery tracking all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <Sofa className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10+ Hours</h3>
              <p className="text-gray-700">Saved per week on project management, order tracking, and client communication</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <DollarSign className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">€25,500+</h3>
              <p className="text-gray-700">Average annual savings from time efficiency, recovered revenue, and reduced errors</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <Star className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-700">Visibility into all client projects, orders, and delivery status at all times</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Common Challenges for Interior Designers</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These problems cost designers time, money, and client satisfaction—but they're all solvable.
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Features Built for Interior Designers</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Everything you need to manage design projects from concept to installation.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Design Workflow</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Photo Uploads & Gallery View</p>
                  <p className="text-sm text-gray-700">Beautiful visual catalogs with product photos and swatches</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Room-by-Room Tracking</p>
                  <p className="text-sm text-gray-700">Organize items by client project and specific rooms/spaces</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Status Updates</p>
                  <p className="text-sm text-gray-700">Track from specification → ordered → in transit → received → installed</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Client Presentations</p>
                  <p className="text-sm text-gray-700">Generate beautiful reports to share with clients</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Spec Sheets</p>
                  <p className="text-sm text-gray-700">Store dimensions, materials, finishes, and care instructions</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Installation Scheduling</p>
                  <p className="text-sm text-gray-700">Coordinate deliveries and installation dates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Categories Section */}
      <section id="essential-categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Categories to Track</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Common inventory categories for interior design projects.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <Boxes className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Benefits for Interior Designers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-10 h-10 text-purple-600 mb-4" />
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Savings Section */}
      <section id="cost-savings" className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Real Savings for Interior Designers</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Based on data from interior designers managing 10-15 concurrent client projects.
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
            <h3 className="text-3xl font-bold text-purple-600 mb-4">Total Annual Value: €25,500+</h3>
            <p className="text-xl text-gray-700">
              Plus immeasurable benefits in client satisfaction, referrals, and professional reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Getting Started Guide</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Step-by-step guide to implementing inventory management for your design business.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationSteps.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
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
      <section id="stockflow-solution" className="py-16 px-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Palette className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">StockFlow for Interior Designers</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Beautiful, visual inventory management designed specifically for interior designers who need to manage multiple client projects with style and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0</div>
              <div className="text-lg font-semibold mb-2">Start Free</div>
              <div className="text-sm opacity-90">Up to 100 products • Full features • No credit card</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">€0.004</div>
              <div className="text-lg font-semibold mb-2">Per Product/Month</div>
              <div className="text-sm opacity-90">Scalable as your business grows</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm opacity-90">We're here when you need us</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-center">Everything Designers Need</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Visual catalogs with photo uploads</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Project & room-based organization</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Supplier & order tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Client pricing & markup management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Delivery & installation tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Professional client reports</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile access for on-site work</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Sample & showroom management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Specifications & documentation</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Palette className="w-5 h-5 mr-2" />
                Start Free - No Credit Card Required
              </Link>
              <p className="text-sm text-gray-600 mt-4">Join 200+ interior designers using StockFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories from Designers</h2>
            <p className="text-lg text-gray-600">Real results from interior designers using StockFlow</p>
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
            <p className="text-lg text-gray-600">Everything interior designers need to know about inventory management</p>
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
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <Palette className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Streamline Your Design Projects?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join hundreds of interior designers managing projects more efficiently, increasing profitability, and delighting clients with StockFlow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/auth" 
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Palette className="w-5 h-5 mr-2" />
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
              Free plan • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Interior Design Inventory Management",
          "description": "Visual inventory management for interior designers with project-based tracking, supplier management, and client reports.",
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

