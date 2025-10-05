
-- Criar tabela específica para slides do hero
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT DEFAULT 'Agendar Consulta',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para slides
CREATE POLICY "Anyone can view active slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage slides" ON public.hero_slides
  FOR ALL USING (public.is_admin_user());

-- Inserir slides padrão se não existirem
INSERT INTO public.hero_slides (title, subtitle, description, image_url, cta_text, display_order) VALUES
('Cuidando com amor do seu melhor amigo', 'Clínica veterinária especializada em cuidados completos para seu pet', 'Atendimento humanizado, equipamentos modernos e profissionais qualificados para garantir a saúde e bem-estar do seu companheiro.', '/placeholder.svg', 'Agendar Consulta', 1),
('Emergências 24h', 'Pronto atendimento quando seu pet mais precisa', 'Equipe especializada disponível 24 horas para emergências veterinárias com equipamentos de última geração.', '/placeholder.svg', 'Emergência', 2),
('Exames Completos', 'Diagnóstico preciso para seu pet', 'Laboratório próprio e equipamentos modernos para exames rápidos e resultados confiáveis.', '/placeholder.svg', 'Ver Exames', 3);
