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
  
  // Enhanced quick test function for localhost debugging
  function quickTest() {
    console.log('🧪 Enhanced Translation Test');
    console.log('='.repeat(50));
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Check environment
    console.log('🌍 Environment Check:');
    console.log('  Hostname:', window.location.hostname);
    console.log('  Protocol:', window.location.protocol);
    console.log('  Is Localhost:', isLocalhost);
    
    // Check CSS loading
    const stylesheets = Array.from(document.styleSheets);
    console.log('📄 CSS Status:');
    console.log('  Total stylesheets:', stylesheets.length);
    console.log('  Vite CSS loaded:', stylesheets.some(sheet => sheet.href && sheet.href.includes('vite')));
    
    // Check translation widget elements
    console.log('🔍 Widget Elements:');
    const widget = document.getElementById('google_translate_element');
    const selector = document.getElementById('localhost-language-selector');
    const button = document.getElementById('localhost-translate-button');
    
    console.log('  Widget Element:', !!widget);
    console.log('  Widget Visible:', widget && widget.offsetParent !== null);
    console.log('  Widget Content Length:', widget ? widget.innerHTML.length : 0);
    console.log('  Selector Element:', !!selector);
    console.log('  Button Element:', !!button);
    
    if (widget) {
      console.log('  Widget Position:', widget.style.position);
      console.log('  Widget Z-index:', widget.style.zIndex);
      console.log('  Widget Display:', widget.style.display);
    }
    
    if (selector) {
      console.log('  Selected Language:', selector.value);
      console.log('  Available Languages:', Array.from(selector.options).length);
      console.log('  Selector Visible:', selector.offsetParent !== null);
    }
    
    if (button) {
      console.log('  Button Visible:', button.offsetParent !== null);
      console.log('  Button Text:', button.textContent);
    }
    
    // Test functionality
    console.log('🧪 Functionality Test:');
    if (button && selector) {
      console.log('  Button Click Test: Click the button to test');
      console.log('  Language Change Test: Change selector to test');
      
      // Add temporary test listener
      const testListener = () => {
        console.log('✅ Button click detected!');
        console.log('Selected language:', selector.value);
        console.log('Expected URL:', `https://translate.google.com/translate?sl=nl&tl=${selector.value}&u=${encodeURIComponent(window.location.href)}`);
      };
      
      button.addEventListener('click', testListener);
      console.log('  Test listener added (will be removed after first click)');
      
      // Remove listener after 30 seconds
      setTimeout(() => {
        button.removeEventListener('click', testListener);
        console.log('  Test listener removed');
      }, 30000);
    }
    
    // Check for errors
    console.log('❌ Error Check:');
    const consoleErrors = [];
    const originalError = console.error;
    console.error = function(...args) {
      consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    setTimeout(() => {
      console.error = originalError;
      if (consoleErrors.length > 0) {
        console.log('  Recent errors:', consoleErrors.slice(-3));
      } else {
        console.log('  No recent errors detected');
      }
    }, 1000);
    
    console.log('='.repeat(50));
    console.log('🎯 Test completed - check results above');
    console.log('💡 Try clicking the "Translate Page" button to test functionality');
  }
  
  // Simple test function for immediate testing
  function testTranslation() {
    console.log('🚀 Testing Translation Functionality...');
    
    const button = document.getElementById('localhost-translate-button');
    const selector = document.getElementById('localhost-language-selector');
    
    if (!button || !selector) {
      console.error('❌ Translation elements not found!');
      console.log('Button found:', !!button);
      console.log('Selector found:', !!selector);
      return;
    }
    
    console.log('✅ Translation elements found');
    console.log('Selected language:', selector.value);
    
    // Simulate button click
    console.log('🔄 Simulating button click...');
    button.click();
    
    // Also test with different language
    if (selector.value === 'nl') {
      console.log('🔄 Testing with English...');
      selector.value = 'en';
      selector.dispatchEvent(new Event('change'));
      button.click();
    }
  }
  
  // Force widget visibility function
  function forceWidgetVisibility() {
    console.log('🔧 Forcing widget visibility...');
    
    const widget = document.getElementById('google_translate_element');
    if (!widget) {
      console.error('❌ Widget not found!');
      return;
    }
    
    // Force visibility with all possible CSS properties
    const styles = {
      'display': 'block',
      'visibility': 'visible',
      'opacity': '1',
      'position': 'fixed',
      'bottom': '20px',
      'right': '20px',
      'z-index': '9999',
      'width': 'auto',
      'height': 'auto',
      'min-width': '240px',
      'max-width': '320px'
    };
    
    Object.entries(styles).forEach(([prop, value]) => {
      widget.style.setProperty(prop, value, 'important');
    });
    
    // Also check for parent elements that might be hidden
    let parent = widget.parentElement;
    while (parent && parent !== document.body) {
      if (parent.style.display === 'none' || parent.style.visibility === 'hidden') {
        console.log('🔧 Found hidden parent, making visible:', parent);
        parent.style.setProperty('display', 'block', 'important');
        parent.style.setProperty('visibility', 'visible', 'important');
      }
      parent = parent.parentElement;
    }
    
    console.log('✅ Widget visibility forced');
    console.log('Widget visible:', widget.offsetParent !== null);
    console.log('Widget computed styles:', {
      display: getComputedStyle(widget).display,
      visibility: getComputedStyle(widget).visibility,
      opacity: getComputedStyle(widget).opacity,
      position: getComputedStyle(widget).position,
      zIndex: getComputedStyle(widget).zIndex
    });
  }
  
  // Export enhanced debug functions
  window.debugTranslation = {
    runDebugChecks,
    checkGoogleTranslate,
    checkPageLanguage,
    testManualTranslation,
    checkPerformance,
    quickTest,
    testTranslation,
    forceWidgetVisibility,
    browserLang,
    primaryLang,
    isDutch,
    isSupported,
    shouldAutoTranslate
  };
  
  // Also add simple test functions to global scope
  window.testTranslation = testTranslation;
  window.forceWidgetVisibility = forceWidgetVisibility;
  
  console.log('🔧 Enhanced debug functions available at window.debugTranslation');
  console.log('💡 Quick test: window.debugTranslation.quickTest()');
  console.log('🚀 Function test: window.testTranslation()');
  console.log('🔧 Force visibility: window.forceWidgetVisibility()');
})();
