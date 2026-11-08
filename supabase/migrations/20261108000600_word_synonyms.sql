-- Synonyms shown on the word card.
alter table public.words add column synonyms text[] not null default '{}';
