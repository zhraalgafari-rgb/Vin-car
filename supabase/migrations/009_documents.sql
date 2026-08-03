CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin_id UUID REFERENCES vin_records(id) ON DELETE SET NULL,
  part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'excel', 'word', 'image', 'zip', 'catalog', 'invoice', 'shipping_doc')),
  file_size BIGINT,
  mime_type TEXT,
  ocr_text TEXT,
  ocr_confidence FLOAT,
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_vin_id ON documents (vin_id);
CREATE INDEX idx_documents_part_id ON documents (part_id);
CREATE INDEX idx_documents_order_id ON documents (order_id);
CREATE INDEX idx_documents_file_type ON documents (file_type);
CREATE INDEX idx_documents_uploaded_by ON documents (uploaded_by);
CREATE INDEX idx_documents_ocr_fts ON documents USING GIN (to_tsvector('english', ocr_text));

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read documents" ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = uploaded_by);
