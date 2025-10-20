import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';

type HeaderLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type HeaderNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: HeaderLink[];
};

export interface HeaderProps {
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  onLoginClick,
  onRegisterClick
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const navigate = useNavigate();

  const items: HeaderNavItem[] = [
    {
      label: "Features",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Overview", href: "/features", ariaLabel: "View Features Overview" },
        { label: "Integrations", href: "/integrations", ariaLabel: "View Integrations" }
      ]
    },
    {
      label: "Solutions", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Pricing", href: "/pricing", ariaLabel: "View Pricing Plans" },
        { label: "Business", href: "/contact?subject=business-tier", ariaLabel: "Business Solutions" }
      ]
    },
    {
      label: "Support",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Contact", href: "/contact", ariaLabel: "Contact Support" },
        { label: "Help Center", href: "/contact", ariaLabel: "Help Center" }
      ]
    }
  ];

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        // For mobile, calculate height based on the mobile menu buttons (3 buttons + padding)
        const mobileMenuHeight = 200; // Approximate height for 3 buttons with gaps and padding

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + mobileMenuHeight + padding;
      }
    }
    // For desktop, use the original calculation for navigation cards
    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static';
      contentEl.style.height = 'auto';

      contentEl.offsetHeight;

      const topBar = 60;
      const padding = 16;
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      return topBar + contentHeight + padding;
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items, isMobile]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/auth?mode=login');
    }
  };

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      navigate('/auth?mode=register');
    }
  };

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] lg:max-w-[1200px] xl:max-w-[1400px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          {/* Left side - Empty on mobile, desktop buttons on desktop */}
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
                  className="card-nav-cta-button border-0 rounded-[calc(0.75rem-0.2rem)] px-4 h-10 font-medium cursor-pointer transition-colors duration-300"
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
              <div
                className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full w-12 flex flex-col items-center justify-center cursor-pointer gap-[6px]`}
                onClick={toggleMenu}
                role="button"
                aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                tabIndex={0}
                style={{ color: menuColor || '#1f2937' }}
              >
                <div
                  className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                    isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
                  } group-hover:opacity-75`}
                />
                <div
                  className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                    isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
                  } group-hover:opacity-75`}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          }`}
          aria-hidden={!isExpanded}
        >
          {/* Mobile hamburger menu buttons */}
          {isMobile && (
            <div className="flex flex-col gap-3 p-4">
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors duration-300"
              onClick={() => {
                setIsHamburgerOpen(false);
                setIsExpanded(false);
                if (tlRef.current) {
                  tlRef.current.reverse();
                }
              }}
            >
              Pricing
            </Link>
            <button
              type="button"
              onClick={() => {
                handleLoginClick();
                setIsHamburgerOpen(false);
                setIsExpanded(false);
                if (tlRef.current) {
                  tlRef.current.reverse();
                }
              }}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-left"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                handleRegisterClick();
                setIsHamburgerOpen(false);
                setIsExpanded(false);
                if (tlRef.current) {
                  tlRef.current.reverse();
                }
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{ backgroundColor: buttonBgColor || '#2563eb', color: buttonTextColor || '#fff' }}
            >
              Get Started
            </button>
            </div>
          )}

          {/* Desktop navigation cards */}
          {!isMobile && (
            <div className="flex flex-row items-end gap-[12px] w-full">
            {(items || []).slice(0, 3).map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_0%] h-full min-h-0"
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                <div className="nav-card-label font-normal tracking-[-0.5px] text-[22px]">
                  {item.label}
                </div>
                <div className="nav-card-links flex flex-col gap-[4px] flex-shrink-0 mt-auto">
                  {item.links?.map((link, i) => (
                    <Link
                      key={`${link.label}-${i}`}
                      className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[16px] py-1 opacity-100"
                      to={link.href}
                      aria-label={link.ariaLabel}
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setIsExpanded(false);
                        if (tlRef.current) {
                          tlRef.current.reverse();
                        }
                      }}
                    >
                      <svg className="nav-card-link-icon shrink-0 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
