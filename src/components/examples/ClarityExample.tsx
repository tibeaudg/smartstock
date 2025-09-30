/**
 * Microsoft Clarity - Voorbeeld Implementatie
 * 
 * Dit bestand toont hoe je Microsoft Clarity kunt gebruiken
 * in verschillende scenario's binnen je applicatie.
 */

import { useClarity } from '@/hooks/useClarity';
import { Button } from '@/components/ui/button';

export const ClarityExample = () => {
  const { trackEvent, setTag, upgradeSession } = useClarity();

  // Voorbeeld 1: Track een belangrijke actie
  const handleSubscriptionUpgrade = () => {
    // Track het event
    trackEvent('subscription_upgrade_clicked');
    
    // Upgrade de session prioriteit
    upgradeSession('high_value_action');
    
    // Set een tag voor filtering
    setTag('conversion_intent', 'high');
    
    // Je normale business logic hier...
    console.log('Subscription upgrade gestart');
  };

  // Voorbeeld 2: Track feature usage
  const handleFeatureUsage = (featureName: string) => {
    trackEvent(`feature_used:${featureName}`);
    setTag('active_features', featureName);
  };

  // Voorbeeld 3: Track errors
  const handleError = (errorType: string) => {
    trackEvent(`error:${errorType}`);
    setTag('last_error', errorType);
    upgradeSession('error_occurred'); // Prioritize error sessions
  };

  // Voorbeeld 4: Track user journey milestones
  const handleMilestone = (milestone: string) => {
    trackEvent(`milestone:${milestone}`);
    setTag('user_journey_stage', milestone);
    
    // Belangrijke milestones kunnen worden ge-upgrade
    if (milestone === 'completed_onboarding' || milestone === 'first_purchase') {
      upgradeSession(milestone);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Microsoft Clarity - Voorbeelden</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Conversie Events</h3>
        <Button onClick={handleSubscriptionUpgrade}>
          Upgrade Subscription (High Priority)
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Feature Tracking</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleFeatureUsage('analytics_dashboard')}>
            Use Analytics
          </Button>
          <Button onClick={() => handleFeatureUsage('export_data')}>
            Export Data
          </Button>
          <Button onClick={() => handleFeatureUsage('api_access')}>
            API Access
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Error Tracking</h3>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={() => handleError('payment_failed')}
          >
            Simulate Payment Error
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleError('network_timeout')}
          >
            Simulate Network Error
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">User Journey Milestones</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleMilestone('viewed_pricing')}
          >
            Viewed Pricing
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleMilestone('started_trial')}
          >
            Started Trial
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleMilestone('completed_onboarding')}
          >
            Completed Onboarding
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleMilestone('first_purchase')}
          >
            First Purchase
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">💡 Tip</h4>
        <p className="text-sm text-gray-700">
          Open je browser console om de Clarity logs te zien. Ga naar je 
          <a 
            href="https://clarity.microsoft.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            Clarity Dashboard
          </a>
          {' '}om de opgenomen sessies en heatmaps te bekijken.
        </p>
      </div>
    </div>
  );
};

export default ClarityExample;
