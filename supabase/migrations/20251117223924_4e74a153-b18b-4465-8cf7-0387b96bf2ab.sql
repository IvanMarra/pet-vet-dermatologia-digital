-- Migrar imagens existentes para a nova estrutura de múltiplas imagens
INSERT INTO public.pet_gallery_images (pet_gallery_id, image_url, display_order)
SELECT 
  id as pet_gallery_id,
  COALESCE(image_with_watermark, image_url) as image_url,
  0 as display_order
FROM public.pet_gallery
WHERE (image_url IS NOT NULL OR image_with_watermark IS NOT NULL)
  AND id NOT IN (SELECT DISTINCT pet_gallery_id FROM public.pet_gallery_images)
ON CONFLICT DO NOTHING;