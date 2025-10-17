import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wine, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Smartphone,
  Building,
  Shield
} from 'lucide-react';
import SEO from '@/components/SEO';
import LeadMagnet from '@/components/LeadMagnet';

export default function WineShopGuide() {
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);

  const guideFeatures = [
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Expiry Date Management",
      description: "Learn how to set up automated alerts for wines approaching expiry dates"
    },
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Dead Stock Identification",
      description: "Discover the 5-step process to identify and liquidate slow-moving inventory"
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Multi-Location Management",
      description: "Best practices for managing inventory across storage, retail, and tasting rooms"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Capital Optimization",
      description: "Calculate how much capital is tied up in inventory and strategies to free it up"
    }
  ];

  const caseStudies = [
    {
      shop: "Vinoteca Brussels",
      location: "Brussels, Belgium",
      results: "40% reduction in dead stock",
      savings: "€12,000 annual savings",
      quote: "StockFlow helped us identify €12,000 worth of slow-moving inventory we didn't even know we had."
    },
    {
      shop: "Wijnhuis Amsterdam",
      location: "Amsterdam, Netherlands", 
      results: "Zero expired wine losses",
      savings: "€8,500 saved annually",
      quote: "The expiry tracking feature alone paid for itself in the first month."
    },
    {
      shop: "Cave à Vins Liège",
      location: "Liège, Belgium",
      results: "60% faster inventory counts",
      savings: "€6,000 in labor savings",
      quote: "We went from spending 8 hours on inventory to just 3 hours with barcode scanning."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Wine Shop Owner's Guide to Reducing Dead Stock by 40%",
    "description": "A comprehensive guide for wine shop owners to optimize inventory, reduce dead stock, and prevent expired wine losses.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    },
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Free Wine Shop Inventory Guide | Reduce Dead Stock by 40%"
        description="Download our comprehensive guide for wine shop owners. Learn to reduce dead stock by 40%, prevent expired wine losses, and optimize inventory management."
        keywords="wine shop guide, dead stock reduction, wine inventory management, expired wine prevention, wine shop optimization"
        url="https://www.stockflow.be/resources/wine-shop-guide"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-yellow-500 text-red-900">
                Free Download
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                The Wine Shop Owner's Guide to <span className="text-yellow-300">Reducing Dead Stock by 40%</span>
              </h1>
              <p className="text-xl text-red-100 mb-8 leading-relaxed">
                A comprehensive 15-page guide covering everything wine shop owners need to know about 
                inventory optimization, dead stock reduction, and preventing expired wine losses.
              </p>
              <Button 
                onClick={() => setShowLeadMagnet(true)}
                size="lg" 
                className="bg-yellow-500 text-red-900 hover:bg-yellow-400 text-lg px-8 py-4"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Free Guide
              </Button>
              <p className="text-sm text-red-200 mt-4">No email required • Instant download</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-2xl">
                <Wine className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">15-Page PDF Guide</h3>
                <p className="text-gray-600 mb-4">Everything you need to optimize your wine shop inventory</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Expiry date management strategies
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    5-step dead stock liquidation process
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-location inventory best practices
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real case studies from successful wine shops
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What's Inside the Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A comprehensive resource covering all aspects of wine shop inventory management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guideFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Real Results from Wine Shops
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how wine shops across Belgium and Netherlands have transformed their inventory management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-lg">{study.shop}</CardTitle>
                      <CardDescription>{study.location}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {study.results}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{study.savings}</div>
                      <div className="text-sm text-green-700">Annual Savings</div>
                    </div>
                    <blockquote className="text-sm text-gray-600 italic">
                      "{study.quote}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-red-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Wine Shop Inventory?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Download your free guide and start reducing dead stock today.
          </p>
          <Button 
            onClick={() => setShowLeadMagnet(true)}
            size="lg" 
            className="bg-yellow-500 text-red-900 hover:bg-yellow-400 text-lg px-8 py-4"
          >
            <Download className="mr-2 h-5 w-5" />
            Get Your Free Guide
          </Button>
          <p className="text-sm text-red-200 mt-4">
            Join 500+ wine shop owners who have already downloaded this guide
          </p>
        </div>
      </section>

      {/* Lead Magnet Modal */}
      <LeadMagnet 
        isOpen={showLeadMagnet}
        onClose={() => setShowLeadMagnet(false)}
      />
    </div>
  );
}
