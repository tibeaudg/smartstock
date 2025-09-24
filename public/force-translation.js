/**
 * Force Translation Script
 * Zorgt ervoor dat de pagina direct wordt vertaald zonder wachten
 */

(function() {
  'use strict';
  
  console.log('🚀 Force Translation Script Loaded');
  
  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const primaryLang = browserLang.split('-')[0];
  const supportedLanguages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'];
  
  console.log('🌐 Browser Language:', browserLang);
  console.log('🔤 Primary Language:', primaryLang);
  console.log('✅ Should Translate:', primaryLang !== 'nl' && supportedLanguages.includes(primaryLang));
  
  // Force translation function
  function forceTranslation(targetLang) {
    console.log('🔄 Forcing translation to:', targetLang);
    
    // Method 1: Direct Google Translate API call
    if (window.google && window.google.translate) {
      try {
        // Create a temporary iframe for translation
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://translate.google.com/translate?sl=nl&tl=${targetLang}&u=${encodeURIComponent(window.location.href)}`;
        iframe.crossOrigin = 'anonymous';
        document.body.appendChild(iframe);
        
        // Remove iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
        
        console.log('✅ Translation iframe created');
      } catch (error) {
        console.error('❌ Translation iframe failed:', error);
      }
    }
    
    // Method 2: Use Google Translate widget
    const translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
      console.log('🔄 Using Google Translate widget');
      translateElement.value = targetLang;
      translateElement.dispatchEvent(new Event('change'));
    }
    
    // Method 3: Direct page translation
    setTimeout(() => {
      const script = document.createElement('script');
      script.textContent = `
        if (window.google && window.google.translate) {
          try {
            const translateElement = document.querySelector('.goog-te-combo');
            if (translateElement && translateElement.value !== '${targetLang}') {
              translateElement.value = '${targetLang}';
              translateElement.dispatchEvent(new Event('change'));
              console.log('✅ Translation forced to: ${targetLang}');
            }
          } catch (error) {
            console.error('❌ Force translation failed:', error);
          }
        }
      `;
      document.head.appendChild(script);
    }, 2000);
  }
  
  // Auto-translate if needed
  if (primaryLang !== 'nl' && supportedLanguages.includes(primaryLang)) {
    console.log('🔄 Auto-translating to:', primaryLang);
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => forceTranslation(primaryLang), 1000);
      });
    } else {
      setTimeout(() => forceTranslation(primaryLang), 1000);
    }
  } else {
    console.log('🇳🇱 Dutch browser detected, no auto-translation needed');
  }
  
  // Export for manual use
  window.forceTranslation = forceTranslation;
  
  console.log('🔧 Force translation function available at window.forceTranslation');
})();
