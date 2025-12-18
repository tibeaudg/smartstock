import { SEO } from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function PrivacyPolicy() {
  usePageRefresh();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - StockFlow",
    "description": "Privacy Policy for StockFlow inventory management software. Learn how we protect your data and privacy.",
    "url": "https://www.stockflowsystems.com/privacy-policy",
    "mainEntity": {
      "@type": "Organization",
      "name": "StockFlow",
      "url": "https://www.stockflowsystems.com"
    }
  };

  return (
    <SeoPageLayout title="Privacy Policy">
      <SEO
        title="Privacy Policy 2025 - Privacy Policy 2025"
        description="Learn how privacy policy to choose the best software. Find out how privacy policy to save time and money.. Get started free. StockFlow helps businesses manag..."
        keywords="privacy policy, data protection, GDPR compliance, personal data, privacy rights, data security, inventory management privacy, stock management privacy, warehouse management privacy, data handling, privacy protection, user privacy, data privacy policy, information security, privacy rights, data collection, privacy compliance, privacy statement, data protection policy, privacy notice, user data protection, privacy regulations, data privacy rights, privacy protection measures, data security policy, privacy compliance, data handling policy, privacy information, data protection rights, privacy policy inventory management, stock management privacy policy, warehouse management privacy policy, inventory software privacy, stock software privacy, warehouse software privacy, business software privacy, inventory management data protection, stock management data protection, warehouse management data protection, inventory software data protection, stock software data protection, warehouse software data protection, business software data protection"
        url="https://www.stockflowsystems.com/privacy-policy"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Name and contact information (email address, phone number)</li>
              <li>Business information (company name, industry, business size)</li>
              <li>Account credentials and preferences</li>
              <li>Inventory and product data you input into our system</li>
              <li>Communication records and support requests</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Provide, maintain, and improve our inventory management services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-6">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete data</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
              <li>Withdrawal of consent</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar tracking technologies to enhance your experience on our website and application. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. International Data Transfers</h2>
            <p className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@stockflowsystems.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> StockFlow, Belgium</p>
              <p className="text-gray-700"><strong>Data Protection Officer:</strong> dpo@stockflowsystems.com</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
              <p className="text-blue-800">
                <strong>Note:</strong> This Privacy Policy is designed to comply with GDPR, CCPA, and other applicable privacy laws. 
                We are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>

          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}


