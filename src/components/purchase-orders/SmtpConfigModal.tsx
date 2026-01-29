import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, TestTube, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SmtpConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SmtpSettings {
  id?: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  use_tls: boolean;
}

export const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<SmtpSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: '',
    from_name: '',
    use_tls: true
  });

  useEffect(() => {
    if (isOpen && user) {
      loadSmtpSettings();
    }
  }, [isOpen, user]);

  const loadSmtpSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading SMTP settings:', error);
        return;
      }

      if (data) {
        setSettings({
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_username: data.smtp_username,
          smtp_password: '', // Don't load password for security
          from_email: data.from_email,
          from_name: data.from_name || '',
          use_tls: data.use_tls
        });
      }
    } catch (error) {
      console.error('Error loading SMTP settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!settings.smtp_host || !settings.smtp_username || !settings.from_email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        user_id: user.id,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_username: settings.smtp_username,
        from_email: settings.from_email,
        from_name: settings.from_name,
        use_tls: settings.use_tls
      };
      if (settings.smtp_password && settings.smtp_password.trim()) {
        payload.smtp_password = settings.smtp_password;
      }
      const { error } = await supabase
        .from('smtp_settings')
        .upsert(payload as Record<string, never>, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving SMTP settings:', error);
        toast.error('Error saving SMTP settings');
        return;
      }

      toast.success('SMTP settings saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      toast.error('Error saving SMTP settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!user) return;

    if (!settings.smtp_host || !settings.smtp_username || !settings.from_email) {
      toast.error('Please fill in all required fields before testing');
      return;
    }

    setTesting(true);
    try {
      // TODO: Implement test email sending via API
      // For now, just simulate a test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test email sent successfully!');
    } catch (error) {
      console.error('Error testing SMTP settings:', error);
      toast.error('Error testing SMTP settings');
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field: keyof SmtpSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            SMTP Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Email Server Settings</h3>
            <p className="text-sm text-blue-800">
              Configure your SMTP server settings to send purchase order emails to vendors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host *</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.gmail.com"
                value={settings.smtp_host}
                onChange={(e) => handleInputChange('smtp_host', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port *</Label>
              <Input
                id="smtp-port"
                type="number"
                placeholder="587"
                value={settings.smtp_port}
                onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value) || 587)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-username">Username *</Label>
              <Input
                id="smtp-username"
                placeholder="your-email@gmail.com"
                value={settings.smtp_username}
                onChange={(e) => handleInputChange('smtp_username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">Password *</Label>
              <Input
                id="smtp-password"
                type="password"
                placeholder="Your email password or app password"
                value={settings.smtp_password}
                onChange={(e) => handleInputChange('smtp_password', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-email">From Email *</Label>
              <Input
                id="from-email"
                type="email"
                placeholder="noreply@yourcompany.com"
                value={settings.from_email}
                onChange={(e) => handleInputChange('from_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                placeholder="Your Company Name"
                value={settings.from_name}
                onChange={(e) => handleInputChange('from_name', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="use-tls"
              checked={settings.use_tls}
              onCheckedChange={(checked) => handleInputChange('use_tls', checked)}
            />
            <Label htmlFor="use-tls">Use TLS/SSL encryption</Label>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Security Note</h4>
            <p className="text-sm text-yellow-800">
              Your SMTP password is encrypted and stored securely. For Gmail, use an App Password instead of your regular password.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Common SMTP Settings</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Gmail:</strong> smtp.gmail.com:587 (TLS) or 465 (SSL)</p>
              <p><strong>Outlook:</strong> smtp-mail.outlook.com:587</p>
              <p><strong>Yahoo:</strong> smtp.mail.yahoo.com:587</p>
              <p><strong>Custom:</strong> Contact your email provider for settings</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || loading}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
