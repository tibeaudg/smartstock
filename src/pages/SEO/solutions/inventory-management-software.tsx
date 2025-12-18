import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';
import {
  BarChart3,
  Zap,
  Shield,
  Users,
  Camera,
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  Target,
  Package,
  AlertCircle,
  DollarSign,
  ChevronDown,
  Building
} from 'lucide-react';
import { englishMainCluster, getRelatedPages } from '@/config/topicClusters';

import { StructuredData } from '@/components/StructuredData';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { 
  CaseStudySection, 
  ProprietaryMetrics, 
  RealCustomerResults,
  getRelevantCaseStudies,
  getRelevantTestimonials,
  getProprietaryMetrics
} from '@/components/seo/EnhancedContent';
export default function InventoryManagementSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const { formatPrice } = useCurrency();
  const location = useLocation();

  // Get related pages from topic cluster
  const relatedPages = getRelatedPages('/inventory-management-software', 6);

  // Get real customer data
  const relevantCaseStudies = getRelevantCaseStudies('inventory management software');
  const relevantTestimonials = getRelevantTestimonials('inventory');
  const metrics = getProprietaryMetrics('inventory management software');

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What industries are best suited for specific types of inventory management solutions?",
      answer: "Retailers and e-commerce brands benefit from omnichannel inventory software that integrates with online marketplaces and POS systems. Manufacturers need solutions with bill of materials (BOM) tracking and production planning. Wholesale distributors require advanced order management, warehouse routing, and B2B portal capabilities. Food & beverage and health & beauty industries often need batch tracking, expiry date control, and regulatory compliance features. Service businesses may prefer simpler asset tracking solutions, while growing businesses need scalable software that can grow with them. StockFlow is designed to work across multiple industries, with features that adapt to different business models and requirements."
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Optimize Your Cashflow",
      description: "Prevent excess inventory and dead stock. Get precise insight into what you need, when you need it.",
    },
    {
      icon: Zap,
      title: "Save Time and Reduce Errors",
      description: "Automate orders and minimize manual counts. Focus on growth, not administration.",
    },
    {
      icon: Users,
      title: "Seamless Team Collaboration",
      description: "Work efficiently with your team thanks to clear user roles and real-time data updates.",
    },
    {
      icon: Shield,
      title: "Safe and Always Available",
      description: "Your data is safe in the cloud. Always and everywhere accessible, with daily backups.",
    },
  ];

  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const benefits = [
    "No hidden costs or commitments",
    "Start immediately, no installation required",
    "User-friendly mobile interface",
    "Real-time synchronization between devices",
    "Automatic low stock notifications",
    "Barcode scanning functionality",
    "Professional reporting and analytics",
    "24/7 access from anywhere"
  ];

  const useCases = [
    {
      title: "Medical Device Distributors",
      description: "Track medical devices with FDA compliance, serial number tracing, expiration date management, and regulatory reporting. Perfect for independent distributors managing sensitive inventory with strict traceability requirements.",
      icon: "ðŸ›’"
    },
    {
      title: "Event & AV Production",
      description: "Manage AV equipment, lighting, sound systems, and staging across multiple events and venues. Real-time scheduling prevents double-booking and ensures equipment availability when needed.",
      icon: "ðŸª"
    },
    {
      title: "Rental Businesses",
      description: "Optimize rental inventory for machinery, party equipment, tools, and high-value assets. Track rental periods, maintenance schedules, availability, and prevent revenue loss from unreturned items.",
      icon: "ðŸ“¦"
    },
    {
      title: "Multi-Location Operations",
      description: "Essential for businesses managing inventory across warehouses, distribution centers, and multiple locations. Real-time visibility and automated transfers ensure optimal stock distribution.",
      icon: "ðŸ­"
    }
  ];

  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager, TechStore",
      content: "StockFlow transformed our inventory management. We went from manual tracking to 95% automation in just 2 weeks.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Owner, Fashion Forward",
      content: "The barcode scanning feature alone saved us 3 hours per day. Our inventory accuracy improved from 85% to 99%.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Warehouse Manager, AutoParts Plus",
      content: "Real-time visibility into our inventory levels helped us reduce stockouts by 80% and improve customer satisfaction.",
      rating: 5
    }
  ];

  // Potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const steps = [
    {
      step: "1",
      title: "Connect Your Data",
      description: "Import your existing inventory data or start fresh. Our inventory management software works with any business size."
    },
    {
      step: "2",
      title: "Set Up Automation",
      description: "Configure automatic reorder points and notifications. Let the software handle routine inventory decisions."
    },
    {
      step: "3",
      title: "Train Your Team",
      description: "Get your team up and running quickly with our intuitive interface and comprehensive training resources."
    },
    {
      step: "4",
      title: "Optimize & Scale",
      description: "Use analytics to optimize your inventory levels and scale your operations as your business grows."
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management Software for Medical Device Distributors, Event Companies & Rental Businesses"
    heroTitle="Inventory Management Software for Medical Device Distributors, Event Companies & Rental Businesses"
    updatedDate="3/12/2025"
    faqData={faqData}
    >
      <SEO
        title="Inventory Software for Medical, Event & Rental | StockFlow"
        description="Specialized inventory software for medical device distributors, event companies & rental businesses. Compliance tracking, equipment scheduling. Free plan available."
        keywords="inventory management software for medical device distributors, medical device inventory tracking, AV equipment inventory management, rental business inventory software, event production inventory, medical device compliance tracking, AV equipment scheduling, rental inventory management, party equipment tracking, machinery rental software, medical device distributor software, event company inventory, rental business software, stockflow, inventory tracking software"
        url="https://www.stockflowsystems.com/solutions/inventory-management-software"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/voorraadbeheer-software' }
        ]}
      />

      {/* Proprietary Metrics */}
      <ProprietaryMetrics 
        metrics={{
          customerCount: metrics.customerCount,
          averageTimeSaved: metrics.averageTimeSaved,
          averageCostSaved: metrics.averageCostSaved,
          keyMetric: metrics.keyMetric,
          feature: "Inventory Management Software"
        }}
      />

      {/* Enhanced Introduction Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Inventory Management Software for Medical Device Distributors, Event Companies & Rental Businesses</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>Inventory management software</strong> is essential for three critical business verticals: <strong>Independent Medical Device Distributors</strong> managing FDA compliance and traceability, <strong>Local Event & AV Production Companies</strong> tracking equipment across multiple venues and events, and <strong>Rental Businesses</strong> (machinery, party equipment, etc.) scheduling and managing high-value assets. Based on data from {metrics.customerCount} businesses, StockFlow customers average {metrics.averageTimeSaved || '6 hours per week'} in time savings. Unlike manual methods like Excel spreadsheets or paper-based systems, modern <strong>inventory management software</strong> provides up-to-the-minute visibility into inventory levels, automates reordering processes, and helps prevent costly stockouts or overstock situations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              For medical device distributors, this software ensures regulatory compliance with serial number tracking and expiration date management. Event and AV production companies rely on it for equipment scheduling, multi-location tracking, and preventing double-booking. Rental businesses use it to optimize asset utilization, track maintenance schedules, and manage rental periods. StockFlow's specialized <strong>inventory management software</strong> provides comprehensive analytics, demand forecasting, and automated replenishment capabilities tailored to these unique operational needs. One hardware store chain saved €12,000 annually by implementing StockFlow across 3 locations.
            </p>
          </div>
        </div>
      </section>





      {/* Real Customer Results */}
      {relevantTestimonials.length > 0 && (
        <RealCustomerResults 
          testimonials={relevantTestimonials}
          variant="grid"
          maxItems={3}
        />
      )}

      {/* Use Cases Section */}
      <section className="py-16 px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Inventory Management Software Built for Your Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow's <strong>inventory management software</strong> is specifically designed for <strong>Medical Device Distributors</strong> requiring compliance tracking, <strong>Event & AV Production Companies</strong> managing equipment across venues, and <strong>Rental Businesses</strong> optimizing asset utilization. {metrics.customerCount} businesses trust StockFlow for strategic inventory optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {relevantCaseStudies.length > 0 && (
        <CaseStudySection 
          caseStudy={relevantCaseStudies[0]}
          variant="highlighted"
        />
      )}






      {/* Schema.org Structured Data */}
      <StructuredData data={generateSeoPageStructuredData({
        title: "Inventory Management Software - StockFlow",
        description: "#1 Inventory Management Software 2025. FREE plan (100 SKUs), real-time tracking, barcode scanning. 5-7 day setup. Trusted by 1,000+ businesses.",
        url: location.pathname,
        breadcrumbs: getBreadcrumbPath(location.pathname).map((item, index) => ({
          name: item.name,
          url: item.path,
          position: index + 1
        })),
        faqData: faqData,
        softwareData: {
          name: "StockFlow - Inventory Management Software",
          description: "#1 Inventory Management Software 2025. FREE plan (100 SKUs), real-time tracking, barcode scanning. 5-7 day setup. Trusted by 1,000+ businesses.",
          category: "BusinessApplication",
          operatingSystem: "Web Browser",
          price: "0",
          currency: "EUR",
          features: [
            "Real-time inventory tracking",
            "Barcode scanning",
            "Automated reorder points",
            "Multi-location support",
            "Advanced analytics",
            "Mobile access",
            "Team collaboration",
            "Integration capabilities"
          ],
          image: [
            "/Inventory-Management.png",
            "/optimized/desktop.png"
          ],
          screenshot: "/optimized/desktop.png",
          url: location.pathname,
          offers: [
            {
              price: "0",
              priceCurrency: "EUR",
              description: "Free plan - 100% free inventory management for SMEs",
              availability: "https://schema.org/InStock",
              validFrom: "2024-01-01"
            },
            {
              price: "29",
              priceCurrency: "EUR",
              description: "Growth plan - Advanced features for growing businesses",
              availability: "https://schema.org/InStock",
              validFrom: "2024-01-01"
            }
          ]
        },
        pageType: 'software',
        includeBreadcrumbs: false // Breadcrumbs are already in SeoPageLayout
      })} />
    </SeoPageLayout>
  );
}


