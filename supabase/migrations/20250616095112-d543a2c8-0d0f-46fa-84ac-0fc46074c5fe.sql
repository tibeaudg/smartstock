
-- Drop existing RLS policies for stock_transactions that might be blocking access
DROP POLICY IF EXISTS "Users can view transactions in their branches" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can create transactions in their branches" ON public.stock_transactions;

-- Create comprehensive RLS policies for stock_transactions
CREATE POLICY "Users can view transactions in their branches" 
  ON public.stock_transactions 
  FOR SELECT 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions in their branches" 
  ON public.stock_transactions 
  FOR INSERT 
  WITH CHECK (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transactions in their branches" 
  ON public.stock_transactions 
  FOR UPDATE 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transactions in their branches" 
  ON public.stock_transactions 
  FOR DELETE 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );
