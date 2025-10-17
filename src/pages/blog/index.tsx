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
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const blogPosts = [
  {
    id: 'wine-expiry-tracking-without-spreadsheets',
    title: 'How to Track Wine Expiry Dates Without Spreadsheets',
    excerpt: 'Learn the 5-step process to set up automated wine expiry tracking that prevents losses and saves you thousands of euros annually.',
    author: 'StockFlow Team',
    date: '2024-12-19',
    readTime: '5 min read',
    category: 'Wine Shop Management',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
    tags: ['wine expiry', 'inventory tracking', 'loss prevention']
  },
  {
    id: '5-ways-wine-shops-lose-money',
    title: '5 Ways Wine Shops Lose Money on Inventory (And How to Fix It)',
    excerpt: 'Discover the most common inventory mistakes wine shops make and proven strategies to eliminate them.',
    author: 'StockFlow Team',
    date: '2024-12-18',
    readTime: '7 min read',
    category: 'Cost Optimization',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    tags: ['cost reduction', 'inventory mistakes', 'profit optimization']
  },
  {
    id: 'real-cost-dead-stock-wine-cellar',
    title: 'The Real Cost of Dead Stock in Your Wine Cellar',
    excerpt: 'Calculate how much capital is tied up in slow-moving wines and learn strategies to free up cash flow.',
    author: 'StockFlow Team',
    date: '2024-12-17',
    readTime: '6 min read',
    category: 'Dead Stock Management',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    tags: ['dead stock', 'cash flow', 'capital optimization']
  },
  {
    id: 'multi-location-wine-inventory-management',
    title: 'Multi-Location Wine Inventory: Storage vs. Retail Management',
    excerpt: 'Best practices for managing wine inventory across multiple locations including storage, retail, and tasting rooms.',
    author: 'StockFlow Team',
    date: '2024-12-16',
    readTime: '8 min read',
    category: 'Multi-Location',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
    tags: ['multi-location', 'storage management', 'retail operations']
  },
  {
    id: 'wine-supplier-management-best-practices',
    title: 'Best Practices for Wine Supplier Management',
    excerpt: 'Build stronger relationships with wine suppliers and optimize your purchasing decisions with these proven strategies.',
    author: 'StockFlow Team',
    date: '2024-12-15',
    readTime: '9 min read',
    category: 'Supplier Management',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
    tags: ['supplier relationships', 'purchasing', 'wine sourcing']
  }
];

const categories = [
  { name: 'All', count: 5 },
  { name: 'Wine Shop Management', count: 1 },
  { name: 'Cost Optimization', count: 1 },
  { name: 'Dead Stock Management', count: 1 },
  { name: 'Multi-Location', count: 1 },
  { name: 'Supplier Management', count: 1 }
];

export default function BlogIndex() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "StockFlow Blog",
    "description": "Expert insights on inventory management for wine shops and specialty beverage retailers",
    "url": "https://www.stockflow.be/blog",
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="StockFlow Blog | Wine Shop Inventory Management Tips"
        description="Expert insights on wine shop inventory management, dead stock optimization, and preventing expired wine losses. Learn from industry experts."
        keywords="wine shop blog, inventory management tips, wine expiry tracking, dead stock reduction, wine shop optimization"
        url="https://www.stockflow.be/blog"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Wine Shop <span className="text-yellow-300">Inventory Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Expert insights on wine shop inventory management, dead stock optimization, 
              and preventing expired wine losses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 text-red-900 hover:bg-yellow-400">
                <Wine className="mr-2 h-5 w-5" />
                Subscribe to Updates
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-900">
                <ArrowRight className="mr-2 h-5 w-5" />
                Browse Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge 
                key={category.name}
                variant="outline" 
                className="px-4 py-2 cursor-pointer hover:bg-red-50 hover:border-red-200"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8">
                <Badge className="mb-4 bg-red-100 text-red-800">
                  {blogPosts[0].category}
                </Badge>
                <CardTitle className="text-2xl mb-4">{blogPosts[0].title}</CardTitle>
                <CardDescription className="text-lg mb-6">
                  {blogPosts[0].excerpt}
                </CardDescription>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                <Link to={`/blog/${blogPosts[0].id}`}>
                  <Button>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-gray-800">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-900">Stay Updated</CardTitle>
            <CardDescription className="text-red-700">
              Get the latest wine shop inventory management tips delivered to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Button className="bg-red-600 hover:bg-red-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-red-600 mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}