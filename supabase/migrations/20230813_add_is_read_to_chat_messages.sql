-- Add is_read column to chat_messages table
ALTER TABLE chat_messages 
ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;

-- Create an index for faster querying of unread messages
CREATE INDEX idx_chat_messages_is_read ON chat_messages(is_read);

-- Create or replace function to update chat updated_at
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update chat updated_at when a message is inserted
DROP TRIGGER IF EXISTS update_chat_timestamp ON chat_messages;
CREATE TRIGGER update_chat_timestamp
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();
