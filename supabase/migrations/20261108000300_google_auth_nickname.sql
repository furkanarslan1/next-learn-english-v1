-- Nicknames must be unique regardless of case ("Ali" and "ali" are the same nickname).
alter table public.profiles drop constraint if exists profiles_username_key;
create unique index profiles_username_lower_idx on public.profiles (lower(username));

-- With Google sign-in the name comes from the Google profile metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ), '')
  );
  return new;
end;
$$;
