'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, Shield, Zap, Users, Star, ArrowRight, Package } from 'lucide-react';
import { Header } from './HeaderPublic';
import { cn } from '@/lib/utils';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useAuthConversionTracking } from '@/hooks/useAuthConversionTracking';
import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
import { useTranslation } from 'react-i18next';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  // Force language and track changes
  useEffect(() => {
    console.log('AuthPage - FORCING ENGLISH LANGUAGE');
    i18n.changeLanguage('en');
    localStorage.setItem('preferred-language', 'en');
    setCurrentLanguage('en');
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('AuthPage - Language changed to:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  // Debug: Test translation keys
  console.log('AuthPage - Current language:', i18n.language);
  console.log('AuthPage - Login title:', t('auth.title.login'));
  console.log('AuthPage - Register title:', t('auth.title.register'));
  console.log('AuthPage - Login subtitle:', t('auth.subtitle.login'));

  // Fallback translations if keys don't work
  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key);
    return translation !== key ? translation : fallback;
  };

  // Check URL parameters for initial mode
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam === 'login' || modeParam === 'register') {
      setMode(modeParam);
    }
  }, [location.search]);

  const handleLoginClick = () => {
    // Navigeer naar de homepage
    navigate('/');
  };
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  // Gebruik website tracking
  useWebsiteTracking();


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
          toast.error(error?.message === 'Invalid login credentials' ? getTranslation('auth.errors.invalidCredentials', 'Invalid email address or password') : error?.message || getTranslation('auth.errors.loginFailed', 'Login failed'));
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
          toast.error(getTranslation('auth.errors.passwordMismatch', 'Passwords do not match'));
          return;
        }
        if (password.length < 8) { // Aangeraden: 8 tekens
          if (isTrackingReady) {
            await trackFormAbandonment('password_too_short');
          }
          toast.error(getTranslation('auth.errors.passwordTooShort', 'Password must be at least 8 characters long'));
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          // Track registration error
          if (isTrackingReady) {
            await trackError(error.message, 'registration_started');
          }
          toast.error(error.message.includes('User already registered') ? getTranslation('auth.errors.userExists', 'An account with this email address already exists') : error.message);
          return;
        }

        // Track successful registration
        if (isTrackingReady) {
          await trackRegistrationCompleted();
        }

        toast.success(getTranslation('auth.success.accountCreated', 'Account created!'), { description: getTranslation('auth.success.checkEmail', 'Check your inbox to confirm your email address') });
        setMode('login');
        clearForm();

      } else if (mode === 'reset') {
        // Dit is de AANVRAAG voor een reset, niet de reset zelf.
        const { error } = await resetPassword(email);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success(getTranslation('auth.success.resetSent', 'Reset instructions sent!'), { description: getTranslation('auth.success.resetDescription', `If an account exists for ${email}, an email has been sent`) });
        setMode('login');
      }
    } catch (err: any) {
      console.error('Onverwachte Auth fout:', err);
      toast.error(err.message || getTranslation('auth.errors.unknownError', 'An unknown error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <Header 
        onLoginClick={handleLoginClick}
        onNavigate={undefined}
        simplifiedNav={false}
        hideAuthButtons={true}
        hideNotifications={true}
      />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Benefits/Features */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-2xl font-bold text-gray-900">stockflow</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {mode === 'register' 
                  ? getTranslation('auth.title.register', 'Start Your Free Account')
                  : getTranslation('auth.title.login', 'Welcome Back')
                }
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {mode === 'register' 
                  ? getTranslation('auth.subtitle.register', 'Join 3200+ SMEs that already benefit from free inventory management')
                  : getTranslation('auth.subtitle.login', 'Log in to access your inventory management dashboard')
                }
              </p>
            </div>

            {mode === 'register' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: getTranslation('auth.benefits.free', '100% free for SMEs') },
                    { icon: <Zap className="h-5 w-5 text-blue-600" />, text: getTranslation('auth.benefits.quickStart', 'Get started in 2 minutes') },
                    { icon: <Shield className="h-5 w-5 text-purple-600" />, text: getTranslation('auth.benefits.secure', 'Safe and GDPR-compliant') },
                    { icon: <Users className="h-5 w-5 text-orange-600" />, text: getTranslation('auth.benefits.support', 'Professional support') }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      {benefit.icon}
                      <span className="text-gray-700 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{getTranslation('auth.testimonial.title', 'What customers say')}</span>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    {getTranslation('auth.testimonial.quote', 'Thanks to StockFlow I finally have a clear overview of my inventory. The automatic reorder notifications are a lifesaver!')}
                  </p>
                  <div className="text-sm text-gray-600">
                    {getTranslation('auth.testimonial.author', '- Laura Peeters, De Koffieboetiek Gent')}
                  </div>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <Package className="h-5 w-5 text-blue-600" />, text: "Beheer je voorraad centraal" },
                    { icon: <Zap className="h-5 w-5 text-green-600" />, text: "Automatische bestelmeldingen" },
                    { icon: <Users className="h-5 w-5 text-purple-600" />, text: "Samenwerken met je team" },
                    { icon: <Shield className="h-5 w-5 text-orange-600" />, text: "Veilig in de cloud" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      {feature.icon}
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4 sm:pb-6 text-center">
                <div className="flex items-center justify-center mb-4 lg:hidden">
                  <Package className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">stockflow</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'register' ? 'Start Gratis' : 'Inloggen'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'register' 
                    ? 'Geen creditcard vereist • Direct toegang'
                    : 'Welkom terug bij je voorraadbeheer'
                  }
                </p>

                {/* Switcher */}
                <div className="flex justify-center mt-6">
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

              <CardContent className="px-6 sm:px-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Voornaam</Label>
                        <Input 
                          id="firstName" 
                          type="text" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Je voornaam"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Achternaam</Label>
                        <Input 
                          id="lastName" 
                          type="text" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Je achternaam"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mailadres</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="jij@bedrijf.be"
                    />
                  </div>

                  {mode !== 'reset' && (
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Wachtwoord</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={mode === 'register' ? "Minimaal 8 tekens" : "Je wachtwoord"}
                      />
                      {mode === 'register' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Minimaal 8 tekens voor veiligheid
                        </p>
                      )}
                    </div>
                  )}

                  {mode === 'register' && (
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Bevestig wachtwoord</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Herhaal je wachtwoord"
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Even geduld...</>
                    ) : (
                      <>
                        {mode === 'login' && (
                          <>
                            Inloggen
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                        {mode === 'register' && (
                          <>
                            Start Gratis Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                        {mode === 'reset' && 'Verzend reset-instructies'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-4 pb-6 px-6 sm:px-8">
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setMode('reset'); clearForm(); }} 
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                    disabled={isSubmitting}
                  >
                    Wachtwoord vergeten?
                  </button>
                )}
                
                {mode === 'register' && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Door te registreren ga je akkoord met onze{' '}
                      <a href="#" className="text-blue-600 hover:underline">Algemene Voorwaarden</a>
                      {' '}en{' '}
                      <a href="#" className="text-blue-600 hover:underline">Privacybeleid</a>
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
