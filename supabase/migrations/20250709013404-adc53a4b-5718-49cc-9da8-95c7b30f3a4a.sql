-- Verificar se o bucket veterinarian-photos existe e está público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'veterinarian-photos';

-- Criar políticas de acesso para o bucket veterinarian-photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'veterinarian-photos');

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'veterinarian-photos');

CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'veterinarian-photos');

CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'veterinarian-photos');