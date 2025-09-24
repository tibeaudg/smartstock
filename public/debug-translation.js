/**
 * Optimized Debug script voor vertaling troubleshooting
 * Helpt bij het identificeren van problemen met automatische vertaling
 */

(function() {
  'use strict';
  
  console.log('🔍 Translation Debug Script Loaded (Optimized)');
  
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const primaryLang = browserLang.split('-')[0];
  const supportedLanguages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'];
  const isDutch = browserLang.startsWith('nl');
  const isSupported = supportedLanguages.includes(primaryLang);
  const shouldAutoTranslate = !isDutch && isSupported;
  
  console.log('🌐 Browser Language:', browserLang);
  console.log('🔤 Primary Language:', primaryLang);
  console.log('🇳🇱 Is Dutch:', isDutch);
  console.log('✅ Is Supported:', isSupported);
  console.log('🔄 Should Auto-translate:', shouldAutoTranslate);
  
  // Enhanced Google Translate checker with localhost support
  function checkGoogleTranslate() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    console.log('🔍 Checking Translation Implementation...');
    console.log('Environment:', isLocalhost ? 'Localhost (Development)' : 'Production');
    console.log('Google object:', !!window.google);
    console.log('Google Translate:', !!window.google?.translate);
    console.log('Translation initialized:', !!window.translationInitialized);
    
    if (isLocalhost) {
      console.log('🏠 Localhost mode detected');
      
      const localhostSelector = document.getElementById('localhost-language-selector');
      const localhostButton = document.getElementById('localhost-translate-button');
      const translateWidget = document.getElementById('google_translate_element');
      
      console.log('Localhost selector found:', !!localhostSelector);
      console.log('Localhost button found:', !!localhostButton);
      console.log('Translate widget found:', !!translateWidget);
      
      if (localhostSelector) {
        console.log('Selected language:', localhostSelector.value);
        console.log('Available options:', Array.from(localhostSelector.options).length);
      }
      
      if (translateWidget) {
        console.log('Widget visible:', translateWidget.offsetParent !== null);
        console.log('Widget content length:', translateWidget.innerHTML.length);
      }
      
      console.log('✅ Localhost fallback implementation active');
      
    } else if (window.google && window.google.translate) {
      console.log('✅ Google Translate is loaded');
      
      const translateElement = document.querySelector('.goog-te-combo');
      const translateWidget = document.getElementById('google_translate_element');
      
      console.log('Translate element found:', !!translateElement);
      console.log('Translate widget found:', !!translateWidget);
      
      if (translateElement) {
        console.log('Current language:', translateElement.value);
        console.log('Available options:', Array.from(translateElement.options).map(opt => opt.value));
        console.log('Element visible:', translateElement.offsetParent !== null);
      }
      
      if (translateWidget) {
        console.log('Widget visible:', translateWidget.offsetParent !== null);
        console.log('Widget position:', translateWidget.style.position);
        console.log('Widget z-index:', translateWidget.style.zIndex);
      }
    } else {
      console.log('⏳ Google Translate not yet loaded, waiting...');
      
      const checkInterval = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkInterval);
          checkGoogleTranslate();
        }
      }, 1000);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        console.log('❌ Google Translate failed to load within 10 seconds');
      }, 10000);
    }
  }
  
  // Check page translation status
  function checkPageLanguage() {
    console.log('🔍 Checking page language status...');
    console.log('HTML lang attribute:', document.documentElement.lang);
    console.log('Document title:', document.title);
    
    const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                        document.documentElement.classList.contains('translated-rtl');
    console.log('Is translated:', isTranslated);
    
    if (isTranslated) {
      const translatedClasses = Array.from(document.documentElement.classList)
        .filter(cls => cls.startsWith('translated'));
      console.log('Translation classes:', translatedClasses);
    }
  }
  
  // Test manual translation
  function testManualTranslation(targetLang = 'en') {
    console.log('🧪 Testing manual translation to:', targetLang);
    
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement && selectElement.options.length > 1) {
      console.log('✅ Translate element available for testing');
      console.log('Current value:', selectElement.value);
      console.log('Target value:', targetLang);
      
      if (selectElement.value !== targetLang) {
        selectElement.value = targetLang;
        selectElement.dispatchEvent(new Event('change'));
        console.log('🔄 Translation triggered to:', targetLang);
        
        setTimeout(() => {
          const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                              document.documentElement.classList.contains('translated-rtl');
          console.log('Translation result:', isTranslated ? '✅ Success' : '❌ Failed');
        }, 2000);
      } else {
        console.log('ℹ️ Already translated to:', targetLang);
      }
    } else {
      console.log('❌ Translate element not available for testing');
    }
  }
  
  // Performance check
  function checkPerformance() {
    console.log('⚡ Checking translation performance...');
    
    const startTime = performance.now();
    
    // Check if translation is fast
    const translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      console.log('Translation load time:', loadTime.toFixed(2), 'ms');
      
      if (loadTime < 1000) {
        console.log('✅ Translation loads quickly');
      } else {
        console.log('⚠️ Translation loads slowly');
      }
    }
  }
  
  // Run comprehensive debug checks
  function runDebugChecks() {
    console.log('🚀 Running comprehensive translation debug checks...');
    console.log('='.repeat(50));
    
    checkGoogleTranslate();
    console.log('-'.repeat(30));
    checkPageLanguage();
    console.log('-'.repeat(30));
    checkPerformance();
    console.log('-'.repeat(30));
    
    console.log('='.repeat(50));
    console.log('✅ Debug checks completed');
  }
  
  // Auto-run checks with delay
  setTimeout(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runDebugChecks);
    } else {
      runDebugChecks();
    }
  }, 2000);
  
  // Export enhanced debug functions
  window.debugTranslation = {
    runDebugChecks,
    checkGoogleTranslate,
    checkPageLanguage,
    testManualTranslation,
    checkPerformance,
    browserLang,
    primaryLang,
    isDutch,
    isSupported,
    shouldAutoTranslate
  };
  
  console.log('🔧 Enhanced debug functions available at window.debugTranslation');
})();
