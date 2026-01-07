import React from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export default function TableOfContents({ 
  items, 
  activeId, 
  onItemClick, 
  className 
}: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav 
      className={cn(
        "w-full max-w-[280px] bg-slate-50 border border-slate-200 rounded-md p-4 shadow-lg", 
        className
      )}
      aria-label="Table of contents"
    >
      <div className="flex items-center gap-2 mb-4 px-2">
        <List className="w-4 h-4 text-slate-800" />
        <h3 className="text-sm font-semibold text-slate-900">
          On this page
        </h3>
      </div>
      
      <div className="relative border-l-2 border-slate-200 ml-2 text-left">
        <ul className="space-y-[4px]">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const isH3 = item.level === 3;
            
            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => onItemClick?.(item.id)}
                  className={cn(
                    "group flex w-full text-left text-[13px] py-2 transition-all duration-200 rounded-r",
                    isActive 
                      ? "text-blue-800 font-medium bg-blue-50/50" 
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/50",
                    isH3 ? "pl-7" : "pl-4"
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  {/* Active marker line */}
                  {isActive && (
                    <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-blue-600 rounded-r" />
                  )}
                  
                  <span className={cn(
                    "transition-transform duration-200",
                    isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                  )}>
                    
                    {item.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}