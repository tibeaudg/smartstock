# Demo Feature Migration Instructions

## Required Migrations

To enable the demo feature, you need to run two migrations in order:

### 1. First Migration: `20250221000000_add_demo_support.sql`
This migration:
- Adds `session_token` columns to branches, categories, products, and stock_transactions
- Creates indexes for session_token lookups
- Adds RLS policies to allow reading demo data
- Grants SELECT and INSERT permissions to anonymous users

### 2. Second Migration: `20250221000001_create_demo_user.sql`
This migration:
- Makes `user_id` nullable in all demo-related tables (to allow NULL for demo data)
- Updates RLS policies to allow inserting/reading data with NULL user_id when session_token is present
- Consolidates INSERT policies to handle both authenticated and demo users

## How to Apply

1. **Via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run each migration file in order (copy and paste the contents)

2. **Via Supabase CLI:**
   ```bash
   supabase migration up
   ```

## Important Notes

- The migrations are idempotent (safe to run multiple times)
- After running migrations, demo data will use `NULL` for `user_id` instead of a placeholder UUID
- Demo data is identified by `session_token` instead of `user_id`
- All demo data expires after 7 days (handled by `guest_sessions` table)

## Troubleshooting

If you see 403 errors when creating demo data:
1. Ensure both migrations have been run
2. Check that `user_id` columns are nullable: `SELECT is_nullable FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'user_id';`
3. Verify policies exist: `SELECT * FROM pg_policies WHERE tablename IN ('branches', 'categories', 'products', 'stock_transactions');`

