import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Mail, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CostMarginCalculatorProps {
  onCalculate?: (result: { retailPrice: number; totalProfit: number }) => void;
  className?: string;
}

export const CostMarginCalculator: React.FC<CostMarginCalculatorProps> = ({ 
  onCalculate, 
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    costPrice: '',
    marginPercent: '',
    quantity: '1',
    email: ''
  });
  const [calculatedResult, setCalculatedResult] = useState<{
    retailPrice: number;
    totalProfit: number;
    marginAmount: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const calculateResult = () => {
    const costPrice = parseFloat(formData.costPrice) || 0;
    const marginPercent = parseFloat(formData.marginPercent) || 0;
    const quantity = parseFloat(formData.quantity) || 1;

    if (costPrice <= 0 || marginPercent < 0) {
      setError('Please enter valid cost price and margin percentage');
      return;
    }

    const marginAmount = costPrice * (marginPercent / 100);
    const retailPrice = costPrice + marginAmount;
    const totalProfit = marginAmount * quantity;

    const result = {
      retailPrice,
      totalProfit,
      marginAmount
    };

    setCalculatedResult(result);
    onCalculate?.(result);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/visitor-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          message: `Cost & Margin Calculator Results:\n\nCost Price: €${formData.costPrice}\nMargin: ${formData.marginPercent}%\nQuantity: ${formData.quantity}\n\nRetail Price: €${calculatedResult?.retailPrice.toFixed(2)}\nTotal Profit: €${calculatedResult?.totalProfit.toFixed(2)}\nMargin Amount: €${calculatedResult?.marginAmount.toFixed(2)}`,
        }),
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        data = { ok: false, error: 'Server error' };
      }

      if (response.ok && data.ok) {
        setEmailSent(true);
      } else {
        setError(data.error || 'Failed to send results. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCalculator = () => {
    setFormData({
      costPrice: '',
      marginPercent: '',
      quantity: '1',
      email: ''
    });
    setCalculatedResult(null);
    setEmailSent(false);
    setError('');
  };

  return (
    <Card className={`p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 ${className}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Cost & Margin Calculator
        </h3>
        <p className="text-gray-600">
          Calculate your retail price and profit margins instantly
        </p>
      </div>

      {!calculatedResult ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-sm font-medium text-gray-700">
                Cost Price (€)
              </Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 10.00"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marginPercent" className="text-sm font-medium text-gray-700">
                Desired Margin (%)
              </Label>
              <Input
                id="marginPercent"
                type="number"
                step="0.1"
                placeholder="e.g., 50"
                value={formData.marginPercent}
                onChange={(e) => handleInputChange('marginPercent', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity (optional)
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="e.g., 100"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button 
            onClick={calculateResult} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            disabled={!formData.costPrice || !formData.marginPercent}
          >
            Calculate Retail Price
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Your Pricing Results
            </h4>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Retail Price (per unit)</span>
                <span className="text-2xl font-bold text-blue-600">
                  €{calculatedResult.retailPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Margin Amount (per unit)</span>
                <span className="text-xl font-semibold text-green-600">
                  €{calculatedResult.marginAmount.toFixed(2)}
                </span>
              </div>

              {parseFloat(formData.quantity) > 1 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Profit ({formData.quantity} units)</span>
                  <span className="text-2xl font-bold text-green-600">
                    €{calculatedResult.totalProfit.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!emailSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Get results via email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 animate-pulse" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Results to Email
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Results sent successfully!</span>
              </div>
              <p className="text-sm text-green-600">
                Check your email for the complete calculation breakdown.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={resetCalculator} 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Calculate Again
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CostMarginCalculator;

