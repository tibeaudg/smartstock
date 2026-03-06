-- Fix stock_transactions RLS so sales order and purchase order transactions are visible
-- The previous policy only allowed auth.uid() = user_id, which could block transactions
-- when the order's user_id differs from the viewer (e.g. team member fulfilling).
-- New policy: allow users to see transactions in branches they have access to.

DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;

CREATE POLICY "Users can view stock transactions in their branches" ON public.stock_transactions
    FOR SELECT USING (
      -- Original: user's own transactions
      auth.uid() = user_id
      OR
      -- Demo mode: session token based
      (user_id IS NULL AND session_token IS NOT NULL)
      OR
      -- Branch-based: user has access to the transaction's branch
      (
        branch_id IS NOT NULL
        AND (
          -- User is branch owner
          EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = stock_transactions.branch_id
            AND b.user_id = auth.uid()
          )
          OR
          -- User is branch member via branch_users
          EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = stock_transactions.branch_id
            AND bu.user_id = auth.uid()
          )
        )
      )
    );
