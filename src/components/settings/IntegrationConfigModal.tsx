import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  CreditCard, 
  Mail, 
  BarChart3, 
  Zap, 
  Globe,
  Key,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  Info
} from 'lucide-react';

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    status: string;
    features: string[];
  } | null;
}

export default function IntegrationConfigModal({ isOpen, onClose, integration }: IntegrationConfigModalProps) {
  const [activeTab, setActiveTab] = useState('setup');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionData, setConnectionData] = useState({
    apiKey: '',
    webhookUrl: '',
    syncFrequency: 'daily',
    autoSync: true
  });

  if (!integration) return null;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Connected to ${integration.name}`);
      onClose();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCSVImport = () => {
    // Navigate to CSV import guide
    window.open('/integrations', '_blank');
  };

  const renderSetupContent = () => {
    switch (integration.name) {
      case 'Shopify':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  CSV Import Setup
                </CardTitle>
                <CardDescription>
                  Export your Shopify products and import them into StockFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 1: Export from Shopify</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to Shopify Admin → Products</li>
                    <li>Click "Export" → Select "All products"</li>
                    <li>Choose CSV format and download</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 2: Import to StockFlow</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to Stock → Import Data</li>
                    <li>Select "Shopify CSV" template</li>
                    <li>Upload your exported file</li>
                    <li>Map columns and import</li>
                  </ol>
                </div>

                <Button onClick={handleCSVImport} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'Square':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  CSV Import Setup
                </CardTitle>
                <CardDescription>
                  Export your Square inventory and import it into StockFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 1: Export from Square</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to Square Dashboard → Items</li>
                    <li>Click "Export" → Select "Inventory"</li>
                    <li>Choose CSV format and download</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 2: Import to StockFlow</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to Stock → Import Data</li>
                    <li>Select "Square CSV" template</li>
                    <li>Upload your exported file</li>
                    <li>Map columns and import</li>
                  </ol>
                </div>

                <Button onClick={handleCSVImport} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'WooCommerce':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Connect WooCommerce using API credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wooUrl">WooCommerce Store URL</Label>
                    <Input 
                      id="wooUrl" 
                      placeholder="https://yourstore.com" 
                      value={connectionData.apiKey}
                      onChange={(e) => setConnectionData({...connectionData, apiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wooKey">Consumer Key</Label>
                    <Input 
                      id="wooKey" 
                      type="password" 
                      placeholder="ck_..." 
                    />
                  </div>
                  <div>
                    <Label htmlFor="wooSecret">Consumer Secret</Label>
                    <Input 
                      id="wooSecret" 
                      type="password" 
                      placeholder="cs_..." 
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Coming Soon</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    API integration is currently in development. CSV import is available now.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Mailchimp':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Connect Mailchimp using API key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mailchimpKey">Mailchimp API Key</Label>
                    <Input 
                      id="mailchimpKey" 
                      type="password" 
                      placeholder="Enter your Mailchimp API key" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Find your API key in Mailchimp → Account → Extras → API keys
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Coming Soon</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    API integration is currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'QuickBooks':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  OAuth Configuration
                </CardTitle>
                <CardDescription>
                  Connect QuickBooks using OAuth 2.0
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">OAuth Connection</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your QuickBooks account securely using OAuth 2.0
                    </p>
                    <Button className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect to QuickBooks
                    </Button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Coming Soon</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    OAuth integration is currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Zapier':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>
                  Connect StockFlow with 5000+ apps via Zapier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Zapier Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Connect StockFlow with your favorite apps through Zapier
                  </p>
                  <Button className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Browse Zapier Templates
                  </Button>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Coming Soon</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Zapier integration is currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {integration.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">Integration Setup</h3>
            <p className="text-gray-600 mb-4">
              Configuration options for {integration.name} will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {integration.icon}
            </div>
            <div>
              <div className="text-xl font-semibold">Connect {integration.name}</div>
              <div className="text-sm text-gray-600 font-normal">{integration.description}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Configure your {integration.name} integration to sync data with StockFlow
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            {renderSetupContent()}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sync Settings
                </CardTitle>
                <CardDescription>
                  Configure how often data syncs between {integration.name} and StockFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="syncFrequency">Sync Frequency</Label>
                  <select 
                    id="syncFrequency"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={connectionData.syncFrequency}
                    onChange={(e) => setConnectionData({...connectionData, syncFrequency: e.target.value})}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Every hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="autoSync"
                    checked={connectionData.autoSync}
                    onChange={(e) => setConnectionData({...connectionData, autoSync: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="autoSync">Enable automatic sync</Label>
                </div>

                <div>
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input 
                    id="webhookUrl" 
                    placeholder="https://your-app.com/webhook" 
                    value={connectionData.webhookUrl}
                    onChange={(e) => setConnectionData({...connectionData, webhookUrl: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Receive notifications when data changes
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Help & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Setup Guide</h4>
                      <p className="text-sm text-gray-600">Step-by-step integration setup</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Guide
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">API Documentation</h4>
                      <p className="text-sm text-gray-600">Technical integration details</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Docs
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Contact Support</h4>
                      <p className="text-sm text-gray-600">Get help with your integration</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Connect {integration.name}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
