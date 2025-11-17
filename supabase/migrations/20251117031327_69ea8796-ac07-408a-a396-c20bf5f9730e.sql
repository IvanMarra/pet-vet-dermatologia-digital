-- Create pet_transformations table
CREATE TABLE public.pet_transformations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name TEXT NOT NULL,
  description TEXT NOT NULL,
  treatment_duration TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pet_transformations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to active transformations"
ON public.pet_transformations
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage transformations"
ON public.pet_transformations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pet_transformations_updated_at
BEFORE UPDATE ON public.pet_transformations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();