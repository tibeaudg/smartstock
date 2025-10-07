import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Scan, 
  Package, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Apple,
  Android,
  Zap,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react';
import SEO from '@/components/SEO';

const features = [
  {
    icon: <Scan className="h-6 w-6" />,
    title: 'Barcode Scanning',
    description: 'Scan product barcodes instantly to update inventory levels'
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: 'Stock Management',
    description: 'View and manage your inventory from anywhere'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Real-time Analytics',
    description: 'Get instant insights into your business performance'
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'Cloud Sync',
    description: 'All data syncs automatically across all your devices'
  },
  {
    icon: <WifiOff className="h-6 w-6" />,
    title: 'Offline Mode',
    description: 'Work without internet connection, sync when connected'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Fast Performance',
    description: 'Lightning-fast app optimized for mobile devices'
  }
];

const screenshots = [
  {
    title: 'Dashboard',
    description: 'Overview of your inventory at a glance'
  },
  {
    title: 'Scanner',
    description: 'Quick barcode scanning for fast updates'
  },
  {
    title: 'Analytics',
    description: 'Detailed reports and insights'
  },
  {
    title: 'Settings',
    description: 'Customize your experience'
  }
];

export default function MobileAppPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockFlow Mobile App",
    "description": "Mobile inventory management app for iOS and Android",
    "url": "https://www.stockflow.be/mobile-app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": ["iOS", "Android"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Mobile App - StockFlow"
        description="Download the StockFlow mobile app for iOS and Android. Manage inventory on the go with barcode scanning, real-time sync, and offline capabilities."
        keywords="mobile app, iOS, Android, inventory management, barcode scanner, mobile stock management"
        url="https://www.stockflow.be/mobile-app"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Inventory Management in Your Pocket
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Take your business anywhere with the StockFlow mobile app. Scan barcodes, manage inventory, and stay connected with real-time sync.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Apple className="mr-2 h-6 w-6" />
                  Download for iOS
                </Button>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Android className="mr-2 h-6 w-6" />
                  Download for Android
                </Button>
              </div>
              <div className="mt-6">
                <Badge variant="secondary" className="mr-2 mb-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Free to Download
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  No Subscription Required
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Smartphone className="h-96 w-48 mx-auto text-white/20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need, Anywhere You Go
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful inventory management features designed specifically for mobile devices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600">
              Beautiful, intuitive interface designed for productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-[9/16] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Smartphone className="h-32 w-16 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{screenshot.title}</h3>
                  <p className="text-sm text-gray-600">{screenshot.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Download the StockFlow mobile app today and transform how you manage inventory
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Apple className="mr-2 h-6 w-6" />
              App Store
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Android className="mr-2 h-6 w-6" />
              Google Play
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              iOS 14.0 or later
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Android 8.0 or later
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Free download
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Is the mobile app free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! The StockFlow mobile app is completely free to download and use. No subscription required for basic inventory management features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Does it work offline?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! You can scan barcodes, view inventory, and make updates even without an internet connection. All changes will sync automatically when you're back online.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I use it on multiple devices?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! Your data syncs across all devices - phone, tablet, and computer. Sign in with the same account on any device to access your inventory.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What barcode types are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The app supports all common barcode formats including UPC, EAN, Code 128, Code 39, and QR codes. It can also generate barcodes for your products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
