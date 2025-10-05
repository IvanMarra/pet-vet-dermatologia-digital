-- Verificar se o bucket veterinarian-photos existe e está público
SELECT name, public FROM storage.buckets WHERE name = 'veterinarian-photos';

-- Se não existir, criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('veterinarian-photos', 'veterinarian-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Garantir que as políticas de acesso estão corretas
DELETE FROM storage.policies WHERE bucket_id = 'veterinarian-photos';

-- Política para visualização pública
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'veterinarian-photos-public-read',
  'veterinarian-photos',
  'SELECT',
  'true'
);

-- Política para upload (apenas admins)
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'veterinarian-photos-admin-upload',
  'veterinarian-photos',
  'INSERT', 
  'true'
);

-- Política para update (apenas admins)
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'veterinarian-photos-admin-update',
  'veterinarian-photos',
  'UPDATE',
  'true'
);

-- Política para delete (apenas admins)
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'veterinarian-photos-admin-delete',
  'veterinarian-photos',
  'DELETE',
  'true'
);