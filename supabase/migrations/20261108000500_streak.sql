-- Daily streak. A day counts when the user completes a saved activity
-- (deck session, grammar test, duel). Days are counted in Turkey time.
alter table public.profiles
  add column streak_count int not null default 0,
  add column streak_best int not null default 0,
  add column streak_last_date date;

create function public.touch_streak()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'Europe/Istanbul')::date;
begin
  update public.profiles
  set streak_count = case
        when streak_last_date = v_today then streak_count
        when streak_last_date = v_today - 1 then streak_count + 1
        else 1
      end,
      streak_best = greatest(streak_best, case
        when streak_last_date = v_today then streak_count
        when streak_last_date = v_today - 1 then streak_count + 1
        else 1
      end),
      streak_last_date = v_today
  where id = (select auth.uid());
end;
$$;

revoke all on function public.touch_streak() from public, anon;
grant execute on function public.touch_streak() to authenticated;
