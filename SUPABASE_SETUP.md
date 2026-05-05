-- ==========================================
-- 1. CRIAÇÃO DAS TABELAS (NOVO PADRÃO)
-- ==========================================

-- Tabela de Vagas
CREATE TABLE IF NOT EXISTS public.vagas (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  location text,
  email text,
  phone text,
  site_url text,
  attachment_url text,
  type text not null,
  area text not null default 'Outros',
  salary text,
  description text,
  requirements text[],
  status text default 'pending', 
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Talentos
CREATE TABLE IF NOT EXISTS public.talentos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  area text not null,
  role text,
  summary text,
  skills text[],
  image text,
  cv_url text,
  status text default 'pending',
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Negócios
CREATE TABLE IF NOT EXISTS public.negocios (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  owner_name text not null,
  location text,
  area text,
  description text,
  contact_email text,
  contact_phone text,
  attachment_url text,
  type text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Histórico
CREATE TABLE IF NOT EXISTS public.history (
  id uuid default gen_random_uuid() primary key,
  action text not null,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Notícias
CREATE TABLE IF NOT EXISTS public.noticias (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  image_url text,
  author text,
  category text,
  status text default 'pending', -- pending, active, archived
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS public.settings (
  id int8 primary key default 1,
  platform_name text default 'Corrente do Bem',
  contact_email text,
  manual_approval boolean default true,
  auto_notifications boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 2. MIGRAÇÃO DE DADOS (JOBS -> VAGAS)
-- ==========================================

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'jobs') THEN
        INSERT INTO public.vagas (id, title, company, location, type, status, salary, description, requirements, verified, created_at, area)
        SELECT 
            id, 
            title, 
            company, 
            location, 
            type, 
            CASE WHEN status = 'approved' THEN 'active' ELSE status END, -- Padroniza status
            salary, 
            description, 
            requirements, 
            verified, 
            created_at, 
            COALESCE(area, 'Geral')
        FROM public.jobs
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- ==========================================
-- 3. MIGRAÇÃO DE DADOS (CANDIDATES -> TALENTOS)
-- ==========================================

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'candidates') THEN
        -- Como a coluna resume_url pode não existir, usamos um bloco dinâmico ou verificamos a coluna
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'resume_url') THEN
            INSERT INTO public.talentos (id, name, location, area, status, role, summary, skills, image, verified, created_at, cv_url)
            SELECT 
                id, name, location, area, 
                CASE WHEN status = 'approved' THEN 'active' ELSE status END, 
                role, summary, skills, image, verified, created_at, resume_url
            FROM public.candidates
            ON CONFLICT (id) DO NOTHING;
        ELSE
            INSERT INTO public.talentos (id, name, location, area, status, role, summary, skills, image, verified, created_at)
            SELECT 
                id, name, location, area, 
                CASE WHEN status = 'approved' THEN 'active' ELSE status END, 
                role, summary, skills, image, verified, created_at
            FROM public.candidates
            ON CONFLICT (id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- ==========================================
-- 4. PADRONIZAÇÃO DE STATUS (OPCIONAL)
-- ==========================================

UPDATE public.vagas SET status = 'active' WHERE status = 'approved';
UPDATE public.talentos SET status = 'active' WHERE status = 'approved';
UPDATE public.negocios SET status = 'active' WHERE status = 'approved';
UPDATE public.noticias SET status = 'active' WHERE status = 'approved';

-- ==========================================
-- 5. SEGURANÇA (RLS)
-- ==========================================

ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Remover políticas antigas se for rodar novamente
DROP POLICY IF EXISTS "Public Read Vagas" ON public.vagas;
DROP POLICY IF EXISTS "Public Read Talentos" ON public.talentos;
DROP POLICY IF EXISTS "Public Read Negocios" ON public.negocios;
DROP POLICY IF EXISTS "Public Read Noticias" ON public.noticias;
DROP POLICY IF EXISTS "Public Insert Vagas" ON public.vagas;
DROP POLICY IF EXISTS "Public Insert Talentos" ON public.talentos;
DROP POLICY IF EXISTS "Public Insert Negocios" ON public.negocios;

-- Políticas de Leitura (Geral)
CREATE POLICY "Public Read Vagas" ON public.vagas FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Talentos" ON public.talentos FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Negocios" ON public.negocios FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Noticias" ON public.noticias FOR SELECT USING (status = 'active');

-- Políticas de Inserção (Geral)
CREATE POLICY "Public Insert Vagas" ON public.vagas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Talentos" ON public.talentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Negocios" ON public.negocios FOR INSERT WITH CHECK (true);

-- ==========================================
-- 6. LIMPEZA (SÓ APAGUE DEPOIS DE CONFERIR TUDO)
-- ==========================================
-- DROP TABLE public.jobs;
-- DROP TABLE public.candidates;
