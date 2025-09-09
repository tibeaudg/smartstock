-- Test script om te controleren of stock transactions correct worden aangemaakt
-- Voer dit uit na het toevoegen van een product

-- 1. Controleer de huidige structuur van stock_transactions tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'stock_transactions'
ORDER BY ordinal_position;

-- 2. Controleer of er transacties zijn
SELECT COUNT(*) as total_transactions FROM stock_transactions;

-- 3. Toon de laatste 5 transacties
SELECT 
    id,
    product_name,
    transaction_type,
    quantity,
    unit_price,
    total_value,
    branch_id,
    created_by,
    created_at,
    notes
FROM stock_transactions 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Controleer of er transacties zijn voor vandaag
SELECT 
    COUNT(*) as transactions_today,
    SUM(quantity) as total_quantity_today
FROM stock_transactions 
WHERE DATE(created_at) = CURRENT_DATE;

-- 5. Controleer RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'stock_transactions';

-- 6. Test of we transacties kunnen lezen (dit test RLS)
SELECT COUNT(*) as readable_transactions FROM stock_transactions;
