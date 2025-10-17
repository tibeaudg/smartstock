import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

const CSVImportGuide = () => {
  const [activeTab, setActiveTab] = useState('shopify');

  const shopifySteps = [
    {
      step: 1,
      title: "Export from Shopify",
      description: "Go to Products → Export in your Shopify admin",
      details: "Select 'Export all products' and choose CSV format"
    },
    {
      step: 2,
      title: "Download Template",
      description: "Get our StockFlow-compatible template",
      details: "Click the download button below to get the template"
    },
    {
      step: 3,
      title: "Map Your Data",
      description: "Match Shopify columns to StockFlow format",
      details: "Use our mapping guide to ensure data accuracy"
    },
    {
      step: 4,
      title: "Import to StockFlow",
      description: "Upload your formatted CSV file",
      details: "Go to Settings → Import Data in your StockFlow dashboard"
    }
  ];

  const squareSteps = [
    {
      step: 1,
      title: "Export from Square",
      description: "Go to Items → Export in your Square dashboard",
      details: "Select 'Export all items' and choose CSV format"
    },
    {
      step: 2,
      title: "Download Template",
      description: "Get our StockFlow-compatible template",
      details: "Click the download button below to get the template"
    },
    {
      step: 3,
      title: "Map Your Data",
      description: "Match Square columns to StockFlow format",
      details: "Use our mapping guide to ensure data accuracy"
    },
    {
      step: 4,
      title: "Import to StockFlow",
      description: "Upload your formatted CSV file",
      details: "Go to Settings → Import Data in your StockFlow dashboard"
    }
  ];

  const shopifyMapping = [
    { shopify: 'Title', stockflow: 'Product Name', required: true },
    { shopify: 'Handle', stockflow: 'SKU', required: true },
    { shopify: 'Variant SKU', stockflow: 'Barcode', required: false },
    { shopify: 'Variant Price', stockflow: 'Price', required: false },
    { shopify: 'Variant Inventory Qty', stockflow: 'Quantity', required: true },
    { shopify: 'Variant Weight', stockflow: 'Weight', required: false },
    { shopify: 'Product Type', stockflow: 'Category', required: false },
    { shopify: 'Vendor', stockflow: 'Supplier', required: false }
  ];

  const squareMapping = [
    { square: 'Name', stockflow: 'Product Name', required: true },
    { square: 'SKU', stockflow: 'SKU', required: true },
    { square: 'Barcode', stockflow: 'Barcode', required: false },
    { square: 'Price', stockflow: 'Price', required: false },
    { square: 'Quantity', stockflow: 'Quantity', required: true },
    { square: 'Category', stockflow: 'Category', required: false },
    { square: 'Supplier', stockflow: 'Supplier', required: false }
  ];

  const downloadTemplate = (platform: string) => {
    // In a real implementation, this would download the actual template
    console.log(`Downloading ${platform} template...`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">CSV Import Guide</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Import your existing inventory data from Shopify, Square, or other POS systems into StockFlow using CSV files.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shopify" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Shopify
          </TabsTrigger>
          <TabsTrigger value="square" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Square
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shopify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopify to StockFlow Import
              </CardTitle>
              <CardDescription>
                Follow these steps to import your Shopify inventory into StockFlow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {shopifySteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{step.details}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => downloadTemplate('shopify')}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Shopify Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Mapping Guide</CardTitle>
              <CardDescription>
                Map your Shopify export columns to StockFlow fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Shopify Column</th>
                      <th className="text-left p-2">StockFlow Field</th>
                      <th className="text-left p-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopifyMapping.map((mapping, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-mono text-blue-600">{mapping.shopify}</td>
                        <td className="p-2 font-mono text-green-600">{mapping.stockflow}</td>
                        <td className="p-2">
                          {mapping.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="square" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Square to StockFlow Import
              </CardTitle>
              <CardDescription>
                Follow these steps to import your Square inventory into StockFlow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {squareSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{step.details}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => downloadTemplate('square')}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Square Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Mapping Guide</CardTitle>
              <CardDescription>
                Map your Square export columns to StockFlow fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Square Column</th>
                      <th className="text-left p-2">StockFlow Field</th>
                      <th className="text-left p-2">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {squareMapping.map((mapping, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-mono text-blue-600">{mapping.square}</td>
                        <td className="p-2 font-mono text-green-600">{mapping.stockflow}</td>
                        <td className="p-2">
                          {mapping.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>CSV files should be UTF-8 encoded for best compatibility</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Maximum file size: 10MB (approximately 10,000 products)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Required fields: Product Name, SKU, and Quantity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Duplicate SKUs will be updated, not duplicated</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVImportGuide;
