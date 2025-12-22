import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wine, 
  ShoppingBag, 
  Warehouse, 
  Coffee,
  Building,
  ArrowRight,
  CheckCircle,
  TrendingDown,
  AlertTriangle,
  Package,
  BarChart3
} from 'lucide-react';

interface IndustrySelectorProps {
  onIndustrySelect?: (industry: string) => void;
}

const industries = [
  {
    id: 'wine-shop',
    name: 'Wine Shop',
    icon: <Wine className="h-6 w-6" />,
    description: 'Specialty beverage retail',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    problems: [
      'Wine going bad before selling',
      'Capital tied up in slow vintages',
      'Managing storage + retail locations'
    ],
    solutions: [
      'Expiry date tracking with alerts',
      'Dead stock optimizer for slow wines',
      'Multi-location inventory management'
    ],
    heroTitle: 'Stop Losing Money on Expired Wine',
    heroSubtitle: 'Specialized inventory management for wine shops. Track expiry dates, optimize dead stock, and prevent losses.',
    ctaText: 'Join for Free',
    stats: {
      primary: '40%',
      primaryLabel: 'Reduction in Dead Stock',
      secondary: '€15,000',
      secondaryLabel: 'Average Annual Savings'
    }
  },
  {
    id: 'retail-store',
    name: 'Retail Store',
    icon: <ShoppingBag className="h-6 w-6" />,
    description: 'General retail and fashion',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    problems: [
      'Stockouts during peak seasons',
      'Overstock of seasonal items',
      'Manual inventory counting'
    ],
    solutions: [
      'Real-time stock tracking',
      'Seasonal demand forecasting',
      'Mobile barcode scanning'
    ],
    heroTitle: 'Never Run Out of Stock Again',
    heroSubtitle: 'Complete inventory management for retail stores. Track stock levels, prevent stockouts, and optimize ordering.',
    ctaText: 'Join for Free',
    stats: {
      primary: '25%',
      primaryLabel: 'Reduction in Stockouts',
      secondary: '€8,000',
      secondaryLabel: 'Average Annual Savings'
    }
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    icon: <Warehouse className="h-6 w-6" />,
    description: 'Distribution and logistics',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    problems: [
      'Complex multi-location tracking',
      'Inefficient picking processes',
      'Inventory accuracy issues'
    ],
    solutions: [
      'Multi-location management',
      'Optimized picking routes',
      'Real-time accuracy tracking'
    ],
    heroTitle: 'Optimize Your Warehouse Operations',
    heroSubtitle: 'Advanced warehouse management with multi-location support, barcode scanning, and real-time tracking.',
    ctaText: 'Join for Free',
    stats: {
      primary: '60%',
      primaryLabel: 'Faster Inventory Counts',
      secondary: '€12,000',
      secondaryLabel: 'Annual Labor Savings'
    }
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: <Coffee className="h-6 w-6" />,
    description: 'Food service and hospitality',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    problems: [
      'Food waste from overstocking',
      'Running out of ingredients',
      'Manual inventory tracking'
    ],
    solutions: [
      'Expiry date tracking',
      'Automated reorder points',
      'Mobile inventory management'
    ],
    heroTitle: 'Reduce Food Waste, Increase Profits',
    heroSubtitle: 'Restaurant inventory management that tracks expiry dates, prevents waste, and optimizes ordering.',
    ctaText: 'Join for Free',
    stats: {
      primary: '30%',
      primaryLabel: 'Reduction in Food Waste',
      secondary: '€6,000',
      secondaryLabel: 'Annual Cost Savings'
    }
  }
];

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onIndustrySelect }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const handleIndustryClick = (industryId: string) => {
    setSelectedIndustry(industryId);
    onIndustrySelect?.(industryId);
  };

  const selectedIndustryData = industries.find(industry => industry.id === selectedIndustry);

  return (
    <div className="w-full">
      {/* Industry Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          What type of business are you?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry) => (
            <Button
              key={industry.id}
              variant={selectedIndustry === industry.id ? "default" : "outline"}
              onClick={() => handleIndustryClick(industry.id)}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                selectedIndustry === industry.id 
                  ? `${industry.bgColor} ${industry.color} border-2 ${industry.borderColor}` 
                  : 'hover:bg-gray-50'
              }`}
            >
              {industry.icon}
              <span className="text-sm font-medium">{industry.name}</span>
              <span className="text-xs text-gray-500">{industry.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Industry Hero */}
      {selectedIndustryData && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                {selectedIndustryData.name} Solution
              </Badge>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                {selectedIndustryData.heroTitle}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {selectedIndustryData.heroSubtitle}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedIndustryData.stats.primary}</div>
                  <div className="text-sm text-gray-600">{selectedIndustryData.stats.primaryLabel}</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedIndustryData.stats.secondary}</div>
                  <div className="text-sm text-gray-600">{selectedIndustryData.stats.secondaryLabel}</div>
                </div>
              </div>

              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                {selectedIndustryData.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Problems */}
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Common Problems
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {selectedIndustryData.problems.map((problem, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {problem}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Solutions */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Our Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {selectedIndustryData.solutions.map((solution, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* General Features (when no industry selected) */}
      {!selectedIndustry && (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-4">Choose your industry to see personalized solutions</h3>
          <p className="text-gray-600">
            StockFlow adapts to your specific business needs and challenges
          </p>
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;
