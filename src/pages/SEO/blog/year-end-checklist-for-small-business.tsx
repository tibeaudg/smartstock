import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ClipboardCheck,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Gavel,
  Monitor,
  TrendingUp,
  Target,
  Download,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export default function EndOfYearChecklistPage() {
  
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
      question: 'Why is an end-of-year inventory audit necessary if I track stock perpetually?',
      answer:
        'Even with a perpetual system, a year-end physical audit is the only way to verify digital records against reality. It allows you to account for shrinkage, damage, and administrative errors, ensuring your balance sheet is 100% accurate for tax season.',
    },
    {
      question: 'What financial reports are most important for small businesses in December?',
      answer:
        'The essential reports include the Balance Sheet, Profit and Loss (P&L) statement, and Cash Flow statement. These documents help calculate tax liability, asset depreciation, and budget for the following year.',
    },
    {
      question: 'How should I prepare for changing labor laws at the end of the year?',
      answer:
        'Review local, state, and federal mandates regarding minimum wage, sick time, and employee rights. Ensure all required workplace signage is updated and that your payroll system reflects any new tax or benefit regulations starting January 1st.',
    },
    {
      question: 'What is the benefit of an end-of-year IT equipment audit?',
      answer:
        'An IT audit ensures that all company-issued hardware is accounted for, maintained, and secure. It also provides an opportunity to recycle obsolete equipment and renew software licenses to avoid service interruptions in the new year.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'End-Of-Year Small Business Checklist | StockFlow',
    description:
      'A comprehensive guide for small business owners to close the year strong. Includes inventory audits, financial reporting, and demand forecasting.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Business Suite',
      description:
        'Inventory and asset management software that streamlines end-of-year audits through mobile scanning and automated reporting.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'End-of-year audit tools',
        'Physical inventory reconciliation',
        'Asset depreciation tracking',
        'Automated financial reporting',
        'License & renewal reminders',
      ],
      image: 'https://www.stockflowsystems.com/year-end-checklist-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const checklistItems = [
    { icon: ClipboardCheck, title: 'Audit Physical Inventory', desc: 'Verify digital counts with a full warehouse walkthrough to identify shrinkage.' },
    { icon: Users, title: 'Vendor Sync', desc: 'Discuss new year pricing and potential supply chain lead times with key suppliers.' },
    { icon: BookOpen, title: 'Close the Books', desc: 'Reconcile accounts receivable and finalize payroll and holiday bonuses.' },
    { icon: BarChart3, title: 'Run Financial Reports', desc: 'Generate balance sheets and P&L statements for tax preparation.' },
    { icon: FileText, title: 'License Renewals', desc: 'Check expiration dates for operating permits and professional certifications.' },
    { icon: Gavel, title: 'Legal Compliance', desc: 'Update workplace signage and verify new state/federal mandates for Jan 1.' },
    { icon: Monitor, title: 'IT Asset Audit', desc: 'Account for all loaned hardware and verify maintenance records for tech equipment.' },
    { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Use historical data to predict inventory needs for the next four quarters.' },
    { icon: Target, title: 'Goal Setting', desc: 'Define hiring headcounts, growth targets, and new software implementation plans.' },
  ];

  const keyTakeaways = [
    'Physical inventory audits in December are crucial for accurate tax reporting and identifying stock shrinkage.',
    'Early communication with suppliers helps you anticipate price hikes or supply chain delays in the coming year.',
    'Updating compliance signage and verifying new labor laws prevents costly legal penalties on January 1st.',
    'Inventory software like StockFlow simplifies the audit process with mobile QR scanning and real-time reconciliation.',
  ];

  return (
    <SeoPageLayout
      title="End-Of-Year Checklist For Small Business Owners"
      heroTitle="Close Your Books and Prep for Growth"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="2026 Small Business End-Of-Year Checklist | StockFlow"
        description="The ultimate December guide for small business owners. From inventory audits to financial closing, ensure your business is ready for the new year."
        keywords="small business end of year checklist, inventory audit, financial closing, year end business planning, stockflow"
        url="https://www.stockflowsystems.com/small-business-end-of-year-checklist"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Mastering the December Sprint</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            The final weeks of the year are the most critical for <strong>operational health</strong>. Beyond holiday rushes, business owners must navigate the transition from historical accounting to future-focused strategy. This checklist provides a structured path to ensure no detail—from <strong>inventory shrinkage</strong> to <strong>compliance updates</strong>—is left to chance.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By tackling these nine essential tasks, you move from reactive management to a proactive stance, ready to scale on day one of the new calendar year.
          </p>
        </div>
      </section>

      {/* Checklist Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Your 9-Point Year-End Strike List</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {checklistItems.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <item.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{i + 1}. {item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive: Inventory Audit */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Why December is for Auditing</h2>
              <p className="text-gray-600 leading-relaxed">
                A physical inventory count is the bedrock of your year-end financials. It reveals the true state of your assets, helping you uncover <strong>obsolescence</strong> or <strong>over-ordering</strong> patterns.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <ShieldCheck className="text-blue-600 shrink-0" />
                  <p className="text-sm text-gray-700"><strong>Perpetual Accuracy:</strong> Mobile apps with QR scanning reduce audit time by 70% compared to paper logs.</p>
                </div>
                <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <Calendar className="text-orange-600 shrink-0" />
                  <p className="text-sm text-gray-700"><strong>Future Planning:</strong> Use audit data to set smarter par levels for your Q1 orders.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <Download className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">StockFlow Audit Tools</h4>
              <p className="opacity-90 mb-6">Professional features designed to make December painless:</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">1</div>
                  <span>Batch QR Scanning for rapid physical counts.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">2</div>
                  <span>Real-time discrepancy reporting.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">3</div>
                  <span>Instant CSV exports for your accountant.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Final Step */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Start Your Year-End Audit Today</h2>
          <p className="text-lg text-gray-600 mb-10">
            Don't wait until December 31st to discover a discrepancy. <strong>StockFlow</strong> provides the tools you need to organize, track, and audit your assets from any device. Simplify your year-end and focus on your 2026 growth goals.
          </p>
          <div className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold inline-block shadow-lg">
            Download the Full Year-End Checklist
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}