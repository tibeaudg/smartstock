
-- Create licenses table for tracking admin licenses
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_type TEXT NOT NULL DEFAULT 'basic',
  max_users INTEGER NOT NULL DEFAULT 5,
  max_branches INTEGER NOT NULL DEFAULT 1,
  monthly_price DECIMAL(10,2) NOT NULL DEFAULT 29.99,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_periods table for tracking billing cycles
CREATE TABLE public.billing_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  user_count INTEGER NOT NULL,
  branch_count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for licenses
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own licenses" 
  ON public.licenses 
  FOR SELECT 
  USING (admin_user_id = auth.uid());

CREATE POLICY "Admins can manage their own licenses" 
  ON public.licenses 
  FOR ALL 
  USING (admin_user_id = auth.uid());

-- Add RLS policies for billing_periods
ALTER TABLE public.billing_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their billing periods" 
  ON public.billing_periods 
  FOR SELECT 
  USING (
    license_id IN (
      SELECT id FROM public.licenses WHERE admin_user_id = auth.uid()
    )
  );

-- Function to create default license for admin users
CREATE OR REPLACE FUNCTION public.create_default_license()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create license for admin users
  IF NEW.role = 'admin' THEN
    INSERT INTO public.licenses (admin_user_id, license_type, max_users, max_branches, monthly_price)
    VALUES (NEW.id, 'basic', 5, 1, 29.99);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create default license when admin user is created
CREATE TRIGGER create_default_license_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_license();

-- Function to calculate billing for admin user
CREATE OR REPLACE FUNCTION public.calculate_billing(admin_id UUID)
RETURNS TABLE(
  user_count INTEGER,
  branch_count INTEGER,
  base_price DECIMAL,
  total_price DECIMAL
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  WITH user_branch_counts AS (
    SELECT 
      COUNT(DISTINCT bu.user_id) as total_users,
      COUNT(DISTINCT bu.branch_id) as total_branches
    FROM public.branch_users bu
    JOIN public.branches b ON bu.branch_id = b.id
    WHERE b.id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = admin_id
    )
  ),
  license_info AS (
    SELECT monthly_price, max_users, max_branches
    FROM public.licenses 
    WHERE admin_user_id = admin_id AND is_active = true
    LIMIT 1
  )
  SELECT 
    ubc.total_users::INTEGER as user_count,
    ubc.total_branches::INTEGER as branch_count,
    li.monthly_price as base_price,
    (li.monthly_price + 
     GREATEST(0, ubc.total_users - li.max_users) * 5.00 +
     GREATEST(0, ubc.total_branches - li.max_branches) * 10.00
    ) as total_price
  FROM user_branch_counts ubc
  CROSS JOIN license_info li;
$$;

-- Function to get admin branch statistics
CREATE OR REPLACE FUNCTION public.get_admin_branches(admin_id UUID)
RETURNS TABLE(
  branch_id UUID,
  branch_name TEXT,
  is_main BOOLEAN,
  user_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    b.id as branch_id,
    b.name as branch_name,
    b.is_main,
    COUNT(bu.user_id)::INTEGER as user_count,
    b.created_at
  FROM public.branches b
  LEFT JOIN public.branch_users bu ON b.id = bu.branch_id
  WHERE b.id IN (
    SELECT branch_id 
    FROM public.branch_users 
    WHERE user_id = admin_id
  )
  GROUP BY b.id, b.name, b.is_main, b.created_at
  ORDER BY b.is_main DESC, b.name ASC;
$$;
