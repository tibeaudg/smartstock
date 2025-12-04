import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface ROICalculatorProps {
  className?: string;
}

export default function ROICalculator({ className = '' }: ROICalculatorProps) {
  const [inventoryValue, setInventoryValue] = useState<number>(50000);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [errorRate, setErrorRate] = useState<number>(5);
  const [stockoutFrequency, setStockoutFrequency] = useState<number>(4);
  const [stockoutCost, setStockoutCost] = useState<number>(500);
  const [overstockPercentage, setOverstockPercentage] = useState<number>(20);
  const [softwareCost, setSoftwareCost] = useState<number>(29);

  const calculations = useMemo(() => {
    // Time savings calculation
    const weeklyTimeSaved = weeklyHours * 0.7; // 70% time reduction
    const annualTimeSaved = weeklyTimeSaved * 52;
    const timeSavingsValue = annualTimeSaved * hourlyRate;

    // Error reduction savings
    const errorReduction = errorRate * 0.9; // 90% error reduction
    const errorCost = inventoryValue * (errorReduction / 100) * 0.1; // 10% of error value
    const annualErrorSavings = errorCost * 12;

    // Stockout reduction savings
    const stockoutReduction = stockoutFrequency * 0.8; // 80% reduction
    const annualStockoutSavings = stockoutReduction * stockoutCost * 12;

    // Overstock reduction savings
    const overstockReduction = inventoryValue * (overstockPercentage / 100) * 0.3; // 30% reduction
    const carryingCostSavings = overstockReduction * 0.2; // 20% carrying cost

    // Total savings
    const totalAnnualSavings = timeSavingsValue + annualErrorSavings + annualStockoutSavings + carryingCostSavings;

    // Software costs
    const annualSoftwareCost = softwareCost * 12;

    // ROI calculation
    const netSavings = totalAnnualSavings - annualSoftwareCost;
    const roi = annualSoftwareCost > 0 ? ((totalAnnualSavings - annualSoftwareCost) / annualSoftwareCost) * 100 : 0;
    const paybackPeriod = totalAnnualSavings > 0 ? (annualSoftwareCost / (totalAnnualSavings / 12)) : 0;

    return {
      timeSavingsValue,
      annualErrorSavings,
      annualStockoutSavings,
      carryingCostSavings,
      totalAnnualSavings,
      annualSoftwareCost,
      netSavings,
      roi,
      paybackPeriod,
      weeklyTimeSaved,
      annualTimeSaved
    };
  }, [inventoryValue, weeklyHours, hourlyRate, errorRate, stockoutFrequency, stockoutCost, overstockPercentage, softwareCost]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return value.toFixed(decimals);
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Current Situation</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Inventory Value (€)
            </label>
            <input
              type="number"
              value={inventoryValue}
              onChange={(e) => setInventoryValue(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Spent on Inventory per Week
            </label>
            <input
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Hourly Rate (€)
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Error Rate (%)
            </label>
            <input
              type="number"
              value={errorRate}
              onChange={(e) => setErrorRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stockouts per Month
            </label>
            <input
              type="number"
              value={stockoutFrequency}
              onChange={(e) => setStockoutFrequency(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Cost per Stockout (€)
            </label>
            <input
              type="number"
              value={stockoutCost}
              onChange={(e) => setStockoutCost(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overstock Percentage (%)
            </label>
            <input
              type="number"
              value={overstockPercentage}
              onChange={(e) => setOverstockPercentage(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Software Monthly Cost (€)
            </label>
            <input
              type="number"
              value={softwareCost}
              onChange={(e) => setSoftwareCost(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Your ROI Results</h3>

          {/* Main ROI Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">Annual ROI</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {calculations.roi > 0 ? '+' : ''}{formatNumber(calculations.roi)}%
            </div>
            <div className="text-sm opacity-90">
              {formatCurrency(calculations.netSavings)} net savings per year
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Time Savings</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(calculations.timeSavingsValue)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formatNumber(calculations.annualTimeSaved)} hours saved per year
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Error Reduction</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(calculations.annualErrorSavings)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formatNumber(errorRate - (errorRate * 0.9), 1)}% error reduction
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Stockout Reduction</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(calculations.annualStockoutSavings)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formatNumber(stockoutFrequency - (stockoutFrequency * 0.8), 1)} fewer stockouts/month
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Overstock Reduction</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(calculations.carryingCostSavings)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Reduced carrying costs from optimized inventory
              </p>
            </div>
          </div>

          {/* Total Savings */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold text-gray-900">Total Annual Savings</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculations.totalAnnualSavings)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Annual Software Cost</span>
              <span className="text-gray-700 font-medium">
                {formatCurrency(calculations.annualSoftwareCost)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Net Annual Savings</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(calculations.netSavings)}
              </span>
            </div>
          </div>

          {/* Payback Period */}
          {calculations.paybackPeriod > 0 && (
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-900">Payback Period</span>
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {formatNumber(calculations.paybackPeriod, 1)} months
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Time to recover your software investment
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> These calculations are based on industry averages. Actual results may vary based on your specific business operations, implementation quality, and team adoption. The calculator assumes a 70% reduction in manual time, 90% reduction in errors, 80% reduction in stockouts, and 30% reduction in overstock.
        </p>
      </div>
    </div>
  );
}
