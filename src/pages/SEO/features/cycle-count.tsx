import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  ClipboardCheck,
  Calculator,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';

export default function CycleCount() {
  usePageRefresh();
  
  // Get real customer data for cycle count feature
  const relevantCaseStudies = getRelevantCaseStudies('cycle count');
  const relevantTestimonials = getRelevantTestimonials('cycle count');
  const metrics = getProprietaryMetrics('cycle count');
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));
  
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
    },
    {
      question: "What is the ROI of cycle counting?",
      answer: "The ROI is typically very high. Businesses see:  in inventory accuracy, prevention of stockouts and overstock, reduced carrying costs, improved cash flow, and better decision-making. Most businesses see ROI within 3-6 months through improved accuracy and reduced inventory discrepancies."
    },
    {
      question: "How does cycle count differ from ABC analysis?",
      answer: "ABC analysis categorizes items by value (A=high, B=medium, C=low). Cycle count uses this categorization to determine counting frequency - A items counted more frequently than C items. ABC analysis helps prioritize which items to count, while cycle count is the actual counting process. StockFlow combines both for optimal inventory management."
    },
    {
      question: "Can cycle count be automated?",
      answer: "Yes, inventory management software like StockFlow automates cycle counting by: scheduling counts automatically, generating count lists, tracking count progress, comparing counted quantities to system records, identifying discrepancies, and updating inventory records. This makes cycle counting more efficient and less disruptive."
    },
    {
      question: "What causes inventory discrepancies that cycle count identifies?",
      answer: "Common causes include: theft or loss, data entry errors, receiving errors, shipping errors, damage not recorded, misplaced items, and system errors. Cycle counting helps identify these issues early before they become major problems. Regular counting prevents small discrepancies from accumulating into large errors."
    },
    {
      question: "How do you calculate cycle count accuracy?",
      answer: "Cycle count accuracy is calculated as: (Number of items counted correctly / Total items counted) × 100. For example, if you count 100 items and 95 match system records, accuracy is 95%. Target accuracy is typically 95-99%. StockFlow automatically calculates and reports cycle count accuracy."
    },
    {
      question: "Can cycle count replace full physical inventory?",
      answer: "For many businesses, yes. Regular cycle counting maintains accuracy year-round, eliminating the need for disruptive full physical counts. However, some businesses still do annual full counts for compliance or verification. The best approach combines regular cycle counting with periodic full counts for validation."
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


  return (
    <SeoPageLayout 
      title="Cycle Count"
      heroTitle="Cycle Count"
      updatedDate="3/12/2025"
      faqData={faqData}
      
      
    >
      <SEO
        title="Cycle Count Inventory 2025 - Improve Accuracy 20-30%, Save Time | StockFlow"
        description="Implement cycle count inventory 2025 for continuous accuracy. Automate cycle counting, improve accuracy 20-30%, track discrepancies. Free plan available. Start free trial - no credit card required."
        keywords="cycle count, cycle counting, inventory cycle count, cycle count inventory, cycle count method, cycle count process, cycle count schedule, cycle count software, cycle count system, inventory cycle counting, cycle count best practices, cycle count vs physical inventory, cycle count accuracy, cycle count frequency, stockflow, stock flow"
        url="https://www.stockflowsystems.com/cycle-count"
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved || "15 hours/month",
          averageCostSaved: metrics.averageCostSaved || "20-30% accuracy improvement",
          keyMetric: "95-99% accuracy",
          feature: "Cycle Count"
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

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Cycle Count</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cycle count is an inventory auditing technique where inventory is counted on a rotating schedule throughout the year, rather than counting everything at once. This maintains inventory accuracy continuously without major disruptions. For more details, see our <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> guide and <Link to="/perpetual-inventory-and-physical-inventory" className="text-blue-600 hover:underline font-semibold">perpetual inventory vs physical inventory</Link> comparison.
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

 

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="highlighted"
        />
      )}

      <StructuredData data={generateSeoPageStructuredData({
        title: "Cycle Count - Inventory Management Feature | StockFlow",
        description: "Learn about cycle counting for inventory accuracy. Automated cycle count scheduling, discrepancy tracking, and continuous inventory verification.",
        url: location.pathname,
        breadcrumbs,
        faqData,
        softwareData: {
          name: "StockFlow - Cycle Count Feature",
          description: "Automated cycle counting for inventory accuracy. Schedule counts, track discrepancies, and maintain continuous inventory verification.",
          category: "BusinessApplication",
          operatingSystem: "Web Browser",
          price: "0",
          currency: "EUR",
          url: location.pathname,
          features: [
            "Automated cycle count scheduling",
            "Discrepancy tracking",
            "Continuous inventory verification",
            "Mobile counting support"
          ]
        },
        pageType: 'software',
        includeWebSite: false
      })} />
    </SeoPageLayout>
  );
}



