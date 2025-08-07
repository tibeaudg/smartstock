import { useEffect } from 'react';

export const usePageRefresh = () => {
  useEffect(() => {
    let isPageHidden = false;
    let refreshTimeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pagina wordt verborgen (gebruiker gaat naar ander tabblad)
        isPageHidden = true;
      } else if (isPageHidden) {
        // Pagina wordt weer zichtbaar (gebruiker komt terug)
        // Wacht even en refresh dan de pagina
        refreshTimeout = setTimeout(() => {
          window.location.reload();
        }, 100); // Korte delay om ervoor te zorgen dat de pagina volledig geladen is
      }
    };

    // Luister naar visibility change events
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup functie
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, []);
}; 