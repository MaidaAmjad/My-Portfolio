-- Admin settings (key-value) for dashboard password and reset tokens.
-- Run this in Supabase SQL Editor if you don't use Supabase CLI migrations.

create table if not exists admin_settings (
  key text primary key,
  value text
);
