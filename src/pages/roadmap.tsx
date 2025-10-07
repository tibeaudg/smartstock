import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  Calendar,
  Zap,
  Users,
  BarChart3,
  Smartphone,
  Globe
} from 'lucide-react';
import SEO from '@/components/SEO';

const roadmapItems = [
  {
    status: 'completed',
    quarter: 'Q4 2024',
    title: 'Core Platform Launch',
    description: 'Basic inventory management with barcode scanning',
    features: [
      'Product management',
      'Barcode scanning',
      'Stock tracking',
      'Basic reporting',
      'Mobile app (iOS & Android)'
    ]
  },
  {
    status: 'in-progress',
    quarter: 'Q1 2025',
    title: 'Advanced Analytics',
    description: 'Enhanced reporting and business intelligence',
    features: [
      'Advanced analytics dashboard',
      'Sales forecasting',
      'Dead stock identification',
      'Custom reports',
      'Data export capabilities'
    ],
    progress: 60
  },
  {
    status: 'planned',
    quarter: 'Q2 2025',
    title: 'E-commerce Integration',
    description: 'Connect with popular e-commerce platforms',
    features: [
      'Shopify integration',
      'WooCommerce sync',
      'Amazon marketplace',
      'Multi-channel inventory',
      'Automated order processing'
    ],
    progress: 0
  },
  {
    status: 'planned',
    quarter: 'Q3 2025',
    title: 'AI-Powered Insights',
    description: 'Machine learning for inventory optimization',
    features: [
      'Demand forecasting',
      'Automated reorder points',
      'Price optimization',
      'Anomaly detection',
      'Predictive analytics'
    ],
    progress: 0
  },
  {
    status: 'planned',
    quarter: 'Q4 2025',
    title: 'Enterprise Features',
    description: 'Advanced features for large businesses',
    features: [
      'Multi-location management',
      'Advanced user permissions',
      'API access',
      'Custom integrations',
      'Enterprise support'
    ],
    progress: 0
  },
  {
    status: 'future',
    quarter: '2026+',
    title: 'Global Expansion',
    description: 'International features and partnerships',
    features: [
      'Multi-language support',
      'International shipping',
      'Global integrations',
      'Local partnerships',
      'Advanced compliance tools'
    ],
    progress: 0
  }
];

const statusConfig = {
  completed: {
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  'in-progress': {
    icon: <Clock className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  planned: {
    icon: <Calendar className="h-6 w-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  future: {
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  }
};

export default function RoadmapPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Product Roadmap - StockFlow",
    "description": "See what's coming next for StockFlow. Our roadmap includes advanced analytics, AI insights, and enterprise features.",
    "url": "https://www.stockflow.be/roadmap",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow Roadmap",
      "description": "Future development plans for inventory management platform"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Product Roadmap - StockFlow"
        description="See what's coming next for StockFlow. Advanced analytics, AI insights, e-commerce integrations, and enterprise features in our development roadmap."
        keywords="roadmap, product development, features, inventory management, AI, analytics, e-commerce integration"
        url="https://www.stockflow.be/roadmap"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Product Roadmap
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              See what's coming next for StockFlow. We're building the future of inventory management.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {roadmapItems.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              
              return (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index < roadmapItems.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-12 bg-gray-200"></div>
                  )}
                  
                  <Card className={`border-l-4 ${config.borderColor} ml-12`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${config.bgColor} ${config.color}`}>
                            {config.icon}
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {item.quarter}
                            </Badge>
                            <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                            <CardDescription className="text-lg">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={item.status === 'completed' ? 'default' : 'secondary'}
                            className={item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {item.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {item.progress > 0 && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {item.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className={`h-4 w-4 ${
                              item.status === 'completed' ? 'text-green-500' : 'text-gray-300'
                            }`} />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Request Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lightbulb className="h-16 w-16 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Have a Feature Request?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We'd love to hear your ideas! Help us prioritize features that matter most to your business.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <Users className="h-8 w-8 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Community Voting</h3>
              <p className="text-gray-600 mb-4">
                Vote on features and see what the community wants most
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </Card>
            
            <Card className="p-6">
              <Globe className="h-8 w-8 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Direct Feedback</h3>
              <p className="text-gray-600 mb-4">
                Send us your suggestions and feedback directly
              </p>
              <Badge variant="outline">Available</Badge>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Building the Future, One Feature at a Time
            </h2>
            <p className="text-xl text-blue-100">
              Our commitment to continuous improvement
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Features Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-blue-100">Months of Development</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">User Requests</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Development Team</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
