
import React from 'react';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, BarChart3, Users, Shield, CheckCircle, ArrowRight, Check, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Package,
      title: 'SmartStock',
      description: 'Volg voorraadniveaus, beheer producten en automatiseer voorraadwaarschuwingen met gemak.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Krijg real-time inzichten in uw voorraadprestaties en trends.',
    },
    {
      icon: Users,
      title: 'Teamsamenwerking',
      description: 'Meerdere gebruikersrollen en machtigingen voor naadloos teambeheer.',
    },
    {
      icon: Shield,
      title: 'Veilig & Betrouwbaar',
      description: 'Beveiliging op bedrijfsniveau met cloud-gebaseerde back-up en herstel.',
    },
  ];

  const benefits = [
    'Verlaag voorraadkosten tot 30%',
    'Elimineer voorraadtekorten en overvoorraden',
    'Real-time voorraadvolging over meerdere locaties',
    'Geautomatiseerde herbestellingsmeldingen',
    'Uitgebreide rapportage en analyses',
    'Mobiel-vriendelijke interface voor onderweg',
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '€0',
      period: '/maand',
      description: 'Perfect om te beginnen met SmartStock',
      features: [
        'Tot 30 verschillende producten',
        'Basis voorraadvolging',
        'E-mailondersteuning',
      ],
      popular: false,
    },
    {
      name: 'Starter',
      price: '€4',
      period: '/maand',
      description: 'Voor kleine bedrijven die hun voorraad willen uitbreiden',
      features: [
        'Tot 150 verschillende producten',
        'Geavanceerde analyses',
        'Prioritaire ondersteuning',
      ],
      popular: true,
    },
    {
      name: 'Business',
      price: '€12',
      period: '/maand',
      description: 'Ideaal voor groeiende bedrijven met meer complexe behoeften',
      features: [
        'Tot 500 verschillende producten',
        'Uitgebreide rapportage',
        'Toegewijde ondersteuning',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: '€39',
      period: '/maand',
      description: 'Voor grote organisaties met onbeperkte mogelijkheden',
      features: [
        'Tot 1.000 verschillende producten',
        'On-premise implementatie',
        '24/7 telefonische support',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Smartstock: Eenvoudig & Gratis Stockbeheer voor KMO's | Slim Voorraadbeheer</title>
        <meta name="description" content="Eenvoudig, gratis en slim stockbeheer voor KMO's en zelfstandigen. Probeer SmartStock en ontdek de beste stockbeheer app voor Vlaanderen!" />
        <meta name="keywords" content="stockbeheer, gratis stockbeheer, stockbeheer app, voorraadbeheer, KMO, eenvoudig voorraadbeheer, voorraad app, voorraadbeheer Vlaanderen, voorraadbeheer Gent, voorraadbeheer Brugge, voorraadbeheer Antwerpen" />
        <link rel="canonical" href="https://www.smartstock.be/" />
        {/* Open Graph tags */}
        <meta property="og:title" content="Smartstock: Eenvoudig & Gratis Stockbeheer voor KMO's" />
        <meta property="og:description" content="Eenvoudig, gratis en slim stockbeheer voor KMO's en zelfstandigen. Probeer SmartStock en ontdek de beste stockbeheer app voor Vlaanderen!" />
        <meta property="og:image" content="https://www.smartstock.be/Inventory-Management.png" />
        <meta property="og:url" content="https://www.smartstock.be/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smartstock: Eenvoudig & Gratis Stockbeheer voor KMO's" />
        <meta name="twitter:description" content="Eenvoudig, gratis en slim stockbeheer voor KMO's en zelfstandigen. Probeer SmartStock en ontdek de beste stockbeheer app voor Vlaanderen!" />
        <meta name="twitter:image" content="https://www.smartstock.be/Inventory-Management.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SmartStock",
            "image": "https://www.smartstock.be/logo.png",
            "@id": "https://www.smartstock.be/",
            "url": "https://www.smartstock.be/",
            "telephone": "+32-123-456-789",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Voorbeeldstraat 1",
              "addressLocality": "Gent",
              "postalCode": "9000",
              "addressCountry": "BE"
            },
            "description": "Eenvoudig stockbeheer.",
            "areaServed": ["Gent", "Brugge", "Antwerpen", "Vlaanderen"]
          }
        `}</script>
      </Helmet>
      <Header 
        onLoginClick={handleLoginClick}
        onNavigate={scrollToSection}
        simplifiedNav={true} // nav: Home, Diensten, Over Ons, Blog, Contact
      />
        {/* Hero Section */}
      <section 
        className="py-60 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url("/Inventory-Management.png")' }}
        aria-label="Hero sectie over eenvoudig stockbeheer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-35"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Eenvoudig stockbeheer 
            </h1>
            <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
              SmartStock is dé <strong>gratis stockbeheer app</strong> voor KMO's, zelfstandigen en kleine bedrijven in Vlaanderen. Beheer je voorraad eenvoudig, snel en veilig. Start vandaag nog met <a href="/gratis-stockbeheer" className="text-blue-700 underline">gratis stockbeheer</a> en ontdek waarom steeds meer ondernemers kiezen voor <a href="/simpelstockbeheer" className="text-blue-700 underline">simpel stockbeheer</a> met SmartStock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-8">
              <Button size="lg" className="text-lg px-10 py-5 bg-blue-700 hover:bg-white hover:text-blue-700 text-white font-bold shadow-lg border border-blue-700 focus:ring-4 focus:ring-yellow-300 transition-all duration-200" onClick={handleLoginClick} style={{boxShadow: '0 8px 32px rgba(255,193,7,0.25)'}}>
                Start Hier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Hoe Werkt Gratis Stockbeheer met SmartStock?</h2>
          <div className="flex justify-center">
            <video
              src="/intro_vid.mp4"
              controls
              // loading="lazy" // Niet standaard ondersteund voor <video>, optimalisatie kan via JS of plugin
              className="rounded-xl shadow-lg w-full max-w-3xl"
              poster="/videobanner.jpg"
              aria-label="Introductievideo: eenvoudig en gratis stockbeheer voor KMO's"
            >
              Uw browser ondersteunt de video tag niet.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alles Wat U Nodig Heeft Voor SmartStock
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ons uitgebreide platform biedt alle tools die u nodig heeft om uw SmartStock te optimaliseren.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" aria-label={feature.title} />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eenvoudige, Transparante Prijzen
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Meest Populair
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Waarom Kiezen Voor SmartStock?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-xl text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">Start Gratis</h3>
                <p className="text-blue-100">Geen creditcard vereist!</p>
              </div>
              <Button className="w-full text-lg py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-lg border-4 border-white focus:ring-4 focus:ring-yellow-300 transition-all duration-200" onClick={handleLoginClick} style={{boxShadow: '0 8px 32px rgba(255,193,7,0.25)'}}>
                Start Hier
              </Button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Instellen in minder dan 1 minuut
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neem Contact Op
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Heeft u vragen? We horen graag van u. Stuur ons een bericht en we reageren zo snel mogelijk.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Voornaam
                    </label>
                    <Input id="firstName" placeholder="Jan" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Achternaam
                    </label>
                    <Input id="lastName" placeholder="Janssen" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <Input id="email" type="email" placeholder="jan@bedrijf.be" />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrijf
                  </label>
                  <Input id="company" placeholder="Uw Bedrijf" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Bericht
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Vertel ons over uw voorraadbeheerbehoeften..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full">
                  Verstuur Bericht
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contactinformatie</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" aria-label="E-mail" />
                    <span className="text-gray-700">info@smartstock.be</span>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SmartStock</h3>
            <p className="text-gray-400 mb-8">
              Professioneel voorraadbeheer voor KMO's
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <Link to="/privacybeleid" className="hover:text-blue-400 transition-colors">Privacybeleid</Link>
              <Link to="/gebruiksvoorwaarden" className="hover:text-blue-400 transition-colors">Gebruiksvoorwaarden</Link>
              <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Ondersteuning</Link>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2024 SmartStock. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
