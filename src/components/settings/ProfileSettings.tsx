'use client';

import React, { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Key, CheckCircle, Check, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema voor profiel-data validatie
const profileSchema = z.object({
  firstName: z.string().min(1, 'Voornaam is verplicht'),
  lastName: z.string().min(1, 'Achternaam is verplicht'),
  email: z.string().email('Ongeldig emailadres'),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// Schema voor wachtwoord-data validatie
const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens zijn.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"], // Foutmelding wordt getoond bij het 'confirmPassword' veld
});
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfileSettings = () => {
  const { userProfile, user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // Bepaal of de gebruiker al een wachtwoord heeft ingesteld.
  const hasPassword = useMemo(() => 
    user?.identities?.some(id => id.provider === 'password'),
    [user]
  );

  // React Hook Form voor profielgegevens
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      email: user?.email || '',
    },
  });
  
  // Aparte React Hook Form instance voor het wachtwoord
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!user) return;
    setIsProfileLoading(true);
    try {
        const { error } = await supabase.from('profiles').update({
            first_name: data.firstName,
            last_name: data.lastName,
            updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        if (error) throw error;
        toast.success('Profiel succesvol bijgewerkt.');
        setIsProfileSuccess(true);
        setTimeout(() => setIsProfileSuccess(false), 1500);
    } catch (error: any) {
        console.error('Profiel bijwerken fout:', error);
        toast.error('Fout bij bijwerken profiel', { description: error.message });
    } finally {
        setIsProfileLoading(false);
    }
};

const onPasswordSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    setIsPasswordLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        });
        if (error) throw error;

        // Gebruik een korte timeout zodat de session update kan voltooien en React state kan updaten
        setTimeout(() => {
            toast.success('Wachtwoord succesvol bijgewerkt!');
            resetPasswordForm();
            setIsPasswordLoading(false);
        }, 200);
        return;
    } catch (error: any) {
        console.error('Wachtwoord wijzigen fout:', error);
        toast.error('Fout bij wijzigen wachtwoord', { description: error?.message || 'Onbekende fout' });
        setIsPasswordLoading(false);
    }
};
  
  // VEILIGHEIDSFIX: Accountverwijdering moet via een Edge Function.
  const handleDeleteAccount = () => {
      toast.info('Account verwijderen', {
          description: 'Deze actie moet via een beveiligde server-functie worden afgehandeld. Implementatie is vereist.',
          action: { label: 'Ok', onClick: () => {} },
      });
      // De oude, ONVEILIGE code is verwijderd.
      // Voorbeeld aanroep naar een Edge Function:
      // await supabase.functions.invoke('delete-user-account');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Persoonlijke Informatie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><User className="w-4 h-4" /><span>Persoonlijke Informatie</span></CardTitle>
            <CardDescription>Bijwerken van uw naam en contactinformatie.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input id="firstName" {...registerProfile('firstName')} placeholder="Uw voornaam" />
                  {profileErrors.firstName && <p className="text-sm text-red-600">{profileErrors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input id="lastName" {...registerProfile('lastName')} placeholder="Uw achternaam" />
                  {profileErrors.lastName && <p className="text-sm text-red-600">{profileErrors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerProfile('email')} placeholder="uw@email.com" disabled />
                 <p className="text-xs text-gray-500">E-mail kan momenteel niet gewijzigd worden.</p>
                {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email.message}</p>}
              </div>
              <Button type="submit" disabled={isProfileLoading || isProfileSuccess}>
                {isProfileLoading ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 animate-pulse" />
                ) : isProfileSuccess ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 animate-pulse" />
                ) : null}
                Profiel Bijwerken
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Beveiliging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Key className="w-4 h-4" /><span>Beveiliging</span></CardTitle>
            <CardDescription>{hasPassword ? 'Wijzig hier uw wachtwoord.' : 'Stel een wachtwoord in om uw account te beveiligen.'}</CardDescription>
          </CardHeader>
          <CardContent>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                  <Input id="newPassword" type="password" {...registerPassword('newPassword')} placeholder="••••••••" />
                  {passwordErrors.newPassword && <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
                  <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} placeholder="••••••••" />
                  {passwordErrors.confirmPassword && <p className="text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
                </div>
                  <Button type="submit" disabled={isPasswordLoading}>
                      {isPasswordLoading && <Check className=" w-4 h-4 mr-2 animate-pulse" />}
                      {hasPassword ? 'Wachtwoord Wijzigen' : 'Wachtwoord Wijzigen'}
                  </Button>
            </form>
          </CardContent>

        </Card>
      </div>

      {/* Logout Section - Only visible on mobile */}
      {isMobile && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <LogOut className="w-4 h-4" />
              <span>Afmelden</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Meld u af van uw account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Afmelden
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};