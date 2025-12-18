import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Warehouse,
  CheckCircle,
  Star,
  Target,
  Truck,
  Boxes,
  ArrowRight
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

export default function WarehouseSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const location = useLocation();
  
  // Get real customer data
  const relevantCaseStudies = getRelevantCaseStudies('warehouse software');
  const relevantTestimonials = getRelevantTestimonials('inventory');
  const metrics = getProprietaryMetrics('warehouse software');
  const benchmarks = getIndustryBenchmarks('Retail');
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));
  const [roiInputs, setRoiInputs] = useState({
    inventoryValue: '',
    hoursPerWeek: '',
    hourlyRate: '',
    stockoutLosses: ''
  });
  const [roiResult, setRoiResult] = useState<{
    carryingCostSavings: number;
    timeSavings: number;
    stockoutSavings: number;
    netSavings: number;
    roi: number;
  } | null>(null);
  
  const faqData = [
    {
      question: "What is warehouse software?",
      answer: "Warehouse software is a comprehensive system that helps businesses manage warehouse operations including inventory tracking, order fulfillment, shipping, receiving, and warehouse optimization. It provides real-time visibility into warehouse activities and improves operational efficiency."
    },
    {
      question: "What are the key features of warehouse software?",
      answer: "Key features include inventory tracking, barcode scanning, order management, shipping integration, receiving management, warehouse layout optimization, picking and packing workflows, reporting and analytics, and integration with other business systems."
    },
    {
      question: "How does warehouse software improve efficiency?",
      answer: "Warehouse software improves efficiency by automating manual processes, optimizing picking routes, reducing errors, providing real-time inventory visibility, streamlining order fulfillment, and enabling better space utilization and workforce management."
    },
    {
      question: "Can warehouse software integrate with shipping carriers?",
      answer: "Yes, modern warehouse software like StockFlow integrates with major shipping carriers and logistics providers, enabling automated shipping label generation, tracking, and delivery confirmation."
    },
    {
      question: "Is warehouse software suitable for small warehouses?",
      answer: "Absolutely! Warehouse software is beneficial for warehouses of all sizes. StockFlow offers scalable solutions that grow with your business, from small operations to large distribution centers."
    }
  ];

  // Generate structured data
  const structuredData = generateSeoPageStructuredData({
    title: "Best Warehouse Software - Streamline Operations",
    description: "Streamline your warehouse operations with the best warehouse software. Inventory tracking, shipping integration, picking optimization, and more.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Best Warehouse Software",
      description: "Streamline your warehouse operations with the best warehouse software. Inventory tracking, shipping integration, picking optimization, and more.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Warehouse layout management",
        "Shipping integration",
        "Receiving management",
        "Picking optimization",
        "Warehouse analytics",
        "Team management"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Warehouse,
      title: "Warehouse Layout Management",
      description: "Optimize your warehouse layout and track inventory across multiple zones and locations."
    },
    {
      icon: Truck,
      title: "Shipping Integration",
      description: "Integrate with major shipping carriers for automated label generation and tracking."
    },
    {
      icon: Boxes,
      title: "Receiving Management",
      description: "Streamline incoming shipments with barcode scanning and automated receiving workflows."
    },
    {
      icon: Target,
      title: "Picking Optimization",
      description: "Optimize picking routes and reduce travel time with intelligent warehouse management."
    },
    {
      icon: BarChart3,
      title: "Warehouse Analytics",
      description: "Get detailed insights into warehouse performance, productivity, and optimization opportunities."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage warehouse staff with role-based access and task assignment capabilities."
    }
  ];

  const benefits = [
    "Reduce warehouse operating costs by 25%",
    "Improve order accuracy to 99%+",
    "Increase picking efficiency by 40%",
    "Reduce shipping errors by 90%",
    "Optimize warehouse space utilization",
    "Streamline receiving processes",
    "Enhance inventory visibility",
    "Improve customer satisfaction"
  ];

  const warehouseTypes = [
    {
      title: "Small Warehouse",
      description: "Perfect for small businesses with basic warehouse needs.",
      icon: "ðŸª",
      features: ["Basic inventory tracking", "Simple order management", "Barcode scanning"]
    },
    {
      title: "Distribution Center",
      description: "Ideal for large-scale distribution operations.",
      icon: "ðŸ­",
      features: ["Multi-zone management", "Advanced picking", "Shipping integration"]
    },
    {
      title: "E-commerce Fulfillment",
      description: "Designed for online retailers and e-commerce businesses.",
      icon: "ðŸ’»",
      features: ["Order automation", "Multi-channel sync", "Real-time updates"]
    },
    {
      title: "Cold Storage",
      description: "Specialized for temperature-controlled warehouse operations.",
      icon: "❄️",
      features: ["Temperature monitoring", "Compliance tracking", "Specialized workflows"]
    }
  ];

  const testimonials = [
    {
      name: "Robert Martinez",
      role: "Warehouse Manager, Global Logistics",
      content: "StockFlow's warehouse software increased our picking efficiency by 45% and reduced errors by 95%. The ROI was immediate.",
      rating: 5
    },
    {
      name: "Jennifer Lee",
      role: "Operations Director, TechSupply",
      content: "The shipping integration alone saved us 20 hours per week. Our warehouse operations have never been smoother.",
      rating: 5
    },
    {
      name: "Michael Brown",
      role: "CEO, FastFulfill",
      content: "We tried several warehouse software solutions, but StockFlow was the only one that could handle our complex multi-zone operations.",
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Receiving",
      description: "Scan incoming shipments and automatically update inventory levels"
    },
    {
      step: "2",
      title: "Storage",
      description: "Track inventory locations and optimize warehouse space utilization"
    },
    {
      step: "3",
      title: "Picking",
      description: "Generate optimized picking lists and routes for maximum efficiency"
    },
    {
      step: "4",
      title: "Shipping",
      description: "Automate shipping label generation and track packages"
    }
  ];

  return (
    <SeoPageLayout 
      title="Warehouse Software"
      heroTitle="Warehouse Software"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Warehouse Software 2025 - Best WMS Solutions | StockFlow"
        description="Best warehouse software for distribution centers. Inventory tracking, shipping integration, picking optimization, receiving management. Reduce costs by 25%, improve efficiency by 40%. Start free trial."
        keywords="warehouse software, warehouse management software, warehouse management system, WMS software, warehouse operations software, warehouse tracking software, warehouse inventory software, warehouse automation software, warehouse optimization software, warehouse management solution, warehouse software for small business, best warehouse software, warehouse software comparison, warehouse software features, warehouse software pricing, warehouse software demo, warehouse software trial, warehouse software reviews"
        url="https://www.stockflowsystems.com/warehouse-software"
        structuredData={structuredData}
      />

      {/* Industry Benchmarks */}
      <IndustryBenchmarks 
        industry="Retail"
        benchmarks={benchmarks}
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "8 hours/week",
          averageCostSaved: benchmarks.averageSavings,
          keyMetric: benchmarks.typicalResult,
          feature: "Warehouse Software"
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
        <p className="text-lg black leading-relaxed mb-6">
          Transform your warehouse with powerful software that streamlines operations, reduces costs, and improves efficiency. From receiving to shipping, StockFlow handles it all.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Warehouse software is essential for modern distribution centers and fulfillment operations. It optimizes receiving, put-away, picking, packing, and shipping processes while maintaining accurate inventory records and providing real-time visibility.
        </p>
      </div>

      {/* What is Warehouse Software Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is <span className="text-blue-600">Warehouse Software</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Warehouse software, also known as Warehouse Management System (WMS), is a comprehensive solution that helps businesses manage all aspects of warehouse operations. It optimizes inventory tracking, order fulfillment, shipping, and warehouse layout for maximum efficiency.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Modern warehouse software goes beyond simple inventory tracking to provide intelligent automation, real-time visibility, and data-driven insights that transform warehouse operations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Increase Efficiency</h3>
                  <p className="text-sm text-blue-700">Optimize picking routes and reduce operational costs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Reduce Errors</h3>
                  <p className="text-sm text-green-700">Automate processes and minimize human errors</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Warehouse Operations</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Receiving and put-away management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Inventory tracking and location management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Order picking and packing optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Shipping and carrier integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Performance analytics and reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful <span className="text-blue-600">Warehouse Software</span> Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your warehouse operations and maximize efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your <span className="text-blue-600">Warehouse Operations</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See immediate results with our comprehensive warehouse software solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
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
              Streamlined <span className="text-blue-600">Warehouse Workflow</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From receiving to shipping, StockFlow optimizes every step of your warehouse operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for Every <span className="text-blue-600">Warehouse Type</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're running a small warehouse or a large distribution center, StockFlow adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {warehouseTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Warehouse Managers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how warehouse professionals have transformed their operations with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Optimize Your Warehouse Operations?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of warehouses using StockFlow to streamline their operations and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Trial
            </Link>
        
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free trial
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


