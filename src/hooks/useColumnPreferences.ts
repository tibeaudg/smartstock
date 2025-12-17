import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultVisibleColumns, getAvailableColumns } from '@/lib/products/columnFieldMapping';

const STORAGE_KEY_PREFIX = 'productTableColumns_';
const STORAGE_VERSION = '1.0';

interface ColumnPreferences {
  visibleColumns: string[];
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
  const [isLoading, setIsLoading] = useState(true);

  // Get storage key for current user
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null;
    return `${STORAGE_KEY_PREFIX}${user.id}`;
  }, [user?.id]);

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    if (!user?.id) {
      setVisibleColumns(getDefaultVisibleColumns());
      setIsLoading(false);
      return;
    }

    try {
      const storageKey = getStorageKey();
      if (!storageKey) {
        setVisibleColumns(getDefaultVisibleColumns());
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
        
        // If version changed or columns are invalid, reset to defaults
        if (preferences.version !== STORAGE_VERSION || validColumns.length === 0) {
          setVisibleColumns(getDefaultVisibleColumns());
        } else {
          setVisibleColumns(validColumns);
        }
      } else {
        // No stored preferences, use defaults
        setVisibleColumns(getDefaultVisibleColumns());
      }
    } catch (error) {
      console.error('Error loading column preferences:', error);
      setVisibleColumns(getDefaultVisibleColumns());
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getStorageKey]);

  // Save preferences to localStorage
  const savePreferences = useCallback((columns: string[]) => {
    if (!user?.id) return;

    try {
      const storageKey = getStorageKey();
      if (!storageKey) return;

      const preferences: ColumnPreferences = {
        visibleColumns: columns,
        version: STORAGE_VERSION,
      };

      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setVisibleColumns(columns);
    } catch (error) {
      console.error('Error saving column preferences:', error);
    }
  }, [user?.id, getStorageKey]);

  // Reset to default columns
  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultVisibleColumns();
    savePreferences(defaults);
  }, [savePreferences]);

  // Update visible columns
  const setVisibleColumnsWithSave = useCallback((columns: string[]) => {
    savePreferences(columns);
  }, [savePreferences]);

  // Load preferences when user changes
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Clear preferences if user logs out
  useEffect(() => {
    if (!user?.id) {
      setVisibleColumns(getDefaultVisibleColumns());
    }
  }, [user?.id]);

  return {
    visibleColumns,
    setVisibleColumns: setVisibleColumnsWithSave,
    resetToDefaults,
    isLoading,
  };
}

