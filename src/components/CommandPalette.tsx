/**
 * Command Palette Component
 * Provides quick actions via Cmd+K / Ctrl+K keyboard shortcut
 * Inspired by Superhuman and Linear
 */

import React, { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Plus,
  Package,
  ArrowRightLeft,
  FolderTree,
  MapPin,
  Search,
  TrendingUp,
  Settings,
  FileText,
  ShoppingCart,
  Warehouse,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CommandPaletteAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  keywords?: string[];
  group: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandPaletteAction[];
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  // Filter actions based on search
  const filteredActions = React.useMemo(() => {
    if (!search.trim()) return actions;

    const searchLower = search.toLowerCase();
    return actions.filter((action) => {
      const matchesLabel = action.label.toLowerCase().includes(searchLower);
      const matchesKeywords = action.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );
      return matchesLabel || matchesKeywords;
    });
  }, [actions, search]);

  // Group actions by group
  const groupedActions = React.useMemo(() => {
    const groups: Record<string, CommandPaletteAction[]> = {};
    filteredActions.forEach((action) => {
      if (!groups[action.group]) {
        groups[action.group] = [];
      }
      groups[action.group].push(action);
    });
    return groups;
  }, [filteredActions]);

  const handleSelect = (action: CommandPaletteAction) => {
    action.action();
    onOpenChange(false);
    setSearch('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedActions).map(([groupName, groupActions]) => (
          <CommandGroup key={groupName} heading={groupName}>
            {groupActions.map((action) => (
              <CommandItem
                key={action.id}
                onSelect={() => handleSelect(action)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
                {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Hook to manage command palette state and keyboard shortcut
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // Don't trigger if user is typing in an input, textarea, or contenteditable
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable ||
            (activeElement as HTMLElement).closest('[contenteditable="true"]'))
        ) {
          // Allow default behavior for inputs (e.g., Ctrl+K in text editors)
          return;
        }

        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Close on Escape
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return { open, setOpen };
}





