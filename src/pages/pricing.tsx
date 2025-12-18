import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Star,
  Zap,
  Rocket,
  Infinity,
  ArrowRight,
  Package,
  Users,
  Building,
  ShoppingCart,
  BarChart3,
  Code,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/HeaderPublic';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import Footer from '@/components/Footer';
import { CustomerLogos } from '@/components/trust/CustomerLogos';
import { ReviewBadges } from '@/components/trust/ReviewBadges';
import { TestimonialQuotes } from '@/components/trust/TestimonialQuotes';
import { Link } from 'react-router-dom';

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'StockFlow - Completely Free Inventory Management',
  url: 'https://www.stockflowsystems.com/pricing',
  description:
    'StockFlow is completely free forever. All features included - unlimited products, users, branches, and orders. No credit card required, no subscriptions, no hidden fees.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflowsystems.com', position: 1 },
    { name: 'Pricing', url: 'https://www.stockflowsystems.com/pricing', position: 2 }
  ],
  softwareData: {
    name: 'StockFlow - Inventory Management',
    description:
      'Completely free inventory management software with barcode scanning, automation, and analytics.',
    category: 'BusinessApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    price: '0',
    currency: 'USD',
    rating: {
      value: '4.8',
      count: '150'
    },
    features: [
      'Real-time stock tracking',
      'Barcode & QR code scanning',
      'Automated alerts',
      'Advanced reporting',
      'Multi-location support',
      'Unlimited everything'
    ],
    url: 'https://www.stockflowsystems.com/pricing'
  }
});

const features = [
  {
    icon: Package,
    title: 'Unlimited Products',
    description: 'Track as many products as you need - no limits, no restrictions'
  },
  {
    icon: Users,
    title: 'Unlimited Users',
    description: 'Add as many team members as you want - everyone gets full access'
  },
  {
    icon: Building,
    title: 'Unlimited Branches',
    description: 'Manage inventory across unlimited locations and warehouses'
  },
  {
    icon: ShoppingCart,
    title: 'Unlimited Orders',
    description: 'Process unlimited orders per month - no transaction limits'
  },
  {
    icon: Zap,
    title: 'Barcode Scanning',
    description: 'In-app barcode and QR code scanning for fast inventory management'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reports and analytics to optimize your inventory'
  },
  {
    icon: Code,
    title: 'API Access',
    description: 'Full API access to integrate with your existing systems'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: 'Get help when you need it with priority customer support'
  }
];

export default function PricingPage() {
  usePageRefresh();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?mode=register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Completely Free Inventory Software | StockFlow"
        description="StockFlow is completely free forever. All features included - unlimited products, users, branches, and orders. No credit card required, no subscriptions, no hidden fees. Start free today!"
        keywords="free inventory software, free inventory management, stockflow free, completely free inventory software, no cost inventory management"
        url="https://www.stockflowsystems.com/pricing"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications
      />

      <main className="container mx-auto px-4 pb-24 pt-24 md:pt-28">
        {/* Customer Logos Section */}
        <CustomerLogos 
          variant="grid" 
          heading="Trusted by 500+ businesses"
          className="mb-12"
        />

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <Star className="mr-1 h-3 w-3" />
            Completely Free Forever
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight mb-6">
            StockFlow is Completely Free
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            No credit card required. No subscriptions. No hidden fees. All features included forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/features')}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-full"
            >
              View Features
            </Button>
          </div>
        </section>

        {/* Free Forever Card */}
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Infinity className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                $0 Forever
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Everything you need to manage your inventory - completely free
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What's Included</h4>
                  <ul className="space-y-2">
                    {[
                      'Unlimited products',
                      'Unlimited users',
                      'Unlimited branches',
                      'Unlimited orders',
                      'Barcode scanning',
                      'Advanced analytics',
                      'API access',
                      'Priority support'
                    ].map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">No Hidden Costs</h4>
                  <ul className="space-y-2">
                    {[
                      'No credit card required',
                      'No subscriptions',
                      'No trial periods',
                      'No usage limits',
                      'No feature restrictions',
                      'No setup fees',
                      'No cancellation fees',
                      'Free forever'
                    ].map((item) => (
                      <li key={item} className="flex items-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-full"
                >
                  Start Free Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            All Features Included
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Why Free Section */}
        <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why is StockFlow Free?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                We believe that every business, regardless of size, should have access to powerful inventory management tools. 
                StockFlow is our commitment to making inventory management accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">No Catch</h3>
              <p className="text-gray-600">
                There's no catch. StockFlow is completely free forever. We don't require credit cards, 
                we don't have hidden fees, and we don't limit your usage. Everything is included.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how businesses are saving money with StockFlow
            </p>
          </div>
          <TestimonialQuotes 
            variant="grid" 
            maxQuotes={2}
            showRating={true}
            showSavings={true}
          />
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="grid gap-6 rounded-3xl bg-blue-500 px-8 py-10 text-white md:grid-cols-2 md:items-center md:px-12 md:py-14">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl mb-3">
                Ready to get started?
              </h3>
              <p className="text-base text-gray-100">
                Join thousands of businesses using StockFlow completely free. No credit card required.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button 
                onClick={handleGetStarted}
                className="rounded-full bg-white text-blue-600 hover:bg-blue-100 text-lg px-8 py-6"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-center text-3xl font-bold text-blue-900 md:text-4xl mb-10">
            Frequently Asked Questions
          </h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Is StockFlow really free?</h4>
              <p className="text-sm text-gray-600">
                Yes! StockFlow is completely free forever. No credit card required, no subscriptions, no hidden fees. 
                All features are included at no cost.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Are there any limits?</h4>
              <p className="text-sm text-gray-600">
                No limits at all. You can add unlimited products, users, branches, and process unlimited orders. 
                Everything is unlimited and free.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Do I need a credit card?</h4>
              <p className="text-sm text-gray-600">
                No credit card required. You can sign up and start using StockFlow immediately without providing 
                any payment information.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">What features are included?</h4>
              <p className="text-sm text-gray-600">
                All features are included: barcode scanning, advanced analytics, API access, priority support, 
                and everything else. Nothing is locked behind a paywall.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Will it stay free?</h4>
              <p className="text-sm text-gray-600">
                Yes, StockFlow will remain free forever. We're committed to providing free inventory management 
                to businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Can I import my existing inventory?</h4>
              <p className="text-sm text-gray-600">
                Absolutely. You can import from spreadsheets or other systems in minutes. All import features 
                are included for free.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
