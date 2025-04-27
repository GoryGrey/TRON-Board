-- Create storage bucket for uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('uploads', 'uploads', true, false)
ON CONFLICT (id) DO NOTHING;

-- Update posts table to ensure image_url column exists
ALTER TABLE IF EXISTS public.posts
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update comments table to ensure image_url column exists
ALTER TABLE IF NOT EXISTS public.comments
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create policy to allow authenticated users to upload files to uploads bucket
CREATE POLICY "Allow users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );
  
-- Create policy to allow public read access to uploads bucket
CREATE POLICY "Allow public to view files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'uploads'
  );
  
-- Create policy to allow file owners to update their files
CREATE POLICY "Allow users to update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'uploads' AND
    auth.uid() = owner
  );
  
-- Create policy to allow file owners to delete their files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads' AND
    auth.uid() = owner
  );
