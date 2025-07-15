import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function SimpelStockbeheer() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Simpel Stockbeheer voor KMO's en Zelfstandigen | stockflow"
        description="Simpel stockbeheer voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig online met stockflow."
        keywords="simpel stockbeheer, voorraadbeheer, stockbeheer, KMO, eenvoudig voorraadbeheer, voorraad app, voorraadbeheer Vlaanderen"
        url="https://www.stockflow.be/simpelstockbeheer"
      />
      <h1 className="text-4xl font-bold mb-6">Simpel Stockbeheer voor KMO's en Zelfstandigen</h1>
      <p className="text-lg mb-4">
        Op zoek naar <strong>simpel stockbeheer</strong> dat werkt voor jouw bedrijf? stockflow biedt een gebruiksvriendelijke oplossing waarmee je snel en efficiënt je voorraad beheert, zonder gedoe. Of je nu een kleine ondernemer bent of een groeiende KMO, onze app helpt je om altijd overzicht te houden over je producten, bestellingen en leveringen.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Waarom kiezen voor simpel stockbeheer?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Direct inzicht in je voorraad, waar je ook bent</li>
        <li>Automatische meldingen bij lage voorraad</li>
        <li>Mobiel en desktop te gebruiken</li>
        <li>Gratis te proberen, geen creditcard nodig</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-3">Start vandaag nog gratis</h2>
      <p className="mb-4">
        Probeer stockflow nu gratis uit en ervaar zelf het gemak van <strong>eenvoudig stockbeheer</strong>. Geen installatie, direct starten!
      </p>
      <Link to="/blog" className="text-blue-700 underline">Lees meer tips over voorraadbeheer op onze <strong>voorraadbeheer blog</strong></Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Simpel Stockbeheer voor KMO's en Zelfstandigen",
        "description": "Simpel stockbeheer voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig online met stockflow.",
        "author": { "@type": "Organization", "name": "stockflow" },
        "publisher": { "@type": "Organization", "name": "stockflow", "logo": { "@type": "ImageObject", "url": "https://www.stockflow.be/logo.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.stockflow.be/simpelstockbeheer" },
        "datePublished": "2024-06-01",
        "image": "https://www.stockflow.be/Inventory-Management.png"
      }`}} />
    </main>
  );
} 