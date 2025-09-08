
import { Button } from '@/components/ui/button';
import { Package, X } from 'lucide-react';
import { NotificationButton } from './NotificationButton';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onLoginClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  simplifiedNav?: boolean;
  hideAuthButtons?: boolean;
  hideNotifications?: boolean;
}

export const Header = ({ onLoginClick, onNavigate, simplifiedNav, hideAuthButtons, hideNotifications }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="w-full">
          <div className="flex justify-between items-center h-16 px-4 md:px-8 border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <Package className="h-8 w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">stockflow</span>
              </Link>
            </div>
            {onNavigate && (
              <nav className="hidden lg:flex items-center gap-6 text-sm">
                <button className="text-gray-700 hover:text-blue-700" onClick={() => onNavigate('features-section')}>Features</button>
                <button className="text-gray-700 hover:text-blue-700" onClick={() => onNavigate('testimonials-section')}>Reviews</button>
                <button className="text-gray-700 hover:text-blue-700" onClick={() => onNavigate('faq-section')}>FAQ</button>
                <button className="text-gray-700 hover:text-blue-700" onClick={() => onNavigate('contact-section')}>Contact</button>
              </nav>
            )}

              {/* Desktop Notification Button */}
              <div className="hidden md:flex items-center space-x-3">
                {!hideNotifications && (
                  <NotificationButton unreadCount={unreadCount} onClick={handleNotificationClick} />
                )}
                {!hideAuthButtons && (
                  <>
                    <Button size="sm" onClick={handleLoginClick} className="text-sm">
                      Aanmelden
                    </Button>
                  </>
                )}
              </div>

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

            {/* Mobile Menu Header with Notification Button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <div className="flex items-center space-x-2">
                  {!hideNotifications && (
                    <NotificationButton unreadCount={unreadCount} onClick={handleNotificationClick} />
                  )}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
            </div>
      {/* Notification Overlay */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto">
          <h4 className="font-semibold mb-2">Meldingen</h4>
          {loading ? (
            <div className="text-gray-500 text-sm">Laden...</div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-700 text-sm">Geen meldingen.</div>
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
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">

              {/* Mobile Auth Buttons */}
              {!hideAuthButtons && (
                <div className="space-y-3">

                  <Button 
                    variant="outline" 
                    className="w-full border border-blue-600" 
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
