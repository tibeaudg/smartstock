import React from 'react';
import { 
  Package, 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap,
  Users,
  CheckCircle,
  TrendingUp 
} from 'lucide-react';

interface RegionalFeaturesProps {
  locationName: string;
  emphasis?: string; // Special emphasis for the region
}

const RegionalFeatures: React.FC<RegionalFeaturesProps> = ({ locationName, emphasis }) => {
  const features = [
    {
      icon: Package,
      title: 'Real-Time Voorraad',
      description: `Beheer je voorraad in ${locationName} met real-time updates. Altijd overzicht van je stock, waar je ook bent.`
    },
    {
      icon: Smartphone,
      title: 'Mobiele App',
      description: `Werk overal in ${locationName}. Scan barcodes, update voorraad en bekijk statistieken vanaf je smartphone.`
    },
    {
      icon: BarChart3,
      title: 'Slimme Rapportages',
      description: 'Krijg inzicht in je voorraadprestaties met overzichtelijke rapportages en analyses.'
    },
    {
      icon: Users,
      title: 'Multi-vestiging',
      description: `Meerdere locaties in ${locationName} of daarbuiten? Beheer al je vestigingen vanuit één centraal systeem.`
    },
    {
      icon: Zap,
      title: 'Automatische Alerts',
      description: 'Ontvang automatisch meldingen bij lage voorraad. Nooit meer out-of-stock situaties.'
    },
    {
      icon: Shield,
      title: 'Veilig & Betrouwbaar',
      description: 'Belgische servers, GDPR-compliant en automatische back-ups. Je data is veilig.'
    },
    {
      icon: CheckCircle,
      title: 'Makkelijk te Gebruiken',
      description: 'Intuïtieve interface die iedereen begrijpt. Start binnen 5 minuten zonder training.'
    },
    {
      icon: TrendingUp,
      title: 'Schaalbaar',
      description: 'Start gratis met 30 producten en groei mee. Perfect voor groeiende KMO\'s.'
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Voorraadbeheer voor bedrijven in <span className="text-blue-600">{locationName}</span>
          </h2>
          {emphasis && (
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {emphasis}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <feature.icon className="h-10 w-10 text-blue-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Klaar om te starten in {locationName}?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Gratis tot 30 producten. Geen creditcard vereist.
          </p>
          <a 
            href="/auth"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Gratis
          </a>
        </div>
      </div>
    </section>
  );
};

export default RegionalFeatures;

