import { useState, useEffect, useCallback } from 'react';

export type ViewMode = 'categories' | 'daily-ops';
export type OpsViewName = "today's-fires" | 'needs-reorder' | 'missing-setup' | 'overstock' | 'all-products';

export interface OpsViewConfig {
  filters: {
    activeQuickFilters?: string[];
    selectedStockStatus?: string[];
    searchTerm?: string;
  };
  sort: {
    column: string | null;
    direction: 'asc' | 'desc';
  };
  columnPreferences?: {
    visibleColumns: string[];
    columnOrder: string[];
  };
}

const VIEW_MODE_STORAGE_KEY = 'products-view-mode';
const OPS_VIEWS_STORAGE_KEY = 'ops-views-config';

const DEFAULT_OPS_VIEWS: Record<OpsViewName, OpsViewConfig> = {
  "today's-fires": {
    filters: {
      activeQuickFilters: ['low-stock', 'out-of-stock', 'missing-data'],
    },
    sort: {
      column: 'urgency',
      direction: 'desc',
    },
  },
  'needs-reorder': {
    filters: {
      activeQuickFilters: ['needs-reorder'],
    },
    sort: {
      column: 'urgency',
      direction: 'desc',
    },
  },
  'missing-setup': {
    filters: {
      activeQuickFilters: ['missing-data'],
    },
    sort: {
      column: 'urgency',
      direction: 'desc',
    },
  },
  'overstock': {
    filters: {
      activeQuickFilters: [],
      // Overstock filter will be applied programmatically
    },
    sort: {
      column: 'stock',
      direction: 'desc',
    },
  },
  'all-products': {
    filters: {
      activeQuickFilters: [],
    },
    sort: {
      column: 'name',
      direction: 'asc',
    },
  },
};

export function useOpsViewState() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      return (saved as ViewMode) || 'categories';
    }
    return 'categories';
  });

  const [activeOpsView, setActiveOpsView] = useState<OpsViewName>("today's-fires");
  const [savedViews, setSavedViews] = useState<Record<OpsViewName, OpsViewConfig>>(DEFAULT_OPS_VIEWS);

  // Load saved views from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(OPS_VIEWS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedViews({ ...DEFAULT_OPS_VIEWS, ...parsed });
        } catch (e) {
          console.error('Error loading saved views:', e);
        }
      }
    }
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode]);

  // Save views to localStorage
  const saveView = useCallback((viewName: OpsViewName, config: OpsViewConfig) => {
    setSavedViews(prev => {
      const updated = { ...prev, [viewName]: config };
      if (typeof window !== 'undefined') {
        localStorage.setItem(OPS_VIEWS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const applyView = useCallback((viewName: OpsViewName): OpsViewConfig => {
    setActiveOpsView(viewName);
    return savedViews[viewName] || DEFAULT_OPS_VIEWS[viewName];
  }, [savedViews]);

  return {
    viewMode,
    setViewMode,
    activeOpsView,
    applyView,
    saveView,
    savedViews,
  };
}

