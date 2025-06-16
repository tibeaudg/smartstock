
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Header = ({ onLoginClick, onNavigate }: HeaderProps) => {
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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">VoorraadBeheer</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavClick('features')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Functies
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Prijzen
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Over Ons
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLoginClick}>
              Inloggen
            </Button>
            <Button onClick={handleLoginClick}>
              Registreren
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
