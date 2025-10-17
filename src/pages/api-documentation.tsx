import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Key, 
  Database, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  Globe,
  Smartphone,
  Server
} from 'lucide-react';
import SEO from '@/components/SEO';

export default function APIDocumentation() {
  const [activeTab, setActiveTab] = useState('overview');

  const endpoints = [
    {
      method: 'GET',
      path: '/api/products',
      description: 'Retrieve all products',
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Number of products to return (max 100)' },
        { name: 'offset', type: 'integer', required: false, description: 'Number of products to skip' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category' }
      ],
      response: {
        status: 200,
        data: {
          products: [
            {
              id: "123",
              name: "Product Name",
              sku: "SKU123",
              quantity: 50,
              price: 29.99,
              category: "Electronics"
            }
          ],
          total: 100,
          limit: 50,
          offset: 0
        }
      }
    },
    {
      method: 'POST',
      path: '/api/products',
      description: 'Create a new product',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Product name' },
        { name: 'sku', type: 'string', required: true, description: 'Product SKU' },
        { name: 'quantity', type: 'integer', required: true, description: 'Initial quantity' },
        { name: 'price', type: 'number', required: false, description: 'Product price' },
        { name: 'category', type: 'string', required: false, description: 'Product category' }
      ],
      response: {
        status: 201,
        data: {
          id: "123",
          name: "Product Name",
          sku: "SKU123",
          quantity: 50,
          price: 29.99,
          category: "Electronics",
          created_at: "2024-12-19T10:00:00Z"
        }
      }
    },
    {
      method: 'PUT',
      path: '/api/products/{id}',
      description: 'Update a product',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID' },
        { name: 'name', type: 'string', required: false, description: 'Product name' },
        { name: 'quantity', type: 'integer', required: false, description: 'Product quantity' },
        { name: 'price', type: 'number', required: false, description: 'Product price' }
      ],
      response: {
        status: 200,
        data: {
          id: "123",
          name: "Updated Product Name",
          sku: "SKU123",
          quantity: 75,
          price: 34.99,
          updated_at: "2024-12-19T10:00:00Z"
        }
      }
    },
    {
      method: 'DELETE',
      path: '/api/products/{id}',
      description: 'Delete a product',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID' }
      ],
      response: {
        status: 204,
        data: null
      }
    }
  ];

  const webhooks = [
    {
      event: 'product.created',
      description: 'Triggered when a new product is created',
      payload: {
        type: 'product.created',
        data: {
          id: '123',
          name: 'Product Name',
          sku: 'SKU123',
          quantity: 50
        },
        timestamp: '2024-12-19T10:00:00Z'
      }
    },
    {
      event: 'product.updated',
      description: 'Triggered when a product is updated',
      payload: {
        type: 'product.updated',
        data: {
          id: '123',
          name: 'Updated Product Name',
          sku: 'SKU123',
          quantity: 75,
          changes: ['quantity', 'name']
        },
        timestamp: '2024-12-19T10:00:00Z'
      }
    },
    {
      event: 'inventory.low_stock',
      description: 'Triggered when inventory falls below threshold',
      payload: {
        type: 'inventory.low_stock',
        data: {
          product_id: '123',
          product_name: 'Product Name',
          current_quantity: 5,
          threshold: 10
        },
        timestamp: '2024-12-19T10:00:00Z'
      }
    }
  ];

  const integrations = [
    {
      name: 'Shopify',
      status: 'CSV Support',
      description: 'Import/export products via CSV',
      features: ['Product sync', 'Inventory updates', 'Order tracking'],
      documentation: 'https://help.shopify.com/en/manual/products/import-export'
    },
    {
      name: 'Square',
      status: 'CSV Support', 
      description: 'Connect with Square POS systems',
      features: ['Product sync', 'Sales data import', 'Multi-location support'],
      documentation: 'https://developer.squareup.com/docs'
    },
    {
      name: 'WooCommerce',
      status: 'Coming Soon',
      description: 'WordPress e-commerce integration',
      features: ['API integration', 'Real-time sync', 'Order management'],
      documentation: 'https://woocommerce.github.io/woocommerce-rest-api-docs/'
    }
  ];

  const codeExamples = {
    javascript: `// Get all products
const response = await fetch('https://api.stockflow.be/api/products', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data.products);`,

    python: `import requests

# Get all products
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.stockflow.be/api/products', headers=headers)
data = response.json()
print(data['products'])`,

    curl: `curl -X GET "https://api.stockflow.be/api/products" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "StockFlow API Documentation",
    "description": "Complete API documentation for StockFlow inventory management platform. Build integrations and automate your inventory management.",
    "url": "https://www.stockflow.be/api-documentation",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow API",
      "description": "RESTful API for inventory management"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="StockFlow API Documentation | Build Integrations"
        description="Complete API documentation for StockFlow. RESTful endpoints, webhooks, and integration guides for developers."
        keywords="API documentation, inventory management API, REST API, webhooks, integrations, developer tools"
        url="https://www.stockflow.be/api-documentation"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              StockFlow API Documentation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Build powerful integrations with our RESTful API. Connect StockFlow with your existing systems and automate your inventory management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Code className="mr-2 h-5 w-5" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Download className="mr-2 h-5 w-5" />
                Download SDK
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Quick start guide for StockFlow API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                      <Key className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Get API Key</h3>
                    <p className="text-sm text-gray-600">Generate your API key in the dashboard</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto mb-4">
                      <Code className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Make Requests</h3>
                    <p className="text-sm text-gray-600">Use our RESTful endpoints</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-4">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Secure Integration</h3>
                    <p className="text-sm text-gray-600">HTTPS and authentication required</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Base URL</h4>
                  <code className="text-sm bg-white p-2 rounded border block">
                    https://api.stockflow.be/v1
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using your API key in the Authorization header.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>Authorization: Bearer YOUR_API_KEY</div>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript" className="mt-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="python" className="mt-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <code>{codeExamples.python}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <code>{codeExamples.curl}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'destructive'}
                        className={
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {endpoint.parameters.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Required</th>
                                <th className="text-left p-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-b">
                                  <td className="p-2 font-mono">{param.name}</td>
                                  <td className="p-2">{param.type}</td>
                                  <td className="p-2">
                                    {param.required ? (
                                      <Badge variant="destructive" className="text-xs">Required</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                                    )}
                                  </td>
                                  <td className="p-2">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2">Response</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Status: {endpoint.response.status}</div>
                        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                          <code>{JSON.stringify(endpoint.response.data, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Webhook Events
                </CardTitle>
                <CardDescription>
                  Real-time notifications for inventory changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Configure webhooks to receive real-time notifications when inventory changes occur.
                </p>
                <div className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{webhook.event}</h4>
                        <Badge variant="outline">POST</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{webhook.description}</p>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm font-semibold mb-2">Payload Example:</div>
                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                          <code>{JSON.stringify(webhook.payload, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Available Integrations
                </CardTitle>
                <CardDescription>
                  Connect StockFlow with popular platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {integrations.map((integration, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <Badge 
                          variant={integration.status === 'CSV Support' ? 'default' : 'secondary'}
                          className={
                            integration.status === 'CSV Support' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      <ul className="space-y-1 mb-4">
                        {integration.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Documentation
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Developer Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get help with API integration</p>
                <Button variant="outline" size="sm">Contact Support</Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">SDK Downloads</h3>
                <p className="text-sm text-gray-600 mb-4">Official SDKs for popular languages</p>
                <Button variant="outline" size="sm">Download SDK</Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-gray-600 mb-4">Join our developer community</p>
                <Button variant="outline" size="sm">Join Discord</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
