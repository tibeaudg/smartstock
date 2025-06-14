
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'staff');
CREATE TYPE public.transaction_type AS ENUM ('incoming', 'outgoing');
CREATE TYPE public.stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock_level INTEGER NOT NULL DEFAULT 10,
  status stock_status GENERATED ALWAYS AS (
    CASE 
      WHEN quantity_in_stock = 0 THEN 'out_of_stock'::stock_status
      WHEN quantity_in_stock <= minimum_stock_level THEN 'low_stock'::stock_status
      ELSE 'in_stock'::stock_status
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_transactions table
CREATE TABLE public.stock_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_type transaction_type NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  total_value DECIMAL(10,2) GENERATED ALWAYS AS (quantity * COALESCE(unit_price, 0)) STORED,
  reference_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES
  ('Electronics', 'Electronic devices and components'),
  ('Accessories', 'Various accessories and peripherals'),
  ('Software', 'Software licenses and digital products'),
  ('Hardware', 'Computer hardware and components');

-- Insert a default supplier
INSERT INTO public.suppliers (name, email, phone) VALUES
  ('TechDistributor Inc.', 'orders@techdist.com', '+1-555-0123');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for categories (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for suppliers
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage suppliers" ON public.suppliers
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for products
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can update product quantities" ON public.products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for stock_transactions
CREATE POLICY "Authenticated users can view transactions" ON public.stock_transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create transactions" ON public.stock_transactions
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can manage all transactions" ON public.stock_transactions
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for orders
CREATE POLICY "Authenticated users can view orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Authenticated users can view order items" ON public.order_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage order items" ON public.order_items
  FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_supplier ON public.products(supplier_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_stock_transactions_product ON public.stock_transactions(product_id);
CREATE INDEX idx_stock_transactions_date ON public.stock_transactions(created_at);
CREATE INDEX idx_orders_supplier ON public.orders(supplier_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
