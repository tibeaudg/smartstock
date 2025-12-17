import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface BOMAnalyticsProps {
  productId: string;
  bomVersionId?: string | null;
}

export const BOMAnalytics: React.FC<BOMAnalyticsProps> = ({ productId, bomVersionId }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold">BOM Analytics</h3>
      </div>
      <div className="text-center py-8 text-gray-500">
        <p>Analytics dashboard coming soon</p>
        <p className="text-sm mt-2">Cost trends, usage statistics, and version comparisons</p>
      </div>
    </Card>
  );
};

