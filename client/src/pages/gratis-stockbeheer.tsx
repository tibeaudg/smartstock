import React from 'react';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../components/SeoPageLayout';

export default function GratisStockbeheer() {
  return (
    <SeoPageLayout
      title="Gratis Stockbeheer App voor KMO's"
      image="/optimized/Inventory-Management.png"
    >
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Gratis Stockbeheer App voor KMO's</h1>
        <p className="text-lg mb-4">
          Wil je <strong>gratis stockbeheer</strong> proberen? Met stockflow beheer je tot 30 verschillende producten volledig gratis. Ideaal voor starters, kleine bedrijven en zelfstandigen die hun voorraad willen digitaliseren zonder kosten.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Voordelen van gratis stockbeheer</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Geen verborgen kosten of verplichtingen</li>
          <li>Direct starten, geen installatie nodig</li>
          <li>Gebruiksvriendelijke mobiele app</li>
          <li>Upgrade mogelijk naarmate je groeit</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Probeer het nu</h2>
        <p className="mb-4">
          Maak vandaag nog een gratis account aan en ontdek hoe eenvoudig voorraadbeheer kan zijn. <Link to="/simpelstockbeheer" className="text-blue-700 underline">Lees meer over simpel stockbeheer</Link> of bezoek onze <Link to="/blog" className="text-blue-700 underline">blog</Link> voor tips.
        </p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "stockflow",
          "image": "https://www.stockflow.be/logo.png",
          "@id": "https://www.stockflow.be/",
          "url": "https://www.stockflow.be/gratis-stockbeheer",
          "telephone": "+32-123-456-789",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Voorbeeldstraat 1",
            "addressLocality": "Brugge",
            "postalCode": "8000",
            "addressCountry": "BE"
          },
          "description": "Gratis stockbeheer app voor KMO's. Beheer tot 30 producten gratis met stockflow.",
          "areaServed": ["Brugge", "Gent", "Antwerpen", "Vlaanderen"]
        }`}} />
      </main>
    </SeoPageLayout>
  );
} 