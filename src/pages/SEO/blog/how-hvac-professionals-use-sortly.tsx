import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { CheckCircle, Wrench, Building, Zap, Users, BarChart3, AlertTriangle, Package } from "lucide-react";

const topicTitle = "How HVAC Professionals Use Inventory Management";
const canonicalPath = "/how-hvac-professionals-use-sortly";
const metaDescription = "Discover how HVAC professionals use inventory management software to track equipment, manage parts inventory, optimize service operations, and improve efficiency. Learn best practices for HVAC inventory management.";
const keywords = "hvac inventory management, hvac professionals inventory, hvac equipment tracking, hvac parts inventory, hvac service inventory, sortly hvac, hvac inventory software, hvac contractor inventory, hvac tools tracking, hvac supplies management";
const heroBadge = "Industry Guide • Updated November 2025";

const faqData = [
  {
    question: "How do HVAC professionals use inventory management software?",
    answer: "HVAC professionals use inventory management software to track equipment, parts, and tools across multiple job sites and service vehicles. They manage HVAC parts inventory, track equipment maintenance schedules, monitor stock levels for common repairs, and ensure technicians have the right parts when needed. Modern inventory software like StockFlow helps HVAC contractors maintain accurate inventory counts, reduce downtime from missing parts, and improve service efficiency."
  },
  {
    question: "What inventory items do HVAC professionals need to track?",
    answer: "HVAC professionals need to track a wide range of inventory items including HVAC parts (compressors, coils, filters, thermostats), tools and equipment (refrigerant gauges, vacuum pumps, multimeters), consumables (refrigerant, duct tape, wire), and safety equipment. They also track equipment by location, whether in service vehicles, warehouses, or at customer sites. Effective HVAC inventory management ensures technicians have the right parts when they arrive at a job site."
  },
  {
    question: "Why is inventory management important for HVAC contractors?",
    answer: "Inventory management is crucial for HVAC contractors because missing parts lead to service delays, customer dissatisfaction, and lost revenue. Proper HVAC inventory tracking helps contractors reduce emergency parts orders, optimize stock levels, track equipment maintenance schedules, improve technician productivity, and reduce carrying costs. It also ensures compliance with regulations for refrigerants and other controlled substances."
  },
  {
    question: "How can HVAC professionals track inventory across multiple service vehicles?",
    answer: "HVAC professionals can track inventory across multiple service vehicles using mobile inventory management software. StockFlow provides real-time tracking of parts and equipment in each vehicle, allowing dispatchers to see what's available before assigning jobs. Technicians can scan barcodes to update inventory levels, check parts availability, and request restocking. This ensures optimal inventory distribution across the fleet."
  },
  {
    question: "What features should HVAC inventory management software have?",
    answer: "HVAC inventory management software should include mobile barcode scanning, multi-location tracking (vehicles, warehouses, job sites), real-time inventory updates, low stock alerts for critical parts, equipment maintenance tracking, integration with service scheduling software, photo documentation, and reporting on parts usage and costs. StockFlow offers all these features specifically designed for field service operations."
  },
  {
    question: "How does inventory management improve HVAC service efficiency?",
    answer: "Inventory management improves HVAC service efficiency by ensuring technicians have the right parts when they arrive at job sites, reducing return trips and service delays. It helps optimize parts ordering, reduces emergency purchases, tracks which parts are used most frequently, and provides data to make informed purchasing decisions. This leads to faster service completion, higher customer satisfaction, and improved profitability."
  },
  {
    question: "Can HVAC inventory software track refrigerant and controlled substances?",
    answer: "Yes, modern HVAC inventory management software can track refrigerants and other controlled substances with proper documentation and compliance features. StockFlow allows HVAC professionals to track refrigerant types, quantities, lot numbers, and expiration dates. This helps ensure compliance with EPA regulations, track usage for reporting, and maintain proper documentation for audits."
  },
  {
    question: "How do HVAC professionals manage seasonal inventory fluctuations?",
    answer: "HVAC professionals manage seasonal inventory fluctuations by using inventory management software to analyze historical usage patterns, forecast demand based on weather and seasonal trends, and adjust stock levels accordingly. During peak seasons (summer for AC, winter for heating), they increase stock of high-demand parts. Inventory software provides insights to optimize seasonal purchasing and reduce excess inventory during off-seasons."
  },
  {
    question: "What are common inventory management challenges for HVAC contractors?",
    answer: "Common challenges include tracking inventory across multiple vehicles and locations, preventing stockouts of critical parts, managing seasonal demand fluctuations, controlling costs of high-value equipment, ensuring technicians have parts when needed, tracking tool and equipment maintenance, and maintaining accurate inventory counts. Inventory management software addresses these challenges with real-time tracking, automated alerts, and comprehensive reporting."
  },
  {
    question: "How can small HVAC businesses benefit from inventory management software?",
    answer: "Small HVAC businesses benefit from inventory management software by gaining visibility into their inventory, reducing waste from overstocking, preventing service delays from missing parts, improving cash flow through better inventory control, and scaling operations efficiently. StockFlow offers affordable plans starting with a free tier, making professional inventory management accessible to small HVAC contractors."
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How HVAC Professionals Use Inventory Management Software",
    "description": metaDescription,
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
    "datePublished": "2025-11-20",
    "dateModified": "2025-11-20",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.stockflow.be${canonicalPath}`
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
];

export default function HowHvacProfessionalsUseSortlyPage() {
  usePageRefresh();
  const location = useLocation();

  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle={topicTitle}
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="How HVAC Professionals Use Inventory Management Software | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflow.be${canonicalPath}`}
      />

      <StructuredData data={structuredData} />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          HVAC professionals face unique inventory management challenges. From tracking parts across multiple service vehicles to managing seasonal demand fluctuations, effective inventory management is critical for HVAC contractors to deliver timely service and maintain profitability. Modern inventory management software like StockFlow helps HVAC professionals streamline operations, reduce downtime, and improve customer satisfaction.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          This comprehensive guide explores how HVAC professionals use inventory management software to track equipment, manage parts inventory, optimize service operations, and overcome common challenges in the HVAC industry.
        </p>
      </div>

      {/* Key Challenges Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Key <span className="text-blue-600">HVAC Inventory Challenges</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            HVAC contractors face several unique inventory management challenges that require specialized solutions:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multi-Location Tracking</h3>
              <p className="text-gray-700">
                HVAC professionals need to track inventory across service vehicles, warehouses, and customer job sites. Without proper systems, parts can be misplaced, leading to service delays and customer dissatisfaction.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Critical Parts Availability</h3>
              <p className="text-gray-700">
                Missing critical parts like compressors, coils, or thermostats can result in incomplete service calls, requiring return visits that cost time and money while frustrating customers.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Seasonal Demand Fluctuations</h3>
              <p className="text-gray-700">
                HVAC businesses experience significant seasonal variations in demand. Summer requires more AC parts, while winter demands heating components. Managing these fluctuations requires data-driven inventory planning.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <Wrench className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Equipment Maintenance Tracking</h3>
              <p className="text-gray-700">
                HVAC professionals must track not just parts but also tools and equipment maintenance schedules. Proper maintenance tracking ensures tools are ready when needed and prevents equipment failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How HVAC Professionals Use Inventory Software */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How HVAC Professionals Use <span className="text-blue-600">Inventory Management Software</span>
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-start mb-4">
                <Building className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Service Vehicle Inventory Management</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    HVAC technicians carry essential parts and tools in their service vehicles. Inventory management software allows dispatchers to see what's available in each vehicle before assigning jobs. Technicians can scan barcodes to update inventory levels in real-time, ensuring accurate tracking and preventing stockouts.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Real-time visibility into vehicle inventory levels</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Mobile barcode scanning for quick updates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Automated alerts when critical parts run low</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-start mb-4">
                <Package className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Parts Inventory Optimization</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    HVAC professionals use inventory software to analyze parts usage patterns and optimize stock levels. By tracking which parts are used most frequently, contractors can maintain appropriate stock levels, reduce emergency purchases, and improve cash flow.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Usage analytics to identify high-demand parts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Automated reorder points for critical components</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Cost tracking and profitability analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-start mb-4">
                <Zap className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Equipment and Tool Tracking</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Beyond parts, HVAC professionals track expensive tools and equipment. Inventory management software helps track tool locations, maintenance schedules, and ensures technicians have the right equipment for each job.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Track tool assignments to technicians</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Schedule preventive maintenance for equipment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Monitor equipment utilization and ROI</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-start mb-4">
                <Users className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Team Collaboration and Dispatch</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Inventory management software enables better coordination between dispatchers and technicians. Dispatchers can see parts availability before assigning jobs, reducing the likelihood of sending technicians to jobs without necessary parts.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Real-time inventory visibility for dispatchers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Technician access to inventory from mobile devices</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Automated notifications for low stock situations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Best Practices for <span className="text-blue-600">HVAC Inventory Management</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Categorize Inventory by Priority</h3>
              <p className="text-gray-700 mb-4">
                Classify HVAC parts into categories based on criticality and usage frequency. Critical parts that cause service delays should have higher stock levels and more frequent monitoring.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">2. Implement Mobile Barcode Scanning</h3>
              <p className="text-gray-700 mb-4">
                Use mobile barcode scanning to update inventory in real-time. Technicians can quickly scan parts as they use them, ensuring accurate inventory counts without manual data entry.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">3. Set Up Automated Alerts</h3>
              <p className="text-gray-700 mb-4">
                Configure low stock alerts for critical HVAC parts. Automated notifications ensure you never run out of essential components that could delay service calls.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">4. Track Seasonal Demand Patterns</h3>
              <p className="text-gray-700 mb-4">
                Analyze historical usage data to predict seasonal demand. Increase stock of AC parts before summer and heating components before winter to meet increased demand.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">5. Maintain Equipment Maintenance Records</h3>
              <p className="text-gray-700 mb-4">
                Track maintenance schedules for tools and equipment. Regular maintenance ensures equipment is ready when needed and extends the life of expensive tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">6. Integrate with Service Scheduling</h3>
              <p className="text-gray-700 mb-4">
                Connect inventory management with service scheduling software. This ensures dispatchers can see parts availability when assigning jobs, reducing service delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Benefits of Inventory Management for <span className="text-blue-600">HVAC Professionals</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reduced Service Delays</h3>
              <p className="text-gray-700">
                Ensure technicians have the right parts when they arrive at job sites, eliminating return trips and improving customer satisfaction.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lower Inventory Costs</h3>
              <p className="text-gray-700">
                Optimize stock levels to reduce carrying costs while maintaining service levels. Data-driven decisions prevent overstocking and stockouts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Improved Cash Flow</h3>
              <p className="text-gray-700">
                Better inventory control reduces emergency purchases and optimizes purchasing decisions, improving overall cash flow and profitability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enhanced Productivity</h3>
              <p className="text-gray-700">
                Technicians spend less time searching for parts and more time servicing customers. Dispatchers can make better job assignments based on inventory availability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Better Compliance</h3>
              <p className="text-gray-700">
                Track refrigerants and controlled substances with proper documentation, ensuring compliance with EPA regulations and audit requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Scalable Operations</h3>
              <p className="text-gray-700">
                As your HVAC business grows, inventory management software scales with you, supporting multiple vehicles, locations, and technicians efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* StockFlow for HVAC Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Why HVAC Professionals Choose <span className="text-blue-600">StockFlow</span>
          </h2>
          
          <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            StockFlow provides specialized inventory management features designed for HVAC contractors and field service professionals.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mobile-First Design</h3>
              <p className="text-gray-700 mb-4">
                StockFlow's mobile app allows HVAC technicians to scan barcodes, update inventory, and check parts availability directly from their smartphones. No special hardware required - just use your phone's camera.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Works offline and syncs when connected</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>iOS and Android compatible</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Real-time updates across all devices</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Multi-Location Tracking</h3>
              <p className="text-gray-700 mb-4">
                Track inventory across service vehicles, warehouses, and job sites. StockFlow provides real-time visibility into inventory levels at each location, helping dispatchers make informed decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited locations and vehicles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Transfer inventory between locations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Location-specific low stock alerts</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Automated Alerts and Reporting</h3>
              <p className="text-gray-700 mb-4">
                Set up automated low stock alerts for critical HVAC parts. StockFlow's reporting features help you analyze usage patterns, optimize stock levels, and make data-driven purchasing decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Customizable reorder points</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Usage analytics and trends</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Cost tracking and profitability analysis</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Affordable Pricing</h3>
              <p className="text-gray-700 mb-4">
                StockFlow offers flexible pricing plans starting with a free tier, making professional inventory management accessible to HVAC contractors of all sizes. Scale up as your business grows.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Free plan for small HVAC businesses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>No long-term contracts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Easy setup and onboarding</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/auth"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
            >
              Start Free Trial
            </Link>
            <p className="text-gray-600 mt-4">No credit card required • Start tracking your HVAC inventory today</p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/electrical-inventory-management"
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Electrical Inventory Management</h3>
              <p className="text-sm text-gray-600">Learn how electrical contractors manage inventory</p>
            </Link>
            <Link
              to="/contractor-inventory-management"
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Contractor Inventory Management</h3>
              <p className="text-sm text-gray-600">Best practices for contractor inventory tracking</p>
            </Link>
            <Link
              to="/inventory-software"
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-blue-600 mb-2">Inventory Software</h3>
              <p className="text-sm text-gray-600">Discover StockFlow's inventory management features</p>
            </Link>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

