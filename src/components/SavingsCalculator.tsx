import React, { useState } from 'react';
import { Calculator, TrendingUp, Clock, Euro } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SavingsCalculatorProps {
  onCalculate?: (savings: number) => void;
  className?: string;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ 
  onCalculate, 
  className = "" 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stockoutsPerMonth: '',
    costPerStockout: '',
    hoursSpentPerWeek: '',
    hourlyRate: '',
    businessSize: ''
  });
  const [calculatedSavings, setCalculatedSavings] = useState<{
    annualStockoutSavings: number;
    annualTimeSavings: number;
    totalAnnualSavings: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateSavings = () => {
    const stockouts = parseFloat(formData.stockoutsPerMonth) || 0;
    const costPerStockout = parseFloat(formData.costPerStockout) || 0;
    const hoursPerWeek = parseFloat(formData.hoursSpentPerWeek) || 0;
    const hourlyRate = parseFloat(formData.hourlyRate) || 0;

    const annualStockoutSavings = stockouts * costPerStockout * 12;
    const annualTimeSavings = hoursPerWeek * hourlyRate * 52;
    const totalAnnualSavings = annualStockoutSavings + annualTimeSavings;

    const savings = {
      annualStockoutSavings,
      annualTimeSavings,
      totalAnnualSavings
    };

    setCalculatedSavings(savings);
    onCalculate?.(totalAnnualSavings);
  };

  const resetCalculator = () => {
    setStep(1);
    setFormData({
      stockoutsPerMonth: '',
      costPerStockout: '',
      hoursSpentPerWeek: '',
      hourlyRate: '',
      businessSize: ''
    });
    setCalculatedSavings(null);
  };

  return (
    <Card className={`p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 ${className}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Calculate Your Savings
        </h3>
        <p className="text-gray-600">
          See exactly how much StockFlow could save your business
        </p>
      </div>

      {!calculatedSavings ? (
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 1: Your Current Challenges
                </h4>
                <p className="text-gray-600 text-sm">
                  Help us understand your inventory pain points
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stockouts" className="text-sm font-medium text-gray-700">
                    Stockouts per month
                  </Label>
                  <Input
                    id="stockouts"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.stockoutsPerMonth}
                    onChange={(e) => handleInputChange('stockoutsPerMonth', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPerStockout" className="text-sm font-medium text-gray-700">
                    Average cost per stockout (€)
                  </Label>
                  <Input
                    id="costPerStockout"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.costPerStockout}
                    onChange={(e) => handleInputChange('costPerStockout', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessSize" className="text-sm font-medium text-gray-700">
                  Business size
                </Label>
                <Select 
                  value={formData.businessSize} 
                  onValueChange={(value) => handleInputChange('businessSize', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your business size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo entrepreneur (1 person)</SelectItem>
                    <SelectItem value="small">Small business (2-10 employees)</SelectItem>
                    <SelectItem value="medium">Medium business (11-50 employees)</SelectItem>
                    <SelectItem value="large">Large business (50+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={!formData.stockoutsPerMonth || !formData.costPerStockout || !formData.businessSize}
              >
                Continue to Step 2 →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 2: Time Investment
                </h4>
                <p className="text-gray-600 text-sm">
                  How much time do you spend on inventory management?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek" className="text-sm font-medium text-gray-700">
                    Hours spent per week on inventory
                  </Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.hoursSpentPerWeek}
                    onChange={(e) => handleInputChange('hoursSpentPerWeek', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
                    Your hourly rate (€)
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline" 
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ← Back
                </Button>
                <Button 
                  onClick={calculateSavings} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!formData.hoursSpentPerWeek || !formData.hourlyRate}
                >
                  Calculate My Savings
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Your Potential Savings
            </h4>
            <p className="text-gray-600">
              Based on your input, here's what StockFlow could save you annually:
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                €{calculatedSavings.totalAnnualSavings.toLocaleString()}
              </div>
              <p className="text-lg text-gray-600">Total Annual Savings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center mb-2">
                  <Euro className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-800">Stockout Savings</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  €{calculatedSavings.annualStockoutSavings.toLocaleString()}
                </div>
                <p className="text-sm text-red-700">Prevent lost sales</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">Time Savings</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  €{calculatedSavings.annualTimeSavings.toLocaleString()}
                </div>
                <p className="text-sm text-blue-700">Automated management</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Start saving today with StockFlow's free plan
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                onClick={() => {
                  // This would trigger the sign-up flow
                  window.location.href = '/auth';
                }}
              >
                Start Saving €{Math.round(calculatedSavings.totalAnnualSavings / 12).toLocaleString()}/Month →
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={resetCalculator} 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Calculate Again
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SavingsCalculator;
