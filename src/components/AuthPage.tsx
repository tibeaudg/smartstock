'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from './Header';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);

        if (error) {
          toast.error(error?.message === 'Invalid login credentials' ? 'Ongeldig e-mailadres of wachtwoord.' : error?.message || 'Inloggen mislukt.');
          return;
        }

        toast.success('Welkom terug!');
        // De onAuthStateChange listener in je AuthProvider zou de app state moeten bijwerken.
        // De redirect gebeurt dan vanzelf, of je kunt hem hier forceren.
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });

      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          toast.error('Wachtwoorden komen niet overeen.');
          return;
        }
        if (password.length < 8) { // Aangeraden: 8 tekens
          toast.error('Wachtwoord moet minimaal 8 tekens zijn.');
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          toast.error(error.message.includes('User already registered') ? 'Er bestaat al een account met dit e-mailadres.' : error.message);
          return;
        }

        toast.success('Account aangemaakt!', { description: 'Controleer je inbox om je e-mailadres te bevestigen.' });
        setMode('login');
        clearForm();

      } else if (mode === 'reset') {
        // Dit is de AANVRAAG voor een reset, niet de reset zelf.
        const { error } = await resetPassword(email);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Reset-instructies verzonden!', { description: `Als er een account bestaat voor ${email}, is er een e-mail verzonden.` });
        setMode('login');
      }
    } catch (err: any) {
      console.error('Onverwachte Auth fout:', err);
      toast.error(err.message || 'Er is een onbekende fout opgetreden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header onLoginClick={() => {}} hideAuthButtons />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* Verwijder dubbele logo/tekst, want dit zit nu in de header */}
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {mode === 'login' && 'Inloggen'}
                {mode === 'register' && 'Account aanmaken'}
                {mode === 'reset' && 'Wachtwoord herstellen'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' && 'Voer je gegevens in om in te loggen'}
                {mode === 'register' && 'Vul je gegevens in om een account aan te maken'}
                {mode === 'reset' && 'Voer je e-mailadres in om een resetlink te ontvangen'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* De JSX voor de formuliervelden blijft hetzelfde als in jouw code */}
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Voornaam</Label>
                      <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Achternaam</Label>
                      <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isSubmitting} />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSubmitting} />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Even geduld...</>
                  ) : (
                    <>
                      {mode === 'login' && 'Inloggen'}
                      {mode === 'register' && 'Account aanmaken'}
                      {mode === 'reset' && 'Verzend reset-instructies'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 pt-6">
              {/* De JSX voor de footer links blijft hetzelfde als in jouw code */}
              {mode === 'login' && (
                <>
                  <button type="button" onClick={() => { setMode('reset'); clearForm(); }} className="text-sm text-blue-600 hover:underline" disabled={isSubmitting}>
                    Wachtwoord vergeten?
                  </button>
                  <div className="text-sm text-gray-600">
                    Nog geen account?{' '}
                    <button type="button" onClick={() => { setMode('register'); clearForm(); }} className="text-blue-600 hover:underline" disabled={isSubmitting}>
                      Registreer
                    </button>
                  </div>
                </>
              )}

              {(mode === 'register' || mode === 'reset') && (
                <div className="text-sm text-gray-600">
                  Toch inloggen?{' '}
                  <button type="button" onClick={() => { setMode('login'); clearForm(); }} className="text-blue-600 hover:underline" disabled={isSubmitting}>
                    Login
                  </button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};