'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Loader2, Eye, EyeOff, CheckCircle2, 
  ShieldCheck, Lock, Mail, User 
} from 'lucide-react';
import Header from './HeaderPublic';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const AuthPage = () => {
  // Mode state
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL parameters for initial mode
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam === 'login' || modeParam === 'register' || modeParam === 'reset') {
      setMode(modeParam);
    }
  }, [location.search]);

  // Reset form when switching modes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setAcceptTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    
    // Map score to label
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = mode === 'register' ? calculatePasswordStrength(password) : null;

  // Validate password requirements
  const validatePassword = (pwd: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (pwd.length < 6) {
      errors.push('At least 6 characters');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('One lowercase letter');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('One number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        // Validate email
        if (!email.trim()) {
          toast.error('Email address is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate password
        if (!password) {
          toast.error('Password is required');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signIn(email.trim(), password);

        if (error) {
          toast.error(
            error.message === 'Invalid login credentials'
              ? 'Invalid email address or password'
              : error.message || 'Login failed'
          );
          setIsSubmitting(false);
          return;
        }

        toast.success('Welcome back!');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
        
      } else if (mode === 'register') {
        // Validate first name
        if (!firstName.trim()) {
          toast.error('First name is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate last name
        if (!lastName.trim()) {
          toast.error('Last name is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate email
        if (!email.trim()) {
          toast.error('Email address is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          toast.error('Please enter a valid email address');
          setIsSubmitting(false);
          return;
        }
        
        // Validate password
        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
          toast.error(`Password must contain: ${errors.join(', ')}`);
          setIsSubmitting(false);
          return;
        }
        
        // Validate password match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        
        // Validate terms acceptance
        if (!acceptTerms) {
          toast.error('You must accept the terms and conditions');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(
          email.trim(), 
          password, 
          firstName.trim(), 
          lastName.trim(), 
          'admin'
        );

        if (error) {
          toast.error(
            error.message.includes('User already registered')
              ? 'An account with this email address already exists'
              : error.message || 'Registration failed'
          );
          setIsSubmitting(false);
          return;
        }

        toast.success('Account created successfully!', {
          description: 'You can now log in with your credentials',
        });
        
        // Switch to login mode
        setMode('login');
        setEmail(email.trim());
        setPassword('');
        
      } else if (mode === 'reset') {
        // Validate email
        if (!email.trim()) {
          toast.error('Email address is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          toast.error('Please enter a valid email address');
          setIsSubmitting(false);
          return;
        }

        const { error } = await resetPassword(email.trim());

        if (error) {
          toast.error(error.message || 'Failed to send reset email');
          setIsSubmitting(false);
          return;
        }

        toast.success('Reset instructions sent!', {
          description: `If an account exists for ${email.trim()}, you will receive an email`,
        });
        
        setMode('login');
      }
    } catch (err: any) {
      console.error('Unexpected auth error:', err);
      toast.error(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    } finally {
      if (mode !== 'register') {
        setIsSubmitting(false);
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || 'Google sign-in failed');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      toast.error('An unexpected error occurred during Google sign-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation
  const handleLoginClick = () => {
    navigate('/');
  };

  // Structured data for SEO
  const structuredData = generateComprehensiveStructuredData(
    'contact',
    {
      title: mode === 'register' 
        ? 'StockFlow: Free Inventory Management - Register Now'
        : 'StockFlow: Free Inventory Management - Login',
      url: 'https://www.stockflowsystems.com/auth',
      description: mode === 'register'
        ? 'Start with free inventory management today. Register for StockFlow and manage your inventory easily and efficiently.'
        : 'Log in to your free StockFlow account and manage your inventory with powerful tools.',
      breadcrumbs: [
        { name: 'Home', url: 'https://www.stockflowsystems.com', position: 1 },
        { 
          name: mode === 'register' ? 'Register' : 'Login', 
          url: 'https://www.stockflowsystems.com/auth', 
          position: 2 
        }
      ]
    }
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title={mode === 'register' 
          ? 'StockFlow: Free Inventory Management - Register Now'
          : mode === 'reset'
          ? 'StockFlow: Reset Password'
          : 'StockFlow: Free Inventory Management - Login'}
        description={mode === 'register'
          ? 'Start with free inventory management today. Register for StockFlow and manage your inventory easily and efficiently. No hidden costs, 100% free for small businesses.'
          : mode === 'reset'
          ? 'Reset your StockFlow password and regain access to your inventory management account.'
          : 'Log in to your free StockFlow account and manage your inventory with powerful tools. Barcode scanning, analytics, and more.'}
        keywords="free inventory management, stockflow login, inventory management, stock software, free stock app, stock management, inventory management, free stock management"
        url="https://www.stockflowsystems.com/auth"
        structuredData={structuredData}
      />
      
      <Header onLoginClick={handleLoginClick} />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Auth Form */}
        <div className="w-full mt-20 lg:mt-0 lg:w-1/2 xl:w-2/5 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mode Switcher Tabs */}
            {mode !== 'reset' && (
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                      mode === 'login'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                      isSubmitting && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                      mode === 'register'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                      isSubmitting && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {mode === 'register' 
                  ? 'Start Your Free Account'
                  : mode === 'reset'
                  ? 'Reset Your Password'
                  : 'Welcome Back'
                }
              </h1>
              <p className="text-sm text-gray-600">
                {mode === 'register'
                  ? 'Create your account and start managing inventory'
                  : mode === 'reset'
                  ? 'Enter your email to receive reset instructions'
                  : 'Log in to access your inventory dashboard'
                }
              </p>
            </div>

            <Card className="shadow-none border-0 bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* First Name and Last Name for Registration */}
                  {mode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input 
                            id="firstName" 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            required 
                            disabled={isSubmitting}
                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="John"
                            autoComplete="given-name"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input 
                            id="lastName" 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                            disabled={isSubmitting}
                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Doe"
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  {mode !== 'reset' && (
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          className="h-11 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder={mode === 'register' ? "At least 6 characters" : "Your password"}
                          autoComplete={mode === 'register' ? "new-password" : "current-password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator for Registration */}
                      {mode === 'register' && password && passwordStrength && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Password strength:</span>
                            <span className={cn(
                              "text-xs font-medium",
                              passwordStrength.score <= 2 ? "text-red-600" :
                              passwordStrength.score <= 4 ? "text-orange-600" :
                              passwordStrength.score <= 5 ? "text-yellow-600" :
                              "text-green-600"
                            )}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors",
                                  i < passwordStrength.score
                                    ? passwordStrength.color
                                    : "bg-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {mode === 'register' && (
                        <p className="text-xs text-gray-500 mt-2">
                          Must contain: uppercase, lowercase, and number (min. 6 characters)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password for Registration */}
                  {mode === 'register' && (
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="h-11 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-600" />
                          Passwords do not match
                        </p>
                      )}
                      {password && confirmPassword && password === confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Passwords match
                        </p>
                      )}
                    </div>
                  )}

                  {/* Remember Me and Forgot Password for Login */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setMode('reset')} 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Terms and Conditions for Registration */}
                  {mode === 'register' && (
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-0.5">
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
                          <a 
                            href="/terms" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            Terms and Conditions
                          </a>
                          {' '}and{' '}
                          <a 
                            href="/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Back to Login for Reset */}
                  {mode === 'reset' && (
                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setMode('login')} 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors" 
                        disabled={isSubmitting}
                      >
                        ← Back to login
                      </button>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold bg-black hover:bg-gray-800 transition-all duration-300" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                        Please wait...
                      </>
                    ) : (
                      <>
                        {mode === 'login' && 'Login to Your Account'}
                        {mode === 'register' && 'Create Free Account'}
                        {mode === 'reset' && 'Send Reset Instructions'}
                      </>
                    )}
                  </Button>

                  {/* Or Divider - Only for Login and Register */}
                  {mode !== 'reset' && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      {/* Google Login */}
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full h-11 text-base font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                        onClick={handleGoogleSignIn}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {mode === 'login' ? 'Login' : 'Sign up'} with Google
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure and encrypted connection</span>
              </div>
              <div className="flex justify-center space-x-4 text-xs sm:text-sm text-gray-500">
                <a href="/help" className="hover:text-gray-700 transition-colors">Help</a>
                <span>•</span>
                <a href="/terms" className="hover:text-gray-700 transition-colors">Terms</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-50 via-white to-indigo-100 items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/image.png" 
              alt="StockFlow Dashboard Preview - Modern inventory management interface" 
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};