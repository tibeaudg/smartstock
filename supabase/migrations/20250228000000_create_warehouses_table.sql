-- Create warehouses table
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, branch_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_warehouses_user_id ON public.warehouses(user_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_branch_id ON public.warehouses(branch_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_name ON public.warehouses(name);

-- Enable RLS
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own warehouses" ON public.warehouses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own warehouses" ON public.warehouses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own warehouses" ON public.warehouses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own warehouses" ON public.warehouses
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_warehouses_updated_at
    BEFORE UPDATE ON public.warehouses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle warehouse deletion (set product.location to NULL)
CREATE OR REPLACE FUNCTION handle_warehouse_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Update products where location matches the deleted warehouse name
    -- Only update products in the same branch
    UPDATE public.products
    SET location = NULL
    WHERE location = OLD.name
      AND branch_id = OLD.branch_id
      AND user_id = OLD.user_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function when a warehouse is deleted
CREATE TRIGGER on_warehouse_delete
    AFTER DELETE ON public.warehouses
    FOR EACH ROW
    EXECUTE FUNCTION handle_warehouse_deletion();

-- Grant permissions
GRANT ALL ON public.warehouses TO authenticated;

