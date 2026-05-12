-- Track whether a user has acknowledged the subscription plan change modal.
-- Users on the free tier who had multiple branches before limits were enforced
-- must see this modal once; this column prevents it from showing again.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS seen_subscription_migration_modal boolean NOT NULL DEFAULT false;
