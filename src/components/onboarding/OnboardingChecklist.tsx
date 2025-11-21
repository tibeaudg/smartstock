import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface OnboardingChecklistProps {
  items: ChecklistItem[];
  currentStep?: number;
  totalSteps?: number;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  items,
  currentStep = 0,
  totalSteps = 3
}) => {
  const completedCount = items.filter(item => item.completed).length;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Getting Started</h3>
          <span className="text-sm text-gray-600">
            {completedCount} of {items.length} tasks completed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                item.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  item.completed ? 'text-gray-700 line-through' : 'text-gray-900'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

