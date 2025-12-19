import React from 'react';
import { Link } from 'react-router-dom';
import { CaseStudy } from '@/data/caseStudies';
import { TrendingUp, Clock, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';

interface CaseStudySectionProps {
  caseStudy: CaseStudy;
  variant?: 'default' | 'compact' | 'highlighted';
  className?: string;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({
  caseStudy,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{caseStudy.title}</h3>
            <p className="text-sm text-gray-600">{caseStudy.company} • {caseStudy.industry}</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{caseStudy.challenge}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {caseStudy.metrics.timeSaved && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-900">{caseStudy.metrics.timeSaved}</span>
            </div>
          )}
          {caseStudy.metrics.costSaved && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-gray-900">{caseStudy.metrics.costSaved}</span>
            </div>
          )}
        </div>
        
        {caseStudy.link && (
          <Link
            to={caseStudy.link}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            Read full case study <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    );
  }
  
  if (variant === 'highlighted') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-lg ${className}`}>
        <div className="mb-6">
          <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Success Story
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{caseStudy.title}</h3>
          <p className="text-gray-700 font-medium">{caseStudy.company} • {caseStudy.industry}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Challenge</h4>
          <p className="text-gray-700 mb-4">{caseStudy.challenge}</p>
          
          <h4 className="font-semibold text-gray-900 mb-3">Solution</h4>
          <p className="text-gray-700">{caseStudy.solution}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {caseStudy.results.map((result, index) => (
            <div key={index} className="flex items-start gap-2 bg-white rounded-lg p-4">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{result}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(caseStudy.metrics).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
              <div className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </div>
        
        {caseStudy.link && (
          <div className="mt-6">
            <Link
              to={caseStudy.link}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Read Full Case Study <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Real Customer Results
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{caseStudy.title}</h3>
            <p className="text-gray-600">{caseStudy.company} • {caseStudy.industry}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Challenge
              </h4>
              <p className="text-gray-700 leading-relaxed">{caseStudy.challenge}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Solution
              </h4>
              <p className="text-gray-700 leading-relaxed">{caseStudy.solution}</p>
            </div>
          </div>
          
          <div className="border-t pt-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Results</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{result}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-6">
            {Object.entries(caseStudy.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
                <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
          
          {caseStudy.link && (
            <div className="mt-8 text-center">
              <Link
                to={caseStudy.link}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                View More Case Studies <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};




