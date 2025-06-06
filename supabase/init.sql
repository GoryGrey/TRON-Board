-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  chinese_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create post_tags table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (post_id, tag)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users are viewable by everyone" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Boards table policies
CREATE POLICY "Boards are viewable by everyone" ON boards
FOR SELECT USING (true);

-- Posts table policies
CREATE POLICY "Posts are viewable by everyone" ON posts
FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON posts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON posts
FOR DELETE USING (auth.uid() = user_id);

-- Comments table policies
CREATE POLICY "Comments are viewable by everyone" ON comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
FOR DELETE USING (auth.uid() = user_id);

-- Post tags policies
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
FOR SELECT USING (true);

CREATE POLICY "Users can add tags to their own posts" ON post_tags
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM posts WHERE id = post_id
  )
);

CREATE POLICY "Users can delete tags from their own posts" ON post_tags
FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM posts WHERE id = post_id
  )
);

-- Insert some sample boards
INSERT INTO public.boards (name, chinese_name, description)
VALUES 
('Crypto General', '加密货币综合', 'General discussion about cryptocurrencies, blockchain technology, and the market.'),
('DeFi', '去中心化金融', 'Discuss decentralized finance protocols, yield farming, liquidity mining, and more.'),
('NFTs & Collectibles', '非同质化代币', 'Share and discuss NFT projects, digital art, and collectibles in the blockchain space.'),
('DAOs & Governance', '去中心化自治组织', 'Discussions about decentralized autonomous organizations and governance models.'),
('Blockchain Tech', '区块链技术', 'Technical discussions about blockchain development, protocols, and infrastructure.'),
('Crypto Gaming', '加密游戏', 'Talk about blockchain games, play-to-earn, and the future of gaming in Web3.'),
('Metaverse', '元宇宙', 'Discussions about virtual worlds, digital identity, and the metaverse ecosystem.'),
('Wallets & Security', '钱包与安全', 'Tips, questions, and discussions about crypto wallets and security best practices.'),
('New Projects', '新项目', 'Discover and discuss new and upcoming blockchain projects and tokens.')
ON CONFLICT DO NOTHING;
