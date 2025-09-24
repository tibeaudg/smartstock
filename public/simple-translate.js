/**
 * Simple Translation Solution
 * Een eenvoudige vertaling oplossing zonder complexe dependencies
 */

(function() {
  'use strict';
  
  console.log('🌐 Simple Translation Script Loaded');
  
  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const primaryLang = browserLang.split('-')[0];
  const supportedLanguages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'];
  
  console.log('🌐 Browser Language:', browserLang);
  console.log('🔤 Primary Language:', primaryLang);
  console.log('✅ Should Translate:', primaryLang !== 'nl' && supportedLanguages.includes(primaryLang));
  
  // Create floating flag button
  function createFloatingFlagButton() {
    const flagButton = document.createElement('div');
    flagButton.id = 'floating-flag-button';
    flagButton.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4285f4, #34a853);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        transition: all 0.3s ease;
        font-size: 24px;
        color: white;
        user-select: none;
      " title="Translate Page">
        🏳️
      </div>
    `;
    
    document.body.appendChild(flagButton);
    
    // Add hover effect
    const flagElement = flagButton.querySelector('div');
    flagElement.addEventListener('mouseenter', () => {
      flagElement.style.transform = 'scale(1.1)';
      flagElement.style.boxShadow = '0 6px 16px rgba(66, 133, 244, 0.4)';
    });
    
    flagElement.addEventListener('mouseleave', () => {
      flagElement.style.transform = 'scale(1)';
      flagElement.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
    });
    
    // Add click event
    flagElement.addEventListener('click', () => {
      createTranslationModal();
    });
  }
  
  // Create translation modal
  function createTranslationModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('translation-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'translation-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 90%;
          position: relative;
          animation: slideIn 0.3s ease-out;
        ">
          <button id="close-modal" style="
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
          " title="Close">×</button>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 20px; display: flex; align-items: center; gap: 8px;">
              🌐 Translate Page
            </h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              Select your preferred language to translate this page
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #333; font-weight: 500;">
              Choose Language:
            </label>
            <select id="modal-language-selector" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e1e5e9;
              border-radius: 8px;
              font-size: 16px;
              background: #fff;
              cursor: pointer;
              transition: border-color 0.2s;
            ">
              <option value="nl">🇳🇱 Nederlands</option>
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="ko">🇰🇷 한국어</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ar">🇸🇦 العربية</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="pl">🇵🇱 Polski</option>
              <option value="sv">🇸🇪 Svenska</option>
              <option value="da">🇩🇰 Dansk</option>
              <option value="no">🇳🇴 Norsk</option>
              <option value="fi">🇫🇮 Suomi</option>
              <option value="cs">🇨🇿 Čeština</option>
              <option value="hu">🇭🇺 Magyar</option>
              <option value="ro">🇷🇴 Română</option>
              <option value="bg">🇧🇬 Български</option>
              <option value="hr">🇭🇷 Hrvatski</option>
              <option value="sk">🇸🇰 Slovenčina</option>
              <option value="sl">🇸🇮 Slovenščina</option>
              <option value="et">🇪🇪 Eesti</option>
              <option value="lv">🇱🇻 Latviešu</option>
              <option value="lt">🇱🇹 Lietuvių</option>
              <option value="mt">🇲🇹 Malti</option>
              <option value="cy">🇬🇧 Cymraeg</option>
              <option value="ga">🇮🇪 Gaeilge</option>
              <option value="is">🇮🇸 Íslenska</option>
              <option value="lb">🇱🇺 Lëtzebuergesch</option>
              <option value="eu">🇪🇸 Euskera</option>
              <option value="ca">🇪🇸 Català</option>
              <option value="gl">🇪🇸 Galego</option>
            </select>
          </div>
          
          <div style="margin-bottom: 16px;">
            <button id="modal-translate-button" style="
              width: 100%;
              padding: 14px;
              background: linear-gradient(135deg, #4285f4, #34a853);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
            ">Translate Page</button>
          </div>
          
          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
            text-align: center;
            border-left: 4px solid #4285f4;
          ">
            <strong>Browser:</strong> ${primaryLang} | 
            <span style="color: ${primaryLang !== 'nl' && supportedLanguages.includes(primaryLang) ? '#28a745' : '#6c757d'}">
              ${primaryLang !== 'nl' && supportedLanguages.includes(primaryLang) ? 'Auto-translate available' : 'Manual translation'}
            </span>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        #modal-language-selector:focus {
          border-color: #4285f4;
          outline: none;
          box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
        }
        
        #modal-translate-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
        }
        
        #close-modal:hover {
          background-color: #f0f0f0;
        }
      </style>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    addModalEventListeners();
  }
  
  // Create simple translation widget (legacy function for compatibility)
  function createTranslationWidget() {
    createFloatingFlagButton();
  }
  
  function addWidgetEventListeners() {
    const hideButton = document.getElementById('hide-simple-widget');
    const showButton = document.getElementById('show-simple-widget');
    const translateButton = document.getElementById('translate-button');
    const languageSelector = document.getElementById('language-selector');
    const widget = document.getElementById('simple-translate-widget');
    
    // Hide widget
    if (hideButton) {
      hideButton.addEventListener('click', () => {
        const widgetContent = widget.querySelector('div');
        if (widgetContent) {
          widgetContent.style.display = 'none';
        }
        if (showButton) {
          showButton.style.display = 'block';
        }
        localStorage.setItem('simple-widget-hidden', 'true');
      });
    }
    
    // Show widget
    if (showButton) {
      showButton.addEventListener('click', () => {
        const widgetContent = widget.querySelector('div');
        if (widgetContent) {
          widgetContent.style.display = 'block';
        }
        showButton.style.display = 'none';
        localStorage.removeItem('simple-widget-hidden');
      });
    }
    
    // Translate button
    if (translateButton) {
      translateButton.addEventListener('click', () => {
        const selectedLang = languageSelector.value;
        console.log('🔄 Translating to:', selectedLang);
        
        // Check if we're on localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
          // For localhost, show a message instead of redirecting
          alert(`🌐 Translation not available on localhost.\n\nTo test translation:\n1. Deploy to production\n2. Or use a public URL\n\nSelected language: ${selectedLang}`);
        } else {
          // Use Google Translate for production
          const translateUrl = `https://translate.google.com/translate?sl=nl&tl=${selectedLang}&u=${encodeURIComponent(window.location.href)}`;
          window.open(translateUrl, '_blank');
        }
      });
    }
    
    // Check if widget was previously hidden
    if (localStorage.getItem('simple-widget-hidden') === 'true') {
      const widgetContent = widget.querySelector('div');
      if (widgetContent) {
        widgetContent.style.display = 'none';
      }
      if (showButton) {
        showButton.style.display = 'block';
      }
    }
  }
  
  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Auto-translate if needed (but not on localhost)
  if (primaryLang !== 'nl' && supportedLanguages.includes(primaryLang) && !isLocalhost) {
    console.log('🔄 Auto-translating to:', primaryLang);
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const translateUrl = `https://translate.google.com/translate?sl=nl&tl=${primaryLang}&u=${encodeURIComponent(window.location.href)}`;
          window.location.href = translateUrl;
        }, 2000);
      });
    } else {
      setTimeout(() => {
        const translateUrl = `https://translate.google.com/translate?sl=nl&tl=${primaryLang}&u=${encodeURIComponent(window.location.href)}`;
        window.location.href = translateUrl;
      }, 2000);
    }
  } else {
    console.log('🇳🇱 Dutch browser detected or localhost, showing manual translation widget');
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createTranslationWidget);
    } else {
      createTranslationWidget();
    }
  }
  
  // Export for manual use
  window.simpleTranslate = {
    createWidget: createTranslationWidget,
    translateTo: (lang) => {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        alert(`🌐 Translation not available on localhost.\n\nSelected language: ${lang}`);
      } else {
        const translateUrl = `https://translate.google.com/translate?sl=nl&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
        window.open(translateUrl, '_blank');
      }
    }
  };
  
  console.log('🔧 Simple translate functions available at window.simpleTranslate');
})();
