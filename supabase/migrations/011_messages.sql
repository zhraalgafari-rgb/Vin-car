CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'supplier', 'internal', 'system')),
  content TEXT,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'voice', 'document', 'location')),
  media_path TEXT,
  timestamp TIMESTAMPTZ,
  ocr_extracted_text TEXT,
  ai_summary TEXT,
  ai_entities JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX idx_messages_timestamp ON messages (timestamp);
CREATE INDEX idx_messages_sender_type ON messages (sender_type);
CREATE INDEX idx_messages_ai_entities ON messages USING GIN (ai_entities);
CREATE INDEX idx_messages_fts ON messages USING GIN (to_tsvector('english', content));

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read messages" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create messages" ON messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = (
    SELECT created_by FROM conversations WHERE id = conversation_id
  ));

CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE USING (auth.uid() = (
    SELECT created_by FROM conversations WHERE id = conversation_id
  ));
