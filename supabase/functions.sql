-- Helper RPC functions for atomic course student count updates
-- Run this in the Supabase SQL Editor after schema.sql

create or replace function increment_course_students(cid bigint)
returns void as $$
begin
  update courses set number_students = number_students + 1 where id = cid;
end;
$$ language plpgsql security definer;

create or replace function decrement_course_students(cid bigint)
returns void as $$
begin
  update courses set number_students = greatest(number_students - 1, 0) where id = cid;
end;
$$ language plpgsql security definer;
