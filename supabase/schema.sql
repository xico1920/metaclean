-- ============================================================
-- MetaClean — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- PROFILES (created automatically on signup via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email                 TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  images_used_today     INT NOT NULL DEFAULT 0,
  last_reset_date       DATE DEFAULT CURRENT_DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSION HISTORY
CREATE TABLE IF NOT EXISTS conversion_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  filename    TEXT,
  platform    TEXT,
  formats     TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PRESETS
CREATE TABLE IF NOT EXISTS presets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name        TEXT NOT NULL,
  platform    TEXT NOT NULL,
  formats     TEXT[] NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;

-- Profiles: users see/edit only their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- History: users see/insert only their own
CREATE POLICY "history_select" ON conversion_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON conversion_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Presets: users manage only their own
CREATE POLICY "presets_all" ON presets FOR ALL USING (auth.uid() = user_id);

-- ── Auto-create profile on signup ─────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Indexes ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_history_user_id ON conversion_history (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe ON profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles (stripe_subscription_id);
