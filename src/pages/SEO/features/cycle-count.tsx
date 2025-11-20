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
  ClipboardCheck,
  Calculator,
  TrendingUp,
  Target
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function CycleCount() {
  usePageRefresh();
  const location = useLocation();
  
  const faqData = [
    {
      question: "What is cycle count?",
      answer: "Cycle count is an inventory auditing technique where a small subset of inventory is counted on a regular schedule, rather than counting all inventory at once. Cycle counting helps maintain inventory accuracy throughout the year by counting different items or locations on a rotating basis, ensuring continuous verification of inventory records."
    },
    {
      question: "How does cycle count work?",
      answer: "Cycle count works by dividing inventory into groups and counting each group at different times throughout the year. High-value or fast-moving items may be counted more frequently, while slow-moving items are counted less often. This approach maintains inventory accuracy without disrupting operations like a full physical inventory count would."
    },
    {
      question: "Why is cycle count important?",
      answer: "Cycle count is important because it helps maintain inventory accuracy, identifies discrepancies early, reduces disruptions to operations, improves inventory control, helps identify root causes of inventory errors, and ensures inventory records match actual stock levels. Regular cycle counting is more efficient than annual full inventory counts."
    },
    {
      question: "How often should you do cycle count?",
      answer: "Cycle count frequency depends on item value, turnover rate, and accuracy requirements. High-value items may be counted monthly or quarterly, while lower-value items might be counted annually. Many businesses count 10-20% of inventory monthly, ensuring all items are counted at least once per year. Inventory management software helps schedule and track cycle counts."
    },
    {
      question: "What is the difference between cycle count and physical inventory?",
      answer: "Cycle count is a continuous process where small portions of inventory are counted regularly throughout the year. Physical inventory is a one-time count of all inventory, typically done annually. Cycle counting is less disruptive and helps maintain accuracy year-round, while physical inventory provides a complete snapshot at a specific time."
    },
    {
      question: "How can inventory management software help with cycle count?",
      answer: "Inventory management software like StockFlow helps with cycle count by scheduling counting tasks, generating count lists, tracking count progress, comparing counted quantities to system records, identifying discrepancies, and updating inventory records automatically. The software makes cycle counting more efficient and accurate."
    },
    {
      question: "What are the best practices for cycle count?",
      answer: "Best practices for cycle count include: counting during off-peak hours, using barcode scanners for accuracy, counting items in their storage locations, documenting discrepancies immediately, analyzing root causes of errors, prioritizing high-value items, maintaining consistent counting schedules, and using inventory management software for automation."
    }
  ];

  const features = [
    {
      icon: ClipboardCheck,
      title: "Scheduled Counting",
      description: "Schedule cycle counts automatically based on item value, turnover rate, or location for continuous inventory verification."
    },
    {
      icon: Calculator,
      title: "Discrepancy Tracking",
      description: "Track and analyze discrepancies between counted quantities and system records to identify and resolve issues."
    },
    {
      icon: Target,
      title: "Priority-Based Counting",
      description: "Prioritize cycle counts for high-value or fast-moving items that need more frequent verification."
    },
    {
      icon: TrendingUp,
      title: "Accuracy Reporting",
      description: "Generate reports on cycle count accuracy, identify trends, and measure improvements in inventory accuracy over time."
    }
  ];

  const benefits = [
    "Maintain inventory accuracy year-round",
    "Reduce disruptions compared to full inventory counts",
    "Identify and resolve discrepancies early",
    "Improve inventory control and visibility",
    "Identify root causes of inventory errors",
    "Ensure inventory records match actual stock",
    "Optimize counting schedules based on item priority",
    "Scale counting operations efficiently"
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Cycle Count?', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Cycle Count"
      heroTitle="Cycle Count"
      updatedDate="20/11/2025"
      faqData={faqData}
      
      
    >
      <SEO
        title="Cycle Count 2025 - Cycle Count 2025"
        description="Discover how cycle count to save time and money. Find out how cycle count to optimize your inventory management.. Start free today. StockFlow helps businesse..."
        keywords="cycle count, cycle counting, inventory cycle count, cycle count inventory, cycle count method, cycle count process, cycle count schedule, cycle count software, cycle count system, inventory cycle counting, cycle count best practices, cycle count vs physical inventory, cycle count accuracy, cycle count frequency, stockflow, stock flow"
        url="https://www.stockflow.be/cycle-count"
      />


              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Cycle Count</h1>
      <SeoPageHero
        title="Cycle Count: Complete Guide to Inventory Cycle Counting"
        description="Master cycle count and inventory cycle counting. Learn how cycle counting works, best practices, and how to maintain inventory accuracy year-round. Free cycle count tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Cycle Counting Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Cycle Count</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cycle count is an inventory auditing technique where inventory is counted on a rotating schedule throughout the year, rather than counting everything at once. This maintains inventory accuracy continuously without major disruptions.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cycle Count <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Cycle Count</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Cycle Counting Today
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



