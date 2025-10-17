import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();



     const faqData = [
     {
       question: "Wat is Stockbeheer?",
       answer: "Stockbeheer is een digitaal systeem dat je helpt bij het beheren van je voorraad. Het vervangt handmatige processen door geautomatiseerde oplossingen die real-time inzicht geven in je voorraad, automatische bestellingen plaatsen en je magazijn effici�nt beheren."
     },
     {
       question: "Hoe werkt Stockbeheer?",
       answer: "Stockbeheer werkt door je voorraad digitaal bij te houden, automatische bestellingen te plaatsen wanneer voorraad onder het minimum niveau komt, en real-time rapportages te genereren. Het systeem integreert met je andere bedrijfssystemen voor optimale effici�ntie."
     },
     {
       question: "Welke voordelen biedt Stockbeheer?",
       answer: "Stockbeheer biedt tal van voordelen: kostenbesparing door optimale voorraadniveaus, verhoogde klanttevredenheid door betere beschikbaarheid, real-time inzicht in voorraad, automatische bestellingen en integratie met andere bedrijfssystemen."
     },
     {
       question: "Is Stockbeheer geschikt voor kleine bedrijven?",
       answer: "Ja, Stockbeheer is geschikt voor bedrijven van alle groottes. Moderne Stockbeheer biedt schaalbare oplossingen die groeien met je bedrijf, van eenvoudige voorraadbeheer voor starters tot uitgebreide WMS-systemen voor grote organisaties."
     }
   ];


  return (
         <SeoPageLayout
       title="Stockbeheer">
      <SEO
        title="Gratis Stockbeheer voor Kleine Ondernemers | stockflow"
        description="Beheer je voorraad eenvoudig online. Gratis stockbeheer voor winkels, horeca en zelfstandigen. Start direct met stockflow – geen kosten."
        keywords="stockbeheer, gratis stockbeheer, voorraadbeheer software, stockbeheer programma, magazijnbeheer software, inventarisatie software, stockbeheer app, voorraadbeheer app, stockflow, gratis voorraadbeheer, KMO software, kleine onderneming software"
        url="https://www.stockflow.be/stockbeheer"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
                             <h1 className="text-4xl md:text-5xl font-bold mb-6">
                 <span className="text-blue-600">Stockbeheer</span> voor optimale controle
               </h1>
               <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                 Moderne Stockbeheer is essentieel voor elke onderneming die producten verkoopt. Met de juiste Stockbeheer kun je real-time inzicht krijgen in je voorraad, automatische bestellingen plaatsen en je magazijn effici�nt beheren. Stockbeheer helpt je om kosten te besparen, klanttevredenheid te verhogen en je bedrijfsprocessen te optimaliseren. Ontdek hoe Stockbeheer jouw bedrijf kan transformeren.
               </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                                 <img 
                   src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                   alt="Stockbeheer" 
                   className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer Section */}
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
                 Wat is Stockbeheer en <span className="text-blue-600">waarom heb je het nodig?</span>
               </h2>
               <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                 Stockbeheer is een digitaal systeem dat je helpt bij het beheren van je voorraad. Het vervangt handmatige processen en Excel-sheets door geautomatiseerde oplossingen. Met Stockbeheer kun je real-time bijhouden welke producten je hebt, wanneer je moet bestellen en hoe je magazijn het beste georganiseerd kan worden. Stockbeheer is onmisbaar voor moderne bedrijven die effici�nt willen werken.
               </p>
              <div className="space-y-4">
                                 <div className="bg-blue-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-blue-800 mb-2">Kostenbesparing met Stockbeheer</h3>
                   <p className="text-gray-700">Stockbeheer helpt je om <span className="text-blue-600 font-semibold">voorraadkosten</span> te minimaliseren door automatische bestellingen en optimale voorraadniveaus.</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-green-800 mb-2">Klanttevredenheid verhogen</h3>
                   <p className="text-gray-700">Met Stockbeheer heb je altijd de juiste producten op voorraad, waardoor je klanten tevreden blijven.</p>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-purple-800 mb-2">Real-time inzicht in voorraad</h3>
                   <p className="text-gray-700">Stockbeheer geeft je real-time inzicht in je voorraad, zodat je altijd weet wat er beschikbaar is.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Different Methods Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
                             <h2 className="text-3xl font-bold mb-6 text-blue-600">
                 Stockbeheer methodes en strategie�n
               </h2>
               <p className="text-lg text-gray-700 mb-8">
                 Moderne Stockbeheer ondersteunt verschillende methodes. Hier zijn de meest gebruikte voorraadbeheer strategie�n:
               </p>
              
              <div className="space-y-6">
                                 <div className="border-l-4 border-blue-500 pl-6">
                   <h3 className="text-xl font-bold mb-3">JUST IN TIME met Stockbeheer:</h3>
                   <p className="text-gray-700 leading-relaxed">
                     Stockbeheer maakt Just-in-Time voorraadbeheer mogelijk door automatische bestellingen te plaatsen wanneer voorraad onder het minimum niveau komt. Deze methode minimaliseert voorraadkosten en optimaliseert je magazijnruimte. Stockbeheer zorgt ervoor dat je producten "precies op tijd" binnenkomen en direct naar klanten kunnen worden verzonden.
                   </p>
                 </div>
                 
                 <div className="border-l-4 border-green-500 pl-6">
                   <h3 className="text-xl font-bold mb-3">LIFO met Stockbeheer:</h3>
                   <p className="text-gray-700 leading-relaxed">
                     Stockbeheer ondersteunt LIFO (Last-In, First-Out) methodes door automatisch de laatst binnengekomen producten als eerste te verkopen. Dit is vooral nuttig voor producten met houdbaarheidsdata of seizoensgebonden artikelen. Stockbeheer houdt precies bij welke producten wanneer zijn binnengekomen.
                   </p>
                 </div>
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
                 Starten met <span className="text-blue-600">Stockbeheer</span>
               </h2>
               <p className="text-lg text-gray-700 leading-relaxed">
                 De tijd van handmatige voorraadadministratie en Excel-sheets is voorbij. Moderne Stockbeheer biedt geavanceerde functionaliteiten die je bedrijf naar een hoger niveau tillen. Met Stockbeheer integreer je eenvoudig je CRM, orderbeheer, facturatie en boekhouding in ��n systeem. Stockbeheer is geschikt voor zowel kleine bedrijven als grote organisaties met uitgebreide magazijnbehoeften.
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
               <span className="text-blue-600">Voordelen</span> van Stockbeheer
             </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
                         <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4">Integratie met Stockbeheer</h3>
               <p className="text-gray-700">
                 Stockbeheer kan eenvoudig gekoppeld worden aan andere bedrijfssystemen. Deze integraties zorgen ervoor dat informatie automatisch wordt gesynchroniseerd tussen je Stockbeheer en andere tools zoals boekhouding, webshops en leverancierssystemen.
               </p>
             </div>
             
             <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4">Verbeterde klantservice met Stockbeheer</h3>
               <p className="text-gray-700">
                 Stockbeheer geeft je klanten real-time informatie over beschikbare voorraad. Wanneer producten niet op voorraad zijn, kan Stockbeheer automatisch de verwachte levertijd van leveranciers tonen, wat de klanttevredenheid verhoogt.
               </p>
             </div>
          </div>
        </div>
      </section>


      {/* FINAL CTA - Compact op mobiel */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
                     <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
             Start Vandaag Met Stockbeheer
           </h2>
           <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
             Sluit je aan bij honderden KMO's die al profiteren van professionele Stockbeheer zonder kosten.
           </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist � Direct toegang � Nederlandse support</p>
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


      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
                     <img
             src="/logo.png"
             alt="stockflow"
             className="h-10 md:h-12 mx-auto mb-6"
           />
                     <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
             De beste Stockbeheer voor KMO's. 
             Eenvoudig, veilig en zonder verborgen kosten.
           </p>

          <div className="border-t border-gray-700 pt-6">
                         <p className="text-gray-500 text-xs md:text-sm">
               &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
               Stockbeheer voor KMO's.
             </p>
          </div>
        </div>
      </footer>







            

      {/* Schema.org Structured Data */}
      <StructuredData data={[
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
        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Stockbeheer",
                "description": "Stockbeheer: beheer je voorraad eenvoudig via je smartphone of tablet. Ontdek de voordelen van een mobiele voorraadbeheer app.",
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
                  "@id": "https://www.stockflow.be/voorraadbeheer-software"
                },
                "datePublished": "2024-06-01",
                "dateModified": "2024-12-19"        }      ]} />
    </SeoPageLayout>
  );
} 
