import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Test component die een fout gooit om de ErrorBoundary te testen
const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Dit is een test fout om de ErrorBoundary te testen');
  }
  
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <h3 className="text-green-800 font-semibold">✅ ErrorBoundary Test Component</h3>
      <p className="text-green-700">Deze component werkt correct!</p>
    </div>
  );
};

// Test component voor de ErrorBoundary
export const ErrorTestComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ErrorBoundary Test</h2>
      
      <div className="mb-4">
        <button
          onClick={() => setShouldThrow(!shouldThrow)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            shouldThrow
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {shouldThrow ? 'Stop Error Test' : 'Start Error Test'}
        </button>
      </div>

      <div className="mb-4">
        <ErrorBoundary
          fallback={
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <h3 className="text-red-800 font-semibold">🚨 ErrorBoundary Fallback UI</h3>
              <p className="text-red-700">Dit is de aangepaste fallback UI voor deze test!</p>
            </div>
          }
        >
          <ErrorThrowingComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Instructies:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Klik op "Start Error Test" om een fout te simuleren</li>
          <li>De ErrorBoundary zou de fout moeten opvangen</li>
          <li>Klik op "Opnieuw proberen" in de ErrorBoundary om de fout te resetten</li>
          <li>Kijk in de console voor uitgebreide error logging</li>
        </ul>
      </div>
    </div>
  );
};
