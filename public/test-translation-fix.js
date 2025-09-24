/**
 * Test Translation Fix Script
 * Test of de vertaling correct werkt
 */

(function() {
  'use strict';
  
  console.log('🧪 Testing Translation Fix...');
  
  // Test 1: Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  console.log('1️⃣ Browser Language:', browserLang);
  
  // Test 2: Check if page is translated
  function checkIfTranslated() {
    const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                        document.documentElement.classList.contains('translated-rtl');
    console.log('2️⃣ Page is translated:', isTranslated);
    return isTranslated;
  }
  
  // Test 3: Check Google Translate elements
  function checkGoogleTranslateElements() {
    const elements = [
      { selector: '.goog-te-combo', name: 'Google Translate Combo' },
      { selector: '#google_translate_element', name: 'Google Translate Element' },
      { selector: '.goog-te-banner-frame', name: 'Google Translate Banner' },
      { selector: '.goog-te-menu-frame', name: 'Google Translate Menu' }
    ];
    
    console.log('3️⃣ Google Translate Elements:');
    elements.forEach(element => {
      const found = document.querySelector(element.selector);
      console.log(`   ${element.name}:`, !!found);
      if (found) {
        console.log(`   - Visible:`, found.offsetParent !== null);
        console.log(`   - Value:`, found.value || 'N/A');
      }
    });
  }
  
  // Test 4: Check page content language
  function checkPageContent() {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content;
    const htmlLang = document.documentElement.lang;
    
    console.log('4️⃣ Page Content:');
    console.log('   Title:', title);
    console.log('   Description:', description);
    console.log('   HTML Lang:', htmlLang);
    
    // Check if content is in Dutch
    const dutchWords = ['voorraad', 'beheer', 'gratis', 'snel', 'eenvoudig'];
    const englishWords = ['inventory', 'management', 'free', 'fast', 'easy'];
    
    const hasDutch = dutchWords.some(word => title.toLowerCase().includes(word) || description.toLowerCase().includes(word));
    const hasEnglish = englishWords.some(word => title.toLowerCase().includes(word) || description.toLowerCase().includes(word));
    
    console.log('   Has Dutch words:', hasDutch);
    console.log('   Has English words:', hasEnglish);
  }
  
  // Test 5: Manual translation test
  function testManualTranslation() {
    console.log('5️⃣ Testing Manual Translation...');
    
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      console.log('   Google Translate element found');
      console.log('   Current value:', selectElement.value);
      console.log('   Available options:', Array.from(selectElement.options).map(opt => opt.value));
      
      // Test translation to English
      if (selectElement.value !== 'en') {
        console.log('   Testing translation to English...');
        selectElement.value = 'en';
        selectElement.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          console.log('   Translation result:', checkIfTranslated());
        }, 2000);
      }
    } else {
      console.log('   ❌ Google Translate element not found');
    }
  }
  
  // Run all tests
  function runAllTests() {
    console.log('🚀 Running Translation Tests...');
    checkIfTranslated();
    checkGoogleTranslateElements();
    checkPageContent();
    testManualTranslation();
    
    console.log('✅ All tests completed');
  }
  
  // Auto-run tests
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }
  
  // Export for manual testing
  window.testTranslationFix = {
    runAllTests,
    checkIfTranslated,
    checkGoogleTranslateElements,
    checkPageContent,
    testManualTranslation
  };
  
  console.log('🔧 Test functions available at window.testTranslationFix');
})();
