
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  simplifiedNav?: boolean;
}

export const Header = ({ onLoginClick, onNavigate, simplifiedNav }: HeaderProps) => {
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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">SmartStock</span>
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
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLoginClick}>
              Inloggen
            </Button>
            <Button onClick={handleLoginClick}>
              Probeer Gratis
            </Button>
          </div>
        </div>
      </div>
      {/* Mobiel menu overlay */}
      {mobileMenuOpen && (
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
