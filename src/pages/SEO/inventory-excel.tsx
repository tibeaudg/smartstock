import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '../../components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  X,
  TrendingUp
} from 'lucide-react';

export default function InventoryExcel() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Can I use Excel for inventory management?",
      answer: "While Excel can be used for basic inventory tracking, it has significant limitations: manual data entry prone to errors, no real-time updates, limited automation, difficult collaboration, and scalability issues. Most growing businesses switch to dedicated inventory software for better accuracy and efficiency."
    },
    {
      question: "What are the main disadvantages of using Excel for inventory?",
      answer: "Excel inventory management disadvantages include: high error rates (up to 88% error rate in manual entry), no automatic updates when stock changes, time-consuming manual calculations, difficulty sharing data across teams, lack of barcode scanning, no automatic reorder alerts, and poor scalability beyond 100 products."
    },
    {
      question: "When should I switch from Excel to inventory management software?",
      answer: "Switch to inventory software when: you have more than 50 products, multiple team members need access, you need real-time updates, errors are costing you money, you want to automate reordering, or you're spending more than 5 hours per week on inventory tasks. Most businesses see ROI within the first month."
    },
    {
      question: "Can I import my Excel inventory data to inventory software?",
      answer: "Yes! StockFlow and most professional inventory management software allow easy import from Excel spreadsheets. Simply export your Excel data to CSV format and import directly. Your data transfers seamlessly, so you don't lose any historical information when making the switch."
    },
    {
      question: "How much does inventory software cost compared to Excel?",
      answer: "While Excel may seem free, hidden costs include: time wasted on manual tasks (often 10+ hours/week), errors leading to stockouts or overstock, and limited scalability. Inventory software like StockFlow starts free for up to 100 products, then costs €0.004 per product/month - typically less than the time savings alone."
    }
  ];

  const excelLimitations = [
    {
      limitation: "Manual Data Entry",
      impact: "High error rate (88% mistakes in manual entry)",
      solution: "Automated barcode scanning with 99.9% accuracy"
    },
    {
      limitation: "No Real-Time Updates",
      impact: "Outdated inventory data leads to stockouts",
      solution: "Cloud-based system with instant synchronization"
    },
    {
      limitation: "Limited Automation",
      impact: "Time-consuming manual calculations and reordering",
      solution: "Automated reorder points and inventory alerts"
    },
    {
      limitation: "Poor Collaboration",
      impact: "Multiple versions, conflicting data, access issues",
      solution: "Multi-user access with role-based permissions"
    },
    {
      limitation: "No Mobile Access",
      impact: "Can't check or update inventory on the go",
      solution: "Mobile app with barcode scanning capabilities"
    },
    {
      limitation: "Scalability Issues",
      impact: "Excel becomes slow and error-prone with growth",
      solution: "Software scales from 10 to 10,000+ products seamlessly"
    }
  ];

  const structuredData = [
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
      "@type": "Article",
      "headline": "Inventory Excel vs Software: Complete Comparison Guide",
      "description": "Compare Excel inventory management vs dedicated software. Discover why 90% of businesses switch to software for better accuracy, automation, and real-time updates.",
      "image": "https://www.stockflow.be/Inventory-Management.png",
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
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.stockflow.be/inventory-excel"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Inventory Excel vs Software",
          "item": "https://www.stockflow.be/inventory-excel"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Inventory Excel Management">
      <SEO
        title="Inventory Excel vs Software: Complete Comparison 2025 | StockFlow"
        description="Excel vs inventory software comparison. Discover why 90% of businesses switch: 99.9% accuracy, real-time updates, automation, and save 10+ hours weekly. Free trial available."
        keywords="inventory excel, excel stock management, excel vs software, inventory spreadsheet, excel inventory template, inventory management excel, excel inventory tracking, inventory software vs excel"
        url="https://www.stockflow.be/inventory-excel"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-excel' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-excel' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inventory Excel Management: <span className="text-blue-600">Excel vs Software: The Complete Comparison</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Compare Excel inventory management vs dedicated software. Discover why 90% of businesses switch to software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                  View Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ Businesses</span>
              </div>
            </div>
            <div>
              <img 
                src="/Inventory-Management.png" 
                alt="Professional inventory management software vs Excel spreadsheet comparison showing automated tracking and real-time updates"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Excel Limitations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Excel Inventory Management Limitations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While Excel works for small businesses, it has critical limitations that cost time and money as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {excelLimitations.map((item, index) => (
              <div key={index} className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <div className="flex items-start mb-3">
                  <X className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.limitation}</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Impact:</strong> {item.impact}
                    </p>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-700"><strong>Solution:</strong> {item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Excel vs Inventory Software: Side-by-Side Comparison
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Excel</th>
                  <th className="px-6 py-4 text-center font-semibold bg-blue-700">Inventory Software</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">Data Entry</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Manual entry</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Barcode scanning</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Real-Time Updates</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Manual updates</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Instant sync</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Automation</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Limited</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Full automation</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Multi-User Access</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Version conflicts</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Collaborative</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Mobile Access</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">Not available</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    <span className="text-sm text-gray-600 block mt-1">iOS & Android app</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Accuracy</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-red-600 font-semibold">~85%</span>
                    <span className="text-sm text-gray-600 block mt-1">High error rate</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <span className="text-sm text-green-600 font-semibold">99.9%</span>
                    <span className="text-sm text-gray-600 block mt-1">Barcode scanning</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Businesses Switch from Excel to Inventory Software
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Save 10+ Hours Weekly", description: "Automate inventory tasks that take hours in Excel. Real-time updates and automated calculations eliminate manual work." },
              { icon: TrendingUp, title: "Reduce Errors by 90%", description: "Barcode scanning and automated processes eliminate the 88% error rate common in Excel inventory management." },
              { icon: Zap, title: "Scale Without Limits", description: "Excel struggles beyond 100 products. Software scales seamlessly from 10 to 10,000+ products with the same efficiency." }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <benefit.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Making the Switch: Excel to Software Migration
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <p className="text-lg text-gray-700 mb-6">
              Switching from Excel to inventory software is easier than you think. <Link to="/inventory-management-software" className="text-blue-600 font-semibold hover:underline">StockFlow</Link> allows 
              you to import your existing Excel data in just minutes. Simply export your spreadsheet to CSV and upload - your inventory data transfers seamlessly.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-bold mb-2">Export Excel to CSV</h3>
                <p className="text-sm text-gray-600">Save your Excel file as CSV format</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-bold mb-2">Import to StockFlow</h3>
                <p className="text-sm text-gray-600">Upload CSV file in the import tool</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-bold mb-2">Start Managing</h3>
                <p className="text-sm text-gray-600">Your inventory is ready to use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Excel (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - Excel vs voorraadbeheer software vergelijking.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
            <Link to="/inventory-excel-vs-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Excel vs Software Comparison
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Detailed comparison of Excel and inventory management software.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Discover professional inventory management solutions.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Switch from Excel?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free with up to 100 products. Import your Excel data in minutes. No credit card required. Save 10+ hours weekly.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}