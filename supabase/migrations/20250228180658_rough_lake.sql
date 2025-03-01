/*
  # Initial schema for Open House App

  1. New Tables
    - `profiles` - User profiles for real estate agents
    - `open_houses` - Property listings and open house events
    - `visitors` - People who visit open houses
    - `questions` - Questions for visitor sign-in forms
    - `answers` - Visitor responses to questions
    - `notifications` - System notifications for agents

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create open_houses table
CREATE TABLE IF NOT EXISTS open_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  square_feet INTEGER,
  price NUMERIC(12,2),
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'past')) DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_house_id UUID REFERENCES open_houses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  check_in_time TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('hot', 'warm', 'cold')) DEFAULT 'warm',
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'multiple_choice', 'yes_no')) DEFAULT 'text',
  options JSONB, -- For multiple choice questions
  category TEXT CHECK (category IN ('buyer', 'seller', 'investor', 'renter', 'custom')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT CHECK (type IN ('visitor_checkin', 'lead_update', 'open_house_reminder', 'system')) NOT NULL,
  related_id UUID, -- Can reference a visitor, open house, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Open Houses policies
CREATE POLICY "Agents can view their own open houses"
  ON open_houses
  FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create their own open houses"
  ON open_houses
  FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own open houses"
  ON open_houses
  FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own open houses"
  ON open_houses
  FOR DELETE
  TO authenticated
  USING (agent_id = auth.uid());

-- Visitors policies
CREATE POLICY "Agents can view visitors for their open houses"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (
    open_house_id IN (
      SELECT id FROM open_houses WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can create visitors for their open houses"
  ON visitors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    open_house_id IN (
      SELECT id FROM open_houses WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update visitors for their open houses"
  ON visitors
  FOR UPDATE
  TO authenticated
  USING (
    open_house_id IN (
      SELECT id FROM open_houses WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can delete visitors for their open houses"
  ON visitors
  FOR DELETE
  TO authenticated
  USING (
    open_house_id IN (
      SELECT id FROM open_houses WHERE agent_id = auth.uid()
    )
  );

-- Questions policies
CREATE POLICY "Anyone can view questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Answers policies
CREATE POLICY "Agents can view answers for their visitors"
  ON answers
  FOR SELECT
  TO authenticated
  USING (
    visitor_id IN (
      SELECT v.id FROM visitors v
      JOIN open_houses oh ON v.open_house_id = oh.id
      WHERE oh.agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can create answers for their visitors"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    visitor_id IN (
      SELECT v.id FROM visitors v
      JOIN open_houses oh ON v.open_house_id = oh.id
      WHERE oh.agent_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid());

-- Create function for open house performance analytics
CREATE OR REPLACE FUNCTION get_open_house_performance()
RETURNS TABLE (
  open_house_id UUID,
  address TEXT,
  date DATE,
  total_visitors INTEGER,
  hot_leads INTEGER,
  warm_leads INTEGER,
  cold_leads INTEGER,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oh.id as open_house_id,
    oh.address,
    oh.date,
    COUNT(v.id)::INTEGER as total_visitors,
    COUNT(v.id) FILTER (WHERE v.status = 'hot')::INTEGER as hot_leads,
    COUNT(v.id) FILTER (WHERE v.status = 'warm')::INTEGER as warm_leads,
    COUNT(v.id) FILTER (WHERE v.status = 'cold')::INTEGER as cold_leads,
    CASE 
      WHEN COUNT(v.id) > 0 THEN 
        (COUNT(v.id) FILTER (WHERE v.status = 'hot')::NUMERIC / COUNT(v.id)::NUMERIC) * 100
      ELSE 0
    END as conversion_rate
  FROM 
    open_houses oh
  LEFT JOIN 
    visitors v ON oh.id = v.open_house_id
  WHERE 
    oh.agent_id = auth.uid()
  GROUP BY 
    oh.id, oh.address, oh.date
  ORDER BY 
    oh.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default questions
INSERT INTO questions (text, type, category)
VALUES 
  ('Are you currently in the market to buy a home?', 'yes_no', 'buyer'),
  ('Have you been pre-approved for a mortgage?', 'yes_no', 'buyer'),
  ('What is your budget range?', 'multiple_choice', 'buyer'),
  ('How soon are you looking to purchase?', 'multiple_choice', 'buyer'),
  ('Are you looking to sell your home soon?', 'multiple_choice', 'seller'),
  ('Have you had a recent home appraisal?', 'yes_no', 'seller'),
  ('Are you working with an agent to sell your property?', 'yes_no', 'seller'),
  ('What is your timeline for selling?', 'multiple_choice', 'seller'),
  ('Are you an active real estate investor?', 'multiple_choice', 'investor'),
  ('What type of properties are you interested in?', 'multiple_choice', 'investor'),
  ('What is your investment strategy?', 'multiple_choice', 'investor'),
  ('How many properties do you currently own?', 'multiple_choice', 'investor'),
  ('Are you currently looking for a rental property?', 'yes_no', 'renter'),
  ('What lease length are you considering?', 'multiple_choice', 'renter'),
  ('What is your monthly budget for rent?', 'multiple_choice', 'renter'),
  ('When do you need to move in?', 'multiple_choice', 'renter');

-- Update options for multiple choice questions
UPDATE questions 
SET options = '["<$250K", "$250K-$500K", "$500K-$750K", "$750K+"]'::jsonb
WHERE text = 'What is your budget range?';

UPDATE questions 
SET options = '["Immediately", "1-3 months", "3-6 months", "6+ months"]'::jsonb
WHERE text = 'How soon are you looking to purchase?';

UPDATE questions 
SET options = '["Yes", "No", "Considering in the future"]'::jsonb
WHERE text = 'Are you looking to sell your home soon?';

UPDATE questions 
SET options = '["Immediately", "1-3 months", "3-6 months", "6+ months"]'::jsonb
WHERE text = 'What is your timeline for selling?';

UPDATE questions 
SET options = '["Yes", "No", "Just starting"]'::jsonb
WHERE text = 'Are you an active real estate investor?';

UPDATE questions 
SET options = '["Single-family", "Multi-family", "Commercial", "Land", "Other"]'::jsonb
WHERE text = 'What type of properties are you interested in?';

UPDATE questions 
SET options = '["Buy and hold", "Fix and flip", "BRRRR", "Wholesaling", "Other"]'::jsonb
WHERE text = 'What is your investment strategy?';

UPDATE questions 
SET options = '["None", "1-5", "6-10", "11+"]'::jsonb
WHERE text = 'How many properties do you currently own?';

UPDATE questions 
SET options = '["6 months", "12 months", "18+ months", "Flexible"]'::jsonb
WHERE text = 'What lease length are you considering?';

UPDATE questions 
SET options = '["<$1000", "$1000-$1500", "$1500-$2000", "$2000-$2500", "$2500+"]'::jsonb
WHERE text = 'What is your monthly budget for rent?';

UPDATE questions 
SET options = '["Immediately", "Within 30 days", "1-2 months", "3+ months"]'::jsonb
WHERE text = 'When do you need to move in?';