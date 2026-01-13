import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Smartphone,
  Store,
  QrCode,
  Users,
  Camera,
  BarChart3,
  Box,
  Wrench,
  ShoppingBag,
  History,
  FolderTree,
  CheckCircle,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Zap
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function SmallBusinessInventoryAppPage() {
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
      question: 'What is the best inventory app for a small business?',
      answer:
        'The best inventory app for small businesses is one that offers mobile accessibility, built-in barcode scanning, and real-time cloud syncing. StockFlow is highly recommended because it eliminates complex spreadsheets and allows small teams to track stock, tools, and supplies from their own smartphones with zero training required.',
    },
    {
      question: 'Can I use my iPhone or Android to track business inventory?',
      answer:
        'Yes. Modern inventory apps like StockFlow are designed to turn any smartphone into a high-powered inventory scanner. You can use the built-in camera to scan QR codes, take photos of items, and update stock levels instantly from the field or the shop floor.',
    },
    {
      question: 'How do small businesses handle low stock situations?',
      answer:
        'Small businesses use automated alerts to prevent stockouts. By setting a minimum quantity threshold for items in the app, the business owner or manager receives an instant notification when it is time to reorder, ensuring operations never grind to a halt.',
    },
    {
      question: 'Is it easy to switch from Excel to an inventory app?',
      answer:
        'Yes. StockFlow features an easy inventory import tool that allows you to upload your existing CSV or Excel spreadsheets. This instantly transforms your static list into a visual, searchable, and interactive digital catalog.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Best Small Business Inventory App 2026 | StockFlow',
    description:
      'The simplest mobile inventory app for small businesses. Track stock, assets, and supplies from your smartphone. Built-in QR scanning and real-time syncing.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow SMB Edition',
      description:
        'A mobile-first inventory management application designed specifically for small business owners and independent contractors.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Mobile QR & Barcode scanning',
        'Visual item catalog with photos',
        'Low stock push notifications',
        'Spreadsheet import tool',
        'Multi-device cloud sync',
        'User activity history',
      ],
      image: 'https://www.stockflowsystems.com/smb-inventory-app.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Smartphone,
      title: 'Smartphone-First Design',
      description: 'Manage your entire business from your pocket. No expensive hardware or complicated scanners required.',
    },
    {
      icon: QrCode,
      title: 'In-App Barcoding',
      description: 'Create and scan QR codes instantly. Turn any item into a trackable asset with a single tap of your camera.',
    },
    {
      icon: Camera,
      title: 'Visual Inventory',
      description: 'Add high-resolution photos to every item to verify condition and help team members identify parts quickly.',
    },
    {
      icon: Box,
      title: 'Supplies & Consumables',
      description: 'Track the materials you use every day. Set alerts so you never run out of the basics that keep you running.',
    },
    {
      icon: FolderTree,
      title: 'Custom Organization',
      description: 'Use folders and subfolders to organize inventory by job site, truck, or shelving unit exactly how you work.',
    },
    {
      icon: History,
      title: 'Activity Tracking',
      description: 'See exactly who updated what and when. Maintain total accountability even as your small team grows.',
    },
  ];

  const keyTakeaways = [
    'Mobile apps allow business owners to manage inventory on the go without being tied to a desk.',
    'Visual tracking with photos significantly reduces picking errors and helps with quality control.',
    'Low stock alerts protect small business cash flow by preventing emergency retail-price purchases.',
    'Easy data import makes the transition from spreadsheets to a professional app fast and painless.',
  ];

  return (
    <SeoPageLayout
      title="What is the best inventory app for small business? 2026 | StockFlow"
      heroTitle="What is the best inventory app for small business?"
      dateUpdated="january 10, 2026"
      faqData={faqData}
        keyTakeaways={keyTakeaways}
    >
      <SEO
        title="What is the best inventory app for small business? 2026 | StockFlow"
        description="Ditch the spreadsheets. Track stock, tools, and assets from your phone. The perfect inventory app for small business owners and teams."
        keywords="small business inventory app, mobile inventory tracking, inventory app for iphone, android inventory scanner, smb asset tracking"
        url="https://www.stockflowsystems.com/business-inventory-app"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">What is the best inventory app for small business?</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Business owners don't have time for complex ERP systems or "messy" manual spreadsheets. <strong>StockFlow</strong> is a dedicated <strong>mobile inventory app</strong> designed to give you total control over your stock, materials, and equipment at the touch of a button.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you are a retail shop owner, a contractor with a van full of tools, or an e-commerce seller, our app provides a <strong>centralized, automated system</strong> that works across all your devices. Real-time syncing means your data is always up to date, whether you're in the warehouse or at a client site.
          </p>
        </div>
      </section>

      {/* Versatility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Flexible Tracking for Every Small Business Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Store className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold mb-2">Retail & Sales</h4>
              <p className="text-sm text-gray-600">Track finished goods, manage variants, and monitor what’s moving off the shelves.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Wrench className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold mb-2">Tools & Assets</h4>
              <p className="text-sm text-gray-600">Know exactly which technician has which tool and track maintenance for vehicles.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <ShoppingBag className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold mb-2">Consumables</h4>
              <p className="text-sm text-gray-600">Never run out of shipping supplies, raw materials, or PPE again with automated alerts.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <PackageCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold mb-2">Bespoke Projects</h4>
              <p className="text-sm text-gray-600">Organize unique parts and components specifically for custom client jobs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <f.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive: Growth & Efficiency */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Save Time, Save Money, Scale Faster</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                As a small business, your time is your most valuable asset. Our <strong>inventory management app</strong> is designed to be so intuitive that it requires zero training for you or your team.
              </p>
              <div className="flex gap-4 items-start">
                <TrendingUp className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Predictive Insights:</strong> Use real-time reporting to identify trends and stop over-ordering on slow-moving stock.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Users className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Team Collaboration:</strong> Grant specific access to employees so they can update stock levels without seeing sensitive cost data.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">SMB Operational Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> One-Touch Excel Import</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Custom Field Tailoring</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Bulk Quantity Updates</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Audit-Ready PDF Reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">The Right Inventory Solution for Your Stage</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Solopreneurs</h4>
              <p className="text-sm text-gray-600">The perfect free-to-start tool for tracking personal collections, side hustles, or small equipment lists.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Growing Teams</h4>
              <p className="text-sm text-gray-600">Centralize tracking across multiple employees and locations with mobile-first collaboration.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Established SMBs</h4>
              <p className="text-sm text-gray-600">Leverage advanced reporting, barcoding, and custom fields to professionalize your supply chain.</p>
            </div>
          </div>
        </div>
      </section>
{/* New Section: Business Inventory App */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Smartphone className="w-4 h-4" /> Mobile-First Operations
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Streamline Operations with a Professional <span className="text-indigo-600">Business Inventory App</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                In today's fast-paced market, a desktop-only system is a bottleneck. A dedicated <strong>business inventory app</strong> transforms every employee's smartphone into a powerful warehouse terminal. Whether you are managing a retail stockroom or a massive distribution center, having <strong>inventory management online</strong> via a mobile interface is the only way to maintain 100% data accuracy.
              </p>
              <p className="text-slate-600 mb-8">
                StockFlow’s <strong>online inventory management software</strong> is designed for high-frequency scanning and instant updates. By moving away from paper logs and manual entry, businesses can reduce fulfillment times by up to 40% and virtually eliminate "human error" stock discrepancies.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900">Native Scanning</h4>
                  <p className="text-sm text-slate-500">High-speed QR and Barcode recognition via camera.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900">Offline Sync</h4>
                  <p className="text-sm text-slate-500">Scan items in dead zones; sync once reconnected.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-200 shadow-inner">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                  <div className="bg-slate-900 p-4 flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">stockflow_mobile_v4.2</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-slate-900">Scan & Update</h3>
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'SKU: 4902-BX', status: 'In Transit', color: 'blue' },
                        { label: 'SKU: 1105-CH', status: 'Stock Low', color: 'orange' },
                        { label: 'SKU: 8821-XP', status: 'Verified', color: 'green' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className={`text-[10px] font-bold text-${item.color}-600 uppercase`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                      <Smartphone className="w-4 h-4" /> Launch Scanner
                    </button>
                  </div>
                </div>
              </div>
              {/* Decorative background elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>



{/* Section: Why You Need a Dedicated Business Inventory App */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Side */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-2 border border-slate-200">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white aspect-[4/3] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Live Warehouse Feed</p>
                      <h4 className="text-xl font-bold">Mobile Stock Control</h4>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>SYNCING TO CLOUD...</span>
                      <span>75% COMPLETE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 mb-1">Scans Today</p>
                      <p className="text-lg font-bold">1,284</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 mb-1">Accuracy</p>
                      <p className="text-lg font-bold text-green-400">99.8%</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Abstract decorations */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -z-0" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -z-0" />
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Scale Faster with a Pro <span className="text-blue-600">Business Inventory App</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Relying on physical clipboards or a central PC creates a data lag that kills growth. A modern <strong>business inventory app</strong> allows your team to perform cycle counts, receive POs, and manage returns directly at the point of action. 
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Zero-Lag Sync</h4>
                    <p className="text-sm text-slate-500">Updates to your <strong>online inventory management system</strong> happen in milliseconds, preventing overselling on e-commerce channels.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Real-Time Reporting</h4>
                    <p className="text-sm text-slate-500">Access high-level analytics from your <strong>web based inventory software</strong> right from the palm of your hand.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">User Permissions</h4>
                    <p className="text-sm text-slate-500">Maintain security in your <strong>online inventory system</strong> by restricting app access based on employee roles.</p>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-slate-500 text-sm">
                Stop using <strong>inventory management online</strong> tools that weren't built for mobile. StockFlow's app is designed for high-volume, professional business environments.
              </p>
            </div>
          </div>
        </div>
      </section>



{/* Section: The ROI of a Specialized Business Inventory App */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Maximize Efficiency with a <span className="text-blue-600">Business Inventory App</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transitioning from manual logs to a professional <strong>business inventory app</strong> isn't just an upgrade—it's a fundamental shift in how your company captures value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Anywhere Accessibility</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A native <strong>business inventory app</strong> allows team members to verify stock levels while standing in the aisle, at the loading dock, or out in the field. This immediate access to your <strong>online inventory management system</strong> prevents the "I think we have it" guessing game.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-green-200 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Error-Free Scanning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Human error in data entry is the primary cause of stockouts. By using a <strong>business inventory app</strong> with built-in barcode scanning, you ensure that the physical item in your hand matches the digital record in your <strong>web based inventory software</strong> every single time.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-purple-200 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Reconciliation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cycle counting becomes a background task rather than a weekend ordeal. Employees can perform "micro-audits" during their downtime, keeping your <strong>online inventory system</strong> reconciled in real-time without halting production or sales.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="lg:w-2/3 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Built for the Modern Workforce</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                The <strong>best online inventory management software</strong> should feel as intuitive as the consumer apps your team uses every day. StockFlow combines enterprise-grade power with a sleek mobile interface, ensuring high adoption rates and minimal training time for new hires.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Multi-user live collaboration
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Low-stock push notifications
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Photo attachments for damage logs
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> GPS-tagged stock movements
                </li>
              </ul>
            </div>
            <div className="lg:w-1/3 flex justify-center relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                <button className="relative px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-xl">
                  Get the App Now
                </button>
              </div>
            </div>
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