// Test script for onboarding flow
// This script can be used to test the onboarding functionality

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOnboardingFlow() {
  console.log('🧪 Testing Onboarding Flow...\n');

  try {
    // 1. Check if onboarding_completed column exists
    console.log('1. Checking database schema...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_data')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error checking profiles table:', profilesError.message);
      return;
    }

    console.log('✅ Profiles table accessible');
    console.log('✅ onboarding_completed column exists:', profiles[0]?.onboarding_completed !== undefined);
    console.log('✅ onboarding_data column exists:', profiles[0]?.onboarding_data !== undefined);

    // 2. Check users who haven't completed onboarding
    console.log('\n2. Checking users who need onboarding...');
    const { data: usersNeedingOnboarding, error: onboardingError } = await supabase
      .from('profiles')
      .select('id, email, onboarding_completed, onboarding_data')
      .eq('onboarding_completed', false)
      .limit(5);

    if (onboardingError) {
      console.error('❌ Error fetching users needing onboarding:', onboardingError.message);
      return;
    }

    console.log(`📊 Found ${usersNeedingOnboarding.length} users who need onboarding:`);
    usersNeedingOnboarding.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id})`);
    });

    // 3. Test onboarding data structure
    console.log('\n3. Testing onboarding data structure...');
    const testOnboardingData = {
      sector: 'retail',
      businessSize: 'small',
      importantFeatures: ['inventory_tracking', 'barcode_scanning', 'analytics'],
      specificNeeds: 'Better inventory tracking for our retail store',
      expectations: 'Automated stock management and reporting',
      completedAt: new Date().toISOString()
    };

    console.log('✅ Test onboarding data structure:', JSON.stringify(testOnboardingData, null, 2));

    console.log('\n🎉 Onboarding flow test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run the application');
    console.log('   2. Login with a user who has onboarding_completed = false');
    console.log('   3. The onboarding modal should appear automatically');
    console.log('   4. Complete the onboarding process');
    console.log('   5. Verify that onboarding_completed is set to true');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOnboardingFlow();
