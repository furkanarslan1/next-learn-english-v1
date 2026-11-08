-- 1) Users may only edit their own nickname and display name directly.
--    Streak and learned lists can then only change through the functions below.
revoke update on public.profiles from authenticated, anon;
grant update (username, display_name) on public.profiles to authenticated;

-- 2) These functions write protected columns, so they run with definer rights.
--    They only ever touch the row of the signed-in user (auth.uid()).
create or replace function public.touch_streak()
returns void
language plpgsql
security definer
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

create or replace function public.learn_deck(p_deck_id int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_words int[];
begin
  select coalesce(array_agg(word_id), '{}') into v_words
  from public.deck_words where deck_id = p_deck_id;

  update public.profiles
  set learned_deck_ids = array(select distinct unnest(learned_deck_ids || p_deck_id)),
      learned_word_ids = array(select distinct unnest(learned_word_ids || v_words))
  where id = (select auth.uid());

  delete from public.user_decks
  where user_id = (select auth.uid()) and deck_id = p_deck_id;
end;
$$;

-- 3) Account deletion. Deleting the auth user removes the profile and, through
--    cascades, all progress. Duels the user created are removed too; duels where the
--    user was the opponent keep existing with no opponent.
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not_authenticated';
  end if;
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke all on function public.touch_streak() from public, anon;
revoke all on function public.learn_deck(int) from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.touch_streak() to authenticated;
grant execute on function public.learn_deck(int) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
