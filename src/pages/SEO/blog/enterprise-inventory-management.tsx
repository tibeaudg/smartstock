import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Users,
  ShieldCheck,
  Globe,
  Zap,
  Lock,
  Headphones,
  Smartphone,
  FileSpreadsheet,
  Database,
  CheckCircle
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function EnterpriseInventorySoftwarePage() {
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
      question: 'How does inventory software handle large teams of 12+ users?',
      answer:
        'Enterprise-grade inventory software like StockFlow utilizes role-based access control (RBAC). This allows administrators to grant specific permissions to different user tiers—such as warehouse staff, field technicians, and regional managers—ensuring data security while enabling real-time collaboration across the entire organization.',
    },
    {
      question: 'Is your inventory data secure and compliant?',
      answer:
        'Yes. For large teams and enterprises, StockFlow adheres to SOC 2 and GDPR standards. We also support Single Sign-On (SSO) technology, allowing your IT department to manage user access through your existing corporate authentication provider for enhanced security.',
    },
    {
      question: 'Can we migrate existing data from spreadsheets or legacy ERPs?',
      answer:
        'Absolutely. We provide dedicated data migration assistance. Our enterprise onboarding team helps you clean, format, and import your existing inventory data into StockFlow to ensure a seamless transition without operational downtime.',
    },
    {
      question: 'How do you train large teams on new inventory software?',
      answer:
        'We offer customized training sessions and a dedicated Account Manager for teams of 12 or more. These sessions are tailored to your specific workflows, ensuring that everyone from field employees to executives can use the system effectively from day one.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Enterprise Inventory Management Software for Large Teams',
    description:
      'Scalable inventory tracking for teams of 12+. Featuring SSO, SOC 2 compliance, and dedicated account management for large-scale operations.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Enterprise Edition',
      description:
        'High-capacity inventory management platform designed for large-scale organizations requiring advanced security and multi-user collaboration.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Single Sign-On (SSO)',
        'SOC 2 & GDPR Compliance',
        'Unlimited Multi-Location Tracking',
        'Dedicated Account Management',
        'Custom Role-Based Permissions',
        'Advanced Data Migration Support',
      ],
      image: 'https://www.stockflowsystems.com/enterprise-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Users,
      title: 'Scalable Team Collaboration',
      description: 'Built for teams of 12 to 1,000+. Real-time syncing ensures every user sees the same data across all devices.',
    },
    {
      icon: Lock,
      title: 'Enterprise-Grade Security',
      description: 'Authenticated by SSO and fully compliant with SOC 2 and GDPR standards to meet strict corporate IT requirements.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Onboarding',
      description: 'Get a dedicated Account Manager to handle custom setup, data migration, and personalized team training sessions.',
    },
    {
      icon: Globe,
      title: 'Multi-Location View',
      description: 'Gain an instant, real-time birds-eye view of your entire inventory across global warehouses and branch offices.',
    },
    {
      icon: FileSpreadsheet,
      title: 'End-to-End Management',
      description: 'Generate purchase orders and invoices directly from inventory data to streamline your supply chain.',
    },
    {
      icon: Smartphone,
      title: 'Cross-Device Syncing',
      description: 'Field teams use mobile apps while office teams use desktops—all feeding into one unified data set.',
    },
  ];

  const keyTakeaways = [
    'Role-based permissions prevent unauthorized data changes in large-scale environments.',
    'SSO integration simplifies user management for IT departments and enhances security.',
    'Dedicated support ensures high adoption rates across diverse teams and departments.',
    'StockFlow Enterprise scales with your growth, supporting thousands of assets and hundreds of users.',
  ];

  return (
    <SeoPageLayout
      title="Enterprise Inventory Management Software for Large Teams"
      heroTitle="Inventory Solutions Built for Massive Scale"
      updatedDate="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Enterprise Inventory Software 2026 | Large Team Tracking | StockFlow"
        description="Scalable inventory management for large teams. SOC 2 compliant, SSO enabled, and dedicated support for organizations with 12+ users."
        keywords="enterprise inventory software, large team inventory tracking, sso inventory management, soc 2 compliant inventory, multi-user inventory system"
        url="https://www.stockflowsystems.com/enterprise-inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Inventory Management for the Modern Enterprise</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            As organizations grow, the complexity of managing assets and stock increases exponentially. <strong>Enterprise inventory software</strong> is no longer just about counting items; it's about <strong>security, compliance, and large-scale collaboration</strong>. StockFlow enables teams of 12 or more to operate from a single source of truth.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Managing thousands of items across <strong>multiple global locations</strong> requires a system that is as robust as it is intuitive. Our enterprise platform bridges the gap between high-level executive reporting and on-the-ground mobile execution, ensuring total visibility at every tier of the organization.
          </p>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Built for Corporate Security and IT Standards</h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6 text-gray-600 leading-relaxed">
              <p>
                In an enterprise environment, data security is non-negotiable. StockFlow Enterprise is <strong>SOC 2 Type II and GDPR compliant</strong>, ensuring your inventory data is handled with the highest level of care.
              </p>
              <p>
                We integrate seamlessly with your existing IT stack through <strong>Single Sign-On (SSO)</strong>. This allows your team to log in using their existing corporate credentials, reducing password fatigue and giving your IT department centralized control over user access.
              </p>
              <p>
                Our <strong>Role-Based Access Control (RBAC)</strong> allows you to define exactly what each user can see and do. Whether it's "Read-Only" access for auditors or "Super Admin" rights for regional directors, you have total control over your data landscape.
              </p>
            </div>
            <div className="flex-1 bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <ShieldCheck className="w-16 h-16 text-blue-600 mb-6" />
              <h4 className="font-bold text-blue-900 mb-4 text-xl">The Enterprise Security Suite</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
                  <span>SAML 2.0 / Okta / Azure AD SSO</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
                  <span>SOC 2 Type II Certified</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
                  <span>End-to-End Data Encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
                  <span>Full User Activity Audit Logs</span>
                </li>
              </ul>
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

      {/* Deep Dive: Dedicated Onboarding */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">White-Glove Support for Large Teams</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Implementation is the most critical phase of enterprise software adoption. <strong>StockFlow Enterprise</strong> includes a white-glove onboarding experience to guarantee success.
              </p>
              <div className="flex gap-4 items-start">
                <Database className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Expert Data Migration:</strong> Our engineers help transition your messy legacy data into a clean, structured digital catalog.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Zap className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Custom Workflow Design:</strong> We work with your department heads to map StockFlow to your existing business processes.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Enterprise Service Agreement</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Priority 24/7 Technical Support</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Quarterly Business Reviews</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Unlimited Team Training Sessions</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> API Access for Custom ERP Sync</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scale/Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by 15,000+ Scalable Organizations</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Regional Management</h4>
              <p className="text-sm text-gray-600">Coordinate inventory across 50+ locations with centralized visibility and regional admin tiers.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Field Service Operations</h4>
              <p className="text-sm text-gray-600">Equip hundreds of technicians with mobile tools that feed instantly into a central audit trail.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Gov & Infrastructure</h4>
              <p className="text-sm text-gray-600">Maintain strict SOC 2 compliance while tracking high-value assets across state or federal agencies.</p>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}