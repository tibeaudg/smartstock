import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

const step1Schema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
});

const step2Schema = z.object({
  branchName: z.string().min(2, 'Branch name must be at least 2 characters'),
});

const step3Schema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  initialStock: z.coerce.number().min(0, 'Stock quantity must be 0 or greater'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  open,
  onComplete,
}) => {
  const { user } = useAuth();
  const { setActiveBranch, refreshBranches } = useBranches();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdBranchId, setCreatedBranchId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      organizationName: '',
    },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      branchName: '',
    },
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      productName: '',
      sku: '',
      initialStock: 0,
    },
  });

  const progressValue = (currentStep / 3) * 100;

  const handleStep1Submit = async (data: Step1Data) => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ organization_name: data.organizationName })
        .eq('id', user.id);

      if (error) throw error;

      setCurrentStep(2);
    } catch (error: any) {
      console.error('Error updating organization name:', error);
      toast.error(`Failed to save organization name: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (data: Step2Data) => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      // Create branch
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: data.branchName,
          is_main: true,
          is_active: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (branchError) throw branchError;

      // Create branch_users entry
      const { error: assignError } = await supabase.from('branch_users').insert({
        branch_id: branchData.id,
        user_id: user.id,
        role: 'admin',
        granted_by: user.id,
      });

      if (assignError) throw assignError;

      // Set as active branch
      setActiveBranch({
        branch_id: branchData.id,
        branch_name: branchData.name,
        is_main: branchData.is_main,
        user_role: 'admin',
      });

      // Track branch creation event
      await trackCustomEvent('branch_created', {
        branch_id: branchData.id,
        branch_name: branchData.name,
        is_main: branchData.is_main,
        is_additional: false,
        source: 'onboarding',
      }, `Branch created: ${branchData.name}`);

      setCreatedBranchId(branchData.id);
      setCurrentStep(3);
      await refreshBranches();
    } catch (error: any) {
      console.error('Error creating branch:', error);
      toast.error(`Failed to create branch: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (data: Step3Data) => {
    if (!user || !createdBranchId) {
      toast.error('User or branch not found');
      return;
    }

    setLoading(true);
    try {
      // Create product
      const productData = {
        name: data.productName.trim(),
        sku: data.sku.trim(),
        quantity_in_stock: data.initialStock,
        minimum_stock_level: 0,
        unit_price: 0,
        purchase_price: 0,
        sale_price: 0,
        branch_id: createdBranchId,
        user_id: user.id,
        is_variant: false,
        parent_product_id: null,
        variant_name: null,
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (productError) throw productError;

      // Create initial stock transaction
      if (data.initialStock > 0) {
        const stockTransactionData = {
          product_id: product.id,
          product_name: data.productName,
          transaction_type: 'incoming' as const,
          quantity: data.initialStock,
          unit_price: 0,
          user_id: user.id,
          created_by: user.id,
          branch_id: createdBranchId,
          reference_number: 'ONBOARDING_INITIAL',
          notes: 'Initial stock from onboarding',
          variant_id: null,
          variant_name: null,
          adjustment_method: 'system' as const,
        };

        const { error: transactionError } = await supabase
          .from('stock_transactions')
          .insert(stockTransactionData);

        if (transactionError) {
          console.error('Error creating stock transaction:', transactionError);
          toast.warning('Product created but stock transaction failed');
        }
      }

      // Update onboarding status
      const { error: onboardingError } = await supabase
        .from('profiles')
        .update({ onboarding: 'done' })
        .eq('id', user.id);

      if (onboardingError) {
        console.error('Error updating onboarding status:', onboardingError);
        toast.warning('Product created but failed to update onboarding status');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productCount'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-product-count'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });

      setIsComplete(true);

      // Auto-close after 2 seconds and redirect to categories
      setTimeout(() => {
        onComplete();
        navigate('/categories');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(`Failed to create product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl mb-2">Welcome to StockFlow!</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your organization, branch, and first product have been set up successfully.
              You're all set to start managing your inventory!
            </DialogDescription>
            <Button 
              onClick={() => {
                onComplete();
                navigate('/categories');
              }} 
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Welcome! Let's get you started</DialogTitle>
          <DialogDescription>
            We'll help you set up your organization, create your first location, and add your first product.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {currentStep === 1 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
              <FormField
                control={step1Form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your organization name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={loading}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentStep === 2 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
              <FormField
                control={step2Form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch / Warehouse Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first branch or warehouse name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentStep === 3 && (
          <Form {...step3Form}>
            <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-4">
              <FormField
                control={step3Form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step3Form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter SKU"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step3Form.control}
                name="initialStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  Complete Setup
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

