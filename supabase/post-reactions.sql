-- Create post_dislikes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_dislikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Add dislike_count column to posts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'dislike_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN dislike_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create function to increment post dislikes
CREATE OR REPLACE FUNCTION increment_post_dislikes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET dislike_count = COALESCE(dislike_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement post dislikes
CREATE OR REPLACE FUNCTION decrement_post_dislikes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET dislike_count = GREATEST(COALESCE(dislike_count, 0) - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update dislike_count when a dislike is added
CREATE OR REPLACE FUNCTION update_post_dislike_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM increment_post_dislikes(NEW.post_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM decrement_post_dislikes(OLD.post_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on post_dislikes table
DROP TRIGGER IF EXISTS post_dislikes_count_trigger ON post_dislikes;
CREATE TRIGGER post_dislikes_count_trigger
AFTER INSERT OR DELETE ON post_dislikes
FOR EACH ROW
EXECUTE FUNCTION update_post_dislike_count();
