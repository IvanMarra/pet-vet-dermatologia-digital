-- Create pet_gallery_images table for multiple images per pet
CREATE TABLE IF NOT EXISTS public.pet_gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_gallery_id UUID NOT NULL REFERENCES public.pet_gallery(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pet_gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for pet_gallery_images
CREATE POLICY "Admins can manage pet_gallery_images"
  ON public.pet_gallery_images
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow public read access to pet_gallery_images"
  ON public.pet_gallery_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pet_gallery
      WHERE pet_gallery.id = pet_gallery_images.pet_gallery_id
      AND pet_gallery.is_active = true
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_pet_gallery_images_updated_at
  BEFORE UPDATE ON public.pet_gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_pet_gallery_images_pet_id ON public.pet_gallery_images(pet_gallery_id);
CREATE INDEX idx_pet_gallery_images_order ON public.pet_gallery_images(pet_gallery_id, display_order);