-- Sample content. Safe to run more than once: it does nothing if decks already exist.
-- Replace/extend with real word lists (including the YDS words) later.
with seed (deck_title, category, level, deck_position, word_position, english, turkish, part_of_speech, example_en, example_tr, usage_note) as (
  values
  -- A1 · Daily Basics
  ('Daily Basics', 'general', 'A1', 1, 1, 'book', 'kitap', 'noun', 'I read a book every night.', 'Her gece bir kitap okurum.', 'Also a verb: "to book" = rezervasyon yapmak.'),
  ('Daily Basics', 'general', 'A1', 1, 2, 'water', 'su', 'noun', 'Can I have a glass of water?', 'Bir bardak su alabilir miyim?', 'Uncountable: "some water", "a glass of water".'),
  ('Daily Basics', 'general', 'A1', 1, 3, 'friend', 'arkadaş', 'noun', 'She is my best friend.', 'O benim en iyi arkadaşım.', '"a friend of mine" = bir arkadaşım.'),
  ('Daily Basics', 'general', 'A1', 1, 4, 'house', 'ev', 'noun', 'They live in a big house.', 'Büyük bir evde yaşıyorlar.', '"house" is the building, "home" is where you live.'),
  ('Daily Basics', 'general', 'A1', 1, 5, 'eat', 'yemek yemek', 'verb', 'We eat dinner at seven.', 'Akşam yemeğini yedide yeriz.', 'Irregular: eat – ate – eaten.'),
  -- A1 · Everyday Actions
  ('Everyday Actions', 'general', 'A1', 2, 1, 'go', 'gitmek', 'verb', 'I go to school by bus.', 'Okula otobüsle giderim.', 'Irregular: go – went – gone.'),
  ('Everyday Actions', 'general', 'A1', 2, 2, 'want', 'istemek', 'verb', 'I want a cup of tea.', 'Bir fincan çay istiyorum.', '"want to + verb": I want to sleep.'),
  ('Everyday Actions', 'general', 'A1', 2, 3, 'help', 'yardım etmek', 'verb', 'Can you help me, please?', 'Bana yardım eder misin lütfen?', 'Also a noun: "Thanks for your help."'),
  ('Everyday Actions', 'general', 'A1', 2, 4, 'buy', 'satın almak', 'verb', 'She buys fresh bread every morning.', 'Her sabah taze ekmek alır.', 'Irregular: buy – bought – bought.'),
  ('Everyday Actions', 'general', 'A1', 2, 5, 'open', 'açmak', 'verb', 'Please open the window.', 'Lütfen pencereyi aç.', 'Also an adjective: "The shop is open."'),
  -- A2 · Travel
  ('Travel', 'general', 'A2', 1, 1, 'ticket', 'bilet', 'noun', 'I bought two train tickets.', 'İki tren bileti aldım.', '"one-way ticket" = gidiş bileti, "return ticket" = gidiş-dönüş bileti.'),
  ('Travel', 'general', 'A2', 1, 2, 'luggage', 'bagaj', 'noun', 'Where can I leave my luggage?', 'Bagajımı nereye bırakabilirim?', 'Uncountable. "a piece of luggage". American English: "baggage".'),
  ('Travel', 'general', 'A2', 1, 3, 'passport', 'pasaport', 'noun', 'Don''t forget your passport.', 'Pasaportunu unutma.', 'Used at border control and airports.'),
  ('Travel', 'general', 'A2', 1, 4, 'arrive', 'varmak', 'verb', 'The train arrives at nine.', 'Tren dokuzda varır.', 'arrive IN a city/country, arrive AT a place (station, airport).'),
  ('Travel', 'general', 'A2', 1, 5, 'delay', 'gecikme; ertelemek', 'noun/verb', 'The flight has a two-hour delay.', 'Uçuşun iki saat rötarı var.', 'Noun: "a delay". Verb: "The storm delayed the flight."'),
  -- YDS · sample deck (placeholder words, to be replaced with the real YDS list)
  ('YDS Starter', 'yds', null, 1, 1, 'reluctant', 'isteksiz', 'adjective', 'He was reluctant to share his opinion.', 'Fikrini paylaşmakta isteksizdi.', 'reluctant to + verb. Synonym: unwilling.'),
  ('YDS Starter', 'yds', null, 1, 2, 'inevitable', 'kaçınılmaz', 'adjective', 'Change is inevitable in any career.', 'Değişim her kariyerde kaçınılmazdır.', 'Often used with "the inevitable consequence".'),
  ('YDS Starter', 'yds', null, 1, 3, 'substantial', 'önemli ölçüde; hatırı sayılır', 'adjective', 'The company made a substantial profit.', 'Şirket hatırı sayılır bir kâr elde etti.', 'Synonyms: considerable, significant.'),
  ('YDS Starter', 'yds', null, 1, 4, 'diminish', 'azalmak; azaltmak', 'verb', 'Her interest in the subject began to diminish.', 'Konuya olan ilgisi azalmaya başladı.', 'Can be intransitive or transitive.'),
  ('YDS Starter', 'yds', null, 1, 5, 'comprehensive', 'kapsamlı', 'adjective', 'They published a comprehensive report.', 'Kapsamlı bir rapor yayımladılar.', 'Synonym: thorough, extensive.')
),
guarded as (
  select * from seed where not exists (select 1 from public.decks)
),
new_decks as (
  insert into public.decks (title, category, level, position)
  select distinct deck_title, category::public.deck_category, level::public.cefr_level, deck_position
  from guarded
  returning id, title
),
new_words as (
  insert into public.words (english, turkish, part_of_speech, example_en, example_tr, usage_note, level)
  select english, turkish, part_of_speech, example_en, example_tr, usage_note, level::public.cefr_level
  from guarded
  returning id, english
)
insert into public.deck_words (deck_id, word_id, position)
select d.id, w.id, g.word_position
from guarded g
join new_decks d on d.title = g.deck_title
join new_words w on w.english = g.english;
