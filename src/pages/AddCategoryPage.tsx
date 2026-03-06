import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFormLayout } from '@/components/PageFormLayout';
import { useCreateCategory } from '@/hooks/useCategories';
import type { CategoryCreateData } from '@/types/categoryTypes';
import { toast } from 'sonner';

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: name.trim(),
        description: description.trim() || null,
        parent_category_id: null,
        is_active: true,
      };
      await createCategory.mutateAsync(categoryData);
      toast.success('Category created successfully');
      navigate('/dashboard/categories-management');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to create category');
    }
  };

  return (
    <div className="h-full max-h-[calc(100vh-5rem)] flex flex-col min-h-0   p-6">
    <PageFormLayout
      title="Add New Category"
      backTo="/dashboard/categories-management"
      backLabel="Back"
      primaryAction={
        <Button
          onClick={handleSubmit}
          disabled={createCategory.isPending || !name.trim()}
          className="shrink-0"
        >
          {createCategory.isPending ? 'Adding...' : 'Add Category'}
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-900 tracking-tight">
              Category Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electronics, Clothing, Food"
              className="mt-1 border-gray-300 focus:border-gray-500"
              disabled={createCategory.isPending}
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-900 tracking-tight">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the category"
              rows={3}
              className="mt-1 border-gray-300 focus:border-gray-500"
              disabled={createCategory.isPending}
            />
          </div>
        </div>
      </form>
    </PageFormLayout>
    </div>
  );
}
