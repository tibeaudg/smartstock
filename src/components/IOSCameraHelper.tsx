import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Smartphone, CheckCircle, XCircle, Info, Settings, ExternalLink } from 'lucide-react';

interface IOSCameraHelperProps {
  onRetry: () => void;
  onClose: () => void;
}

export const IOSCameraHelper: React.FC<IOSCameraHelperProps> = ({ onRetry, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasCheckedSettings, setHasCheckedSettings] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Controleer Browser',
      description: 'Zorg dat je Safari gebruikt (niet Chrome of Firefox)',
      icon: <Smartphone className="w-6 h-6" />,
      action: 'Ik gebruik Safari',
      nextStep: 2
    },
    {
      id: 2,
      title: 'Camera Toestemming',
      description: 'Geef camera toegang wanneer de browser hierom vraagt',
      icon: <Camera className="w-6 h-6" />,
      action: 'Toestemming gegeven',
      nextStep: 3
    },
    {
      id: 3,
      title: 'Safari Instellingen',
      description: 'Controleer of camera toegang is ingeschakeld in Safari instellingen',
      icon: <Settings className="w-6 h-6" />,
      action: 'Instellingen gecontroleerd',
      nextStep: 4
    },
    {
      id: 4,
      title: 'Test Camera',
      description: 'Probeer de camera opnieuw te starten',
      icon: <CheckCircle className="w-6 h-6" />,
      action: 'Camera testen',
      nextStep: 5
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const handleNextStep = () => {
    if (currentStep === 3) {
      setHasCheckedSettings(true);
    }
    if (currentStep === 4) {
      onRetry();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const openSafariSettings = () => {
    // Try to open Safari settings
    if (window.location.protocol === 'https:') {
      // On iOS, we can't directly open settings, but we can show instructions
      setHasCheckedSettings(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">iPhone Camera Helper</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stap {currentStep} van {steps.length}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          {currentStepData && (
            <Card className="mb-6">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 text-blue-600">
                  {currentStepData.icon}
                </div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Waarom Safari?</p>
                          <p className="text-xs mt-1">
                            Safari heeft betere ondersteuning voor camera toegang op iPhone dan andere browsers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium">Camera Toegang</p>
                          <p className="text-xs mt-1">
                            Klik op "Toestaan" wanneer de browser om camera toegang vraagt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Settings className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div className="text-sm text-orange-700">
                          <p className="font-medium">Safari Instellingen</p>
                          <p className="text-xs mt-1">
                            1. Ga naar Instellingen op je iPhone<br/>
                            2. Scroll naar beneden en tik op "Safari"<br/>
                            3. Scroll naar beneden en tik op "Camera"<br/>
                            4. Zorg dat "Toestaan" is geselecteerd
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={openSafariSettings}
                      variant="outline" 
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ik heb de instellingen gecontroleerd
                    </Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-700">
                          <p className="font-medium">Klaar om te testen!</p>
                          <p className="text-xs mt-1">
                            Nu gaan we de camera opnieuw proberen te starten.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    onClick={handleNextStep}
                    className="w-full"
                    disabled={currentStep === 3 && !hasCheckedSettings}
                  >
                    {currentStepData.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Tips */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Extra Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Zorg dat je HTTPS gebruikt (niet HTTP)</li>
                  <li>• Sluit andere apps die de camera gebruiken</li>
                  <li>• Probeer de pagina te verversen na het geven van toestemming</li>
                  <li>• Houd de camera ongeveer 10-15cm van de barcode</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
