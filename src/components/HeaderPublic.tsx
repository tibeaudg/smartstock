import React, { useMemo, useRef, useState } from 'react';
import {
  Package,
  Smartphone,
  Image as ImageIcon,
  Bell,
  Barcode,
  Puzzle,
  BarChart3,
  Boxes,
  Truck,
  Wrench,
  HardHat,
  Zap,
  Stethoscope,
  Palette,
  Warehouse,
  GraduationCap,
  Users,
  PenSquare,
  PlayCircle,
  BookOpen,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';
import { useLocation } from "react-router-dom";
import type { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';



export interface HeaderProps {
  className?: string;
  baseColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  simplifiedNav?: boolean;
  hideNotifications?: boolean;
  onNavigate?: () => void;
  hideAuthButtons?: boolean;
}

type MegaMenuLink = {
  label: string;
  description?: string;
  to: string;
  icon?: LucideIcon;
};

type MegaMenuCard = {
  label: string;
  description?: string;
  to: string;
};

type MegaMenuSection = {
  title?: string;
  items?: MegaMenuLink[];
  cards?: MegaMenuCard[];
};

type NavItem = {
  id: string;
  label: string;
  to?: string;
  megaMenu?: {
    intro?: {
      title: string;
      description: string;
      ctaLabel: string;
      ctaTo: string;
    };
    sections: MegaMenuSection[];
  };
};

const Header: React.FC<HeaderProps> = ({
  className = '',
  baseColor = '#fff',
  buttonBgColor,
  buttonTextColor,
  onLoginClick,
  onRegisterClick,
  simplifiedNav,
  hideNotifications,
  onNavigate,
  hideAuthButtons
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});
  const [megaMenuStyles, setMegaMenuStyles] = useState<{ width: number; left: number; top: number }>({
    width: 0,
    left: 0,
    top: 0
  });
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthPage = location.pathname.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        id: 'features',
        label: 'Features',
        megaMenu: {
          intro: {
            title: 'Features',
            description: 'Discover how StockFlow simplifies inventory with features designed for ease and organization.',
            ctaLabel: 'View all features',
            ctaTo: '/features'
          },
          sections: [
            {
              items: [
                {
                  label: 'Mobile App',
                  description: 'Track inventory from any device, any location with our mobile experience.',
                  to: '/mobile-app',
                  icon: Smartphone
                },
                {
                  label: 'Inventory Photos',
                  description: 'Add images to every item for visual clarity and faster picking.',
                  to: '/inventory-photos',
                  icon: ImageIcon
                },
                {
                  label: 'Alerts',
                  description: 'Simplify reordering with low stock and date-based notifications.',
                  to: '/alerts',
                  icon: Bell
                }
              ]
            },
            {
              items: [
                {
                  label: 'Barcoding',
                  description: 'Save time with built-in barcode & QR scanning.',
                  to: '/barcoding',
                  icon: Barcode
                },
                {
                  label: 'Integrations',
                  description: 'Connect StockFlow with the tools your team already uses.',
                  to: '/integrations',
                  icon: Puzzle
                },
                {
                  label: 'Reporting',
                  description: 'Generate powerful, data-driven insights instantly.',
                  to: '/reporting',
                  icon: BarChart3
                }
              ]
            }
          ]
        }
      },
      {
        id: 'solutions',
        label: 'Solutions',
        megaMenu: {
          intro: {
            title: 'Solutions',
            description: 'No matter what you need to track, StockFlow keeps your operations organized.',
            ctaLabel: 'Explore all solutions',
            ctaTo: '/features'
          },
          sections: [
            {
              title: 'Use Cases',
              items: [
                {
                  label: 'Inventory Management',
                  description: 'Manage, organize, and track all inventory in real time.',
                  to: '/inventory-management',
                  icon: Boxes
                },
                {
                  label: 'Supplies Tracking',
                  description: 'Track materials, consumables, and parts with ease.',
                  to: '/suppliers',
                  icon: Truck
                },
                {
                  label: 'Asset Tracking',
                  description: 'Keep tabs on critical tools, equipment, and spare parts.',
                  to: '/asset-tracking',
                  icon: Wrench
                }
              ]
            },
            {
              title: 'Industries',
              items: [
                {
                  label: 'Construction',
                  description: 'Monitor job-site inventory from anywhere.',
                  to: '/contractor-inventory-management',
                  icon: HardHat
                },
                {
                  label: 'Electrical',
                  description: 'Stay on top of electrical supplies across teams.',
                  to: '/electrical-inventory-management',
                  icon: Zap
                },
                {
                  label: 'Medical',
                  description: 'Track medical supplies with full traceability.',
                  to: '/medical-inventory-management',
                  icon: Stethoscope
                }
              ]
            },
            {
              title: 'More Industries',
              items: [
                {
                  label: 'Interior Design',
                  description: 'Visually manage design inventory across projects.',
                  to: '/interior-design-inventory-management',
                  icon: Palette
                },
                {
                  label: 'Warehouse',
                  description: 'Run smart warehouse operations with automation.',
                  to: '/warehouse-inventory-management',
                  icon: Warehouse
                },
                {
                  label: 'Education',
                  description: 'Effortlessly manage school inventory and supplies.',
                  to: '/education-inventory-management',
                  icon: GraduationCap
                }
              ]
            }
          ]
        }
      },

      {
        id: 'pricing',
        label: 'Pricing',
        to: '/pricing'
      },
      {
        id: 'blog',
        label: 'Blog',
        to: '/blog'
      },
    {
        id: 'demo',
        label: 'Demo',
        to: '/demo'
        }
    ],
    []
  );

  const fallbackNavItems: NavItem[] = useMemo(
    () =>
      simplifiedNav
        ? navItems.filter(item => ['pricing'].includes(item.id))
        : navItems,
    [navItems, simplifiedNav]
  );

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
      navigate('/pricing');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = () => {
    onNavigate?.();
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  };

  const toggleMobileSection = (menuId: string) => {
    setExpandedMobileMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const updateMegaMenuPosition = (trigger: HTMLElement) => {
    if (typeof window === 'undefined') {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const maxWidth = Math.min(980, viewportWidth - 48);
    const left = Math.max(
      24,
      Math.min(triggerRect.left + triggerRect.width / 2 - maxWidth / 2, viewportWidth - maxWidth - 24)
    );
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 80;

    setMegaMenuStyles({
      width: maxWidth,
      left,
      top: headerBottom + 4
    });
  };

  const handleMegaMenuOpen = (menuId: string, trigger: HTMLElement) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    updateMegaMenuPosition(trigger);
    setActiveMenu(menuId);
  };

  const handleMegaMenuClose = () => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Set a small delay before closing to allow mouse movement
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, 100);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const renderMegaMenu = (item: NavItem) => {
    if (!item.megaMenu) {
      return null;
    }

    const { intro, sections } = item.megaMenu;

    return (
      <div
        className="fixed z-[100] rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl"
        style={{
          width: megaMenuStyles.width || undefined,
          left: megaMenuStyles.left || undefined,
          top: megaMenuStyles.top || undefined,
          maxWidth: 'min(980px, calc(100vw - 48px))'
        }}
        onMouseEnter={cancelClose}
        onMouseLeave={handleMegaMenuClose}
      >
        <div className="grid gap-10 lg:grid-cols-[260px,1fr]">
          {intro && (
            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-50 via-white to-white p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{intro.title}</p>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{intro.description}</h3>
              </div>
              <Link
                to={intro.ctaTo}
                onClick={handleNavigate}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {intro.ctaLabel}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div
            className={`grid gap-8 ${
              sections.length === 1
                ? 'md:grid-cols-1'
                : sections.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {sections.map((section, sectionIndex) => (
              <div key={`${item.id}-${section.title || sectionIndex}`} className="space-y-4">
                {section.title && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{section.title}</p>
                )}

                {section.items && (
                  <div className="space-y-4">
                    {section.items.map(link => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={handleNavigate}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-blue-50"
                      >
                        {link.icon && (
                          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <link.icon className="h-5 w-5" />
                          </span>
                        )}
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-1 block text-sm text-gray-500">{link.description}</span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {section.cards && (
                  <div className="space-y-4">
                    {section.cards.map(card => (
                      <Link
                        key={card.label}
                        to={card.to}
                        onClick={handleNavigate}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {card.label}
                          </span>
                          {card.description && (
                            <span className="mt-2 block text-sm text-gray-500">
                              {card.description}
                            </span>
                          )}
                        </div>
                        <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                          Read now
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    
    <header ref={headerRef} className={`fixed inset-x-0 top-0 z-[99] ${className}`}>
      {!hideNotifications && (
        <div className="bg-slate-900 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-sm">
            <Link
              to="/pricing"
              onClick={handleNavigate}
              className="inline-flex items-center gap-2 font-medium text-white transition-opacity hover:opacity-80"
            >
              Limited time offer: first 100 products free for life!
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="border-b border-gray-400" style={{ backgroundColor: baseColor }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:py-4">
          <div className="flex items-center gap-8">
            <Link to="/" onClick={handleNavigate} className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-3xl bg-blue-600 transition-transform duration-300 hover:scale-105">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">stockflow</span>
            </Link>

            {!isMobile && (
              <nav className="hidden lg:flex flex-1 items-center justify-center space-x-6 text-sm font-medium text-gray-700">
                {fallbackNavItems.map(item => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={event => {
                      if (item.megaMenu) {
                        handleMegaMenuOpen(item.id, event.currentTarget as HTMLElement);
                      } else {
                        setActiveMenu(null);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.megaMenu) {
                        handleMegaMenuClose();
                      }
                    }}
                  >
                    {item.megaMenu ? (
                      <button
                        type="button"
                        className={`group inline-flex items-center gap-1 rounded-full px-3 py-2 transition-colors ${
                          activeMenu === item.id ? 'text-blue-600' : 'hover:text-blue-600'
                        }`}
                        onClick={event => {
                          setActiveMenu(prev => {
                            if (prev === item.id) {
                              return null;
                            }

                            const parent = (event.currentTarget.parentElement || event.currentTarget) as HTMLElement;
                            updateMegaMenuPosition(parent);
                            return item.id;
                          });
                        }}
                        aria-expanded={activeMenu === item.id}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        to={item.to || '#'}
                        onClick={handleNavigate}
                        className="inline-flex items-center rounded-full px-3 py-2 transition-colors hover:text-blue-600"
                      >
                        {item.label}
                      </Link>
                    )}

                    {item.megaMenu && activeMenu === item.id && renderMegaMenu(item)}
                  </div>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="flex h-12 w-12 flex-col items-center justify-center gap-[6px] rounded-full border border-gray-200"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span
                  className={`h-[2px] w-6 rounded bg-gray-800 transition-transform ${
                    isMobileMenuOpen ? 'translate-y-[4px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-[2px] w-6 rounded bg-gray-800 transition-transform ${
                    isMobileMenuOpen ? '-translate-y-[4px] -rotate-45' : ''
                  }`}
                />
              </button>
            )}

            {!hideAuthButtons && !isMobile && (
              <div className="flex items-center gap-3">
              <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-5 text-sm">
                  <Link to="/auth?mode=login">
                      <span className="text-nowrap">Login</span>
                  </Link>
              </Button>
                <Button
                    asChild
                    size="sm"
                    className="rounded-xl px-5 text-sm bg-blue-700 text-white border border-white">
                    <Link to="/auth?mode=register">
                        <span className="text-nowrap">Start Free</span>
                    </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="space-y-2 px-4 py-4">
              {fallbackNavItems.map(item => (
                <div key={`mobile-${item.id}`} className="rounded-xl border border-gray-100 bg-gray-50">
                  {item.megaMenu ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-gray-800"
                      onClick={() => toggleMobileSection(item.id)}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedMobileMenus[item.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.to || '#'}
                      onClick={handleNavigate}
                      className="block px-4 py-3 text-base font-semibold text-gray-800"
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.megaMenu && expandedMobileMenus[item.id] && (
                    <div className="space-y-4 border-t border-gray-100 px-4 py-4">
                      {item.megaMenu.sections.map((section, sectionIndex) => (
                        <div key={`mobile-${item.id}-${section.title || sectionIndex}`} className="space-y-2">
                          {section.title && (
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{section.title}</p>
                          )}
                          {section.items && (
                            <div className="space-y-2">
                              {section.items.map(link => (
                                <Link
                                  key={`mobile-${item.id}-${link.label}`}
                                  to={link.to}
                                  onClick={handleNavigate}
                                  className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm"
                                >
                                  {link.icon && (
                                    <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                                      <link.icon className="h-4 w-4" />
                                    </span>
                                  )}
                                  <span>
                                    <span className="block text-sm font-semibold text-gray-900">{link.label}</span>
                                    {link.description && (
                                      <span className="mt-1 block text-xs text-gray-500">{link.description}</span>
                                    )}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                          {section.cards && (
                            <div className="space-y-3">
                              {section.cards.map(card => (
                                <Link
                                  key={`mobile-card-${item.id}-${card.label}`}
                                  to={card.to}
                                  onClick={handleNavigate}
                                  className="block rounded-lg bg-white p-4 shadow-sm"
                                >
                                  <span className="block text-sm font-semibold text-gray-900">{card.label}</span>
                                  {card.description && (
                                    <span className="mt-1 block text-xs text-gray-500">{card.description}</span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {item.megaMenu.intro && (
                        <Link
                          to={item.megaMenu.intro.ctaTo}
                          onClick={handleNavigate}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                        >
                          {item.megaMenu.intro.ctaLabel}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!hideAuthButtons && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-full border border-blue-600 px-4 py-3 font-semibold text-blue-600"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRegisterClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-full px-4 py-3 font-semibold text-white"
                    style={{ backgroundColor: buttonBgColor || '#2563eb', color: buttonTextColor || '#fff' }}
                  >
                    Start Free Trial
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;