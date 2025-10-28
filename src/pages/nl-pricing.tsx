import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Zap, Crown, ArrowRight, Clock, Users, Package, ShoppingCart, Building, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslation } from 'react-i18next';
import Header from '@/components/HeaderPublic';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

// Helper function to get tier icon
const getTierIcon = (tierName: string) => {
  switch (tierName) {
    case 'basic':
      return <Package className="h-8 w-8" />;
    case 'growth':
      return <Zap className="h-8 w-8" />;
    case 'premium':
      return <Crown className="h-8 w-8" />;
    default:
      return <Package className="h-8 w-8" />;
  }
};

// Helper function to get tier color
const getTierColor = (tierName: string) => {
  switch (tierName) {
    case 'basic':
      return 'text-gray-600';
    case 'growth':
      return 'text-blue-600';
    case 'premium':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

export default function NlPricingPage() {
  usePageRefresh();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const { pricingTiers, isLoading } = useSubscription();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectPlan = (tierId: string, isBusinessTier: boolean = false) => {
    // Find the selected tier to check if it's free
    const selectedTier = pricingTiers.find(t => t.name === tierId);
    const isFree = selectedTier?.price_monthly === 0;
    
    // For free tier, redirect to register/dashboard
    if (isFree) {
      if (!user) {
        navigate('/auth?mode=register');
        return;
      }
      // If user is already logged in, redirect to dashboard (they already have free access)
      navigate('/dashboard');
      return;
    }
    
    // For paid tiers, require authentication
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // For business tier, redirect to contact page
    if (isBusinessTier) {
      navigate('/contact?subject=business-tier');
      return;
    }
    
    // Navigate to checkout for paid tiers
    navigate(`/checkout?tier=${tierId}&cycle=${billingCycle}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getLimitText = (value: number | null, type: string) => {
    if (value === null) return 'Onbeperkt';
    if (value === 0) return 'Niet inbegrepen';
    return `${value} ${type}`;
  };

  // Structured data for Dutch pricing page
  const structuredData = generateComprehensiveStructuredData(
    'software',
    {
      title: 'StockFlow Prijzen - Transparante Tarieven voor Voorraadbeheer 2024',
      url: 'https://www.stockflow.be/nl/pricing',
      description: 'Transparante prijzen voor voorraadbeheer. Start gratis of kies een betaald plan. Geen verborgen kosten, 14 dagen gratis proberen.',
      breadcrumbs: [
        { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
        { name: 'Prijzen', url: 'https://www.stockflow.be/nl/pricing', position: 2 }
      ],
      softwareData: {
        name: 'StockFlow - Voorraadbeheer Software',
        description: 'Gratis voorraadbeheer software voor kleine bedrijven met premium opties voor groeiende organisaties',
        category: 'BusinessApplication',
        operatingSystem: 'Web Browser, iOS, Android',
        price: '0',
        currency: 'EUR',
        rating: {
          value: '4.8',
          count: '150'
        },
        features: [
          'Real-time voorraad tracking',
          'Barcode scanning',
          'Analytics & rapportage',
          'Multi-locatie support',
          'Team samenwerking'
        ],
        url: 'https://www.stockflow.be/nl/pricing'
      }
    }
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <SEO
          title="StockFlow Prijzen - Transparante Tarieven voor Voorraadbeheer 2024"
          description="Transparante prijzen voor voorraadbeheer. Start gratis of kies een betaald plan. Geen verborgen kosten, 14 dagen gratis proberen."
          keywords="stockflow prijzen, voorraadbeheer kosten, gratis voorraad software, pricing, tarieven, abonnementen, voorraadbeheer software prijzen, gratis stockbeheer, voorraadbeheer software kosten"
          url="https://www.stockflow.be/nl/pricing"
          structuredData={structuredData}
        />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Prijzen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SEO
        title="StockFlow Prijzen - Transparante Tarieven voor Voorraadbeheer 2024"
        description="Transparante prijzen voor voorraadbeheer. Start gratis of kies een betaald plan. Geen verborgen kosten, 14 dagen gratis proberen."
        keywords="stockflow prijzen, voorraadbeheer kosten, gratis voorraad software, pricing, tarieven, abonnementen, voorraadbeheer software prijzen, gratis stockbeheer, voorraadbeheer software kosten"
        url="https://www.stockflow.be/nl/pricing"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-semibold text-sm">Vertrouwd door 10.000+ bedrijven</span>
            </div>
            <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold text-sm">4.9/5 beoordeling</span>
            </div>
            <div className="flex items-center bg-purple-100 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-700 font-semibold text-sm">500+ aangemeld deze maand</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-6">
              Start Gratis, Upgrade Wanneer Je Groeit
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Geen verborgen kosten. Annuleer altijd. 14 dagen gratis proefperiode op alle plannen. <strong>Sluit je aan bij 500+ bedrijven die deze maand zijn aangemeld.</strong>
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Maandelijks
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Jaarlijks
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="ml-2">
                Bespaar 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${tier.is_popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-lg'}`}
            >
              {tier.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Meest populair
                  </Badge>
                </div>
              )}
              
              {/* Money-back guarantee badge for paid tiers */}
              {tier.price_monthly > 0 && tier.name !== 'business' && (
                <div className="absolute -top-2 right-4">
                  <Badge variant="success" className="text-xs">
                    30-dagen garantie
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 ${getTierColor(tier.name)}`}>
                  {getTierIcon(tier.name)}
                </div>
                <CardTitle className="text-2xl font-semibold">{tier.display_name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {tier.name === 'business' 
                      ? 'Op Maat' 
                      : tier.price_monthly === 0 
                        ? '€0' 
                        : formatPrice(billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly)}
                  </div>
                  {tier.price_monthly > 0 && tier.name !== 'business' && (
                    <div className="text-sm text-gray-500">
                      {billingCycle === 'yearly' ? 'per jaar' : 'per maand'}
                    </div>
                  )}
                  {tier.name === 'business' && (
                    <div className="text-sm text-gray-500">
                      Aangepaste prijzen
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Limits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Producten</span>
                    <span className="text-sm font-medium">{getLimitText(tier.max_products, 'producten')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gebruikers</span>
                    <span className="text-sm font-medium">{getLimitText(tier.max_users, 'gebruikers')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vestigingen</span>
                      <span className="text-sm font-medium">{getLimitText(tier.max_branches, 'vestigingen')}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Inbegrepen:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl }"
                  onClick={() => handleSelectPlan(tier.name, tier.name === 'business')}
                >
                  {tier.name === 'business' 
                    ? 'Contact Verkoop' 
                    : tier.price_monthly === 0 
                      ? 'Start Gratis' 
                      : 'Start 14-dagen proefperiode'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Vertrouwd door Bedrijven Wereldwijd</h3>
            
            {/* Customer Testimonials */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"StockFlow heeft onze voorraadkosten met 40% verlaagd in slechts 3 maanden. De beste investering die we hebben gedaan."</p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-gray-500">CEO, Retail Plus</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Eindelijk voorraadbeheer dat echt werkt. We besparen 20 uur per week op handmatige tracking."</p>
                <div className="font-semibold">Mike Rodriguez</div>
                <div className="text-sm text-gray-500">Operations Manager, Global Supply</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"De real-time tracking en analytics zijn game-changers. Ons team houdt van hoe intuïtief het is."</p>
                <div className="font-semibold">David Chen</div>
                <div className="text-sm text-gray-500">CEO, TechStart Solutions</div>
              </div>
            </div>
            
            {/* Customer Logos */}
            <div className="border-t pt-8">
              <p className="text-gray-500 mb-6">Sluit je aan bij deze bedrijven die StockFlow gebruiken</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">Bedrijf A</div>
                <div className="text-2xl font-bold text-gray-400">Bedrijf B</div>
                <div className="text-2xl font-bold text-gray-400">Bedrijf C</div>
                <div className="text-2xl font-bold text-gray-400">Bedrijf D</div>
                <div className="text-2xl font-bold text-gray-400">Bedrijf E</div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Trial Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">14-dagen gratis proefperiode</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Probeer alle premium functies 14 dagen gratis. Geen creditcard vereist, 
              annuleer altijd.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Geen verplichtingen</h4>
                  <p className="text-sm text-gray-600">Annuleer altijd zonder kosten</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Volledige toegang</h4>
                  <p className="text-sm text-gray-600">Alle functies en limieten van je gekozen plan</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Direct starten</h4>
                  <p className="text-sm text-gray-600">Start direct met je voorraadbeheer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-4xl md:text-6xl font-light text-center text-gray-800 mb-8">
            Veelgestelde Vragen
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kan ik plannen altijd wijzigen?</h4>
              <p className="text-gray-600 text-sm">
                Ja, je kunt altijd upgraden of downgraden. Wijzigingen worden direct doorgevoerd en je wordt proportioneel gefactureerd of gecrediteerd.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Wat gebeurt er na mijn proefperiode?</h4>
              <p className="text-gray-600 text-sm">
                Na 14 dagen wordt je account automatisch gedowngraded naar het Gratis plan. Je kunt altijd upgraden om premium functies te behouden.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bieden jullie restituties?</h4>
              <p className="text-gray-600 text-sm">
                Ja, we bieden een 30-dagen geld-terug-garantie. Als je niet tevreden bent, neem contact met ons op voor volledige restitutie.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kan ik mijn bestaande voorraad importeren?</h4>
              <p className="text-gray-600 text-sm">
                Absoluut! Je kunt importeren vanuit Excel, CSV of andere voorraadsystemen. Ons supportteam helpt bij de migratie.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Heb ik speciale hardware nodig?</h4>
              <p className="text-gray-600 text-sm">
                Geen speciale hardware vereist! Gebruik de camera van je telefoon om barcodes te scannen, of sluit bestaande barcodescanners aan via USB.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Welke betaalmethoden accepteren jullie?</h4>
              <p className="text-gray-600 text-sm">
                We accepteren alle grote creditcards (Visa, Mastercard, American Express) en SEPA direct debit voor EU-klanten. Ook Bancontact voor Belgische klanten.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kan ik later meer gebruikers toevoegen?</h4>
              <p className="text-gray-600 text-sm">
                Ja, je kunt altijd gebruikers toevoegen. Extra gebruikers worden gefactureerd tegen €10/maand per gebruiker op Growth en Premium plannen.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <img
                src="/logo.png"
                alt="stockflow"
                className="h-10 md:h-12 mb-6"
                loading="lazy"
                decoding="async"
              />
              <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed max-w-2xl">
                De beste voorraadbeheer software voor bedrijven wereldwijd. 
                Eenvoudig, veilig en zonder verborgen kosten.
              </p>
              
              {/* Security Badges */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700 text-sm font-medium">SSL Versleuteld</span>
                </div>
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 text-sm font-medium">GDPR Compliant</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Snelle Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="/nl/pricing" className="text-gray-400 hover:text-white transition-colors">Prijzen</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Helpcentrum</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Opnemen</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
