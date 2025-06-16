
-- Remove foreign key constraints from products table to categories and suppliers
-- We'll keep the category_id and supplier_id columns but they won't be strict foreign keys
-- Instead, we'll store the actual names in separate columns for flexibility

-- Add new columns to store category and supplier names directly
ALTER TABLE products 
ADD COLUMN category_name TEXT,
ADD COLUMN supplier_name TEXT;

-- Update existing products to populate the new name columns from related tables
UPDATE products 
SET category_name = categories.name 
FROM categories 
WHERE products.category_id = categories.id;

UPDATE products 
SET supplier_name = suppliers.name 
FROM suppliers 
WHERE products.supplier_id = suppliers.id;

-- We'll keep the categories and suppliers tables as lookup/suggestion tables
-- but products will primarily use the name fields for flexibility
