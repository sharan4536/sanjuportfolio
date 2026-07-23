-- ===================================================
-- SANJUKTHA REDDY PORTFOLIO — SUPABASE DATABASE SETUP
-- Run this in your Supabase SQL Editor
-- ===================================================

-- 1. ARTWORKS TABLE
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  medium TEXT,
  year TEXT,
  category TEXT DEFAULT 'painting' CHECK (category IN ('painting', 'drawing')),
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE artworks DISABLE ROW LEVEL SECURITY;

-- 2. ABOUT CONTENT TABLE (single-row)
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  paragraphs JSONB DEFAULT '[]'::jsonb,
  quote TEXT,
  image_url TEXT
);

ALTER TABLE about_content DISABLE ROW LEVEL SECURITY;

-- 3. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year_period TEXT NOT NULL,
  title TEXT NOT NULL,
  institution TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE education DISABLE ROW LEVEL SECURITY;

-- 4. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number_value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;

-- 5. SITE SETTINGS TABLE (single-row)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_overline TEXT,
  hero_title_line1 TEXT,
  hero_title_line2 TEXT,
  hero_subtitle TEXT,
  footer_text TEXT
);

ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 6. CONTACT INFO TABLE (single-row)
CREATE TABLE IF NOT EXISTS contact_info (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email TEXT,
  instagram TEXT,
  behance TEXT
);

ALTER TABLE contact_info DISABLE ROW LEVEL SECURITY;

-- 7. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- SEED DEFAULT DATA
-- ===================================================

-- Admin user (username: sanjuktha, password: sanjuktha2025)
INSERT INTO admin_users (username, password) VALUES ('sanjuktha', 'sanjuktha2025');

-- Site settings
INSERT INTO site_settings (id, hero_overline, hero_title_line1, hero_title_line2, hero_subtitle, footer_text)
VALUES (1,
  'Emerging Artist · India',
  'Sanjuktha',
  'Reddy',
  'Exploring the boundaries between colour, emotion, and form — one brushstroke at a time.',
  '© 2025 Sanjuktha Reddy. All rights reserved.'
);

-- About content
INSERT INTO about_content (id, paragraphs, quote, image_url)
VALUES (1,
  '["I''m a 17-year-old artist from India with a deep passion for bringing the world around me to life on canvas and paper. My journey with art began as a child, sketching in the margins of school notebooks, and has blossomed into a dedicated pursuit of visual storytelling.", "My work spans watercolors, oils, acrylics, charcoal, and ink — each medium offering a unique voice to express the emotions and landscapes that inspire me. From the quiet serenity of a lotus pond at dawn to the vibrant energy of a bustling street, I strive to capture the poetry in everyday moments.", "I''m currently pursuing my studies while continuing to develop my artistic voice. My goal is to one day study fine arts at a leading institution and share my perspective with the world through exhibitions and collaborations."]'::jsonb,
  'Every canvas is a journey — from the first brushstroke to the last, I lose myself in the colours and find something new.',
  'images/painting_garden.png'
);

-- Contact info
INSERT INTO contact_info (id, email, instagram, behance)
VALUES (1, 'sanjuktha@email.com', 'https://instagram.com', 'https://behance.net');

-- Artworks
INSERT INTO artworks (title, medium, year, category, image_url, featured, sort_order) VALUES
  ('Dawn at the Lotus Pond', 'Watercolor on Paper', '2025', 'painting', 'images/painting_lotus_pond.png', true, 1),
  ('Quiet Contemplation', 'Charcoal on Paper', '2025', 'drawing', 'images/drawing_portrait.png', true, 2),
  ('The Old Quarter', 'Oil on Canvas', '2025', 'painting', 'images/painting_street_scene.png', false, 3),
  ('Oceanic Dreams', 'Acrylic on Canvas', '2025', 'painting', 'images/painting_abstract.png', true, 4),
  ('Spring Song', 'Ink & Wash', '2024', 'drawing', 'images/drawing_birds.png', false, 5),
  ('Golden Hour', 'Oil on Canvas', '2024', 'painting', 'images/painting_sunset.png', true, 6),
  ('Study of Hands', 'Graphite on Paper', '2024', 'drawing', 'images/drawing_hands.png', false, 7),
  ('The Secret Garden', 'Watercolor on Paper', '2024', 'painting', 'images/painting_garden.png', true, 8),
  ('Still Life Study', 'Graphite on Paper', '2024', 'drawing', 'images/drawing_still_life.png', false, 9);

-- Education
INSERT INTO education (year_period, title, institution, description, sort_order) VALUES
  ('2024 – Present', 'Senior Secondary (Class XI–XII)', 'Currently Pursuing', 'Focusing on arts and humanities while continuing to develop my portfolio with advanced painting techniques and mixed media exploration.', 1),
  ('2023', 'Advanced Art Workshop', 'Summer Intensive Program', 'Completed an intensive workshop in oil painting, colour theory, and figure drawing under the mentorship of professional artists.', 2),
  ('2022', 'First Art Exhibition', 'School & Local Gallery', 'Showcased a series of watercolor landscapes and charcoal portraits at a school exhibition, receiving the Best Young Artist award.', 3),
  ('2020 – 2024', 'Secondary School (Class VI–X)', 'High School, India', 'Developed foundational art skills through dedicated classes and self-study, exploring various mediums including pencil, charcoal, watercolor, and acrylic.', 4),
  ('2019', 'Formal Art Training Begins', 'Private Art Classes', 'Started formal training in classical drawing, perspective, and painting fundamentals that laid the groundwork for my artistic practice.', 5);

-- Achievements
INSERT INTO achievements (number_value, label, sort_order) VALUES
  ('50+', 'Artworks Created', 1),
  ('5', 'Exhibitions', 2),
  ('3', 'Awards Won', 3);
