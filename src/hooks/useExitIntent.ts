import { useCallback, useEffect, useRef } from 'react';

const SESSION_KEY = 'sfExitSeen';
const ARM_DELAY_MS = 1_000;
const TOP_EDGE_PX = 8;

type UseExitIntentOptions = {
  enabled: boolean;
  onTrigger: () => void;
};

export function hasSeenExitPopup(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markExitPopupSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Detect cursor leaving toward the browser chrome (tab bar / address bar). */
export function useExitIntent({ enabled, onTrigger }: UseExitIntentOptions) {
  const onTriggerRef = useRef(onTrigger);
  const armedRef = useRef(false);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  const tryTrigger = useCallback(() => {
    if (!enabled || !armedRef.current || hasSeenExitPopup()) {
      return;
    }

    onTriggerRef.current();
  }, [enabled]);

  useEffect(() => {
    armedRef.current = false;

    if (!enabled || hasSeenExitPopup()) return;

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, ARM_DELAY_MS);

    const handleMouseOut = (event: MouseEvent) => {
      const related = event.relatedTarget as Node | null;
      if (related && document.documentElement.contains(related)) return;
      if (event.clientY <= TOP_EDGE_PX) tryTrigger();
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= TOP_EDGE_PX) tryTrigger();
    };

    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, tryTrigger]);
}
