
-- Criar buckets apenas se não existirem
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('hero-images', 'hero-images', true),
  ('veterinarian-photos', 'veterinarian-photos', true),
  ('product-images', 'product-images', true),
  ('pet-images', 'pet-images', true),
  ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas apenas se não existirem (usando DROP IF EXISTS primeiro)
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- Recriar as políticas
CREATE POLICY "Allow public read access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN ('hero-images', 'veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated upload" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id IN ('hero-images', 'veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated update" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id IN ('hero-images', 'veterinarian-photos', 'product-images', 'pet-images', 'site-images'));

CREATE POLICY "Allow authenticated delete" 
  ON storage.objects FOR DELETE 
  USING (bucket_id IN ('hero-images', 'veterinarian-photos', 'product-images', 'pet-images', 'site-images'));
