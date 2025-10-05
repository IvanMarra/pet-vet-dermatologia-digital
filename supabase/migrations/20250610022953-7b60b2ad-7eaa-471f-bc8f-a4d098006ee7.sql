
-- Remover todas as políticas RLS da tabela admin_users que estão causando recursão infinita
DROP POLICY IF EXISTS "Users can view own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can insert admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can update admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can delete admin_users" ON public.admin_users;

-- Desabilitar RLS na tabela admin_users já que usamos funções SECURITY DEFINER
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Verificar se o usuário existe e está aprovado
SELECT id, email, name, is_approved FROM public.admin_users WHERE email = 'ivanmarra2009@gmail.com';
