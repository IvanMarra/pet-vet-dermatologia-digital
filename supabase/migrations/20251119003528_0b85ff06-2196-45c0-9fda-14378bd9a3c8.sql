-- Add is_public column to site_settings for security
ALTER TABLE public.site_settings 
ADD COLUMN is_public BOOLEAN DEFAULT false;

-- Mark public settings (reCAPTCHA site key is meant to be public)
UPDATE public.site_settings 
SET is_public = true 
WHERE key IN ('recaptcha_site_key');

-- Drop the old public read policy
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;

-- Create new policy for public settings only
CREATE POLICY "Public can read public settings"
  ON public.site_settings
  FOR SELECT
  USING (is_public = true);

-- Admins can read all settings
CREATE POLICY "Admins can read all settings"
  ON public.site_settings
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));