CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags (name);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tags" ON tags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = created_by);

CREATE TABLE IF NOT EXISTS entity_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tag_id, entity_type, entity_id)
);

CREATE INDEX idx_entity_tags_tag_id ON entity_tags (tag_id);
CREATE INDEX idx_entity_tags_entity ON entity_tags (entity_type, entity_id);

ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read entity tags" ON entity_tags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create entity tags" ON entity_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own entity tags" ON entity_tags
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity_type TEXT NOT NULL,
  from_entity_id UUID NOT NULL,
  to_entity_type TEXT NOT NULL,
  to_entity_id UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kge_from ON knowledge_graph_edges (from_entity_type, from_entity_id);
CREATE INDEX idx_kge_to ON knowledge_graph_edges (to_entity_type, to_entity_id);
CREATE INDEX idx_kge_relationship ON knowledge_graph_edges (relationship_type);
CREATE INDEX idx_kge_from_to ON knowledge_graph_edges (from_entity_type, from_entity_id, to_entity_type, to_entity_id);

ALTER TABLE knowledge_graph_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read graph edges" ON knowledge_graph_edges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create graph edges" ON knowledge_graph_edges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete graph edges" ON knowledge_graph_edges
  FOR DELETE USING (auth.role() = 'authenticated');
