CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  vin_id UUID REFERENCES vin_records(id) ON DELETE SET NULL,
  part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new_request' CHECK (status IN (
    'new_request', 'under_review', 'ai_analysis_completed', 'sent_to_supplier',
    'waiting_for_supplier_response', 'quotation_received', 'price_approved',
    'purchase_confirmed', 'production', 'shipping', 'arrived', 'delivered',
    'completed', 'cancelled'
  )),
  status_history JSONB DEFAULT '[]',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_vin_id ON orders (vin_id);
CREATE INDEX idx_orders_part_id ON orders (part_id);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_supplier_id ON orders (supplier_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_by ON orders (created_by);
CREATE INDEX idx_orders_updated_at ON orders (updated_at);
CREATE INDEX idx_orders_status_updated ON orders (status, updated_at);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any orders" ON orders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can delete own orders" ON orders
  FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
