'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useBranchSettings } from '@/hooks/useBranchSettings';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Building2,
  Globe,
  Mail,
  Trash2,
  Loader2,
  Save,
  BarChart3,
  Download,
  Webhook,
  Puzzle,
  Archive,
  Shield,
} from 'lucide-react';

const FETCH_PAGE_SIZE = 1000;
const DELETE_BATCH_SIZE = 500;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
];

const CURRENCIES = [
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

const COUNTRIES = [
  { value: 'BE', label: 'Belgium' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'AT', label: 'Austria' },
  { value: 'CH', label: 'Switzerland' },
];

export const GeneralSettings = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const {
    branchSettings,
    isLoading: settingsLoading,
    updateBranchSettings,
    isUpdating,
    organisationName,
    language,
    currency,
    country,
    stockAlertEnabled,
    stockAlertEmail,
    stockAlertLowEnabled,
    stockAlertEmptyEnabled,
  } = useBranchSettings();
  const queryClient = useQueryClient();

  const [orgName, setOrgName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertLowEnabled, setAlertLowEnabled] = useState(true);
  const [alertEmptyEnabled, setAlertEmptyEnabled] = useState(true);
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [deleteTotal, setDeleteTotal] = useState(0);
  const [deleteDone, setDeleteDone] = useState(0);

  const branchId = activeBranch?.branch_id ?? null;

  useEffect(() => {
    setOrgName(organisationName ?? '');
    setSelectedCountry(country ?? '');
    setSelectedLanguage(language ?? 'en');
    setSelectedCurrency(currency ?? 'USD');
    setAlertEnabled(stockAlertEnabled ?? false);
    setAlertEmail(stockAlertEmail ?? '');
    setAlertLowEnabled(stockAlertLowEnabled ?? true);
    setAlertEmptyEnabled(stockAlertEmptyEnabled ?? true);
  }, [organisationName, country, language, currency, stockAlertEnabled, stockAlertEmail, stockAlertLowEnabled, stockAlertEmptyEnabled]);

  const hasChanges =
    orgName !== (organisationName ?? '') ||
    selectedCountry !== (country ?? '') ||
    selectedLanguage !== (language ?? 'en') ||
    selectedCurrency !== (currency ?? 'USD') ||
    alertEnabled !== (stockAlertEnabled ?? false) ||
    alertEmail !== (stockAlertEmail ?? '') ||
    alertLowEnabled !== (stockAlertLowEnabled ?? true) ||
    alertEmptyEnabled !== (stockAlertEmptyEnabled ?? true);

  const handleSaveGeneral = () => {
    updateBranchSettings({
      organisation_name: orgName || null,
      country: selectedCountry || null,
      language: selectedLanguage || 'en',
      currency: selectedCurrency || 'USD',
      stock_alert_enabled: alertEnabled,
      stock_alert_email: alertEmail?.trim() || null,
      stock_alert_low_enabled: alertLowEnabled,
      stock_alert_empty_enabled: alertEmptyEnabled,
    });
  };

  const handleSendTestAlert = async () => {
    const email = alertEmail?.trim();
    if (!email) {
      toast.error('Please enter an email address for alerts');
      return;
    }
    setIsSendingTestAlert(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-stock-alert', {
        body: { test: true, toEmail: email },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('Test alert email sent');
    } catch (err) {
      console.error('Test alert error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to send test alert');
    } finally {
      setIsSendingTestAlert(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (!user || !branchId) {
      toast.error('Missing user or branch. Please try again.');
      return;
    }

    setIsDeleting(true);
    setDeleteProgress(0);
    setDeleteStatus('Fetching products…');
    setDeleteTotal(0);
    setDeleteDone(0);
    let successfulDeletions = 0;
    const failedDeletions: Array<{ id: string; error: unknown }> = [];

    try {
      const allProductIds: string[] = [];
      let offset = 0;

      while (true) {
        const { data: page, error: fetchError } = await supabase
          .from('products')
          .select('id')
          .eq('user_id', user.id)
          .eq('branch_id', branchId)
          .range(offset, offset + FETCH_PAGE_SIZE - 1);

        if (fetchError) {
          toast.error('Failed to load products');
          console.error('Fetch error:', fetchError);
          setIsDeleting(false);
          setShowDeleteDialog(false);
          return;
        }

        if (!page?.length) break;

        const ids = (page as Array<{ id: string }>).map((p) => p.id);
        allProductIds.push(...ids);
        offset += ids.length;
        setDeleteStatus(`Found ${allProductIds.length} product(s)…`);

        if (ids.length < FETCH_PAGE_SIZE) break;
      }

      if (allProductIds.length === 0) {
        toast.info('No products to delete');
        setIsDeleting(false);
        setShowDeleteDialog(false);
        return;
      }

      const total = allProductIds.length;
      setDeleteTotal(total);
      setDeleteStatus(`Deleting 0 / ${total}…`);

      for (let i = 0; i < allProductIds.length; i += DELETE_BATCH_SIZE) {
        const batch = allProductIds.slice(i, i + DELETE_BATCH_SIZE);

        const { data: batchDeletedData, error: batchError } = await supabase
          .from('products')
          .delete()
          .in('id', batch)
          .eq('branch_id', branchId)
          .select('id');

        if (!batchError && batchDeletedData && batchDeletedData.length > 0) {
          successfulDeletions += batchDeletedData.length;
          if (batchDeletedData.length < batch.length) {
            const deletedIds = new Set(batchDeletedData.map((p: { id: string }) => p.id));
            const failedIds = batch.filter((id) => !deletedIds.has(id));
            failedIds.forEach((id) => {
              failedDeletions.push({ id, error: { message: 'Not deleted in batch operation' } });
            });
          }
        } else {
          if (batchError) console.error('Batch delete error:', batchError);
          for (const productId of batch) {
            try {
              const { data: deletedData, error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)
                .eq('branch_id', branchId)
                .select('id');

              if (deleteError || !deletedData || deletedData.length === 0) {
                failedDeletions.push({ id: productId, error: deleteError || 'No rows deleted' });
              } else {
                successfulDeletions++;
              }
            } catch (err) {
              failedDeletions.push({ id: productId, error: err });
            }
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        }

        const done = Math.min(i + DELETE_BATCH_SIZE, total);
        setDeleteDone(done);
        setDeleteProgress(Math.round((done / total) * 100));
        setDeleteStatus(`Deleting ${done} / ${total}…`);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setDeleteProgress(100);
      setDeleteStatus('Done.');
      setDeleteDone(total);

      if (successfulDeletions > 0) {
        await queryClient.cancelQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
        if (branchId && user?.id) {
          queryClient.setQueryData(['productCount', branchId, user.id], 0);
        }
        await queryClient.invalidateQueries({ queryKey: ['productCount'] });
        toast.success(`Successfully deleted ${successfulDeletions} product(s)`);
      }

      if (failedDeletions.length > 0) {
        toast.warning(`${failedDeletions.length} product(s) failed to delete. Check console for details.`);
        console.error('Failed deletions:', failedDeletions);
      }

      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast.error('Failed to delete products');
    } finally {
      setIsDeleting(false);
      setDeleteProgress(0);
      setDeleteStatus('');
      setDeleteTotal(0);
      setDeleteDone(0);
    }
  };

  if (settingsLoading && !branchSettings) {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="space-y-6 p-4">
        <p className="text-muted-foreground">Select a branch to manage settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage organization, locale, and notification preferences for {activeBranch.branch_name}.
        </p>
      </div>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization
          </CardTitle>
          <CardDescription>
            Your organization details used across the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organisation name</Label>
            <Input
              id="org-name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your company name"
              className="max-w-md"
            />
          </div>
   
        </CardContent>
      </Card>

      {/* Locale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Locale
          </CardTitle>
          <CardDescription>
            Language and currency for displaying data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="language">Language</Label>
            <Select value={selectedLanguage || 'en'} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 max-w-md">
            <Label htmlFor="currency">Currency</Label>
            <Select value={selectedCurrency || 'USD'} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Stock Alerts
          </CardTitle>
          <CardDescription>
            Receive email notifications when products reach low or empty stock levels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="alert-toggle">Enable stock alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send emails when products go below minimum stock or run out.
              </p>
            </div>
            <Switch
              id="alert-toggle"
              checked={alertEnabled}
              onCheckedChange={setAlertEnabled}
            />
          </div>
          {alertEnabled && (
            <>
              <div className="space-y-3">
                <Label>Alert types</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alert-low"
                      checked={alertLowEnabled}
                      onCheckedChange={(checked) => setAlertLowEnabled(checked === true)}
                    />
                    <label
                      htmlFor="alert-low"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Low stock – when products go below minimum level
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alert-empty"
                      checked={alertEmptyEnabled}
                      onCheckedChange={(checked) => setAlertEmptyEnabled(checked === true)}
                    />
                    <label
                      htmlFor="alert-empty"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Out of stock – when products run out
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="alert-email">Alert email address(es)</Label>
                <Input
                  id="alert-email"
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="alerts@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated for multiple addresses.
                </p>
              </div>
           
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestAlert}
                  disabled={isSendingTestAlert || !alertEmail?.trim()}
                >
                  {isSendingTestAlert ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Send test alert
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save button for Organization, Locale, Alerts */}
      {hasChanges && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSaveGeneral} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Placeholder: Scheduled reports */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
          <CardDescription>
            Configure automated reports to be sent on a schedule. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder: Data export */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Automated Exports
          </CardTitle>
          <CardDescription>
            Schedule regular data exports. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder: API webhooks */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Endpoints
          </CardTitle>
          <CardDescription>
            Configure webhooks for inventory events. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder: Integrations */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Integrations
          </CardTitle>
          <CardDescription>
            Connect to ERP, accounting, and other tools. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder: Backup */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Backup Settings
          </CardTitle>
          <CardDescription>
            Configure backup and restore. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder: Security */}
      <Card className="opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Two-factor authentication and security options. (Coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently remove all products in the current branch. This action cannot be undone. Stock
            transactions and other data linked to products may be affected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Delete all products'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all products?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all products in the current branch. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {isDeleting && (
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{deleteStatus}</span>
                    {deleteTotal > 0 && (
                      <span>
                        {deleteDone} / {deleteTotal}
                      </span>
                    )}
                  </div>
                  <Progress value={deleteProgress} className="h-2" />
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAllProducts();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    'Delete all products'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
