/*
  # 混雑状況管理システムのデータベーススキーマ

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, 店舗名)
      - `address` (text, 住所)
      - `genre` (text, ジャンル)
      - `business_hours` (text, 営業時間)
      - `price_range` (text, 価格帯)
      - `latitude` (numeric, 緯度)
      - `longitude` (numeric, 経度)
      - `image_url` (text, 画像URL)
      - `description` (text, 説明)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `congestion_statuses`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `status` (text, 混雑状況)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
    
    - `hash_tags`
      - `id` (uuid, primary key)
      - `name` (text, タグ名)
      - `description` (text, 説明)
      - `color` (text, 色)
      - `created_at` (timestamptz)
    
    - `store_tags`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `tag_id` (uuid, foreign key to hash_tags)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert/update their own data
    - Add policies for public read access to stores and tags

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for filtering operations
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  genre text NOT NULL,
  business_hours text NOT NULL,
  price_range text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create congestion_statuses table
CREATE TABLE IF NOT EXISTS congestion_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('empty', 'somewhat-crowded', 'full')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create hash_tags table
CREATE TABLE IF NOT EXISTS hash_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create store_tags table
CREATE TABLE IF NOT EXISTS store_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES hash_tags(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, tag_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE congestion_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hash_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_tags ENABLE ROW LEVEL SECURITY;

-- Policies for stores table
CREATE POLICY "Anyone can read stores"
  ON stores
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for congestion_statuses table
CREATE POLICY "Anyone can read congestion statuses"
  ON congestion_statuses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert congestion statuses"
  ON congestion_statuses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own congestion statuses"
  ON congestion_statuses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for hash_tags table
CREATE POLICY "Anyone can read hash tags"
  ON hash_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert hash tags"
  ON hash_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for store_tags table
CREATE POLICY "Anyone can read store tags"
  ON store_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert store tags"
  ON store_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own store tags"
  ON store_tags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_congestion_statuses_store_id ON congestion_statuses(store_id);
CREATE INDEX IF NOT EXISTS idx_congestion_statuses_created_at ON congestion_statuses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_congestion_statuses_store_created ON congestion_statuses(store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_tags_store_id ON store_tags(store_id);
CREATE INDEX IF NOT EXISTS idx_store_tags_tag_id ON store_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_stores_genre ON stores(genre);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);

-- Create a function to get the latest congestion status for each store
CREATE OR REPLACE FUNCTION get_latest_congestion_statuses()
RETURNS TABLE (
  store_id uuid,
  status text,
  created_at timestamptz,
  user_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (cs.store_id)
    cs.store_id,
    cs.status,
    cs.created_at,
    cs.user_id
  FROM congestion_statuses cs
  ORDER BY cs.store_id, cs.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get store tag counts
CREATE OR REPLACE FUNCTION get_tag_counts()
RETURNS TABLE (
  tag_id uuid,
  tag_name text,
  store_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ht.id as tag_id,
    ht.name as tag_name,
    COUNT(DISTINCT st.store_id) as store_count
  FROM hash_tags ht
  LEFT JOIN store_tags st ON ht.id = st.tag_id
  GROUP BY ht.id, ht.name
  ORDER BY store_count DESC, ht.name;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO stores (id, name, address, genre, business_hours, price_range, latitude, longitude, image_url, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'らーめん太郎', '神奈川県横浜市港北区日吉本町1-5-26', 'ラーメン', '11:00-22:00', '¥500-¥1,000', 35.5555, 139.6503, 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400', '昔ながらの醤油ラーメンが自慢の老舗店'),
('550e8400-e29b-41d4-a716-446655440002', 'カフェ・ド・ヒヨシ', '神奈川県横浜市港北区日吉本町1-3-15', 'カフェ', '8:00-20:00', '¥300-¥1,500', 35.5557, 139.6501, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', '落ち着いた雰囲気で勉強にも最適'),
('550e8400-e29b-41d4-a716-446655440003', '焼肉キング', '神奈川県横浜市港北区日吉本町1-7-8', '焼肉', '17:00-24:00', '¥2,000-¥4,000', 35.5553, 139.6505, 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400', 'コスパ抜群の焼肉食べ放題'),
('550e8400-e29b-41d4-a716-446655440004', 'サクッと弁当', '神奈川県横浜市港北区日吉本町1-2-3', '弁当', '6:00-22:00', '¥300-¥800', 35.5559, 139.6499, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', '忙しい学生にぴったりの手作り弁当'),
('550e8400-e29b-41d4-a716-446655440005', 'ひとり飯の店', '神奈川県横浜市港北区日吉本町1-9-12', '定食', '11:00-23:00', '¥600-¥1,200', 35.5551, 139.6507, 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400', '一人でも気軽に入れる定食屋'),
('550e8400-e29b-41d4-a716-446655440006', '夜更かし食堂', '神奈川県横浜市港北区日吉本町1-4-7', '居酒屋', '18:00-3:00', '¥1,000-¥3,000', 35.5556, 139.6502, 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400', '深夜まで営業の学生御用達店');

INSERT INTO hash_tags (id, name, description, color) VALUES
('660e8400-e29b-41d4-a716-446655440001', '#ガッツリ飯', 'ボリューム満点の食事', '#FF6B35'),
('660e8400-e29b-41d4-a716-446655440002', '#サクッとランチ', '素早く食べられるランチ', '#4ECDC4'),
('660e8400-e29b-41d4-a716-446655440003', '#今日の麺', 'ラーメン・うどん・そば', '#6C5CE7'),
('660e8400-e29b-41d4-a716-446655440004', '#ぼっち飯歓迎', '一人でも入りやすい', '#A8E6CF'),
('660e8400-e29b-41d4-a716-446655440005', '#深夜まで営業', '夜遅くまで開いている', '#FFD93D'),
('660e8400-e29b-41d4-a716-446655440006', '#勉強できる', '勉強スペースあり', '#FF8B94'),
('660e8400-e29b-41d4-a716-446655440007', '#コスパ最高', '値段が安くて美味しい', '#B4E7CE'),
('660e8400-e29b-41d4-a716-446655440008', '#テイクアウト可', '持ち帰り可能', '#C7CEEA');