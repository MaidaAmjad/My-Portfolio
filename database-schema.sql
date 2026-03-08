-- Create all tables for the portfolio website

-- Profiles table for user information
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  focus_area TEXT,
  location TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table with proficiency levels
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  proficiency_level INTEGER CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project tags junction table
CREATE TABLE project_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'work',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  certification_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes table for motivational quotes
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Messages table for contact form
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_skills_display_order ON skills(display_order);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_experience_display_order ON experience(display_order);
CREATE INDEX idx_certifications_display_order ON certifications(display_order);
CREATE INDEX idx_quotes_active ON quotes(is_active);
CREATE INDEX idx_quotes_expires_at ON quotes(expires_at);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Public project tags are viewable by everyone" ON project_tags FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone" ON experience FOR SELECT USING (true);
CREATE POLICY "Public certifications are viewable by everyone" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public quotes are viewable by everyone" ON quotes FOR SELECT USING (true);

-- Messages can be inserted by anyone but only read by authenticated users
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can read messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');

-- Admin policies for full access (you'll need to implement authentication)
CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on project_tags" ON project_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on quotes" ON quotes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on messages" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired quotes
CREATE OR REPLACE FUNCTION cleanup_expired_quotes()
RETURNS void AS $$
BEGIN
    DELETE FROM quotes 
    WHERE expires_at < NOW() OR (expires_at IS NULL AND created_at < NOW() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion (you can remove this in production)
INSERT INTO profiles (name, title, bio, focus_area, location, profile_image_url) VALUES
('Alex Rivera', 'Senior AI Engineer', 'I am Alex Rivera, a Senior AI Engineer with over 8 years of experience bridgeing the gap between complex machine learning models and intuitive user interfaces. My journey began at the intersection of mathematics and design, leading me to create systems that don''t just work—they feel magical. Based in San Francisco, I collaborate with global teams to deploy production-ready AI solutions that prioritize privacy, efficiency, and human-centric design.', 'Large Language Models & RAG Systems', 'San Francisco, CA (Remote)', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb8ILWppBCEFSdWLI19-f7RepccaB6jb_vheLf2SjBjI8PvMGpIhT4p55A49VjUidFOTKeRxbqUNhUp8Wb771HIoqZKSCmQGCskc-ksZbM3KhtUh2N5TebfgtkJhBfQLJk_qzAIoDzN8HH4fBaNnAv3MzGYFWmQVCq5ZbfREiyN2d7tFsfHwn10EEoXitYbRuzCD4k3kczv8rJcesPF2Ag3ZZ-w2r9JYMZDQP6GAftSP6bf97ELxzgrUQfP_N9yESDgNrdC2jmOQ');

INSERT INTO skills (name, icon, proficiency_level, category, display_order) VALUES
('Python', '🐍', 95, 'Programming', 1),
('React', '⚛️', 90, 'Frontend', 2),
('Supabase', '⚡', 85, 'Backend', 3),
('PyTorch', '🔥', 92, 'AI/ML', 4);

INSERT INTO projects (title, description, image_url, featured, display_order) VALUES
('AI Chatbot', 'Enterprise-grade support system using GPT-4 and custom vector databases.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-3jL0LnkwumZ31nD2L0mLIp5B7mCyh9IK9hbRwpR04U1lxRAHN7BichLg2epyL2k8zaz872_C5irP5KrbDsdsGu_3Legz3IJmL2nwni_FqQ3KyrVRsOuUicIQz6CY277cMDT2FI24Ygy55l-CZ_EglK2Wji12Ye-Su8mx5A8krRg8MIKfnmw4L_7Yb8RDYTLwQEDf8ygEPKRIU-rDy6fj_xRQHwUIbmFB8eZPFWe7IPvfo9Q1cFe6yftZ73H8mtdOE7Q0XZgc_A', true, 1),
('Portfolio Platform', 'A SaaS solution for developers to host their work with 1-click deployments.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFphw1Ouad7gCfYFFzDMaBzkXNgiFLCM1JWucqzqkHKpMIKivtgJr8M3IF1nuhgvqtB0RLx-OEXEi7mgZr0z2Yr3bNMqnsZqLGodMfYdnFv0R4dSzlPDwk2W3doa2PePikQg6fEs6_L2q4o6Nn3pVKiCKMBjOrFbRry-1yURA-ghFL3VgK1sxB3ybEJa0KLocZNsZqw_OH_jmH2DfOseLrviaUvW2bTmOldW9DwZZmcnte51WUfXkPcT5xThVi7f3PhOWvuMfSxg', true, 2),
('Data Analytics Dashboard', 'Real-time processing engine visualizing millions of data points hourly.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK91QTahpPyzB4fkUqo5Y_5Fic61B3gsMlT33qaWcWF1jgfOkuQ41aD8jsjVAg5elWUmPzDH9LEuMs5bNBC3Ej8sn-hTCTo82QWkddNtCtL7slvXtp9aXRET6Rr6eMvjaZk6smEIYx7VrW5DXcLWxFxN90trSFDGXw8bT_P4ZW7k2vcbEyh2vRzlRdgWDUoo1JbhZDMwTrUIIsHafQUoEHuIa9Jr2WR2tnEYIQugEyx1P9Agg9xf10wDrMtTUpz8GH4bPPzEzu-Q', true, 3);

INSERT INTO project_tags (project_id, tag) VALUES
((SELECT id FROM projects WHERE title = 'AI Chatbot'), 'Python'),
((SELECT id FROM projects WHERE title = 'AI Chatbot'), 'LangChain'),
((SELECT id FROM projects WHERE title = 'Portfolio Platform'), 'Next.js'),
((SELECT id FROM projects WHERE title = 'Portfolio Platform'), 'Supabase'),
((SELECT id FROM projects WHERE title = 'Data Analytics Dashboard'), 'D3.js'),
((SELECT id FROM projects WHERE title = 'Data Analytics Dashboard'), 'AWS');

INSERT INTO experience (title, company, period, description, icon, display_order) VALUES
('Lead Developer', 'TechCorp Inc.', '2021 - Present', 'Leading the AI division in developing autonomous customer success agents using bespoke LLM pipelines.', 'work', 1),
('AI Researcher', 'University AI Lab', '2018 - 2021', 'Published 4 papers on reinforcement learning and optimized neural architecture search for mobile devices.', 'school', 2);

INSERT INTO certifications (name, issuer, date, credential_id, display_order) VALUES
('AWS Certified Machine Learning Specialist', 'Amazon Web Services', '2023', 'MLS-C01', 1),
('Google Cloud Professional AI Engineer', 'Google Cloud', '2022', 'GCP-AIE', 2),
('Microsoft Certified: Azure AI Engineer', 'Microsoft', '2022', 'AI-102', 3);

INSERT INTO quotes (content, author, source, is_active, expires_at) VALUES
('The best way to predict the future is to create it.', 'Peter Drucker', NULL, true, NOW() + INTERVAL '7 days');

-- Cleanup function call (you can set this up as a cron job in Supabase)
-- Automatic cleanup function for expired quotes
CREATE OR REPLACE FUNCTION cleanup_expired_quotes()
RETURNS void AS $$
BEGIN
    DELETE FROM quotes 
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    RAISE NOTICE 'Cleaned up % expired quotes', 
        (SELECT COUNT(*) FROM quotes WHERE expires_at < NOW() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON quotes(expires_at);
CREATE INDEX IF NOT EXISTS idx_quotes_is_active ON quotes(is_active);

-- Run cleanup function
SELECT cleanup_expired_quotes();
