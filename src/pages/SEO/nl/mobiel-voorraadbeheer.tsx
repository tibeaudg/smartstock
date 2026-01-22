import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function MobielVoorraadbeheer() {
  const faqData = [
    {
      question: "Wat is mobiel voorraadbeheer?",
      answer: "Mobiel voorraadbeheer stelt u in staat om voorraad te volgen en te beheren vanaf uw smartphone of tablet. U kunt barcodes scannen, voorraadniveaus bijwerken, voorraadstatus controleren en rapporten genereren vanaf overal - of u nu in het magazijn, op de winkelvloer of onderweg bent."
    },
    {
      question: "Kan mobiel voorraadbeheer offline werken?",
      answer: "Ja! StockFlow's mobiele app werkt offline en synchroniseert gegevens wanneer u opnieuw verbinding maakt met internet. Dit is essentieel voor magazijnen of locaties met slechte connectiviteit. U kunt producten scannen, tellingen bijwerken en wijzigingen offline maken - alles synchroniseert automatisch wanneer de verbinding wordt hersteld."
    },
    {
      question: "Heb ik speciale hardware nodig voor mobiel voorraadbeheer?",
      answer: "Geen speciale hardware nodig! StockFlow gebruikt de ingebouwde camera van uw smartphone als barcode scanner. Dit werkt op zowel iOS als Android apparaten. Hoewel speciale barcode scanners kunnen worden gebruikt, is uw telefooncamera perfect geschikt en gratis te gebruiken."
    },
    {
      question: "Is mobiel voorraadbeheer veilig?",
      answer: "Absoluut. StockFlow gebruikt bankniveau encryptie, veilige authenticatie en GDPR-conforme gegevensopslag. Uw voorraadgegevens zijn versleuteld zowel tijdens transport als in rust. Op rollen gebaseerde toegang zorgt ervoor dat alleen geautoriseerde teamleden toegang hebben tot gevoelige informatie."
    },
    {
      question: "Hoe nauwkeurig is mobiele barcode scanning voor voorraad?",
      answer: "Mobiele barcode scanning bereikt 99,9% nauwkeurigheid - veel beter dan handmatige invoer die een foutpercentage van 88% heeft. De camera-gebaseerde scanner leest standaard barcodes (UPC, EAN, Code 128) onmiddellijk en werkt voorraad in real-time bij op alle apparaten. Dit vermindert fouten drastisch en versnelt voorraadoperaties."
    }
  ];

  const mobileFeatures = [
    {
      icon: Smartphone,
      title: "Barcode Scanning",
      description: "Gebruik uw telefooncamera om barcodes onmiddellijk te scannen. Geen dure hardware nodig."
    },
    {
      icon: Wifi,
      title: "Real-Time Synchronisatie",
      description: "Alle updates synchroniseren onmiddellijk op desktop, tablet en mobiele apparaten."
    },
    {
      icon: WifiOff,
      title: "Offline Modus",
      description: "Werk zonder internet. Wijzigingen synchroniseren automatisch wanneer verbinding wordt hersteld."
    },
    {
      icon: Zap,
      title: "Snelle Updates",
      description: "Werk voorraad bij in seconden. Veel sneller dan handmatige invoer of papieren lijsten."
    },
    {
      icon: BarChart3,
      title: "Mobiele Rapporten",
      description: "Bekijk voorraadrapporten, analytics en inzichten op uw mobiele apparaat."
    },
    {
      icon: Shield,
      title: "Veilige Toegang",
      description: "Veilige login met op rollen gebaseerde machtigingen. Enterprise-grade beveiliging."
    }
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "StockFlow - Mobiel Voorraadbeheer",
      "description": "Beheer voorraad vanaf overal met mobiel voorraadbeheer. Real-time updates, barcode scanning met telefooncamera en offline modus. iOS en Android apps beschikbaar.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "iOS, Android, Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Gratis plan omvat mobiele toegang"
      }
    }
  ];
  
  return (
    <SeoPageLayout 
      title="Mobiel Voorraadbeheer"
      heroTitle="Mobiel Voorraadbeheer: Beheer Voorraad Overal"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Mobiel Voorraadbeheer 2026 - Bespaar 40-60% Tijd, 99,9% Nauwkeurigheid | StockFlow"
        description="Mobiel voorraadbeheer 2026 voor iOS en Android. Barcode scanning, offline modus, real-time synchronisatie. Verhoog productiviteit met 40-60%, bereik 99,9% nauwkeurigheid. Gratis plan beschikbaar. Meld u gratis aan - geen creditcard vereist."
        keywords="mobiel voorraadbeheer, mobiel stockbeheer, voorraad mobiele app, onderweg voorraad, mobiele voorraad tracking, voorraad app, mobiel magazijnbeheer, barcode scanner app, stockflow, stock flow"
        url="https://www.stockflowsystems.com/nl/mobiel-voorraadbeheer"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/mobile-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/mobiel-voorraadbeheer' }
        ]}
        structuredData={structuredData}
      />

      <StructuredData data={structuredData} />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          Beheer voorraad vanaf overal met mobiel voorraadbeheer. Real-time updates, barcode scanning en offline modus.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          <strong>Mobiel voorraadbeheer</strong> stelt u in staat om voorraad te volgen en te beheren vanaf uw smartphone of tablet. U kunt barcodes scannen, voorraadniveaus bijwerken, voorraadstatus controleren en rapporten genereren vanaf overal - of u nu in het magazijn, op de winkelvloer of onderweg bent. StockFlow's <Link to="/nl/voorraadbeheer-software" className="text-blue-600 hover:underline font-semibold">voorraadbeheer software</Link> omvat uitgebreide mobiele mogelijkheden.
        </p>
      </div>

      {/* Mobile Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Mobiel Voorraadbeheer Functies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alles wat u nodig heeft om voorraad te beheren vanaf uw smartphone of tablet
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mobileFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Waarom Mobiel Voorraadbeheer Gebruiken?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Beheer Voorraad Overal</h3>
              <p className="text-gray-700 mb-4">
                Controleer voorraadniveaus, scan producten en werk voorraad bij vanaf overal - magazijn, winkelvloer of onderweg. Geen noodzaak om aan een desktop computer gebonden te zijn.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Toegang vanaf elke locatie</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Werk voorraad bij onderweg</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Real-time synchronisatie op alle apparaten</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Sneller & Nauwkeuriger</h3>
              <p className="text-gray-700 mb-4">
                Mobiele barcode scanning is 5x sneller dan handmatige invoer en bereikt 99,9% nauwkeurigheid. Scan producten in seconden en elimineer gegevensinvoerfouten.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">99,9% nauwkeurigheid met barcode scanning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">5x sneller dan handmatige invoer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Geen papieren lijsten of spreadsheets nodig</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Mobiel Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt mobiel voorraadbeheer. Geen creditcard vereist.
          </p>
          <Link 
            to="/auth" 
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Gratis Met StockFlow →
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}


