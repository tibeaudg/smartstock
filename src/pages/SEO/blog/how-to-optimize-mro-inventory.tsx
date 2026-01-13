import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Wrench,
  Settings,
  ClipboardCheck,
  PackageSearch,
  ArrowDownCircle,
  BarChart3,
  ShieldCheck,
  Truck,
  Zap,
  LayoutGrid,
  History,
  AlertCircle
} from 'lucide-react';

export default function MroInventoryOptimizationPage() {
  usePageRefresh();
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map(
    (item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })
  );

  const faqData = [
    {
      question: 'What exactly is MRO inventory optimization?',
      answer:
        'MRO inventory optimization is a strategy focused on maximizing the efficiency of Maintenance, Repair, and Operations supplies. This includes refining how items are organized, tracked, and reordered to ensure production never stops while minimizing the capital tied up in non-revenue-generating supplies.',
    },
    {
      question: 'Why do businesses often overlook MRO supplies?',
      answer:
        'MRO items are often an afterthought because they do not become part of the final sold product. Since their value is harder to quantify per unit of revenue, businesses frequently resort to manual tracking or overstocking to "be safe," which leads to significant hidden costs.',
    },
    {
      question: 'How can I determine my ideal MRO stock levels?',
      answer:
        'Start by analyzing historical purchase orders and usage data to establish a baseline. Implement a perpetual inventory system to monitor real-time consumption for 2–3 months. This data allows you to set precise minimum levels and safety stock buffers based on actual business needs.',
    },
    {
      question: 'What role does an SOP play in MRO management?',
      answer:
        'A Standard Operating Procedure (SOP) formalizes the management process. It defines where items are stored, who is responsible for tracking usage, when reorders are triggered, and which vendors are approved, ensuring consistency across shifts and locations.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'MRO Inventory Optimization: Best Practices & Strategies | StockFlow',
    description:
      'Learn how to optimize your Maintenance, Repair, and Operations (MRO) inventory. Reduce costs and prevent production downtime with smart tracking and organization.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow MRO Management',
      description:
        'Professional MRO inventory software designed to track consumables, tools, and repair parts with automated low-stock alerts and QR scanning.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time consumable tracking',
        'Automated reorder alerts',
        'Mobile QR/Barcode scanning',
        'Usage history reporting',
        'Vendor management integration',
      ],
      image: 'https://www.stockflowsystems.com/mro-optimization-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const bestPractices = [
    {
      icon: PackageSearch,
      title: '1. Forecast True Need',
      description: 'Analyze historical purchase orders and track real-time consumption for several months to move beyond guesswork and set data-driven stock levels.',
    },
    {
      icon: LayoutGrid,
      title: '2. Physical Logic',
      description: 'Organize storage spaces—from supply closets to warehouses—so that items are placed in natural, easy-to-access, and auditable locations.',
    },
    {
      icon: ClipboardCheck,
      title: '3. Formalize the SOP',
      description: 'Document exactly how MRO supplies are managed, tracked, and audited. Clear instructions prevent stockouts and unauthorized over-ordering.',
    },
    {
      icon: BarChart3,
      title: '4. Digital Tracking',
      description: 'Shift from spreadsheets to dedicated software. Use automation like low-stock alerts to maintain a perpetual view of your maintenance supplies.',
    },
  ];

  const keyTakeaways = [
    'Optimizing MRO inventory uncovers hidden cost savings by reducing excess safety stock that ties up capital.',
    'A perpetual inventory strategy for maintenance supplies ensures critical spare parts are always available for urgent repairs.',
    'Physical organization is a prerequisite for digital accuracy; a clean storage space leads to more reliable audits.',
    'Standardizing MRO processes through an SOP ensures production continuity regardless of personnel changes.',
  ];

  return (
    <SeoPageLayout
      title="How to Optimize MRO Inventory"
      heroTitle="Stop Overspending on Maintenance, Repair, and Operations"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="MRO Inventory Optimization Guide 2026 | Reduce Maintenance Costs"
        description="Master MRO inventory management. Discover 5 best practices to organize maintenance supplies, automate reordering, and improve operational efficiency."
        keywords="MRO inventory optimization, maintenance repair operations, MRO best practices, supply tracking software, stockflow mro"
        url="https://www.stockflowsystems.com/mro-inventory-optimization"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Efficiency Beyond the End Product</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            While raw materials and finished goods get all the attention, <strong>MRO inventory</strong>—the supplies that keep your machines running and your facility functional—is often the largest source of "invisible" waste. Because these items don't directly generate revenue, they are frequently overstocked or neglected.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            <strong>MRO inventory optimization</strong> changes the narrative, transforming maintenance supplies from a chaotic expense into a streamlined, data-backed asset that protects your production uptime.
          </p>
        </div>
      </section>

      {/* Best Practices Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">5 Pillars of MRO Excellence</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestPractices.map((practice, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <practice.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{practice.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive: The Cost of Neglect */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">The Balancing Act: Inventory Control</h2>
              <p className="text-gray-600 leading-relaxed">
                Optimizing MRO isn't just about having less; it's about having exactly what you need. <strong>Smart inventory control</strong> balances the cost of holding supplies against the catastrophic cost of a production line halt due to a missing $10 part.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <ArrowDownCircle className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Lower Holding Costs</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Zap className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Zero Downtime</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Truck className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Better Vendor Terms</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <History className="text-blue-600 w-5 h-5" />
                  <span className="text-xs font-bold">Usage Auditing</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <Settings className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">Why StockFlow for MRO?</h4>
              <p className="opacity-90 mb-6">Apply the same precision to your maintenance supplies as you do your revenue-generating stock:</p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Low Stock Alerts:</strong> Get notified before a critical repair part runs out.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>QR/Barcode Scanning:</strong> Check out consumables instantly from your phone.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Consumable Insight:</strong> Identify which departments are using the most MRO resources.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action/Actionable Step */}
      <section className="py-20 bg-gray-50 border-y">
        <div className="max-w-4xl mx-auto text-center px-4">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Ready to Reduce MRO Waste?</h2>
          <p className="text-lg text-gray-600 mb-8">
            The easiest way to optimize your MRO is to track it alongside your primary inventory. By integrating maintenance supplies into your <strong>perpetual inventory management strategy</strong>, you gain absolute clarity on your overhead costs.
          </p>
          <div className="bg-white p-6 rounded-lg border shadow-sm inline-block text-left">
            <h5 className="font-bold mb-2">Next Step: MRO Audit</h5>
            <p className="text-sm text-gray-500">Perform a physical count of your current maintenance supplies and digitize them in StockFlow today.</p>
          </div>
        </div>
      </section>



      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>

    </SeoPageLayout>
  );
}