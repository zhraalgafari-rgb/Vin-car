CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  notes TEXT,
  reliability_score FLOAT CHECK (reliability_score >= 0 AND reliability_score <= 1) DEFAULT 0.5,
  performance_rating FLOAT CHECK (performance_rating >= 0 AND performance_rating <= 5) DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_suppliers_name ON suppliers (name);
CREATE INDEX idx_suppliers_country ON suppliers (country);
CREATE INDEX idx_suppliers_created_by ON suppliers (created_by);
CREATE INDEX idx_suppliers_reliability ON suppliers (reliability_score);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create suppliers" ON suppliers
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own suppliers" ON suppliers
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any suppliers" ON suppliers
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can delete own suppliers" ON suppliers
  FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_suppliers_updated_at();
