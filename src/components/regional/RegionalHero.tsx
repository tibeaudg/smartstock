import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, TrendingUp } from 'lucide-react';

interface RegionalHeroProps {
  locationName: string;
  locationType: 'country' | 'province' | 'city';
  description: string;
  stats?: {
    businesses?: number;
    kmoPercentage?: number;
    population?: number;
  };
}

const RegionalHero: React.FC<RegionalHeroProps> = ({ 
  locationName, 
  locationType,
  description,
  stats 
}) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{locationType === 'country' ? 'Land' : locationType === 'province' ? 'Provincie' : 'Stad'}</span>
              <span>•</span>
              <span>{locationName}</span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Voorraadbeheer Software <span className="text-blue-600">{locationName}</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              {description}
            </p>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
                {stats.population && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Inwoners</div>
                      <div className="font-semibold">{stats.population.toLocaleString('nl-BE')}</div>
                    </div>
                  </div>
                )}
                {stats.businesses && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Bedrijven</div>
                      <div className="font-semibold">{stats.businesses.toLocaleString('nl-BE')}+</div>
                    </div>
                  </div>
                )}
                {stats.kmoPercentage && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">KMO's</div>
                      <div className="font-semibold">{stats.kmoPercentage}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Start Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Prijzen Bekijken
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="mt-6 text-sm text-gray-600">
              ✓ Gratis tot 30 producten • ✓ Geen creditcard vereist • ✓ Nederlandse support
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="lg:block">
            <img 
              src="/Inventory-Management.png" 
              alt={`Voorraadbeheer Software ${locationName}`}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionalHero;

