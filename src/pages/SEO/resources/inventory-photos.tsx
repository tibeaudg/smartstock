import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SeoPageLayout from '@/components/SeoPageLayout';
import {
  Camera,
  Image,
  CheckCircle,
  ArrowRight,
  Zap,
  Cloud,
  ShieldCheck,
  Clock,
  Database,
  Boxes,
  ClipboardCheck,
  Truck,
  Link as LinkIcon
} from 'lucide-react';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'Easy Photo Upload',
    description: 'Upload product photos directly from your smartphone, tablet, or computer. Support for multiple image formats and automatic optimization.'
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: 'Multiple Images Per Product',
    description: 'Add multiple photos per product to show different angles, variations, or packaging. Organize images for better product identification.'
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'Cloud Storage',
    description: 'All photos are securely stored in the cloud with automatic backups. Access your product images from anywhere, anytime.'
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure & Private',
    description: 'Your product photos are encrypted and stored securely. Control who can view and manage images with role-based permissions.'
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: 'Organized Image Library',
    description: 'Organize product photos by category, location, or custom tags. Quickly find images with search and filtering capabilities.'
  },
  {
    icon: <LinkIcon className="h-6 w-6" />,
    title: 'E-commerce Integration',
    description: 'Automatically sync product photos to your e-commerce platforms like Shopify, WooCommerce, and Amazon for consistent product listings.'
  }
];

const metrics = [
  {
    icon: <Camera className="h-5 w-5" />,
    label: 'Unlimited',
    title: 'Product Photos',
    description: 'Upload unlimited photos per product to showcase all angles and variations.'
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    label: '100%',
    title: 'Visual Accuracy',
    description: 'Photos help identify products instantly, reducing picking errors and improving accuracy.'
  },
  {
    icon: <Database className="h-5 w-5" />,
    label: 'Fast',
    title: 'Image Loading',
    description: 'Optimized images load quickly on mobile and desktop for efficient inventory management.'
  }
];

const workflowSteps = [
  {
    title: 'Upload Product Photos',
    description: 'Take photos with your smartphone or upload existing images. StockFlow supports multiple formats and automatically optimizes file sizes.'
  },
  {
    title: 'Organize & Tag',
    description: 'Add photos to products, organize by category, and tag images for easy searching. Link photos to specific variants or locations.'
  },
  {
    title: 'Use in Operations',
    description: 'View product photos during picking, receiving, and cycle counts. Visual identification reduces errors and speeds up operations.'
  },
  {
    title: 'Sync to Channels',
    description: 'Automatically sync product photos to your e-commerce platforms, ensuring consistent product listings across all sales channels.'
  }
];

const photoBenefits = [
  {
    name: 'Faster Product Identification',
    description: 'Visual identification speeds up picking, receiving, and cycle counting operations. Staff can quickly identify products without reading codes or descriptions.'
  },
  {
    name: 'Reduced Errors',
    description: 'Photos help prevent picking mistakes and receiving errors. Visual confirmation ensures the right product is selected or received.'
  },
  {
    name: 'Better Training',
    description: 'New team members learn product identification faster with visual references. Photos serve as training materials for warehouse and retail staff.'
  },
  {
    name: 'E-commerce Ready',
    description: 'Product photos automatically sync to e-commerce platforms, ensuring your online listings have high-quality images that drive sales.'
  }
];

const useCases = [
  {
    icon: <Boxes className="h-6 w-6" />,
    title: 'Retail & E-commerce',
    points: [
      'Upload product photos for online listings and in-store displays.',
      'Sync images automatically to Shopify, Amazon, and WooCommerce.',
      'Help customers identify products with clear, high-quality images.'
    ]
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: 'Warehouse Operations',
    points: [
      'Use photos for visual product identification during picking.',
      'Reduce picking errors with visual confirmation of products.',
      'Train new staff faster with visual product references.'
    ]
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Receiving & Quality Control',
    points: [
      'Compare received items against product photos for verification.',
      'Document product condition with photos during receiving.',
      'Maintain visual records for quality control and compliance.'
    ]
  }
];

const faqData = [
  {
    question: 'How do I add photos to inventory items?',
    answer:
      'Adding photos is easy! Simply open any product in StockFlow, click the photo upload button, and select images from your device. You can upload from your smartphone, tablet, or computer. StockFlow supports multiple image formats and automatically optimizes file sizes.'
  },
  {
    question: 'How many photos can I add per product?',
    answer:
      'StockFlow allows unlimited photos per product. Add multiple images to show different angles, color variations, packaging options, or product details. Organize photos as primary images, secondary images, or custom categories.'
  },
  {
    question: 'Do product photos sync to my e-commerce store?',
    answer:
      'Yes! When you connect StockFlow with e-commerce platforms like Shopify, WooCommerce, or Amazon, product photos automatically sync to your online listings. This ensures consistent, high-quality product images across all sales channels.'
  },
  {
    question: 'What image formats does StockFlow support?',
    answer:
      'StockFlow supports common image formats including JPEG, PNG, GIF, and WebP. Images are automatically optimized for fast loading on mobile and desktop devices while maintaining quality.'
  },
  {
    question: 'How do photos help with inventory management?',
    answer:
      'Product photos improve inventory management by enabling visual identification during picking, receiving, and cycle counting. Photos reduce errors, speed up operations, and help train new staff. They also enhance e-commerce listings and customer experience.'
  },
  {
    question: 'Can I organize photos by category or location?',
    answer:
      'Yes, StockFlow allows you to organize product photos with tags, categories, and custom labels. You can filter and search photos by these attributes, making it easy to find specific images when needed.'
  },
  {
    question: 'Are my product photos secure?',
    answer:
      'Absolutely. All product photos are encrypted and stored securely in the cloud with automatic backups. You control who can view and manage images through role-based permissions. Your photos are private and protected.'
  },
  {
    question: 'Can I use photos for quality control?',
    answer:
      'Yes! Product photos are excellent for quality control. You can compare received items against product photos, document product condition, and maintain visual records for compliance and quality assurance purposes.'
  }
];

export default function InventoryPhotosPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'StockFlow Inventory Photos',
      description:
        'Add and manage product photos in StockFlow for better inventory identification, reduced errors, and improved e-commerce listings. Upload unlimited photos per product with automatic optimization and cloud storage.',
      url: 'https://www.stockflowsystems.com/inventory-photos',
      applicationCategory: 'BusinessApplication',
      operatingSystem: ['iOS', 'Android', 'Windows', 'macOS'],
      featureList: features.map((feature) => feature.title),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR'
      },
      inLanguage: 'en'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.stockflowsystems.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Resources',
          item: 'https://www.stockflowsystems.com/resources'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Inventory Photos',
          item: 'https://www.stockflowsystems.com/inventory-photos'
        }
      ]
    }
  ];

  return (
    <SeoPageLayout 
      title="Inventory Photos"
      heroTitle="Inventory Photos"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Photos 2025 - Product Image Management | StockFlow"
        description="Add photos to inventory items for better identification and tracking. Upload product images, manage visual inventory, and improve accuracy with photo-based inventory management. Sync to e-commerce, reduce errors. Start free trial."
        keywords="inventory photos, product photos, inventory image management, product image upload, inventory photography, e-commerce product photos, warehouse photos, inventory visual identification, stock photos, product image sync"
        url="https://www.stockflowsystems.com/inventory-photos"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <Badge className="bg-white/15 text-white uppercase tracking-wider mb-6">
                Product Photo Management
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Inventory Photos for Better Product Identification
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-xl">
                Add unlimited photos to your inventory items for visual identification, reduced errors, and improved e-commerce listings. Upload from any device, organize with tags, and sync automatically to your online stores.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-indigo-100">
                      {metric.icon}
                      {metric.title}
                    </div>
                    <div className="mt-2 text-3xl font-semibold">{metric.label}</div>
                    <p className="mt-2 text-sm text-indigo-100/80">{metric.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-indigo-100/80">
                <span className="inline-flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unlimited photos per product
                </span>
                <span className="inline-flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Auto-sync to e-commerce
                </span>
              </div>
            </div>
            <div className="relative ">
              <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-3xl" />
                  <img
                    src="/Inventory-Management.png"
                    alt="StockFlow inventory photo management interface"
                    className="h-[96] w-64 object-cover rounded-3xl"
                  />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Product Photo Management Built for Efficiency
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              StockFlow makes it easy to add, organize, and use product photos throughout your inventory operations. Visual identification reduces errors and speeds up workflows.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how-it-works" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Inventory Photos Work</h2>
            <p className="text-lg text-gray-600">
              A simple workflow for adding, organizing, and using product photos throughout your inventory operations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-base font-bold">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Barcode Types */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Benefits of Product Photos in Inventory</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Product photos improve inventory management by enabling visual identification, reducing errors, and enhancing e-commerce listings.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {photoBenefits.map((benefit, index) => (
              <Card key={index} className="border-indigo-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{benefit.name}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Product Photos for Every Business Type</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From e-commerce stores to warehouses, product photos improve operations across all industries and business sizes.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Card key={index} className="h-full border-gray-200">
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {useCase.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
              <p className="text-gray-600 mb-6">
                Adding photos to your inventory is quick and easy. Upload images from any device, organize with tags, and start using photos immediately. No special setup or training required.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Easy upload</h3>
                    <p className="text-gray-600">
                      Upload photos from smartphones, tablets, or computers. Support for drag-and-drop, bulk uploads, and automatic image optimization.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardCheck className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Smart organization</h3>
                    <p className="text-gray-600">
                      Organize photos with tags, categories, and custom labels. Search and filter images quickly to find what you need.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">E-commerce sync</h3>
                    <p className="text-gray-600">
                      Automatically sync product photos to Shopify, WooCommerce, Amazon, and other e-commerce platforms for consistent listings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Security & Reliability</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Encrypted cloud storage with automatic backups keeps your product photos secure and accessible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Optimized images load quickly on mobile and desktop for efficient inventory management.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-indigo-600 mt-1" />
                  <span>Unlimited storage for product photos with automatic organization and search capabilities.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Adding Photos to Your Inventory Today</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Upload product photos, organize your image library, and improve inventory accuracy. Start with the free plan and add unlimited photos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100" asChild>
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/contact">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </SeoPageLayout>
  );
}


