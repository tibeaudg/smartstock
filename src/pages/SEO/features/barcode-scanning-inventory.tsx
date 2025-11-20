import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import ConversionCTA from '@/components/seo/ConversionCTA';
import InternalLinkingWidget from '@/components/seo/InternalLinkingWidget';
import TrustSignals from '@/components/seo/TrustSignals';
import { generateFAQSchema, generateSoftwareApplicationSchema } from '@/lib/structuredData';

const BarcodeScanningInventory = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const publishedTime = '2024-01-15T00:00:00Z';
  const modifiedTime = new Date().toISOString();
  
  const expandedKeywords = [
    'barcode scanning inventory',
    'barcode scanner inventory system',
    'mobile barcode scanning',
    'inventory barcode scanner',
    'barcode inventory software',
    'qr code inventory',
    'mobile inventory scanner',
    'barcode reader for inventory',
    'scan inventory app',
    'barcode tracking system',
    'inventory scanning solution',
    'barcode inventory management',
    'mobile barcode app',
    'inventory scanner app',
    'barcode stock management',
    'generating a barcode',
    'how is barcode generated',
    'how to generate barcode',
    'barcode generation',
    'generate barcode',
    'create barcode',
    'barcode generator'
  ].join(', ');

  const faqData = [
    {
      question: 'How does barcode scanning work for inventory management?',
      answer: 'Barcode scanning for inventory uses mobile devices or dedicated scanners to read product barcodes. The scanned data instantly updates inventory levels, tracks movements, and eliminates manual data entry errors. StockFlow supports both QR codes and traditional barcodes.'
    },
    {
      question: 'Can I use my smartphone as a barcode scanner?',
      answer: 'Yes! StockFlow works with any smartphone camera to scan barcodes. No additional hardware is required - just use your phone\'s camera to scan product barcodes and update inventory in real-time.'
    },
    {
      question: 'What types of barcodes are supported?',
      answer: 'StockFlow supports all major barcode formats including UPC, EAN, Code 128, Code 39, QR codes, and Data Matrix. The system automatically recognizes and processes the barcode format. When generating a barcode, StockFlow automatically selects the best format for your product.'
    },
    {
      question: 'How is barcode generated in StockFlow?',
      answer: 'When you add a product to StockFlow, a barcode is automatically generated for that product. The system uses your product SKU or creates a unique identifier, then generates a barcode in the appropriate format (UPC, EAN, Code 128, or QR code). You can then print the barcode label or use it for scanning.'
    },
    {
      question: 'Can I generate barcodes for existing products?',
      answer: 'Yes, StockFlow can generate barcodes for all your existing products. When generating a barcode, the system uses your product information to create unique, scannable barcodes that integrate seamlessly with your inventory management.'
    },
    {
      question: 'Is barcode scanning accurate for inventory counts?',
      answer: 'Barcode scanning is highly accurate - significantly more accurate than manual counting. It reduces human error, speeds up inventory operations, and provides real-time stock level updates.'
    }
  ];

  const structuredData = [
    generateFAQSchema(faqData),
    generateSoftwareApplicationSchema({
      name: 'StockFlow Barcode Scanning Inventory',
      description: 'Mobile barcode scanning for inventory management. Scan products with your smartphone to update stock levels instantly. Supports QR codes and all major barcode formats.',
      category: 'Inventory Software',
      operatingSystem: 'iOS, Android, Web Browser',
      price: '0',
      currency: 'EUR',
      features: [
        'Mobile Barcode Scanning',
        'QR Code Support',
        'Real-time Inventory Updates',
        'Offline Scanning',
        'Batch Scanning',
        'Multi-location Support'
      ],
      image: '/dashboard.png',
      url: 'https://www.stockflow.be/barcode-scanning-inventory',
      rating: {
        value: '4.8',
        count: '200'
      }
    })
  ];

  return (
    <SeoPageLayout 
      title="Barcode Scanning Inventory"
      heroTitle="Barcode Scanning Inventory"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Barcode Scanning Inventory 2025 - Barcode Scanning Inventory"
        description="Find out how barcode scanning inventory to automate your processes. Find out how barcode scanning inventory to automate your processes.. Start free today."
        keywords={expandedKeywords}
        url="https://www.stockflow.be/barcode-scanning-inventory"
        locale="en"
        category="Features"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
      />
      <StructuredData data={structuredData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Barcode Scanning for Inventory Management
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Use your smartphone to scan barcodes and update inventory in real-time. 
            Learn how is barcode generated and start generating a barcode for your products. 
            Eliminate manual data entry, reduce errors, and speed up inventory operations with mobile barcode scanning.
          </p>

          <TrustSignals variant="compact" className="mb-8" />

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Barcode Scanning for Inventory
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">⚡ Speed & Efficiency</h3>
                <p className="text-gray-600">
                  Scan products in seconds instead of manually entering data. Increase inventory counting speed by 10x.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">✓ Accuracy</h3>
                <p className="text-gray-600">
                  Eliminate human error with automated barcode recognition. 99.9% accuracy compared to manual entry.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">ðŸ“± Mobile Convenience</h3>
                <p className="text-gray-600">
                  Use any smartphone - no additional hardware required. Scan products anywhere in your warehouse or store.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">ðŸ”„ Real-time Updates</h3>
                <p className="text-gray-600">
                  Inventory levels update instantly when you scan. See current stock levels immediately across all locations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <ConversionCTA
            variant="default"
            title="Start Scanning Your Inventory Today"
            description="Try StockFlow's mobile barcode scanning - no hardware required, works with any smartphone."
            primaryText="Start Free Trial"
            primaryLink="/auth"
            className="my-12"
          />

          <InternalLinkingWidget
            currentPath={currentPath}
            variant="inline"
            limit={5}
            className="my-12"
          />
        </article>
      </div>
    </SeoPageLayout>
  );
};

export default BarcodeScanningInventory;


