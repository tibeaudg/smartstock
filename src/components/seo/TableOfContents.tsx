import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, List } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
  sticky?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  items, 
  className = '',
  sticky = true 
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Track which section is currently in view
  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Show TOC when scrolled past hero
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      ref={tocRef}
      className={`${sticky ? 'sticky top-24' : ''} ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } transition-all duration-300`}
      aria-label="Table of contents"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">On This Page</h2>
        </div>
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const indentClass = item.level === 1 ? 'ml-0' : item.level === 2 ? 'ml-4' : 'ml-8';
            
            return (
              <li key={item.id} className={indentClass}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <ChevronRight 
                    className={`w-3 h-3 transition-transform ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`} 
                  />
                  <span className="line-clamp-1">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

