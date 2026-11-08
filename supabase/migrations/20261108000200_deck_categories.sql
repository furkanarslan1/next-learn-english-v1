-- Decks can belong to a category (CEFR levels for general English, or YDS).
-- YDS words/decks are not CEFR levels, so level becomes optional for them.
create type public.deck_category as enum ('general', 'yds');

alter table public.decks add column category public.deck_category not null default 'general';
alter table public.decks alter column level drop not null;
alter table public.decks add constraint decks_level_required
  check (category <> 'general' or level is not null);

alter table public.words alter column level drop not null;
alter table public.words alter column level drop default;

drop index public.decks_level_position_idx;
create index decks_category_level_position_idx on public.decks (category, level, position);

-- Marks a deck as learned in one atomic call:
-- moves the deck and its words into the profile arrays and removes the active row.
create function public.learn_deck(p_deck_id int)
returns void
language plpgsql
security invoker
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
