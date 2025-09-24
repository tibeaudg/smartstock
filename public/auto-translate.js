/**
 * Auto-Translate Service
 * Automatische vertaling zonder code wijzigingen
 * Detecteert browser taal en vertaalt automatisch
 */

class AutoTranslate {
  constructor() {
    this.defaultLanguage = 'nl';
    this.supportedLanguages = [
      'en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 
      'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 
      'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'
    ];
    this.translationProvider = 'google'; // 'google', 'microsoft', 'yandex'
    this.autoDetect = true;
    this.cache = new Map();
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    this.isInitialized = true;
  }
  
  setup() {
    // Detect browser language
    const browserLang = this.detectBrowserLanguage();
    
    // Always add translation widget (for manual translation)
    this.addTranslationWidget();
    
    // Auto-translate only if not Dutch and language is supported
    if (browserLang && browserLang !== this.defaultLanguage && this.supportedLanguages.includes(browserLang)) {
      this.translatePage(browserLang);
    }
  }
  
  detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    const primaryLang = lang.split('-')[0];
    
    return this.supportedLanguages.includes(primaryLang) ? primaryLang : null;
  }
  
  translatePage(targetLang) {
    // Use Google Translate API
    this.loadGoogleTranslate(targetLang);
  }
  
  loadGoogleTranslate(targetLang) {
    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      this.activateTranslation(targetLang);
      return;
    }
    
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    // Set up callback
    window.googleTranslateElementInit = () => {
      this.activateTranslation(targetLang);
    };
  }
  
  activateTranslation(targetLang) {
    console.log('🔄 Activating translation to:', targetLang);
    
    // Wait for Google Translate to be ready
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        console.log('✅ Google Translate element found');
        console.log('Current value:', selectElement.value);
        console.log('Target value:', targetLang);
        
        if (selectElement.value !== targetLang) {
          selectElement.value = targetLang;
          selectElement.dispatchEvent(new Event('change'));
          console.log('🔄 Translation activated to:', targetLang);
        } else {
          console.log('ℹ️ Already translated to:', targetLang);
        }
      } else {
        console.log('❌ Google Translate element not found');
        
        // Try alternative selectors
        const altSelectors = [
          '.goog-te-combo',
          'select.goog-te-combo',
          '#google_translate_element select',
          '.goog-te-combo select'
        ];
        
        for (const selector of altSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            console.log('✅ Found element with selector:', selector);
            element.value = targetLang;
            element.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    }, 3000);
  }
  
  addTranslationWidget() {
    // Create floating translation widget
    const widget = document.createElement('div');
    widget.id = 'auto-translate-widget';
    widget.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        font-size: 14px;
        min-width: 200px;
        max-width: 300px;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; color: #333;">
            🌐 Translate Page
          </div>
          <button id="hide-translate-widget" style="
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          " title="Hide translation widget">×</button>
        </div>
        <div id="google_translate_element"></div>
        <div style="margin-top: 8px; font-size: 12px; color: #666;">
          Browser language: ${this.detectBrowserLanguage() || 'Dutch'} | 
          <span style="color: ${this.detectBrowserLanguage() && this.detectBrowserLanguage() !== 'nl' ? '#28a745' : '#6c757d'}">
            ${this.detectBrowserLanguage() && this.detectBrowserLanguage() !== 'nl' ? 'Auto-translate enabled' : 'Manual translation available'}
          </span>
        </div>
        <div style="margin-top: 8px; font-size: 11px; color: #999;">
          <button id="show-translate-widget" style="
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            color: #666;
            display: none;
          ">Show Translation</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    // Add hide/show functionality
    this.addHideShowFunctionality();
    
    // Initialize Google Translate widget
    if (window.google && window.google.translate) {
      new google.translate.TranslateElement({
        pageLanguage: this.defaultLanguage,
        includedLanguages: this.supportedLanguages.join(','),
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
  }
  
  addHideShowFunctionality() {
    // Hide widget functionality
    const hideButton = document.getElementById('hide-translate-widget');
    const showButton = document.getElementById('show-translate-widget');
    const widget = document.getElementById('auto-translate-widget');
    
    if (hideButton) {
      hideButton.addEventListener('click', () => {
        // Hide the main widget content
        const widgetContent = widget.querySelector('div');
        if (widgetContent) {
          widgetContent.style.display = 'none';
        }
        
        // Show the show button
        if (showButton) {
          showButton.style.display = 'block';
        }
        
        // Store preference in localStorage
        localStorage.setItem('translate-widget-hidden', 'true');
      });
    }
    
    if (showButton) {
      showButton.addEventListener('click', () => {
        // Show the main widget content
        const widgetContent = widget.querySelector('div');
        if (widgetContent) {
          widgetContent.style.display = 'block';
        }
        
        // Hide the show button
        showButton.style.display = 'none';
        
        // Remove preference from localStorage
        localStorage.removeItem('translate-widget-hidden');
      });
    }
    
    // Check if widget was previously hidden
    if (localStorage.getItem('translate-widget-hidden') === 'true') {
      const widgetContent = widget.querySelector('div');
      if (widgetContent) {
        widgetContent.style.display = 'none';
      }
      if (showButton) {
        showButton.style.display = 'block';
      }
    }
  }
  
  // Method to manually translate to specific language
  translateTo(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.translatePage(lang);
    }
  }
  
  // Method to get current language
  getCurrentLanguage() {
    return document.documentElement.lang || this.defaultLanguage;
  }
  
  // Method to detect if page is translated
  isTranslated() {
    return document.documentElement.classList.contains('translated-ltr') || 
           document.documentElement.classList.contains('translated-rtl');
  }
}

// Initialize auto-translate when script loads
const autoTranslate = new AutoTranslate();

// Export for global access
window.AutoTranslate = autoTranslate;
