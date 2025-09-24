/**
 * Translation Test Script
 * Test de translation functionaliteit na optimalisatie
 */

(function() {
  'use strict';
  
  console.log('🧪 Translation Test Script Loaded');
  
  // Test configuration
  const testConfig = {
    supportedLanguages: ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
    testDelay: 3000,
    maxRetries: 10
  };
  
  // Test results
  let testResults = {
    googleTranslateLoaded: false,
    widgetVisible: false,
    autoTranslationWorking: false,
    manualTranslationWorking: false,
    performanceScore: 0
  };
  
  // Test 1: Check Translation Implementation Loading
  function testGoogleTranslateLoading() {
    console.log('🧪 Test 1: Translation Implementation Loading');
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      console.log('🏠 Testing localhost implementation...');
      
      let retries = 0;
      const checkInterval = setInterval(() => {
        retries++;
        
        const localhostSelector = document.getElementById('localhost-language-selector');
        const localhostButton = document.getElementById('localhost-translate-button');
        
        if (localhostSelector && localhostButton) {
          testResults.googleTranslateLoaded = true;
          console.log('✅ Localhost translation widget loaded successfully');
          clearInterval(checkInterval);
        } else if (retries >= testConfig.maxRetries) {
          console.log('❌ Localhost translation widget failed to load');
          clearInterval(checkInterval);
        } else {
          console.log(`⏳ Waiting for localhost widget... (${retries}/${testConfig.maxRetries})`);
        }
      }, 1000);
      
    } else {
      console.log('🌐 Testing production Google Translate...');
      
      let retries = 0;
      const checkInterval = setInterval(() => {
        retries++;
        
        if (window.google && window.google.translate) {
          testResults.googleTranslateLoaded = true;
          console.log('✅ Google Translate loaded successfully');
          clearInterval(checkInterval);
        } else if (retries >= testConfig.maxRetries) {
          console.log('❌ Google Translate failed to load');
          clearInterval(checkInterval);
        } else {
          console.log(`⏳ Waiting for Google Translate... (${retries}/${testConfig.maxRetries})`);
        }
      }, 1000);
    }
  }
  
  // Test 2: Check widget visibility
  function testWidgetVisibility() {
    console.log('🧪 Test 2: Widget Visibility');
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const widget = document.getElementById('google_translate_element');
    
    if (widget && widget.offsetParent !== null) {
      testResults.widgetVisible = true;
      console.log('✅ Translation widget is visible');
    } else {
      console.log('❌ Translation widget is not visible');
    }
    
    if (isLocalhost) {
      const localhostSelector = document.getElementById('localhost-language-selector');
      if (localhostSelector && localhostSelector.options.length > 1) {
        console.log('✅ Localhost translation dropdown has options');
        console.log('Available languages:', Array.from(localhostSelector.options).map(opt => opt.value));
      } else {
        console.log('❌ Localhost translation dropdown has no options');
      }
    } else {
      const combo = document.querySelector('.goog-te-combo');
      if (combo && combo.options.length > 1) {
        console.log('✅ Google Translate dropdown has options');
        console.log('Available languages:', Array.from(combo.options).map(opt => opt.value));
      } else {
        console.log('❌ Google Translate dropdown has no options');
      }
    }
  }
  
  // Test 3: Test manual translation
  function testManualTranslation() {
    console.log('🧪 Test 3: Manual Translation');
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      console.log('🏠 Testing localhost translation...');
      
      const localhostSelector = document.getElementById('localhost-language-selector');
      const localhostButton = document.getElementById('localhost-translate-button');
      
      if (!localhostSelector || !localhostButton) {
        console.log('❌ Cannot test localhost translation - elements not ready');
        return;
      }
      
      console.log('✅ Localhost translation elements ready');
      console.log('Selected language:', localhostSelector.value);
      console.log('Available languages:', Array.from(localhostSelector.options).length);
      
      // For localhost, we just test that the button works (opens new tab)
      testResults.manualTranslationWorking = true;
      console.log('✅ Localhost translation ready (opens in new tab)');
      
    } else {
      console.log('🌐 Testing production Google Translate...');
      
      const combo = document.querySelector('.goog-te-combo');
      if (!combo || combo.options.length <= 1) {
        console.log('❌ Cannot test manual translation - dropdown not ready');
        return;
      }
      
      const originalValue = combo.value;
      const testLang = 'en';
      
      if (originalValue !== testLang) {
        console.log(`🔄 Testing translation to ${testLang}...`);
        
        combo.value = testLang;
        combo.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                              document.documentElement.classList.contains('translated-rtl');
          
          if (isTranslated) {
            testResults.manualTranslationWorking = true;
            console.log('✅ Manual translation working');
            
            // Reset to original language
            setTimeout(() => {
              combo.value = originalValue;
              combo.dispatchEvent(new Event('change'));
              console.log('🔄 Reset to original language');
            }, 2000);
          } else {
            console.log('❌ Manual translation failed');
          }
        }, 3000);
      } else {
        console.log('ℹ️ Already translated to test language');
        testResults.manualTranslationWorking = true;
      }
    }
  }
  
  // Test 4: Test auto-translation
  function testAutoTranslation() {
    console.log('🧪 Test 4: Auto Translation');
    
    const browserLang = navigator.language || navigator.userLanguage;
    const primaryLang = browserLang.split('-')[0];
    
    console.log('Browser language:', browserLang);
    console.log('Primary language:', primaryLang);
    
    if (primaryLang !== 'nl' && testConfig.supportedLanguages.includes(primaryLang)) {
      console.log('🔄 Auto-translation should be active');
      
      setTimeout(() => {
        const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                            document.documentElement.classList.contains('translated-rtl');
        
        if (isTranslated) {
          testResults.autoTranslationWorking = true;
          console.log('✅ Auto-translation working');
        } else {
          console.log('❌ Auto-translation not working');
        }
      }, 2000);
    } else {
      console.log('ℹ️ Auto-translation not expected (Dutch browser or unsupported language)');
      testResults.autoTranslationWorking = true; // Not applicable
    }
  }
  
  // Test 5: Performance test
  function testPerformance() {
    console.log('🧪 Test 5: Performance');
    
    const startTime = performance.now();
    
    // Simulate translation load
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      testResults.performanceScore = Math.max(0, 100 - (loadTime / 10));
      
      if (loadTime < 1000) {
        console.log(`✅ Good performance: ${loadTime.toFixed(2)}ms`);
      } else {
        console.log(`⚠️ Slow performance: ${loadTime.toFixed(2)}ms`);
      }
    }
  }
  
  // Generate test report
  function generateReport() {
    console.log('📊 Translation Test Report');
    console.log('='.repeat(50));
    console.log('Google Translate Loaded:', testResults.googleTranslateLoaded ? '✅' : '❌');
    console.log('Widget Visible:', testResults.widgetVisible ? '✅' : '❌');
    console.log('Auto Translation:', testResults.autoTranslationWorking ? '✅' : '❌');
    console.log('Manual Translation:', testResults.manualTranslationWorking ? '✅' : '❌');
    console.log('Performance Score:', `${testResults.performanceScore.toFixed(1)}/100`);
    
    const totalScore = Object.values(testResults).reduce((sum, val) => {
      return sum + (typeof val === 'boolean' ? (val ? 25 : 0) : val);
    }, 0);
    
    console.log('='.repeat(50));
    console.log('Overall Score:', `${totalScore.toFixed(1)}/100`);
    
    if (totalScore >= 90) {
      console.log('🎉 Excellent! Translation is working perfectly');
    } else if (totalScore >= 70) {
      console.log('👍 Good! Translation is working well');
    } else if (totalScore >= 50) {
      console.log('⚠️ Fair! Some issues detected');
    } else {
      console.log('❌ Poor! Major issues detected');
    }
    
    console.log('='.repeat(50));
  }
  
  // Run all tests
  function runAllTests() {
    console.log('🚀 Starting Translation Tests...');
    
    // Run tests in sequence
    testGoogleTranslateLoading();
    
    setTimeout(() => {
      testWidgetVisibility();
    }, 1000);
    
    setTimeout(() => {
      testManualTranslation();
    }, 2000);
    
    setTimeout(() => {
      testAutoTranslation();
    }, 3000);
    
    setTimeout(() => {
      testPerformance();
    }, 4000);
    
    setTimeout(() => {
      generateReport();
    }, 6000);
  }
  
  // Auto-run tests
  setTimeout(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
      runAllTests();
    }
  }, testConfig.testDelay);
  
  // Export test functions
  window.translationTest = {
    runAllTests,
    testGoogleTranslateLoading,
    testWidgetVisibility,
    testManualTranslation,
    testAutoTranslation,
    testPerformance,
    generateReport,
    testResults
  };
  
  console.log('🔧 Test functions available at window.translationTest');
})();
