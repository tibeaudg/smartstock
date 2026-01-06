import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Trophy,
  Database
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';


export default function BestInventoryManagementSoftware() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  

  
  const faqData = [
    {
      question: "What is a cross-dock warehouse?",
      answer: "A cross-dock warehouse is a distribution facility where incoming shipments are unloaded from inbound trucks and immediately sorted, consolidated, and loaded onto outbound trucks with minimal or no storage time. Products spend hours or minutes in the facility rather than days or weeks, reducing handling costs, storage costs, and transit time. Cross-docking is used for high-velocity products, time-sensitive shipments, and consolidation operations."
    },
    {
      question: "How does cross-dock warehouse inventory management work?",
      answer: "Cross-dock warehouse inventory management tracks products as they flow through the facility in real-time. The system records inbound shipments, matches them to outbound orders, tracks sorting and consolidation, monitors loading operations, and provides visibility into product flow. Since products don't sit in storage, the system focuses on flow management rather than static inventory levels."
    },
    {
      question: "What are the benefits of cross-dock warehouse operations?",
      answer: "Benefits include: reduced storage costs (no long-term storage needed), faster order fulfillment (same-day or next-day shipping), lower handling costs (fewer touches), reduced inventory carrying costs, improved cash flow (faster inventory turnover), and better customer service (faster delivery). Cross-docking can reduce distribution costs by 20-30%."
    },
    {
      question: "What types of products are suitable for cross-docking?",
      answer: "Products suitable for cross-docking include: high-velocity items with predictable demand, time-sensitive products (perishables, urgent orders), products with short shelf lives, items that don't require quality inspection, standardized products with consistent handling, and products moving in full truckloads or pallets. Low-velocity or variable-demand items are less suitable."
    },
    {
      question: "How does inventory management software support cross-dock operations?",
      answer: "Inventory management software supports cross-dock operations by: tracking inbound shipments in real-time, matching inbound to outbound orders automatically, providing visibility into product flow, managing consolidation and sorting, tracking loading operations, and maintaining complete audit trails. StockFlow provides real-time tracking essential for cross-dock operations."
    },
    {
      question: "What features should cross-dock warehouse software have?",
      answer: "Essential features include: real-time shipment tracking, inbound/outbound matching, consolidation management, dock door scheduling, carrier integration, barcode scanning for fast processing, visibility dashboards, and reporting. The system must handle high transaction volumes and provide instant updates as products flow through the facility."
    },
    {
      question: "How much does cross-dock warehouse management software cost?",
      answer: `Cross-dock warehouse software pricing varies. Basic systems start at ${formatPrice(200)}/month. Enterprise solutions can cost ${formatPrice(1000)}-${formatPrice(5000)}/month. StockFlow offers cross-dock inventory management starting with a free plan for up to 100 products, with scalable pricing (€0.004 per product/month), making it affordable for small to mid-sized operations.`
    },
    {
      question: "Can cross-dock operations work with multiple suppliers and customers?",
      answer: "Yes, cross-dock operations commonly handle multiple suppliers and customers. The system consolidates products from multiple suppliers into outbound shipments for multiple customers. This requires sophisticated matching algorithms, consolidation planning, and real-time visibility. StockFlow supports multi-supplier and multi-customer cross-dock operations."
    },
    {
      question: "What is the difference between cross-docking and traditional warehousing?",
      answer: "Cross-docking minimizes or eliminates storage time - products flow through the facility in hours. Traditional warehousing stores products for days, weeks, or months. Cross-docking requires faster processing, better coordination, and real-time visibility. Traditional warehousing focuses on storage optimization and longer-term inventory management."
    },
    {
      question: "How does cross-dock warehouse management reduce costs?",
      answer: "Cross-dock warehouse management reduces costs by: eliminating storage costs (no long-term storage), reducing handling (fewer touches), minimizing inventory carrying costs (faster turnover), reducing labor costs (streamlined operations), and improving space utilization. This can reduce distribution costs by 20-30% compared to traditional warehousing."
    },
    {
      question: "Can cross-dock operations handle quality inspections?",
      answer: "Cross-dock operations can include quick quality checks, but extensive inspections slow down the flow. Most cross-dock facilities perform minimal quality checks (visual inspection, count verification) and rely on supplier quality. Products requiring detailed inspection are less suitable for cross-docking."
    },
    {
      question: "How does inventory management software help with cross-dock scheduling?",
      answer: "Inventory management software helps with cross-dock scheduling by: tracking inbound shipment arrival times, scheduling dock door assignments, coordinating outbound shipments, managing consolidation windows, and providing real-time visibility into facility capacity. This ensures smooth flow and prevents bottlenecks."
    },
    {
      question: "What is the ROI of cross-dock warehouse operations?",
      answer: "The ROI is typically very high. Businesses see:  in distribution costs, faster order fulfillment, improved customer satisfaction, reduced inventory carrying costs, and better cash flow. Most businesses see ROI within 6-12 months through cost savings and efficiency gains."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Inventory Tracking",
      description: "Monitor your stock levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Advanced Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Reorder Points",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Collaboration",
      description: "Work together with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with daily backups, SSL encryption, and GDPR compliance."
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 35%",
    "Eliminate stockouts and overstock situations",
    "Improve cash flow with better inventory turnover",
    "Save 15+ hours per week on manual processes",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Integrate with existing systems"
  ];

  const comparisonData = [
    {
      feature: "Real-time tracking",
      stockflow: "✓",
      exact: "Limited",
      visma: "Premium only (€450+)"
    },
    {
      feature: "Mobile access",
      stockflow: "✓ Free",
      exact: "Extra cost (€50+/month)",
      visma: "Limited features"
    },
    {
      feature: "Barcode scanning",
      stockflow: "✓ Included",
      exact: "Premium only (€255+/month)",
      visma: "Extra module (€200+/month)"
    },
    {
      feature: "Multi-location",
      stockflow: "✓ All plans",
      exact: "Enterprise only (€500+/month)",
      visma: "Limited (€450+/month)"
    },
    {
      feature: "Free plan",
      stockflow: "✓ (100 products)",
      exact: "✗ No free plan",
      visma: "✗ No free plan"
    },
    {
      feature: "Customer support",
      stockflow: "24/7 included",
      exact: "Business hours only",
      visma: "Email only"
    },
    {
      feature: "Starting price",
      stockflow: "€0/month",
      exact: "€255/month",
      visma: "€450/month"
    },
    {
      feature: "Setup & onboarding",
      stockflow: "Free + guided",
      exact: "Extra cost (€500+)",
      visma: "Extra cost (€1000+)"
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "CEO, TechStart Solutions",
      content: "StockFlow is hands down the Cross-dock Warehouse we've used. It's intuitive, powerful, and has transformed our operations completely.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager, Retail Plus",
      content: "After trying several inventory management solutions, StockFlow proved to be the best. The real-time tracking and analytics are unmatched.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Warehouse Manager, Global Supply",
      content: "StockFlow's features and ease of use make it the Cross-dock Warehouse for our business. Highly recommended!",
      rating: 5
    }
  ];

  const awards = [
    {
      title: "Best Inventory Software 2024",
      organization: "Business Software Review",
      icon: "ðŸ†"
    },
    {
      title: "Top Rated by Users",
      organization: "Software Review Platform",
      icon: "⭐"
    },
    {
      title: "Best Value for Money",
      organization: "Tech Business Awards",
      icon: "ðŸ’°"
    },
    {
      title: "Easiest to Use",
      organization: "User Experience Awards",
      icon: "ðŸŽ¯"
    }
  ];


  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'awards', title: 'Why StockFlow is the Best', level: 1 },
    { id: 'quick-wins', title: 'Why Businesses Choose StockFlow', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'comparison', title: 'StockFlow vs Competitors', level: 1 },
    { id: 'testimonials', title: 'What Our Customers Say', level: 1 },
    { id: 'pricing', title: 'Choose Your Plan', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Cross-dock Warehouse"
      description="Complete cross-dock warehouse management 2026. Streamline receiving and shipping, reduce storage time 50%, optimize logistics. Real-time tracking, barcode scanning. Free plan available."
      heroTitle="Cross-dock Warehouse"
      updatedDate="2026-11-06"
      faqData={faqData}
    >
      <SEO
        title="Cross Dock Warehouse 2026 - Reduce Storage 50% | StockFlow"
        description="Complete cross-dock warehouse management 2026. Streamline receiving and shipping, reduce storage time 50%, optimize logistics. Real-time tracking, barcode scanning."
        keywords="Cross-dock Warehouse, popular inventory management software, inventory management software, inventory software management, software for inventory management, softwares for inventory management, inventory management software best, top inventory management software, best inventory software, best stock management software, best inventory system, best inventory tracking software, best inventory management system, inventory tracking programs, best inventory software 2026, top rated inventory software, best inventory management solution, best inventory software for small business, best inventory software for ecommerce, Cross-dock Warehouse comparison, best inventory software reviews, Cross-dock Warehouse features, best inventory software pricing, best inventory software demo, best inventory software trial, inventory management software provider, inventory management software online, stockflow"
        url="https://www.stockflowsystems.com/best-inventory-management-software"
      />



      {/* Overview Section */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">


            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                A cross-dock warehouse is a logistics center where goods are transferred directly from incoming trucks to outgoing trucks, with minimal or no storage. The goal is to accelerate turnaround time and reduce storage costs by moving products directly from receiving to shipping. These facilities are often designed with an incoming and outgoing dock side and have little to no storage space.
              </p>

              <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Features of a Cross-Dock Warehouse</h1>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li><strong>Direct transfer:</strong> Products are unloaded and loaded onto another vehicle almost immediately.</li>
                <li><strong>Minimal storage:</strong> Goods remain in the warehouse for only hours, not days or longer.</li>
                <li><strong>Optimized infrastructure:</strong> The design is focused on speed, with separate docking areas for incoming and outgoing shipments.</li>
                <li><strong>Efficient sorting:</strong> Goods are sorted based on their final destination rather than product type.</li>
                <li><strong>"Just-in-time" approach:</strong> It is a form of "just-in-time" warehouse management, which streamlines the logistics chain.</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Benefits of Cross-Dock Warehousing</h2>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                <li><strong>Lower costs:</strong> Reduced storage and handling costs.</li>
                <li><strong>Faster delivery:</strong> Shorter lead times lead to faster deliveries and higher customer satisfaction.</li>
                <li><strong>Less inventory:</strong> The need for large inventories is reduced, which lowers the risk of stock losses.</li>
                <li><strong>Increased productivity:</strong> The focus on speed and efficiency leads to higher throughput and lower labor costs.</li>
                <li><strong>Improved customer service:</strong> Faster delivery times and more reliable service can enhance customer satisfaction.</li>
                <li><strong>Scalability:</strong> Cross-dock facilities can handle large volumes of goods with minimal investment in storage space.</li>
              </ul>
            </div>
    
    
    
    
        </div>
      </section>



      {/* Quick Wins Section */}
      <section id="quick-wins" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Businesses Choose StockFlow Over Competitors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real results from real businesses using the Cross-dock Warehouse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-lg font-semibold mb-2">Cost Reduction</div>
              <div className="text-sm text-gray-600">Average inventory cost savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">15h</div>
              <div className="text-lg font-semibold mb-2">Hours Saved</div>
              <div className="text-sm text-gray-600">Per week on manual tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Accuracy</div>
              <div className="text-sm text-gray-600">Inventory tracking precision</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm text-gray-600">Expert help when you need it</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join 500+ Companies Who Signed Up This Month</h3>
            <p className="text-lg text-gray-600 mb-6">See why businesses are switching to StockFlow as their inventory management solution</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">No setup fees</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Instant access</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Free migration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why StockFlow is the <span className="text-blue-600">Best Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive features that make StockFlow the top choice for inventory management.
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



      {/* Comparison Section */}
      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other inventory management software solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Exact</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Visma Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.exact}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.visma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using the Cross-dock Warehouse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
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
          "@type": "WebPage",
          "@id": "https://www.stockflowsystems.com/best-inventory-management-software",
          "name": "Cross-dock Warehouse",
          "description": "! Join 10,000+ businesses using award-winning inventory software. Real-time tracking, automated alerts, barcode scanning. Join for Free now - no credit card!",
          "url": "https://www.stockflowsystems.com/best-inventory-management-software",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflowsystems.com"
          },
          "datePublished": "2026-11-06",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflowsystems.com/Inventory-Management.png"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.stockflowsystems.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Cross-dock Warehouse",
                "item": "https://www.stockflowsystems.com/best-inventory-management-software"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Cross-dock Warehouse",
          "description": "The Cross-dock Warehouse depends on your specific needs, with top options including NetSuite for comprehensive ERP, Cin7 for multichannel sales, inFlow Inventory for wholesale businesses, and Zoho Inventory for small businesses with a free plan available. Other popular and highly-rated choices include Odoo, Katana (especially for manufacturing), Sortly (for its intuitive interface), and Unleashed (for scaling businesses).",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser",
          "softwareVersion": "2.0",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 products",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "0.004",
              "priceCurrency": "EUR",
              "description": "Business plan - Pay-as-you-grow pricing, €0.004 per product/month (products 101+)",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Enterprise plan - Custom pricing for high-volume businesses (10,000+ products)",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1000",
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Organization",
            "name": "StockFlow",
            "url": "https://www.stockflowsystems.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "StockFlow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.stockflowsystems.com/logo.png"
            }
          },
          "image": "https://www.stockflowsystems.com/Inventory-Management.png",
          "screenshot": "https://www.stockflowsystems.com/Inventory-Management.png",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflowsystems.com/best-inventory-management-software"
          },
          "award": [
            "Best Inventory Software 2024",
            "Top Rated by Users",
            "Best Value for Money",
            "Easiest to Use"
          ],
          "featureList": [
            "Real-time inventory tracking",
            "Advanced barcode scanning",
            "Automated reorder points",
            "Comprehensive analytics",
            "Multi-user collaboration",
            "Enterprise security"
          ],
          "downloadUrl": "https://www.stockflowsystems.com/auth",
          "softwareHelp": {
            "@type": "CreativeWork",
            "url": "https://www.stockflowsystems.com/contact"
          }
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow"
          },
          "author": {
            "@type": "Person",
            "name": testimonial.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": testimonial.content
        }))
      ]} />

    </SeoPageLayout>
  );
}


