import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Barcode,
  Lock,
  Plug,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { markExitPopupSeen, useExitIntent } from '@/hooks/useExitIntent';
import { isPublicMarketingPath } from '@/utils/isPublicMarketingPath';
import { Button } from './ui/button';

const FEATURES = [
  {
    icon: BarChart3,
    text: 'Real-time stock levels across all locations',
  },
  {
    icon: Barcode,
    text: 'Barcode scanning built-in, no extras needed',
  },
  {
    icon: Plug,
    text: 'Works with your existing tools',
  },
  {
    icon: Lock,
    text: 'Free forever — no credit card',
  },
] as const;

export function ExitIntentPopup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [open, setOpen] = useState(false);

  const isMarketingPage = isPublicMarketingPath(location.pathname);
  const isTestMode = searchParams.get('exit_test') === '1';

  const canShowPopup = useMemo(() => {
    if (isTestMode) return true;
    if (!isMarketingPage) return false;
    if (authLoading) return false;
    if (user) return false;
    return true;
  }, [authLoading, isMarketingPage, isTestMode, user]);

  const openPopup = useCallback(() => {
    if (!canShowPopup) return;
    markExitPopupSeen();
    setOpen(true);
  }, [canShowPopup]);

  useExitIntent({
    enabled: canShowPopup && !isTestMode,
    onTrigger: openPopup,
  });

  useEffect(() => {
    if (!isTestMode) return;
    try {
      sessionStorage.removeItem('sfExitSeen');
    } catch {
      /* ignore */
    }
    const timer = window.setTimeout(() => {
      markExitPopupSeen();
      setOpen(true);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [isTestMode]);

  useEffect(() => {
    if (!canShowPopup) setOpen(false);
  }, [canShowPopup]);

  const close = useCallback(() => {
    setOpen(false);
    markExitPopupSeen();
  }, []);

  const handleJoin = useCallback(() => {
    close();
    navigate('/auth?mode=register');
  }, [close, navigate]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sf-exit-title"
      onClick={close}
    >
      <div
        className="flex w-full max-w-[620px] flex-col overflow-hidden rounded-xl font-sans sm:min-h-[340px] sm:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Left — 35% */}
        <div className="flex w-full shrink-0 flex-col justify-center bg-primary px-6 py-8 text-white sm:w-[35%] sm:px-5 sm:py-10">
          <p className="mb-5 text-[15px] font-semibold">Why StockFlow?</p>
          <div className="flex flex-col gap-4 text-[13px] leading-relaxed text-white/85">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#243a6e]">
                  <Icon className="h-4 w-4 text-sky-300" strokeWidth={1.75} />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 65%, content vertically centered */}
        <div className="relative flex flex-1 flex-col justify-center bg-[#1c1c21] px-8 py-10 sm:px-10">
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#2a2a30] text-white/70 transition-colors hover:bg-[#34343c] hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-6">
            <h2
              id="sf-exit-title"
              className="mb-2 text-lg font-semibold leading-snug text-white"
            >
              Before you go — it&apos;s free.
            </h2>
            <p className="mb-7 text-[13px] leading-[1.5] text-white/55">
              Get your inventory under control in under 10 minutes. No setup cost,
              no trial period.
            </p>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleJoin}
                className="h-11 w-full max-w-[240px] gap-2 px-6 text-sm font-semibold"
              >
                Join for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={close}
                className="text-xs text-white/40 transition-colors hover:text-white/65"
              >
                No thanks, take me back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
