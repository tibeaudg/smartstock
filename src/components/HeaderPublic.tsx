
import { Button } from '@/components/ui/button';
import { Package, X, ChevronDown } from 'lucide-react';
import { NotificationButton } from './NotificationButton';
import { useNotifications } from '../hooks/useNotifications';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  simplifiedNav?: boolean;
  hideAuthButtons?: boolean;
  hideNotifications?: boolean;
}

export const Header = ({ onNavigate, hideAuthButtons, hideNotifications }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications();

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markAllAsRead();
  };

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setResourcesDropdownOpen(false);
    };

    if (resourcesDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [resourcesDropdownOpen]);

  const handleLoginClick = () => {
    navigate('/auth?mode=login');
  };

  const handleRegisterClick = () => {
    navigate('/auth?mode=register');
  };


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="w-full">
          <div className="flex justify-between items-center h-16 px-4 md:px-8">
            {/* Logo - Left side */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 bg-blue-600 rounded-3xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-medium text-gray-900 group-hover:text-blue-700 transition-colors">stockflow</span>
              </Link>
            </div>

            {/* Navigation and Action Buttons - Right side */}
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              {onNavigate && (
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</Link>
                  <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
                  
                  {/* Resources Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                      Resources
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {resourcesDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link 
                          to="/help" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          onClick={() => setResourcesDropdownOpen(false)}
                        >
                          Help Center
                        </Link>
                        <Link 
                          to="/blog" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          onClick={() => setResourcesDropdownOpen(false)}
                        >
                          Blog
                        </Link>
                        <Link 
                          to="/api-docs" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          onClick={() => setResourcesDropdownOpen(false)}
                        >
                          API Documentation
                        </Link>
                        <Link 
                          to="/integrations" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          onClick={() => setResourcesDropdownOpen(false)}
                        >
                          Integrations
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                      to="/auth?mode=login" 
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                    Login
                    </Link>
                </nav>
              )}

              {/* Desktop Notification Button */}
              <div className="hidden md:flex items-center space-x-3">
                {!hideNotifications && (
                  <NotificationButton unreadCount={unreadCount} onClick={handleNotificationClick} />
                )}
                {!hideAuthButtons && (
                  <>
                    <Link
                      to="/demo"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-3 rounded-3xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 h-10 flex items-center justify-center"
                    >
                      View Demo
                    </Link>
                    <Button 
                      onClick={handleRegisterClick} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-3xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-500/20 h-10 flex items-center justify-center"
                    >
                      Start Free
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 hover:bg-gray-100 transition-colors"
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">stockflow</span>
              </div>
              <div className="flex items-center space-x-2">
                {!hideNotifications && (
                  <NotificationButton unreadCount={unreadCount} onClick={handleNotificationClick} />
                )}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
      {/* Notification Overlay */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto">
          <h4 className="font-semibold mb-2">Notifications</h4>
          {loading ? (
            <div className="text-gray-500 text-sm">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-700 text-sm">No notifications.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((n) => (
                <li key={n.id} className={`py-2 ${!n.read ? 'bg-blue-50' : ''}`}>
                  <div className="font-medium text-gray-900 text-sm">{n.title}</div>
                  <div className="text-gray-700 text-xs mb-1">{n.message}</div>
                  <div className="text-gray-400 text-xs">{new Date(n.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
            
            {/* Mobile Navigation Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* Mobile Navigation Links */}
              {onNavigate && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
                  <div className="space-y-1">
                    <Link 
                      to="/features"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      to="/pricing"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link 
                      to="/customers"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Customers
                    </Link>
                    <Link 
                      to="/help"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help Center
                    </Link>
                    <Link 
                      to="/blog"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link 
                      to="/contact"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link 
                      to="/auth?mode=login"
                      className="block w-full text-left text-gray-700 hover:text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile Auth Buttons */}
              {!hideAuthButtons && (
                <div className="space-y-3">
                  <Link
                    to="/demo"
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-3xl font-semibold h-12 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/25" 
                    >
                      View Demo
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-3xl h-12 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20" 
                    onClick={() => { handleRegisterClick(); setMobileMenuOpen(false); }}
                  >
                    Start Free
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
