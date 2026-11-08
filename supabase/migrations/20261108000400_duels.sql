-- Asynchronous duels.
-- * Questions (4 options each) are built on the server when a duel is created.
-- * The answer key lives in a table nobody can read through the API.
-- * Scores can only be written through submit_duel(), which grades the answers on the server.

alter table public.duels add column questions jsonb not null default '[]';

-- Answer key: RLS enabled and NO policies, so the API can never read it.
create table public.duel_answer_keys (
  duel_id uuid primary key references public.duels (id) on delete cascade,
  correct smallint[] not null
);
alter table public.duel_answer_keys enable row level security;

-- Duels can no longer be inserted or updated directly from the client.
drop policy "duel creator insert" on public.duels;
drop policy "duel participants update" on public.duels;

-- ---------------------------------------------------------------------------
create function public.create_duel(p_opponent_nickname text, p_question_count int default 10)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me uuid := (select auth.uid());
  v_opp uuid;
  v_id uuid;
  v_questions jsonb := '[]'::jsonb;
  v_key smallint[] := '{}';
  v_word_ids int[] := '{}';
  v_word record;
  v_options text[];
begin
  if v_me is null then raise exception 'not_authenticated'; end if;

  select id into v_opp from public.profiles
  where lower(username) = lower(trim(p_opponent_nickname));
  if v_opp is null then raise exception 'opponent_not_found'; end if;
  if v_opp = v_me then raise exception 'cannot_duel_self'; end if;

  for v_word in
    select id, english, turkish from public.words
    order by random() limit greatest(1, least(p_question_count, 20))
  loop
    select array_agg(t) into v_options from (
      select t from (select distinct turkish as t from public.words where turkish <> v_word.turkish) s
      order by random() limit 3
    ) d;
    v_options := array_append(coalesce(v_options, '{}'), v_word.turkish);
    select array_agg(x order by random()) into v_options from unnest(v_options) x;

    v_questions := v_questions || jsonb_build_object('english', v_word.english, 'options', to_jsonb(v_options));
    v_key := array_append(v_key, (array_position(v_options, v_word.turkish) - 1)::smallint);
    v_word_ids := array_append(v_word_ids, v_word.id);
  end loop;

  if jsonb_array_length(v_questions) = 0 then raise exception 'not_enough_words'; end if;

  insert into public.duels (creator_id, opponent_id, question_word_ids, questions, status)
  values (v_me, v_opp, v_word_ids, v_questions, 'active')
  returning id into v_id;

  insert into public.duel_answer_keys (duel_id, correct) values (v_id, v_key);
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
create function public.submit_duel(p_duel_id uuid, p_answers int[], p_time_ms int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me uuid := (select auth.uid());
  v_duel public.duels%rowtype;
  v_key smallint[];
  v_score int := 0;
  i int;
begin
  select * into v_duel from public.duels where id = p_duel_id for update;
  if not found or v_me is null or v_me not in (v_duel.creator_id, v_duel.opponent_id) then
    raise exception 'duel_not_found';
  end if;

  select correct into v_key from public.duel_answer_keys where duel_id = p_duel_id;
  if array_length(p_answers, 1) is distinct from array_length(v_key, 1) then
    raise exception 'invalid_answers';
  end if;

  for i in 1 .. array_length(v_key, 1) loop
    if p_answers[i] = v_key[i] then v_score := v_score + 1; end if;
  end loop;

  if v_me = v_duel.creator_id then
    if v_duel.creator_finished_at is not null then raise exception 'already_submitted'; end if;
    update public.duels
    set creator_score = v_score, creator_time_ms = greatest(p_time_ms, 0), creator_finished_at = now()
    where id = p_duel_id;
  else
    if v_duel.opponent_finished_at is not null then raise exception 'already_submitted'; end if;
    update public.duels
    set opponent_score = v_score, opponent_time_ms = greatest(p_time_ms, 0), opponent_finished_at = now()
    where id = p_duel_id;
  end if;

  update public.duels set status = 'finished'
  where id = p_duel_id and creator_finished_at is not null and opponent_finished_at is not null;

  return v_score;
end;
$$;

-- ---------------------------------------------------------------------------
-- My duels (or one duel) with the other player's nickname.
-- The other player's score is hidden until I have finished too.
create function public.my_duels(p_duel_id uuid default null)
returns table (
  id uuid,
  created_at timestamptz,
  status public.duel_status,
  opponent_nickname text,
  question_count int,
  my_finished boolean,
  their_finished boolean,
  my_score smallint,
  my_time_ms int,
  their_score smallint,
  their_time_ms int
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    d.id,
    d.created_at,
    d.status,
    coalesce(p.username, p.display_name, '?'),
    jsonb_array_length(d.questions),
    case when d.creator_id = (select auth.uid()) then d.creator_finished_at else d.opponent_finished_at end is not null,
    case when d.creator_id = (select auth.uid()) then d.opponent_finished_at else d.creator_finished_at end is not null,
    case when d.creator_id = (select auth.uid()) then d.creator_score else d.opponent_score end,
    case when d.creator_id = (select auth.uid()) then d.creator_time_ms else d.opponent_time_ms end,
    case when (case when d.creator_id = (select auth.uid()) then d.creator_finished_at else d.opponent_finished_at end) is null then null
         when d.creator_id = (select auth.uid()) then d.opponent_score else d.creator_score end,
    case when (case when d.creator_id = (select auth.uid()) then d.creator_finished_at else d.opponent_finished_at end) is null then null
         when d.creator_id = (select auth.uid()) then d.opponent_time_ms else d.creator_time_ms end
  from public.duels d
  left join public.profiles p
    on p.id = case when d.creator_id = (select auth.uid()) then d.opponent_id else d.creator_id end
  where (select auth.uid()) in (d.creator_id, d.opponent_id)
    and (p_duel_id is null or d.id = p_duel_id)
  order by d.created_at desc
  limit 30;
$$;

-- Only signed-in users may call these.
revoke all on function public.create_duel(text, int) from public, anon;
revoke all on function public.submit_duel(uuid, int[], int) from public, anon;
revoke all on function public.my_duels(uuid) from public, anon;
grant execute on function public.create_duel(text, int) to authenticated;
grant execute on function public.submit_duel(uuid, int[], int) to authenticated;
grant execute on function public.my_duels(uuid) to authenticated;
