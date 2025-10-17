import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Database, 
  ShoppingCart, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  Settings,
  Key,
  Globe,
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const integrations = [
  {
    name: 'Shopify',
    description: 'Import inventory data from your Shopify store',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'E-commerce',
    status: 'CSV Support',
    features: ['CSV import/export', 'Product sync', 'Inventory updates', 'Order tracking'],
    connected: false,
    setupRequired: true
  },
  {
    name: 'Square',
    description: 'Connect with your Square POS system',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'POS',
    status: 'CSV Support',
    features: ['CSV import/export', 'Product sync', 'Sales data import', 'Multi-location support'],
    connected: false,
    setupRequired: true
  },
  {
    name: 'WooCommerce',
    description: 'WordPress e-commerce integration',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'E-commerce',
    status: 'Coming Soon',
    features: ['API integration', 'Real-time sync', 'Order management', 'Inventory sync'],
    connected: false,
    comingSoon: true
  },
  {
    name: 'Mailchimp',
    description: 'Sync with your email marketing platform',
    icon: <Mail className="h-8 w-8" />,
    category: 'Marketing',
    status: 'Coming Soon',
    features: ['Customer sync', 'Segmentation', 'Automated campaigns'],
    connected: false,
    comingSoon: true
  },
  {
    name: 'QuickBooks',
    description: 'Connect with your accounting software',
    icon: <BarChart3 className="h-8 w-8" />,
    category: 'Accounting',
    status: 'Coming Soon',
    features: ['Invoice sync', 'Financial reporting', 'Tax integration'],
    connected: false,
    comingSoon: true
  },
  {
    name: 'Zapier',
    description: 'Connect with 5000+ apps via Zapier',
    icon: <Zap className="h-8 w-8" />,
    category: 'Automation',
    status: 'Coming Soon',
    features: ['Workflow automation', 'Multi-app integration', 'Custom triggers'],
    connected: false,
    comingSoon: true
  }
];

const webhookEvents = [
  {
    event: 'product.created',
    description: 'Triggered when you create a new product',
    enabled: false,
    endpoint: ''
  },
  {
    event: 'product.updated',
    description: 'Triggered when you update a product',
    enabled: false,
    endpoint: ''
  },
  {
    event: 'inventory.low_stock',
    description: 'Triggered when your inventory falls below threshold',
    enabled: false,
    endpoint: ''
  },
  {
    event: 'order.completed',
    description: 'Triggered when an order is completed',
    enabled: false,
    endpoint: ''
  }
];

export default function IntegrationsSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('integrations');
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (integrationName: string) => {
    setIsConnecting(integrationName);
    
    try {
      if (integrationName === 'Shopify' || integrationName === 'Square') {
        // Navigate to CSV import guide
        navigate('/integrations');
      } else {
        // Simulate connection process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add to connected integrations
        setConnectedIntegrations(prev => [...prev, integrationName]);
        
        // Show success message
        console.log(`Successfully connected to ${integrationName}`);
      }
    } catch (error) {
      console.error(`Failed to connect to ${integrationName}:`, error);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (integrationName: string) => {
    try {
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from connected integrations
      setConnectedIntegrations(prev => prev.filter(name => name !== integrationName));
      
      console.log(`Successfully disconnected from ${integrationName}`);
    } catch (error) {
      console.error(`Failed to disconnect from ${integrationName}:`, error);
    }
  };

  const handleCreateAPIKey = async () => {
    try {
      // Simulate API key creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('API key created successfully');
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      // Simulate webhook creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Webhook created successfully');
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Integrations Settings | StockFlow</title>
        <meta name="description" content="Manage your StockFlow integrations with external services and platforms." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
          <p className="text-gray-600">
            Connect StockFlow with your favorite tools and services for a complete business solution.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            {/* Connected Integrations */}
            {connectedIntegrations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations
                    .filter(integration => connectedIntegrations.includes(integration.name))
                    .map((integration) => (
                    <Card key={integration.name} className="border-green-200 bg-green-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription>{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600">
                            Last sync: Just now
                          </div>
                          <ul className="space-y-1">
                            {integration.features.slice(0, 2).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(integration.name)}
                            >
                              Disconnect
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Integrations */}
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter(integration => !connectedIntegrations.includes(integration.name))
                  .map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {integration.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
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
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <ul className="space-y-1">
                          {integration.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full"
                          onClick={() => handleConnect(integration.name)}
                          disabled={integration.comingSoon || isConnecting === integration.name}
                        >
                          {isConnecting === integration.name ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </>
                          ) : integration.comingSoon ? (
                            'Coming Soon'
                          ) : (
                            'Connect'
                          )}
                          {!isConnecting && !integration.comingSoon && (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Your Webhooks
                </CardTitle>
                <CardDescription>
                  Set up webhooks to receive real-time notifications when events occur in your StockFlow account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Webhooks Configured</h3>
                  <p className="text-gray-600 mb-6">
                    Set up webhooks to automatically notify your applications when inventory changes occur.
                  </p>
                  <Button onClick={handleCreateWebhook}>
                    <Globe className="mr-2 h-4 w-4" />
                    Create Your First Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Available Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhookEvents.map((webhook, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">{webhook.event}</h4>
                        <p className="text-xs text-gray-600">{webhook.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Available
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Your API Keys
                </CardTitle>
                <CardDescription>
                  Generate API keys to connect your own applications with StockFlow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first API key to start integrating with your own applications.
                  </p>
                  <Button onClick={handleCreateAPIKey}>
                    <Key className="mr-2 h-4 w-4" />
                    Create Your First API Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  API Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Learn how to use StockFlow's API to build custom integrations with your business tools.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View API Documentation
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download SDK
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
