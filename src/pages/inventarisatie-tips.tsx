import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function InventarisatieTips() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Inventarisatie Tips | SmartStock"
        description="De beste tips voor inventarisatie en voorraad tellen. Leer hoe je efficiënt en foutloos je voorraad inventariseert met SmartStock."
        keywords="inventarisatie, voorraad tellen, inventariseren, voorraadcontrole, voorraadbeheer, inventarisatie tips, voorraad telling"
        url="https://www.smartstock.be/inventarisatie-tips"
      />
      <h1 className="text-4xl font-bold mb-6">Inventarisatie Tips</h1>
      <p className="text-lg mb-4">
        Een goede <strong>inventarisatie</strong> voorkomt verrassingen en zorgt voor een kloppende voorraad. Met deze tips maak je het inventariseren makkelijker en nauwkeuriger.
      </p>
      <h2 className="text-2xl font-semibold mb-3">1. Plan je inventarisatie goed</h2>
      <p className="mb-4">Kies een rustig moment en zorg dat iedereen weet wat er verwacht wordt.</p>
      <h2 className="text-2xl font-semibold mb-3">2. Werk met duidelijke lijsten en labels</h2>
      <p className="mb-4">Zorg voor een overzichtelijke administratie en duidelijke productlabels.</p>
      <h2 className="text-2xl font-semibold mb-3">3. Gebruik digitale hulpmiddelen</h2>
      <p className="mb-4">Met een voorraadbeheer app zoals SmartStock wordt inventariseren sneller en nauwkeuriger.</p>
      <h2 className="text-2xl font-semibold mb-3">Meer weten?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><Link to="/voorraadbeheer-tips" className="text-blue-700 underline">Voorraadbeheer tips</Link></li>
        <li><Link to="/magazijnbeheer-tips" className="text-blue-700 underline">Magazijnbeheer tips</Link></li>
        <li><Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline">Vergelijk voorraadbeheer software</Link></li>
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Inventarisatie Tips",
        "description": "De beste tips voor inventarisatie en voorraad tellen. Leer hoe je efficiënt en foutloos je voorraad inventariseert met SmartStock.",
        "author": { "@type": "Organization", "name": "SmartStock" },
        "publisher": { "@type": "Organization", "name": "SmartStock", "logo": { "@type": "ImageObject", "url": "https://www.smartstock.be/logo.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.smartstock.be/inventarisatie-tips" },
        "datePublished": "2024-06-01",
        "image": "https://www.smartstock.be/Inventory-Management.png"
      }`}} />
    </main>
  );
} 