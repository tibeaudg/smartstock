/**
 * Debug script voor vertaling troubleshooting
 * Helpt bij het identificeren van problemen met automatische vertaling
 */

(function() {
  'use strict';
  
  console.log('🔍 Translation Debug Script Loaded');
  
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  console.log('🌐 Browser Language:', browserLang);
  
  // Check if Dutch
  const isDutch = browserLang.startsWith('nl');
  console.log('🇳🇱 Is Dutch:', isDutch);
  
  // Check supported languages
  const supportedLanguages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'];
  const primaryLang = browserLang.split('-')[0];
  const isSupported = supportedLanguages.includes(primaryLang);
  
  console.log('🔤 Primary Language:', primaryLang);
  console.log('✅ Is Supported:', isSupported);
  console.log('🔄 Should Auto-translate:', !isDutch && isSupported);
  
  // Check Google Translate availability
  function checkGoogleTranslate() {
    console.log('🔍 Checking Google Translate...');
    console.log('Google object:', !!window.google);
    console.log('Google Translate:', !!window.google?.translate);
    
    if (window.google && window.google.translate) {
      console.log('✅ Google Translate is loaded');
      
      // Check for translate element
      const translateElement = document.querySelector('.goog-te-combo');
      console.log('Translate element found:', !!translateElement);
      
      if (translateElement) {
        console.log('Current language:', translateElement.value);
        console.log('Available options:', Array.from(translateElement.options).map(opt => opt.value));
      }
    } else {
      console.log('⏳ Google Translate not yet loaded, waiting...');
      
      // Wait for Google Translate
      const checkInterval = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkInterval);
          checkGoogleTranslate();
        }
      }, 1000);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.log('❌ Google Translate failed to load within 10 seconds');
      }, 10000);
    }
  }
  
  // Check translation widgets
  function checkWidgets() {
    console.log('🔍 Checking translation widgets...');
    
    const widgets = [
      { id: 'google_translate_element', name: 'Google Translate Widget' },
      { id: 'auto-translate-widget', name: 'Auto Translate Widget' },
      { selector: '.gtranslate_wrapper', name: 'GTranslate Widget' }
    ];
    
    widgets.forEach(widget => {
      let element;
      if (widget.id) {
        element = document.getElementById(widget.id);
      } else if (widget.selector) {
        element = document.querySelector(widget.selector);
      }
      
      console.log(`${widget.name}:`, !!element);
      if (element) {
        console.log(`  - Visible:`, element.offsetParent !== null);
        console.log(`  - Position:`, element.style.position);
        console.log(`  - Z-index:`, element.style.zIndex);
      }
    });
  }
  
  // Check page language
  function checkPageLanguage() {
    console.log('🔍 Checking page language...');
    console.log('HTML lang attribute:', document.documentElement.lang);
    console.log('Document title:', document.title);
    console.log('Is translated:', document.documentElement.classList.contains('translated-ltr') || 
                document.documentElement.classList.contains('translated-rtl'));
  }
  
  // Run all checks
  function runDebugChecks() {
    console.log('🚀 Running translation debug checks...');
    checkGoogleTranslate();
    checkWidgets();
    checkPageLanguage();
    
    // Test manual translation
    console.log('🧪 Testing manual translation...');
    if (window.AutoTranslate) {
      console.log('AutoTranslate available:', !!window.AutoTranslate);
      console.log('Current language:', window.AutoTranslate.getCurrentLanguage());
      console.log('Is translated:', window.AutoTranslate.isTranslated());
    }
  }
  
  // Auto-run checks
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDebugChecks);
  } else {
    runDebugChecks();
  }
  
  // Export debug functions
  window.debugTranslation = {
    runDebugChecks,
    checkGoogleTranslate,
    checkWidgets,
    checkPageLanguage,
    browserLang,
    isDutch,
    isSupported,
    primaryLang
  };
  
  console.log('🔧 Debug functions available at window.debugTranslation');
})();
