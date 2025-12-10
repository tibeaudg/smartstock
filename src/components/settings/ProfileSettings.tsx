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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User, Key, CheckCircle, Check, LogOut, Trash2 } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema for profile data validation
const profileSchema = z.object({
      firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// Schema for password data validation
const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 6 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Error message is shown when the 'confirmPassword' field is not filled in
});
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfileSettings = () => {
  const { userProfile, user, signOut } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check if the user has a password set.
  const hasPassword = useMemo(() => 
    user?.identities?.some(id => id.provider === 'password'),
    [user]
  );

  // React Hook Form for profile data
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
  
  // Separate React Hook Form instance for the password
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
        toast.success('Profile successfully updated.');
        setIsProfileSuccess(true);
        setTimeout(() => setIsProfileSuccess(false), 1500);
    } catch (error: any) {
          console.error('Profile update error:', error);
        toast.error('Error updating profile', { description: error.message });
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

        // Use a short timeout so the session update can complete and React state can update
        setTimeout(() => {
            toast.success('Password successfully updated!');
            resetPasswordForm();
            setIsPasswordLoading(false);
        }, 200);
        return;
    } catch (error: any) {
        console.error('Password update error:', error);
        toast.error('Error updating password', { description: error?.message || 'Unknown error' });
        setIsPasswordLoading(false);
    }
};
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeletingAccount(true);
    try {
      // Delete account via edge function
      // The edge function handles deletion from branch_users, profiles, and auth.users
      const { data, error: authError } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id }
      });
      
      if (authError) {
        throw new Error(authError.message || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      
      // Sign out and navigate to auth page
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Error deleting account', { 
        description: error?.message || 'Unknown error occurred. Please try again or contact support.' 
      });
      setIsDeletingAccount(false);
    }
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
            <CardTitle className="flex items-center space-x-2"><User className="w-4 h-4" /><span>Personal Information</span></CardTitle>
            <CardDescription>Update your name and contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...registerProfile('firstName')} placeholder="Your first name" />
                  {profileErrors.firstName && <p className="text-sm text-red-600">{profileErrors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...registerProfile('lastName')} placeholder="Your last name" />
                  {profileErrors.lastName && <p className="text-sm text-red-600">{profileErrors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerProfile('email')} placeholder="your@email.com" disabled />
                 <p className="text-xs text-gray-500">Email can currently not be changed.</p>
                {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email.message}</p>}
              </div>
              <Button type="submit" disabled={isProfileLoading || isProfileSuccess}>
                {isProfileLoading ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 animate-pulse" />
                ) : isProfileSuccess ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 animate-pulse" />
                ) : null}
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Beveiliging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Key className="w-4 h-4" /><span>Security</span></CardTitle>
            <CardDescription>{hasPassword ? 'Change your password here.' : 'Set a password to secure your account.'}</CardDescription>
          </CardHeader>
          <CardContent>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...registerPassword('newPassword')} placeholder="••••••••" />
                  {passwordErrors.newPassword && <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} placeholder="••••••••" />
                  {passwordErrors.confirmPassword && <p className="text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
                </div>
                  <Button type="submit" disabled={isPasswordLoading}>
                      {isPasswordLoading && <Check className=" w-4 h-4 mr-2 animate-pulse" />}
                      {hasPassword ? 'Change Password' : 'Change Password'}
                  </Button>
            </form>
          </CardContent>

        </Card>
      </div>

      {/* Delete Account Card */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeletingAccount}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div>
                    <p>Are you sure you want to delete your account? This action cannot be undone and will permanently delete:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile information</li>
                      <li>All your branch associations</li>
                      <li>All your account data</li>
                    </ul>
                    <strong className="block mt-3 text-red-600 dark:text-red-400">
                      This action is irreversible.
                    </strong>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Logout Section - Only visible on mobile */}
      {isMobile && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Log out of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
