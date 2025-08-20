// Test script for blog analytics
// Run this after setting up the database tables

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your actual values
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://sszuxnqhbxauvershuys.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzenV4bnFoYnhhdXZlcnNodXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTEyODYsImV4cCI6MjA2NTQ2NzI4Nn0.-jvEJ1uUwdcJKZ1JbgOtD6jr-e0FoeepPrj8rpSFviQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBlogAnalytics() {
  console.log('🧪 Testing Blog Analytics System...\n');

  try {
    // 1. Test creating a sample blog post
    console.log('1. Creating sample blog post...');
    const { data: blogPost, error: blogError } = await supabase
      .from('blogposts')
      .insert([{
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        content: 'This is a test blog post for analytics testing.',
        meta_title: 'Test Blog Post',
        meta_description: 'A test blog post to verify analytics functionality.',
        published: true,
        date_published: new Date().toISOString(),
        author: 'test-user'
      }])
      .select()
      .single();

    if (blogError) {
      console.error('❌ Failed to create blog post:', blogError);
      return;
    }
    console.log('✅ Blog post created:', blogPost.slug);

    // 2. Test inserting analytics data
    console.log('\n2. Inserting sample analytics data...');
    const { error: analyticsError } = await supabase
      .from('blog_analytics')
      .insert([{
        blog_post_id: blogPost.id,
        slug: blogPost.slug,
        visitor_ip: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: 'https://google.com',
        page_load_time_ms: 1250,
        time_on_page_seconds: 45,
        is_unique_visit: true
      }]);

    if (analyticsError) {
      console.error('❌ Failed to insert analytics:', analyticsError);
      return;
    }
    console.log('✅ Analytics data inserted');

    // 3. Test querying analytics summary
    console.log('\n3. Testing analytics summary view...');
    const { data: summary, error: summaryError } = await supabase
      .from('blog_analytics_summary')
      .select('*')
      .eq('slug', blogPost.slug);

    if (summaryError) {
      console.error('❌ Failed to query summary:', summaryError);
      return;
    }
    console.log('✅ Analytics summary:', summary);

    // 4. Test querying detailed analytics
    console.log('\n4. Testing detailed analytics query...');
    const { data: details, error: detailsError } = await supabase
      .from('blog_analytics')
      .select('*')
      .eq('slug', blogPost.slug);

    if (detailsError) {
      console.error('❌ Failed to query details:', detailsError);
      return;
    }
    console.log('✅ Detailed analytics:', details);

    console.log('\n🎉 All tests passed! Blog analytics system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testBlogAnalytics();
