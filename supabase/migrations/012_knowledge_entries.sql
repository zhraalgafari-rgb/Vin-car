CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('ocr', 'ai_extraction', 'manual', 'conversation', 'document')),
  source_id UUID,
  source_table TEXT,
  entities JSONB DEFAULT '{}',
  embedding vector(1536),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_knowledge_entries_source ON knowledge_entries (source_table, source_id);
CREATE INDEX idx_knowledge_entries_embedding ON knowledge_entries USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_knowledge_entries_entities ON knowledge_entries USING GIN (entities);
CREATE INDEX idx_knowledge_entries_fts ON knowledge_entries USING GIN (to_tsvector('english', title || ' ' || content));

ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read knowledge entries" ON knowledge_entries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create knowledge entries" ON knowledge_entries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
