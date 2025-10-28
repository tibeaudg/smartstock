// Quick Pricing Calculation Test Script
// Run: node test-pricing-calculations.js

console.log('🧪 Testing Usage-Based Pricing Calculations\n');

const testCases = [
  { products: 0, expected: 0, tier: 'free', description: 'No products' },
  { products: 50, expected: 0, tier: 'free', description: 'Within free limit' },
  { products: 100, expected: 0, tier: 'free', description: 'At free limit' },
  { products: 101, expected: 0.008, tier: 'business', description: 'First billable product' },
  { products: 200, expected: 0.80, tier: 'business', description: '100 billable products' },
  { products: 500, expected: 3.20, tier: 'business', description: '400 billable products' },
  { products: 1000, expected: 7.20, tier: 'business', description: '900 billable products' },
  { products: 5000, expected: 39.20, tier: 'business', description: '4900 billable products' },
  { products: 9500, expected: 75.20, tier: 'business', description: 'Approaching enterprise limit' },
  { products: 9999, expected: 79.192, tier: 'business', description: 'At business limit' },
  { products: 10000, expected: 0, tier: 'enterprise', description: 'Enterprise threshold' },
  { products: 15000, expected: 0, tier: 'enterprise', description: 'Enterprise tier' },
];

let passedCount = 0;
let failedCount = 0;

testCases.forEach(({ products, expected, tier, description }, index) => {
  const FREE_PRODUCTS = 100;
  const PRICE_PER_PRODUCT = 0.008;
  
  // Calculate cost
  const billableProducts = Math.max(0, products - FREE_PRODUCTS);
  const cost = tier === 'enterprise' ? 0 : billableProducts * PRICE_PER_PRODUCT;
  const actualTier = products <= 100 ? 'free' : products >= 10000 ? 'enterprise' : 'business';
  
  // Check calculations
  const costMatches = Math.abs(cost - expected) < 0.001;
  const tierMatches = actualTier === tier;
  
  const testPassed = costMatches && tierMatches;
  
  if (testPassed) {
    console.log(`✅ ${index + 1}. ${description}`);
    console.log(`   Products: ${products} | Cost: €${cost.toFixed(3)} | Tier: ${tier}`);
    passedCount++;
  } else {
    console.log(`❌ ${index + 1}. ${description}`);
    console.log(`   Products: ${products} | Expected: €${expected} | Got: €${cost.toFixed(3)}`);
    console.log(`   Tier: Expected ${tier} | Got ${actualTier}`);
    failedCount++;
  }
  console.log('');
});

console.log(`\n📊 Test Summary`);
console.log(`Passed: ${passedCount}/${testCases.length}`);
console.log(`Failed: ${failedCount}/${testCases.length}`);

if (failedCount === 0) {
  console.log('\n🎉 All tests passed!');
} else {
  console.log('\n⚠️  Some tests failed. Please review the calculations.');
}

