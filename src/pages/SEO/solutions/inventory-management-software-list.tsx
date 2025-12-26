import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';
import VideoModal from '@/components/VideoModal';
import {
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Users,
  BarChart3,
  Camera,
  Database,
  Globe
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function InventoryManagementSoftwareList() {
  usePageRefresh();
  const { formatPrice } = useCurrency();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const faqData = [
    {
      question: "What is the best inventory management software list?",
      answer: "The best inventory management software list includes solutions that offer real-time tracking, barcode scanning, multi-location support, reporting, and integration capabilities. Top options include StockFlow (best for SMBs), Zoho Inventory, QuickBooks Commerce, TradeGecko, and Cin7. The best choice depends on your business size, industry, budget, and specific needs. StockFlow consistently ranks highly for small to medium businesses due to its affordability, ease of use, and comprehensive features."
    },
    {
      question: "What should I look for in inventory management software list?",
      answer: "When evaluating an inventory management software list, look for: real-time inventory tracking, barcode scanning capabilities, multi-location support, reporting and analytics, integration with accounting and e-commerce platforms, mobile access, user role management, automated reorder points, cloud-based access, and good customer support. Also consider pricing, ease of use, scalability, and industry-specific features."
    },
    {
      question: "Is there a free inventory management software list?",
      answer: `Yes, there are free inventory management software options. StockFlow offers a free plan for up to 100 products, Zoho Inventory has a free plan for small businesses, and there are other free options available. When reviewing a free inventory management software list, check limitations on products, users, or features, and consider upgrade paths as your business grows.`
    },
    {
      question: "What are the top inventory management software for small business?",
      answer: "Top inventory management software for small businesses include: StockFlow (free plan available, affordable pricing), Zoho Inventory (good for e-commerce), QuickBooks Commerce (if using QuickBooks), Square for Retail (for retail businesses), and TradeGecko (for growing businesses). Small businesses should prioritize ease of use, affordability, and essential features over advanced enterprise capabilities."
    },
    {
      question: "How do I choose from an inventory management software list?",
      answer: "To choose from an inventory management software list: identify your specific needs and requirements, determine your budget and pricing preferences, check for required integrations (accounting, e-commerce, etc.), read reviews and compare features, take advantage of free trials, consider scalability for future growth, evaluate customer support quality, and test ease of use with your team. Most providers offer free trials to test before committing."
    },
    {
      question: "What features are essential in inventory management software list?",
      answer: "Essential features in any inventory management software list should include: real-time inventory tracking, barcode scanning, multi-location support, automated reorder points, reporting and analytics, integration capabilities, mobile access, user role management, and good customer support. Additional features like demand forecasting, batch tracking, and advanced reporting may be important depending on your industry."
    },
    {
      question: "Are there industry-specific inventory management software lists?",
      answer: "Yes, there are industry-specific inventory management software options. For retail: Square for Retail, Lightspeed. For manufacturing: Katana, MRPeasy. For e-commerce: TradeGecko, Zoho Inventory. For healthcare: specialized medical inventory systems. For food service: specialized restaurant inventory systems. However, many general solutions like StockFlow work well across multiple industries with customizable features."
    },
    {
      question: "What is the average cost of inventory management software from a software list?",
      answer: `Costs vary widely. Free plans are available (StockFlow offers up to 30 products free). Small business plans typically cost ${formatPrice(29)}-${formatPrice(100)}/month. Mid-market solutions cost ${formatPrice(100)}-${formatPrice(500)}/month. Enterprise solutions can cost ${formatPrice(500)}+/month. StockFlow offers the best value with a free plan and affordable pay-as-you-grow pricing starting at ${formatPrice(0.004)}/product/month.`
    },
    {
      question: "How do I compare inventory management software from a list?",
      answer: "Compare software by: creating a checklist of required features, testing free trials, comparing pricing and value, evaluating ease of use, checking integration capabilities, reading customer reviews, assessing customer support quality, and considering scalability. Most providers offer free trials - take advantage to test before committing."
    },
    {
      question: "What are the most important features in an inventory management software list?",
      answer: "Most important features are: real-time tracking (essential for accuracy), barcode scanning (improves speed and accuracy), automated reorder points (prevents stockouts), multi-location support (for growing businesses), mobile access (for on-the-go management), integration capabilities (connects with other systems), and good reporting (for decision-making). StockFlow includes all these features."
    },
    {
      question: "Can I switch between inventory management software from a list?",
      answer: "Yes, but switching can be time-consuming. Most inventory management software supports data export/import, making migration possible. However, it's better to choose the right solution initially. StockFlow offers a free plan so you can test thoroughly before committing, reducing the need to switch later."
    },
    {
      question: "What should small businesses look for in an inventory management software list?",
      answer: "Small businesses should prioritize: free or affordable pricing, ease of use (no technical knowledge required), essential features (real-time tracking, barcode scanning, alerts), good customer support, scalability to grow with the business, and mobile access. StockFlow is specifically designed for small businesses with these priorities in mind."
    },
    {
      question: "How do enterprise solutions differ from SMB solutions in a software list?",
      answer: "Enterprise solutions typically offer: advanced reporting and analytics, custom integrations, dedicated support, advanced user management, higher transaction volumes, and industry-specific features. SMB solutions like StockFlow focus on essential features, ease of use, and affordability. Many SMB solutions scale to enterprise levels as businesses grow."
    }
  ];

  const softwareList = [
    {
      name: "StockFlow",
      category: "Best Overall for SMBs",
      price: `Free - ${formatPrice(0.004)}/product/month`,
      rating: 5,
      features: [
        "Real-time tracking",
        "Barcode scanning",
        "Multi-location support",
        "Free plan available",
        "24/7 support",
        "Cloud-based"
      ],
      pros: [
        "Free plan for up to 100 products",
        "Affordable pay-as-you-grow pricing",
        "Excellent customer support",
        "Easy to use",
        "Comprehensive features"
      ],
      cons: [
        "Newer platform (less brand recognition)",
        "Limited enterprise features"
      ],
      bestFor: "Small to medium businesses looking for affordable, comprehensive inventory management"
    },
    {
      name: "inFlow Inventory",
      category: "Best for Small to Mid-Sized Businesses",
      price: "€71-199/month",
      rating: 4.5,
      features: [
        "User-friendly interface",
        "Barcode scanning",
        "Inventory tracking",
        "Reporting",
        "Multi-location support"
      ],
      pros: [
        "Easy to use",
        "Good for small businesses",
        "Strong barcode scanning"
      ],
      cons: [
        "Limited advanced features",
        "Higher pricing for small businesses"
      ],
      bestFor: "Small to mid-sized businesses needing user-friendly inventory tracking"
    },
    {
      name: "Katana",
      category: "Best for Manufacturing",
      price: "€99-299/month",
      rating: 4.5,
      features: [
        "Manufacturing focus",
        "Production management",
        "Cloud-based",
        "E-commerce integration",
        "Real-time tracking"
      ],
      pros: [
        "Excellent for manufacturing",
        "Strong production management",
        "Good e-commerce integration"
      ],
      cons: [
        "Higher pricing",
        "Manufacturing-focused (less versatile)"
      ],
      bestFor: "Manufacturing and e-commerce businesses with production needs"
    },
    {
      name: "Fishbowl Inventory",
      category: "Best for Warehouse Management",
      price: "€4,395-8,790/year",
      rating: 4.5,
      features: [
        "Warehouse management",
        "QuickBooks integration",
        "Advanced reporting",
        "Multi-location",
        "Barcode scanning"
      ],
      pros: [
        "Strong warehouse management",
        "Excellent QuickBooks integration",
        "Comprehensive features"
      ],
      cons: [
        "Higher cost",
        "Requires QuickBooks",
        "Complex setup"
      ],
      bestFor: "Warehouse operations needing strong QuickBooks integration"
    },
    {
      name: "Zoho Inventory",
      category: "Best for E-commerce",
      price: "€29-249/month",
      rating: 4.5,
      features: [
        "Multi-channel integration",
        "Order management",
        "Warehouse management",
        "Reporting",
        "Free plan available"
      ],
      pros: [
        "Strong e-commerce integrations",
        "Good reporting capabilities",
        "Free plan for small businesses"
      ],
      cons: [
        "Can be complex for beginners",
        "Higher pricing for advanced features"
      ],
      bestFor: "E-commerce businesses needing multi-channel integration"
    },
    {
      name: "Ordoro",
      category: "Best for E-commerce Logistics",
      price: "€49-199/month",
      rating: 4,
      features: [
        "E-commerce focus",
        "Shipping management",
        "Logistics control",
        "Inventory control",
        "Multi-channel"
      ],
      pros: [
        "Excellent for e-commerce",
        "Strong shipping features",
        "Good logistics management"
      ],
      cons: [
        "E-commerce focused",
        "Limited for other industries"
      ],
      bestFor: "E-commerce businesses needing shipping and logistics control"
    },
    {
      name: "Veeqo",
      category: "Best for E-commerce Retailers",
      price: "€99-299/month",
      rating: 4,
      features: [
        "E-commerce shipping",
        "Inventory for retailers",
        "Multi-channel",
        "Order management",
        "Reporting"
      ],
      pros: [
        "Strong e-commerce features",
        "Good for retailers",
        "Multi-channel support"
      ],
      cons: [
        "E-commerce focused",
        "Higher pricing"
      ],
      bestFor: "E-commerce retailers managing multiple sales channels"
    },
    {
      name: "Sortly",
      category: "Best for Visual Asset Tracking",
      price: "€0-99/month",
      rating: 4,
      features: [
        "Visual inventory management",
        "Asset tracking",
        "Mobile app",
        "Photo support",
        "Simple interface"
      ],
      pros: [
        "Visual approach",
        "Easy to use",
        "Good for asset tracking"
      ],
      cons: [
        "Limited advanced features",
        "Best for simple tracking"
      ],
      bestFor: "Businesses needing visual inventory and asset tracking"
    },
    {
      name: "Odoo Inventory",
      category: "Best for Warehouse Efficiency",
      price: "€0-24.90/user/month",
      rating: 4,
      features: [
        "Flexible system",
        "Warehouse optimization",
        "Open source option",
        "Modular approach",
        "Multi-location"
      ],
      pros: [
        "Flexible and customizable",
        "Open source available",
        "Good warehouse features"
      ],
      cons: [
        "Can be complex",
        "Requires technical knowledge"
      ],
      bestFor: "Businesses needing flexible warehouse optimization"
    },
    {
      name: "QuickBooks Online",
      category: "Best for Accounting Integration",
      price: "€25-150/month",
      rating: 4.5,
      features: [
        "Built-in inventory tracking",
        "Accounting software",
        "Financial reporting",
        "Integration",
        "Cloud-based"
      ],
      pros: [
        "Integrated accounting",
        "Widely used",
        "Good financial features"
      ],
      cons: [
        "Limited inventory features",
        "Accounting-focused"
      ],
      bestFor: "Businesses needing integrated accounting and inventory"
    },
    {
      name: "SAP Inventory Management",
      category: "Best for Large Enterprise",
      price: "Custom pricing",
      rating: 4.5,
      features: [
        "Enterprise-level",
        "Real-time tracking",
        "Advanced analytics",
        "Large-scale operations",
        "Custom integrations"
      ],
      pros: [
        "Enterprise features",
        "Real-time analytics",
        "Scalable"
      ],
      cons: [
        "Very expensive",
        "Complex implementation",
        "Overkill for small businesses"
      ],
      bestFor: "Large enterprises needing high-level real-time tracking and analytics"
    },
    {
      name: "BlueYonder",
      category: "Best for Supply Chain",
      price: "Custom pricing",
      rating: 4.5,
      features: [
        "Supply chain focus",
        "Advanced analytics",
        "Demand planning",
        "Enterprise features",
        "AI-powered"
      ],
      pros: [
        "Advanced supply chain",
        "AI-powered insights",
        "Enterprise-grade"
      ],
      cons: [
        "Very expensive",
        "Enterprise only",
        "Complex setup"
      ],
      bestFor: "Large enterprises with complex supply chain needs"
    },
    {
      name: "Brightpearl",
      category: "Best for Retail Operations",
      price: "€99-399/month",
      rating: 4,
      features: [
        "Retail operations",
        "Multi-channel",
        "Order management",
        "Inventory control",
        "Reporting"
      ],
      pros: [
        "Strong retail features",
        "Multi-channel support",
        "Good operations management"
      ],
      cons: [
        "Retail focused",
        "Higher pricing"
      ],
      bestFor: "Retail businesses managing complex operations"
    },
    {
      name: "ChannelAdvisor",
      category: "Best for Marketplace Management",
      price: "Custom pricing",
      rating: 4,
      features: [
        "Marketplace management",
        "Multi-channel",
        "E-commerce integration",
        "Inventory sync",
        "Analytics"
      ],
      pros: [
        "Excellent marketplace features",
        "Multi-channel sync",
        "Strong analytics"
      ],
      cons: [
        "Expensive",
        "Marketplace focused"
      ],
      bestFor: "Businesses selling across multiple marketplaces"
    },
    {
      name: "Cin7",
      category: "Best for Omnichannel Retail",
      price: "€325-1,200/month",
      rating: 4.5,
      features: [
        "Omnichannel retail",
        "Multi-channel integration",
        "Order management",
        "Inventory sync",
        "Advanced reporting"
      ],
      pros: [
        "Strong omnichannel features",
        "Comprehensive integration",
        "Advanced capabilities"
      ],
      cons: [
        "Higher pricing",
        "Complex for small businesses"
      ],
      bestFor: "Omnichannel retail businesses with complex needs"
    },
    {
      name: "Finale Inventory",
      category: "Best for Multi-Location",
      price: "€99-299/month",
      rating: 4,
      features: [
        "Multi-location support",
        "Barcode scanning",
        "Order management",
        "Reporting",
        "Cloud-based"
      ],
      pros: [
        "Excellent multi-location",
        "Good barcode features",
        "Cloud-based"
      ],
      cons: [
        "Higher pricing",
        "Limited free options"
      ],
      bestFor: "Businesses with multiple locations needing centralized control"
    },
    {
      name: "QuickBooks Commerce",
      category: "Best for QuickBooks Users",
      price: "€50-200/month",
      rating: 4.5,
      features: [
        "QuickBooks integration",
        "Multi-location",
        "B2B portal",
        "Reporting"
      ],
      pros: [
        "Seamless QuickBooks integration",
        "Good for existing QuickBooks users",
        "Strong accounting features"
      ],
      cons: [
        "Requires QuickBooks subscription",
        "Higher cost",
        "Less flexible for non-QuickBooks users"
      ],
      bestFor: "Businesses already using QuickBooks for accounting"
    },
    {
      name: "TradeGecko",
      category: "Best for Growing Businesses",
      price: "€79-399/month",
      rating: 4,
      features: [
        "Multi-channel",
        "Order management",
        "Warehouse management",
        "Advanced reporting"
      ],
      pros: [
        "Strong multi-channel capabilities",
        "Good for scaling businesses",
        "Advanced features"
      ],
      cons: [
        "Higher pricing",
        "Steeper learning curve",
        "May be overkill for small businesses"
      ],
      bestFor: "Growing businesses with complex multi-channel operations"
    },
    {
      name: "Xero",
      category: "Best for Accounting Integration",
      price: "€13-70/month",
      rating: 4,
      features: [
        "Accounting integration",
        "Inventory tracking",
        "Financial reporting",
        "Cloud-based",
        "Multi-currency"
      ],
      pros: [
        "Good accounting features",
        "Affordable pricing",
        "Cloud-based"
      ],
      cons: [
        "Limited inventory features",
        "Accounting-focused"
      ],
      bestFor: "Small businesses using Xero for accounting"
    },
    {
      name: "Monday.com",
      category: "Best for Project-Based Inventory",
      price: "€8-16/user/month",
      rating: 4,
      features: [
        "Project management",
        "Inventory tracking",
        "Workflow automation",
        "Collaboration",
        "Customizable"
      ],
      pros: [
        "Project management integration",
        "Highly customizable",
        "Good collaboration"
      ],
      cons: [
        "Not inventory-focused",
        "Per-user pricing"
      ],
      bestFor: "Project-based businesses needing inventory tracking"
    },
    {
      name: "MRPeasy",
      category: "Best for Manufacturing SMBs",
      price: "€49-149/month",
      rating: 4,
      features: [
        "Manufacturing focus",
        "MRP capabilities",
        "Production planning",
        "Inventory control",
        "Cloud-based"
      ],
      pros: [
        "Good for manufacturing",
        "Affordable MRP",
        "Cloud-based"
      ],
      cons: [
        "Manufacturing focused",
        "Limited for other industries"
      ],
      bestFor: "Small to medium manufacturing businesses"
    },
    {
      name: "Lightspeed",
      category: "Best for Retail Stores",
      price: "€69-229/month",
      rating: 4.5,
      features: [
        "Retail POS integration",
        "Inventory management",
        "Multi-location",
        "Reporting",
        "E-commerce"
      ],
      pros: [
        "Strong retail features",
        "POS integration",
        "Good for retail stores"
      ],
      cons: [
        "Retail focused",
        "Higher pricing"
      ],
      bestFor: "Retail stores needing POS and inventory integration"
    },
    {
      name: "Square for Retail",
      category: "Best for Small Retail",
      price: "€0-60/month",
      rating: 4,
      features: [
        "Retail POS",
        "Inventory management",
        "Free plan available",
        "Mobile-friendly",
        "Reporting"
      ],
      pros: [
        "Free plan available",
        "Easy to use",
        "Good for small retail"
      ],
      cons: [
        "Limited advanced features",
        "Retail focused"
      ],
      bestFor: "Small retail businesses needing POS and inventory"
    },
    {
      name: "Oracle NetSuite",
      category: "Best for Enterprise ERP",
      price: "Custom pricing",
      rating: 4.5,
      features: [
        "Enterprise ERP",
        "Inventory management",
        "Financial management",
        "Advanced analytics",
        "Customizable"
      ],
      pros: [
        "Comprehensive ERP",
        "Enterprise features",
        "Highly customizable"
      ],
      cons: [
        "Very expensive",
        "Complex implementation",
        "Enterprise only"
      ],
      bestFor: "Large enterprises needing comprehensive ERP with inventory"
    },
    {
      name: "Acumatica",
      category: "Best for Cloud ERP",
      price: "Custom pricing",
      rating: 4,
      features: [
        "Cloud ERP",
        "Inventory management",
        "Financial management",
        "Multi-location",
        "Advanced reporting"
      ],
      pros: [
        "Cloud-based ERP",
        "Good inventory features",
        "Scalable"
      ],
      cons: [
        "Expensive",
        "Complex setup",
        "ERP-focused"
      ],
      bestFor: "Businesses needing cloud ERP with inventory management"
    },
    {
      name: "DEAR Systems",
      category: "Best for Inventory & Accounting",
      price: "€99-399/month",
      rating: 4,
      features: [
        "Inventory management",
        "Accounting integration",
        "Multi-location",
        "Barcode scanning",
        "Reporting"
      ],
      pros: [
        "Good accounting integration",
        "Comprehensive features",
        "Multi-location support"
      ],
      cons: [
        "Higher pricing",
        "Can be complex"
      ],
      bestFor: "Businesses needing integrated inventory and accounting"
    }
  ];

  return (
    <SeoPageLayout
      title="Complete list of inventory management software systems"
      heroTitle="Complete list of inventory management software systems"
      description="Retail inventory management software can help drive more sales while reducing shrinkage and wastage. Here are 26 IMS options to consider."
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Complete list of inventory management software systems"
        description="Retail inventory management software can help drive more sales while reducing shrinkage and wastage. Here are 26 IMS options to consider."
        keywords="inventory management software list, best inventory management software, inventory software list, inventory management software comparison, top inventory software, inventory management software reviews, inventory software recommendations, best inventory software 2025, inventory software comparison, inventory management software systems, compare inventory management software, inventory management provider, stockflow, stock flow"
        url="https://www.stockflowsystems.com/solutions/inventory-management-software-list"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Retail <strong>inventory management software</strong> can help drive more sales while reducing shrinkage and wastage. This comprehensive <strong>inventory management software list</strong> includes 26 inventory management software systems to consider for your business. Whether you're a small business, e-commerce store, retail operation, or growing enterprise, find the perfect <strong>inventory management system</strong> for your needs.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">How to Use This Inventory Management Software List</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Compare features, pricing, and ratings across 26 inventory management software systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Identify software that matches your business needs and industry requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Take advantage of free trials to test before buying</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Consider scalability for future growth and multi-location expansion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Key Features to Consider in Inventory Management Software
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
              </div>
              <p className="text-gray-700 text-sm">Updates stock levels instantly across channels, ensuring accurate inventory counts and preventing overselling.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Barcode Scanning</h3>
              </div>
              <p className="text-gray-700 text-sm">Accelerates receiving and picking processes, reducing errors and improving warehouse efficiency.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Integration</h3>
              </div>
              <p className="text-gray-700 text-sm">Connects with e-commerce platforms (Shopify, WooCommerce) and accounting software for seamless operations.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Reporting & Analytics</h3>
              </div>
              <p className="text-gray-700 text-sm">Provides insights for demand planning and reducing excess inventory through data-driven decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Software List Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Complete Inventory Management Software List
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Below is a comprehensive list of 26 inventory management software systems, including cloud-based solutions, enterprise platforms, and free options. Each system offers unique features for different business sizes and industries.
          </p>
          
          <div className="space-y-8">
            {softwareList.map((software, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{software.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {software.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < software.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{software.rating}/5</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-4">{software.price}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {software.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Best For</h4>
                    <p className="text-sm text-gray-700 mb-4">{software.bestFor}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-700 text-sm mb-2">Pros</h5>
                        <ul className="space-y-1">
                          {software.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-gray-700">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700 text-sm mb-2">Cons</h5>
                        <ul className="space-y-1">
                          {software.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-gray-700">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choosing the Right Software Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Choosing the Right Inventory Management Software
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Small Businesses & Retail
              </h3>
              <p className="text-gray-700 mb-4">For small businesses and retail operations, prioritize ease of use, affordability, and essential features.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>StockFlow</strong> - Free plan available, affordable pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Sortly</strong> - Visual inventory management solution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Zoho Inventory</strong> - Versatile cloud-based platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Square for Retail</strong> - Free plan for small retail</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Manufacturing
              </h3>
              <p className="text-gray-700 mb-4">Manufacturing businesses need production management, BOM tracking, and material planning capabilities.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Katana</strong> - Cloud-based production management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Fishbowl Inventory</strong> - Top choice for warehouse management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>MRPeasy</strong> - Manufacturing-focused MRP system</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-600" />
                E-commerce & Logistics
              </h3>
              <p className="text-gray-700 mb-4">E-commerce businesses require multi-channel integration, shipping management, and order fulfillment.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Ordoro</strong> - Shipping, logistics, and inventory control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Veeqo</strong> - E-commerce shipping and inventory</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Cin7</strong> - Omnichannel retail management</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-amber-600" />
                Large Enterprise
              </h3>
              <p className="text-gray-700 mb-4">Enterprise solutions offer advanced analytics, custom integrations, and scalable infrastructure.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>SAP Inventory Management</strong> - High-level real-time tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Oracle NetSuite</strong> - Comprehensive ERP solution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>BlueYonder</strong> - AI-powered supply chain management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Quick Comparison Guide
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-blue-600">StockFlow</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Zoho Inventory</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">QuickBooks Commerce</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">TradeGecko</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">Free Plan</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-red-600">✗</td>
                    <td className="py-3 px-4 text-center text-red-600">✗</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">Starting Price</td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-600">€0</td>
                    <td className="py-3 px-4 text-center">€29/month</td>
                    <td className="py-3 px-4 text-center">€50/month</td>
                    <td className="py-3 px-4 text-center">€79/month</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">Barcode Scanning</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">Multi-Location</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">E-commerce Integration</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                    <td className="py-3 px-4 text-center text-green-600">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">24/7 Support</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">✓</td>
                    <td className="py-3 px-4 text-center text-gray-500">Business hours</td>
                    <td className="py-3 px-4 text-center text-gray-500">Business hours</td>
                    <td className="py-3 px-4 text-center text-gray-500">Business hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* StockFlow CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try StockFlow Free
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start with our free plan and see why StockFlow tops many inventory management software lists. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg"
              >
                Join for Free
              </Link>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors text-lg"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
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
        }
      ]} />
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </SeoPageLayout>
  );
}

