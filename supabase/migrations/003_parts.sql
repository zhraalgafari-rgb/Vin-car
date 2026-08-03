CREATE TABLE IF NOT EXISTS parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin_id UUID REFERENCES vin_records(id) ON DELETE CASCADE,
  arabic_name TEXT,
  english_name TEXT,
  part_category TEXT,
  oem_number TEXT,
  alternative_oem_numbers TEXT[] DEFAULT '{}',
  dimensions JSONB,
  weight JSONB,
  compatible_vehicles TEXT[] DEFAULT '{}',
  equivalent_parts JSONB DEFAULT '[]',
  brands TEXT[] DEFAULT '{}',
  notes TEXT,
  attachments TEXT[] DEFAULT '{}',
  quantity INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'out_of_stock', 'ordered', 'discontinued')),
  images TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parts_vin_id ON parts (vin_id);
CREATE INDEX idx_parts_oem_number ON parts (oem_number);
CREATE INDEX idx_parts_arabic_name ON parts USING GIN (to_tsvector('arabic', arabic_name));
CREATE INDEX idx_parts_english_name ON parts USING GIN (to_tsvector('english', english_name));
CREATE INDEX idx_parts_category ON parts (part_category);
CREATE INDEX idx_parts_status ON parts (status);
CREATE INDEX idx_parts_brands ON parts USING GIN (brands);
CREATE INDEX idx_parts_alt_oem ON parts USING GIN (alternative_oem_numbers);
CREATE INDEX idx_parts_compat_vehicles ON parts USING GIN (compatible_vehicles);
CREATE INDEX idx_parts_created_by ON parts (created_by);
CREATE INDEX idx_parts_fts ON parts USING GIN (to_tsvector('english', coalesce(arabic_name, '') || ' ' || coalesce(english_name, '') || ' ' || coalesce(oem_number, '')));

ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read parts" ON parts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create parts" ON parts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own parts" ON parts
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any parts" ON parts
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can delete own parts" ON parts
  FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION update_parts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parts_updated_at
  BEFORE UPDATE ON parts
  FOR EACH ROW
  EXECUTE FUNCTION update_parts_updated_at();
