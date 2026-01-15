import { SEO } from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function TermsConditions() {
  

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions - StockFlow",
    "description": "Terms and Conditions for StockFlow inventory management software. Read our terms of service and user agreement.",
    "url": "https://www.stockflowsystems.com/terms-conditions",
    "mainEntity": {
      "@type": "Organization",
      "name": "StockFlow",
      "url": "https://www.stockflowsystems.com"
    }
  };

  return (
    <SeoPageLayout title="Terms & Conditions">
      <SEO
        title="Terms Conditions 2025 - Terms Conditions 2025"
        description="Find out how terms conditions to optimize your inventory management. Read the guide terms conditions to optimize your inventory management.. Join for Free today."
        keywords="terms and conditions, terms of service, user agreement, service terms, legal terms, terms of use, user conditions, service agreement, terms of service inventory management, stock management terms, warehouse management terms, inventory software terms, stock software terms, warehouse software terms, business software terms, inventory management agreement, stock management agreement, warehouse management agreement, inventory software agreement, stock software agreement, warehouse software agreement, business software agreement, terms of service business software, user agreement business software, service terms business software, legal terms business software, terms of use business software, user conditions business software, service agreement business software"
        url="https://www.stockflowsystems.com/terms-conditions"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms & <span className="text-blue-600">Conditions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please read these terms and conditions carefully before using our inventory management services.
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
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using StockFlow's inventory management services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
            <p className="text-gray-700 mb-6">
              StockFlow provides cloud-based inventory management software designed to help businesses track, manage, and optimize their inventory. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Real-time inventory tracking and management</li>
              <li>Barcode scanning and product identification</li>
              <li>Automated stock level monitoring</li>
              <li>Reporting and analytics tools</li>
              <li>Multi-location inventory management</li>
              <li>Integration with third-party systems</li>
              <li>Mobile application access</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts and Registration</h2>
            <p className="text-gray-700 mb-6">
              To access our services, you must create an account and provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-6">
              You agree to use our services only for lawful purposes and in accordance with these terms. You may not:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Transmit any viruses, malware, or harmful code</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Use the service to compete with StockFlow</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Data and Content Ownership</h2>
            <p className="text-gray-700 mb-6">
              You retain ownership of all data and content you upload to our service. By using our service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Store, process, and display your data as necessary to provide the service</li>
              <li>Create backups and ensure data security</li>
              <li>Improve our services through aggregated, anonymized analytics</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Payment Terms</h2>
            <p className="text-gray-700 mb-6">
              Our pricing is available on our website and may change with notice. Payment terms include:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Fees are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable unless otherwise specified</li>
              <li>We may change pricing with 30 days' notice</li>
              <li>Failure to pay may result in service suspension</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Service Availability</h2>
            <p className="text-gray-700 mb-6">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. We may:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Perform scheduled maintenance with advance notice</li>
              <li>Suspend service for security or technical reasons</li>
              <li>Modify or discontinue features with reasonable notice</li>
              <li>Not be liable for service interruptions beyond our control</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-6">
              StockFlow and its licensors own all rights, title, and interest in the service, including all intellectual property. You may not:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Copy, modify, or distribute our software</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks or branding without permission</li>
              <li>Create derivative works based on our service</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              To the maximum extent permitted by law, StockFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify and hold harmless StockFlow from any claims, damages, or expenses arising from your use of the service or violation of these terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Termination</h2>
            <p className="text-gray-700 mb-6">
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700">
              <li>Your access to the service will be suspended</li>
              <li>You may export your data for a limited period</li>
              <li>We may delete your data after the retention period</li>
              <li>Certain provisions will survive termination</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms shall be governed by and construed in accordance with Belgian law. Any disputes shall be resolved in the courts of Belgium.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or through the service. Continued use constitutes acceptance of the new terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">14. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have questions about these terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@stockflowsystems.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> StockFlow, Belgium</p>
              <p className="text-gray-700"><strong>Support:</strong> info@stockflow.be</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
              <p className="text-blue-800">
                <strong>Important:</strong> By using StockFlow's services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
              </p>
            </div>

          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}


