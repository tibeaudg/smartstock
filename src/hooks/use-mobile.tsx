import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      setUserAgent(ua);

      // Check if mobile device
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(ua.toLowerCase());
      setIsMobile(isMobileDevice);

      // Check if iOS (more specific detection)
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);

      // Check if Safari (more specific detection)
      const isSafariBrowser = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
      setIsSafari(isSafariBrowser);

      // Check camera support
      const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setCameraSupported(hasCameraSupport);

      // Log device info for debugging
      console.log('Device Info:', {
        userAgent: ua,
        isMobile: isMobileDevice,
        isIOS: isIOSDevice,
        isSafari: isSafariBrowser,
        cameraSupported: hasCameraSupport,
        mediaDevices: !!navigator.mediaDevices,
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        permissions: !!navigator.permissions,
        secureContext: window.isSecureContext
      });

      // Additional iOS specific checks
      if (isIOSDevice) {
        console.log('iOS Device detected:', {
          isSafari: isSafariBrowser,
          isChrome: /CriOS/.test(ua),
          isFirefox: /FxiOS/.test(ua),
          isSecureContext: window.isSecureContext,
          hasMediaDevices: !!navigator.mediaDevices,
          hasPermissions: !!navigator.permissions
        });
      }
    };

    checkDevice();

    // Re-check on focus (useful for permission changes)
    const handleFocus = () => {
      setTimeout(checkDevice, 1000);
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
