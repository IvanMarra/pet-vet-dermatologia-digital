-- Corrigir políticas RLS da tabela site_settings para funcionar com sistema de auth customizado
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;

-- Criar política mais permissiva para admins (removendo dependência do auth.uid())
CREATE POLICY "Admins can manage site settings" 
ON site_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Manter política de leitura pública
CREATE POLICY "Public can read site settings" 
ON site_settings 
FOR SELECT 
USING (true);