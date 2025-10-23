import { useState, useEffect } from 'react';

export function useMobile() {
  // Initialize with immediate mobile detection to avoid timing issues
  const getInitialMobileState = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as { opera?: string }).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return mobileRegex.test(ua.toLowerCase());
  };

  const [isMobile, setIsMobile] = useState(getInitialMobileState);
  const [mobileDetectionComplete, setMobileDetectionComplete] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || (window as { opera?: string }).opera;
      setUserAgent(ua);

      // Check if mobile device - only set once to prevent state changes
      if (!mobileDetectionComplete) {
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileDevice = mobileRegex.test(ua.toLowerCase());
        setIsMobile(isMobileDevice);
        setMobileDetectionComplete(true);
      }

      // Check if iOS (more specific detection)
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream;
      setIsIOS(isIOSDevice);

      // Check if Safari (more specific detection)
      const isSafariBrowser = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
      setIsSafari(isSafariBrowser);

      // Check camera support
      const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setCameraSupported(hasCameraSupport);

      // Device info available for debugging if needed

      // Additional iOS specific checks available if needed
    };

    checkDevice();

    // Re-check on focus only for camera support changes, not mobile detection
    const handleFocus = () => {
      // Only re-check camera support, not mobile detection
      const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setCameraSupported(hasCameraSupport);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return {
    isMobile,
    isIOS,
    isSafari,
    cameraSupported,
    userAgent
  };
}
