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
  
  // Use the page refresh hook
  usePageRefresh();
  
  // Use website tracking
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
          toast.error(error?.message === 'Invalid login credentials' ? 'Invalid email address or password' : error?.message || 'Login failed');
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
          toast.error('Passwords do not match');
          return;
        }
        if (password.length < 8) { // Aangeraden: 8 tekens
          if (isTrackingReady) {
            await trackFormAbandonment('password_too_short');
          }
          toast.error('Password must be at least 8 characters long');
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          // Track registration error
          if (isTrackingReady) {
            await trackError(error.message, 'registration_started');
          }
          toast.error(error.message.includes('User already registered') ? 'An account with this email address already exists' : error.message);
          return;
        }

        // Track successful registration
        if (isTrackingReady) {
          await trackRegistrationCompleted();
        }

        toast.success('Account created!', { description: 'Check your inbox to confirm your email address' });
        setMode('login');
        clearForm();

      } else if (mode === 'reset') {
        // Dit is de AANVRAAG voor een reset, niet de reset zelf.
        const { error } = await resetPassword(email);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Reset instructions sent!', { description: `If an account exists for ${email}, an email has been sent` });
        setMode('login');
      }
    } catch (err: any) {
      console.error('Onverwachte Auth fout:', err);
      toast.error(err.message || 'An unknown error occurred');
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
                  ? 'Start Your Free Account'
                  : 'Welcome Back'
                }
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {mode === 'register' 
                  ? 'Join 3200+ SMEs that already benefit from free inventory management'
                  : 'Log in to access your inventory management dashboard'
                }
              </p>
            </div>

            {mode === 'register' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: '100% free for SMEs' },
                    { icon: <Zap className="h-5 w-5 text-blue-600" />, text: 'Get started in 2 minutes' },
                    { icon: <Shield className="h-5 w-5 text-purple-600" />, text: 'Safe and GDPR-compliant' },
                    { icon: <Users className="h-5 w-5 text-orange-600" />, text: 'Professional support' }
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
                    <span className="font-semibold text-gray-900">What customers say</span>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    Thanks to StockFlow I finally have a clear overview of my inventory. The automatic reorder notifications are a lifesaver!
                  </p>
                  <div className="text-sm text-gray-600">
                    - Laura Peeters, De Koffieboetiek Gent
                  </div>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <Package className="h-5 w-5 text-blue-600" />, text: "Manage your inventory centrally" },
                    { icon: <Zap className="h-5 w-5 text-green-600" />, text: "Automatic order notifications" },
                    { icon: <Users className="h-5 w-5 text-purple-600" />, text: "Collaborate with your team" },
                    { icon: <Shield className="h-5 w-5 text-orange-600" />, text: "Safe in the cloud" }
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
                  {mode === 'register' ? 'Start Free' : 'Sign In'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'register' 
                    ? 'No credit card required • Direct access'
                    : 'Welcome back to your inventory management'
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
                      Sign In
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
                      Register
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 sm:px-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                        <Input 
                          id="firstName" 
                          type="text" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                        <Input 
                          id="lastName" 
                          type="text" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="you@company.com"
                    />
                  </div>

                  {mode !== 'reset' && (
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={mode === 'register' ? "At least 8 characters" : "Your password"}
                      />
                      {mode === 'register' && (
                        <p className="text-xs text-gray-500 mt-1">
                          At least 8 characters for security
                        </p>
                      )}
                    </div>
                  )}

                  {mode === 'register' && (
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Repeat your password"
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...</>
                    ) : (
                      <>
                        {mode === 'login' && (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                        {mode === 'register' && (
                          <>
                            Start Free Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                        {mode === 'reset' && 'Send reset instructions'}
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
                    Forgot Password?
                  </button>
                )}
                
                {mode === 'register' && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By registering you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
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
