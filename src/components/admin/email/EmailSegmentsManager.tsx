import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmailSegments, useSegmentUserCount } from '@/hooks/useEmailSegments';
import { Plus, Edit, Trash2, Calendar, Clock, Activity, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { SegmentTemplateEditor } from '@/components/admin/email/SegmentTemplateEditor';

interface DateFilter {
  operator: 'less_than' | 'greater_than' | 'equal' | 'between' | 'never';
  days?: number;
  daysFrom?: number;
  daysTo?: number;
}

const formatFilterDescription = (filters: any): string => {
  const parts: string[] = [];
  if (filters.accountCreated) {
    const f = filters.accountCreated;
    if (f.operator === 'less_than') parts.push(`Created < ${f.days} days ago`);
    if (f.operator === 'greater_than') parts.push(`Created > ${f.days} days ago`);
    if (f.operator === 'equal') parts.push(`Created ${f.days} days ago`);
    if (f.operator === 'between') parts.push(`Created ${f.daysFrom}-${f.daysTo} days ago`);
  }
  if (filters.lastLogin) {
    const f = filters.lastLogin;
    if (f.operator === 'never') parts.push('Never logged in');
    if (f.operator === 'less_than') parts.push(`Last login < ${f.days} days ago`);
    if (f.operator === 'greater_than') parts.push(`Last login > ${f.days} days ago`);
    if (f.operator === 'equal') parts.push(`Last login ${f.days} days ago`);
    if (f.operator === 'between') parts.push(`Last login ${f.daysFrom}-${f.daysTo} days ago`);
  }
  if (filters.productCountMin !== undefined || filters.productCountMax !== undefined) {
    if (filters.productCountMin !== undefined && filters.productCountMax !== undefined) {
      parts.push(`${filters.productCountMin}-${filters.productCountMax} products`);
    } else if (filters.productCountMin !== undefined) {
      parts.push(`≥ ${filters.productCountMin} products`);
    } else {
      parts.push(`≤ ${filters.productCountMax} products`);
    }
  }
  return parts.join(', ') || 'No filters';
};

interface SegmentCardProps {
  segment: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ segment, onEdit, onDelete }) => {
  const { data: liveCount, isLoading } = useSegmentUserCount(segment.filters);
  const count = typeof liveCount === 'number' ? liveCount : (segment.user_count || 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{segment.name}</CardTitle>
            <CardDescription className="mt-1">
              {isLoading ? 'Updating users…' : `${count} users`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-xs text-muted-foreground">
            {formatFilterDescription(segment.filters)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(segment.id)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Segment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{segment.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(segment.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export function EmailSegmentsManager() {
  const { segments, createSegment, updateSegment, deleteSegment, isCreating, isUpdating, isDeleting } = useEmailSegments();
  const { templates } = useEmailTemplates();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [templateEditorMode, setTemplateEditorMode] = useState<'select' | 'create' | 'edit'>('select');
  const [availablePlans, setAvailablePlans] = useState<string[]>([]);
  const [availableOrganizations, setAvailableOrganizations] = useState<string[]>([]);

  const normalizeFilters = (filters: any) => {
    const f = filters || {};
    return {
      plan: Array.isArray(f.plan) ? f.plan : [],
      organization: Array.isArray(f.organization) ? f.organization : [],
      role: Array.isArray(f.role) ? f.role : [],
      isOwner: f.isOwner,
      accountCreated: f.accountCreated,
      lastLogin: f.lastLogin,
      productCountMin: f.productCountMin,
      productCountMax: f.productCountMax,
    } as any;
  };

  const activeTemplates = templates.filter(t => t.is_active);

  const [formData, setFormData] = useState({
    name: '',
    automation_enabled: false,
    automation_trigger: 'user_signup' as 'user_signup' | 'inactivity',
    automation_template_id: '',
    filters: {
      plan: [] as string[],
      organization: [] as string[],
      role: [] as string[],
      isOwner: undefined as boolean | undefined,
      accountCreated: undefined as DateFilter | undefined,
      lastLogin: undefined as DateFilter | undefined,
      productCountMin: undefined as number | undefined,
      productCountMax: undefined as number | undefined,
    },
  });

  // Fetch available plans and organizations
  useQuery({
    queryKey: ['available-plans'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('selected_plan')
        .not('selected_plan', 'is', null);
      
      const plans = Array.from(new Set((data || []).map((p: any) => p.selected_plan).filter(Boolean)));
      setAvailablePlans(plans as string[]);
      return plans;
    },
  });

  useQuery({
    queryKey: ['available-organizations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('organization_name')
        .not('organization_name', 'is', null);
      
      const orgs = Array.from(new Set((data || []).map((p: any) => p.organization_name).filter(Boolean)));
      setAvailableOrganizations(orgs as string[]);
      return orgs;
    },
  });

  const { data: userCount } = useSegmentUserCount(formData.filters);

  const handleOpenDialog = (segmentId?: string) => {
    setTemplateEditorMode('select');
    if (segmentId) {
      const segment = segments.find(s => s.id === segmentId);
      if (segment) {
        setFormData({
          name: segment.name,
          automation_enabled: (segment as any).automation_enabled === true,
          automation_trigger: ((segment as any).automation_trigger || 'user_signup') as 'user_signup' | 'inactivity',
          automation_template_id: (segment as any).automation_template_id || '',
          filters: normalizeFilters(segment.filters),
        });
        setEditingId(segmentId);
      }
    } else {
      setFormData({
        name: '',
        automation_enabled: false,
        automation_trigger: 'user_signup',
        automation_template_id: '',
        filters: {
          plan: [],
          organization: [],
          role: [],
          isOwner: undefined,
          accountCreated: undefined,
          lastLogin: undefined,
          productCountMin: undefined,
          productCountMax: undefined,
        },
      });
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }

    // Clean up empty filters
    const cleanedFilters: any = {};
    if ((formData.filters.plan || []).length > 0) cleanedFilters.plan = formData.filters.plan;
    if ((formData.filters.organization || []).length > 0) cleanedFilters.organization = formData.filters.organization;
    if ((formData.filters.role || []).length > 0) cleanedFilters.role = formData.filters.role;
    if (formData.filters.isOwner !== undefined) cleanedFilters.isOwner = formData.filters.isOwner;
    if (formData.filters.accountCreated) cleanedFilters.accountCreated = formData.filters.accountCreated;
    if (formData.filters.lastLogin) cleanedFilters.lastLogin = formData.filters.lastLogin;
    if (formData.filters.productCountMin !== undefined) cleanedFilters.productCountMin = formData.filters.productCountMin;
    if (formData.filters.productCountMax !== undefined) cleanedFilters.productCountMax = formData.filters.productCountMax;

    if (editingId) {
      updateSegment({
        id: editingId,
        segment: {
          name: formData.name,
          filters: cleanedFilters,
          automation_enabled: formData.automation_enabled,
          automation_trigger: formData.automation_enabled ? formData.automation_trigger : null,
          automation_template_id: formData.automation_enabled ? (formData.automation_template_id || null) : null,
        },
      });
    } else {
      createSegment({
        name: formData.name,
        filters: cleanedFilters,
        automation_enabled: formData.automation_enabled,
        automation_trigger: formData.automation_enabled ? formData.automation_trigger : null,
        automation_template_id: formData.automation_enabled ? (formData.automation_template_id || null) : null,
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    deleteSegment(id);
  };

  const toggleFilter = (filterType: 'plan' | 'organization' | 'role', value: string) => {
    const current = (formData.filters[filterType] as string[] | undefined) || [];
    if (current.includes(value)) {
      setFormData({
        ...formData,
        filters: {
          ...formData.filters,
          [filterType]: current.filter(v => v !== value),
        },
      });
    } else {
      setFormData({
        ...formData,
        filters: {
          ...formData.filters,
          [filterType]: [...current, value],
        },
      });
    }
  };

  const updateDateFilter = (filterType: 'accountCreated' | 'lastLogin', filter: DateFilter | undefined) => {
    setFormData({
      ...formData,
      filters: {
        ...formData.filters,
        [filterType]: filter,
      },
    });
  };

  const renderDateFilter = (
    label: string,
    icon: React.ReactNode,
    filterType: 'accountCreated' | 'lastLogin',
    currentFilter: DateFilter | undefined
  ) => {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <Select
          value={currentFilter?.operator || 'none'}
          onValueChange={(value) => {
            if (value === 'none') {
              updateDateFilter(filterType, undefined);
            } else if (value === 'never') {
              updateDateFilter(filterType, { operator: 'never' });
            } else {
              updateDateFilter(filterType, { operator: value as any, days: 7 });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="No filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No filter</SelectItem>
            <SelectItem value="less_than">Less than X days ago</SelectItem>
            <SelectItem value="greater_than">More than X days ago</SelectItem>
            <SelectItem value="equal">Exactly X days ago</SelectItem>
            <SelectItem value="between">Between X and Y days ago</SelectItem>
            {filterType === 'lastLogin' && <SelectItem value="never">Never logged in</SelectItem>}
          </SelectContent>
        </Select>

        {currentFilter && currentFilter.operator !== 'none' && currentFilter.operator !== 'never' && (
          <div className="flex gap-2 items-center">
            {currentFilter.operator === 'between' ? (
              <>
                <Input
                  type="number"
                  placeholder="From"
                  value={currentFilter.daysFrom || ''}
                  onChange={(e) => updateDateFilter(filterType, {
                    ...currentFilter,
                    daysFrom: parseInt(e.target.value) || undefined,
                  })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">and</span>
                <Input
                  type="number"
                  placeholder="To"
                  value={currentFilter.daysTo || ''}
                  onChange={(e) => updateDateFilter(filterType, {
                    ...currentFilter,
                    daysTo: parseInt(e.target.value) || undefined,
                  })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days ago</span>
              </>
            ) : (
              <>
                <Input
                  type="number"
                  placeholder="Days"
                  value={currentFilter.days || ''}
                  onChange={(e) => updateDateFilter(filterType, {
                    ...currentFilter,
                    days: parseInt(e.target.value) || undefined,
                  })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days ago</span>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateDateFilter(filterType, undefined)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Email Segments</h2>
          <p className="text-sm text-muted-foreground">
            Create user segments for targeted email campaigns using behavior-based filters
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          New Segment
        </Button>
      </div>

      {/* Segments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
          />
        ))}

        {segments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No segments yet. Create your first segment to get started.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Segment' : 'Create New Segment'}</DialogTitle>
            <DialogDescription>
              Define filters to create a targeted user segment for email campaigns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="segment-name">Segment Name *</Label>
              <Input
                id="segment-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Inactive Users (Last login > 30 days)"
              />
            </div>

            {/* Segment Automation */}
            <div className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-sm text-purple-900">Automation</h3>
                  <p className="text-xs text-purple-700 mt-1">
                    Connect an email template to this segment and send it automatically based on the trigger you choose.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.automation_enabled}
                    onCheckedChange={(checked) => {
                      const isEnabled = checked === true;
                      setFormData({
                        ...formData,
                        automation_enabled: isEnabled,
                        automation_template_id: isEnabled ? formData.automation_template_id : '',
                      });
                      if (!isEnabled) setTemplateEditorMode('select');
                    }}
                  />
                  <span className="text-xs text-purple-900">Enable</span>
                </div>
              </div>

              {formData.automation_enabled && (
                <div className="space-y-3">
                  <div>
                    <Label>Trigger</Label>
                    <Select
                      value={formData.automation_trigger}
                      onValueChange={(v: 'user_signup' | 'inactivity') =>
                        setFormData({ ...formData, automation_trigger: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_signup">On signup (welcome email)</SelectItem>
                        <SelectItem value="inactivity">Periodically (e.g. inactive users)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.automation_trigger === 'user_signup'
                        ? 'Sent once when a new user matches this segment.'
                        : 'Sent daily to users who match the filters (e.g. last login &gt; 30 days).'}
                    </p>
                  </div>

                  {templateEditorMode === 'select' && (
                    <div className="space-y-2">
                      <Label>Email template</Label>
                      <Select
                        value={formData.automation_template_id || '__none__'}
                        onValueChange={(value) => {
                          if (value === '__create_new__') {
                            setTemplateEditorMode('create');
                          } else {
                            setFormData({
                              ...formData,
                              automation_template_id: value === '__none__' ? '' : value,
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select or create template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">No template</SelectItem>
                          <SelectItem value="__create_new__">+ Create new template</SelectItem>
                          {activeTemplates.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name} ({t.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.automation_template_id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTemplateEditorMode('edit')}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit template
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Each user receives this at most once per segment+template.
                      </p>
                    </div>
                  )}

                  {(templateEditorMode === 'create' || templateEditorMode === 'edit') && (
                    <SegmentTemplateEditor
                      initialTemplate={
                        templateEditorMode === 'edit' && formData.automation_template_id
                          ? templates.find((t) => t.id === formData.automation_template_id) || undefined
                          : undefined
                      }
                      onSave={(templateId) => {
                        setFormData({ ...formData, automation_template_id: templateId });
                        setTemplateEditorMode('select');
                      }}
                      onCancel={() => setTemplateEditorMode('select')}
                    />
                  )}
                </div>
              )}
            </div>






            {/* Date-Based Filters */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity & Behavior Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDateFilter(
                  'Account Created',
                  <Calendar className="w-4 h-4" />,
                  'accountCreated',
                  formData.filters.accountCreated
                )}
                
                {renderDateFilter(
                  'Last Login',
                  <Clock className="w-4 h-4" />,
                  'lastLogin',
                  formData.filters.lastLogin
                )}
              </div>
            </div>

            {/* Product Count Filter */}
            <div className="space-y-2">
              <Label>Product Count</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={formData.filters.productCountMin || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    filters: {
                      ...formData.filters,
                      productCountMin: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={formData.filters.productCountMax || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    filters: {
                      ...formData.filters,
                      productCountMax: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">products</span>
                {(formData.filters.productCountMin !== undefined || formData.filters.productCountMax !== undefined) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({
                      ...formData,
                      filters: {
                        ...formData.filters,
                        productCountMin: undefined,
                        productCountMax: undefined,
                      },
                    })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* User Count Preview */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Estimated Users:</span>
                <span className="text-lg font-bold text-blue-700">
                  {userCount !== undefined ? userCount : 'Calculating...'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isCreating || isUpdating || !formData.name.trim()}>
                {editingId ? (isUpdating ? 'Saving...' : 'Save Changes') : (isCreating ? 'Creating...' : 'Create Segment')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
