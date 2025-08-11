-- Migration: Voeg last_login kolom toe aan profiles
ALTER TABLE profiles ADD COLUMN last_login timestamp;
