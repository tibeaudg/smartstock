-- =============================================================================
-- Suppliers + Purchase Orders - Combined Setup
-- =============================================================================
-- Run this when migrations have NOT been applied.
-- Creates suppliers first, then purchase orders (which reference suppliers).
--
-- Prerequisites: auth.users, public.branches, public.branch_users, public.products,
-- public.profiles, public.stock_transactions (with extended columns)
-- =============================================================================

\i database_suppliers_setup.sql
\i database_purchase_orders_setup.sql
