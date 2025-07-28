
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  simplifiedNav?: boolean;
  hideAuthButtons?: boolean;
}

export const Header = ({ onLoginClick, onNavigate, simplifiedNav, hideAuthButtons }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white pl-8 pr-8 shadow-sm border-b w-full">
      <div className="w-full">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Package className="h-8 w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">stockflow</span>
            </Link>
          </div>
          {/* Hamburger menu voor mobiel */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Menu"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop knoppen */}
          {!hideAuthButtons && (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLoginClick} title="Inloggen op voorraadbeheer dashboard">
                Inloggen
              </Button>
              <Button onClick={handleLoginClick} title="Probeer gratis voorraadbeheer app">
                Probeer Gratis
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Mobiel menu overlay */}
      {mobileMenuOpen && !hideAuthButtons && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col space-y-4" onClick={e => e.stopPropagation()}>
            <div className="border-t pt-4 mt-4 flex flex-col space-y-2">
              <Button variant="ghost" onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}>
                Inloggen
              </Button>
              <Button onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}>
                Probeer Gratis
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
