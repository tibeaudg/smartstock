'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from './HeaderPublic';
import { cn } from '@/lib/utils';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useAuthConversionTracking } from '@/hooks/useAuthConversionTracking';

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
  
  // Gebruik de page refresh hook
  usePageRefresh();

  // Google Tag Manager setup
  useEffect(() => {
    // Load Google Tag Manager script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-758697169';
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'AW-758697169');

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js?id=AW-758697169"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Conversie tracking hook
  const {
    trackRegistrationStarted,
    trackRegistrationCompleted,
    trackLoginAttempt,
    trackLoginSuccess,
    trackFormAbandonment,
    trackError,
    isTrackingReady
  } = useAuthConversionTracking({ email });

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
        // Track login attempt
        if (isTrackingReady) {
          await trackLoginAttempt();
        }

        const { error } = await signIn(email, password);

        if (error) {
          // Track login error
          if (isTrackingReady) {
            await trackError(error.message, 'login_attempt');
          }
          toast.error(error?.message === 'Invalid login credentials' ? 'Ongeldig e-mailadres of wachtwoord.' : error?.message || 'Inloggen mislukt.');
          return;
        }

        // Track successful login
        if (isTrackingReady) {
          await trackLoginSuccess();
        }

      } else if (mode === 'register') {
        // Track registration started
        if (isTrackingReady) {
          await trackRegistrationStarted();
        }

        if (password !== confirmPassword) {
          if (isTrackingReady) {
            await trackFormAbandonment('password_mismatch');
          }
          toast.error('Wachtwoorden komen niet overeen.');
          return;
        }
        if (password.length < 8) { // Aangeraden: 8 tekens
          if (isTrackingReady) {
            await trackFormAbandonment('password_too_short');
          }
          toast.error('Wachtwoord moet minimaal 8 tekens zijn.');
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          // Track registration error
          if (isTrackingReady) {
            await trackError(error.message, 'registration_started');
          }
          toast.error(error.message.includes('User already registered') ? 'Er bestaat al een account met dit e-mailadres.' : error.message);
          return;
        }

        // Track successful registration
        if (isTrackingReady) {
          await trackRegistrationCompleted();
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            {/* Optional: Add logo or title here */}
          </div>
          
          <Card className="shadow-lg mx-2 sm:mx-0">
            <CardHeader className="pb-4 sm:pb-6">
              {/* Switcher bovenaan de modal - verbeterd voor mobiel */}
              <div className="flex justify-center">
                <div className="flex w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-1">
                  <button
                    className={cn(
                      'flex-1 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
                      mode === 'login'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-800'
                    )}
                    onClick={() => { setMode('login'); clearForm(); }}
                    disabled={isSubmitting || mode === 'login'}
                    type="button"
                  >
                    Inloggen
                  </button>
                  <button
                    className={cn(
                      'flex-1 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
                      mode === 'register'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-800'
                    )}
                    onClick={async () => { 
                      setMode('register'); 
                      clearForm(); 
                      // Track when user switches to registration mode
                      if (isTrackingReady) {
                        await trackRegistrationStarted();
                      }
                    }}
                    disabled={isSubmitting || mode === 'register'}
                    type="button"
                  >
                    Registreren
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* De JSX voor de formuliervelden blijft hetzelfde als in jouw code */}
                {mode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">Voornaam</Label>
                      <Input 
                        id="firstName" 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">Achternaam</Label>
                      <Input 
                        id="lastName" 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">E-mailadres</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={isSubmitting}
                    className="mt-1 h-10"
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">Wachtwoord</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="mt-1 h-10"
                    />
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Bevestig wachtwoord</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="mt-1 h-10"
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-sm font-medium mt-6" 
                  disabled={isSubmitting}
                >
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

            <CardFooter className="flex flex-col space-y-2 pt-4 pb-6 px-4 sm:px-6">
              {/* De JSX voor de footer links blijft hetzelfde als in jouw code */}
              {mode === 'login' && (
                <>
                  <button 
                    type="button" 
                    onClick={() => { setMode('reset'); clearForm(); }} 
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                    disabled={isSubmitting}
                  >
                    Wachtwoord vergeten?
                  </button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
