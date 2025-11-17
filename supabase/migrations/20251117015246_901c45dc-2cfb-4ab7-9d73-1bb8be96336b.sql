-- Adicionar role de admin para o usuário karinemarquesferreiravet@gmail.com
-- UUID: 44ea8590-971b-4724-91bc-236d657da3db

-- Criar perfil se não existir
INSERT INTO public.profiles (id, name)
VALUES ('44ea8590-971b-4724-91bc-236d657da3db', 'Karine Marques Ferreira')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Adicionar role de admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('44ea8590-971b-4724-91bc-236d657da3db', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;