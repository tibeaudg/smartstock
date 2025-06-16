
-- Create branches/locations table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_main BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add branch_id to existing tables
ALTER TABLE public.products ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE;
ALTER TABLE public.stock_transactions ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE;
ALTER TABLE public.orders ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE;
ALTER TABLE public.order_items ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE;

-- Create audit logs table for tracking actions per branch
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create branch_users junction table for user-branch access control
CREATE TABLE public.branch_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff',
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES public.profiles(id),
  UNIQUE(branch_id, user_id)
);

-- Add RLS policies for branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view branches they have access to" 
  ON public.branches 
  FOR SELECT 
  USING (
    id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage branches" 
  ON public.branches 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add RLS policies for branch_users
ALTER TABLE public.branch_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own branch assignments" 
  ON public.branch_users 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage branch assignments" 
  ON public.branch_users 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add RLS policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for their branches" 
  ON public.audit_logs 
  FOR SELECT 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

-- Update existing RLS policies to include branch filtering
DROP POLICY IF EXISTS "Users can view their own notes" ON public.products;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.products;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.products;

-- Enable RLS on products if not already enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products in their branches" 
  ON public.products 
  FOR SELECT 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create products in their branches" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in their branches" 
  ON public.products 
  FOR UPDATE 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products in their branches" 
  ON public.products 
  FOR DELETE 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

-- Update RLS policies for stock_transactions
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

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

-- Update RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view orders in their branches" 
  ON public.orders 
  FOR SELECT 
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create orders in their branches" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (
    branch_id IN (
      SELECT branch_id 
      FROM public.branch_users 
      WHERE user_id = auth.uid()
    )
  );

-- Function to create default branch for new users
CREATE OR REPLACE FUNCTION public.create_default_branch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_branch_id UUID;
BEGIN
  -- Only create default branch for admin users
  IF NEW.role = 'admin' THEN
    -- Create default branch
    INSERT INTO public.branches (name, is_main, is_active)
    VALUES ('Hoofdvestiging', true, true)
    RETURNING id INTO new_branch_id;
    
    -- Assign the new user to the default branch
    INSERT INTO public.branch_users (branch_id, user_id, role, granted_by)
    VALUES (new_branch_id, NEW.id, 'admin', NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create default branch when admin user is created
CREATE TRIGGER create_default_branch_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_branch();

-- Function to get user's current branches
CREATE OR REPLACE FUNCTION public.get_user_branches(user_id UUID)
RETURNS TABLE(
  branch_id UUID,
  branch_name TEXT,
  is_main BOOLEAN,
  user_role TEXT
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    b.id as branch_id,
    b.name as branch_name,
    b.is_main,
    bu.role as user_role
  FROM public.branches b
  JOIN public.branch_users bu ON b.id = bu.branch_id
  WHERE bu.user_id = $1
    AND b.is_active = true
  ORDER BY b.is_main DESC, b.name ASC;
$$;
