import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, Package, Zap, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welkom bij StockFlow",
    description: "Laten we je account instellen zodat je direct aan de slag kunt met voorraadbeheer.",
    icon: <Zap className="w-12 h-12 text-blue-500" />
  },
  {
    title: "Wat voor bedrijf heb je?",
    description: "Kies het type bedrijf of sector waarin je actief bent.",
    icon: <Building2 className="w-12 h-12 text-blue-500" />
  },
  {
    title: "Vertel ons meer over je bedrijf",
    description: "Zo kunnen we StockFlow beter afstemmen op jouw situatie.",
    icon: <Zap className="w-12 h-12 text-blue-500" />
  },
  {
    title: "Maak je eerste vestiging aan",
    description: "Een vestiging is waar je je voorraad beheert. Je kunt later meer vestigingen toevoegen.",
    icon: <Building2 className="w-12 h-12 text-blue-500" />
  },
  {
    title: "Voeg je eerste product toe",
    description: "Begin met het toevoegen van producten aan je voorraad.",
    icon: <Package className="w-12 h-12 text-blue-500" />
  }
];

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingModal = ({ forceOpen, onClose }: OnboardingModalProps) => {
  const [open, setOpen] = useState(forceOpen ?? true);
  const [currentStep, setCurrentStep] = useState(0);
  const [branchName, setBranchName] = useState('');
  const [companyType, setCompanyType] = useState<string>('');
  const [customType, setCustomType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // Extra onboarding vragen
  const [employees, setEmployees] = useState('');
  const [stockSize, setStockSize] = useState('');
  const [wantsNotifications, setWantsNotifications] = useState<boolean|null>(null);
  const [wantsDemoStock, setWantsDemoStock] = useState<boolean|null>(null);
  const [mainGoal, setMainGoal] = useState('');
  const [usesBarcodes, setUsesBarcodes] = useState<boolean|null>(null);
  const [usesOtherSystem, setUsesOtherSystem] = useState<boolean|null>(null);
  const [otherSystemName, setOtherSystemName] = useState('');
  const { user, userProfile } = useAuth();

  // Suggesties voor sectoren/bedrijfstypes
  const companyTypes = [
    'Café/Restaurant',
    'Apotheek',
    'Bouwbedrijf',
    'Groothandel',
    'Webwinkel',
    'Autogarage',
    'Winkel',
    'Overig',
  ];

  const handleNext = async () => {
    // Stap 1: bedrijfstype opslaan
    if (currentStep === 1) {
      if (!companyType || (companyType === 'Overig' && !customType)) {
        toast.error('Selecteer een bedrijfstype of vul een sector in.');
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase
          .from('company_types')
          .upsert({
            user_id: user?.id,
            type: companyType,
            custom_type: companyType === 'Overig' ? customType : null,
          }, { onConflict: 'user_id' });
        if (error) throw error;
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    // Stap 2: extra vragen opslaan
    if (currentStep === 2) {
      if (!employees || !stockSize || wantsNotifications === null || wantsDemoStock === null || !mainGoal || usesBarcodes === null || usesOtherSystem === null || (usesOtherSystem && !otherSystemName)) {
        toast.error('Beantwoord alle vragen.');
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase
          .from('onboarding_answers')
          .upsert({
            user_id: user?.id,
            employees,
            stock_size: stockSize,
            wants_notifications: wantsNotifications,
            wants_demo_stock: wantsDemoStock,
            main_goal: mainGoal,
            uses_barcodes: usesBarcodes,
            uses_other_system: usesOtherSystem,
            other_system_name: usesOtherSystem ? otherSystemName : null,
          }, { onConflict: 'user_id' });
        if (error) throw error;
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    // Stap 3: vestiging aanmaken
    if (currentStep === 3 && branchName) {
      setLoading(true);
      try {
        // Create the first branch
        const { data: branch, error: branchError } = await supabase
          .from('branches')
          .insert([{
            name: branchName,
            owner_id: user?.id,
          }])
          .select()
          .single();

        if (branchError) throw branchError;

        // Update user's onboarding status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user?.id);

        if (profileError) throw profileError;

        toast.success('Vestiging succesvol aangemaakt!');
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user || (userProfile?.onboarding_completed && !forceOpen)) {
    return null;
  }

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {ONBOARDING_STEPS[currentStep].icon}
            <DialogTitle className="mt-4 text-xl">
              {ONBOARDING_STEPS[currentStep].title}
            </DialogTitle>
            <DialogDescription className="mt-2">
              {ONBOARDING_STEPS[currentStep].description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`border rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${companyType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                  onClick={() => setCompanyType(type)}
                  disabled={loading}
                >
                  <span className="font-medium text-base">{type}</span>
                </button>
              ))}
            </div>
          )}
          {currentStep === 1 && companyType === 'Overig' && (
            <div className="mt-4">
              <Label htmlFor="customType">Sector/branche</Label>
              <Input
                id="customType"
                placeholder="Bijv. Medische groothandel"
                value={customType}
                onChange={e => setCustomType(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <Label>Hoeveel medewerkers werken er met voorraad?</Label>
                <select className="w-full border rounded p-2 mt-1" value={employees} onChange={e => setEmployees(e.target.value)} disabled={loading}>
                  <option value="">Maak een keuze</option>
                  <option value="1">1</option>
                  <option value="2-5">2-5</option>
                  <option value="6-20">6-20</option>
                  <option value=">20">Meer dan 20</option>
                </select>
              </div>
              <div className="mb-4">
                <Label>Hoe groot is je voorraad?</Label>
                <select className="w-full border rounded p-2 mt-1" value={stockSize} onChange={e => setStockSize(e.target.value)} disabled={loading}>
                  <option value="">Maak een keuze</option>
                  <option value="<100">Minder dan 100 producten</option>
                  <option value="100-1000">100 tot 1000 producten</option>
                  <option value=">1000">Meer dan 1000 producten</option>
                </select>
              </div>
              <div className="mb-4">
                <Label>Wil je meldingen ontvangen bij lage voorraad?</Label>
                <div className="flex gap-4 mt-1">
                  <Button type="button" variant={wantsNotifications === true ? 'default' : 'outline'} onClick={() => setWantsNotifications(true)} disabled={loading}>Ja</Button>
                  <Button type="button" variant={wantsNotifications === false ? 'default' : 'outline'} onClick={() => setWantsNotifications(false)} disabled={loading}>Nee</Button>
                </div>
              </div>

              <div className="mb-4">
                <Label>Wat is je belangrijkste doel?</Label>
                <select className="w-full border rounded p-2 mt-1" value={mainGoal} onChange={e => setMainGoal(e.target.value)} disabled={loading}>
                  <option value="">Maak een keuze</option>
                  <option value="Efficiëntie">Efficiëntie</option>
                  <option value="Minder fouten">Minder fouten</option>
                  <option value="Tijd besparen">Tijd besparen</option>
                  <option value="Inzicht krijgen">Inzicht krijgen</option>
                  <option value="Anders">Anders</option>
                </select>
              </div>
              <div className="mb-4">
                <Label>Werk je met barcodes?</Label>
                <div className="flex gap-4 mt-1">
                  <Button type="button" variant={usesBarcodes === true ? 'default' : 'outline'} onClick={() => setUsesBarcodes(true)} disabled={loading}>Ja</Button>
                  <Button type="button" variant={usesBarcodes === false ? 'default' : 'outline'} onClick={() => setUsesBarcodes(false)} disabled={loading}>Nee</Button>
                </div>
              </div>
              <div className="mb-4">
                <Label>Gebruik je nu al een ander systeem?</Label>
                <div className="flex gap-4 mt-1">
                  <Button type="button" variant={usesOtherSystem === true ? 'default' : 'outline'} onClick={() => setUsesOtherSystem(true)} disabled={loading}>Ja</Button>
                  <Button type="button" variant={usesOtherSystem === false ? 'default' : 'outline'} onClick={() => setUsesOtherSystem(false)} disabled={loading}>Nee</Button>
                </div>
                {usesOtherSystem && (
                  <Input className="mt-2" placeholder="Welk systeem?" value={otherSystemName} onChange={e => setOtherSystemName(e.target.value)} disabled={loading} />
                )}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branchName">Naam van je vestiging</Label>
                <Input
                  id="branchName"
                  placeholder="Bijv. Hoofdkantoor"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!companyType || (companyType === 'Overig' && !customType))) ||
              (currentStep === 2 && (!employees || !stockSize || wantsNotifications === null || wantsDemoStock === null || !mainGoal || usesBarcodes === null || usesOtherSystem === null || (usesOtherSystem && !otherSystemName))) ||
              (currentStep === 3 && !branchName) ||
              loading
            }
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Aan de slag' : 'Volgende'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
