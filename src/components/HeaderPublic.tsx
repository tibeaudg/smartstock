import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';
import { useLocation } from "react-router-dom";



export interface HeaderProps {
  className?: string;
  baseColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  baseColor = '#fff',
  buttonBgColor,
  buttonTextColor,
  onLoginClick,
  onRegisterClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/auth?mode=login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      navigate('/auth?mode=register');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] lg:max-w-[1200px] xl:max-w-[1400px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        className="block h-[60px] p-0 rounded-xl shadow-md relative"
        style={{ backgroundColor: baseColor }}
      >
        {/* Header Bar */}
        <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-end p-2 pl-[1.1rem] z-[10]">
          {/* Right side - Desktop buttons */}
          <div className="flex items-center">
            {!isMobile && (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="border-0 rounded-[calc(0.75rem-0.2rem)] px-4 h-10 font-medium cursor-pointer transition-colors duration-300"
                  style={{ backgroundColor: buttonBgColor || '#2563eb', color: buttonTextColor || '#fff' }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-blue-600 rounded-3xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium text-gray-900 group-hover:text-blue-700 transition-colors">stockflow</span>
            </Link>
          </div>

          {/* Right side - Hamburger menu on mobile */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="h-12 w-12 flex flex-col items-center justify-center cursor-pointer gap-[6px]  rounded"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <div
                  className={`w-[24px] h-[3px] bg-gray-700 transition-all duration-300 ease-linear rounded ${
                    isMobileMenuOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <div
                  className={`w-[24px] h-[3px] bg-gray-700 transition-all duration-300 ease-linear rounded ${
                    isMobileMenuOpen ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-[60px] left-0 right-0 bg-white rounded-b-xl shadow-lg z-[20] border border-gray-200">
            <div className="flex flex-col p-4 space-y-3">
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <button
                type="button"
                onClick={handleLoginClick}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-left"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleRegisterClick}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{ backgroundColor: buttonBgColor || '#2563eb', color: buttonTextColor || '#fff' }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;