import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitCommit, 
  Star, 
  Bug, 
  Zap, 
  Plus,
  ArrowRight,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import SEO from '@/components/SEO';

const changelogEntries = [
  {
    version: '2.1.0',
    date: '2024-12-15',
    type: 'major',
    highlights: [
      'Advanced analytics dashboard with real-time insights',
      'AI-powered demand forecasting',
      'Multi-location inventory management'
    ],
    features: [
      {
        title: 'Advanced Analytics Dashboard',
        description: 'New comprehensive analytics with sales trends, inventory turnover, and performance metrics',
        type: 'feature'
      },
      {
        title: 'AI Demand Forecasting',
        description: 'Machine learning algorithms predict future demand based on historical data',
        type: 'feature'
      },
      {
        title: 'Multi-Location Support',
        description: 'Manage inventory across multiple warehouses and locations',
        type: 'feature'
      },
      {
        title: 'Bulk Import/Export',
        description: 'Import and export large datasets with improved CSV handling',
        type: 'improvement'
      }
    ],
    fixes: [
      'Fixed barcode scanning issues on iOS devices',
      'Resolved sync conflicts in offline mode',
      'Improved performance for large product catalogs'
    ]
  },
  {
    version: '2.0.5',
    date: '2024-11-28',
    type: 'patch',
    highlights: [
      'Bug fixes and performance improvements',
      'Enhanced mobile app stability',
      'Improved data synchronization'
    ],
    features: [
      {
        title: 'Enhanced Mobile Sync',
        description: 'Improved synchronization between mobile app and web platform',
        type: 'improvement'
      },
      {
        title: 'Better Error Handling',
        description: 'More descriptive error messages and better user feedback',
        type: 'improvement'
      }
    ],
    fixes: [
      'Fixed crash when scanning damaged barcodes',
      'Resolved inventory count discrepancies',
      'Fixed login issues on some Android devices',
      'Improved app startup time by 30%'
    ]
  },
  {
    version: '2.0.0',
    date: '2024-11-01',
    type: 'major',
    highlights: [
      'Complete UI redesign with modern interface',
      'Real-time collaboration features',
      'Advanced reporting and analytics'
    ],
    features: [
      {
        title: 'New User Interface',
        description: 'Completely redesigned interface with improved usability and accessibility',
        type: 'feature'
      },
      {
        title: 'Real-time Collaboration',
        description: 'Multiple users can work simultaneously with live updates',
        type: 'feature'
      },
      {
        title: 'Advanced Reporting',
        description: 'New reporting engine with customizable dashboards',
        type: 'feature'
      },
      {
        title: 'API v2',
        description: 'New RESTful API with improved performance and documentation',
        type: 'feature'
      }
    ],
    fixes: [
      'Migrated to new database architecture',
      'Improved search functionality',
      'Enhanced mobile responsiveness'
    ]
  },
  {
    version: '1.8.2',
    date: '2024-10-15',
    type: 'minor',
    highlights: [
      'New barcode generation features',
      'Improved inventory tracking',
      'Enhanced user permissions'
    ],
    features: [
      {
        title: 'Barcode Generation',
        description: 'Generate custom barcodes for products without existing codes',
        type: 'feature'
      },
      {
        title: 'Enhanced Permissions',
        description: 'Granular user permissions with role-based access control',
        type: 'feature'
      },
      {
        title: 'Inventory Alerts',
        description: 'Automated alerts for low stock and expiration dates',
        type: 'feature'
      }
    ],
    fixes: [
      'Fixed data export formatting issues',
      'Resolved sync problems with slow internet connections',
      'Improved barcode scanning accuracy'
    ]
  },
  {
    version: '1.8.0',
    date: '2024-09-20',
    type: 'minor',
    highlights: [
      'Mobile app improvements',
      'New integration options',
      'Performance optimizations'
    ],
    features: [
      {
        title: 'Offline Mode',
        description: 'Work without internet connection with automatic sync when online',
        type: 'feature'
      },
      {
        title: 'Stripe Integration',
        description: 'Direct integration with Stripe for payment processing',
        type: 'feature'
      },
      {
        title: 'Bulk Operations',
        description: 'Perform bulk actions on products and inventory',
        type: 'feature'
      }
    ],
    fixes: [
      'Fixed memory leaks in mobile app',
      'Improved data validation',
      'Enhanced security measures'
    ]
  }
];

const typeConfig = {
  major: {
    icon: <Star className="h-5 w-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Major Release'
  },
  minor: {
    icon: <Plus className="h-5 w-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Minor Release'
  },
  patch: {
    icon: <Bug className="h-5 w-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Patch Release'
  }
};

const featureTypeConfig = {
  feature: {
    icon: <Zap className="h-4 w-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'New Feature'
  },
  improvement: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Improvement'
  },
  fix: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Bug Fix'
  }
};

export default function ChangelogPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Changelog - StockFlow",
    "description": "See what's new in StockFlow. Track updates, new features, and improvements to our inventory management platform.",
    "url": "https://www.stockflow.be/changelog",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow Changelog",
      "description": "Version history and release notes"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Changelog - StockFlow"
        description="Stay updated with the latest StockFlow releases. New features, improvements, and bug fixes in our inventory management platform."
        keywords="changelog, release notes, updates, new features, bug fixes, version history"
        url="https://www.stockflow.be/changelog"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GitCommit className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Changelog
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Stay up to date with the latest improvements, new features, and fixes in StockFlow.
            </p>
          </div>
        </div>
      </div>

      {/* RSS Feed Info */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Want to stay updated? 
            <Button variant="link" className="ml-2">
              Subscribe to our RSS feed
            </Button>
          </p>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {changelogEntries.map((entry, index) => {
              const typeInfo = typeConfig[entry.type as keyof typeof typeConfig];
              
              return (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${typeInfo.bgColor} ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">v{entry.version}</CardTitle>
                          <CardDescription className="text-lg">
                            <Badge variant="outline" className="mr-2">
                              {typeInfo.label}
                            </Badge>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    {/* Highlights */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Highlights</h3>
                      <ul className="space-y-2">
                        {entry.highlights.map((highlight, highlightIndex) => (
                          <li key={highlightIndex} className="flex items-center text-gray-700">
                            <Star className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Features */}
                    {entry.features && entry.features.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Features & Improvements</h3>
                        <div className="space-y-4">
                          {entry.features.map((feature, featureIndex) => {
                            const featureTypeInfo = featureTypeConfig[feature.type as keyof typeof featureTypeConfig];
                            return (
                              <div key={featureIndex} className="flex items-start space-x-3">
                                <div className={`p-1 rounded-full ${featureTypeInfo.bgColor} ${featureTypeInfo.color} mt-1`}>
                                  {featureTypeInfo.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                                  <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fixes */}
                    {entry.fixes && entry.fixes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Bug Fixes</h3>
                        <ul className="space-y-2">
                          {entry.fixes.map((fix, fixIndex) => (
                            <li key={fixIndex} className="flex items-center text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                              {fix}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get notified about new releases, features, and improvements
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Users className="mr-2 h-5 w-5" />
              Join Our Community
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <ArrowRight className="mr-2 h-5 w-5" />
              Follow on Twitter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
