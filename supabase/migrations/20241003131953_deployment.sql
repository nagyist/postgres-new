create extension if not exists moddatetime;

-- table for deployment providers
create table deployment_providers (
  id bigint primary key generated always as identity,
  name text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger deployment_providers_updated_at before update on deployment_providers
  for each row execute procedure moddatetime (updated_at);

-- insert the first deployment provider: supabase
insert into deployment_providers (name) values ('Supabase');

-- table for storing deployment provider integrations
create table deployment_provider_integrations (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id),
  deployment_provider_id bigint references deployment_providers(id),
  -- stores the credentials like the refresh token
  credentials jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, deployment_provider_id)
);

create trigger deployment_provider_integrations_updated_at before update on deployment_provider_integrations
  for each row execute procedure moddatetime (updated_at);

-- table for storing deployed databases
create table deployed_databases (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id),
  local_database_id text not null,
  deployment_provider_id bigint not null references deployment_providers(id),
  provider_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, local_database_id, deployment_provider_id)
);

create trigger deployed_databases_updated_at before update on deployed_databases
  for each row execute procedure moddatetime (updated_at);

create type deployment_status as enum ('in_progress', 'success', 'failed');

-- table for storing individual deployments
create table deployments (
  id bigint primary key generated always as identity,
  deployed_database_id bigint not null references deployed_databases(id),
  status deployment_status not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger deployments_updated_at before update on deployments
  for each row execute procedure moddatetime (updated_at);

-- Enable RLS on deployment_provider_integrations
alter table deployment_provider_integrations enable row level security;

-- RLS policies for deployment_provider_integrations
create policy "Users can read their own integrations"
  on deployment_provider_integrations for select
  using (auth.uid() = user_id);

create policy "Users can create their own integrations"
  on deployment_provider_integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
  on deployment_provider_integrations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own integrations"
  on deployment_provider_integrations for delete
  using (auth.uid() = user_id);

-- Enable RLS on deployed_databases
alter table deployed_databases enable row level security;

-- RLS policies for deployed_databases
create policy "Users can read their own deployed databases"
  on deployed_databases for select
  using (auth.uid() = user_id);

create policy "Users can create their own deployed databases"
  on deployed_databases for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own deployed databases"
  on deployed_databases for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own deployed databases"
  on deployed_databases for delete
  using (auth.uid() = user_id);

-- Enable RLS on deployments
alter table deployments enable row level security;

-- RLS policies for deployments
create policy "Users can read their own deployments"
  on deployments for select
  using (auth.uid() = (select user_id from deployed_databases where id = deployments.deployed_database_id));

create policy "Users can create their own deployments"
  on deployments for insert
  with check (auth.uid() = (select user_id from deployed_databases where id = deployments.deployed_database_id));

create policy "Users can update their own deployments"
  on deployments for update
  using (auth.uid() = (select user_id from deployed_databases where id = deployments.deployed_database_id))
  with check (auth.uid() = (select user_id from deployed_databases where id = deployments.deployed_database_id));

create policy "Users can delete their own deployments"
  on deployments for delete
  using (auth.uid() = (select user_id from deployed_databases where id = deployments.deployed_database_id));