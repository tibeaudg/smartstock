-- Stock alert: log table for deduplication and trigger to send emails on low/empty stock

-- Table to track when we sent alerts (24h cooldown per product per branch)
CREATE TABLE IF NOT EXISTS public.stock_alert_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low', 'empty')),
  alerted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_alert_log_product_branch ON public.stock_alert_log(product_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_alert_log_alerted_at ON public.stock_alert_log(alerted_at);

-- No RLS: internal table only written by trigger (SECURITY DEFINER). Table owner has full access.

-- Trigger function: on products.quantity_in_stock update, check if we should send alert
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
BEGIN
  -- Only proceed if quantity_in_stock actually changed
  IF OLD.quantity_in_stock IS NOT DISTINCT FROM NEW.quantity_in_stock THEN
    RETURN NEW;
  END IF;

  -- Determine if we're in low or empty state
  v_min_level := COALESCE(NEW.minimum_stock_level, 0);

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

  -- Fetch branch_settings
  SELECT stock_alert_enabled, stock_alert_email
  INTO v_bs
  FROM public.branch_settings
  WHERE branch_id = NEW.branch_id;

  IF NOT FOUND OR NOT COALESCE(v_bs.stock_alert_enabled, false) OR v_bs.stock_alert_email IS NULL OR trim(v_bs.stock_alert_email) = '' THEN
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

  -- Log that we're sending (do this before pg_net so we have record even if http fails)
  INSERT INTO public.stock_alert_log (product_id, branch_id, alert_type)
  VALUES (NEW.id, NEW.branch_id, v_alert_type);

  -- Call edge function via pg_net (if available)
  BEGIN
    SELECT decrypted_secret INTO v_project_url FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
    SELECT decrypted_secret INTO v_service_key FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

    IF v_project_url IS NOT NULL AND v_service_key IS NOT NULL AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
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
      -- Do not fail the product update if alert delivery fails
      RAISE WARNING 'Stock alert delivery failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: AFTER UPDATE of quantity_in_stock
DROP TRIGGER IF EXISTS trigger_notify_stock_alert ON public.products;

CREATE TRIGGER trigger_notify_stock_alert
  AFTER UPDATE OF quantity_in_stock ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_stock_alert();
