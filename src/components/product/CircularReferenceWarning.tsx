import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CircularReferenceWarningProps {
  hasCircularReference: boolean;
  path?: string;
  onDismiss?: () => void;
}

export const CircularReferenceWarning: React.FC<CircularReferenceWarningProps> = ({
  hasCircularReference,
  path,
  onDismiss,
}) => {
  if (!hasCircularReference) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Circular Reference Detected</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          Adding this component would create a circular reference in the BOM structure.
          This means a product would be a component of itself (directly or indirectly).
        </p>
        {path && (
          <div className="mt-3">
            <p className="font-semibold text-sm mb-1">Circular Path:</p>
            <div className="bg-red-50 border border-red-200 rounded p-2 font-mono text-sm">
              {path}
            </div>
          </div>
        )}
        <p className="mt-3 text-sm">
          Please remove the circular dependency before saving this BOM.
        </p>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={onDismiss}
          >
            <X className="w-4 h-4 mr-2" />
            Dismiss
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

