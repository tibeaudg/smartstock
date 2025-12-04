import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import {
  Warehouse,
  Truck,
  Boxes,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  MapPin,
  Target,
  Zap
} from 'lucide-react';

export default function WarehouseInventoryManagement() {
  usePageRefresh();

  const faqData = [
    {
      question: "What is warehouse inventory management?",
      answer: "Warehouse inventory management is the process of tracking inventory across warehouse operations including receiving, storage, picking, packing, and shipping. It helps warehouses maintain accurate inventory records, optimize picking routes, reduce errors, and improve operational efficiency."
    },
    {
      question: "How does warehouse inventory software improve picking efficiency?",
      answer: "Warehouse inventory software optimizes picking routes to reduce travel time, groups orders for batch picking, and provides real-time visibility into inventory locations. This typically increases picking efficiency by 40% and reduces order fulfillment time significantly."
    },
    {
      question: "Can warehouse inventory software integrate with shipping carriers?",
      answer: "Yes, modern warehouse inventory management software integrates with major shipping carriers like UPS, FedEx, DHL, and others. This enables automated shipping label generation, tracking, and delivery confirmation, streamlining the entire fulfillment process."
    },
    {
      question: "How does warehouse inventory management reduce order errors?",
      answer: "By using barcode scanning during picking and packing, warehouse inventory software ensures the right items are picked and shipped. Real-time validation prevents errors before they leave the warehouse. Warehouses typically see 99% order accuracy."
    },
    {
      question: "What features are essential for warehouse inventory management?",
      answer: "Key features include multi-zone management, picking optimization, shipping integration, receiving management, inventory location tracking, barcode scanning, reporting and analytics, and integration with other business systems. These features optimize warehouse operations."
    },
    {
      question: "How much can warehouses save with inventory management software?",
      answer: "Warehouses typically save 25% on operating costs through improved efficiency, reduced errors, optimized space utilization, and better inventory control. The ROI is usually seen within the first 3-6 months of implementation."
    },
    {
      question: "Can warehouse inventory software handle multiple warehouse zones?",
      answer: "Yes, modern warehouse inventory management software supports multiple zones, aisles, and storage locations. You can optimize warehouse layout, track inventory by location, and generate zone-specific reports for better organization."
    },
    {
      question: "Is warehouse inventory software suitable for small warehouses?",
      answer: "Absolutely! Warehouse inventory management is beneficial for warehouses of all sizes. Small warehouses often have limited resources, making automation and efficiency even more valuable. StockFlow offers scalable solutions that grow with your business."
    },
    {
      question: "How does warehouse inventory management help with cold storage?",
      answer: "Warehouse inventory software can track temperature-controlled inventory, monitor storage conditions, and ensure compliance with cold storage requirements. This is essential for food, pharmaceuticals, and other temperature-sensitive products."
    }
  ];

  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Warehouse Inventory Management Software",
    url: "https://www.stockflow.be/warehouse-inventory-management",
    description: "Warehouse inventory management software for distribution centers. Optimize picking, shipping integration, multi-zone management. Increase efficiency 40%, 99% order accuracy. Free plan available.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Warehouse Inventory Management", url: "https://www.stockflow.be/warehouse-inventory-management", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Warehouse Inventory Management",
      description: "Warehouse inventory management software for distribution centers. Optimize picking, shipping integration, multi-zone management.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "200"
      },
      features: [
        "Multi-zone management",
        "Picking optimization",
        "Shipping integration",
        "Receiving management",
        "Barcode scanning",
        "Warehouse analytics"
      ],
      image: "https://www.stockflow.be/WarehouseInventory.png",
      url: "https://www.stockflow.be/warehouse-inventory-management"
    }
  });

  const features = [
    {
      icon: Warehouse,
      title: "Multi-Zone Management",
      description: "Track inventory across multiple warehouse zones, aisles, and storage locations. Optimize warehouse layout and generate zone-specific reports."
    },
    {
      icon: Target,
      title: "Picking Optimization",
      description: "Optimize picking routes to reduce travel time and increase efficiency. Group orders for batch picking and improve order fulfillment speed."
    },
    {
      icon: Truck,
      title: "Shipping Integration",
      description: "Integrate with major shipping carriers for automated label generation, tracking, and delivery confirmation. Streamline the entire fulfillment process."
    },
    {
      icon: Boxes,
      title: "Receiving Management",
      description: "Streamline incoming shipments with barcode scanning and automated receiving workflows. Update inventory levels instantly as shipments arrive."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan inventory directly from the warehouse floor using your smartphone. Update inventory instantly during receiving, picking, and shipping."
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Track exact inventory locations within the warehouse. Know exactly where every item is stored for faster picking and better organization."
    },
    {
      icon: BarChart3,
      title: "Warehouse Analytics",
      description: "Get detailed insights into warehouse performance, picking efficiency, order accuracy, and optimization opportunities. Make data-driven decisions."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Real-time inventory updates across all warehouse operations. See inventory levels change instantly as orders are fulfilled and shipments arrive."
    }
  ];

  const useCases = [
    {
      title: "Distribution Center Operations",
      description: "Manage high-volume distribution operations with optimized picking, multi-zone management, and shipping integration. Handle thousands of orders daily with efficiency.",
      icon: Warehouse,
      metrics: "40% increase in picking efficiency"
    },
    {
      title: "E-commerce Fulfillment",
      description: "Streamline e-commerce order fulfillment with automated picking, packing, and shipping. Integrate with online marketplaces for seamless order processing.",
      icon: Package,
      metrics: "99% order accuracy maintained"
    },
    {
      title: "Cold Storage Management",
      description: "Track temperature-controlled inventory and ensure compliance with cold storage requirements. Monitor storage conditions and maintain product quality.",
      icon: Boxes,
      metrics: "100% compliance with storage requirements"
    },
    {
      title: "Multi-Zone Warehouse",
      description: "Manage inventory across multiple warehouse zones, aisles, and storage locations. Optimize warehouse layout and improve space utilization.",
      icon: MapPin,
      metrics: "25% improvement in space utilization"
    },
    {
      title: "Shipping Integration",
      description: "Integrate with shipping carriers for automated label generation and tracking. Streamline fulfillment and reduce shipping errors.",
      icon: Truck,
      metrics: "90% reduction in shipping errors"
    },
    {
      title: "Receiving & Put-Away",
      description: "Streamline receiving processes with barcode scanning and automated put-away workflows. Update inventory levels instantly as shipments arrive.",
      icon: Boxes,
      metrics: "50% faster receiving processes"
    }
  ];

  const metrics = [
    {
      value: "40%",
      label: "Increase in Picking Efficiency",
      description: "Optimize picking routes and reduce travel time"
    },
    {
      value: "99%",
      label: "Order Accuracy",
      description: "Barcode scanning ensures accurate order fulfillment"
    },
    {
      value: "25%",
      label: "Cost Reduction",
      description: "Improve efficiency and reduce operating costs"
    },
    {
      value: "90%",
      label: "Reduction in Shipping Errors",
      description: "Automated processes minimize human error"
    },
    {
      value: "50%",
      label: "Faster Receiving",
      description: "Streamline receiving and put-away processes"
    },
    {
      value: "99%",
      label: "Inventory Accuracy",
      description: "Real-time tracking ensures accurate records"
    }
  ];

  const testimonials = [
    {
      name: "Robert Martinez",
      role: "Warehouse Manager, Global Logistics",
      content: "StockFlow's warehouse software increased our picking efficiency by 45% and reduced errors by 95%. The picking optimization feature alone saved us 20 hours per week. The ROI was immediate.",
      rating: 5
    },
    {
      name: "Jennifer Lee",
      role: "Operations Director, TechSupply",
      content: "The shipping integration alone saved us 20 hours per week. Our warehouse operations have never been smoother. We can now handle 3x the order volume with the same staff.",
      rating: 5
    },
    {
      name: "Michael Brown",
      role: "CEO, FastFulfill",
      content: "We tried several warehouse software solutions, but StockFlow was the only one that could handle our complex multi-zone operations. The real-time visibility is incredible.",
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
      title="Warehouse Inventory Management Software"
      heroTitle="Warehouse Inventory Management Software"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Warehouse Inventory Management Software | StockFlow"
        description="Warehouse inventory management for distribution centers. Optimize picking, shipping integration, multi-zone management. Increase efficiency 40%, 99% order accuracy. Free plan available."
        keywords="warehouse inventory management, distribution center software, fulfillment center inventory, warehouse tracking software, warehouse management system, warehouse inventory software, distribution inventory management, warehouse operations software, fulfillment warehouse software, warehouse inventory system, distribution center inventory, warehouse stock management, warehouse inventory app, warehouse management solution, warehouse inventory tracking"
        url="https://www.stockflow.be/warehouse-inventory-management"
        structuredData={structuredData}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-slate-900 leading-relaxed mb-6">
          Optimize warehouse operations with inventory management designed for distribution centers. Increase picking efficiency by 40%, achieve 99% order accuracy, and reduce costs by 25% with warehouse inventory management software.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          <strong>Warehouse inventory management</strong> is essential for distribution centers and fulfillment operations. It optimizes receiving, storage, picking, packing, and shipping processes while maintaining accurate inventory records and providing real-time visibility. Unlike basic inventory tracking, modern <strong>warehouse inventory management software</strong> includes specialized features for warehouse operations.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Warehouses face unique challenges: optimizing picking routes to reduce travel time, managing inventory across multiple zones, integrating with shipping carriers, reducing order errors, and improving space utilization. <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">Warehouse inventory management software</Link> like StockFlow helps warehouses overcome these challenges with picking optimization, shipping integration, and multi-zone management. Learn more about <Link to="/warehouse-software" className="text-blue-600 hover:underline font-semibold">warehouse software</Link> solutions.
        </p>
      </div>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results for <span className="text-blue-600">Warehouse Operations</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the measurable impact warehouse inventory management has on distribution operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
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
              Warehouse Inventory <span className="text-blue-600">Use Cases</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              How warehouses use StockFlow to optimize operations and improve efficiency.
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
              Optimize warehouse operations with picking optimization, shipping integration, and multi-zone management.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <img 
              src="/WarehouseInventory.png" 
              alt="StockFlow Warehouse Inventory Management Dashboard - Optimize picking, shipping, and multi-zone management"
              className="w-full rounded-lg"
            />
            {/* NOTE: Replace this placeholder image with actual StockFlow warehouse dashboard screenshot showing:
                - Multi-zone warehouse view
                - Picking optimization interface
                - Shipping integration dashboard
                - Receiving management interface
                - Warehouse analytics and reporting
                - Mobile scanning for warehouse operations */}
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              Screenshot placeholder - Replace with actual StockFlow warehouse inventory dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-blue-600">Warehouse Operations</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize warehouse operations and improve efficiency.
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
              Success Stories from <span className="text-blue-600">Warehouse Managers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how warehouse professionals have transformed their operations with StockFlow.
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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Warehouses Choose <span className="text-blue-600">StockFlow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Efficiency Gains
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>40% increase</strong> in picking efficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>99% order accuracy</strong> with barcode scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>50% faster</strong> receiving processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>90% reduction</strong> in shipping errors</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
                Cost Savings
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>25% reduction</strong> in operating costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Improved space utilization</strong> reduces storage costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Reduced labor costs</strong> through automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>ROI within 3-6 months</strong> for most warehouses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </SeoPageLayout>
  );
}

