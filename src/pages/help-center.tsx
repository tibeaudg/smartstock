import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail,
  ChevronRight,
  Play,
  FileText,
  Users,
  Clock,
  Star
} from 'lucide-react';
import SEO from '@/components/SEO';

const categories = [
  {
    name: 'Getting Started',
    icon: <Play className="h-6 w-6" />,
    articles: 12,
    description: 'Learn the basics of StockFlow'
  },
  {
    name: 'Inventory Management',
    icon: <BookOpen className="h-6 w-6" />,
    articles: 25,
    description: 'Managing your stock and products'
  },
  {
    name: 'Mobile App',
    icon: <Users className="h-6 w-6" />,
    articles: 8,
    description: 'Using the StockFlow mobile app'
  },
  {
    name: 'Billing & Subscriptions',
    icon: <FileText className="h-6 w-6" />,
    articles: 6,
    description: 'Payment and subscription questions'
  },
  {
    name: 'Integrations',
    icon: <HelpCircle className="h-6 w-6" />,
    articles: 15,
    description: 'Connecting with other tools'
  },
  {
    name: 'Troubleshooting',
    icon: <MessageCircle className="h-6 w-6" />,
    articles: 18,
    description: 'Common issues and solutions'
  }
];

const popularArticles = [
  {
    title: 'How to set up your first inventory',
    category: 'Getting Started',
    readTime: '5 min',
    views: 1250
  },
  {
    title: 'Using barcode scanning effectively',
    category: 'Inventory Management',
    readTime: '3 min',
    views: 980
  },
  {
    title: 'Mobile app installation guide',
    category: 'Mobile App',
    readTime: '4 min',
    views: 750
  },
  {
    title: 'Understanding stock movements',
    category: 'Inventory Management',
    readTime: '6 min',
    views: 620
  },
  {
    title: 'Setting up user permissions',
    category: 'Getting Started',
    readTime: '7 min',
    views: 580
  }
];

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: <MessageCircle className="h-8 w-8" />,
    availability: 'Available 24/7',
    responseTime: '< 5 minutes'
  },
  {
    title: 'Email Support',
    description: 'Send us your questions via email',
    icon: <Mail className="h-8 w-8" />,
    availability: 'Business hours',
    responseTime: '< 24 hours'
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides',
    icon: <Video className="h-8 w-8" />,
    availability: 'Always available',
    responseTime: 'Instant access'
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Help Center - StockFlow",
    "description": "Get help with StockFlow inventory management. Find answers, tutorials, and contact support.",
    "url": "https://www.stockflowsystems.com/help-center",
    "mainEntity": {
      "@type": "HelpCenter",
      "name": "StockFlow Help Center"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Help Center - StockFlow"
        description="Get help with StockFlow inventory management. Find answers, tutorials, and contact our support team."
        keywords="help, support, documentation, tutorial, inventory management, FAQ"
        url="https://www.stockflowsystems.com/help-center"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How can we help?
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions, learn how to use StockFlow, and get support from our team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help articles, tutorials, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 placeholder-gray-500 border-0 rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Get Support</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-6">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {option.availability}
                  </div>
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 mr-2" />
                    {option.responseTime}
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Articles */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {article.views.toLocaleString()} views
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.articles} articles
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Browse Articles
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still need help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you succeed with StockFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Live Chat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="mr-2 h-5 w-5" />
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
