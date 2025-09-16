import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SeoPageLayout from '@/components/SeoPageLayout';
import SEO from '@/components/SEO';
import { generateHreflangUrls, generateInternationalStructuredData, getCountryKeywords, getWMSKeywords } from '@/utils/seoUtils';
import { Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, CheckCircle, MessageCircle, Rocket, Crown, Sparkles, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/OptimizedImage';

export default function WarehouseManagementSystemSweden() {
  usePageRefresh();
  const { t } = useTranslation();
  
  const baseUrl = 'https://www.stockflow.be';
  const language = 'sv';
  const hreflangUrls = generateHreflangUrls(baseUrl, '/warehouse-management-system-sweden');
  const structuredData = generateInternationalStructuredData(language, baseUrl);
  const countryKeywords = getCountryKeywords(language);
  const wmsKeywords = getWMSKeywords(language);

  const faqData = [
    {
      question: "Varför välja StockFlow i Sverige?",
      answer: "StockFlow är det bästa lagerhanteringssystemet i Sverige, utvecklat specifikt för svenska små och medelstora företag. Det är gratis, lättanvänt och erbjuder fullständig svensk språkstöd."
    },
    {
      question: "Är StockFlow gratis i Sverige?",
      answer: "Ja, StockFlow är helt gratis för svenska företag. Inga dolda kostnader, prenumerationer eller begränsningar. Börja använda det direkt."
    },
    {
      question: "Vilka funktioner erbjuder StockFlow i Sverige?",
      answer: "StockFlow i Sverige erbjuder komplett lagerhanteringssystem: streckkodsskanning, realtidslagerföljning, automatisk omräkning, rapporter och analyser, samt mobilåtkomst."
    },
    {
      question: "Hur börjar jag använda StockFlow i Sverige?",
      answer: "Registrera dig enkelt på StockFlow-webbplatsen, skapa ditt konto och börja använda lagerhanteringssystemet direkt. Ingen installation eller komplicerad konfiguration krävs."
    },
    {
      question: "Stöder StockFlow svenska skattesystem?",
      answer: "Ja, StockFlow är helt kompatibelt med svenska skattesystemet och lokala redovisningskrav. Lätt att integrera med befintliga redovisningssystem."
    }
  ];

  return (
    <SeoPageLayout>
      <SEO
        title="Lagerhanteringssystem i Sverige | StockFlow WMS"
        description="Det bästa lagerhanteringssystemet i Sverige. Gratis WMS-programvara för svenska små och medelstora företag. Streckkodsskanning, realtidslagerföljning och automatisk lagerhantering."
        keywords={[...countryKeywords, ...wmsKeywords].join(', ')}
        url={`${baseUrl}/warehouse-management-system-sweden`}
        hreflang={hreflangUrls}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Lagerhanteringssystem <span className="text-blue-600">i Sverige</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Det bästa gratis WMS-programvaran för svenska små och medelstora företag. 
                Streckkodsskanning, realtidslagerföljning och automatisk lagerhantering.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                <Rocket className="h-5 w-5 mr-2" />
                Börja Gratis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 px-8 py-4">
                <Play className="h-5 w-5 mr-2" />
                Se Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.8/5 baserat på recensioner</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">3200+ aktiva användare</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Varför välja StockFlow i Sverige?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Det mest avancerade lagerhanteringssystemet i Sverige, utvecklat specifikt för svenska företag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scan className="h-8 w-8 text-blue-600" />,
                title: "Streckkodsskanning",
                description: "Snabb och exakt produktidentifiering med streckkodsskanning. Mer än 1000 produkter/timme bearbetningskapacitet."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Realtidsanalys",
                description: "Detaljerade rapporter och analyser av lagerprestanda. Svenskt språkstöd för dashboard och rapporter."
              },
              {
                icon: <Smartphone className="h-8 w-8 text-blue-600" />,
                title: "Mobilåtkomst",
                description: "Lagerhantering från var som helst med mobil enhet. Full funktionalitet på iOS och Android."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Svenskt Skattesystem",
                description: "Full kompatibilitet med svenska skattesystemet och redovisningskrav. Skatteverket integration."
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Fleranvändare",
                description: "Obegränsat antal användare. Rollbaserade behörigheter och granskningsspår."
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "Automatisering",
                description: "Automatisk lageromräkning, beställningspunkter och notifieringar. Arbetsflödesautomatisering."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vanliga Frågor
            </h2>
            <p className="text-xl text-gray-600">
              Allt du behöver veta om StockFlow lagerhanteringssystem i Sverige
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Redo att förvandla din lagerhantering i Sverige?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Gå med tusentals svenska företag som redan använder StockFlow. 
              Gratis registrering, omedelbar användning.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              <Rocket className="h-5 w-5 mr-2" />
              Starta Gratis Provperiod
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </SeoPageLayout>
  );
}
