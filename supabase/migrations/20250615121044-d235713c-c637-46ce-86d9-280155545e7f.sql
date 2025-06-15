
-- Add a location (text), phone_number (text, nullable), and device_type (text) to website_analytics table
ALTER TABLE public.website_analytics ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.website_analytics ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.website_analytics ADD COLUMN IF NOT EXISTS device_type TEXT;
