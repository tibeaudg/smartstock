import React from 'react';
import { CheckCircle, Package, Truck, FileText } from 'lucide-react';

interface StatusProgressBarProps {
  status: 'quote' | 'ordered' | 'packaging' | 'shipped' | 'received' | 'cancelled';
}

export const StatusProgressBar: React.FC<StatusProgressBarProps> = ({ status }) => {
  const steps = [
    { key: 'quote', label: 'Quote', icon: FileText },
    { key: 'packaging', label: 'Packaging', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'received', label: 'Received', icon: CheckCircle },
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(step => step.key === stepKey);
    const currentIndex = steps.findIndex(step => step.key === status);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const getBarColor = (stepIndex: number) => {
    const currentIndex = steps.findIndex(step => step.key === status);
    return stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-300';
  };

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key);
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(stepStatus)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-600 mt-1">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-200 rounded">
                <div 
                  className={`h-1 rounded ${getBarColor(index)}`}
                  style={{ width: stepStatus === 'completed' ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
