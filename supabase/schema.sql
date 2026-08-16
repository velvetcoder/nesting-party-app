create extension if not exists pgcrypto;
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  category text not null, helpers_needed int not null default 1 check (helpers_needed > 0),
  sort_order int not null default 0, active boolean not null default true, created_at timestamptz default now()
);
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text,
  party_size int not null default 1, arrival_time text not null, departure_time text not null, notes text,
  manage_code text unique not null, status text not null default 'confirmed' check(status in ('confirmed','cancelled')),
  created_at timestamptz default now()
);
create table if not exists public.task_signups (
  id uuid primary key default gen_random_uuid(), guest_id uuid not null references public.guests(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade, created_at timestamptz default now(), unique(guest_id,task_id)
);
alter table public.tasks enable row level security;
alter table public.guests enable row level security;
alter table public.task_signups enable row level security;
-- No public policies are needed because all access goes through protected Next.js server routes using the service-role key.
insert into public.tasks (title,description,category,helpers_needed,sort_order) values
('Wash & sort baby clothes','Wash, fold, and group clothing by size.','Baby Preparation',3,10),
('Set up diaper stations','Stock diapers, wipes, creams, and changing supplies.','Baby Preparation',2,20),
('Sanitize bottles & pacifiers','Wash and sanitize feeding supplies.','Baby Preparation',2,30),
('Organize the nursery','Arrange drawers, shelves, gifts, and storage bins.','Organization',3,40),
('Organize pantry & snacks','Make easy-to-reach postpartum snack sections.','Organization',2,50),
('Kitchen reset','Wipe surfaces, organize counters, and wash dishes.','Cleaning',2,60),
('Bathroom refresh','Clean and restock the main bathroom.','Cleaning',2,70),
('Vacuum & mop','Freshen the common areas and nursery floor.','Cleaning',2,80),
('Prepare freezer meals','Assemble, label, and date easy family meals.','Meal Preparation',4,90),
('Prep grab-and-go snacks','Portion simple snacks for the first weeks home.','Meal Preparation',2,100),
('Assemble baby gear','Help assemble or check small baby items.','Hands-On Help',2,110),
('Flexible helper','Jump in wherever the host needs extra hands.','Hands-On Help',6,120)
on conflict do nothing;
