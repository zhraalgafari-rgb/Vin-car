CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin_id UUID REFERENCES vin_records(id) ON DELETE SET NULL,
  part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'telegram', 'email', 'voice', 'internal_note')),
  title TEXT,
  participants UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_vin_id ON conversations (vin_id);
CREATE INDEX idx_conversations_part_id ON conversations (part_id);
CREATE INDEX idx_conversations_supplier_id ON conversations (supplier_id);
CREATE INDEX idx_conversations_customer_id ON conversations (customer_id);
CREATE INDEX idx_conversations_channel ON conversations (channel);
CREATE INDEX idx_conversations_created_by ON conversations (created_by);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read conversations" ON conversations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own conversations" ON conversations
  FOR DELETE USING (auth.uid() = created_by);
