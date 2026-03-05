-- Fix: COALESCE types text and integer cannot be matched
-- The notify_stock_alert trigger may fail when minimum_stock_level is TEXT or another type
-- that doesn't match the integer literal 0. Cast explicitly to handle all cases.

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
  -- Fix: Cast to INTEGER to avoid "COALESCE types text and integer cannot be matched"
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
