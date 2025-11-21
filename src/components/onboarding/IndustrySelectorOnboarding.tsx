import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllIndustries, IndustryType, getIndustryMapping, CategorySuggestion } from '@/lib/onboarding/industryCategories';
import { 
  ShoppingBag, 
  Coffee, 
  Warehouse, 
  Pill, 
  Laptop, 
  Shirt, 
  ShoppingCart, 
  Wrench, 
  Car,
  Building2,
  Plus,
  X
} from 'lucide-react';

interface IndustrySelectorOnboardingProps {
  onIndustrySelect: (industry: IndustryType) => void;
  selectedIndustry?: IndustryType | null;
  onCategoriesChange?: (selectedCategories: CategorySuggestion[], customCategories: string[]) => void;
  onIndustrySpecificationChange?: (specification: string) => void;
}

const industryIcons: Record<IndustryType, React.ReactNode> = {
  retail: <ShoppingBag className="h-6 w-6" />,
  restaurant: <Coffee className="h-6 w-6" />,
  warehouse: <Warehouse className="h-6 w-6" />,
  pharmacy: <Pill className="h-6 w-6" />,
  electronics: <Laptop className="h-6 w-6" />,
  clothing: <Shirt className="h-6 w-6" />,
  grocery: <ShoppingCart className="h-6 w-6" />,
  hardware: <Wrench className="h-6 w-6" />,
  automotive: <Car className="h-6 w-6" />,
  other: <Building2 className="h-6 w-6" />
};

export const IndustrySelectorOnboarding: React.FC<IndustrySelectorOnboardingProps> = ({
  onIndustrySelect,
  selectedIndustry,
  onCategoriesChange,
  onIndustrySpecificationChange
}) => {
  const industries = getAllIndustries();
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [selectedCustomCategories, setSelectedCustomCategories] = useState<Set<string>>(new Set());
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [industrySpecification, setIndustrySpecification] = useState('');

  // When industry changes, start with no categories selected (unchecked by default)
  // Only reset when industry actually changes, not on every render
  const prevIndustryRef = useRef<IndustryType | null | undefined>(selectedIndustry);
  
  useEffect(() => {
    // Only reset if industry actually changed
    if (selectedIndustry !== prevIndustryRef.current) {
      prevIndustryRef.current = selectedIndustry;
      setSelectedCategories(new Set());
      setCustomCategories([]);
      setSelectedCustomCategories(new Set());
      setIndustrySpecification('');
      // Notify parent of initial selection (empty)
      onCategoriesChange?.([], []);
      onIndustrySpecificationChange?.('');
    }
  }, [selectedIndustry]);

  // Update parent when selection changes
  useEffect(() => {
    if (!selectedIndustry || !onCategoriesChange) return;
    
    const mapping = getIndustryMapping(selectedIndustry);
    const selected = mapping.categories.filter((_, index) => selectedCategories.has(index));
    // Only include custom categories that are selected
    const custom = customCategories.filter(cat => cat.trim() !== '' && selectedCustomCategories.has(cat));
    onCategoriesChange(selected, custom);
  }, [selectedCategories, customCategories, selectedCustomCategories, selectedIndustry, onCategoriesChange]);

  // Update parent when industry specification changes
  useEffect(() => {
    onIndustrySpecificationChange?.(industrySpecification);
  }, [industrySpecification, onIndustrySpecificationChange]);

  const handleCategoryToggle = (index: number) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCategories(newSelected);
  };

  const handleAddCustomCategory = () => {
    const trimmed = newCustomCategory.trim();
    if (!trimmed) return;
    
    setCustomCategories(prev => {
      // Check if already exists
      if (prev.includes(trimmed)) {
        return prev;
      }
      const updated = [...prev, trimmed];
      // Automatically select the new custom category
      setSelectedCustomCategories(prevSelected => {
        const newSelected = new Set(prevSelected);
        newSelected.add(trimmed);
        return newSelected;
      });
      return updated;
    });
    setNewCustomCategory('');
  };

  const handleRemoveCustomCategory = (categoryName: string) => {
    setCustomCategories(customCategories.filter(cat => cat !== categoryName));
    // Remove from selected set as well
    const newSelected = new Set(selectedCustomCategories);
    newSelected.delete(categoryName);
    setSelectedCustomCategories(newSelected);
  };

  const handleCustomCategoryToggle = (categoryName: string) => {
    const newSelected = new Set(selectedCustomCategories);
    if (newSelected.has(categoryName)) {
      newSelected.delete(categoryName);
    } else {
      newSelected.add(categoryName);
    }
    setSelectedCustomCategories(newSelected);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">What industry are you in?</h2>
        <p className="text-gray-600">
          We'll customize your setup with relevant categories and sample products
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {industries.map((industry) => {
          const mapping = getIndustryMapping(industry.value);
          const isSelected = selectedIndustry === industry.value;

          return (
            <Button
              key={industry.value}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onIndustrySelect(industry.value)}
              className={`h-auto p-6 flex flex-col items-center gap-3 ${
                isSelected 
                  ? 'bg-blue-600 text-white border-2 border-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={isSelected ? 'text-white' : 'text-gray-600'}>
                {industryIcons[industry.value]}
              </div>
              <span className="text-sm font-medium text-center">{industry.label}</span>
            </Button>
          );
        })}
      </div>

      {selectedIndustry && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">
              {getIndustryMapping(selectedIndustry).displayName} Setup
            </CardTitle>
            <CardDescription>
              {selectedIndustry === 'other' 
                ? 'Please specify your industry and add custom categories:'
                : 'Select which categories you would like to create (you can also add custom ones):'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Industry Specification Field (only for "other") */}
            {selectedIndustry === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify industry
                </label>
                <Input
                  type="text"
                  value={industrySpecification}
                  onChange={(e) => setIndustrySpecification(e.target.value)}
                  placeholder="e.g., Furniture Store, Jewelry Shop, etc."
                  className="w-full"
                />
              </div>
            )}

            {/* Suggested Categories with Checkboxes (hidden for "other") */}
            {selectedIndustry !== 'other' && (
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Suggested Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getIndustryMapping(selectedIndustry).categories.map((category, index) => {
                    const isChecked = selectedCategories.has(index);
                    return (
                      <div 
                        key={index} 
                        className={`bg-white p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleCategoryToggle(index)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleCategoryToggle(index)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {category.sampleProducts.length} sample products
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Categories - Displayed as Cards */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Custom Categories</h3>
              
              {/* Display custom categories as cards */}
              {customCategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {customCategories.map((categoryName) => {
                    const isChecked = selectedCustomCategories.has(categoryName);
                    return (
                      <div 
                        key={categoryName}
                        className={`bg-white p-4 rounded-lg border-2 transition-colors cursor-pointer relative ${
                          isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleCustomCategoryToggle(categoryName)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleCustomCategoryToggle(categoryName)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{categoryName}</h4>
                            <p className="text-xs text-gray-500">Custom category</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomCategory(categoryName);
                          }}
                          className="absolute top-2 right-2 h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new custom category input */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCategory();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddCustomCategory();
                  }}
                  disabled={!newCustomCategory.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

