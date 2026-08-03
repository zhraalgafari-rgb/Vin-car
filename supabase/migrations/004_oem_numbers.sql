CREATE TABLE IF NOT EXISTS oem_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  oem_number TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ocr', 'ai_extracted')),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(part_id, oem_number)
);

CREATE INDEX idx_oem_numbers_part_id ON oem_numbers (part_id);
CREATE INDEX idx_oem_numbers_oem_number ON oem_numbers (oem_number);
CREATE INDEX idx_oem_numbers_source ON oem_numbers (source);

ALTER TABLE oem_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read OEM numbers" ON oem_numbers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create OEM numbers" ON oem_numbers
  FOR INSERT WITH CHECK (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));

CREATE POLICY "Users can update own OEM numbers" ON oem_numbers
  FOR UPDATE USING (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));

CREATE POLICY "Users can delete own OEM numbers" ON oem_numbers
  FOR DELETE USING (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));
