import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import ConversionCTA from '@/components/seo/ConversionCTA';
import InternalLinkingWidget from '@/components/seo/InternalLinkingWidget';
import TrustSignals from '@/components/seo/TrustSignals';
import { generateFAQSchema, generateServiceSchema, generateSoftwareApplicationSchema } from '@/lib/structuredData';

const InventoryManagementHealthcare = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const publishedTime = '2024-01-15T00:00:00Z';
  const modifiedTime = new Date().toISOString();
  
  const expandedKeywords = [
    'healthcare inventory management',
    'medical inventory software',
    'hospital inventory system',
    'clinic inventory management',
    'medical supplies tracking',
    'healthcare stock control',
    'pharmaceutical inventory',
    'medical equipment tracking',
    'healthcare asset management',
    'medical supply chain',
    'hospital stock management',
    'healthcare WMS',
    'medical inventory tracking software',
    'healthcare inventory solutions',
    'medical supplies management system'
  ].join(', ');

  // FAQ data for structured data
  const faqData = [
    {
      question: 'What is healthcare inventory management software?',
      answer: 'Healthcare inventory management software helps hospitals, clinics, and medical facilities track medical supplies, equipment, and pharmaceuticals. It ensures compliance with regulations like FDA and HIPAA while preventing stockouts and managing expiry dates.'
    },
    {
      question: 'Why do healthcare facilities need specialized inventory software?',
      answer: 'Healthcare facilities require specialized inventory software because they need to track expiry dates, maintain regulatory compliance (FDA, HIPAA), manage batch/lot numbers, ensure patient safety, and prevent critical supply shortages that could impact patient care.'
    },
    {
      question: 'Can healthcare inventory software integrate with EHR systems?',
      answer: 'Many modern healthcare inventory management systems offer API integrations with Electronic Health Record (EHR) systems, allowing seamless data flow between inventory and patient care systems.'
    },
    {
      question: 'What features are essential for healthcare inventory management?',
      answer: 'Essential features include expiry date tracking, batch/lot tracking, regulatory compliance tools, automated reordering, barcode scanning, real-time alerts, integration with medical equipment, and detailed audit trails.'
    }
  ];

  // Structured data
  const structuredData = [
    generateFAQSchema(faqData),
    generateSoftwareApplicationSchema({
      name: 'StockFlow Healthcare Inventory Management',
      description: 'Specialized inventory management software for healthcare facilities, hospitals, and clinics. Track medical supplies, manage expiry dates, ensure compliance, and prevent stockouts.',
      category: 'Healthcare Software',
      operatingSystem: 'Web Browser',
      price: '0',
      currency: 'EUR',
      features: [
        'Expiry Date Tracking',
        'Batch/Lot Management',
        'HIPAA Compliance',
        'FDA Regulation Support',
        'Automated Reordering',
        'Medical Equipment Tracking',
        'Real-time Alerts',
        'Barcode Scanning'
      ],
      image: '/dashboard.png',
      url: 'https://www.stockflow.be/inventory-management-healthcare',
      rating: {
        value: '4.8',
        count: '150'
      }
    }),
    generateServiceSchema({
      name: 'Healthcare Inventory Management Service',
      description: 'Professional inventory management services for healthcare facilities',
      provider: 'StockFlow',
      areaServed: 'Worldwide',
      serviceType: 'Inventory Management',
      price: '0',
      currency: 'EUR'
    })
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Best Healthcare Inventory Management Software 2025 | Medical Supplies Tracking | StockFlow"
        description="Specialized healthcare inventory management software for hospitals, clinics, and medical facilities. Track medical supplies, manage expiry dates, ensure compliance (FDA, HIPAA), and prevent stockouts. Free trial available."
        keywords={expandedKeywords}
        url="https://www.stockflow.be/inventory-management-healthcare"
        locale="en"
        category="Healthcare"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-management-healthcare' }
        ]}
      />
      <StructuredData data={structuredData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Healthcare Inventory Management Software
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Specialized inventory management solutions for hospitals, clinics, and medical facilities. 
            Track medical supplies, manage expiry dates, ensure regulatory compliance, and prevent critical stockouts.
          </p>

          <TrustSignals variant="compact" className="mb-8" />

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Healthcare Facilities Need Specialized Inventory Management
            </h2>
            <p className="text-gray-700 mb-4">
              Healthcare inventory management presents unique challenges that generic inventory systems cannot address. 
              Medical facilities must track expiry dates, maintain regulatory compliance, manage batch numbers, and 
              ensure patient safety while preventing critical supply shortages.
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Regulatory Compliance:</strong> FDA, HIPAA, and other healthcare regulations require detailed tracking and audit trails</li>
              <li><strong>Expiry Date Management:</strong> Medical supplies and pharmaceuticals have critical expiry dates that must be tracked</li>
              <li><strong>Batch/Lot Tracking:</strong> For recalls and quality control, facilities must track products by batch or lot number</li>
              <li><strong>Patient Safety:</strong> Preventing stockouts of critical supplies directly impacts patient care</li>
              <li><strong>Cost Control:</strong> Healthcare facilities must optimize inventory to reduce waste while ensuring availability</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features for Healthcare Inventory Management
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Expiry Date Tracking</h3>
                <p className="text-gray-600">
                  Automated alerts for upcoming expirations, FIFO/FEFO inventory rotation, and automatic removal of expired items.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Batch & Lot Tracking</h3>
                <p className="text-gray-600">
                  Track medical supplies and pharmaceuticals by batch or lot number for recalls and quality control.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Regulatory Compliance</h3>
                <p className="text-gray-600">
                  Built-in support for FDA, HIPAA, and other healthcare regulations with detailed audit trails.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Automated Reordering</h3>
                <p className="text-gray-600">
                  Prevent stockouts with automated reorder points and purchase order generation for critical supplies.
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
            variant="hero"
            title="Start Managing Your Healthcare Inventory Today"
            description="Join leading healthcare facilities using StockFlow to streamline medical supply management and ensure compliance."
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
      </main>
    </div>
  );
};

export default InventoryManagementHealthcare;
