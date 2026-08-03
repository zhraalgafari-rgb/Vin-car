-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('uploads', 'uploads', false),
  ('images', 'images', false),
  ('documents', 'documents', false);

-- Storage policies for uploads bucket
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads' AND owner = auth.uid());

-- Storage policies for images bucket
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Storage policies for documents bucket
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');
