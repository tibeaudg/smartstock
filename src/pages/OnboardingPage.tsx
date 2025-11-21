import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OnboardingChecklist, ChecklistItem } from '@/components/onboarding/OnboardingChecklist';
import { IndustrySelectorOnboarding } from '@/components/onboarding/IndustrySelectorOnboarding';
import { ImportStep } from '@/components/onboarding/ImportStep';
import { FirstBranchSetup } from '@/components/FirstBranchSetup';
import { autoGenerateCategories } from '@/lib/onboarding/autoGenerateCategories';
import { IndustryType, CategorySuggestion } from '@/lib/onboarding/industryCategories';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { SEO } from '@/components/SEO';

type OnboardingStep = 'industry' | 'setup' | 'branch' | 'complete';

export default function OnboardingPage() {
  const { user, userProfile } = useAuth();
  const { branches, refreshBranches, activeBranch } = useBranches();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('industry');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [industrySelected, setIndustrySelected] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategorySuggestion[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoriesGenerated, setCategoriesGenerated] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 'industry', label: 'Select your industry', completed: false },
    { id: 'setup', label: 'Set up categories and products', completed: false },
    { id: 'branch', label: 'Create your first warehouse', completed: false }
  ]);

  // Check if user has completed onboarding
  useEffect(() => {
    if (userProfile?.onboarding === 'done') {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  // Update onboarding status
  const updateOnboardingStatus = async (status: 'in_progress' | 'done') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding: status })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating onboarding status:', error);
      toast.error('Failed to update progress');
    }
  };

  // Mark onboarding as in progress when starting
  useEffect(() => {
    if (user && userProfile?.onboarding !== 'in_progress' && userProfile?.onboarding !== 'done') {
      updateOnboardingStatus('in_progress');
    }
  }, [user, userProfile]);

  const handleIndustrySelect = async (industry: IndustryType) => {
    setSelectedIndustry(industry);
    setIndustrySelected(true);
    updateChecklist('industry', true);
    
    // Save industry immediately when selected
    if (user) {
      try {
        await supabase
          .from('company_types')
          .upsert({
            user_id: user.id,
            type: industry,
            custom_type: null // Will be updated later if "other" is selected
          } as any, {
            onConflict: 'user_id'
          });
      } catch (error: any) {
        console.error('Error saving industry:', error);
        // Don't show error to user, just log it
      }
    }
  };

  const [industrySpecification, setIndustrySpecification] = useState('');

  const handleCategoriesChange = (selected: CategorySuggestion[], custom: string[]) => {
    setSelectedCategories(selected);
    setCustomCategories(custom);
  };

  const handleIndustrySpecificationChange = async (specification: string) => {
    setIndustrySpecification(specification);
    
    // Update company_types if "other" industry is selected
    if (user && selectedIndustry === 'other') {
      try {
        await supabase
          .from('company_types')
          .upsert({
            user_id: user.id,
            type: 'other',
            custom_type: specification || null
          } as any, {
            onConflict: 'user_id'
          });
      } catch (error: any) {
        console.error('Error saving custom industry:', error);
      }
    }
  };

  const handleGenerateCategories = async () => {
    if (!user || !selectedIndustry || !activeBranch) {
      toast.error('Please select an industry and ensure you have a branch');
      return;
    }

    if (selectedCategories.length === 0 && customCategories.filter(c => c.trim()).length === 0) {
      toast.error('Please select at least one category or add a custom category');
      return;
    }

    setLoading(true);
    try {
      // Save industry to company_types
      const { error: industryError } = await supabase
        .from('company_types')
        .upsert({
          user_id: user.id,
          type: selectedIndustry,
          custom_type: selectedIndustry === 'other' ? industrySpecification : null
        } as any, {
          onConflict: 'user_id'
        });

      if (industryError) throw industryError;

      // Create selected categories and custom categories
      const categoryMap = new Map<string, string>(); // category name -> category id
      let categoriesCreated = 0;
      let productsCreated = 0;
      const errors: string[] = [];

      // Create selected categories with their sample products
      for (const categorySuggestion of selectedCategories) {
        try {
          // Check if category already exists
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categorySuggestion.name)
            .eq('user_id', user.id)
            .single();

          let categoryId: string;

          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            // Create new category
            const { data: newCategory, error: categoryError } = await supabase
              .from('categories')
              .insert({
                name: categorySuggestion.name,
                description: categorySuggestion.description || null,
                user_id: user.id
              })
              .select('id')
              .single();

            if (categoryError) {
              errors.push(`Failed to create category ${categorySuggestion.name}: ${categoryError.message}`);
              continue;
            }

            if (!newCategory) {
              errors.push(`Failed to create category ${categorySuggestion.name}: No data returned`);
              continue;
            }

            categoryId = newCategory.id;
            categoryMap.set(categorySuggestion.name, categoryId);
            categoriesCreated++;
          }

          // Create sample products for this category
          for (const productName of categorySuggestion.sampleProducts) {
            try {
              // Check if product already exists
              const { data: existingProduct } = await supabase
                .from('products')
                .select('id')
                .eq('name', productName)
                .eq('user_id', user.id)
                .eq('branch_id', activeBranch.branch_id)
                .single();

              if (existingProduct) {
                continue; // Skip if product already exists
              }

              // Generate random stock and prices
              const quantityInStock = Math.floor(Math.random() * 50) + 10; // 10-60 units
              const purchasePrice = Math.round((Math.random() * 50 + 5) * 100) / 100; // €5-55
              const salePrice = Math.round(purchasePrice * (1.3 + Math.random() * 0.4) * 100) / 100; // 30-70% markup

              // Create product
              const { error: productError } = await supabase
                .from('products')
                .insert({
                  name: productName,
                  description: `Sample ${productName} for ${categorySuggestion.name}`,
                  category_id: categoryId,
                  branch_id: activeBranch.branch_id,
                  user_id: user.id,
                  quantity_in_stock: quantityInStock,
                  minimum_stock_level: Math.floor(quantityInStock * 0.2), // 20% of stock
                  purchase_price: purchasePrice,
                  sale_price: salePrice,
                  unit_price: salePrice,
                  status: 'active'
                });

              if (productError) {
                errors.push(`Failed to create product ${productName}: ${productError.message}`);
                continue;
              }

              productsCreated++;

              // Create initial stock transaction
              await supabase.from('stock_transactions').insert({
                product_id: null,
                product_name: productName,
                transaction_type: 'incoming',
                quantity: quantityInStock,
                unit_price: purchasePrice,
                total_value: purchasePrice * quantityInStock,
                reference_number: 'AUTO_GENERATED',
                notes: 'Initial stock from auto-generated categories',
                user_id: user.id,
                created_by: user.id,
                branch_id: activeBranch.branch_id
              });
            } catch (error: any) {
              errors.push(`Error creating product ${productName}: ${error.message}`);
            }
          }
        } catch (error: any) {
          errors.push(`Error processing category ${categorySuggestion.name}: ${error.message}`);
        }
      }

      // Create custom categories (without sample products)
      for (const customCategoryName of customCategories) {
        const trimmed = customCategoryName.trim();
        if (!trimmed) continue;

        try {
          // Check if category already exists
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('name', trimmed)
            .eq('user_id', user.id)
            .single();

          if (existingCategory) {
            continue; // Skip if already exists
          }

          // Create new category
          const { data: newCustomCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({
              name: trimmed,
              description: null,
              user_id: user.id
            })
            .select('id')
            .single();

          if (categoryError) {
            errors.push(`Failed to create custom category ${trimmed}: ${categoryError.message}`);
            continue;
          }

          if (!newCustomCategory) {
            errors.push(`Failed to create custom category ${trimmed}: No data returned`);
            continue;
          }

          categoriesCreated++;
        } catch (error: any) {
          errors.push(`Error creating custom category ${trimmed}: ${error.message}`);
        }
      }
      
      if (categoriesCreated > 0 || productsCreated > 0) {
        setCategoriesGenerated(true);
        updateChecklist('setup', true);
        toast.success(
          `Created ${categoriesCreated} categories and ${productsCreated} sample products!`
        );
      } else if (errors.length > 0) {
        toast.error('Some errors occurred during generation. Check console for details.');
        console.error('Generation errors:', errors);
      }
    } catch (error: any) {
      console.error('Error generating categories:', error);
      toast.error(error.message || 'Failed to generate categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = () => {
    setImportCompleted(true);
    updateChecklist('setup', true);
  };

  const handleImportSkip = () => {
    // Mark setup as complete when user skips import
    // They can still generate categories or proceed without either
    setImportCompleted(true);
    updateChecklist('setup', true);
    // Don't auto-advance - let user click Continue to proceed to branch step
  };

  const handleBranchCreated = () => {
    updateChecklist('branch', true);
    // Refresh branches to get the new one - the component will re-render and show success message
    refreshBranches();
  };

  const updateChecklist = (itemId: string, completed: boolean) => {
    setChecklistItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, completed } : item)
    );
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateOnboardingStatus('done');
      toast.success('Onboarding completed! Welcome to StockFlow!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = (step: OnboardingStep): number => {
    const steps: OnboardingStep[] = ['industry', 'setup', 'branch', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const canProceedFromIndustry = industrySelected;
  const canProceedFromSetup = categoriesGenerated || importCompleted;
  const canProceedFromBranch = branches && branches.length > 0;

  return (
    <>
      <SEO
        title="Onboarding | StockFlow"
        description="Complete your setup to get started with StockFlow"
        keywords="onboarding, setup, inventory management"
        url="https://www.stockflow.be/onboarding"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {getStepNumber(currentStep)} of 4
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((getStepNumber(currentStep) / 4) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getStepNumber(currentStep) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <OnboardingChecklist
            items={checklistItems}
            currentStep={getStepNumber(currentStep) - 1}
            totalSteps={3}
          />

          {/* Step Content */}
          <Card className="mb-6">
            <CardContent className="p-8">
              {currentStep === 'industry' && (
                <div>
                  <IndustrySelectorOnboarding
                    onIndustrySelect={handleIndustrySelect}
                    selectedIndustry={selectedIndustry}
                    onCategoriesChange={handleCategoriesChange}
                    onIndustrySpecificationChange={handleIndustrySpecificationChange}
                  />
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setCurrentStep('setup')}
                      disabled={!canProceedFromIndustry}
                      size="lg"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'setup' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Set Up Your Inventory</h2>
                    <p className="text-gray-600 mb-6">
                      Choose how you'd like to get started. You can import your existing inventory
                      or let us create sample categories and products based on your industry.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-6 mb-6">
                    {/* Generate Categories option */}
                    {selectedIndustry && (
                      <Card className="border-2 hover:border-blue-500 transition-colors flex flex-col items-center justify-center w-full">
                        <CardContent className="p-6 flex flex-col items-center justify-center w-full">
                          <h3 className="text-lg font-semibold mb-2">Generate Sample Categories</h3>
                          <p className="text-sm text-gray-600 mb-4 text-center">
                            Create sample categories and products based on your selected industry. 
                            {selectedCategories.length > 0 || customCategories.filter(c => c.trim()).length > 0
                              ? ` You've selected ${selectedCategories.length} categories and ${customCategories.filter(c => c.trim()).length} custom categories.`
                              : ' Please go back and select categories first.'}
                          </p>
                          <Button
                            onClick={handleGenerateCategories}
                            disabled={loading || !activeBranch || (selectedCategories.length === 0 && customCategories.filter(c => c.trim()).length === 0)}
                            className="w-full"
                            size="lg"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              'Generate Categories & Products'
                            )}
                          </Button>
                          {categoriesGenerated && (
                            <p className="text-sm text-green-600 mt-2">✓ Categories and products created successfully!</p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Import option */}
                    <Card className="border-2 hover:border-blue-500 transition-colors flex flex-col items-center justify-center w-full">
                      <CardContent className="p-6 flex flex-col items-center justify-center w-full">
                        <h3 className="text-lg font-semibold mb-2">Import Your Inventory</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a CSV file with your existing products. We'll import everything for you.
                        </p>
                        <ImportStep
                          onImportComplete={handleImportComplete}
                          onSkip={handleImportSkip}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('industry')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        // Check if branch exists, if not go to branch step
                        if (!canProceedFromBranch) {
                          setCurrentStep('branch');
                        } else {
                          setCurrentStep('complete');
                        }
                      }}
                      disabled={!canProceedFromSetup}
                      size="lg"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'branch' && (
                <div>
                  {branches && branches.length > 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Warehouse Created!</h3>
                      <p className="text-gray-600 mb-6">
                        You have {branches.length} warehouse{branches.length > 1 ? 's' : ''} set up.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep('setup')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button onClick={() => setCurrentStep('complete')} size="lg">
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <FirstBranchSetup 
                        inline={true}
                        onBranchCreated={handleBranchCreated}
                      />
                      <div className="flex justify-start mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep('setup')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'complete' && (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your onboarding is complete. You're ready to start managing your inventory with StockFlow!
                  </p>
                  <Button
                    onClick={handleComplete}
                    disabled={loading}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

