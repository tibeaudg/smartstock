import React from 'react';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ModuleCheckout } from '@/components/payments/ModuleCheckout';
import { Lock, Crown, Star, Zap, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

interface ModuleFeatureGateProps {
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
  modulePrice: number;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export const ModuleFeatureGate: React.FC<ModuleFeatureGateProps> = ({
  moduleId,
  moduleTitle,
  moduleDescription,
  modulePrice,
  children,
  fallbackContent,
  showUpgradePrompt = true
}) => {
  const { data: access, isLoading } = useModuleAccess(moduleId);
  const [showCheckout, setShowCheckout] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Laden...</span>
      </div>
    );
  }

  if (access?.hasAccess) {
    return <>{children}</>;
  }

  if (fallbackContent) {
    return <>{fallbackContent}</>;
  }

  if (!showUpgradePrompt) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <Lock className="w-6 h-6 mr-2" />
        <span>Deze functie is niet beschikbaar</span>
      </div>
    );
  }

  const getModuleIcon = (moduleId: string) => {
    if (moduleId.includes('analytics')) return BarChart3;
    if (moduleId.includes('automation')) return Settings;
    if (moduleId.includes('integration')) return Zap;
    if (moduleId.includes('premium')) return Crown;
    return Star;
  };

  const Icon = getModuleIcon(moduleId);

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">{moduleTitle}</CardTitle>
            <CardDescription>{moduleDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">€{modulePrice}</div>
              <div className="text-sm text-gray-500">per maand</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Premium functie</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Onbeperkt gebruik</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Direct beschikbaar</span>
              </div>
            </div>

            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade naar Premium
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Module Abonnement</DialogTitle>
                </DialogHeader>
                <ModuleCheckout
                  module={{
                    id: moduleId,
                    title: moduleTitle,
                    description: moduleDescription,
                    price_monthly: modulePrice,
                    price_yearly: modulePrice * 10, // 10 maanden voor jaarlijks
                    features: [
                      'Onbeperkt gebruik van deze functie',
                      'Premium support',
                      'Geen advertenties',
                      'Alle toekomstige updates'
                    ],
                    category: 'premium' as const
                  }}
                  onSuccess={() => {
                    setShowCheckout(false);
                    // Refresh the page to show the unlocked content
                    window.location.reload();
                  }}
                  onCancel={() => setShowCheckout(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Utility component for simple access checks
export const ModuleAccessCheck: React.FC<{
  moduleId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ moduleId, children, fallback }) => {
  const { data: access, isLoading } = useModuleAccess(moduleId);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>;
  }

  if (access?.hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};
