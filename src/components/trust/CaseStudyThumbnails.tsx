import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, DollarSign, Building } from 'lucide-react';
import { caseStudies, CaseStudy } from '@/data/caseStudies';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CaseStudyThumbnailsProps {
  studies?: CaseStudy[];
  maxStudies?: number;
  variant?: 'grid' | 'horizontal';
  className?: string;
  showMetrics?: boolean;
}

export const CaseStudyThumbnails: React.FC<CaseStudyThumbnailsProps> = ({
  studies = caseStudies,
  maxStudies,
  variant = 'grid',
  className = '',
  showMetrics = true,
}) => {
  const displayStudies = maxStudies ? studies.slice(0, maxStudies) : studies;

  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      Retail: 'bg-blue-100 text-blue-700 border-blue-200',
      'Food & Beverage': 'bg-orange-100 text-orange-700 border-orange-200',
      Manufacturing: 'bg-purple-100 text-purple-700 border-purple-200',
      Healthcare: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[industry] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatMetric = (key: string, value: string) => {
    if (key.includes('Saved') || key.includes('saved')) {
      return { icon: DollarSign, label: 'Savings', value };
    }
    if (key.includes('Time') || key.includes('time')) {
      return { icon: Clock, label: 'Time Saved', value };
    }
    if (key.includes('Location') || key.includes('location')) {
      return { icon: Building, label: 'Locations', value };
    }
    return { icon: TrendingUp, label: key, value };
  };

  const renderThumbnail = (study: CaseStudy, index: number) => {
    const primaryMetric = Object.entries(study.metrics)[0];
    const metricInfo = primaryMetric
      ? formatMetric(primaryMetric[0], primaryMetric[1])
      : null;

    return (
      <Card
        key={study.id}
        className={cn(
          "group h-full transition-all hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Badge
              variant="secondary"
              className={cn("text-xs", getIndustryColor(study.industry))}
            >
              {study.industry}
            </Badge>
            {metricInfo && showMetrics && (
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>{primaryMetric[1]}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {study.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {study.company}
          </p>

          <p className="text-sm text-gray-700 mb-6 line-clamp-3">
            {study.challenge}
          </p>

          {showMetrics && Object.keys(study.metrics).length > 1 && (
            <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-100">
              {Object.entries(study.metrics)
                .slice(1, 3)
                .map(([key, value]) => {
                  const info = formatMetric(key, value);
                  const Icon = info.icon;
                  return (
                    <div key={key} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{info.label}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <Link
            to={study.link || '/customers'}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all"
          >
            Read case study
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    );
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {displayStudies.map((study, index) => (
          <div
            key={study.id}
            className="flex-shrink-0 w-full sm:w-[400px] md:w-[450px]"
          >
            {renderThumbnail(study, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {displayStudies.map((study, index) => renderThumbnail(study, index))}
    </div>
  );
};






