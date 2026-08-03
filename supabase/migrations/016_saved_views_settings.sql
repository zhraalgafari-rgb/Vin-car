CREATE TABLE IF NOT EXISTS saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  sort JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_views_user_id ON saved_views (user_id);

ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved views" ON saved_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved views" ON saved_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved views" ON saved_views
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved views" ON saved_views
  FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
