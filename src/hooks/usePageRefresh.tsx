import { useEffect } from 'react';

export const usePageRefresh = () => {
  useEffect(() => {
    let isPageHidden = false;
    let refreshTimeout: NodeJS.Timeout;
    let lastVisibilityChange = Date.now();

    const handleVisibilityChange = () => {
      const now = Date.now();
      
      if (document.hidden) {
        // Pagina wordt verborgen (gebruiker gaat naar ander tabblad)
        isPageHidden = true;
        lastVisibilityChange = now;
      } else if (isPageHidden) {
        // Pagina wordt weer zichtbaar (gebruiker komt terug)
        const timeHidden = now - lastVisibilityChange;
        
        // Alleen refreshen als de pagina langer dan 5 minuten verborgen was
        // Dit voorkomt problemen met branch state restoration bij korte tab switches
        if (timeHidden > 5 * 60 * 1000) { // 5 minutes
          refreshTimeout = setTimeout(() => {
            console.log('Page was hidden for', timeHidden, 'ms, refreshing...');
            window.location.reload();
          }, 100);
        } else {
          console.log('Page was hidden for', timeHidden, 'ms, not refreshing to preserve state');
        }
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
