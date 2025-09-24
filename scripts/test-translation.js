/**
 * Test script voor automatische vertaling
 * Test verschillende talen en functionaliteit
 */

// Test verschillende browser talen
const testLanguages = [
  'en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'pt-PT', 'ru-RU',
  'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'tr-TR', 'pl-PL', 'sv-SE'
];

// Simuleer verschillende browser talen
function testLanguageDetection() {
  console.log('🧪 Testing language detection...');
  
  // Test huidige browser taal
  const currentLang = navigator.language || navigator.userLanguage;
  console.log(`Current browser language: ${currentLang}`);
  
  // Test verschillende talen zonder navigator te wijzigen
  testLanguages.forEach(lang => {
    console.log(`Testing with language: ${lang}`);
    
    // Test de detectie logica
    const detectedLang = lang.split('-')[0];
    console.log(`Detected language: ${detectedLang}`);
    
    // Test of taal ondersteund wordt
    const supportedLanguages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'];
    const isSupported = supportedLanguages.includes(detectedLang);
    console.log(`Is supported: ${isSupported}`);
    console.log(`Should auto-translate: ${detectedLang !== 'nl' && isSupported}`);
  });
}

// Test Google Translate widget
function testGoogleTranslate() {
  console.log('🧪 Testing Google Translate widget...');
  
  // Check if Google Translate is loaded
  if (window.google && window.google.translate) {
    console.log('✅ Google Translate is loaded');
    
    // Test widget creation
    const widget = document.createElement('div');
    widget.id = 'test-translate-widget';
    document.body.appendChild(widget);
    
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'nl',
        includedLanguages: 'en,fr,de,es,it,pt,ru,ja,ko,zh,ar,hi,tr,pl,sv,da,no,fi,cs,hu,ro,bg,hr,sk,sl,et,lv,lt,mt,cy,ga,is,lb,eu,ca,gl',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'test-translate-widget');
      
      console.log('✅ Google Translate widget created successfully');
    } catch (error) {
      console.error('❌ Error creating Google Translate widget:', error);
    }
  } else {
    console.log('⏳ Google Translate not yet loaded, waiting...');
    
    // Wait for Google Translate to load
    const checkInterval = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkInterval);
        testGoogleTranslate();
      }
    }, 1000);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('❌ Google Translate failed to load within 10 seconds');
    }, 10000);
  }
}

// Test auto-translate functionality
function testAutoTranslate() {
  console.log('🧪 Testing AutoTranslate functionality...');
  
  if (window.AutoTranslate) {
    console.log('✅ AutoTranslate is available');
    
    // Test language detection
    const detectedLang = window.AutoTranslate.detectBrowserLanguage();
    console.log(`Detected browser language: ${detectedLang}`);
    
    // Test translation methods
    console.log('Testing translation methods...');
    window.AutoTranslate.translateTo('en');
    window.AutoTranslate.translateTo('fr');
    window.AutoTranslate.translateTo('de');
    
    console.log('✅ AutoTranslate tests completed');
  } else {
    console.log('❌ AutoTranslate not available');
  }
}

// Test translation widget visibility
function testWidgetVisibility() {
  console.log('🧪 Testing translation widget visibility...');
  
  const widgets = [
    document.getElementById('google_translate_element'),
    document.getElementById('auto-translate-widget'),
    document.querySelector('.gtranslate_wrapper')
  ];
  
  widgets.forEach((widget, index) => {
    if (widget) {
      console.log(`✅ Widget ${index + 1} is visible:`, widget);
    } else {
      console.log(`❌ Widget ${index + 1} not found`);
    }
  });
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting translation tests...');
  
  testLanguageDetection();
  testGoogleTranslate();
  testAutoTranslate();
  testWidgetVisibility();
  
  console.log('✅ All translation tests completed');
}

// Export for use in browser console
window.testTranslation = {
  runAllTests,
  testLanguageDetection,
  testGoogleTranslate,
  testAutoTranslate,
  testWidgetVisibility
};

// Auto-run tests if in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected, running translation tests...');
  setTimeout(runAllTests, 2000);
}
