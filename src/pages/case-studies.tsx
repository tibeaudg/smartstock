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
    "url": "https://www.stockflow.be/case-studies",
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
        url="https://www.stockflow.be/case-studies"
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

      {/* Case Studies */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how companies across different industries are using StockFlow to streamline their operations and grow their business.
            </p>
          </div>

          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        {study.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{study.company}</h3>
                        <Badge variant="outline">{study.industry}</Badge>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Results</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">{study.results.timeSaved}</div>
                            <div className="text-sm text-gray-600">Time Saved</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{study.results.accuracy}</div>
                            <div className="text-sm text-gray-600">Accuracy</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{study.results.costReduction}</div>
                            <div className="text-sm text-gray-600">Cost Reduction</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600 mb-1">{study.results.growth}</div>
                            <div className="text-sm text-gray-600">Growth</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                      <CardContent className="p-8">
                        <Quote className="h-8 w-8 text-blue-600 mb-4" />
                        <blockquote className="text-lg text-gray-700 mb-6 italic">
                          "{study.testimonial}"
                        </blockquote>
                        <div className="flex items-center">
                          <div>
                            <div className="font-semibold text-gray-900">{study.author}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Card>
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
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Users className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
