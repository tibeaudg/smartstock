#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Stripe development environment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your Stripe keys:');
  console.log(`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
VITE_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  `);
  process.exit(1);
}

// Check if Stripe CLI is installed
try {
  execSync('stripe --version', { stdio: 'ignore' });
  console.log('✅ Stripe CLI is installed');
} catch (error) {
  console.log('❌ Stripe CLI not found!');
  console.log('Please install it from: https://stripe.com/docs/stripe-cli');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Make sure your Stripe account is set up');
console.log('2. Run: stripe login');
console.log('3. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
console.log('4. Copy the webhook secret to your .env.local file');
console.log('5. Start your development server: npm run dev');
console.log('\n🎉 Setup complete!');
