import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  CheckCircle,
  Star,
  Trophy,
  Users,
  FileText,
  Download,
  Package
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function PackingSlipTemplate() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is a packing slip template?",
      answer: "A packing slip template is a document that lists the items included in a shipment. It's used for order fulfillment, inventory tracking, and customer verification. Packing slip templates help businesses organize shipments, track inventory movements, and provide customers with order details."
    },
    {
      question: "Do I need packing slip templates for my business?",
      answer: "Packing slip templates are essential for businesses that ship products to customers. They help track shipments, verify orders, manage inventory, and provide professional documentation. Even small businesses benefit from using packing slip templates for order fulfillment."
    },
    {
      question: "Can inventory management software generate packing slip templates?",
      answer: "Yes, inventory management software like StockFlow can automatically generate packing slip templates when orders are fulfilled. The system includes product details, quantities, order information, and can be customized with your branding."
    },
    {
      question: "What information should be included in a packing slip template?",
      answer: "A packing slip template should include: order number, shipping date, customer information, product details (description, SKU, quantity), shipping address, and tracking information. StockFlow automatically includes all necessary information when generating packing slips."
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Auto-Generated Slips",
      description: "Automatically generate packing slip templates when orders are fulfilled."
    },
    {
      icon: Download,
      title: "Download & Print",
      description: "Download packing slip templates as PDFs or print them directly for shipments."
    },
    {
      icon: Package,
      title: "Professional Format",
      description: "Professional packing slip templates with all necessary details and branding options."
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'features', title: 'Features', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Packing Slip Template"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Packing Slip Template 2025 | Free Packing Slip Template | StockFlow"
        description="Create professional packing slip templates with StockFlow inventory management software. Auto-generate packing slips, download PDFs, and streamline order fulfillment. Free templates included."
        keywords="packing slip template, packing slip, packing slip template free, packing slip template pdf, packing slip template download, packing slip template word, packing slip template excel, packing slip form, packing slip format, packing slip generator, packing slip software, packing slip template printable, stockflow, stock flow"
        url="https://www.stockflow.be/packing-slip-template"
      />

      <SeoPageHero
        title="Packing Slip Template: Create Professional Packing Slips"
        description="Create professional packing slip templates with StockFlow. Auto-generate packing slips for orders, download PDFs, and streamline your order fulfillment process. Free templates included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Free Templates", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Auto-Generate", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Creating Packing Slips Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Packing Slip Template <span className="text-blue-600">Features</span>
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
            Start Creating Packing Slip Templates Today
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



