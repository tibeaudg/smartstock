import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScannerSettings {
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

const defaultSettings: ScannerSettings = {
  user_id: '',
  branch_id: '',
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
};

export const useScannerSettings = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings, isLoading } = useQuery<ScannerSettings>({
    queryKey: ['scannerSettings', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !activeBranch) return defaultSettings;

      const { data, error } = await supabase
        .from('scanner_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('branch_id', activeBranch.branch_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scanner settings:', error);
        return defaultSettings;
      }

      return data || defaultSettings;
    },
    enabled: !!user && !!activeBranch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<ScannerSettings>) => {
      if (!user || !activeBranch) throw new Error('User or branch not available');

      const settingsToSave = {
        ...newSettings,
        user_id: user.id,
        branch_id: activeBranch.branch_id,
      };

      const { data, error } = await supabase
        .from('scanner_settings')
        .upsert(settingsToSave, {
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

  const playScanSound = () => {
    if (!settings.sound_enabled) return;

    try {
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
    } catch (error) {
      console.warn('Could not play scan sound:', error);
    }
  };

  const triggerVibration = () => {
    if (!settings.vibration_enabled) return;

    try {
      if (navigator.vibrate) {
        navigator.vibrate(100); // 100ms vibration
      }
    } catch (error) {
      console.warn('Could not trigger vibration:', error);
    }
  };

  const onScanSuccess = () => {
    playScanSound();
    triggerVibration();
  };

  return {
    settings,
    isLoading,
    saveSettings: saveSettingsMutation.mutate,
    isSaving: saveSettingsMutation.isPending,
    onScanSuccess,
    playScanSound,
    triggerVibration,
  };
};
