-- Script para criar o primeiro usuário administrador
-- ATENÇÃO: Execute este script apenas UMA VEZ no SQL Editor do Supabase

-- Este script cria um usuário admin com as seguintes credenciais:
-- Email: admin@popularvet.com
-- Senha: PopularVET@2025
-- 
-- IMPORTANTE: Altere a senha após o primeiro login!

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Criar usuário no Supabase Auth
  -- Nota: No Supabase, você precisa criar o usuário manualmente através do painel Auth
  -- Este script apenas prepara a estrutura de dados
  
  -- Se você quiser criar o usuário via SQL, use o SQL Editor e execute:
  -- 1. Vá para Authentication > Users no painel do Supabase
  -- 2. Clique em "Add user"
  -- 3. Adicione:
  --    Email: admin@popularvet.com
  --    Password: PopularVET@2025
  --    Email Confirm: Yes (marque como confirmado)
  
  -- Após criar o usuário no painel, pegue o UUID dele e substitua abaixo
  -- Ou use este script depois de criar o usuário:
  
  -- Buscar o UUID do usuário criado (substitua o email se necessário)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@popularvet.com' 
  LIMIT 1;
  
  -- Se o usuário foi encontrado, criar perfil e role
  IF admin_user_id IS NOT NULL THEN
    -- Criar perfil
    INSERT INTO public.profiles (id, name)
    VALUES (admin_user_id, 'Administrador')
    ON CONFLICT (id) DO NOTHING;
    
    -- Adicionar role de admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Usuário admin configurado com sucesso!';
  ELSE
    RAISE NOTICE 'Usuário não encontrado. Crie o usuário no painel Auth primeiro.';
  END IF;
END $$;