import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';

interface PageFormLayoutProps {
  title: string;
  backTo: string;
  backLabel?: string;
  primaryAction?: React.ReactNode;
  secondaryContent?: React.ReactNode;
  children: React.ReactNode;
}

export function PageFormLayout({
  title,
  backTo,
  backLabel = 'Back',
  primaryAction,
  secondaryContent,
  children,
}: PageFormLayoutProps) {
  const navigate = useNavigate();
  const { isMobile } = useMobile();

  return (
    <div className="h-full max-h-[calc(100vh-5rem)] flex flex-col min-h-0 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 border-b px-6 py-4 bg-white rounded-t-lg shadow-sm sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(backTo)}
              className="gap-2 border-gray-300 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Button>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {primaryAction}
            {secondaryContent}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${isMobile ? 'p-4 pt-6' : 'p-6 pt-8'}`}>
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  );
}
