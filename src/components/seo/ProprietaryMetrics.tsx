import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, DollarSign, Target } from 'lucide-react';

interface ProprietaryMetricsProps {
  metrics: {
    customerCount?: string;
    averageTimeSaved?: string;
    averageCostSaved?: string;
    keyMetric?: string;
    feature?: string;
  };
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const ProprietaryMetrics: React.FC<ProprietaryMetricsProps> = ({
  metrics,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        {metrics.customerCount && (
          <span className="font-semibold text-blue-600">{metrics.customerCount} customers</span>
        )}
        {metrics.averageTimeSaved && (
          <span className="text-gray-600">save {metrics.averageTimeSaved}</span>
        )}
      </span>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Real Results</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {metrics.customerCount && (
            <div>
              <div className="text-blue-600 font-bold">{metrics.customerCount}</div>
              <div className="text-gray-600">Customers</div>
            </div>
          )}
          {metrics.averageTimeSaved && (
            <div>
              <div className="text-blue-600 font-bold">{metrics.averageTimeSaved}</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <section className={`py-12 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Proven Results from {metrics.customerCount || '500+'} Businesses
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Based on real customer data and aggregated metrics from our customer base
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.customerCount && (
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.customerCount}</div>
              <div className="text-gray-600">Active Customers</div>
            </div>
          )}
          
          {metrics.averageTimeSaved && (
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Clock className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.averageTimeSaved}</div>
              <div className="text-gray-600">Average Time Saved</div>
            </div>
          )}
          
          {metrics.averageCostSaved && (
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <DollarSign className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.averageCostSaved}</div>
              <div className="text-gray-600">Average Cost Savings</div>
            </div>
          )}
          
          {metrics.keyMetric && (
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <div className="text-xl font-bold text-gray-900 mb-2">{metrics.keyMetric}</div>
              <div className="text-gray-600">Key Improvement</div>
            </div>
          )}
        </div>
        
        {metrics.feature && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                {metrics.feature} Impact
              </h3>
            </div>
            <p className="text-gray-700">
              Businesses using {metrics.feature} see significant improvements in efficiency and cost savings. 
              These metrics are based on aggregated data from our customer base.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

