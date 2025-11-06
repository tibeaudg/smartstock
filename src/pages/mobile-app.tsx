import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';


import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  QrCode,
  Scan,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Cloud,
  WifiOff
} from 'lucide-react';
import SEO from '@/components/SEO';

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant Access',
    description: 'Open StockFlow in any modern browser—no app store installs required'
  },
  {
    icon: <Scan className="h-6 w-6" />,
    title: 'Barcode Scanning',
    description: 'Use your device camera to scan products and update inventory levels in seconds'
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Install to Home Screen',
    description: 'Add StockFlow to your home screen for a native-like experience on any device'
  },
  {
    icon: <WifiOff className="h-6 w-6" />,
    title: 'Offline Ready',
    description: 'Keep working without internet access and sync updates automatically when you reconnect'
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'Real-time Sync',
    description: 'Stay aligned across teams with data that updates instantly everywhere'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Live Analytics',
    description: 'Monitor stock performance and KPIs from a touch-first dashboard'
  }
];

const screenshots = [
  {
    title: 'Dashboard',
    description: 'Overview of your inventory at a glance',
    image: '/mobile-app.png'
  },
  {
    title: 'Scanner',
    description: 'Quick barcode scanning for fast updates',
    image: '/scanner2.png'
  },
  {
    title: 'Analytics',
    description: 'Detailed reports and insights',
    image: '/analytics.png'
  },
  {
    title: 'Settings',
    description: 'Customize your experience',
    image: '/settings.png'
  }
];

const installInstructions = [
  {
    platform: 'iOS & iPadOS',
    icon: <Smartphone className="h-6 w-6" />,
    steps: [
      'Open StockFlow in Safari',
      'Tap the Share button',
      'Select “Add to Home Screen” and confirm'
    ]
  },
  {
    platform: 'Android',
    icon: <QrCode className="h-6 w-6" />,
    steps: [
      'Open StockFlow in Chrome',
      'Tap the three-dot menu',
      'Choose “Install App” to pin it to your home screen'
    ]
  },
  {
    platform: 'Desktop',
    icon: <Cloud className="h-6 w-6" />,
    steps: [
      'Open StockFlow in Chrome, Edge, or Safari',
      'Look for the install icon in the address bar',
      'Follow the prompt to install the app-like experience'
    ]
  }
];

export default function MobileAppPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "StockFlow Progressive Web App",
    "description": "Progressive web app for inventory management on any device",
    "url": "https://www.stockflow.be/mobile-app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": ["iOS", "Android", "Windows", "macOS"],
    "browserRequirements": "Requires a modern browser with PWA support",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />
      <SEO
        title="Mobile App - StockFlow"
        description="Access the StockFlow progressive web app on any device. Manage inventory with barcode scanning, real-time sync, and offline capabilities without app store installs."
        keywords="progressive web app, pwa, inventory management, barcode scanner, mobile stock management, StockFlow"
        url="https://www.stockflow.be/mobile-app"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Inventory Management in Your Browser
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                StockFlow is a progressive web app that works on any device. Launch it from your browser, install it to your home screen, and stay productive everywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                  <a href="https://app.stockflow.be/auth?mode=register" target="_blank" rel="noopener noreferrer">
                    Launch Web App
                  </a>
                </Button>
              </div>
              <div className="mt-6">
                <Badge variant="secondary" className="mr-2 mb-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Free to Use
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  No App Store Needed
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Works Offline
                </Badge>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-xl">
                <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" aria-hidden="true" />
                <img
                  src="/mobile-app.png"
                  alt="StockFlow mobile app preview"
                  className="relative rounded-3xl shadow-2xl ring-1 h-94 w-64 ring-white/20"
                />
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
              A Progressive Web App Built for Mobility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enjoy the speed of a native app and the flexibility of the web with features optimised for every screen size
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
              See StockFlow on Any Device
            </h2>
            <p className="text-xl text-gray-600">
              A responsive, touch-friendly interface that adapts seamlessly to phones, tablets, and desktops
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="overflow-hidden">
                <img
                  src={screenshot.image}
                  alt={screenshot.title}
                  className="w-full h-68 object-cover rounded-3xl"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{screenshot.title}</h3>
                  <p className="text-sm text-gray-600">{screenshot.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Install Section */}
      <div id="install" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Install StockFlow as a Progressive Web App
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Launch StockFlow in your browser, then follow the quick steps below to add it to your home screen or desktop.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            {installInstructions.map((instruction, index) => (
              <Card key={index} className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      {instruction.icon}
                    </span>
                    {instruction.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-blue-100">
                    {instruction.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="https://app.stockflow.be" target="_blank" rel="noopener noreferrer">
                Open StockFlow Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <a
                href="https://support.google.com/chrome/answer/9658361?hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                What is a PWA?
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center text-sm">
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Works on iOS, Android, Windows, and macOS
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Offline support with automatic sync
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Always up to date with web deployments
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
                <CardTitle>Do I need to download StockFlow from an app store?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No downloads required. StockFlow is a progressive web app—open it in your browser, install it to your home screen, and access the full experience instantly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Does the PWA work offline?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! You can scan barcodes, view inventory, and make updates even without an internet connection. All changes sync automatically when you reconnect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I use it on multiple devices?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! Your data stays in sync across phones, tablets, and desktops. Sign in with the same account on any device to access your inventory.
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

            <Card>
              <CardHeader>
                <CardTitle>How do updates work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Because StockFlow runs as a web app, you always get the latest features as soon as we release them. There are no manual updates or app store approvals needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
