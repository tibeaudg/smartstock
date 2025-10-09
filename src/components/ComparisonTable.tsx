import React from 'react';
import { Check, X } from 'lucide-react';

export interface ComparisonFeature {
  feature: string;
  stockflow: boolean | string;
  competitor: boolean | string;
  stockflowTooltip?: string;
  competitorTooltip?: string;
}

interface ComparisonTableProps {
  competitorName: string;
  features: ComparisonFeature[];
  competitorColor?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  competitorName, 
  features,
  competitorColor = 'gray'
}) => {
  const renderCell = (value: boolean | string, tooltip?: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-6 w-6 text-green-600 mx-auto" />
      ) : (
        <X className="h-6 w-6 text-red-400 mx-auto" />
      );
    }
    return (
      <span className="text-sm text-gray-700 text-center block" title={tooltip}>
        {value}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="p-4 text-left font-semibold text-gray-900">Feature</th>
            <th className="p-4 text-center font-semibold text-blue-600 bg-blue-50">
              StockFlow
            </th>
            <th className={`p-4 text-center font-semibold text-${competitorColor}-600 bg-${competitorColor}-50`}>
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="p-4 font-medium text-gray-900">{item.feature}</td>
              <td className="p-4 text-center bg-blue-50/50">
                {renderCell(item.stockflow, item.stockflowTooltip)}
              </td>
              <td className="p-4 text-center">
                {renderCell(item.competitor, item.competitorTooltip)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;

