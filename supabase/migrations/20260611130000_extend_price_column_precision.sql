-- Store inventory prices with up to 6 decimal places (was DECIMAL(10,2)).

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT *
    FROM (VALUES
      ('products', 'unit_price'),
      ('products', 'purchase_price'),
      ('products', 'sale_price'),
      ('stock_transactions', 'unit_price'),
      ('stock_transactions', 'total_value'),
      ('purchase_order_items', 'unit_price'),
      ('purchase_order_items', 'total_price'),
      ('sales_order_items', 'unit_price'),
      ('sales_order_items', 'total_price'),
      ('stock_transfer_items', 'unit_price'),
      ('cycle_count_items', 'variance_value')
    ) AS t(table_name, column_name)
  LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = r.table_name
        AND column_name = r.column_name
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ALTER COLUMN %I TYPE NUMERIC(18,6) USING %I::NUMERIC(18,6)',
        r.table_name,
        r.column_name,
        r.column_name
      );
    END IF;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
