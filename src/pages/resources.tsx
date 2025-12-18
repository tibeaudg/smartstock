import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  TrendingUp,
  Calculator,
  HelpCircle,
  PlayCircle,
  BarChart3,
  ArrowRight,
  Building,
  ShoppingBag,
  Utensils,
  Truck,
  Clock,
  FileText,
  Users,
  MessageCircle,
  Download
} from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/HeaderPublic';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import VideoModal from '@/components/VideoModal';
import LeadMagnetDownload from '@/components/LeadMagnetDownload';
import { leadMagnets, LeadMagnet } from '@/data/leadMagnets';
import blogPosts from '@/lib/blogposts.json';

// Featured case studies for preview
const featuredCaseStudies = [
  {
    company: 'TechCorp Electronics',
    industry: 'Electronics Retail',
    metric: '15 hours saved per week',
    icon: <Building className="h-5 w-5" />
  },
  {
    company: 'FreshMarket Grocery',
    industry: 'Food & Beverage',
    metric: '40% reduction in waste',
    icon: <Utensils className="h-5 w-5" />
  },
  {
    company: 'Fashion Forward',
    industry: 'Fashion Retail',
    metric: '99.1% accuracy',
    icon: <ShoppingBag className="h-5 w-5" />
  }
];

// Popular comparisons
const popularComparisons = [
  {
    title: 'StockFlow vs Zoho Inventory',
    path: '/stockflow-vs-zoho-inventory',
    description: 'Compare features, pricing, and capabilities'
  },
  {
    title: 'StockFlow vs Cin7',
    path: '/stockflow-vs-cin7',
    description: 'See how we stack up against enterprise solutions'
  },
  {
    title: 'StockFlow vs Sortly',
    path: '/stockflow-vs-sortly',
    description: 'Feature-by-feature comparison'
  },
  {
    title: 'Compare All Software',
    path: '/compare-inventory-software',
    description: 'Comprehensive comparison guide'
  }
];

// Help center categories for preview
const helpCategories = [
  {
    name: 'Getting Started',
    articles: 12,
    icon: <PlayCircle className="h-5 w-5" />
  },
  {
    name: 'Inventory Management',
    articles: 25,
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    name: 'Mobile App',
    articles: 8,
    icon: <Users className="h-5 w-5" />
  }
];

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedLeadMagnet, setSelectedLeadMagnet] = useState<LeadMagnet | null>(null);
  const [isLeadMagnetModalOpen, setIsLeadMagnetModalOpen] = useState(false);

  // Get latest blog posts (first 3)
  const latestBlogPosts = blogPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime())
    .slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Resources - StockFlow",
    "description": "Access all StockFlow resources including blog articles, case studies, ROI calculator, knowledge base, product demos, and software comparisons.",
    "url": "https://www.stockflowsystems.com/resources",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Blog",
          "url": "https://www.stockflowsystems.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Case Studies",
          "url": "https://www.stockflowsystems.com/case-studies"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "ROI Calculator",
          "url": "https://www.stockflowsystems.com/resources#roi-calculator"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Knowledge Base",
          "url": "https://www.stockflowsystems.com/help-center"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Product Demo Videos",
          "url": "https://www.stockflowsystems.com/resources#demo-videos"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Comparison Pages",
          "url": "https://www.stockflowsystems.com/compare-inventory-software"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Resources - StockFlow | Blog, Case Studies, ROI Calculator & More"
        description="Access all StockFlow resources including blog articles, case studies, ROI calculator, knowledge base, product demo videos, and software comparisons."
        keywords="resources, blog, case studies, ROI calculator, knowledge base, demo videos, comparisons, inventory management resources"
        url="https://www.stockflowsystems.com/resources"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Resources Hub
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to learn, compare, and succeed with StockFlow. Explore our blog, case studies, calculators, guides, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Blog Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Blog</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Read articles, guides, and insights about inventory management
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  {latestBlogPosts.map((post, index) => (
                    <div key={post.id} className="border-l-2 border-blue-200 pl-3 py-2">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(post.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/blog">
                  <Button className="w-full" variant="default">
                    Browse All Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Case Studies Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Case Studies</CardTitle>
                </div>
                <CardDescription className="text-base">
                  See how businesses are succeeding with StockFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  {featuredCaseStudies.map((study, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-green-600 mt-0.5">
                        {study.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                          {study.company}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">{study.industry}</p>
                        <p className="text-xs text-green-600 font-medium">{study.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/case-studies">
                  <Button className="w-full" variant="default">
                    View All Case Studies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* ROI Calculator Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow" id="roi-calculator">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">ROI Calculator</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Calculate your potential savings with StockFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {!showCalculator ? (
                  <>
                    <div className="mb-6 flex-1">
                      <div className="bg-purple-50 rounded-lg p-6 text-center">
                        <Calculator className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-4">
                          Discover how much time and money StockFlow could save your business with our interactive calculator.
                        </p>
                        <ul className="text-left text-sm text-gray-600 space-y-2 mb-4">
                          <li className="flex items-center">
                            <span className="text-purple-600 mr-2">✓</span>
                            Calculate time savings
                          </li>
                          <li className="flex items-center">
                            <span className="text-purple-600 mr-2">✓</span>
                            Estimate cost reductions
                          </li>
                          <li className="flex items-center">
                            <span className="text-purple-600 mr-2">✓</span>
                            See annual ROI potential
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => setShowCalculator(true)}
                    >
                      Open Calculator
                      <Calculator className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="mb-4">
                    <SavingsCalculator />
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => setShowCalculator(false)}
                    >
                      Close Calculator
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Knowledge Base Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Knowledge Base</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Find answers, tutorials, and step-by-step guides
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  {helpCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-indigo-600">
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {category.name}
                          </h4>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {category.articles} articles
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link to="/help-center">
                  <Button className="w-full" variant="default">
                    Browse Knowledge Base
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Product Demo Videos Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow" id="demo-videos">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Demo Videos</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Watch product demos and tutorials
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video cursor-pointer group"
                       onClick={() => setIsVideoModalOpen(true)}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
                        <PlayCircle className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h4 className="text-white font-semibold text-sm mb-1">
                        StockFlow Product Demo
                      </h4>
                      <p className="text-white/80 text-xs">
                        See how StockFlow helps businesses manage inventory efficiently
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  Watch Demo Video
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Comparison Pages Resource Card */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Comparisons</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Compare StockFlow with other inventory software
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  {popularComparisons.map((comparison, index) => (
                    <Link 
                      key={index}
                      to={comparison.path}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">
                        {comparison.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {comparison.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link to="/compare-inventory-software">
                  <Button className="w-full" variant="default">
                    View All Comparisons
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Free Downloads / Lead Magnets Section */}
      <div className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Downloads
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant access to professional templates and checklists to streamline your inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadMagnets.map((magnet) => {
              const IconComponent = magnet.icon;
              return (
                <Card 
                  key={magnet.id} 
                  className="flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{magnet.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {magnet.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {magnet.points && magnet.points.length > 0 && (
                      <div className="mb-6 flex-1">
                        <ul className="space-y-2">
                          {magnet.points.slice(0, 3).map((point, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <span className="text-blue-600 mr-2 mt-0.5">✓</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => {
                        setSelectedLeadMagnet(magnet);
                        setIsLeadMagnetModalOpen(true);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Free
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Product Pages Section */}
      <div className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn More About StockFlow
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore features, pricing, solutions, and industry guides to understand how StockFlow can help your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Features Link */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Features</CardTitle>
                <CardDescription className="text-sm">
                  Complete feature overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/features" 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 group"
                >
                  View Features
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Link */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Pricing</CardTitle>
                <CardDescription className="text-sm">
                  Transparent pricing plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/pricing" 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 group"
                >
                  View Pricing
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            {/* Main Pillar Page */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Complete Guide</CardTitle>
                <CardDescription className="text-sm">
                  Inventory management guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/inventory-management-software" 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 group"
                >
                  Read Guide
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            {/* Solutions Hub */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Solutions</CardTitle>
                <CardDescription className="text-sm">
                  Solutions by use case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/solutions/inventory-management-software" 
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Software Solutions
                </Link>
                <Link 
                  to="/solutions/mobile-inventory-management" 
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Mobile Solutions
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Industry Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Industry</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/industries/contractor-inventory-management"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Contractors
              </Link>
              <Link 
                to="/warehouse-inventory-management"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Warehouses
              </Link>
              <Link 
                to="/industries/retail-inventory-management"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Retail
              </Link>
              <Link 
                to="/industries/medical-inventory-management"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Medical
              </Link>
              <Link 
                to="/industries/education-inventory-management"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Education
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore these resources and see how StockFlow can transform your inventory management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />

      {/* Lead Magnet Download Modal */}
      {selectedLeadMagnet && (
        <LeadMagnetDownload
          isOpen={isLeadMagnetModalOpen}
          onClose={() => {
            setIsLeadMagnetModalOpen(false);
            setSelectedLeadMagnet(null);
          }}
          leadMagnet={selectedLeadMagnet}
        />
      )}
    </div>
  );
}

