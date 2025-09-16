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

export default function WarehouseManagementSystemHungary() {
  usePageRefresh();
  const { t } = useTranslation();
  
  const baseUrl = 'https://www.stockflow.be';
  const language = 'hu';
  const hreflangUrls = generateHreflangUrls(baseUrl, '/warehouse-management-system-hungary');
  const structuredData = generateInternationalStructuredData(language, baseUrl);
  const countryKeywords = getCountryKeywords(language);
  const wmsKeywords = getWMSKeywords(language);

  const faqData = [
    {
      question: "Miért válasszam a StockFlow-t Magyarországon?",
      answer: "A StockFlow a legjobb raktárkezelő rendszer Magyarországon, amelyet kifejezetten magyar KKV-k számára fejlesztettünk. Ingyenes, könnyen használható és teljes mértékben magyar nyelvű támogatást nyújt."
    },
    {
      question: "Ingyenes a StockFlow Magyarországon?",
      answer: "Igen, a StockFlow teljesen ingyenes magyar vállalkozások számára. Nincsenek rejtett költségek, előfizetési díjak vagy korlátok. Azonnal elkezdheti használni."
    },
    {
      question: "Milyen funkciókat kínál a StockFlow Magyarországon?",
      answer: "A StockFlow Magyarországon teljes raktárkezelő rendszert kínál: barcode szkennelés, valós idejű készletkövetés, automatikus újraszámítás, jelentések és elemzések, valamint mobil hozzáférés."
    },
    {
      question: "Hogyan kezdjem el a StockFlow használatát Magyarországon?",
      answer: "Egyszerűen regisztráljon a StockFlow weboldalán, hozza létre fiókját, és azonnal elkezdheti használni a raktárkezelő rendszert. Nincs telepítés vagy bonyolult beállítás szükséges."
    },
    {
      question: "Támogatja a StockFlow a magyar adórendszert?",
      answer: "Igen, a StockFlow teljes mértékben kompatibilis a magyar adórendszerrel és a helyi számviteli követelményekkel. Könnyen integrálható a meglévő számviteli rendszerekkel."
    }
  ];

  return (
    <SeoPageLayout>
      <SEO
        title="Raktárkezelő Rendszer Magyarországon | StockFlow WMS"
        description="A legjobb raktárkezelő rendszer Magyarországon. Ingyenes WMS szoftver magyar KKV-k számára. Barcode szkennelés, valós idejű készletkövetés és automatikus raktárkezelés."
        keywords={[...countryKeywords, ...wmsKeywords].join(', ')}
        url={`${baseUrl}/warehouse-management-system-hungary`}
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
                Raktárkezelő Rendszer <span className="text-blue-600">Magyarországon</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                A legjobb ingyenes WMS szoftver magyar KKV-k számára. 
                Barcode szkennelés, valós idejű készletkövetés és automatikus raktárkezelés.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                <Rocket className="h-5 w-5 mr-2" />
                Ingyenes Kezdés
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 px-8 py-4">
                <Play className="h-5 w-5 mr-2" />
                Demo Megtekintése
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.8/5 értékelés alapján</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">3200+ aktív felhasználó</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Miért válassza a StockFlow-t Magyarországon?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A legfejlettebb raktárkezelő rendszer Magyarországon, amelyet kifejezetten magyar vállalkozások számára fejlesztettünk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scan className="h-8 w-8 text-blue-600" />,
                title: "Barcode Szkennelés",
                description: "Gyors és pontos termékazonosítás barcode szkenneléssel. Több mint 1000 termék/óra feldolgozási kapacitás."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Valós Idejű Elemzés",
                description: "Részletes jelentések és elemzések a raktár teljesítményéről. Magyar nyelvű dashboard és jelentések."
              },
              {
                icon: <Smartphone className="h-8 w-8 text-blue-600" />,
                title: "Mobil Hozzáférés",
                description: "Raktárkezelés bárhonnan mobil eszközről. Teljes funkcionalitás iOS és Android rendszereken."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Magyar Adórendszer",
                description: "Teljes kompatibilitás a magyar adórendszerrel és számviteli követelményekkel. NAV integráció."
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Többfelhasználós",
                description: "Korlátlan felhasználó számú hozzáférés. Szerepkör-alapú jogosultságok és audit trail."
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "Automatizálás",
                description: "Automatikus készletújraszámítás, rendelési pontok és értesítések. Munkafolyamat automatizálás."
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
              Gyakran Ismételt Kérdések
            </h2>
            <p className="text-xl text-gray-600">
              Minden, amit tudnia kell a StockFlow raktárkezelő rendszerről Magyarországon
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
              Készen áll a raktárkezelés átalakítására Magyarországon?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Csatlakozzon a már StockFlow-t használó magyar vállalkozásokhoz. 
              Ingyenes regisztráció, azonnali használat.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              <Rocket className="h-5 w-5 mr-2" />
              Ingyenes Próbaverzió Indítása
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
