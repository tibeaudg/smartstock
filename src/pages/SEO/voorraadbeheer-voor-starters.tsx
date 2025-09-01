import React from 'react';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { BookOpen, Target, TrendingUp, Shield, Users, Rocket, Check } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerVoorStarters() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Hoe begin ik met voorraadbeheer als starter?",
      answer: "Begin met een eenvoudige administratie van je belangrijkste producten. Gebruik een simpele lijst of app om je producten en aantallen bij te houden. Start klein en groei geleidelijk naarmate je bedrijf groeit."
    },
    {
      question: "Welke voorraadbeheer software is geschikt voor starters?",
      answer: "Voor starters is het belangrijk om te kiezen voor schaalbare software zoals stockflow. Start gratis en upgrade als je bedrijf groeit. Zo betaal je nooit te veel en groei je mee met je behoeften."
    },
    {
      question: "Hoe vaak moet ik mijn voorraad controleren?",
      answer: "Plan vaste momenten om je voorraad te tellen en bij te werken. Voor starters is het aan te raden om dit wekelijks of tweewekelijks te doen. Dit voorkomt tekorten en overstock."
    },
    {
      question: "Wat zijn de belangrijkste voorraadbeheer tips voor starters?",
      answer: "Start klein, gebruik consistente naamgeving, stel minimumvoorraad niveaus in, plan regelmatige controles, houd rekening met seizoensinvloeden en integreer voorraadbeheer in je dagelijkse routine."
    }
  ];

  const steps = [
    {
      icon: BookOpen,
      title: "Begin met een eenvoudige administratie",
      description: "Gebruik een simpele lijst of app om je producten en aantallen bij te houden. Start met je belangrijkste producten.",
      color: "blue"
    },
    {
      icon: Target,
      title: "Controleer je voorraad regelmatig",
      description: "Plan vaste momenten om je voorraad te tellen en bij te werken. Dit voorkomt tekorten en overstock.",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Kies voor schaalbare software",
      description: "Start gratis met stockflow en upgrade als je bedrijf groeit. Zo betaal je nooit te veel.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Stel procedures in",
      description: "Maak duidelijke afspraken over hoe je voorraad wordt bijgehouden en gecontroleerd.",
      color: "orange"
    },
    {
      icon: Users,
      title: "Train je team",
      description: "Zorg dat iedereen weet hoe het systeem werkt en waarom voorraadbeheer belangrijk is.",
      color: "red"
    },
    {
      icon: Rocket,
      title: "Evalueer en optimaliseer",
      description: "Bekijk regelmatig wat goed werkt en wat beter kan. Blijf je proces verbeteren.",
      color: "indigo"
    }
  ];

  const tips = [
    "Start klein en groei geleidelijk",
    "Gebruik consistente naamgeving voor producten",
    "Stel minimumvoorraad niveaus in",
    "Plan regelmatige voorraadcontroles",
    "Houd rekening met seizoensinvloeden",
    "Integreer voorraadbeheer in je dagelijkse routine"
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer voor Starters">
      <SEO
        title="Voorraadbeheer voor Starters | Complete Gids voor KMO's | stockflow"
        description="Voorraadbeheer voor starters: complete gids met tips en stappenplan voor kleine bedrijven en zelfstandigen. Leer hoe je eenvoudig begint met professioneel voorraadbeheer."
        keywords="voorraadbeheer starters, voorraadbeheer kleine bedrijven, voorraadbeheer beginnen, voorraadbeheer tips, voorraadbeheer stappenplan, voorraadbeheer KMO, voorraadbeheer zelfstandigen, voorraadbeheer beginners, voorraadbeheer opzetten, voorraadbeheer implementeren, stockbeheer starters, stockbeheer kleine bedrijven, voorraadbeheer gids, voorraadbeheer handleiding"
        url="https://www.stockflow.be/voorraadbeheer-voor-starters"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer voor Starters</span> - Complete gids
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Start je een eigen bedrijf? Goed voorraadbeheer is essentieel, ook voor kleine bedrijven en zelfstandigen. Met deze complete gids zet je eenvoudig de eerste stappen naar professioneel stockbeheer. Leer hoe je voorraadbeheer voor starters kunt implementeren zonder overweldigd te raken.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Voorraadbeheer voor Starters" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer voor Starters Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Team Samenwerking" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom voorraadbeheer voor starters?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Als starter is het cruciaal om vanaf het begin goed voorraadbeheer op te zetten. Het voorkomt tekorten, bespaart kosten en geeft je inzicht in je bedrijf. Met de juiste aanpak kun je als kleine onderneming net zo professioneel werken als grote bedrijven.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Kostenbesparing voor starters</h3>
                  <p className="text-gray-700">Voorraadbeheer voor starters helpt je om <span className="text-blue-600 font-semibold">voorraadkosten</span> te minimaliseren door betere planning en controle.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Voorkom tekorten en overstock</h3>
                  <p className="text-gray-700">Met voorraadbeheer voor starters heb je altijd de juiste producten op voorraad, zonder onnodige voorraadkosten.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Professionele uitstraling</h3>
                  <p className="text-gray-700">Voorraadbeheer voor starters geeft je een professionele uitstraling en betere klanttevredenheid.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                Stappenplan: Voorraadbeheer voor starters
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Volg dit stappenplan om voorraadbeheer voor starters succesvol te implementeren:
              </p>
              
              <div className="space-y-6">
                {steps.slice(0, 2).map((step, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">{index + 1}. {step.title}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Barcode Scanning" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starting with Stock Management Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Side - Large Image */}
            <div className="lg:col-span-2">
              <div className=" rounded-lg">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Modern Magazijn" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Implementeer voorraadbeheer voor starters stap voor stap
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Begin met één stap tegelijk om overweldiging te voorkomen. Start met een eenvoudige administratie, dan voeg je regelmatige controles toe, en vervolgens implementeer je schaalbare software. Voorraadbeheer voor starters is geschikt voor bedrijven van alle groottes en kan direct worden toegepast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van voorraadbeheer voor starters
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing voor starters</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor starters helpt je om tot 20% te besparen op voorraadkosten. Voorkom overstock en tekorten door betere planning en controle. Deze besparingen kunnen direct worden geïnvesteerd in de groei van je bedrijf.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Tijdsbesparing en efficiëntie</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor starters bespaart je uren per week op administratie. Automatiseer processen en focus je tijd op wat echt belangrijk is: het laten groeien van je bedrijf en het bedienen van je klanten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Voorraadbeheer voor Starters
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van professioneel voorraadbeheer voor starters zonder kosten.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist • Direct toegang • Nederlandse support</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-1 h-16 bg-blue-600 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Voorraadbeheer voor starters - Complete gids voor Vlaamse KMO's.
            Eenvoudig, veilig en zonder verborgen kosten.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer voor starters voor Vlaamse KMO's.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          ${faqData.map(faq => `{
            "@type": "Question",
            "name": "${faq.question}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${faq.answer}"
            }
          }`).join(',')}
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Voorraadbeheer voor Starters | Complete Gids voor KMO's",
        "description": "Voorraadbeheer voor starters: complete gids met tips en stappenplan voor kleine bedrijven en zelfstandigen. Leer hoe je eenvoudig begint met professioneel voorraadbeheer.",
        "image": "https://www.stockflow.be/optimized/Inventory-Management.png",
        "author": {
          "@type": "Organization",
          "name": "stockflow"
        },
        "publisher": {
          "@type": "Organization",
          "name": "stockflow",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/voorraadbeheer-voor-starters"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
} 
