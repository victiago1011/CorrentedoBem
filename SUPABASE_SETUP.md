# Configuração do Banco de Dados Supabase

Para que o sistema **Corrente do Bem** funcione corretamente, você precisa criar as tabelas no seu projeto Supabase. 

Siga os passos abaixo:
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Selecione seu projeto.
3. No menu lateral, clique em **SQL Editor**.
4. Clique em **New Query**.
5. Cole o código SQL abaixo e clique em **Run**.

```sql
-- Habilitar a extensão para IDs aleatórios se necessário
create extension if not exists "uuid-ossp";

-- TABELA DE VAGAS (JOBS)
create table if not exists jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  location text not null,
  email text,
  phone text,
  type text not null,
  area text not null,
  salary text,
  description text,
  requirements text[] default '{}',
  status text default 'pending', -- 'pending', 'active', 'rejected', 'closed'
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE CANDIDATOS (CANDIDATES)
create table if not exists candidates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  location text not null,
  area text not null,
  role text not null,
  summary text,
  skills text[] default '{}',
  image text,
  resume_url text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE HISTÓRICO (HISTORY)
create table if not exists history (
  id uuid default uuid_generate_v4() primary key,
  action text not null,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE CONFIGURAÇÕES (SETTINGS)
create table if not exists settings (
  id bigint primary key generated always as identity,
  platform_name text default 'Corrente do Bem',
  contact_email text,
  manual_approval boolean default true,
  auto_notifications boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Inserir configuração inicial se não existir
insert into settings (platform_name, contact_email)
values ('Corrente do Bem', 'contato@correntedobem.com.br')
on conflict (id) do nothing;

-- POLÍTICAS DE SEGURANÇA (RLS)
-- Como este é um app de demonstração sem Auth complexo configurado ainda, 
-- você pode desativar o RLS ou criar políticas que permitem acesso público.
-- Para produção, configure autenticação e proteja as rotas.

alter table jobs enable row level security;
alter table candidates enable row level security;
alter table history enable row level security;
alter table settings enable row level security;

-- Permitir leitura pública
create policy "Allow public read jobs" on jobs for select using (true);
create policy "Allow public read candidates" on candidates for select using (true);
create policy "Allow public read history" on history for select using (true);
create policy "Allow public read settings" on settings for select using (true);

-- Permitir inscrições públicas (insert)
create policy "Allow public insert jobs" on jobs for insert with check (true);
create policy "Allow public insert candidates" on candidates for insert with check (true);

-- Permitir que o admin (você) gerencie tudo
-- Nota: Em um app real, aqui restringiríamos por role de admin
create policy "Allow all for admin" on jobs for all using (true) with check (true);
create policy "Allow all for admin" on candidates for all using (true) with check (true);
create policy "Allow all for admin" on history for all using (true) with check (true);
create policy "Allow all for admin" on settings for all using (true) with check (true);
```

### Configuração de Variáveis de Ambiente
Não esqueça de adicionar estas variáveis no painel **Settings -> Secrets** do AI Studio:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
