import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '../../components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { StructuredData } from '../../components/StructuredData';

export default function PurchaseOrderForm() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is a purchase order form?",
      answer: "A purchase order form is a document used to request goods or services from a supplier. It specifies quantities, prices, delivery dates, and terms. Purchase order forms help businesses track purchases, manage supplier relationships, and maintain accurate inventory records."
    },
    {
      question: "Do I need purchase order forms for my business?",
      answer: "Purchase order forms are essential for businesses that regularly purchase inventory or supplies. They provide documentation, help track purchases, manage budgets, and maintain relationships with suppliers. Even small businesses benefit from using purchase order forms for organization and record-keeping."
    },
    {
      question: "Can I create purchase order forms with inventory management software?",
      answer: "Yes, inventory management software like StockFlow can generate purchase order forms automatically. When inventory reaches reorder points, the system can create purchase orders with product details, quantities, and supplier information, streamlining the purchasing process."
    },
    {
      question: "What information should be included in a purchase order form?",
      answer: "A purchase order form should include: purchase order number, date, supplier information, product details (description, SKU, quantity, unit price), total amount, delivery address, terms and conditions, and authorized signatures. StockFlow automatically includes all necessary information when generating purchase orders."
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Auto-Generated Forms",
      description: "Automatically generate purchase order forms when inventory reaches reorder points."
    },
    {
      icon: Download,
      title: "Download & Print",
      description: "Download purchase order forms as PDFs or print them directly for supplier submission."
    },
    {
      icon: Printer,
      title: "Professional Format",
      description: "Professional purchase order forms with all necessary details and branding options."
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'features', title: 'Features', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Purchase Order Form"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Purchase Order Form 2025 | Free Purchase Order Template | StockFlow"
        description="Create professional purchase order forms with StockFlow inventory management software. Auto-generate purchase orders, download PDFs, and streamline purchasing. Free templates included."
        keywords="purchase order form, purchase order template, purchase order, purchase order form template, purchase order form pdf, purchase order form free, purchase order form template free, purchase order form download, purchase order form example, purchase order form format, purchase order form generator, purchase order form software, stockflow, stock flow"
        url="https://www.stockflow.be/purchase-order-form"
      />

      <SeoPageHero
        title="Purchase Order Form: Create Professional Purchase Orders"
        description="Create professional purchase order forms with StockFlow. Auto-generate purchase orders when inventory runs low, download PDFs, and streamline your purchasing process. Free templates included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Free Templates", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Auto-Generate", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Creating Purchase Orders Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Purchase Order Form <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Creating Purchase Order Forms Today
          </h2>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </SeoPageLayout>
  );
}

