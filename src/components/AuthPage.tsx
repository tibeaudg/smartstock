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
import Header from './HeaderPublic';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);

        if (error) {
          toast.error(
            error?.message === 'Invalid login credentials'
              ? 'Invalid email address or password'
              : error?.message || 'Login failed'
          );
          setIsSubmitting(false);
          return;
        }

        // After successful login, wait a moment for auth state to update, then redirect
        // This is a fallback in case AuthRoute doesn't catch it immediately
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else if (mode === 'register') {
        if (!firstName.trim()) {
          toast.error('First name is required');
          return;
        }
        if (!lastName.trim()) {
          toast.error('Last name is required');
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
          toast.error('Password must contain uppercase AND lowercase characters');
          return;
        }
        if (!acceptTerms) {
          toast.error('You must accept the terms and conditions');
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          toast.error(
            error.message.includes('User already registered')
              ? 'An account with this email address already exists'
              : error.message
          );
          return;
        }

        toast.success('Account created!', {
          description: 'Check your inbox to confirm your email address',
        });
        setMode('login');
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Reset instructions sent!', {
          description: `If an account exists for ${email}, an email has been sent`,
        });
        setMode('login');
      }
    } catch (err: any) {
      console.error('Unexpected auth error:', err);
      toast.error(err.message || 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured data for the auth page to help with sitelinks
  const structuredData = generateComprehensiveStructuredData(
    'contact',
    {
      title: mode === 'register' 
        ? 'StockFlow: Gratis Voorraadbeheer - Registreer Nu'
        : 'StockFlow: Gratis Voorraadbeheer - Login',
      url: 'https://www.stockflowsystems.com/auth',
      description: mode === 'register'
        ? 'Start vandaag met gratis voorraadbeheer. Registreer voor StockFlow en beheer uw voorraad eenvoudig en efficiënt.'
        : 'Log in op uw gratis StockFlow account en beheer uw voorraad met krachtige tools.',
      breadcrumbs: [
        { name: 'Home', url: 'https://www.stockflowsystems.com', position: 1 },
        { name: mode === 'register' ? 'Registreer' : 'Login', url: 'https://www.stockflowsystems.com/auth', position: 2 }
      ]
    }
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title={mode === 'register' 
          ? 'StockFlow: Gratis Voorraadbeheer - Registreer Nu'
          : 'StockFlow: Gratis Voorraadbeheer - Login'}
        description={mode === 'register'
          ? 'Start vandaag met gratis voorraadbeheer. Registreer voor StockFlow en beheer uw voorraad eenvoudig en efficiënt. Geen verborgen kosten, 100% gratis voor kleine bedrijven.'
          : 'Log in op uw gratis StockFlow account en beheer uw voorraad met krachtige tools. Barcode scanning, analytics, en meer.'}
        keywords="gratis voorraadbeheer, stockflow login, inventaris beheer, voorraad software, gratis voorraad app, stockbeheer, inventory management, free stock management"
        url="https://www.stockflowsystems.com/auth"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={handleLoginClick}
      />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Auth Form */}
        <div className="w-full mt-20 lg:w-1/2 xl:w-2/5 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">

            {/* Mode Switcher Tabs */}
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { setMode('login');  }}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'login'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setMode('register'); 
                  }}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === 'register'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {mode === 'register' 
                ? 'Start Your Free Account'
                : 'Welcome Back'
              }
            </h1>


            <Card className="shadow-none border-0 bg-transparent">
              <CardContent className="p-0">


                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Simplified: only email and password for registration */}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="mt-1 h-10 sm:h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="you@company.com"
                    />
                  </div>

                  {/* First Name and Last Name fields for registration */}
                  {mode === 'register' && (
                    <>
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
                            className="mt-1 h-10 sm:h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="John"
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
                            className="mt-1 h-10 sm:h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </>
                  )}

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
                        className="mt-1 h-10 sm:h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={mode === 'register' ? "At least 6 characters" : "Your password"}
                      />
                      {mode === 'register' && (
                        <p className="text-xs text-gray-500 mt-1">
                          At least 6 characters for security
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password confirmation for registration */}
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
                        className="mt-1 h-10 sm:h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Confirm your password"
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
                        onClick={() => { setMode('reset'); }} 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Terms and conditions for registration */}
                  {mode === 'register' && (
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="accept-terms"
                          name="accept-terms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          required
                          disabled={isSubmitting}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="accept-terms" className="text-gray-700">
                          I agree to the{' '}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                            Terms and Conditions
                          </a>
                          {' '}and{' '}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-10 text-base font-semibold bg-black hover:bg-gray-800 transition-all duration-300" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait...</>
                    ) : (
                      <>
                        {mode === 'login' && 'Login to Your Account'}
                        {mode === 'register' && 'Create Free Account'}
                        {mode === 'reset' && 'Send Reset Instructions'}
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

                  {/* Google Login */}
                  <Button 
                    type="button"
                    variant="outline"
                          className="w-full h-10 sm:h-10 text-base font-medium border-gray-300 hover:bg-gray-50"
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
                    Login with Google
                  </Button>

                </form>
              </CardContent>
            </Card>

            {/* Footer links */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="flex justify-center space-x-4 text-xs sm:text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Help</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-700">Terms</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-700">Privacy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-50 via-white to-indigo-100 items-center justify-center p-2">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/image.png" 
              alt="StockFlow Dashboard Preview" 
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
