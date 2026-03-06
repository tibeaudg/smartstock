import { useCallback, useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranchSettings } from './useBranchSettings';
import { useProductCount } from './useDashboardData';

const CHECKLIST_SKIPPED_KEY = 'stockflow_checklist_skipped';
const CHECKLIST_MARKED_DONE_KEY = 'stockflow_checklist_marked_done';

interface ChecklistSkipped {
  customersSkipped: boolean;
  suppliersSkipped: boolean;
}

function getSkippedState(): ChecklistSkipped {
  try {
    const stored = localStorage.getItem(CHECKLIST_SKIPPED_KEY);
    if (!stored) return { customersSkipped: false, suppliersSkipped: false };
    const parsed = JSON.parse(stored) as Partial<ChecklistSkipped>;
    return {
      customersSkipped: parsed.customersSkipped ?? false,
      suppliersSkipped: parsed.suppliersSkipped ?? false,
    };
  } catch {
    return { customersSkipped: false, suppliersSkipped: false };
  }
}

function getMarkedDoneState(): Set<ChecklistTaskId> {
  try {
    const stored = localStorage.getItem(CHECKLIST_MARKED_DONE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored) as ChecklistTaskId[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export type ChecklistTaskId = 'account' | 'products' | 'customers' | 'suppliers';

export interface ChecklistTask {
  id: ChecklistTaskId;
  step: number;
  title: string;
  description: string;
  completed: boolean;
  optional: boolean;
  actionPath: string;
  actionLabel: string;
  actionPathSecondary?: string;
  actionLabelSecondary?: string;
}

export function useAccountChecklist() {
  const { user } = useAuth();
  const {
    organisationName,
    language,
    currency,
    country,
    isLoading: settingsLoading,
  } = useBranchSettings();
  const { productCount, isLoading: productCountLoading } = useProductCount();

  const [skippedState, setSkippedState] = useState<ChecklistSkipped>(getSkippedState);
  const [markedDone, setMarkedDone] = useState<Set<ChecklistTaskId>>(getMarkedDoneState);
  const queryClient = useQueryClient();

  const { data: forceShowChecklist = false } = useQuery({
    queryKey: ['profile-force-show-checklist', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('profiles')
        .select('force_show_checklist')
        .eq('id', user.id)
        .maybeSingle();
      if (error) return false;
      return !!(data as { force_show_checklist?: boolean } | null)?.force_show_checklist;
    },
    enabled: !!user,
  });

  // When admin retriggered, clear local checklist state once so user sees a fresh onboarding
  const hasClearedForForceShow = useRef(false);
  useEffect(() => {
    if (forceShowChecklist && !hasClearedForForceShow.current) {
      hasClearedForForceShow.current = true;
      try {
        localStorage.removeItem(CHECKLIST_SKIPPED_KEY);
        localStorage.removeItem(CHECKLIST_MARKED_DONE_KEY);
      } catch {
        // Ignore
      }
      setSkippedState({ customersSkipped: false, suppliersSkipped: false });
      setMarkedDone(new Set());
    } else if (!forceShowChecklist) {
      hasClearedForForceShow.current = false;
    }
  }, [forceShowChecklist]);

  const { data: customerCount = 0 } = useQuery({
    queryKey: ['checklist-customer-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true });
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: supplierCount = 0 } = useQuery({
    queryKey: ['checklist-supplier-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('suppliers')
        .select('id', { count: 'exact', head: true });
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const skipTask = useCallback((taskId: 'customers' | 'suppliers') => {
    const updates: Partial<ChecklistSkipped> =
      taskId === 'customers'
        ? { customersSkipped: true }
        : { suppliersSkipped: true };
    const next = { ...skippedState, ...updates };
    setSkippedState(next);
    try {
      localStorage.setItem(CHECKLIST_SKIPPED_KEY, JSON.stringify(next));
    } catch {
      // Ignore localStorage errors
    }
  }, [skippedState]);

  const markTaskDone = useCallback((taskId: ChecklistTaskId) => {
    setMarkedDone((prev) => {
      const next = new Set(prev);
      next.add(taskId);
      try {
        localStorage.setItem(
          CHECKLIST_MARKED_DONE_KEY,
          JSON.stringify([...next]),
        );
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  }, []);

  const accountComplete =
    !forceShowChecklist &&
    (markedDone.has('account') ||
      (!!organisationName?.trim() &&
        (!!language || !!currency || !!country)));

  // Products step: based on current product count only (not "marked done" in the past)
  const productsComplete =
    !forceShowChecklist && productCount > 0;
  const customersComplete =
    !forceShowChecklist &&
    (markedDone.has('customers') ||
      customerCount > 0 ||
      skippedState.customersSkipped);
  const suppliersComplete =
    !forceShowChecklist &&
    (markedDone.has('suppliers') ||
      supplierCount > 0 ||
      skippedState.suppliersSkipped);

  const isChecklistComplete =
    accountComplete && productsComplete && customersComplete && suppliersComplete;

  // When admin retriggered the checklist, clear the server flag once user completes it
  const naturallyComplete =
    (markedDone.has('account') ||
      (!!organisationName?.trim() &&
        (!!language || !!currency || !!country))) &&
    (productCount > 0) &&
    (markedDone.has('customers') ||
      customerCount > 0 ||
      skippedState.customersSkipped) &&
    (markedDone.has('suppliers') ||
      supplierCount > 0 ||
      skippedState.suppliersSkipped);

  useEffect(() => {
    if (!user || !forceShowChecklist || !naturallyComplete) return;
    void (supabase.from('profiles') as { update: (v: object) => { eq: (c: string, v: string) => PromiseLike<unknown> } })
      .update({ force_show_checklist: false })
      .eq('id', user.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['profile-force-show-checklist', user.id] });
      });
  }, [user?.id, forceShowChecklist, naturallyComplete, queryClient]);

  const tasks: ChecklistTask[] = [
    {
      id: 'products',
      step: 1,
      title: 'Add first products',
      description: 'Add products manually or import them from a CSV file.',
      completed: productsComplete,
      optional: false,
      actionPath: '/dashboard/products/new',
      actionLabel: 'Add Product Manually',
      actionPathSecondary: '/dashboard/categories',
      actionLabelSecondary: 'Import',
    }
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);

  return {
    tasks,
    pendingTasks,
    completedCount,
    totalCount: tasks.length,
    isChecklistComplete,
    isLoading: settingsLoading || productCountLoading,
    skipTask,
    markTaskDone,
    forceShowChecklist: !!forceShowChecklist,
  };
}
