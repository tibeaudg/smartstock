import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function MobielVoorraadbeheer() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Mobiel Voorraadbeheer | stockflow"
        description="Mobiel voorraadbeheer: beheer je voorraad eenvoudig via je smartphone of tablet. Ontdek de voordelen van een mobiele voorraadbeheer app."
        keywords="mobiel voorraadbeheer, voorraadbeheer app, voorraadbeheer smartphone, voorraadbeheer tablet, mobiele voorraadbeheer software"
        url="https://www.stockflow.be/mobiel-voorraadbeheer"
      />
      <h1 className="text-4xl font-bold mb-6">Mobiel Voorraadbeheer</h1>
      <p className="text-lg mb-4">
        Met <strong>mobiel voorraadbeheer</strong> heb je altijd en overal inzicht in je voorraad. Ontdek de voordelen van een <strong>voorraadbeheer app</strong> op je smartphone of tablet.
      </p>
      <h2 className="text-2xl font-semibold mb-3">1. Altijd realtime inzicht</h2>
      <p className="mb-4">Bekijk en beheer je voorraad direct vanaf je mobiel, waar je ook bent.</p>
      <h2 className="text-2xl font-semibold mb-3">2. Snel producten toevoegen of aanpassen</h2>
      <p className="mb-4">Scan barcodes of maak direct een foto van nieuwe producten.</p>
      <h2 className="text-2xl font-semibold mb-3">3. Ideaal voor onderweg en in het magazijn</h2>
      <p className="mb-4">Werk mobiel samen met je team en voorkom fouten door papierwerk.</p>
      <h2 className="text-2xl font-semibold mb-3">Meer weten?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><Link to="/voorraadbeheer-tips" className="text-blue-700 underline">Voorraadbeheer tips</Link></li>
        <li><Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline">Vergelijk voorraadbeheer software</Link></li>
        <li><Link to="/magazijnbeheer-tips" className="text-blue-700 underline">Magazijnbeheer tips</Link></li>
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Mobiel Voorraadbeheer",
        "description": "Mobiel voorraadbeheer: beheer je voorraad eenvoudig via je smartphone of tablet. Ontdek de voordelen van een mobiele voorraadbeheer app.",
        "author": { "@type": "Organization", "name": "stockflow" },
        "publisher": { "@type": "Organization", "name": "stockflow", "logo": { "@type": "ImageObject", "url": "https://www.stockflow.be/logo.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.stockflow.be/mobiel-voorraadbeheer" },
        "datePublished": "2024-06-01",
        "image": "https://www.stockflow.be/Inventory-Management.png"
      }`}} />
    </main>
  );
} 