-- Create the product-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their product images" ON storage.objects;

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view product images (public bucket)
CREATE POLICY "Users can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow users to update their own product images
CREATE POLICY "Users can update their product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own product images
CREATE POLICY "Users can delete their product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

