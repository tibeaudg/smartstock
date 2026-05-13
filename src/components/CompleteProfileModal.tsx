import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRound } from 'lucide-react';

interface CompleteProfileModalProps {
  userId: string;
  email: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  userId,
  email,
  onComplete,
  onSkip,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim()) {
      toast.error('Please enter your first name');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      if (error) throw error;
      toast.success('Profile updated — welcome aboard!');
      onComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserRound className="w-5 h-5 text-blue-600" />
            Complete your profile
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            You were invited as <strong className="text-slate-700">{email}</strong>. Add your name so teammates can identify you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cp-first">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cp-first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-last">Last name</Label>
              <Input
                id="cp-last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-slate-400 hover:text-slate-600"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !firstName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? 'Saving…' : 'Save & continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
