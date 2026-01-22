import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, X, Search, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SavedSearch {
  id: string;
  query: string;
  name?: string;
  timestamp: number;
}

interface SavedSearchesProps {
  currentQuery: string;
  onSelect: (query: string) => void;
  onSave?: (query: string, name?: string) => void;
  userId?: string;
}

const STORAGE_KEY_PREFIX = 'saved-searches-';

export const SavedSearches: React.FC<SavedSearchesProps> = ({
  currentQuery,
  onSelect,
  onSave,
  userId,
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const storageKey = `${STORAGE_KEY_PREFIX}${userId || 'default'}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedSearches(Array.isArray(parsed) ? parsed : []);
        } catch {
          setSavedSearches([]);
        }
      }
    }
  }, [storageKey]);

  const saveSearch = () => {
    if (!currentQuery.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      query: currentQuery,
      name: saveName.trim() || undefined,
      timestamp: Date.now(),
    };

    const updated = [newSearch, ...savedSearches].slice(0, 10); // Keep max 10
    setSavedSearches(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    setShowSaveDialog(false);
    setSaveName('');
    onSave?.(currentQuery, saveName.trim() || undefined);
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const handleSelect = (query: string) => {
    onSelect(query);
    setIsOpen(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const hasQuery = currentQuery.trim().length > 0;
  const isAlreadySaved = savedSearches.some(s => s.query === currentQuery);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Saved searches"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Saved Searches</h3>
            {hasQuery && !isAlreadySaved && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="h-7 text-xs"
              >
                <Bookmark className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
          {showSaveDialog && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Name (optional)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearch();
                  } else if (e.key === 'Escape') {
                    setShowSaveDialog(false);
                    setSaveName('');
                  }
                }}
                className="w-full px-2 py-1.5 text-sm border rounded"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={saveSearch}
                  className="h-7 text-xs flex-1"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveName('');
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {savedSearches.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No saved searches yet
            </div>
          ) : (
            <div className="p-1">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
                  onClick={() => handleSelect(search.query)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {search.name || search.query}
                      </span>
                    </div>
                    {search.name && (
                      <div className="text-xs text-gray-500 truncate mt-0.5 ml-5">
                        {search.query}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 ml-5">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatTime(search.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSearch(search.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    aria-label="Delete saved search"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};




