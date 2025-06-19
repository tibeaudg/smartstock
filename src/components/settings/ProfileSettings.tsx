import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';


import { Loader2, User, Mail, Key } from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const ProfileSettings = () => {
  const { userProfile, user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      email: userProfile?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Succesvol bijgewerkt',
        description: 'Uw profiel is succesvol bijgewerkt.',
      });
    } catch (error) {
      console.error('Profiel bijwerken fout:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het bijwerken van uw profiel.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userProfile?.email) return;

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userProfile.email, {
        redirectTo: `${window.location.origin}/dashboard`,
      });

      if (error) throw error;

      toast({
        title: 'Email verzonden',
        description: 'Een wachtwoord reset email is verzonden.',
      });
    } catch (error) {
      console.error('Wachtwoord reset fout:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het verzenden van de reset email.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Weet je zeker dat je je account wil verwijderen? Dit kan niet ongedaan gemaakt worden.'
    );
    if (!confirmed || !userProfile?.id) return;

    setIsDeletingAccount(true);

    try {
      const { error } = await supabase.auth.admin.deleteUser(userProfile.id);
      if (error) throw error;

      alert('Account succesvol verwijderd.');
      window.location.href = '/';
    } catch (error) {
      console.error('Account verwijderen fout:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het verwijderen van uw account.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Persoonlijke Informatie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Persoonlijke Informatie</span>
            </CardTitle>
            <CardDescription>
              Bijwerken van uw naam en contact informatie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { required: 'Voornaam is verplicht' })}
                    placeholder="Uw voornaam"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input
                    id="lastName"
                    {...register('lastName', { required: 'Achternaam is verplicht' })}
                    placeholder="Uw achternaam"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is verplicht',
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: 'Ongeldig emailadres',
                    },
                  })}
                  placeholder="uw@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Profiel Bijwerken
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Beveiliging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>Beveiliging</span>
            </CardTitle>
            <CardDescription>
              Beheer uw account beveiliging en wachtwoord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Huidige Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{userProfile?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 capitalize">
                  {userProfile?.role}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isChangingPassword}
            >
              {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Wachtwoord Wijzigen
            </Button>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};
