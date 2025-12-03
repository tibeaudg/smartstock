import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { 
  Utensils, 
  Hotel, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Package,
  ArrowRight
} from 'lucide-react';

export default function InventoryForHospitality() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is inventory management for hospitality?",
      answer: "Inventory management for hospitality involves tracking, monitoring, and optimizing food & beverage (F&B) inventory, supplies, and equipment for restaurants, hotels, cafes, and catering businesses. It includes managing perishable items, tracking consumption, calculating food costs, managing suppliers, and ensuring optimal stock levels to prevent waste and shortages."
    },
    {
      question: "Why do hospitality businesses need inventory software?",
      answer: "Hospitality businesses need inventory software to reduce food waste (which can cost 10-20% of food costs), improve profit margins through better cost control, prevent stockouts that impact customer service, optimize purchasing decisions, track food costs accurately, manage multiple locations, and comply with food safety regulations."
    },
    {
      question: "How does hospitality inventory management work?",
      answer: "Hospitality inventory management works by tracking ingredients and supplies in real-time, calculating recipe costs, monitoring consumption patterns, setting automatic reorder points (PAR levels), managing supplier relationships, tracking waste and spoilage, and providing insights into food costs and margins. StockFlow provides specialized features for hospitality including recipe management, cost analysis, and mobile stocktaking."
    },
    {
      question: "Can inventory software help with food cost control?",
      answer: "Yes! Inventory software like StockFlow helps hospitality businesses control food costs by tracking actual vs. theoretical consumption, identifying waste patterns, calculating accurate recipe costs, monitoring supplier pricing, setting cost targets, and providing real-time food cost reports. This helps maintain healthy profit margins in a low-margin industry."
    },
    {
      question: "Does hospitality inventory software work for multiple locations?",
      answer: "Yes, StockFlow supports multi-location inventory management, perfect for restaurant chains, hotel groups, or catering businesses with multiple venues. You can manage inventory across all locations from one dashboard, compare performance between locations, and optimize stock levels at each site."
    },
    {
      question: "What features are essential for hospitality inventory management?",
      answer: "Essential features include: real-time stock tracking, recipe and menu engineering, food cost calculation, automatic reorder points (PAR levels), supplier management, mobile stocktaking apps, waste and spoilage tracking, multi-location support, expiration date tracking, and integration with POS systems. StockFlow provides all these features tailored for hospitality businesses."
    }
  ];

  const features = [
    {
      icon: Utensils,
      title: "Recipe & Menu Engineering",
      description: "Calculate accurate food costs per recipe, optimize menu pricing, and track ingredient usage across all menu items."
    },
    {
      icon: BarChart3,
      title: "Food Cost Analysis",
      description: "Monitor actual vs. theoretical food costs, identify waste patterns, and maintain healthy profit margins."
    },
    {
      icon: Zap,
      title: "Automatic Reorder Points",
      description: "Set PAR levels for each ingredient. Get automatic alerts when stock is low and generate purchase orders."
    },
    {
      icon: Package,
      title: "Multi-Location Management",
      description: "Manage inventory across multiple restaurants, hotel kitchens, or catering locations from one system."
    },
    {
      icon: Clock,
      title: "Expiration Tracking",
      description: "Track expiration dates, reduce waste, and ensure food safety compliance with FIFO (First In, First Out) management."
    },
    {
      icon: TrendingUp,
      title: "Waste & Spoilage Analysis",
      description: "Identify waste patterns, track spoilage costs, and optimize purchasing to reduce food waste."
    }
  ];

  const benefits = [
    "Reduce food waste by 20-30%",
    "Improve profit margins through better cost control",
    "Prevent stockouts that impact customer service",
    "Save 10+ hours weekly on inventory tasks",
    "Track food costs accurately in real-time",
    "Manage multiple locations efficiently",
    "Automate supplier ordering",
    "Ensure food safety compliance"
  ];

  const useCases = [
    { name: "Restaurants", description: "Track ingredients, calculate recipe costs, and manage kitchen inventory" },
    { name: "Hotels", description: "Manage F&B inventory across restaurants, bars, and room service" },
    { name: "Cafes & Bakeries", description: "Track coffee, pastries, and supplies with expiration date management" },
    { name: "Catering Businesses", description: "Manage inventory for events, track consumption, and optimize purchasing" },
    { name: "Bars & Pubs", description: "Track beverages, manage bar inventory, and monitor pour costs" },
    { name: "Food Trucks", description: "Mobile inventory management for food trucks and pop-up locations" }
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "StockFlow - Hospitality Inventory Management",
      "description": "Specialized inventory management software for hospitality businesses. Track F&B inventory, calculate food costs, manage recipes, and optimize stock levels for restaurants, hotels, and catering businesses.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "softwareVersion": "2.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free plan - up to 100 products",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Recipe and menu engineering",
        "Food cost calculation",
        "Automatic reorder points (PAR levels)",
        "Multi-location management",
        "Mobile stocktaking",
        "Waste and spoilage tracking",
        "Supplier management",
        "Expiration date tracking"
      ],
      "url": "https://www.stockflow.be/inventory-for-hospitality"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Inventory for Hospitality",
          "item": "https://www.stockflow.be/inventory-for-hospitality"
        }
      ]
    }
  ];

  return (
    <SeoPageLayout 
      title="Inventory for Hospitality"
      heroTitle="Inventory for Hospitality"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Hospitality Inventory Management 2025 | F&B Software | StockFlow"
        description="Specialized hospitality inventory management reduces food waste 20-30%, improves profit margins, and streamlines F&B operations. Track ingredients, calculate food costs, manage recipes, and optimize stock levels for restaurants, hotels, and catering."
        keywords="hospitality inventory, hotel stock management, restaurant inventory, hospitality supply chain, food cost management, restaurant inventory software, hotel inventory management, catering inventory, hospitality inventory system, F&B inventory, hospitality stock control, restaurant stock management, food and beverage inventory, hospitality inventory software"
        url="https://www.stockflow.be/inventory-for-hospitality"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-for-hospitality' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-horeca' }
        ]}
        structuredData={structuredData}
      />

      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-center">
            Inventory Management for Hospitality
          </h1>
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              <strong>Inventory management for hospitality</strong> involves tracking, monitoring, and optimizing food & beverage (F&B) inventory, supplies, and equipment for restaurants, hotels, cafes, and catering businesses. Specialized <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> helps hospitality businesses reduce food waste by 20-30%, improve profit margins through better cost control, and streamline operations. Learn more about <Link to="/higher-education-inventory-management" className="text-blue-600 hover:underline font-semibold">industry-specific inventory solutions</Link>.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hospitality Inventory Management <span className="text-blue-600">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Hospitality Inventory Management</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for <span className="text-blue-600">All Hospitality Businesses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow's hospitality inventory management works for all types of food and beverage businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{useCase.name}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>




      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}

