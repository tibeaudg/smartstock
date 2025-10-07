import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  BookOpen, 
  Key, 
  Zap, 
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Terminal,
  Globe,
  Database
} from 'lucide-react';
import SEO from '@/components/SEO';

const endpoints = [
  {
    method: 'GET',
    path: '/api/products',
    description: 'Retrieve all products',
    parameters: ['page', 'limit', 'category'],
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.stockflow.be/products'
  },
  {
    method: 'POST',
    path: '/api/products',
    description: 'Create a new product',
    parameters: ['name', 'sku', 'price', 'category'],
    example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"name":"Product Name","sku":"SKU123"}\' https://api.stockflow.be/products'
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    description: 'Retrieve a specific product',
    parameters: ['id'],
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.stockflow.be/products/123'
  },
  {
    method: 'PUT',
    path: '/api/products/{id}',
    description: 'Update a product',
    parameters: ['id', 'name', 'sku', 'price', 'category'],
    example: 'curl -X PUT -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"name":"Updated Name"}\' https://api.stockflow.be/products/123'
  },
  {
    method: 'GET',
    path: '/api/inventory',
    description: 'Get inventory levels',
    parameters: ['product_id', 'location'],
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.stockflow.be/inventory?product_id=123'
  },
  {
    method: 'POST',
    path: '/api/inventory/adjust',
    description: 'Adjust inventory levels',
    parameters: ['product_id', 'quantity', 'reason', 'location'],
    example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"product_id":123,"quantity":10,"reason":"stock_adjustment"}\' https://api.stockflow.be/inventory/adjust'
  }
];

const sdkLanguages = [
  {
    name: 'JavaScript/Node.js',
    icon: '🟨',
    description: 'Official Node.js SDK',
    install: 'npm install @stockflow/sdk',
    example: `const StockFlow = require('@stockflow/sdk');
const client = new StockFlow({ apiKey: 'your-api-key' });

const products = await client.products.list();`
  },
  {
    name: 'Python',
    icon: '🐍',
    description: 'Python SDK for data analysis',
    install: 'pip install stockflow-sdk',
    example: `import stockflow

client = stockflow.Client(api_key='your-api-key')
products = client.products.list()`
  },
  {
    name: 'PHP',
    icon: '🐘',
    description: 'PHP SDK for web applications',
    install: 'composer require stockflow/sdk',
    example: `use StockFlow\\Client;

$client = new Client(['api_key' => 'your-api-key']);
$products = $client->products->list();`
  },
  {
    name: 'cURL',
    icon: '🌐',
    description: 'Direct HTTP requests',
    install: 'Built into most systems',
    example: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.stockflow.be/products`
  }
];

const webhooks = [
  {
    event: 'product.created',
    description: 'Triggered when a new product is created',
    payload: {
      id: '123',
      name: 'New Product',
      sku: 'SKU123',
      created_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    event: 'inventory.low_stock',
    description: 'Triggered when inventory falls below threshold',
    payload: {
      product_id: '123',
      current_quantity: 5,
      threshold: 10,
      location: 'warehouse-1'
    }
  },
  {
    event: 'order.created',
    description: 'Triggered when a new order is created',
    payload: {
      order_id: '456',
      product_id: '123',
      quantity: 2,
      total: 99.98
    }
  }
];

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "API Documentation - StockFlow",
    "description": "Complete API documentation for StockFlow inventory management platform. RESTful APIs, SDKs, and webhooks.",
    "url": "https://www.stockflow.be/api-docs",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow API",
      "description": "RESTful API for inventory management"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="API Documentation - StockFlow"
        description="Complete API documentation for StockFlow. RESTful APIs, SDKs for multiple languages, webhooks, and integration guides."
        keywords="API, documentation, SDK, webhooks, integration, REST API, inventory management API"
        url="https://www.stockflow.be/api-docs"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Code className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              API Documentation
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Build powerful integrations with StockFlow's comprehensive REST API. Get started in minutes with our SDKs and documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Key className="mr-2 h-5 w-5" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <ExternalLink className="mr-2 h-5 w-5" />
                API Explorer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
            <p className="text-xl text-gray-600">Get up and running in 5 minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Key className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">1. Get API Key</h3>
              <p className="text-gray-600">Sign up and generate your API key from the dashboard</p>
            </Card>
            <Card className="text-center p-6">
              <Code className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">2. Make Request</h3>
              <p className="text-gray-600">Use our REST API or SDK to access your data</p>
            </Card>
            <Card className="text-center p-6">
              <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-3">3. Build Integration</h3>
              <p className="text-gray-600">Connect with your existing tools and workflows</p>
            </Card>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">API Endpoints</h2>
          
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 
                                endpoint.method === 'POST' ? 'secondary' : 'outline'}
                        className={endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                                   endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : ''}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                  </div>
                  <CardDescription className="text-lg">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Parameters:</h4>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <Badge key={paramIndex} variant="outline">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Example:</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                        >
                          {copiedCode === `example-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* SDKs */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Software Development Kits</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {sdkLanguages.map((sdk, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{sdk.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{sdk.name}</CardTitle>
                      <CardDescription>{sdk.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Installation:</h4>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                        {sdk.install}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Example:</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(sdk.example, `sdk-${index}`)}
                        >
                          {copiedCode === `sdk-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{sdk.example}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Webhooks</h2>
          
          <div className="space-y-6">
            {webhooks.map((webhook, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono">
                      {webhook.event}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">
                    {webhook.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Payload:</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(webhook.payload, null, 2), `webhook-${index}`)}
                    >
                      {copiedCode === `webhook-${index}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(webhook.payload, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need More Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore our additional resources and get support for your integration
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Integration Guides</h3>
                <p className="text-blue-100 text-sm mb-4">Step-by-step tutorials for popular platforms</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Guides
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Terminal className="h-8 w-8 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Code Examples</h3>
                <p className="text-blue-100 text-sm mb-4">Real-world examples and sample code</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Browse Examples
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">API Status</h3>
                <p className="text-blue-100 text-sm mb-4">Monitor API health and performance</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Check Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
