import React from 'react';
import SeoPageLayout from '@/components/SeoPageLayout';

const keyTakeaways = [
  'Shopify Inventory is designed for e-commerce stores — StockFlow is a dedicated inventory management system that works for any business type.',
  'StockFlow starts completely free while Shopify requires a paid e-commerce subscription just to access inventory features.',
  'StockFlow supports offline barcode scanning, Bill of Materials, and purchase order management that Shopify lacks without expensive apps.',
  'If you sell on Shopify but need robust inventory control, StockFlow can integrate via API to give you professional stock management without paying for extra Shopify apps.',
];

const faqData = [
  {
    question: 'Can StockFlow replace Shopify for inventory management?',
    answer: 'If you only need inventory management (not e-commerce), yes — StockFlow is a better and cheaper option. However, if you actively sell through Shopify\'s storefront, you\'ll still want Shopify for your online store. The two can work together: StockFlow manages your stock, and you sync inventory levels to Shopify via the API.',
  },
  {
    question: 'Does Shopify have a dedicated inventory management system?',
    answer: 'Shopify includes basic inventory tracking built into its e-commerce platform, but it is not a standalone inventory management system. It lacks features like Bill of Materials, purchase orders, offline barcode scanning, and advanced stock counts. For serious inventory operations, most Shopify merchants add a dedicated app like StockFlow.',
  },
  {
    question: 'Does StockFlow integrate with Shopify?',
    answer: 'Yes, via the StockFlow API (Enterprise plan). You can sync inventory levels bidirectionally between StockFlow and your Shopify store so that sales on Shopify automatically deduct from your StockFlow inventory.',
  },
  {
    question: 'How does Shopify inventory pricing compare to StockFlow?',
    answer: 'Shopify\'s Basic plan starts at $39/month but that\'s for the full e-commerce platform — inventory is a secondary feature. StockFlow is free to start and paid plans begin at $9/month. If you only need inventory management (not an online storefront), StockFlow is significantly more cost-effective.',
  },
  {
    question: 'Can StockFlow handle multi-location inventory like Shopify?',
    answer: 'Yes. StockFlow\'s Professional plan supports 2 warehouse locations, Business supports 5, and Enterprise supports unlimited locations. Shopify\'s multi-location feature is only available on Shopify, Advanced, and Plus plans.',
  },
];

const Page = () => {
  return (
    <SeoPageLayout
      heroTitle="StockFlow vs Shopify Inventory: Do You Need Both?"
      title="StockFlow vs Shopify Inventory Management — Comparison 2026 | StockFlow"
      dateUpdated="May 19, 2026"
      keyTakeaways={keyTakeaways}
      faqData={faqData}
    >
      <div className="space-y-20 max-w-5xl mx-auto">

        {/* Section 1: Overview */}
        <section className="prose max-w-none">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
            Shopify vs StockFlow: Two Different Tools for Different Jobs
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Shopify is an e-commerce platform. Its inventory features exist to support online selling — not to be your primary stock management system. <strong>StockFlow is a dedicated inventory management platform</strong> designed to handle the full complexity of physical stock: multi-location warehouses, purchase orders, barcode scanning, Bill of Materials, and stock counts.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Many businesses use both: Shopify for their online storefront and StockFlow for inventory operations. This guide explains the differences, when each makes sense, and how to get the best of both worlds.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800 font-semibold text-lg mb-2">Quick Answer</p>
            <p className="text-amber-700">
              If you sell online through Shopify, you probably need both. Use <strong>Shopify</strong> for your storefront and <strong>StockFlow</strong> for serious inventory management — then sync them via API.
            </p>
          </div>
        </section>

        {/* Section 2: Feature Comparison */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Feature Comparison</h2>
          <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase w-1/3">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700 uppercase bg-blue-50/50">StockFlow</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500 uppercase">Shopify Inventory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[
                  ['Free plan available', '✓ Free forever (100 items)', '✗ $39+/month required'],
                  ['Starting price for inventory', 'Free', '$39/month (full Shopify plan)'],
                  ['Purpose', 'Dedicated inventory management', 'E-commerce with inventory built-in'],
                  ['Real-time stock tracking', '✓ Yes', '✓ Yes (basic)'],
                  ['Offline barcode scanning', '✓ Native mobile', '✗ Requires paid app'],
                  ['Bill of Materials (BOM)', '✓ Built-in', '✗ Not supported'],
                  ['Purchase orders', '✓ Professional plan+', '✗ Requires paid app'],
                  ['Stock counts / cycle counts', '✓ Built-in', '✓ Basic only'],
                  ['Multi-location warehouses', '✓ Up to unlimited', '✓ Shopify plan+ only'],
                  ['Supplier management', '✓ Built-in', '✗ Not included'],
                  ['Pick lists', '✓ Professional plan+', '✗ Requires paid app'],
                  ['Offline mode', '✓ Yes', '✗ No'],
                  ['Works without online store', '✓ Yes — standalone', '✗ Requires Shopify store'],
                  ['API access', '✓ Enterprise plan', '✓ Yes (all plans)'],
                ].map(([feature, sf, sh], i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold text-center bg-blue-50/20">{sf}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{sh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Use Cases */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Which Should You Use?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Use StockFlow if you…</h3>
              <ul className="space-y-3 text-blue-800">
                {[
                  'Manage physical stock in one or more warehouses',
                  'Need purchase orders and supplier management',
                  'Want to track Bill of Materials for production',
                  'Don\'t sell primarily through an online store',
                  'Need offline barcode scanning in the warehouse',
                  'Want free or low-cost inventory software',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Use Shopify Inventory if you…</h3>
              <ul className="space-y-3 text-green-700">
                {[
                  'Sell products primarily through an online store',
                  'Need e-commerce features alongside inventory',
                  'Have simple stock tracking needs (no BOM)',
                  'Already pay for Shopify and want to avoid extra tools',
                  'Use Shopify POS in retail locations',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Using both */}
        <section className="prose max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Best Setup for Shopify Sellers</h2>
          <p className="text-lg text-gray-600 mb-6">
            Most serious Shopify merchants eventually hit the limits of Shopify's built-in inventory. When you need purchase orders, BOM, advanced barcode scanning, or multi-location control beyond Shopify's basics, the answer isn't to abandon Shopify — it's to add StockFlow alongside it.
          </p>
          <div className="bg-gray-50 rounded-2xl p-8 not-prose">
            <h3 className="font-bold text-gray-900 text-xl mb-6">Recommended Setup for Shopify Sellers</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Shopify for your store', desc: 'Continue using Shopify for your online storefront, checkout, and payments.' },
                { step: '2', title: 'StockFlow for inventory', desc: 'Use StockFlow for purchase orders, BOM, barcode scanning, and multi-location stock management.' },
                { step: '3', title: 'Sync via API', desc: 'Connect them via StockFlow\'s API so Shopify sales automatically update your StockFlow inventory.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">{step}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-4">Start Managing Inventory Properly — For Free</h2>
          <p className="text-blue-100 text-lg mb-6">
            Whether you use Shopify or not, StockFlow gives you the inventory control your business needs. Start free today.
          </p>
          <a
            href="/auth?mode=register"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            Get Started Free — No Card Required
          </a>
        </section>

      </div>
    </SeoPageLayout>
  );
};

export default Page;
