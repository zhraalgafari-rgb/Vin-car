CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  customer_type TEXT CHECK (customer_type IN ('wholesaler', 'dealer', 'retail', 'other')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_name ON customers (name);
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_phone ON customers (phone);
CREATE INDEX idx_customers_country ON customers (country);
CREATE INDEX idx_customers_created_by ON customers (created_by);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own customers" ON customers
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any customers" ON customers
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can delete own customers" ON customers
  FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customers_updated_at();
