# Usage-Based Pricing Testing Guide

## Pre-Testing Setup

1. **Apply Database Migration**
   ```bash
   # Run the migration
   npx supabase migration up
   
   # Or if using Supabase CLI
   supabase db push
   ```

2. **Deploy Supabase Functions**
   ```bash
   supabase functions deploy process-monthly-billing
   supabase functions deploy stripe-webhook
   ```

3. **Configure Stripe (Test Mode)**
   - Create a test Stripe account
   - Set environment variables in Supabase dashboard
   - Add Stripe webhook endpoint for testing

## Testing Checklist

### 1. Database Schema Tests

#### Test: Pricing Tiers Updated
```sql
-- Check pricing tiers have new columns
SELECT name, display_name, price_per_product_monthly, included_products, max_products 
FROM pricing_tiers;

-- Expected:
-- basic: included_products=100, price_per_product_monthly=0, max_products=100
-- growth: included_products=100, price_per_product_monthly=0.008, max_products=10000
-- premium: included_products=NULL, price_per_product_monthly=NULL, max_products=NULL
```

#### Test: Billing Snapshots Table Exists
```sql
-- Check table structure
\d billing_snapshots

-- Should have columns: id, user_id, snapshot_date, product_count, calculated_amount, 
-- billing_cycle_start, billing_cycle_end, stripe_invoice_id, status
```

#### Test: Usage Tracking Updated
```sql
-- Check new columns exist
SELECT billing_anchor_date, next_billing_date 
FROM usage_tracking 
LIMIT 1;

-- Should return date columns without errors
```

### 2. Frontend Component Tests

#### Test: Pricing Calculator
1. **Navigate to** `/pricing`
2. **Verify:**
   - [ ] Calculator loads and displays
   - [ ] Slider works (0-15,000 products)
   - [ ] Cost displays correctly:
     - 0-100 products: €0/month
     - 200 products: €0.80/month (100 × 0.008)
     - 500 products: €3.20/month (400 × 0.008)
   - [ ] Auto-redirects to contact sales at 10,000+ products

#### Test: Pricing Page
1. **Verify:**
   - [ ] Three tier cards display (Free, Business, Enterprise)
   - [ ] Business tier shows €0.008 per product
   - [ ] FAQ updated with usage-based billing info
   - [ ] Currency shows € (EUR) not $ (USD)

#### Test: Usage Limits Component
**Scenario A: Free Tier (0-100 products)**
- [ ] Shows "X/100 products used"
- [ ] Progress bar updates correctly
- [ ] No monthly cost displayed

**Scenario B: Business Tier (101-9,999 products)**
- [ ] Shows product count
- [ ] Displays monthly cost: €X.XX/month
- [ ] Info banner explains pricing

**Scenario C: Enterprise Limit (10,000+ products)**
- [ ] Shows enterprise warning
- [ ] "Contact Sales" button visible
- [ ] Block adding more products

### 3. Billing Calculation Tests

#### Test: Manual Billing Snapshot Creation
```sql
-- Test function with different scenarios
-- Scenario 1: Free tier user (50 products)
SELECT create_monthly_billing_snapshot('user-uuid-here');

-- Expected: product_count=50, calculated_amount=0

-- Scenario 2: Business tier user (250 products)
-- Expected: product_count=250, calculated_amount=1.20 (150 × 0.008)

-- Scenario 3: Enterprise scenario (15,000 products)
-- Should allow but flag for contact sales
```

#### Test: Automatic Product Counting Trigger
```sql
-- Add a product
INSERT INTO products (name, branch_id, quantity_in_stock, purchase_price, sale_price)
VALUES ('Test Product', 'branch-uuid', 10, 5.00, 10.00)
RETURNING *;

-- Check usage_tracking updated
SELECT current_products FROM usage_tracking 
WHERE user_id = 'your-user-id';

-- Expected: current_products incremented by 1
```

### 4. Edge Cases

#### Edge Case 1: Exact Product Limits
- **Test 100 products exactly:**
  - [ ] User at 100 products: No charge
  - [ ] User at 101 products: €0.008 charge
  - [ ] User at 10,000 products: Contact sales required

#### Edge Case 2: Rapid Product Changes
- Add 150 products
- Remove 50 products
- Add 25 products
- **Expected:** Only final count (125) matters for billing at snapshot time

#### Edge Case 3: Multiple Branches
- User has products across multiple branches
- **Expected:** Total count across all branches

#### Edge Case 4: Billing Anchor Date
```sql
-- Check billing dates are set correctly
SELECT 
  user_id,
  billing_anchor_date,
  next_billing_date,
  EXTRACT(DAY FROM (next_billing_date - billing_anchor_date)) as days_between
FROM usage_tracking;

-- Expected: days_between = 30
```

### 5. Stripe Integration Tests

#### Test: Webhook Handler
1. **Create test webhook event:**
   ```bash
   # Use Stripe CLI to send test events
   stripe trigger checkout.session.completed
   ```

2. **Verify:**
   - [ ] `billing_anchor_date` set to current date
   - [ ] `next_billing_date` set to current date + 30 days
   - [ ] Usage tracking record created

#### Test: Invoice Webhook
1. **Simulate invoice creation:**
   ```bash
   stripe trigger invoice.created
   ```

2. **Verify:**
   - [ ] Billing snapshot status updated to 'invoiced'
   - [ ] `stripe_invoice_id` stored

3. **Simulate payment success:**
   ```bash
   stripe trigger invoice.payment_succeeded
   ```

4. **Verify:**
   - [ ] Billing snapshot status updated to 'paid'

### 6. Billing Process Function Tests

#### Test: Monthly Billing Execution
```bash
# Call the function manually
curl -X POST https://your-project.supabase.co/functions/v1/process-monthly-billing \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Verify:**
- [ ] Users with `next_billing_date <= NOW()` are processed
- [ ] Product counts calculated correctly
- [ ] Billing snapshots created
- [ ] `next_billing_date` updated to +30 days

### 7. Admin Dashboard Tests

#### Test: MRR Calculation
1. **Navigate to** `/admin`
2. **Verify:**
   - [ ] User costs display in EUR (€) not USD ($)
   - [ ] Free tier users show €0.00
   - [ ] Business tier users show correct amount (€X.XX)
   - [ ] Enterprise users show €0.00 or special handling

#### Test: User Filtering
- [ ] Filter by plan works
- [ ] Product counts accurate
- [ ] Monthly costs calculated correctly

### 8. Integration Tests

#### Full Flow Test: New User
1. **Create new account** (via registration)
2. **Add products** (until you hit 101 products)
3. **Verify:**
   - [ ] First 100 products: No warnings
   - [ ] 101st product: Shows €0.008/month charge
   - [ ] Usage Limits component shows correct cost
4. **Wait for billing cycle** (or manually trigger)
5. **Verify:**
   - [ ] Billing snapshot created
   - [ ] Amount calculated correctly (€0.008 × billable products)
   - [ ] Next billing date set to +30 days

#### Full Flow Test: Existing User Migration
1. **Select an existing user** with products
2. **Verify:**
   - [ ] `billing_anchor_date` initialized
   - [ ] `next_billing_date` set
   - [ ] Product count accurate in usage_tracking

### 9. Limit Enforcement Tests

#### Test: Free Tier Limit (100 products)
1. **As a free tier user:**
   - [ ] Can add up to 100 products
   - [ ] Blocked from adding product 101
   - [ ] Shows upgrade prompt

#### Test: Business Tier Limit (10,000 products)
1. **As a business tier user:**
   - [ ] Can add products freely
   - [ ] No warnings until ~9,500 products
   - [ ] Warning at 9,500-9,999 products
   - [ ] Blocked at 10,000 products
   - [ ] Required to contact sales

### 10. Calculator Edge Cases

#### Test Calculator at Boundaries
- **100 products:** Should show €0 and Free tier
- **101 products:** Should show €0.01 and Business tier
- **9,999 products:** Should show ~€79.20 and Business tier
- **10,000 products:** Should auto-redirect to contact sales
- **15,000 products:** Should show "Custom Pricing" and Enterprise tier

### 11. Currency Display Tests

**Verify EUR formatting in:**
- [ ] Pricing page
- [ ] Pricing calculator
- [ ] Usage limits component
- [ ] Usage dashboard
- [ ] Admin dashboard
- [ ] All cost displays show € not $

### 12. Performance Tests

#### Test: Product Counting Performance
```sql
-- Test trigger performance with many products
-- Add 1000 products
-- Verify usage_tracking updates quickly

EXPLAIN ANALYZE 
UPDATE products SET updated_at = NOW() 
WHERE user_id = 'test-user-id';
```

## Common Issues & Solutions

### Issue: Products not counting
**Solution:** Check database trigger is active
```sql
SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_product_count';
```

### Issue: Billing dates not set
**Solution:** Run initialization query
```sql
UPDATE usage_tracking
SET 
  billing_anchor_date = COALESCE(billing_anchor_date, created_at, NOW()),
  next_billing_date = COALESCE(next_billing_date, NOW() + INTERVAL '30 days')
WHERE billing_anchor_date IS NULL OR next_billing_date IS NULL;
```

### Issue: Cost calculation incorrect
**Verify tier configuration:**
```sql
SELECT name, included_products, price_per_product_monthly 
FROM pricing_tiers;
```

## Test User Scenarios

### Scenario 1: Small Shop (50 products)
- User: Free tier, €0/month
- Verification: No charges

### Scenario 2: Growing Business (250 products)
- User: Business tier, €1.20/month (150 × 0.008)
- Verification: Correct calculation

### Scenario 3: Large Business (5,000 products)
- User: Business tier, €39.20/month (4,900 × 0.008)
- Verification: Correct calculation

### Scenario 4: Enterprise (15,000 products)
- User: Contact sales required
- Verification: Blocked from adding more

## Automated Testing Script

Create a test script to verify all calculations:

```javascript
// test-pricing-calculations.js
const testCases = [
  { products: 50, expected: 0, tier: 'free' },
  { products: 100, expected: 0, tier: 'free' },
  { products: 101, expected: 0.008, tier: 'business' },
  { products: 200, expected: 0.80, tier: 'business' },
  { products: 1000, expected: 7.20, tier: 'business' },
  { products: 10000, expected: 0, tier: 'enterprise' },
];

testCases.forEach(({ products, expected, tier }) => {
  const billableProducts = Math.max(0, products - 100);
  const cost = billableProducts * 0.008;
  const shouldBeEnterprise = products >= 10000;
  
  console.log(`Products: ${products} | Expected: €${expected} | Tier: ${tier}`);
  console.log(`Calculated: €${cost.toFixed(3)} | Matches: ${Math.abs(cost - expected) < 0.001}`);
  console.log(`Enterprise: ${shouldBeEnterprise} | Correct: ${shouldBeEnterprise === (tier === 'enterprise')}`);
  console.log('---');
});
```

Run: `node test-pricing-calculations.js`

## Sign-Off Checklist

- [ ] All database migrations applied
- [ ] All pricing displays show EUR (€)
- [ ] Calculator works correctly
- [ ] Billing calculations accurate
- [ ] Limit enforcement working
- [ ] Webhooks processing correctly
- [ ] Admin dashboard shows correct costs
- [ ] No console errors in browser
- [ ] No database errors in logs
- [ ] Performance acceptable

