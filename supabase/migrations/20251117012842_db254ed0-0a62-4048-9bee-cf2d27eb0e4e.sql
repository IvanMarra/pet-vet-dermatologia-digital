-- Fase 1: Sistema de Autenticação Seguro com Roles

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de roles (SEPARADA conforme best practices de segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função SECURITY DEFINER para verificar roles (evita recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies para profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Atualizar RLS das tabelas administrativas existentes para usar o novo sistema
DROP POLICY IF EXISTS "Allow authenticated users full access to pet_gallery" ON public.pet_gallery;
DROP POLICY IF EXISTS "Allow authenticated users full access to services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated users full access to products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users full access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users full access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users full access to hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users full access to contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow authenticated users full access to lost_pets" ON public.lost_pets;

-- Novas policies usando has_role para pet_gallery
CREATE POLICY "Admins can manage pet_gallery"
  ON public.pet_gallery FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para services
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para testimonials
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para site_settings
CREATE POLICY "Admins can manage site_settings"
  ON public.site_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para hero_slides
CREATE POLICY "Admins can manage hero_slides"
  ON public.hero_slides FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para contacts
CREATE POLICY "Admins can manage contacts"
  ON public.contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Novas policies usando has_role para lost_pets
CREATE POLICY "Admins can manage lost_pets"
  ON public.lost_pets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Fase 2: Storage e Otimização de Imagens

-- Criar bucket público para galeria de pets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-gallery',
  'pet-gallery',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- RLS Policies para storage bucket pet-gallery
CREATE POLICY "Public can view pet gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pet-gallery');

CREATE POLICY "Authenticated users can upload pet gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pet-gallery' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can delete pet gallery images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pet-gallery' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar campo is_active na pet_gallery se não existir
ALTER TABLE public.pet_gallery 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;