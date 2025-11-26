import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Package, MapPin, Smartphone, BarChart3, Users, Zap, TrendingUp, ArrowRight, Clock } from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function WarehouseManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is the difference between warehouse management and inventory management?",
      answer: "Inventory management focuses on tracking quantities and orders. Warehouse management goes further with focus on physical locations, zones, picking, packing and shipping. It encompasses the complete warehouse operation from receiving to dispatch."
    },
    {
      question: "What features should warehouse management software have?",
      answer: "Essential features include: multi-location support, barcode scanning, zone and bin management, picking and packing workflows, shipping integration, mobile access for the warehouse team, and real-time inventory tracking per location."
    },
    {
      question: "Is warehouse management software suitable for small warehouses?",
      answer: "Absolutely! Modern warehouse management software is scalable. StockFlow is perfect for both small warehouses with one location and large operations with multiple warehouses. You only pay for what you need."
    },
    {
      question: "Can I integrate warehouse management software with my webshop?",
      answer: "Yes, professional warehouse management software integrates seamlessly with webshop platforms. This provides automatic order import, inventory sync and shipping tracking. Perfect for e-commerce fulfillment."
    },
    {
      question: "How does barcode scanning help with warehouse management?",
      answer: "Barcode scanning increases accuracy to 99.9% and makes processes 5x faster. You scan products at receiving, storage, picking and shipping. This eliminates virtually all errors and saves enormous amounts of time."
    }
  ];

  const warehouseFeatures = [
    {
      icon: MapPin,
      title: "Multi-Location Management",
      description: "Manage multiple warehouses, zones and racks from one central system.",
      color: "blue"
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan products with your smartphone or dedicated scanner for fast processing.",
      color: "green"
    },
    {
      icon: Package,
      title: "Picking & Packing",
      description: "Optimized workflows for efficient order picking and packaging.",
      color: "purple"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Assign tasks, track performance and collaborate with your warehouse team.",
      color: "orange"
    },
    {
      icon: BarChart3,
      title: "Real-time Reporting",
      description: "Live insights into inventory locations, movements and warehouse efficiency.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Shipping Integration",
      description: "Connect with shipping partners for automatic labels and tracking.",
      color: "yellow"
    }
  ];

  const warehouseTypes = [
    {
      type: "E-commerce Fulfillment",
      description: "For webshops that want to ship fast and accurately",
      features: ["Multi-channel order import", "Batch picking support", "Shipping label automation"]
    },
    {
      type: "Wholesale Distribution",
      description: "For wholesalers with large volumes and many SKUs",
      features: ["Bulk receiving and putaway", "Zone-based storage", "Pallet tracking"]
    },
    {
      type: "Retail Inventory",
      description: "For retailers with central warehouse and stores",
      features: ["Store replenishment", "Multi-location transfers", "Cross-docking support"]
    },
    {
      type: "Production & Assembly",
      description: "For manufacturers with raw materials and finished goods",
      features: ["BOM (Bill of Materials)", "Work-in-progress tracking", "Quality control checks"]
    }
  ];

  return (
    <SeoPageLayout 
      title="Warehouse Management Software"
      heroTitle="Warehouse Management Software"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Warehouse Management Software 2025 | Best WMS | Free Plan | StockFlow"
        description="Discover the best warehouse management software 2025. Real-time tracking, barcode scanning, multi-location support. Reduce costs 30% & save 20 hours/week. Start free today."
        keywords="warehouse management software, warehouse management, warehouse software, warehouse management system, WMS software, warehouse optimization, warehouse tracking, stockflow warehouse management"
        url="https://www.stockflow.be/warehouse-management"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/warehouse-management" },
          { lang: "nl", url: "https://www.stockflow.be/magazijnbeheer" }
        ]}
      />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Transform your warehouse operations with professional warehouse management software. From receiving to shipping - optimize every process with modern inventory management software.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Warehouse management software helps businesses control and optimize warehouse operations, from receiving and storing goods to picking, packing, and shipping. It provides real-time visibility, intelligent task assignment, and seamless integrations with ERP, e-commerce, and supply chain systems. For e-commerce businesses, <Link to="/solutions/shopify-plus-wms-integration" className="text-blue-600 hover:underline font-semibold">Shopify Plus WMS integration</Link> automates inventory sync. Use <Link to="/solutions/warehouse-modeling-software" className="text-blue-600 hover:underline font-semibold">warehouse modeling software</Link> to optimize layouts and increase capacity by 20-30%.
        </p>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Warehouse Management Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All tools you need to run your warehouse efficiently and error-free
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {warehouseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
                red: 'bg-red-100 text-red-600',
                yellow: 'bg-yellow-100 text-yellow-600'
              };
              
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warehouse Types Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Warehouse Management for Every Type of Business</h2>
            <p className="text-xl text-gray-600">
              Whether you're running fulfillment, distribution, retail or production - we've got you covered
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {warehouseTypes.map((type, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-3 text-indigo-600">{type.type}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose StockFlow for Warehouse Management?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6">Easy Implementation, Fast ROI</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg mb-1">Get Started in 24 Hours</strong>
                    <p className="text-gray-600">No complex setup or expensive consultants needed. Start managing your warehouse today.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg mb-1">See Results Within Weeks</strong>
                    <p className="text-gray-600">Most customers see efficiency improvements within the first month of using StockFlow.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Zap className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-lg mb-1">Scale As You Grow</strong>
                    <p className="text-gray-600">Start small and expand your warehouse operations without switching systems.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-white">
              <h4 className="text-2xl font-bold mb-4">Average Customer Results</h4>
              <div className="space-y-6">
                <div>
                  <div className="text-5xl font-bold mb-2">75%</div>
                  <p className="text-indigo-200">Faster Order Fulfillment</p>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">99.8%</div>
                  <p className="text-indigo-200">Order Accuracy Rate</p>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">40%</div>
                  <p className="text-indigo-200">Reduction in Operational Costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Schema.org Structured Data */}
      <StructuredData data={[
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
        },
        {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StockFlow - Warehouse Management Software",
                "description": "Professional warehouse management software with multi-location support, barcode scanning and shipping integration. Increase efficiency and eliminate errors in your warehouse.",
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": "SaaS",
                "operatingSystem": "Web Browser",
                "softwareVersion": "2.0",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "32",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "featureList": [
                  "Multi-location management",
                  "Barcode scanning",
                  "Picking & packing",
                  "Team management",
                  "Real-time reporting",
                  "Shipping integration"
                ],
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
                "url": "https://www.stockflow.be/warehouse-management",
                "inLanguage": "en",
                "availableLanguage": ["en", "nl"]
              }
      ]} />
    </SeoPageLayout>
  );
}



