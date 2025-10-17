import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Wine,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  DollarSign,
  Building,
  Smartphone,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

export default function WineExpiryTrackingWithoutSpreadsheets() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Track Wine Expiry Dates Without Spreadsheets",
    "description": "Learn the 5-step process to set up automated wine expiry tracking that prevents losses and saves you thousands of euros annually.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow Team"
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
    "dateModified": "2024-12-19",
    "image": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&h=630&fit=crop"
  };

  const steps = [
    {
      step: 1,
      title: "Audit Your Current Wine Inventory",
      description: "Start by cataloging all wines with their purchase dates and expected shelf life",
      details: [
        "Create a complete list of all wines in your inventory",
        "Record purchase dates and supplier information",
        "Research and document expected shelf life for each wine type",
        "Identify wines that are already approaching expiry"
      ],
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      step: 2,
      title: "Set Up Expiry Date Tracking System",
      description: "Implement a digital system to track expiry dates and send automated alerts",
      details: [
        "Choose an inventory management system with expiry tracking",
        "Set up automated alerts for wines approaching expiry",
        "Configure different alert periods (30, 60, 90 days before expiry)",
        "Test the system with a few wines to ensure accuracy"
      ],
      icon: <Calendar className="h-8 w-8" />
    },
    {
      step: 3,
      title: "Create Expiry Date Categories",
      description: "Organize wines by expiry urgency to prioritize sales efforts",
      details: [
        "Create categories: 'Expiring Soon' (within 30 days), 'Approaching Expiry' (30-60 days), 'Safe' (60+ days)",
        "Color-code or tag wines based on their expiry status",
        "Set up different alert frequencies for each category",
        "Train staff to recognize and act on expiry alerts"
      ],
      icon: <AlertTriangle className="h-8 w-8" />
    },
    {
      step: 4,
      title: "Implement Sales Strategies for Expiring Wines",
      description: "Develop proactive strategies to move wines before they expire",
      details: [
        "Create special promotions for wines approaching expiry",
        "Offer wine tastings featuring expiring wines",
        "Bundle expiring wines with popular items",
        "Train staff to recommend expiring wines to customers"
      ],
      icon: <TrendingDown className="h-8 w-8" />
    },
    {
      step: 5,
      title: "Monitor and Optimize Your System",
      description: "Regularly review and improve your expiry tracking system",
      details: [
        "Track metrics: wines sold before expiry vs. expired",
        "Analyze which wines consistently expire and adjust purchasing",
        "Review and update expiry date estimates based on actual performance",
        "Celebrate successes and learn from any losses"
      ],
      icon: <CheckCircle className="h-8 w-8" />
    }
  ];

  const benefits = [
    {
      title: "Prevent Expired Wine Losses",
      description: "Stop losing money on wines that go bad before selling",
      savings: "€5,000-15,000 annually",
      icon: <DollarSign className="h-6 w-6 text-green-500" />
    },
    {
      title: "Improve Cash Flow",
      description: "Turn slow-moving inventory into cash faster",
      savings: "25% faster inventory turnover",
      icon: <TrendingDown className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Reduce Manual Work",
      description: "Automate expiry tracking instead of manual spreadsheet updates",
      savings: "5+ hours per week saved",
      icon: <Clock className="h-6 w-6 text-purple-500" />
    },
    {
      title: "Better Customer Experience",
      description: "Always offer fresh wines to your customers",
      savings: "Higher customer satisfaction",
      icon: <Wine className="h-6 w-6 text-red-500" />
    }
  ];

  const caseStudy = {
    shop: "Vinoteca Brussels",
    location: "Brussels, Belgium",
    problem: "Losing €8,000 annually on expired wines",
    solution: "Implemented automated expiry tracking with StockFlow",
    results: [
      "Zero expired wine losses in 6 months",
      "€8,000 annual savings",
      "25% increase in wine sales",
      "3 hours per week saved on manual tracking"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="How to Track Wine Expiry Dates Without Spreadsheets | StockFlow Blog"
        description="Learn the 5-step process to set up automated wine expiry tracking that prevents losses and saves you thousands of euros annually."
        keywords="wine expiry tracking, wine inventory management, expired wine prevention, wine shop optimization, automated alerts"
        url="https://www.stockflow.be/blog/wine-expiry-tracking-without-spreadsheets"
        structuredData={structuredData}
      />

      {/* Article Header */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Badge className="mb-4 bg-yellow-500 text-red-900">
              Wine Shop Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How to Track Wine Expiry Dates Without Spreadsheets
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Learn the 5-step process to set up automated wine expiry tracking that prevents losses 
              and saves you thousands of euros annually.
            </p>
            <div className="flex items-center gap-6 text-sm text-red-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                StockFlow Team
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                December 19, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=400&fit=crop" 
              alt="Wine shop inventory management"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <p className="text-lg text-gray-700 mb-6">
            Wine shops face a unique challenge: unlike most retail products, wine has a limited shelf life. 
            When wines expire or go bad, they represent a complete loss of inventory investment. 
            Traditional spreadsheet-based tracking is time-consuming, error-prone, and often fails to prevent losses.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            In this guide, we'll show you how to implement an automated wine expiry tracking system 
            that prevents losses and saves you thousands of euros annually.
          </p>

          {/* The Problem Section */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4">The Hidden Cost of Expired Wine</h2>
            <p className="text-red-800 mb-4">
              Wine shops lose an average of €8,000-15,000 annually on expired wines. This happens because:
            </p>
            <ul className="list-disc list-inside text-red-800 space-y-2">
              <li>Manual tracking in spreadsheets is time-consuming and error-prone</li>
              <li>Staff forget to check expiry dates regularly</li>
              <li>No automated alerts when wines are approaching expiry</li>
              <li>Poor visibility into which wines are at risk</li>
            </ul>
          </div>

          {/* The Solution Steps */}
          <h2 className="text-3xl font-bold mb-8">The 5-Step Solution</h2>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-red-600 text-white">Step {step.step}</Badge>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-green-50 rounded-lg p-8 my-12">
            <h2 className="text-2xl font-bold text-green-900 mb-6">Expected Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">{benefit.title}</h3>
                    <p className="text-green-800 mb-2">{benefit.description}</p>
                    <div className="text-sm font-semibold text-green-700">{benefit.savings}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study */}
          <div className="bg-gray-50 rounded-lg p-8 my-12">
            <h2 className="text-2xl font-bold mb-6">Real Results: Vinoteca Brussels</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{caseStudy.shop}</h3>
                <p className="text-gray-600 mb-4">{caseStudy.location}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">Problem:</h4>
                    <p className="text-gray-700">{caseStudy.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">Solution:</h4>
                    <p className="text-gray-700">{caseStudy.solution}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Results:</h4>
                <ul className="space-y-2">
                  {caseStudy.results.map((result, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-red-900 text-white rounded-lg p-8 my-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Stop Losing Money on Expired Wine?</h2>
            <p className="text-red-100 mb-6">
              StockFlow's automated expiry tracking can help you prevent wine losses and save thousands annually.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-yellow-500 text-red-900 hover:bg-yellow-400">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/wine-shop-inventory-management">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-900">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5 Ways Wine Shops Lose Money on Inventory</CardTitle>
                <CardDescription>
                  Discover the most common inventory mistakes wine shops make and proven strategies to eliminate them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog/5-ways-wine-shops-lose-money">
                  <Button variant="outline" size="sm">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">The Real Cost of Dead Stock in Your Wine Cellar</CardTitle>
                <CardDescription>
                  Calculate how much capital is tied up in slow-moving wines and learn strategies to free up cash flow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog/real-cost-dead-stock-wine-cellar">
                  <Button variant="outline" size="sm">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
