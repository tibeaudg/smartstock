import React from 'react';
import { TrendingUp, Users, Building2, CheckCircle } from 'lucide-react';

interface RegionalStatsProps {
  locationName: string;
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  industries?: string[];
}

const RegionalStats: React.FC<RegionalStatsProps> = ({ locationName, stats, industries }) => {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Stats Grid */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Waarom <span className="text-blue-600">{locationName}</span> kiest voor StockFlow
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  {index === 0 && <TrendingUp className="h-6 w-6 text-blue-600" />}
                  {index === 1 && <Users className="h-6 w-6 text-blue-600" />}
                  {index === 2 && <Building2 className="h-6 w-6 text-blue-600" />}
                  {index === 3 && <CheckCircle className="h-6 w-6 text-blue-600" />}
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Industries */}
        {industries && industries.length > 0 && (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Populair in deze sectoren
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry, index) => (
                <span 
                  key={index}
                  className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                >
                  {industry}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              StockFlow wordt dagelijks gebruikt door {industries.length}+ verschillende sectoren in {locationName}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegionalStats;

