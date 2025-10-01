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
        console.log('Page hidden at:', new Date().toLocaleTimeString());
      } else if (isPageHidden) {
        // Pagina wordt weer zichtbaar (gebruiker komt terug) - ALTIJD refreshen
        const timeHidden = now - lastVisibilityChange;
        
        console.log('Page visible again after', timeHidden, 'ms, refreshing page in 100ms...');
        
        // Simple solution: always refresh when returning to tab
        refreshTimeout = setTimeout(() => {
          console.log('Executing page refresh now...');
          window.location.reload();
        }, 100);
      }
    };

    // Luister naar visibility change events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('Page refresh hook initialized');

    // Cleanup functie
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, []);
}; 
