import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Star,
  Send,
  Plane,
  Rocket,
  Lightbulb,
  HelpCircle,
  Orbit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowRight, Package, Layers, Building, ShoppingBag } from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly';
type IconComponent = React.ComponentType<{ className?: string }>;

type PlanCardConfig = {
  id: 'free' | 'advanced' | 'ultra' | 'premium' | 'enterprise';
  name: string;
  description: string;
  icon: IconComponent;
  monthlyPrice: number;
  accentColor: string;
  accentSoft: string;
  isPopular?: boolean;
  ctaLabel: string;
  ctaVariant?: 'default' | 'outline';
  secondaryCtaLabel?: string;
  stats: Array<{ label: string; value: string; progress: number }>;
  features: string[];
};

type ComparisonFeature = {
  name: string;
  values: Array<boolean | string>;
  info?: string;
  isNew?: boolean;
};

type ComparisonSection = {
  title: string;
  features: ComparisonFeature[];
};

const PLAN_CARDS: PlanCardConfig[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Best for getting started.',
    icon: Send,
    monthlyPrice: 0,
    accentColor: 'text-blue-500',
    accentSoft: 'bg-blue-100',
    ctaLabel: 'Sign Up',
    stats: [
      { label: 'Unique Items', value: '100 Unique Items', progress: 20 },
      { label: 'User Licenses', value: '1 User License', progress: 10 }
    ],
    features: [
      'In-app Barcode & QR Code Scanning',
      'Offline Mobile Access',
      'Automatic Sync'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Best for maintaining optimal inventory levels.',
    icon: Lightbulb,
    monthlyPrice: 29,
    accentColor: 'text-blue-600',
    accentSoft: 'bg-blue-100',
    ctaLabel: 'Start Free Trial',
    stats: [
      { label: 'Unique Items', value: '500 Unique Items', progress: 45 },
      { label: 'User Licenses', value: '2 User Licenses', progress: 25 },
      { label: 'Extras', value: '+ Unlimited QR Code Label Creation', progress: 100 }
    ],
    features: [
      'Inventory Import',
      'Item Photos',
      'Inventory Lists',
      'Email Support'
    ]
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Best for simplifying day-to-day inventory tasks.',
    icon: Plane,
    monthlyPrice: 99,
    accentColor: 'text-blue-600',
    accentSoft: 'bg-blue-100',
    isPopular: true,
    ctaLabel: 'Start Free Trial',
    stats: [
      { label: 'Unique Items', value: '2,000 Unique Items', progress: 70 },
      { label: 'User Licenses', value: '5 User Licenses', progress: 45 },
      { label: 'Extras', value: '+ Purchase Orders', progress: 100 }
    ],
    features: [
      'Unlimited QR & Barcode Label Creation',
      'Purchase Orders',
      'Low Stock Alerts',
      'Date-based Alerts'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Best for streamlining inventory processes and oversight.',
    icon: Rocket,
    monthlyPrice: 199,
    accentColor: 'text-blue-600',
    accentSoft: 'bg-blue-100',
    ctaLabel: 'Start Free Trial',
    stats: [
      { label: 'Unique Items', value: '5,000 Unique Items', progress: 85 },
      { label: 'User Licenses', value: '8 User Licenses', progress: 65 },
      { label: 'Extras', value: '+ QuickBooks Online Integration', progress: 100 }
    ],
    features: [
      'Customizable Role Permissions',
      'QuickBooks Online Integration',
      'Advanced Reporting',
      'Priority Support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Best for customized inventory processes and control.',
    icon: Orbit,
    monthlyPrice: 0,
    accentColor: 'text-blue-700',
    accentSoft: 'bg-blue-100',
    ctaLabel: 'Talk to Sales',
    stats: [
      { label: 'Unique Items', value: '10,000+ Unique Items', progress: 100 },
      { label: 'User Licenses', value: '12+ User Licenses', progress: 100 },
      { label: 'Extras', value: '+ Dedicated Customer Success Manager', progress: 100 }
    ],
    features: [
      'API & Webhooks',
      'SSO & Advanced Security',
      'Dedicated Customer Success Manager',
      'Custom Inventory Setup'
    ]
  }
];

const PLAN_ORDER = PLAN_CARDS.map(plan => plan.id);

const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    title: 'Organize',
    features: [
      {
        name: 'Unique Items',
        values: ['100', '500', '2,000', '5,000', '10,000+'],
        info: 'Number of active SKUs you can track'
      },
      {
        name: 'User Licenses',
        values: ['1', '2', '5', '8', '12+'],
        info: 'Team members included'
      },
      {
        name: 'Inventory Import',
        values: [true, true, true, true, true],
        info: 'Import from Excel or CSV files'
      },
      {
        name: 'Item Photos',
        values: [true, true, true, true, true]
      },
      {
        name: 'Inventory Lists',
        values: [true, true, true, true, true]
      }
    ]
  },
  {
    title: 'Customize',
    features: [
      {
        name: 'Custom Fields',
        values: ['1', '5', '10', '20', 'Unlimited']
      },
      {
        name: 'Custom Folders',
        values: [true, true, true, true, true],
        info: 'Organize items your way'
      },
      {
        name: 'Custom Tags',
        values: [true, true, true, true, true]
      },
      {
        name: 'Custom Units of Measurement',
        values: [false, false, true, true, true],
        isNew: true
      },
      {
        name: 'Customizable User Access',
        values: [false, true, true, true, true],
        isNew: true
      },
      {
        name: 'Customizable Role Permissions',
        values: [false, false, false, true, true],
        isNew: true
      },
      {
        name: 'Limited Access Seats',
        values: [false, false, false, true, true]
      },
      {
        name: 'Multi-account Access (MAA)',
        values: [false, false, false, false, true],
        isNew: true
      }
    ]
  },
  {
    title: 'Manage',
    features: [
      {
        name: 'In-app Barcode & QR Code Scanning',
        values: [true, true, true, true, true]
      },
      {
        name: '3rd-party Scanner Support',
        values: [false, true, true, true, true]
      },
      {
        name: 'QR Code Label Creation',
        values: [false, true, true, true, true]
      },
      {
        name: 'Barcode Label Creation',
        values: [false, true, true, true, true]
      },
      {
        name: 'Item Check-in/Check-out',
        values: [false, false, true, true, true]
      },
      {
        name: 'Purchase Orders',
        values: [false, false, true, true, true],
        isNew: true
      },
      {
        name: 'Pick Lists',
        values: [false, false, false, true, true],
        isNew: true
      },
      {
        name: 'Stock Counts',
        values: [false, false, false, true, true],
        isNew: true
      }
    ]
  },
  {
    title: 'Track & Update',
    features: [
      {
        name: 'Low Stock Alerts',
        values: [false, true, true, true, true]
      },
      {
        name: 'Date-based Alerts',
        values: [false, false, true, true, true]
      },
      {
        name: 'Offline Mobile Access',
        values: [true, true, true, true, true]
      },
      {
        name: 'Automatic Sync',
        values: [true, true, true, true, true]
      },
      {
        name: 'In-app Alerts',
        values: [false, true, true, true, true]
      },
      {
        name: 'Email Alerts',
        values: [false, true, true, true, true]
      }
    ]
  },
  {
    title: 'Report',
    features: [
      {
        name: 'Activity History Reports',
        values: [true, true, true, true, true]
      },
      {
        name: 'Inventory Summary Reports',
        values: [true, true, true, true, true]
      },
      {
        name: 'User Activity Summary Reports',
        values: [false, false, true, true, true]
      },
      {
        name: 'Low Stock Reports',
        values: [false, true, true, true, true]
      },
      {
        name: 'Move Summary Reports',
        values: [false, false, true, true, true]
      },
      {
        name: 'Item Flow Reports',
        values: [false, false, true, true, true]
      },
      {
        name: 'Quantity Change by Item Reports',
        values: [false, false, true, true, true]
      },
      {
        name: 'Saved Reports',
        values: [false, false, false, true, true],
        isNew: true
      },
      {
        name: 'Report Subscriptions',
        values: [false, false, false, true, true],
        isNew: true
      },
      {
        name: 'Activity History',
        values: ['1 month', '1 year', '3 years', 'Unlimited', 'Unlimited']
      },
      {
        name: 'Transaction Reports',
        values: ['1-month limit', '1-year limit', '3-year limit', 'Unlimited', 'Unlimited']
      }
    ]
  },
  {
    title: 'Integrations',
    features: [
      {
        name: 'QuickBooks Online',
        values: [false, false, false, true, true],
        isNew: true
      },
      {
        name: 'Slack',
        values: [false, false, false, true, true]
      },
      {
        name: 'Webhooks',
        values: [false, false, false, true, true]
      },
      {
        name: 'Microsoft Teams',
        values: [false, false, false, true, true]
      },
      {
        name: 'API',
        values: [false, false, true, true, true]
      },
      {
        name: 'SSO',
        values: [false, false, false, false, true]
      }
    ]
  },
  {
    title: 'Support',
    features: [
      {
        name: 'Help Center Resources & Tutorials',
        values: [true, true, true, true, true]
      },
      {
        name: 'Weekly Onboarding Webinars',
        values: [true, true, true, true, true]
      },
      {
        name: 'Email Support',
        values: [true, true, true, true, true]
      },
      {
        name: 'Scheduled Phone Support',
        values: [false, false, false, true, true]
      },
      {
        name: 'Onboarding Training Session',
        values: [false, false, false, true, true]
      },
      {
        name: 'Dedicated Customer Success Manager',
        values: [false, false, false, false, true]
      },
      {
        name: 'Custom Inventory Setup & Consulting',
        values: [false, false, false, false, true]
      }
    ]
  }
];

const formatCurrency = (value: number) => {
  if (value === 0) {
    return '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
};

const getYearlyPrice = (plan: PlanCardConfig) => {
  if (plan.id === 'enterprise' || plan.monthlyPrice === 0) {
    return 0;
  }

  return plan.monthlyPrice * 12 * 0.5;
};

const getYearlySavings = (plan: PlanCardConfig) => {
  if (plan.id === 'enterprise' || plan.monthlyPrice === 0) {
    return 0;
  }

  const yearly = getYearlyPrice(plan);
  const monthlyTotal = plan.monthlyPrice * 12;
  return monthlyTotal - yearly;
};

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'StockFlow Pricing - Inventory Plans with 14-Day Free Trial',
  url: 'https://www.stockflow.be/pricing',
  description:
    'Start your 14-day free trial. Compare Free, Advanced, Ultra, Premium, and Enterprise plans with up to 50% savings on yearly billing.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
    { name: 'Pricing', url: 'https://www.stockflow.be/pricing', position: 2 }
  ],
  softwareData: {
    name: 'StockFlow - Inventory Management',
    description:
      'Inventory management software with barcode scanning, automation, and analytics for growing teams.',
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
      'Multi-location support'
    ],
    url: 'https://www.stockflow.be/pricing'
  }
});

export default function PricingPage() {
  usePageRefresh();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleSelectPlan = (planId: PlanCardConfig['id'], action: 'trial' | 'buy' = 'trial') => {
    if (planId === 'enterprise') {
      navigate('/contact?subject=enterprise-plan');
      return;
    }

    const billingParam = billingCycle;

    if (!user) {
      navigate(`/auth?mode=register&plan=${planId}&billing=${billingParam}&intent=${action}`);
      return;
    }

    navigate(`/dashboard?selectedPlan=${planId}&billing=${billingParam}&intent=${action}`);
  };

  const planPricing = useMemo(() => {
    return PLAN_CARDS.map(plan => {
      if (plan.id === 'enterprise') {
        return {
          ...plan,
          displayPrice: 'Get a Quote',
          priceSuffix: ''
        };
      }

      if (plan.monthlyPrice === 0) {
        return {
          ...plan,
          displayPrice: '$0',
          priceSuffix: billingCycle === 'monthly' ? 'USD/mo.' : 'USD/yr.'
        };
      }

      const price =
        billingCycle === 'monthly'
          ? plan.monthlyPrice
          : getYearlyPrice(plan);

      return {
        ...plan,
        displayPrice: formatCurrency(price),
        priceSuffix: billingCycle === 'monthly' ? 'USD/mo.' : 'USD/yr.'
      };
    });
  }, [billingCycle]);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Inventory Software Pricing 2025 | Free Plan | StockFlow"
        description="Compare inventory management software pricing. Free plan (100 SKUs), paid plans from €29/mo. 14-day free trial. Save 50% with yearly billing. Start free!"
        keywords="inventory management pricing, stockflow pricing, inventory software plans, stockflow free trial, inventory management cost"
        url="https://www.stockflow.be/pricing"
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

        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            Start Your 14-Day Free Trial Today.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600">
            Transform how your business does inventory with our powerful, easy-to-use solution. Find the right StockFlow plan for you.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
              Save 50% on yearly pricing
            </span>
            <div className="flex rounded-full bg-blue-100 p-1">
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-blue-900 shadow'
                    : 'text-blue-500'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-blue-900 shadow'
                    : 'text-blue-500'
                }`}
              >
                Monthly
              </button>
        </div>
        </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {planPricing.map(plan => {
            const Icon = plan.icon;
            const yearlySavings = Math.round(getYearlySavings(plan));
            const yearlyPrice = getYearlyPrice(plan);

            return (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col border border-blue-200 ${
                  plan.isPopular ? 'shadow-lg ring-2 ring-blue-400' : ''
                }`}
              >
                {plan.isPopular && (
                  <Badge className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                    <Star className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-6">
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${plan.accentSoft}`}>
                    <Icon className={`h-7 w-7 ${plan.accentColor}`} />
              </div>
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-gray-500">
                    {plan.description}
              </CardDescription>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-gray-900">
                      {plan.displayPrice}
                    </p>
                    {plan.priceSuffix && (
                      <p className="text-xs uppercase tracking-wide text-gray-400 mt-1">
                        {plan.priceSuffix}
                      </p>
                    )}
                    {plan.monthlyPrice > 0 && billingCycle === 'monthly' && (
                      <p className="mt-3 text-xs font-medium text-gray-500">
                        Switch to yearly to save {formatCurrency(yearlySavings)}
                      </p>
                    )}
                    {plan.monthlyPrice > 0 && billingCycle === 'yearly' && (
                      <p className="mt-3 text-xs font-medium text-gray-500">
                        Equivalent to {formatCurrency(plan.monthlyPrice)}/mo
                      </p>
                    )}
                    {plan.id === 'enterprise' && (
                      <p className="mt-3 text-xs font-medium text-gray-500">
                        Let's tailor StockFlow to your processes.
                      </p>
                    )}
              </div>
            </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6">
                  <div className="space-y-3">
                    {plan.stats.map(stat => (
                      <div key={stat.label}>
                        <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                          <span>{stat.label}</span>
                          <span className="text-blue-500">{stat.value}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-blue-400"
                            style={{ width: `${stat.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      What&apos;s included
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-gray-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
              </ul>
                  </div>
            </CardContent>

                  <CardFooter className="flex flex-col gap-3">
              <Button 
                      variant={plan.ctaVariant ?? 'default'}
                className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSelectPlan(plan.id, 'trial')}
                    >
                      {plan.ctaLabel}
                    </Button>
                    {plan.secondaryCtaLabel && (
                      <Button
                        variant="link"
                        className="w-full text-gray-500"
                        onClick={() => handleSelectPlan(plan.id, 'buy')}
                      >
                        {plan.secondaryCtaLabel}
              </Button>
                    )}
                    {plan.monthlyPrice > 0 && billingCycle === 'yearly' && (
                      <p className="w-full rounded-2xl bg-gray-50 px-5 py-3 text-center text-xs text-gray-500">
                        Billed at {formatCurrency(yearlyPrice)} per year after trial
                      </p>
                    )}
            </CardFooter>
          </Card>
            );
          })}
        </section>

        {/* Related Resources Section */}
        <section className="mt-20 py-16 bg-gray-50 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore StockFlow Resources
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Learn more about features, solutions, and industry applications.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* Features Link */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Features</CardTitle>
                  <CardDescription className="text-sm">
                    Explore all StockFlow features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to="/features" 
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 group"
                  >
                    View Features
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>

              {/* Main Pillar Page */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <Layers className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Complete Guide</CardTitle>
                  <CardDescription className="text-sm">
                    Inventory management guide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to="/inventory-management-software" 
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 group"
                  >
                    Read Guide
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>

              {/* Solutions */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Solutions</CardTitle>
                  <CardDescription className="text-sm">
                    Solutions by use case
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    to="/solutions/inventory-management-software" 
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    Software Solutions
                  </Link>
                  <Link 
                    to="/solutions/inventory-management-software-cloud-based" 
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    Cloud-Based
                  </Link>
                </CardContent>
              </Card>

              {/* Industries */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Industries</CardTitle>
                  <CardDescription className="text-sm">
                    Industry-specific solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    to="/industries/contractor-inventory-management" 
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    Contractors
                  </Link>
                  <Link 
                    to="/industries/warehouse-inventory-management" 
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    Warehouses
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Review Badges Section */}
        <section className="mt-16 py-8 bg-gray-50 rounded-2xl">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-600 mb-4">
                Trusted by thousands of businesses
              </p>
              <ReviewBadges variant="horizontal" />
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Compare Plans
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Every plan starts with a 14-day free trial. Pick the level that matches your inventory workflow today and scale without friction.
          </p>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-blue-200">
            <table className="w-full border-collapse text-sm text-gray-600">
              <thead>
                <tr className="bg-blue-100 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 font-semibold">Features</th>
                  {PLAN_ORDER.map(planId => {
                    const plan = PLAN_CARDS.find(item => item.id === planId)!;
                    return (
                      <th key={plan.id} className="px-6 py-4 text-center font-semibold text-gray-700">
                        {plan.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_SECTIONS.map(section => (
                  <React.Fragment key={section.title}>
                    <tr>
                      <td colSpan={PLAN_ORDER.length + 1} className="bg-gray-900 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white">
                        {section.title}
                      </td>
                    </tr>
                    {section.features.map(feature => (
                      <tr key={feature.name} className="border-b border-blue-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.info && (
                              <span title={feature.info}>
                                <HelpCircle className="h-4 w-4 text-blue-400" aria-hidden="true" />
                              </span>
                            )}
                            {feature.isNew && (
                              <Badge className="bg-blue-500 text-white">New</Badge>
                            )}
                          </div>
                        </td>
                        {feature.values.map((value, index) => (
                          <td key={`${feature.name}-${index}`} className="px-6 py-4 text-center">
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-300" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-blue-600">{value}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Testimonial Quotes Section */}
        <section className="mt-20 py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
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
          </div>
        </section>

        <section className="mt-20">
          <div className="grid gap-6 rounded-3xl bg-blue-500 px-8 py-10 text-white md:grid-cols-2 md:items-center md:px-12 md:py-14">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">
                Ready to see StockFlow in action?
              </h3>
              <p className="mt-3 text-base text-gray-100">
                Start your 14-day free trial or talk to our team to tailor a plan for your business. No cblueit card requiblue to begin.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button 
                className="rounded-full bg-white text-blue-600 hover:bg-blue-100"
                onClick={() => handleSelectPlan('advanced')}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h3 className="text-center text-3xl font-bold text-blue-900 md:text-4xl">
            Frequently Asked Questions
          </h3>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-blue-900">How does billing work?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Choose monthly or yearly billing for any paid plan. Yearly billing gives you an instant 50% discount compablue to paying monthly. Every plan starts with a 14-day free trial—cancel anytime during the trial to avoid charges.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Do I need a cblueit card to start?</h4>
              <p className="mt-2 text-sm text-gray-600">
                No. You can explore StockFlow for 14 days without entering payment details. When you’re ready to continue, add a card or talk to sales for invoice-based billing on Premium and Enterprise.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">What happens after 10,000 items?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Let us know and we’ll tailor an Enterprise plan with the storage, automation, and support your operation requires, including SLA guarantees and dedicated onboarding.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Can I import my existing inventory?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Absolutely. Import from spreadsheets or other systems in minutes. Premium and Enterprise plans include assisted onboarding for a frictionless migration.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Is my data secure?</h4>
              <p className="mt-2 text-sm text-gray-600">
                StockFlow uses bank-level encryption, secure EU data centers, daily backups, and access controls. Enterprise plans add SSO, audit trails, and custom data retention policies.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Which integrations are included?</h4>
              <p className="mt-2 text-sm text-gray-600">
                QuickBooks Online, Slack, Microsoft Teams, webhooks, and our open API are available on Premium and Enterprise. Need something specific? Let us know—we add new integrations regularly.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Can my team get training?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Yes. Weekly webinars are free for all plans, while Premium and Enterprise plans include tailoblue onboarding sessions and ongoing success coaching.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Can I cancel anytime?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Yes. Cancel in a few clicks from your settings. Your account stays active until the end of the billing period, and you can restart whenever you’re ready.
              </p>
            </div>
          </div>
        </section>
      </main>

<Footer />

    </div>
  );
}
