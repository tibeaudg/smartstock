import React from 'react';
import { TrendingUp, BarChart3, Target, Award } from 'lucide-react';

interface IndustryBenchmarksProps {
  industry: string;
  benchmarks: {
    averageSavings?: string;
    averageTimeReduction?: string;
    commonChallenge?: string;
    typicalResult?: string;
  };
  className?: string;
}

export const IndustryBenchmarks: React.FC<IndustryBenchmarksProps> = ({
  industry,
  benchmarks,
  className = ''
}) => {
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {industry} Industry Benchmarks
          </h2>
          <p className="text-lg text-gray-700">
            Real results from {industry} businesses using StockFlow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {benchmarks.averageSavings && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Average Savings</h3>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-2">{benchmarks.averageSavings}</div>
              <p className="text-gray-600 text-sm">
                Typical annual or monthly cost savings for {industry} businesses
              </p>
            </div>
          )}
          
          {benchmarks.averageTimeReduction && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Time Reduction</h3>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-2">{benchmarks.averageTimeReduction}</div>
              <p className="text-gray-600 text-sm">
                Average reduction in time spent on inventory management
              </p>
            </div>
          )}
          
          {benchmarks.commonChallenge && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">Common Challenge</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{benchmarks.commonChallenge}</p>
            </div>
          )}
          
          {benchmarks.typicalResult && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Typical Result</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">{benchmarks.typicalResult}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};




