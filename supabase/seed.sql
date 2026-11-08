-- Content. Safe to run more than once: a deck is only inserted if no deck with that title exists.
-- Replace/extend with real word lists (including the YDS words) later.
with seed (deck_title, category, level, deck_position, word_position, english, turkish, part_of_speech, example_en, example_tr, usage_note) as (
  values
  -- A1 · Daily Basics
  ('Daily Basics', 'general', 'A1', 1, 1, 'book', 'kitap', 'noun', 'I read a book every night.', 'Her gece bir kitap okurum.', 'Fiil olarak da kullanılır: "to book" = rezervasyon yapmak.'),
  ('Daily Basics', 'general', 'A1', 1, 2, 'water', 'su', 'noun', 'Can I have a glass of water?', 'Bir bardak su alabilir miyim?', 'Sayılamaz isimdir: "some water", "a glass of water".'),
  ('Daily Basics', 'general', 'A1', 1, 3, 'friend', 'arkadaş', 'noun', 'She is my best friend.', 'O benim en iyi arkadaşım.', '"a friend of mine" = bir arkadaşım.'),
  ('Daily Basics', 'general', 'A1', 1, 4, 'house', 'ev', 'noun', 'They live in a big house.', 'Büyük bir evde yaşıyorlar.', '"house" binayı, "home" ise yaşanılan yeri (yuvayı) anlatır.'),
  ('Daily Basics', 'general', 'A1', 1, 5, 'eat', 'yemek yemek', 'verb', 'We eat dinner at seven.', 'Akşam yemeğini yedide yeriz.', 'Düzensiz fiil: eat – ate – eaten.'),
  -- A1 · Everyday Actions
  ('Everyday Actions', 'general', 'A1', 2, 1, 'go', 'gitmek', 'verb', 'I go to school by bus.', 'Okula otobüsle giderim.', 'Düzensiz fiil: go – went – gone.'),
  ('Everyday Actions', 'general', 'A1', 2, 2, 'want', 'istemek', 'verb', 'I want a cup of tea.', 'Bir fincan çay istiyorum.', '"want to + fiil" şeklinde kullanılır: I want to sleep.'),
  ('Everyday Actions', 'general', 'A1', 2, 3, 'help', 'yardım etmek', 'verb', 'Can you help me, please?', 'Bana yardım eder misin lütfen?', 'İsim olarak da kullanılır: "Thanks for your help."'),
  ('Everyday Actions', 'general', 'A1', 2, 4, 'buy', 'satın almak', 'verb', 'She buys fresh bread every morning.', 'Her sabah taze ekmek alır.', 'Düzensiz fiil: buy – bought – bought.'),
  ('Everyday Actions', 'general', 'A1', 2, 5, 'open', 'açmak', 'verb', 'Please open the window.', 'Lütfen pencereyi aç.', 'Sıfat olarak da kullanılır: "The shop is open." (Dükkân açık.)'),
  -- A2 · Travel
  ('Travel', 'general', 'A2', 1, 1, 'ticket', 'bilet', 'noun', 'I bought two train tickets.', 'İki tren bileti aldım.', '"one-way ticket" = gidiş bileti, "return ticket" = gidiş-dönüş bileti.'),
  ('Travel', 'general', 'A2', 1, 2, 'luggage', 'bagaj', 'noun', 'Where can I leave my luggage?', 'Bagajımı nereye bırakabilirim?', 'Sayılamaz isimdir: "a piece of luggage". Amerikan İngilizcesinde "baggage" da kullanılır.'),
  ('Travel', 'general', 'A2', 1, 3, 'passport', 'pasaport', 'noun', 'Don''t forget your passport.', 'Pasaportunu unutma.', 'Sınır kontrolünde ve havalimanlarında kimlik olarak kullanılır.'),
  ('Travel', 'general', 'A2', 1, 4, 'arrive', 'varmak', 'verb', 'The train arrives at nine.', 'Tren dokuzda varır.', 'Şehir/ülke için "arrive in", yer (istasyon, havalimanı) için "arrive at" kullanılır.'),
  ('Travel', 'general', 'A2', 1, 5, 'delay', 'gecikme; ertelemek', 'noun/verb', 'The flight has a two-hour delay.', 'Uçuşun iki saat rötarı var.', 'İsim: "a delay" (gecikme). Fiil: "The storm delayed the flight." (ertelemek).'),
  -- B1 and B2 · adverbs and linking words
  ('Frequency & Time', 'general', 'B1', 1, 1, 'rarely', 'nadiren', 'adverb', 'He rarely eats meat.', 'O nadiren et yer.', 'Sıklık zarfıdır ve olumsuz anlam taşır, bu yüzden ''not'' ile birlikte kullanılmaz. Genelde ana fiilden önce, ''be'' fiilinden sonra gelir.'),
  ('Frequency & Time', 'general', 'B1', 1, 2, 'frequently', 'sık sık', 'adverb', 'She frequently travels for work.', 'O iş için sık sık seyahat eder.', 'Bir şeyin çok tekrarlandığını anlatır. ''often'' ile aynı anlamdadır ama daha resmidir.'),
  ('Frequency & Time', 'general', 'B1', 1, 3, 'immediately', 'hemen, derhal', 'adverb', 'Call me immediately if there is a problem.', 'Bir sorun olursa beni hemen ara.', 'Zaman kaybetmeden yapılması gereken işler için kullanılır. Uyarı, talimat ve acil durumlarda sık geçer.'),
  ('Frequency & Time', 'general', 'B1', 1, 4, 'recently', 'son zamanlarda', 'adverb', 'I haven''t seen him recently.', 'Onu son zamanlarda görmedim.', 'Yakın geçmişi anlatır. Present perfect veya past simple ile kullanılır: ''I have recently moved.'''),
  ('Frequency & Time', 'general', 'B1', 1, 5, 'currently', 'şu anda', 'adverb', 'She is currently working on a new project.', 'Şu anda yeni bir proje üzerinde çalışıyor.', 'Şu an devam eden durum ve işler için kullanılır, çoğunlukla present continuous ile. ''actually'' ile karıştırılmamalı.'),
  ('Certainty & Opinion', 'general', 'B1', 2, 1, 'apparently', 'görünüşe göre', 'adverb', 'Apparently, the meeting has been cancelled.', 'Görünüşe göre toplantı iptal edilmiş.', 'Duyduğun ya da dışarıdan anladığın bilgiyi, tam emin olmadan aktarırken kullanılır.'),
  ('Certainty & Opinion', 'general', 'B1', 2, 2, 'obviously', 'belli ki, açıkça', 'adverb', 'Obviously, nobody wants to work on weekends.', 'Belli ki kimse hafta sonu çalışmak istemiyor.', 'Herkesin görebileceği kadar açık şeyler için kullanılır. Fazla kullanılırsa küstah duyulabilir.'),
  ('Certainty & Opinion', 'general', 'B1', 2, 3, 'definitely', 'kesinlikle', 'adverb', 'I will definitely come to your party.', 'Partine kesinlikle geleceğim.', 'Bir şeyden tamamen emin olunduğunu vurgular. Konumu: ''will definitely'', ''is definitely''.'),
  ('Certainty & Opinion', 'general', 'B1', 2, 4, 'probably', 'muhtemelen', 'adverb', 'It will probably rain tomorrow.', 'Yarın muhtemelen yağmur yağacak.', 'Gerçekleşme ihtimali yüksek olan şeyler için kullanılır. ''will'' ile sık geçer, olumsuzda ''probably won''t'' denir.'),
  ('Certainty & Opinion', 'general', 'B1', 2, 5, 'unfortunately', 'maalesef, ne yazık ki', 'adverb', 'Unfortunately, the flight was cancelled.', 'Maalesef uçuş iptal edildi.', 'Kötü haber verirken veya özür dilerken, çoğunlukla cümle başında kullanılır.'),
  ('Degree & Result', 'general', 'B1', 3, 1, 'actually', 'aslında', 'adverb', 'I thought it was easy, but actually it was quite difficult.', 'Kolay sanmıştım ama aslında oldukça zordu.', 'Sanılanın aksine gerçeği söylerken veya bir düzeltme yaparken kullanılır. Türkçedeki ''şu an'' anlamına gelmez, o ''currently''.'),
  ('Degree & Result', 'general', 'B1', 3, 2, 'eventually', 'sonunda, nihayetinde', 'adverb', 'After many delays, the bus eventually arrived.', 'Birçok gecikmeden sonra otobüs sonunda geldi.', 'Uzun süre, çaba veya gecikmeden sonra gerçekleşen sonuç için kullanılır. ''Olası'' anlamına gelmez.'),
  ('Degree & Result', 'general', 'B1', 3, 3, 'hardly', 'neredeyse hiç', 'adverb', 'I could hardly hear him because of the noise.', 'Gürültüden dolayı onu neredeyse hiç duyamadım.', 'Cümleye olumsuz anlam katar, bu yüzden ''not'' ile kullanılmaz: ''I can hardly see''. ''hardly ever'' = neredeyse hiçbir zaman. ''hard'' (zor) ile karıştırılmamalı.'),
  ('Degree & Result', 'general', 'B1', 3, 4, 'nearly', 'neredeyse', 'adverb', 'I nearly missed the train this morning.', 'Bu sabah treni neredeyse kaçırıyordum.', 'Bir şeye çok yaklaşıldığını ama gerçekleşmediğini anlatır. ''almost'' ile hemen hemen aynıdır.'),
  ('Degree & Result', 'general', 'B1', 3, 5, 'otherwise', 'aksi takdirde, yoksa', 'adverb', 'Hurry up, otherwise we will miss the bus.', 'Acele et, yoksa otobüsü kaçıracağız.', 'Bir koşul gerçekleşmezse ne olacağını anlatır, ''if not'' anlamındadır.'),
  ('Linking Words', 'general', 'B2', 1, 1, 'therefore', 'bu nedenle, dolayısıyla', 'adverb', 'It was raining; therefore, the match was postponed.', 'Yağmur yağıyordu; bu nedenle maç ertelendi.', 'Sonuç belirten resmi bir bağlaçtır. Yazılı dilde ve sınavlarda sık geçer.'),
  ('Linking Words', 'general', 'B2', 1, 2, 'however', 'ancak, fakat', 'adverb', 'The plan is good. However, it is too expensive.', 'Plan iyi. Ancak çok pahalı.', 'Zıtlık bağlacıdır. Cümle başında ''However,'' diye virgülle kullanılır. ''but''tan daha resmidir.'),
  ('Linking Words', 'general', 'B2', 1, 3, 'meanwhile', 'bu arada', 'adverb', 'Cook the rice. Meanwhile, I will prepare the sauce.', 'Pilavı pişir. Bu arada ben sosu hazırlayacağım.', 'Aynı anda olan iki olayı bağlar veya iki olay arasındaki zamanı anlatır.'),
  ('Linking Words', 'general', 'B2', 1, 4, 'moreover', 'üstelik, dahası', 'adverb', 'The hotel is cheap. Moreover, it is close to the beach.', 'Otel ucuz. Üstelik plaja yakın.', 'Önceki bilgiye bir bilgi daha ekler, resmi dildedir. ''besides'' ve ''in addition'' ile aynı anlamdadır.'),
  ('Linking Words', 'general', 'B2', 1, 5, 'nevertheless', 'yine de, buna rağmen', 'adverb', 'It was risky. Nevertheless, they decided to go.', 'Riskliydi. Buna rağmen gitmeye karar verdiler.', 'Beklenenin tersi bir sonucu anlatan resmi zıtlık bağlacıdır.'),
  ('Manner & Degree', 'general', 'B2', 2, 1, 'gradually', 'yavaş yavaş, giderek', 'adverb', 'The weather gradually got warmer.', 'Hava yavaş yavaş ısındı.', 'Küçük adımlarla ve zamanla olan değişimleri anlatır (hava, beceri, fiyat vb.).'),
  ('Manner & Degree', 'general', 'B2', 2, 2, 'entirely', 'tamamen', 'adverb', 'I entirely agree with you.', 'Seninle tamamen aynı fikirdeyim.', 'Bir şeyin tamamını vurgular, ''completely'' ile aynıdır. ''not entirely'' = tam olarak değil.'),
  ('Manner & Degree', 'general', 'B2', 2, 3, 'merely', 'sadece, yalnızca', 'adverb', 'It was merely a mistake, not a crime.', 'Bu sadece bir hataydı, suç değil.', 'Bir şeyi önemsiz veya küçük göstermek için kullanılır. ''only''nin daha resmi halidir.'),
  ('Manner & Degree', 'general', 'B2', 2, 4, 'deliberately', 'kasıtlı olarak, bilerek', 'adverb', 'He deliberately ignored my message.', 'Mesajımı bilerek görmezden geldi.', 'Bir şeyin kazara değil, planlı ve isteyerek yapıldığını anlatır.'),
  ('Manner & Degree', 'general', 'B2', 2, 5, 'relatively', 'nispeten', 'adverb', 'The test was relatively easy.', 'Sınav nispeten kolaydı.', 'Başka şeylerle kıyaslayarak bir özelliği anlatır. Genelde ''relatively + sıfat'' şeklinde kullanılır.')
),
guarded as (
  select * from seed where not exists (select 1 from public.decks d where d.title = seed.deck_title)
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

-- YDS decks: the same words as above, grouped in their own category.
-- They link to the existing word rows, so nothing is duplicated.
with yds (deck_title, deck_position, word_position, english) as (
  values
  ('YDS · Frequency & Time', 1, 1, 'rarely'),
  ('YDS · Frequency & Time', 1, 2, 'frequently'),
  ('YDS · Frequency & Time', 1, 3, 'immediately'),
  ('YDS · Frequency & Time', 1, 4, 'recently'),
  ('YDS · Frequency & Time', 1, 5, 'currently'),
  ('YDS · Certainty & Opinion', 2, 1, 'apparently'),
  ('YDS · Certainty & Opinion', 2, 2, 'obviously'),
  ('YDS · Certainty & Opinion', 2, 3, 'definitely'),
  ('YDS · Certainty & Opinion', 2, 4, 'probably'),
  ('YDS · Certainty & Opinion', 2, 5, 'unfortunately'),
  ('YDS · Degree & Result', 3, 1, 'actually'),
  ('YDS · Degree & Result', 3, 2, 'eventually'),
  ('YDS · Degree & Result', 3, 3, 'hardly'),
  ('YDS · Degree & Result', 3, 4, 'nearly'),
  ('YDS · Degree & Result', 3, 5, 'otherwise'),
  ('YDS · Linking Words', 4, 1, 'therefore'),
  ('YDS · Linking Words', 4, 2, 'however'),
  ('YDS · Linking Words', 4, 3, 'meanwhile'),
  ('YDS · Linking Words', 4, 4, 'moreover'),
  ('YDS · Linking Words', 4, 5, 'nevertheless'),
  ('YDS · Manner & Degree', 5, 1, 'gradually'),
  ('YDS · Manner & Degree', 5, 2, 'entirely'),
  ('YDS · Manner & Degree', 5, 3, 'merely'),
  ('YDS · Manner & Degree', 5, 4, 'deliberately'),
  ('YDS · Manner & Degree', 5, 5, 'relatively')
),
guarded as (
  select * from yds where not exists (select 1 from public.decks d where d.title = yds.deck_title)
),
new_decks as (
  insert into public.decks (title, category, level, position)
  select distinct deck_title, 'yds'::public.deck_category, null::public.cefr_level, deck_position
  from guarded
  returning id, title
)
insert into public.deck_words (deck_id, word_id, position)
select d.id, w.id, g.word_position
from guarded g
join new_decks d on d.title = g.deck_title
join public.words w on w.english = g.english;
