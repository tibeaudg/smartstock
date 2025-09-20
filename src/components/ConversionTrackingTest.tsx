// Conversion Tracking Test Component
// This component helps test Google Ads conversion tracking
// Remove this file after testing is complete

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';

export const ConversionTrackingTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isGoogleAdsAvailable, setIsGoogleAdsAvailable] = useState(false);

  React.useEffect(() => {
    // Check if Google Ads tracking is available
    const available = GoogleAdsTracking.isAvailable();
    setIsGoogleAdsAvailable(available);
    
    if (available) {
      addTestResult('✅ Google Ads tracking is available');
    } else {
      addTestResult('❌ Google Ads tracking is NOT available');
    }
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testPageViewConversion = () => {
    try {
      GoogleAdsTracking.trackPageViewConversion('test_page', 1);
      addTestResult('✅ Page view conversion tracked');
    } catch (error) {
      addTestResult(`❌ Page view conversion failed: ${error}`);
    }
  };

  const testRegistrationConversion = () => {
    try {
      GoogleAdsTracking.trackRegistrationConversion('test-user-123', 'test@example.com', 10);
      addTestResult('✅ Registration conversion tracked');
    } catch (error) {
      addTestResult(`❌ Registration conversion failed: ${error}`);
    }
  };

  const testLoginConversion = () => {
    try {
      GoogleAdsTracking.trackLoginConversion('test-user-123', 'test@example.com', 5);
      addTestResult('✅ Login conversion tracked');
    } catch (error) {
      addTestResult(`❌ Login conversion failed: ${error}`);
    }
  };

  const testCustomConversion = () => {
    try {
      GoogleAdsTracking.trackCustomConversion(
        'test_conversion',
        'AW-17574614935',
        3,
        {
          test_parameter: 'test_value',
          timestamp: Date.now()
        }
      );
      addTestResult('✅ Custom conversion tracked');
    } catch (error) {
      addTestResult(`❌ Custom conversion failed: ${error}`);
    }
  };

  const testEnhancedConversion = () => {
    try {
      GoogleAdsTracking.trackEnhancedConversion({
        conversionId: 'AW-17574614935',
        conversionLabel: 'test_enhanced',
        value: 20,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        customParameters: {
          test_type: 'enhanced_conversion'
        }
      });
      addTestResult('✅ Enhanced conversion tracked');
    } catch (error) {
      addTestResult(`❌ Enhanced conversion failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-hidden z-50 bg-white shadow-lg border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Conversion Tracking Test</CardTitle>
        <CardDescription className="text-xs">
          Status: {isGoogleAdsAvailable ? 'Available' : 'Not Available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <Button size="sm" onClick={testPageViewConversion} variant="outline" className="text-xs">
            Page View
          </Button>
          <Button size="sm" onClick={testRegistrationConversion} variant="outline" className="text-xs">
            Registration
          </Button>
          <Button size="sm" onClick={testLoginConversion} variant="outline" className="text-xs">
            Login
          </Button>
          <Button size="sm" onClick={testCustomConversion} variant="outline" className="text-xs">
            Custom
          </Button>
          <Button size="sm" onClick={testEnhancedConversion} variant="outline" className="text-xs">
            Enhanced
          </Button>
          <Button size="sm" onClick={clearResults} variant="destructive" className="text-xs">
            Clear
          </Button>
        </div>
        
        <div className="max-h-32 overflow-y-auto">
          <div className="text-xs space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className={`p-1 rounded ${
                result.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {result}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
