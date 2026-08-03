CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'supplier_overdue', 'quotation_delayed', 'customer_waiting',
    'followup_due', 'shipment_arrived', 'task_required', 'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (user_id, read);
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);
