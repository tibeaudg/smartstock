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
  Package,
  TrendingUp,
  BookOpen,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import HeaderPublic from '@/components/HeaderPublic';
import Footer from '@/components/Footer';
const blogPosts = [
  {
    id: 'inventory-management',
    title: 'Inventory Management: Definition, Methods, Benefits & Best Practices',
    excerpt: 'Comprehensive guide to inventory management: what it is, why it matters, core methods (JIT, MRP, EOQ, DSI), accounting, KPIs, and practical examples.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '15 min read',
    category: 'Core Guides',
    tags: ['inventory management', 'inventory methods', 'best practices']
  },
  {
    id: 'warehouse-management',
    title: 'Warehouse Management System Guide',
    excerpt: 'Complete guide to warehouse management systems, processes, and best practices for optimizing warehouse operations.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '12 min read',
    category: 'Core Guides',
    tags: ['warehouse', 'WMS', 'operations']
  },
  {
    id: 'asset-tracking',
    title: 'Asset Tracking: Complete Guide',
    excerpt: 'Learn how to implement asset tracking systems to monitor equipment, tools, and valuable assets across your organization.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '10 min read',
    category: 'Core Guides',
    tags: ['asset tracking', 'equipment', 'monitoring']
  },
  {
    id: 'electrical-inventory-management',
    title: 'Electrical Inventory Management for Contractors',
    excerpt: 'Track materials across job sites, service vehicles, and warehouses. Reduce theft, eliminate stockouts, and improve job costing.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '12 min read',
    category: 'Industry Solutions',
    tags: ['electrical', 'contractors', 'job costing']
  },
  {
    id: 'medical-inventory-management',
    title: 'Medical Inventory Management for Healthcare',
    excerpt: 'Track medical supplies with expiration dates, lot numbers, and regulatory compliance. Reduce waste and ensure patient safety.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '13 min read',
    category: 'Industry Solutions',
    tags: ['medical', 'healthcare', 'compliance']
  },
  {
    id: 'warehouse-inventory-management',
    title: 'Warehouse Inventory Management & Optimization',
    excerpt: 'Optimize warehouse operations with bin location tracking, mobile scanning, and pick optimization. Increase accuracy to 99%+.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '14 min read',
    category: 'Industry Solutions',
    tags: ['warehouse', 'optimization', 'operations']
  },
  {
    id: 'interior-design-inventory-management',
    title: 'Interior Design Inventory Management',
    excerpt: 'Visually manage furniture, fabrics, and accessories across client projects with project-based tracking and supplier management.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '11 min read',
    category: 'Industry Solutions',
    tags: ['interior design', 'project management', 'visual catalogs']
  },
  {
    id: 'education-inventory-management',
    title: 'School Inventory Management for Education',
    excerpt: 'Track textbooks, technology, and equipment. Reduce loss by 85% and optimize budgets with check-out systems and asset tracking.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '12 min read',
    category: 'Industry Solutions',
    tags: ['education', 'schools', 'asset tracking']
  },
  {
    id: 'contractor-inventory-management',
    title: 'Contractor Inventory Management',
    excerpt: 'Manage tools, materials, and equipment across multiple job sites. Track inventory by project and reduce losses.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '11 min read',
    category: 'Industry Solutions',
    tags: ['construction', 'contractors', 'job sites']
  },
  {
    id: 'ecommerce-inventory-management',
    title: 'E-commerce Inventory Management',
    excerpt: 'Sync inventory across multiple sales channels, automate reordering, and prevent overselling with real-time tracking.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '10 min read',
    category: 'Industry Solutions',
    tags: ['ecommerce', 'online retail', 'multi-channel']
  },
  {
    id: 'retail-inventory-management',
    title: 'Retail Inventory Management',
    excerpt: 'Optimize retail inventory with POS integration, demand forecasting, and multi-location tracking for brick-and-mortar stores.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '11 min read',
    category: 'Industry Solutions',
    tags: ['retail', 'POS', 'stores']
  },
  {
    id: 'barcode-scanning-inventory',
    title: 'Barcode Scanning for Inventory Management',
    excerpt: 'Implement barcode scanning to improve accuracy, speed up operations, and eliminate manual data entry errors.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '9 min read',
    category: 'Features & Technology',
    tags: ['barcode', 'scanning', 'automation']
  },
  {
    id: 'cycle-count',
    title: 'Cycle Counting: Best Practices',
    excerpt: 'Master cycle counting techniques to maintain inventory accuracy without disruptive full physical counts.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '8 min read',
    category: 'Features & Technology',
    tags: ['cycle counting', 'accuracy', 'audits']
  },
  {
    id: 'just-in-time-inventory',
    title: 'Just-in-Time Inventory Management',
    excerpt: 'Learn how JIT inventory management reduces holding costs and improves cash flow with lean inventory practices.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '10 min read',
    category: 'Methods & Strategies',
    tags: ['JIT', 'lean', 'optimization']
  },
  {
    id: 'economic-order-quantity',
    title: 'Economic Order Quantity (EOQ) Guide',
    excerpt: 'Calculate optimal order quantities to minimize total inventory costs using the EOQ formula and best practices.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '9 min read',
    category: 'Methods & Strategies',
    tags: ['EOQ', 'ordering', 'cost optimization']
  },
  {
    id: 'safety-stock',
    title: 'Safety Stock Calculation & Management',
    excerpt: 'Calculate and maintain optimal safety stock levels to prevent stockouts while minimizing excess inventory.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '8 min read',
    category: 'Methods & Strategies',
    tags: ['safety stock', 'buffer stock', 'planning']
  },
  {
    id: 'inventory-turnover',
    title: 'Inventory Turnover Ratio: Complete Guide',
    excerpt: 'Understand and improve your inventory turnover ratio to optimize cash flow and reduce carrying costs.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '10 min read',
    category: 'KPIs & Metrics',
    tags: ['turnover', 'KPIs', 'metrics']
  },
  {
    id: 'what-is-lead-time',
    title: 'Lead Time: Definition & Optimization',
    excerpt: 'Learn about lead time in supply chain management and strategies to reduce it for faster fulfillment.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '8 min read',
    category: 'KPIs & Metrics',
    tags: ['lead time', 'supply chain', 'optimization']
  },
  {
    id: 'bill-of-materials',
    title: 'Bill of Materials (BOM) Management',
    excerpt: 'Create and manage bills of materials for manufacturing, kitting, and assembly operations.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '9 min read',
    category: 'Manufacturing',
    tags: ['BOM', 'manufacturing', 'production']
  },
  {
    id: 'shopify-inventory-management',
    title: 'Shopify Inventory Management Integration',
    excerpt: 'Sync inventory between StockFlow and Shopify for real-time multi-channel inventory management.',
    author: 'StockFlow Team',
    date: '2025-11-06',
    readTime: '7 min read',
    category: 'Integrations',
    tags: ['Shopify', 'integration', 'ecommerce']
  }
];

const categories = [
  { name: 'All', count: 20 },
  { name: 'Core Guides', count: 3 },
  { name: 'Industry Solutions', count: 7 },
  { name: 'Features & Technology', count: 2 },
  { name: 'Methods & Strategies', count: 3 },
  { name: 'KPIs & Metrics', count: 2 },
  { name: 'Manufacturing', count: 1 },
  { name: 'Integrations', count: 1 }
];

export default function BlogIndex() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "StockFlow Blog",
    "description": "Expert insights on inventory management, warehouse optimization, and industry-specific best practices",
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
        title="StockFlow Blog | Inventory Management Insights & Best Practices"
        description="Expert insights on inventory management, warehouse optimization, industry-specific solutions, and operational best practices. Learn from industry experts."
        keywords="inventory management blog, warehouse optimization, inventory best practices, supply chain management, inventory solutions"
        url="https://www.stockflow.be/blog"
        structuredData={structuredData}
      />

      <HeaderPublic />  

      {/* Hero Section */}
      <div className="pt-40 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Inventory Management <span className="text-blue-300">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert guides on inventory management, warehouse optimization, and industry-specific 
              best practices to help your business grow.
            </p>
      
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Featured Post */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          <Card className="overflow-hidden">
            <div className="p-8">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
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
              <Link to={`/${blogPosts[0].id}`}>
                <Button>
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {post.category}
                    </Badge>
                  </div>
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
                    <Link to={`/${post.id}`}>
                      <Button variant="secondary" size="sm">
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
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Stay Updated</CardTitle>
            <CardDescription className="text-blue-700">
              Get the latest inventory management insights and best practices delivered to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}