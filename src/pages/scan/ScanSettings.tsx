import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, Camera, Volume2, VolumeX, Save, RotateCcw, TestTube } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package } from 'lucide-react';

interface ScannerSettings {
  id?: string;
  user_id: string;
  branch_id: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  auto_focus: boolean;
  flash_enabled: boolean;
  scan_timeout: number;
  default_transaction_type: 'in' | 'out';
  auto_create_products: boolean;
  require_confirmation: boolean;
  camera_resolution: 'high' | 'medium' | 'low';
  scan_sound_volume: number;
}

export default function ScanSettings() {
  const { user, userProfile } = useAuth();
  const { activeBranch } = useBranches();
  const { data: scannerAccess } = useModuleAccess('scanning');
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<ScannerSettings>({
    user_id: user?.id || '',
    branch_id: activeBranch?.branch_id || '',
    sound_enabled: true,
    vibration_enabled: true,
    auto_focus: true,
    flash_enabled: false,
    scan_timeout: 5,
    default_transaction_type: 'in',
    auto_create_products: false,
    require_confirmation: true,
    camera_resolution: 'medium',
    scan_sound_volume: 50,
  });

  // Check if user has access to scanner module
  if (!scannerAccess?.hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen toegang</h2>
          <p className="text-gray-600">Je hebt geen toegang tot de Barcode Scanner module.</p>
        </div>
      </div>
    );
  }

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery<ScannerSettings>({
    queryKey: ['scannerSettings', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !activeBranch) return settings;

      const { data, error } = await supabase
        .from('scanner_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('branch_id', activeBranch.branch_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scanner settings:', error);
        return settings;
      }

      return data || settings;
    },
    enabled: !!user && !!activeBranch && !!scannerAccess?.hasAccess,
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: ScannerSettings) => {
      const { data, error } = await supabase
        .from('scanner_settings')
        .upsert(newSettings, {
          onConflict: 'user_id,branch_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving scanner settings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Scanner instellingen opgeslagen!');
      queryClient.invalidateQueries({ queryKey: ['scannerSettings'] });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast.error('Fout bij opslaan van instellingen');
    },
  });

  const handleSave = () => {
    if (!user || !activeBranch) return;
    
    saveSettingsMutation.mutate({
      ...settings,
      user_id: user.id,
      branch_id: activeBranch.branch_id,
    });
  };

  const handleReset = () => {
    setSettings({
      user_id: user?.id || '',
      branch_id: activeBranch?.branch_id || '',
      sound_enabled: true,
      vibration_enabled: true,
      auto_focus: true,
      flash_enabled: false,
      scan_timeout: 5,
      default_transaction_type: 'in',
      auto_create_products: false,
      require_confirmation: true,
      camera_resolution: 'medium',
      scan_sound_volume: 50,
    });
  };

  const testSound = () => {
    // Create a simple beep sound for testing
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(settings.scan_sound_volume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Instellingen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Scanner Instellingen
          </h1>
          <p className="text-gray-600 mt-1">
            Configureer je barcode scanner voor optimale prestaties
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveSettingsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saveSettingsMutation.isPending ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </div>

      {/* Camera Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Camera Instellingen
          </CardTitle>
          <CardDescription>
            Configureer de camera voor optimale barcode scanning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-focus">Automatische focus</Label>
                <Switch
                  id="auto-focus"
                  checked={settings.auto_focus}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_focus: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="flash">Flash inschakelen</Label>
                <Switch
                  id="flash"
                  checked={settings.flash_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, flash_enabled: checked }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="resolution">Camera resolutie</Label>
                <Select 
                  value={settings.camera_resolution} 
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setSettings(prev => ({ ...prev, camera_resolution: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Hoog (1080p)</SelectItem>
                    <SelectItem value="medium">Gemiddeld (720p)</SelectItem>
                    <SelectItem value="low">Laag (480p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeout">Scan timeout (seconden)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.scan_timeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, scan_timeout: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio & Feedback Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings.sound_enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            Audio & Feedback
          </CardTitle>
          <CardDescription>
            Configureer geluiden en trillingen voor scan feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">Geluid inschakelen</Label>
                <Switch
                  id="sound"
                  checked={settings.sound_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound_enabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">Trilling inschakelen</Label>
                <Switch
                  id="vibration"
                  checked={settings.vibration_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vibration_enabled: checked }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              {settings.sound_enabled && (
                <div>
                  <Label htmlFor="volume">Geluidsvolume</Label>
                  <div className="space-y-2">
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={10}
                      value={[settings.scan_sound_volume]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, scan_sound_volume: value[0] }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Stil</span>
                      <span>{settings.scan_sound_volume}%</span>
                      <span>Hard</span>
                    </div>
                    <Button 
                      onClick={testSound} 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                    >
                      <TestTube className="w-4 h-4" />
                      Test geluid
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Behavior Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Gedrag</CardTitle>
          <CardDescription>
            Configureer hoe de scanner zich gedraagt tijdens het scannen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-type">Standaard transactie type</Label>
                <Select 
                  value={settings.default_transaction_type} 
                  onValueChange={(value: 'in' | 'out') => 
                    setSettings(prev => ({ ...prev, default_transaction_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Inkomend</SelectItem>
                    <SelectItem value="out">Uitgaand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-create">Automatisch producten aanmaken</Label>
                <Switch
                  id="auto-create"
                  checked={settings.auto_create_products}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_create_products: checked }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmation">Bevestiging vereisen</Label>
                <Switch
                  id="confirmation"
                  checked={settings.require_confirmation}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_confirmation: checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
