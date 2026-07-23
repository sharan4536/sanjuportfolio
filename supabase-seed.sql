-- Run this to insert the remaining seed data (skip admin_users which already exists)

INSERT INTO site_settings (id, hero_overline, hero_title_line1, hero_title_line2, hero_subtitle, footer_text)
VALUES (1, 'Emerging Artist · India', 'Sanjuktha', 'Reddy', 'Exploring the boundaries between colour, emotion, and form — one brushstroke at a time.', '© 2025 Sanjuktha Reddy. All rights reserved.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO about_content (id, paragraphs, quote, image_url)
VALUES (1,
  '["I''m a 17-year-old artist from India with a deep passion for bringing the world around me to life on canvas and paper. My journey with art began as a child, sketching in the margins of school notebooks, and has blossomed into a dedicated pursuit of visual storytelling.", "My work spans watercolors, oils, acrylics, charcoal, and ink — each medium offering a unique voice to express the emotions and landscapes that inspire me. From the quiet serenity of a lotus pond at dawn to the vibrant energy of a bustling street, I strive to capture the poetry in everyday moments.", "I''m currently pursuing my studies while continuing to develop my artistic voice. My goal is to one day study fine arts at a leading institution and share my perspective with the world through exhibitions and collaborations."]'::jsonb,
  'Every canvas is a journey — from the first brushstroke to the last, I lose myself in the colours and find something new.',
  'images/painting_garden.png')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_info (id, email, instagram, behance)
VALUES (1, 'sanjuktha@email.com', 'https://instagram.com', 'https://behance.net')
ON CONFLICT (id) DO NOTHING;

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

INSERT INTO education (year_period, title, institution, description, sort_order) VALUES
  ('2024 – Present', 'Senior Secondary (Class XI–XII)', 'Currently Pursuing', 'Focusing on arts and humanities while continuing to develop my portfolio with advanced painting techniques and mixed media exploration.', 1),
  ('2023', 'Advanced Art Workshop', 'Summer Intensive Program', 'Completed an intensive workshop in oil painting, colour theory, and figure drawing under the mentorship of professional artists.', 2),
  ('2022', 'First Art Exhibition', 'School & Local Gallery', 'Showcased a series of watercolor landscapes and charcoal portraits at a school exhibition, receiving the Best Young Artist award.', 3),
  ('2020 – 2024', 'Secondary School (Class VI–X)', 'High School, India', 'Developed foundational art skills through dedicated classes and self-study, exploring various mediums including pencil, charcoal, watercolor, and acrylic.', 4),
  ('2019', 'Formal Art Training Begins', 'Private Art Classes', 'Started formal training in classical drawing, perspective, and painting fundamentals that laid the groundwork for my artistic practice.', 5);

INSERT INTO achievements (number_value, label, sort_order) VALUES
  ('50+', 'Artworks Created', 1),
  ('5', 'Exhibitions', 2),
  ('3', 'Awards Won', 3);
