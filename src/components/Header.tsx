
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Package, ChevronDown, Users, Star, HelpCircle, BarChart3, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  simplifiedNav?: boolean;
  hideAuthButtons?: boolean;
}

export const Header = ({ onLoginClick, onNavigate, simplifiedNav, hideAuthButtons }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navigationItems = [
    {
      label: 'Features',
      icon: <BarChart3 className="h-4 w-4" />,
      items: [
        { label: 'Voorraadbeheer', sectionId: 'features-section' },
        { label: 'Rapportages', sectionId: 'features-section' },
        { label: 'Mobiel Gebruik', sectionId: 'features-section' },
      ]
    },
    {
      label: 'Reviews',
      icon: <Star className="h-4 w-4" />,
      items: [
        { label: 'Klantenverhalen', sectionId: 'testimonials-section' },
      ]
    },
    {
      label: 'FAQ',
      icon: <HelpCircle className="h-4 w-4" />,
      items: [
        { label: 'Veelgestelde Vragen', sectionId: 'faq-section' },
        { label: 'Hoe werkt het?', sectionId: 'video-section' },
      ]
    },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="w-full">
          <div className="flex justify-between items-center h-16 px-4 md:px-8">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <Package className="h-8 w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">stockflow</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!simplifiedNav && (
              <nav className="hidden lg:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50">
                      {item.icon}
                      <span className="font-medium text-sm">{item.label}</span>
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        {item.items.map((subItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleNavClick(subItem.sectionId)}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Desktop Auth Buttons */}
            {!hideAuthButtons && (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={handleLoginClick} className="text-sm">
                  Inloggen
                </Button>
                <Button size="sm" onClick={handleLoginClick} className="text-sm">
                  Probeer Gratis
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Mobile Navigation Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!simplifiedNav && (
                <div className="space-y-6">
                  {navigationItems.map((item) => (
                    <div key={item.label} className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-900 font-semibold">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="ml-7 space-y-2">
                        {item.items.map((subItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleNavClick(subItem.sectionId)}
                            className="block w-full text-left py-3 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-sm"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Auth Buttons */}
              {!hideAuthButtons && (
                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}
                  >
                    Inloggen
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}
                  >
                    Probeer Gratis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16"></div>
    </>
  );
};
