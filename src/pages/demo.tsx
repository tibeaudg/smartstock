import React, { useState } from 'react';
import { Header } from '@/components/HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, ArrowRight, CheckCircle, Star, Zap, Shield, BarChart3, 
  Package, Users, Clock, Target, TrendingUp, Smartphone, 
  Monitor, Database, Settings, Download, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { logger } from '../lib/logger';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';

// Fade-in animation component
const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

// Step component for instruction guide
const InstructionStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  isActive = false 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon: any; 
  isActive?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: number * 0.1 }}
    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-500">Stap {number}</span>
          {isActive && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Actief</Badge>}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Feature highlight component
const FeatureHighlight = ({ 
  icon: Icon, 
  title, 
  description, 
  benefits 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  benefits: string[]; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <ul className="space-y-2">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const DemoPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const handleLoginClick = () => {
    logger.info('Demo page CTA clicked', { source: 'demo_page' });
    navigate('/auth');
  };

  const handleVideoPlay = () => {
    logger.info('Demo video play', { id: 'demo-page-video' });
    
    // Track Google Ads conversion for video engagement
    GoogleAdsTracking.trackCustomConversion(
      'video_play',
      'AW-17574614935',
      2,
      {
        video_name: 'demo_page_video',
        video_location: 'demo_page',
        conversion_type: 'video_engagement'
      }
    );
  };

  const instructionSteps = [
    {
      number: 1,
      title: "Registreer je account",
      description: "Maak een gratis account aan in minder dan 2 minuten. Geen creditcard vereist.",
      icon: Users
    },
    {
      number: 2,
      title: "Stel je eerste vestiging in",
      description: "Configureer je bedrijfsgegevens en eerste vestiging voor je voorraadbeheer.",
      icon: Settings
    },
    {
      number: 3,
      title: "Voeg je producten toe",
      description: "Importeer je producten via Excel of voeg ze handmatig toe met onze intuïtieve interface.",
      icon: Package
    },
    {
      number: 4,
      title: "Start met scannen",
      description: "Gebruik je smartphone of scanner om voorraadmutaties bij te houden in real-time.",
      icon: Smartphone
    },
    {
      number: 5,
      title: "Analyseer je data",
      description: "Bekijk rapporten en inzichten om je voorraadbeheer te optimaliseren.",
      icon: BarChart3
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Mobiel Voorraadbeheer",
      description: "Beheer je voorraad overal met onze mobiele app. Scan barcodes, update voorraad en bekijk rapporten op je telefoon.",
      benefits: [
        "Barcode scanning met je telefoon",
        "Offline werken mogelijk",
        "Real-time synchronisatie",
        "Intuïtieve mobiele interface"
      ]
    },
    {
      icon: BarChart3,
      title: "Geavanceerde Rapportage",
      description: "Krijg inzicht in je voorraad met gedetailleerde rapporten en analytics. Maak betere beslissingen met data.",
      benefits: [
        "Real-time voorraadrapporten",
        "Trend analyse en voorspellingen",
        "Export naar Excel/PDF",
        "Aangepaste dashboard widgets"
      ]
    },
    {
      icon: Shield,
      title: "Veilige Cloud Opslag",
      description: "Je data wordt veilig opgeslagen in de cloud met automatische backups en enterprise-grade beveiliging.",
      benefits: [
        "Automatische dagelijkse backups",
        "SSL encryptie voor alle data",
        "GDPR compliant",
        "99.9% uptime garantie"
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Demo - StockFlow Voorraadbeheer Software"
        description="Bekijk onze demo en ontdek hoe eenvoudig het is om je voorraad te beheren met StockFlow. Stap-voor-stap instructies en live demo video."
        keywords="demo, voorraadbeheer demo, stockbeheer software demo, inventory management demo"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Play className="h-4 w-4" />
                  <span>Live Demo</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="block text-gray-900">Ontdek StockFlow</span>
                  <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                    In Actie
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Zie hoe eenvoudig het is om je voorraad te beheren met onze intuïtieve software. 
                  Bekijk de demo en volg onze stap-voor-stap instructies.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Video Section */}
            <FadeInWhenVisible delay={200}>
              <div className="relative max-w-5xl mx-auto mb-16">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <video 
                      controls 
                      poster="/Inventory-Management.png" 
                      className="w-full h-full object-cover"
                      preload="none"
                      onPlay={handleVideoPlay}
                    >
                      <source src="/intro_vid.mp4" type="video/mp4" />
                      Video niet beschikbaar
                    </video>
                  </div>
                </div>
                
                {/* Video overlay info */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>Demo Video</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Zo Begin Je
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Volg deze eenvoudige stappen om direct aan de slag te gaan met StockFlow
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {instructionSteps.map((step, index) => (
                <InstructionStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  isActive={activeStep === step.number}
                />
              ))}
            </div>

            <FadeInWhenVisible delay={400}>
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleLoginClick}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Nu Gratis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Belangrijkste Functionaliteiten
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Ontdek de krachtige features die StockFlow tot de beste voorraadbeheer software maken
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureHighlight
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  benefits={feature.benefits}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Probeer Het Zelf
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Start direct met een gratis account en ervaar de kracht van StockFlow
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeInWhenVisible delay={200}>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Geen Setup Kosten</h3>
                      <p className="text-gray-600">Start direct zonder verborgen kosten</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">5 Minuten Setup</h3>
                      <p className="text-gray-600">Je bent binnen 5 minuten klaar om te beginnen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Gratis Proberen</h3>
                      <p className="text-gray-600">Test alle features zonder verplichtingen</p>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={400}>
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Start Je Gratis Account
                    </CardTitle>
                    <p className="text-gray-600">
                      Geen creditcard vereist • Direct toegang
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      onClick={handleLoginClick}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Gratis Account Aanmaken
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Al een account?{' '}
                        <button 
                          onClick={handleLoginClick}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Inloggen
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Klaar om te Beginnen?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Sluit je aan bij honderden bedrijven die al hun voorraad beheren met StockFlow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={handleLoginClick}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Start Gratis
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold transition-all duration-300"
                  onClick={() => navigate('/contact')}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Contact Opnemen
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </div>
    </>
  );
};

export default DemoPage;
