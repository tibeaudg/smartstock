import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultVisibleColumns, getAvailableColumns, getDefaultColumnOrder } from '@/lib/products/columnFieldMapping';

const STORAGE_KEY_PREFIX = 'productTableColumns_';
const STORAGE_VERSION = '1.1';

interface ColumnPreferences {
  visibleColumns: string[];
  columnOrder?: string[];
  version: string;
}

/**
 * Hook to manage product table column visibility preferences
 * 
 * Stores preferences in localStorage with user-specific keys.
 * Automatically loads preferences on mount and provides functions to update them.
 */
export function useColumnPreferences() {
  const { user } = useAuth();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get storage key for current user
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null;
    return `${STORAGE_KEY_PREFIX}${user.id}`;
  }, [user?.id]);

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    if (!user?.id) {
      const defaultVisible = getDefaultVisibleColumns();
      const defaultOrder = getDefaultColumnOrder();
      setVisibleColumns(defaultVisible);
      setColumnOrder(defaultOrder);
      setIsLoading(false);
      return;
    }

    try {
      const storageKey = getStorageKey();
      if (!storageKey) {
        const defaultVisible = getDefaultVisibleColumns();
        const defaultOrder = getDefaultColumnOrder();
        setVisibleColumns(defaultVisible);
        setColumnOrder(defaultOrder);
        setIsLoading(false);
        return;
      }

      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const preferences: ColumnPreferences = JSON.parse(stored);
        
        // Validate that stored columns still exist
        const availableColumnIds = getAvailableColumns().map(col => col.id);
        const validColumns = preferences.visibleColumns.filter(id => 
          availableColumnIds.includes(id)
        );
        
        // Validate column order
        const validOrder = preferences.columnOrder?.filter(id => 
          availableColumnIds.includes(id)
        ) || [];
        
        // If version changed or columns are invalid, reset to defaults
        if (preferences.version !== STORAGE_VERSION || validColumns.length === 0) {
          const defaultVisible = getDefaultVisibleColumns();
          const defaultOrder = getDefaultColumnOrder();
          setVisibleColumns(defaultVisible);
          setColumnOrder(defaultOrder);
        } else {
          setVisibleColumns(validColumns);
          // Use stored order if available and valid, otherwise use default
          if (validOrder.length > 0) {
            setColumnOrder(validOrder);
          } else {
            // Migrate from old version: use visibleColumns as initial order
            setColumnOrder(validColumns);
          }
        }
      } else {
        // No stored preferences, use defaults
        const defaultVisible = getDefaultVisibleColumns();
        const defaultOrder = getDefaultColumnOrder();
        setVisibleColumns(defaultVisible);
        setColumnOrder(defaultOrder);
      }
    } catch (error) {
      console.error('Error loading column preferences:', error);
      const defaultVisible = getDefaultVisibleColumns();
      const defaultOrder = getDefaultColumnOrder();
      setVisibleColumns(defaultVisible);
      setColumnOrder(defaultOrder);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getStorageKey]);

  // Save preferences to localStorage
  const savePreferences = useCallback((columns: string[], order?: string[]) => {
    if (!user?.id) return;

    try {
      const storageKey = getStorageKey();
      if (!storageKey) return;

      const preferences: ColumnPreferences = {
        visibleColumns: columns,
        columnOrder: order !== undefined ? order : columnOrder,
        version: STORAGE_VERSION,
      };

      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setVisibleColumns(columns);
      if (order !== undefined) {
        setColumnOrder(order);
      }
    } catch (error) {
      console.error('Error saving column preferences:', error);
    }
  }, [user?.id, getStorageKey, columnOrder]);

  // Reset to default columns
  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultVisibleColumns();
    const defaultOrder = getDefaultColumnOrder();
    savePreferences(defaults, defaultOrder);
  }, [savePreferences]);

  // Update visible columns
  const setVisibleColumnsWithSave = useCallback((columns: string[], order?: string[]) => {
    savePreferences(columns, order);
  }, [savePreferences]);

  // Update column order independently
  const setColumnOrderWithSave = useCallback((order: string[]) => {
    if (!user?.id) return;

    try {
      const storageKey = getStorageKey();
      if (!storageKey) return;

      const preferences: ColumnPreferences = {
        visibleColumns,
        columnOrder: order,
        version: STORAGE_VERSION,
      };

      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setColumnOrder(order);
    } catch (error) {
      console.error('Error saving column order:', error);
    }
  }, [user?.id, getStorageKey, visibleColumns]);

  // Load preferences when user changes
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Clear preferences if user logs out
  useEffect(() => {
    if (!user?.id) {
      const defaultVisible = getDefaultVisibleColumns();
      const defaultOrder = getDefaultColumnOrder();
      setVisibleColumns(defaultVisible);
      setColumnOrder(defaultOrder);
    }
  }, [user?.id]);

  return {
    visibleColumns,
    columnOrder,
    setVisibleColumns: setVisibleColumnsWithSave,
    setColumnOrder: setColumnOrderWithSave,
    resetToDefaults,
    isLoading,
  };
}


