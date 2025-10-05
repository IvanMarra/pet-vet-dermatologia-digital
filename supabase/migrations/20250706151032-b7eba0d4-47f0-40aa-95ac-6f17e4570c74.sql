-- Adicionar política para permitir leitura pública dos dados de configuração do site
CREATE POLICY "Public can read site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);