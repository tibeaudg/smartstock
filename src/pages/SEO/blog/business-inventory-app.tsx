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
  PackageCheck
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
      title="The Best Inventory App for Small Businesses"
      heroTitle="Small Business Inventory Management Made Simple"
      updatedDate="01/08/2026"
      faqData={faqData}
        keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Small Business Inventory App 2026 | StockFlow"
        description="Ditch the spreadsheets. Track stock, tools, and assets from your phone. The perfect inventory app for small business owners and teams."
        keywords="small business inventory app, mobile inventory tracking, inventory app for iphone, android inventory scanner, smb asset tracking"
        url="https://www.stockflowsystems.com/small-business-inventory-app"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Small Business Inventory, Reimagined</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Small business owners don't have time for complex ERP systems or "messy" manual spreadsheets. <strong>StockFlow</strong> is a dedicated <strong>mobile inventory app</strong> designed to give you total control over your stock, materials, and equipment at the touch of a button.
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
    </SeoPageLayout>
  );
}