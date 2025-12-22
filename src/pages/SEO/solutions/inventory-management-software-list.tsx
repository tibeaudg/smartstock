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
    }
  ];

  return (
    <SeoPageLayout
      title="Inventory Management Software List | Best Inventory Software 2025"
      heroTitle="Inventory Management Software List"
      description="Complete inventory management software list with reviews, features, and pricing. Compare the best inventory management software options for your business. Free plan available."
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Software List 2025 - Compare & Save 50-90% | StockFlow"
        description="Compare the best inventory management software list. Reviews, features, pricing, and recommendations for small businesses, e-commerce, and enterprise. Free plan for up to 100 products. Join for Free."
        keywords="inventory management software list, best inventory management software, inventory software list, inventory management software comparison, top inventory software, inventory management software reviews, inventory software recommendations, best inventory software 2025, inventory software comparison, stockflow, stock flow"
        url="https://www.stockflowsystems.com/solutions/inventory-management-software-list"
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Inventory Management Software List
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Compare the best <strong>inventory management software</strong> options for your business. This comprehensive <strong>inventory management software list</strong> includes reviews, features, pricing, and recommendations to help you choose the right solution. Whether you're a small business, e-commerce store, or growing enterprise, find the perfect inventory management software for your needs. Explore <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> solutions or see our <Link to="/best-of/best-inventory-management-software" className="text-blue-600 hover:underline font-semibold">best inventory management software</Link> guide.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">How to Use This Inventory Management Software List</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Compare features, pricing, and ratings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Identify software that matches your business needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Take advantage of free trials to test before buying</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Consider scalability for future growth</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Software List Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Top Inventory Management Software Options
          </h2>
          
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

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-white">
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

