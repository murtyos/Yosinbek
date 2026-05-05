CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$ BEGIN
  CREATE TYPE main_role AS ENUM ('AWPer', 'Rifler');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE sub_role AS ENUM ('IGL', 'Support', 'Anchor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE player_status AS ENUM ('active', 'benched', 'free_agent', 'retired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  nationality TEXT NOT NULL,
  birth_date DATE,
  age_estimate INT,
  main_role main_role NOT NULL,
  sub_role sub_role,
  team TEXT,
  status player_status NOT NULL,
  major_appearances INT NOT NULL DEFAULT 0,
  hltv_url TEXT NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_nickname ON players (nickname);
CREATE INDEX IF NOT EXISTS idx_players_nickname_trgm ON players USING gin (nickname gin_trgm_ops);
