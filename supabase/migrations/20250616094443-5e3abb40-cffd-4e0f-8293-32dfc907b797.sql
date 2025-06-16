
-- Enable real-time updates for stock_transactions table
ALTER TABLE public.stock_transactions REPLICA IDENTITY FULL;

-- Add the table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_transactions;
