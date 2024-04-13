-- Seed data for auth.users table
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, is_anonymous)
VALUES
  ('a8f2c6e4-b2df-4f8c-9d3a-1b6f5e8d7c9b', 'user1@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('b7e3d5f1-c8a9-4d2b-8f6a-2e9d1c7b5a3f', 'user2@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('c6d4e2f8-b1a7-4c9d-9e8b-3d7a1f6c5b4e', 'user3@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('d5e1f7c9-a2b6-4d8c-8e7a-4b2d1f9c6e3a', 'user4@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('e4f1d6c8-b2a7-4c9d-9e8b-3d7a1f6c5b4e', 'user5@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('f3e8d1c7-a2b6-4d8c-8e7a-4b2d1f9c6e3a', 'user6@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('2d7e1c6b-2a74-4c9d-9e8b-3d7a1f6c5b4e', 'user7@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('1c6d4e2a-2b64-4d8c-8e7a-4b2d1f9c6e3a', 'user8@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('9b5c3d1b-2a74-4c9d-9e8b-3d7a1f6c5b4e', 'user9@example.com', crypt('password', gen_salt('bf')), NOW(), false),
  ('8a4b2c1a-2b64-4d8c-8e7a-4b2d1f9c6e3a', 'user10@example.com', crypt('password', gen_salt('bf')), NOW(), false);

-- Seed data for public.profile table
INSERT INTO public.profile (user_id, display_name, total_experience)
VALUES
  ('a8f2c6e4-b2df-4f8c-9d3a-1b6f5e8d7c9b', 'User1', 100),
  ('b7e3d5f1-c8a9-4d2b-8f6a-2e9d1c7b5a3f', 'User2', 200),
  ('c6d4e2f8-b1a7-4c9d-9e8b-3d7a1f6c5b4e', 'User3', 300),
  ('d5e1f7c9-a2b6-4d8c-8e7a-4b2d1f9c6e3a', 'User4', 400),
  ('e4f1d6c8-b2a7-4c9d-9e8b-3d7a1f6c5b4e', 'User5', 500),
  ('f3e8d1c7-a2b6-4d8c-8e7a-4b2d1f9c6e3a', 'User6', 600),
  ('2d7e1c6b-2a74-4c9d-9e8b-3d7a1f6c5b4e', 'User7', 700),
  ('1c6d4e2a-2b64-4d8c-8e7a-4b2d1f9c6e3a', 'User8', 800),
  ('9b5c3d1b-2a74-4c9d-9e8b-3d7a1f6c5b4e', 'User9', 900),
  ('8a4b2c1a-2b64-4d8c-8e7a-4b2d1f9c6e3a', 'User10', 1000);

-- Seed data for public.github_integration table
INSERT INTO public.github_integration (github_name, github_id, user_id, commit_count)
VALUES
  ('user1', 'gh1', 'a8f2c6e4-b2df-4f8c-9d3a-1b6f5e8d7c9b', 10),
  ('user2', 'gh2', 'b7e3d5f1-c8a9-4d2b-8f6a-2e9d1c7b5a3f', 20),
  ('user3', 'gh3', 'c6d4e2f8-b1a7-4c9d-9e8b-3d7a1f6c5b4e', 30),
  ('user4', 'gh4', 'd5e1f7c9-a2b6-4d8c-8e7a-4b2d1f9c6e3a', 40),
  ('user5', 'gh5', 'e4f1d6c8-b2a7-4c9d-9e8b-3d7a1f6c5b4e', 50);

-- Seed data for public.experience_events table
INSERT INTO public.experience_events (name, experience_value)
VALUES
  ('Event1', 100),
  ('Event2', 200),
  ('Event3', 300),
  ('Event4', 400),
  ('Event5', 500);