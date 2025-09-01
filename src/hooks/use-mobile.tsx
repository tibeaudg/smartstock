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

      // Check if iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);

      // Check if Safari
      const isSafariBrowser = /Safari/.test(ua) && !/Chrome/.test(ua);
      setIsSafari(isSafariBrowser);

      // Check camera support
      const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setCameraSupported(hasCameraSupport);
    };

    checkDevice();

    // Log device info for debugging
    console.log('Device Info:', {
      userAgent: navigator.userAgent,
      isMobile,
      isIOS,
      isSafari,
      cameraSupported,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    });
  }, []);

  return {
    isMobile,
    isIOS,
    isSafari,
    cameraSupported,
    userAgent
  };
}
