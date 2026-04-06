-- MStudy Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  gender text,
  year text,
  match_same_gender boolean not null default false,
  location_preference text[] not null default '{}',
  time_preference text[] not null default '{}',
  day_preference text[] not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses table
create table public.courses (
  id bigint generated always as identity primary key,
  course_name text not null,
  number_students integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User-course enrollments
create table public.user_classes (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id bigint not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index idx_user_classes_user_id on public.user_classes(user_id);
create index idx_user_classes_course_id on public.user_classes(course_id);

-- Matches table
create table public.matches (
  id bigint generated always as identity primary key,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  course_id bigint not null references public.courses(id) on delete cascade,
  status integer not null default 0, -- 0=pending, 1=accepted, 2=rejected, 3=expired
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_matches_requester on public.matches(requester_id);
create index idx_matches_receiver on public.matches(receiver_id);
create index idx_matches_course on public.matches(course_id);
create index idx_matches_status on public.matches(status);
create unique index idx_matches_unique on public.matches(requester_id, receiver_id, course_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.user_classes enable row level security;
alter table public.matches enable row level security;

-- Profiles: users can read any profile, update only their own
create policy "Anyone can read profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Courses: anyone authenticated can read
create policy "Authenticated users can read courses" on public.courses for select using (auth.role() = 'authenticated');

-- User classes: users can manage their own enrollments, read all
create policy "Authenticated users can read enrollments" on public.user_classes for select using (auth.role() = 'authenticated');
create policy "Users can insert own enrollments" on public.user_classes for insert with check (auth.uid() = user_id);
create policy "Users can delete own enrollments" on public.user_classes for delete using (auth.uid() = user_id);

-- Matches: users can read their own matches, create matches
create policy "Users can read own matches" on public.matches for select using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "Users can create matches" on public.matches for insert with check (auth.uid() = requester_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to mark profile verified when email confirmed
create or replace function public.handle_user_verified()
returns trigger as $$
begin
  if new.email_confirmed_at is not null and (old.email_confirmed_at is null or old.email_confirmed_at != new.email_confirmed_at) then
    update public.profiles set verified = true, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_verified
  after update on auth.users
  for each row execute procedure public.handle_user_verified();
