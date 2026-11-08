-- Initial schema for the English learning app.
-- Design goals: low cost on the Supabase free plan.
--  * Content tables (words, decks, grammar_topics) are shared and read-only for users.
--  * Spaced repetition is tracked per DECK, not per word (one row per active deck per user).
--  * Learned decks/words are moved into int[] columns on profiles, so tables never grow forever.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
create type public.duel_status as enum ('pending', 'active', 'finished', 'cancelled');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  username         text unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name     text,
  level            public.cefr_level not null default 'A1',
  learned_deck_ids int[] not null default '{}',
  learned_word_ids int[] not null default '{}',
  created_at       timestamptz not null default now()
);

-- Create a profile automatically for every new auth user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Shared content: words, decks, grammar
-- ---------------------------------------------------------------------------
create table public.words (
  id             int generated always as identity primary key,
  english        text not null,
  turkish        text not null,
  part_of_speech text,
  example_en     text,
  example_tr     text,
  usage_note     text,            -- in which meaning / where it is used
  level          public.cefr_level not null default 'A1',
  created_at     timestamptz not null default now()
);
create index words_level_idx on public.words (level);

create table public.decks (
  id         int generated always as identity primary key,
  title      text not null,
  level      public.cefr_level not null,
  position   int not null default 0,      -- order inside a level
  created_at timestamptz not null default now()
);
create index decks_level_position_idx on public.decks (level, position);

create table public.deck_words (
  deck_id  int not null references public.decks (id) on delete cascade,
  word_id  int not null references public.words (id) on delete cascade,
  position int not null default 0,
  primary key (deck_id, word_id)
);
create index deck_words_word_idx on public.deck_words (word_id);

create table public.grammar_topics (
  id         int generated always as identity primary key,
  slug       text not null unique,
  title      text not null,
  level      public.cefr_level not null,
  position   int not null default 0,
  -- rules, positive/negative/question examples, notes as JSON so content can change without code changes
  content    jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index grammar_topics_level_position_idx on public.grammar_topics (level, position);

-- ---------------------------------------------------------------------------
-- Per-user progress: ONE row per active deck
-- ---------------------------------------------------------------------------
create table public.user_decks (
  user_id        uuid not null references public.profiles (id) on delete cascade,
  deck_id        int  not null references public.decks (id) on delete cascade,
  stage          smallint not null default 0,          -- index into the review schedule defined in code
  next_review_at timestamptz not null default now(),
  success_count  smallint not null default 0,
  known_word_ids int[] not null default '{}',          -- words marked "I know this"; hidden in sessions
  started_at     timestamptz not null default now(),
  primary key (user_id, deck_id)
);
create index user_decks_due_idx on public.user_decks (user_id, next_review_at);

-- Optional: grammar topics can use the same spaced repetition later.
create table public.user_grammar (
  user_id        uuid not null references public.profiles (id) on delete cascade,
  topic_id       int  not null references public.grammar_topics (id) on delete cascade,
  stage          smallint not null default 0,
  next_review_at timestamptz not null default now(),
  success_count  smallint not null default 0,
  primary key (user_id, topic_id)
);
create index user_grammar_due_idx on public.user_grammar (user_id, next_review_at);

-- ---------------------------------------------------------------------------
-- Duels (asynchronous: each player solves the same questions at their own time)
-- ---------------------------------------------------------------------------
create table public.duels (
  id                   uuid primary key default gen_random_uuid(),
  creator_id           uuid not null references public.profiles (id) on delete cascade,
  opponent_id          uuid references public.profiles (id) on delete set null,
  question_word_ids    int[] not null,                -- chosen on the server when the duel is created
  status               public.duel_status not null default 'pending',
  creator_score        smallint,
  creator_time_ms      int,
  creator_finished_at  timestamptz,
  opponent_score       smallint,
  opponent_time_ms     int,
  opponent_finished_at timestamptz,
  created_at           timestamptz not null default now()
);
create index duels_creator_idx  on public.duels (creator_id, created_at desc);
create index duels_opponent_idx on public.duels (opponent_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.words          enable row level security;
alter table public.decks          enable row level security;
alter table public.deck_words     enable row level security;
alter table public.grammar_topics enable row level security;
alter table public.user_decks     enable row level security;
alter table public.user_grammar   enable row level security;
alter table public.duels          enable row level security;

-- Shared content: readable by signed-in users, writable only with the service role.
create policy "words are readable"          on public.words          for select to authenticated using (true);
create policy "decks are readable"          on public.decks          for select to authenticated using (true);
create policy "deck_words are readable"     on public.deck_words     for select to authenticated using (true);
create policy "grammar_topics are readable" on public.grammar_topics for select to authenticated using (true);

-- Profiles: users see and edit only their own row.
create policy "own profile select" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Progress: users manage only their own rows.
create policy "own user_decks" on public.user_decks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own user_grammar" on public.user_grammar for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Duels: only the two participants can see or update a duel.
-- TODO: move score submission to an RPC/Route Handler so scores can't be forged from the client.
create policy "duel participants select" on public.duels for select to authenticated
  using ((select auth.uid()) in (creator_id, opponent_id));
create policy "duel creator insert" on public.duels for insert to authenticated
  with check ((select auth.uid()) = creator_id);
create policy "duel participants update" on public.duels for update to authenticated
  using ((select auth.uid()) in (creator_id, opponent_id))
  with check ((select auth.uid()) in (creator_id, opponent_id));
