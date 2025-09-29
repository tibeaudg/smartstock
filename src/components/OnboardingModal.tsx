'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, ArrowRight, ArrowLeft, Building2, Target, Users, BarChart3, Package, Truck, CreditCard, Shield } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingData {
  sector: string;
  businessSize: string;
  importantFeatures: string[];
  specificNeeds: string;
  expectations: string;
}

const SECTORS = [
  { id: 'retail', label: 'Retail', icon: Building2 },
  { id: 'wholesale', label: 'Wholesale', icon: Package },
  { id: 'manufacturing', label: 'Manufacturing', icon: Building2 },
  { id: 'ecommerce', label: 'E-commerce', icon: CreditCard },
  { id: 'logistics', label: 'Logistics / Transport', icon: Truck },
  { id: 'food', label: 'Food Industry', icon: Package },
  { id: 'pharmaceutical', label: 'Pharmaceutical', icon: Shield },
  { id: 'other', label: 'Other', icon: Building2 }
];

const BUSINESS_SIZES = [
  { id: 'micro', label: 'Micro (1-5 employees)', description: 'Small business' },
  { id: 'small', label: 'Small (6-50 employees)', description: 'Small to medium business' },
  { id: 'medium', label: 'Medium (51-250 employees)', description: 'Medium business' },
  { id: 'large', label: 'Large (250+ employees)', description: 'Large business' }
];

const FEATURES = [
  { id: 'inventory_tracking', label: 'Inventory Management', description: 'Basic inventory tracking and management' },
  { id: 'barcode_scanning', label: 'Barcode Scanning', description: 'Scan products with barcode scanner' },
  { id: 'analytics', label: 'Analytics & Reports', description: 'Detailed reports and analytics' },
  { id: 'multi_location', label: 'Multi-location', description: 'Manage multiple locations' },
  { id: 'api_integration', label: 'API Integration', description: 'Connect with other systems' },
  { id: 'user_management', label: 'User Management', description: 'Multiple users and roles' },
  { id: 'mobile_app', label: 'Mobile App', description: 'Access via smartphone/tablet' },
  { id: 'automation', label: 'Automation', description: 'Automated processes' }
];

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    sector: '',
    businessSize: '',
    importantFeatures: [],
    specificNeeds: '',
    expectations: ''
  });

  const totalSteps = 4;

  const handleSectorSelect = (sectorId: string) => {
    setData(prev => ({ ...prev, sector: sectorId }));
  };

  const handleBusinessSizeSelect = (sizeId: string) => {
    setData(prev => ({ ...prev, businessSize: sizeId }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setData(prev => ({
      ...prev,
      importantFeatures: prev.importantFeatures.includes(featureId)
        ? prev.importantFeatures.filter(id => id !== featureId)
        : [...prev.importantFeatures, featureId]
    }));
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('No user found');
      return;
    }

    setLoading(true);
    try {
      // Update user profile with onboarding completion
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_data: {
            sector: data.sector,
            businessSize: data.businessSize,
            importantFeatures: data.importantFeatures,
            specificNeeds: data.specificNeeds,
            expectations: data.expectations,
            completedAt: new Date().toISOString()
          }
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Save onboarding response to dedicated table
      const { error: responseError } = await supabase
        .from('onboarding_responses')
        .upsert({
          user_id: user.id,
          profile_id: user.id,
          sector: data.sector,
          business_size: data.businessSize,
          important_features: data.importantFeatures,
          specific_needs: data.specificNeeds,
          expectations: data.expectations,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (responseError) throw responseError;

      toast.success('Onboarding completed successfully!');
      
      // Refresh the page to update the auth state
      window.location.reload();
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error('An error occurred while saving your data');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.sector !== '';
      case 2:
        return data.businessSize !== '';
      case 3:
        return data.importantFeatures.length > 0;
      case 4:
        return data.specificNeeds.trim() !== '' && data.expectations.trim() !== '';
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Welcome to StockFlow!</h3>
        <p className="text-gray-600">Let's help you get the best experience. What sector do you work in?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {SECTORS.map((sector) => {
          const Icon = sector.icon;
          return (
            <Card 
              key={sector.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.sector === sector.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSectorSelect(sector.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">{sector.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">How big is your company?</h3>
        <p className="text-gray-600">This helps us select the right features for you.</p>
      </div>
      
      <div className="space-y-3">
        {BUSINESS_SIZES.map((size) => (
          <Card 
            key={size.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              data.businessSize === size.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleBusinessSizeSelect(size.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{size.label}</p>
                  <p className="text-sm text-gray-600">{size.description}</p>
                </div>
                {data.businessSize === size.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Which features are important to you?</h3>
        <p className="text-gray-600">Select all features that are relevant to your business.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {FEATURES.map((feature) => (
          <Card 
            key={feature.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              data.importantFeatures.includes(feature.id)
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFeatureToggle(feature.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{feature.label}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                {data.importantFeatures.includes(feature.id) && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Tell us more about your needs</h3>
        <p className="text-gray-600">This information helps us support you better.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="specificNeeds" className="text-base font-medium">
            What are your specific challenges with inventory management?
          </Label>
          <Textarea
            id="specificNeeds"
            value={data.specificNeeds}
            onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
            placeholder="For example: difficulties with stock levels, time-consuming processes, lack of overview..."
            className="mt-2 min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="expectations" className="text-base font-medium">
            What do you expect from StockFlow?
          </Label>
          <Textarea
            id="expectations"
            value={data.expectations}
            onChange={(e) => handleInputChange('expectations', e.target.value)}
            placeholder="For example: save time, better overview, automation, integration with other systems..."
            className="mt-2 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Onboarding - Step {currentStep} of {totalSteps}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {renderCurrentStep()}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevious}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Close' : 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : 'Complete'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
