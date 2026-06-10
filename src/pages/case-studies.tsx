import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Star,
  ArrowRight,
  Quote,
  Building,
  ShoppingBag,
  Utensils,
  Truck
} from 'lucide-react';
import SEO from '@/components/SEO';

const caseStudies = [
  {
    company: 'TechCorp Electronics',
    industry: 'Electronics Retail',
    icon: <Building className="h-8 w-8" />,
    challenge: 'Managing inventory across 5 locations with outdated spreadsheets',
    solution: 'Implemented StockFlow with barcode scanning and real-time sync',
    results: {
      timeSaved: '15 hours per week',
      accuracy: '99.2% inventory accuracy',
      costReduction: '30% reduction in stockouts',
      growth: '25% increase in sales'
    },
    testimonial: 'StockFlow transformed how we manage inventory. We went from chaotic spreadsheets to a streamlined system that actually works.',
    author: 'Sarah Johnson, Operations Manager',
    image: '/api/placeholder/400/300'
  },
  {
    company: 'FreshMarket Grocery',
    industry: 'Food & Beverage',
    icon: <Utensils className="h-8 w-8" />,
    challenge: 'Reducing food waste and improving freshness tracking',
    solution: 'Used StockFlow to track expiration dates and optimize ordering',
    results: {
      timeSaved: '8 hours per week',
      accuracy: '98.5% accuracy in expiration tracking',
      costReduction: '40% reduction in food waste',
      growth: '15% increase in profit margins'
    },
    testimonial: 'The expiration date tracking feature alone has saved us thousands in reduced waste. StockFlow pays for itself.',
    author: 'Mike Chen, Store Manager',
    image: '/api/placeholder/400/300'
  },
  {
    company: 'Fashion Forward',
    industry: 'Fashion Retail',
    icon: <ShoppingBag className="h-8 w-8" />,
    challenge: 'Managing seasonal inventory and size variations',
    solution: 'StockFlow with variant tracking and seasonal analytics',
    results: {
      timeSaved: '12 hours per week',
      accuracy: '99.1% accuracy in size tracking',
      costReduction: '35% reduction in overstock',
      growth: '20% increase in inventory turnover'
    },
    testimonial: 'Finally, a system that understands fashion retail. The variant tracking is a game-changer for our business.',
    author: 'Emma Rodriguez, Inventory Coordinator',
    image: '/api/placeholder/400/300'
  },
  {
    company: 'Logistics Plus',
    industry: 'Logistics & Distribution',
    icon: <Truck className="h-8 w-8" />,
    challenge: 'Coordinating inventory across multiple warehouses',
    solution: 'Multi-location management with real-time visibility',
    results: {
      timeSaved: '20 hours per week',
      accuracy: '99.5% cross-location accuracy',
      costReduction: '25% reduction in shipping errors',
      growth: '30% increase in order fulfillment speed'
    },
    testimonial: 'StockFlow gave us complete visibility across all our warehouses. We can now serve customers faster and more accurately.',
    author: 'David Kim, Operations Director',
    image: '/api/placeholder/400/300'
  }
];

const stats = [
  {
    value: '500+',
    label: 'Companies Using StockFlow',
    icon: <Building className="h-8 w-8" />
  },
  {
    value: '15,000+',
    label: 'Products Managed Daily',
    icon: <Package className="h-8 w-8" />
  },
  {
    value: '99.2%',
    label: 'Average Accuracy Rate',
    icon: <TrendingUp className="h-8 w-8" />
  },
  {
    value: '40%',
    label: 'Average Time Saved',
    icon: <Users className="h-8 w-8" />
  }
];

export default function CaseStudiesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Case Studies - StockFlow",
    "description": "See how businesses are using StockFlow to improve inventory management and increase efficiency.",
    "url": "https://www.stockflowsystems.com/case-studies",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": caseStudies.map((study, index) => ({
        "@type": "Article",
        "position": index + 1,
        "headline": study.company + " Case Study",
        "description": study.challenge
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Case Studies - StockFlow"
        description="See how businesses are using StockFlow to improve inventory management. Real success stories from electronics, retail, food, and logistics companies."
        keywords="case studies, success stories, inventory management, business results, ROI, testimonials"
        url="https://www.stockflowsystems.com/case-studies"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              See how businesses are transforming their operations with StockFlow. Real results from real companies.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join These Success Stories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your transformation today with StockFlow's powerful inventory management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Join for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
