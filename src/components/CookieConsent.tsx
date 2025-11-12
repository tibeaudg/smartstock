import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface CookiePreferences {
  necessary: boolean; // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const CONSENT_KEY = 'stockflow_cookie_consent';
const PREFERENCES_KEY = 'stockflow_cookie_preferences';

export const getCookieConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem(CONSENT_KEY);
  if (!consent) return null;
  
  const preferences = localStorage.getItem(PREFERENCES_KEY);
  if (!preferences) return DEFAULT_PREFERENCES;
  
  try {
    return JSON.parse(preferences);
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const setCookieConsent = (preferences: CookiePreferences): void => {
  localStorage.setItem(CONSENT_KEY, new Date().toISOString());
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  
  // Dispatch custom event so other components can react
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
};

export const hasGivenConsent = (): boolean => {
  return localStorage.getItem(CONSENT_KEY) !== null;
};

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = hasGivenConsent();
    if (!hasConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load existing preferences
      const savedPreferences = getCookieConsent();
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setCookieConsent(allAccepted);
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
    
    // Reload page to apply tracking scripts
    window.location.reload();
  };

  const handleRejectAll = () => {
    setCookieConsent(DEFAULT_PREFERENCES);
    setPreferences(DEFAULT_PREFERENCES);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
    
    // Reload page to apply changes
    window.location.reload();
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                You can also customize your preferences.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAcceptAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  size="sm"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleOpenSettings}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-blue-600" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <Label className="text-base font-semibold text-gray-900">
                    Necessary Cookies
                  </Label>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are essential for the website to function properly. 
                  They enable basic features like page navigation, secure areas access, and user authentication.
                </p>
              </div>
              <Switch
                checked={true}
                disabled
                className="opacity-60"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="analytics" className="text-base font-semibold text-gray-900">
                    Analytics Cookies
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our service.
                </p>
                <p className="text-xs text-gray-500">
                  Services: Google Analytics, Internal Analytics
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="h-4 w-4 text-purple-600" />
                  <Label htmlFor="marketing" className="text-base font-semibold text-gray-900">
                    Marketing Cookies
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies are used to track visitors across websites and display ads that are 
                  relevant and engaging. They may be set by us or third-party advertising partners.
                </p>
                <p className="text-xs text-gray-500">
                  Services: Facebook Pixel
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <Label htmlFor="functional" className="text-base font-semibold text-gray-900">
                    Functional Cookies
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies enable enhanced functionality and personalization, such as 
                  remembering your preferences and settings.
                </p>
                <p className="text-xs text-gray-500">
                  Services: Payment Processing (Stripe), Chat Support
                </p>
              </div>
              <Switch
                id="functional"
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, functional: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button
              onClick={handleRejectAll}
              variant="outline"
              size="sm"
            >
              Reject All
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                size="sm"
              >
                Accept All
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CookieConsent;

