CREATE TABLE IF NOT EXISTS vin_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT NOT NULL UNIQUE,
  manufacturer TEXT,
  brand TEXT,
  model TEXT,
  production_year INT,
  market TEXT,
  engine_code TEXT,
  engine_size TEXT,
  fuel_type TEXT,
  transmission TEXT,
  drive_type TEXT CHECK (drive_type IN ('2WD', 'AWD', '4WD', 'RWD', 'FWD')),
  trim_level TEXT,
  body_style TEXT,
  country_of_origin TEXT,
  additional_specs JSONB DEFAULT '{}',
  decoded_data JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vin_records_vin ON vin_records (vin);
CREATE INDEX idx_vin_records_brand ON vin_records (brand);
CREATE INDEX idx_vin_records_model ON vin_records (model);
CREATE INDEX idx_vin_records_production_year ON vin_records (production_year);
CREATE INDEX idx_vin_records_market ON vin_records (market);
CREATE INDEX idx_vin_records_created_by ON vin_records (created_by);
CREATE INDEX idx_vin_records_gin ON vin_records USING GIN (additional_specs);

ALTER TABLE vin_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read VINs" ON vin_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create VINs" ON vin_records
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own VINs" ON vin_records
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any VIN" ON vin_records
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can delete own VINs" ON vin_records
  FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION update_vin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vin_records_updated_at
  BEFORE UPDATE ON vin_records
  FOR EACH ROW
  EXECUTE FUNCTION update_vin_updated_at();
