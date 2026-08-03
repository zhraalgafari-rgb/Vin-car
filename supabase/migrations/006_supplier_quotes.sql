CREATE TABLE IF NOT EXISTS supplier_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  quoted_price DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  moq INT,
  production_time_days INT,
  shipping_time_days INT,
  last_followup TIMESTAMPTZ,
  reply_status TEXT NOT NULL DEFAULT 'pending' CHECK (reply_status IN ('pending', 'replied', 'no_response', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_supplier_quotes_part_id ON supplier_quotes (part_id);
CREATE INDEX idx_supplier_quotes_supplier_id ON supplier_quotes (supplier_id);
CREATE INDEX idx_supplier_quotes_reply_status ON supplier_quotes (reply_status);
CREATE INDEX idx_supplier_quotes_last_followup ON supplier_quotes (last_followup);

ALTER TABLE supplier_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read supplier quotes" ON supplier_quotes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create supplier quotes" ON supplier_quotes
  FOR INSERT WITH CHECK (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));

CREATE POLICY "Users can update own supplier quotes" ON supplier_quotes
  FOR UPDATE USING (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));

CREATE POLICY "Users can delete own supplier quotes" ON supplier_quotes
  FOR DELETE USING (auth.uid() = (SELECT created_by FROM parts WHERE id = part_id));

CREATE OR REPLACE FUNCTION update_supplier_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_quotes_updated_at
  BEFORE UPDATE ON supplier_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_quotes_updated_at();
