// Test script for admin onboarding tracking
// This script tests the admin onboarding tracking functionality

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminOnboardingTracking() {
  console.log('🧪 Testing Admin Onboarding Tracking...\n');

  try {
    // 1. Check if onboarding_responses table exists
    console.log('1. Checking onboarding_responses table...');
    const { data: responses, error: responsesError } = await supabase
      .from('onboarding_responses')
      .select('*')
      .limit(1);

    if (responsesError) {
      console.error('❌ Error checking onboarding_responses table:', responsesError.message);
      return;
    }

    console.log('✅ onboarding_responses table accessible');

    // 2. Check if we can fetch onboarding responses with user data
    console.log('\n2. Testing onboarding responses query...');
    const { data: fullResponses, error: fullError } = await supabase
      .from('onboarding_responses')
      .select(`
        *,
        profiles!onboarding_responses_profile_id_fkey (
          email,
          first_name,
          last_name
        )
      `)
      .limit(5);

    if (fullError) {
      console.error('❌ Error fetching full onboarding responses:', fullError.message);
      return;
    }

    console.log(`✅ Found ${fullResponses.length} onboarding responses`);
    fullResponses.forEach(response => {
      console.log(`   - ${response.profiles?.email} (${response.sector}, ${response.business_size})`);
    });

    // 3. Test statistics calculation
    console.log('\n3. Testing statistics calculation...');
    const { data: allResponses, error: statsError } = await supabase
      .from('onboarding_responses')
      .select('*');

    if (statsError) {
      console.error('❌ Error fetching all responses for stats:', statsError.message);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const completedToday = allResponses.filter(r => new Date(r.completed_at) >= today).length;
    const completedThisWeek = allResponses.filter(r => new Date(r.completed_at) >= weekAgo).length;
    const completedThisMonth = allResponses.filter(r => new Date(r.completed_at) >= monthAgo).length;

    console.log('✅ Statistics calculated:');
    console.log(`   - Total responses: ${allResponses.length}`);
    console.log(`   - Completed today: ${completedToday}`);
    console.log(`   - Completed this week: ${completedThisWeek}`);
    console.log(`   - Completed this month: ${completedThisMonth}`);

    // 4. Test sector breakdown
    console.log('\n4. Testing sector breakdown...');
    const sectorBreakdown = allResponses.reduce((acc, r) => {
      acc[r.sector] = (acc[r.sector] || 0) + 1;
      return acc;
    }, {});

    console.log('✅ Sector breakdown:');
    Object.entries(sectorBreakdown).forEach(([sector, count]) => {
      console.log(`   - ${sector}: ${count}`);
    });

    // 5. Test business size breakdown
    console.log('\n5. Testing business size breakdown...');
    const businessSizeBreakdown = allResponses.reduce((acc, r) => {
      acc[r.business_size] = (acc[r.business_size] || 0) + 1;
      return acc;
    }, {});

    console.log('✅ Business size breakdown:');
    Object.entries(businessSizeBreakdown).forEach(([size, count]) => {
      console.log(`   - ${size}: ${count}`);
    });

    // 6. Test feature analysis
    console.log('\n6. Testing feature analysis...');
    const topFeatures = allResponses.reduce((acc, r) => {
      r.important_features.forEach(feature => {
        acc[feature] = (acc[feature] || 0) + 1;
      });
      return acc;
    }, {});

    console.log('✅ Top features:');
    Object.entries(topFeatures)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([feature, count]) => {
        console.log(`   - ${feature}: ${count}`);
      });

    console.log('\n🎉 Admin onboarding tracking test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the application: npm run dev');
    console.log('   2. Login as an admin user');
    console.log('   3. Navigate to /admin');
    console.log('   4. Click on "Onboarding Tracking" tab');
    console.log('   5. Verify that onboarding responses are displayed');
    console.log('   6. Test filtering and search functionality');
    console.log('   7. Test CSV export functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminOnboardingTracking();
