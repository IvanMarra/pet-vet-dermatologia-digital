
-- Criar buckets para diferentes tipos de imagens
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('veterinarian-photos', 'veterinarian-photos', true),
  ('product-images', 'product-images', true),
  ('pet-images', 'pet-images', true),
  ('site-images', 'site-images', true);

-- Políticas para permitir upload e visualização de imagens
CREATE POLICY "Allow public read access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN ('veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated upload" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id IN ('veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated update" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id IN ('veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated delete" 
  ON storage.objects FOR DELETE 
  USING (bucket_id IN ('veterinarian-photos', 'product-images', 'pet-images', 'site-images'));
