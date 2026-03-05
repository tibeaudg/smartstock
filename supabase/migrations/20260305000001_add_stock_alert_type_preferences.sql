-- Add user preferences for which stock alert types to receive
-- stock_alert_low_enabled: receive alerts when products go below minimum stock
-- stock_alert_empty_enabled: receive alerts when products run out of stock
-- Both default to true for backward compatibility (existing behavior)
--
-- Automatic alerts use two paths:
-- 1) DB trigger + pg_net (when pg_net enabled and vault secrets set)
-- 2) App-level fallback: after stock updates the UI calls send-stock-alert with check_alert
--
-- To enable DB-triggered alerts (for PO/SO/transfers), run in SQL editor:
--   SELECT vault.create_secret('https://YOUR_PROJECT_REF.supabase.co', 'project_url');
--   SELECT vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key');
-- And enable pg_net in Supabase Dashboard > Database > Extensions.

ALTER TABLE public.branch_settings
  ADD COLUMN IF NOT EXISTS stock_alert_low_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS stock_alert_empty_enabled BOOLEAN DEFAULT true;

-- Update notify_stock_alert to respect per-type preferences
CREATE OR REPLACE FUNCTION public.notify_stock_alert()
RETURNS TRIGGER AS $$
DECLARE
  v_alert_type TEXT;
  v_min_level INTEGER;
  v_bs RECORD;
  v_recent_alert BOOLEAN;
  v_project_url TEXT;
  v_service_key TEXT;
  v_body JSONB;
  v_send_low BOOLEAN;
  v_send_empty BOOLEAN;
BEGIN
  -- Only proceed if quantity_in_stock actually changed
  IF OLD.quantity_in_stock IS NOT DISTINCT FROM NEW.quantity_in_stock THEN
    RETURN NEW;
  END IF;

  -- Determine if we're in low or empty state
  v_min_level := COALESCE((NEW.minimum_stock_level)::INTEGER, 0);

  IF (NEW.quantity_in_stock)::INTEGER = 0 THEN
    v_alert_type := 'empty';
  ELSIF v_min_level > 0 AND (NEW.quantity_in_stock)::INTEGER <= v_min_level THEN
    v_alert_type := 'low';
  ELSE
    -- Stock is OK, no alert needed
    RETURN NEW;
  END IF;

  -- Need branch_id
  IF NEW.branch_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Fetch branch_settings including per-type preferences
  SELECT stock_alert_enabled, stock_alert_email,
         COALESCE(stock_alert_low_enabled, true) AS stock_alert_low_enabled,
         COALESCE(stock_alert_empty_enabled, true) AS stock_alert_empty_enabled
  INTO v_bs
  FROM public.branch_settings
  WHERE branch_id = NEW.branch_id;

  v_send_low := v_bs.stock_alert_low_enabled;
  v_send_empty := v_bs.stock_alert_empty_enabled;

  IF NOT FOUND OR NOT COALESCE(v_bs.stock_alert_enabled, false) OR v_bs.stock_alert_email IS NULL OR trim(v_bs.stock_alert_email) = '' THEN
    RETURN NEW;
  END IF;

  -- Skip if user has disabled this alert type
  IF v_alert_type = 'low' AND NOT v_send_low THEN
    RETURN NEW;
  END IF;
  IF v_alert_type = 'empty' AND NOT v_send_empty THEN
    RETURN NEW;
  END IF;

  -- Check 24h cooldown
  SELECT EXISTS (
    SELECT 1 FROM public.stock_alert_log
    WHERE product_id = NEW.id
      AND branch_id = NEW.branch_id
      AND alert_type = v_alert_type
      AND alerted_at > now() - INTERVAL '24 hours'
  ) INTO v_recent_alert;

  IF v_recent_alert THEN
    RETURN NEW;
  END IF;

  -- Only insert + call pg_net when pg_net is available. Otherwise the app-level
  -- check_alert fallback will run after stock updates and send the email.
  BEGIN
    SELECT decrypted_secret INTO v_project_url FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
    SELECT decrypted_secret INTO v_service_key FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

    IF v_project_url IS NOT NULL AND v_service_key IS NOT NULL AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
      INSERT INTO public.stock_alert_log (product_id, branch_id, alert_type)
      VALUES (NEW.id, NEW.branch_id, v_alert_type);

      v_body := jsonb_build_object(
        'product_id', NEW.id,
        'branch_id', NEW.branch_id,
        'alert_type', v_alert_type
      );

      PERFORM net.http_post(
        url := v_project_url || '/functions/v1/send-stock-alert',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_service_key
        ),
        body := v_body,
        timeout_milliseconds := 15000
      );
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Stock alert delivery failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
