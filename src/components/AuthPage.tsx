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

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onLoginClick={handleLoginClick}
        onNavigate={undefined}
        simplifiedNav={false}
        hideAuthButtons={true}
        hideNotifications={true}
      />
      <div className="flex-1 flex">
        {/* Left side - Auth Form */}
        <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
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

            <Card className="shadow-none border-0 bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  {/* Remember me and Forgot password */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setMode('reset'); clearForm(); }} 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 transition-all duration-300" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...</>
                    ) : (
                      <>
                        {mode === 'login' && 'Log In'}
                        {mode === 'register' && 'Start Free Account'}
                        {mode === 'reset' && 'Send reset instructions'}
                      </>
                    )}
                  </Button>

                  {/* Or divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        const { error } = await signInWithGoogle();
                        if (error) {
                          toast.error(error.message || 'Google sign-in failed');
                        }
                        // If successful, user will be redirected to Google and then back to dashboard
                      } catch (err: any) {
                        console.error('Google sign-in error:', err);
                        toast.error('An unexpected error occurred during Google sign-in');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign In with Google
                  </Button>

                  {/* Mode switcher */}
                  <div className="text-center">
                    {mode === 'login' ? (
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={async () => { 
                            setMode('register'); 
                            clearForm(); 
                            if (isTrackingReady) {
                              await trackRegistrationStarted();
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                          disabled={isSubmitting}
                        >
                          Sign Up
                        </button>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setMode('login'); clearForm(); }}
                          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                          disabled={isSubmitting}
                        >
                          Sign In
                        </button>
                      </p>
                    )}
                  </div>

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
                </form>
              </CardContent>
            </Card>

            {/* Footer links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Help</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-700">Terms</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-700">Privacy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features/Benefits */}
        <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-50 via-white to-indigo-100 items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {mode === 'register' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: '100% free for SMEs' },
                    { icon: <Zap className="h-5 w-5 text-blue-600" />, text: 'Get started in 2 minutes' },
                    { icon: <Shield className="h-5 w-5 text-purple-600" />, text: 'Safe and GDPR-compliant' },
                    { icon: <Users className="h-5 w-5 text-orange-600" />, text: 'Professional support' }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: <Package className="h-5 w-5 text-blue-600" />, text: "Manage your inventory centrally" },
                    { icon: <Zap className="h-5 w-5 text-green-600" />, text: "Automatic order notifications" },
                    { icon: <Users className="h-5 w-5 text-purple-600" />, text: "Collaborate with your team" },
                    { icon: <Shield className="h-5 w-5 text-orange-600" />, text: "Safe in the cloud" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                      {feature.icon}
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
