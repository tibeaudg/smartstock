import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function VoorraadbeheerHoreca() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Voorraadbeheer voor Horeca | stockflow"
        description="Voorraadbeheer voor horeca: tips voor restaurants, cafés en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert met stockflow."
        keywords="voorraadbeheer horeca, horeca voorraad, voorraadbeheer restaurant, voorraadbeheer café, voorraadbeheer bakker, horeca voorraad app"
        url="https://www.stockflow.be/voorraadbeheer-horeca"
      />
      <h1 className="text-4xl font-bold mb-6">Voorraadbeheer voor Horeca</h1>
      <p className="text-lg mb-4">
        Goed <strong>voorraadbeheer</strong> is onmisbaar in de <strong>horeca</strong>. Met deze tips houd je eenvoudig je voorraad bij in je restaurant, café of bakkerij.
      </p>
      <h2 className="text-2xl font-semibold mb-3">1. Werk met dag- en weeklijsten</h2>
      <p className="mb-4">Maak vaste lijsten voor dagelijkse en wekelijkse controle van je voorraad. Zo voorkom je tekorten en verspilling.</p>
      <h2 className="text-2xl font-semibold mb-3">2. Digitaliseer je voorraadbeheer</h2>
      <p className="mb-4">Met een horeca voorraad app zoals stockflow heb je altijd inzicht, ook op je smartphone of tablet.</p>
      <h2 className="text-2xl font-semibold mb-3">3. Analyseer je verbruik en bestellingen</h2>
      <p className="mb-4">Bekijk welke producten snel gaan en pas je bestellingen hierop aan.</p>
      <h2 className="text-2xl font-semibold mb-3">Meer weten?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><Link to="/voorraadbeheer-tips" className="text-blue-700 underline">Voorraadbeheer tips</Link></li>
        <li><Link to="/magazijnbeheer-tips" className="text-blue-700 underline">Magazijnbeheer tips</Link></li>
        <li><Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline">Vergelijk voorraadbeheer software</Link></li>
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Voorraadbeheer voor Horeca",
        "description": "Voorraadbeheer voor horeca: tips voor restaurants, cafés en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert met stockflow.",
        "author": { "@type": "Organization", "name": "stockflow" },
        "publisher": { "@type": "Organization", "name": "stockflow", "logo": { "@type": "ImageObject", "url": "https://www.stockflow.be/logo.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.stockflow.be/voorraadbeheer-horeca" },
        "datePublished": "2024-06-01",
        "image": "https://www.stockflow.be/Inventory-Management.png"
      }`}} />
    </main>
  );
} 