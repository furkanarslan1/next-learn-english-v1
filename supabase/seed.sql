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
  ('Manner & Degree', 'general', 'B2', 2, 5, 'relatively', 'nispeten', 'adverb', 'The test was relatively easy.', 'Sınav nispeten kolaydı.', 'Başka şeylerle kıyaslayarak bir özelliği anlatır. Genelde ''relatively + sıfat'' şeklinde kullanılır.'),
  -- B1 and B2 · prepositions and phrases
  ('Place & Direction', 'general', 'B1', 4, 1, 'among', 'arasında (ikiden fazla şey için)', 'preposition', 'She was sitting among her friends.', 'Arkadaşlarının arasında oturuyordu.', 'İkiden fazla kişi veya şey arasında kullanılır. İki şey arasında ise "between" kullanılır.'),
  ('Place & Direction', 'general', 'B1', 4, 2, 'towards', '-e doğru', 'preposition', 'He walked towards the door.', 'Kapıya doğru yürüdü.', 'Yön belirtir, hedefe varıldığını söylemez. Amerikan İngilizcesinde "toward" da kullanılır.'),
  ('Place & Direction', 'general', 'B1', 4, 3, 'opposite', 'karşısında', 'preposition', 'The bank is opposite the station.', 'Banka istasyonun karşısında.', 'Bir şeyin tam karşısındaki yeri anlatır. Sıfat (zıt) ve isim (zıttı) olarak da kullanılır.'),
  ('Place & Direction', 'general', 'B1', 4, 4, 'within', 'içinde, dahilinde', 'preposition', 'Please reply within two days.', 'Lütfen iki gün içinde cevap verin.', 'Bir süre veya sınır içinde anlamındadır: within a week, within the law, within walking distance.'),
  ('Place & Direction', 'general', 'B1', 4, 5, 'throughout', 'boyunca', 'preposition', 'It rained throughout the night.', 'Bütün gece boyunca yağmur yağdı.', 'Bir sürenin başından sonuna kadar süren durumlar için kullanılır. Yer için de kullanılır: throughout the country (ülkenin her yerinde).'),
  ('Contrast & Choice', 'general', 'B1', 5, 1, 'despite', '-e rağmen', 'preposition', 'Despite the rain, we went for a walk.', 'Yağmura rağmen yürüyüşe çıktık.', 'Zıtlık bildirir. Arkasından isim veya -ing gelir: despite the noise, despite being tired. "despite of" denmez, "in spite of" denir.'),
  ('Contrast & Choice', 'general', 'B1', 5, 2, 'except', 'hariç', 'preposition', 'Everyone came except Tom.', 'Tom hariç herkes geldi.', 'Bir kişiyi veya şeyi kapsam dışı bırakır. "except for" ve "except that" biçimleri de vardır.'),
  ('Contrast & Choice', 'general', 'B1', 5, 3, 'instead of', 'yerine', 'preposition', 'I drank tea instead of coffee.', 'Kahve yerine çay içtim.', 'Bir şeyin yerine başka bir şey seçildiğini anlatır. Arkasından isim veya -ing gelir.'),
  ('Contrast & Choice', 'general', 'B1', 5, 4, 'besides', '-in yanı sıra', 'preposition', 'Besides English, she speaks French.', 'İngilizcenin yanı sıra Fransızca da konuşur.', 'Bir şeye ek olarak başka bir şeyi söylerken kullanılır. "beside" (yanında) ile karıştırılmamalı.'),
  ('Contrast & Choice', 'general', 'B1', 5, 5, 'according to', '-e göre', 'preposition', 'According to the report, sales have increased.', 'Rapora göre satışlar arttı.', 'Bir bilginin kaynağını belirtir. Kendi görüşün için kullanılmaz: "according to me" yanlış, "in my opinion" doğru.'),
  ('Position & Movement', 'general', 'B2', 3, 1, 'beyond', 'ötesinde', 'preposition', 'The village is just beyond the hill.', 'Köy tepenin hemen ötesinde.', 'Bir sınırın ötesini anlatır. Mecazi olarak "sınırı aşan" anlamı da taşır: beyond my control (kontrolüm dışında).'),
  ('Position & Movement', 'general', 'B2', 3, 2, 'beneath', 'altında', 'preposition', 'The keys were beneath the sofa.', 'Anahtarlar koltuğun altındaydı.', '"under" sözcüğünün daha resmi ve edebi hâlidir. Mecazi kullanımı da vardır: beneath his dignity.'),
  ('Position & Movement', 'general', 'B2', 3, 3, 'alongside', 'yanında, ile birlikte', 'preposition', 'He worked alongside his father.', 'Babasıyla birlikte çalıştı.', 'Yan yana veya birlikte anlamındadır. Hem yer hem iş birliği için kullanılır.'),
  ('Position & Movement', 'general', 'B2', 3, 4, 'via', 'aracılığıyla, üzerinden', 'preposition', 'We flew to Rome via Munich.', 'Roma''ya Münih üzerinden uçtuk.', 'Bir yer veya yöntem aracılığıyla anlamındadır: via email, via Istanbul.'),
  ('Position & Movement', 'general', 'B2', 3, 5, 'upon', 'üzerine', 'preposition', 'Upon arrival, please check in at the desk.', 'Varışta lütfen resepsiyonda kayıt yaptırın.', '"on" sözcüğünün daha resmi hâlidir. "upon arrival" (varır varmaz) gibi kalıplarda sık geçer.'),
  ('Reason & Contrast', 'general', 'B2', 4, 1, 'due to', 'nedeniyle, yüzünden', 'preposition', 'The flight was cancelled due to bad weather.', 'Uçuş kötü hava nedeniyle iptal edildi.', 'Nedeni belirtir. Genelde "be" fiilinden sonra veya cümle sonunda kullanılır, "because of" ile benzerdir.'),
  ('Reason & Contrast', 'general', 'B2', 4, 2, 'thanks to', 'sayesinde', 'preposition', 'Thanks to your help, we finished early.', 'Senin sayende erken bitirdik.', 'Genelde olumlu bir nedeni belirtir (sayesinde). Olumsuz neden için "due to" veya "because of" tercih edilir.'),
  ('Reason & Contrast', 'general', 'B2', 4, 3, 'apart from', 'dışında, haricinde', 'preposition', 'Apart from Monday, I am free all week.', 'Pazartesi dışında bütün hafta boşum.', 'Hem "hariç" hem "ek olarak" anlamında kullanılabilir. Anlam bağlamdan anlaşılır.'),
  ('Reason & Contrast', 'general', 'B2', 4, 4, 'unlike', '-in aksine', 'preposition', 'Unlike his brother, he loves sports.', 'Kardeşinin aksine spora bayılır.', 'İki kişi veya şey arasındaki farkı gösterir. Cümle başında virgülle kullanılır.'),
  ('Reason & Contrast', 'general', 'B2', 4, 5, 'regarding', 'ile ilgili olarak', 'preposition', 'I am writing regarding your application.', 'Başvurunuzla ilgili yazıyorum.', 'Resmi yazışmalarda "hakkında" anlamında kullanılır. "about" sözcüğünün daha resmi hâlidir.'),
  ('Formal Phrases', 'general', 'B2', 5, 1, 'amid', 'ortasında', 'preposition', 'She stayed calm amid the chaos.', 'Kaosun ortasında sakin kaldı.', 'Genellikle karmaşa veya gürültü gibi bir ortamın içinde anlamında, resmi yazıda kullanılır.'),
  ('Formal Phrases', 'general', 'B2', 5, 2, 'regardless of', '-e bakılmaksızın', 'preposition', 'He helps everyone regardless of age.', 'Yaşa bakılmaksızın herkese yardım eder.', 'Bir şeyin etkisi olmadığını anlatır. Arkasından isim veya -ing gelir.'),
  ('Formal Phrases', 'general', 'B2', 5, 3, 'prior to', '-den önce', 'preposition', 'Prior to the meeting, we reviewed the plan.', 'Toplantıdan önce planı gözden geçirdik.', '"before" sözcüğünün çok resmi hâlidir. Sınavlarda ve resmi metinlerde sık görülür.'),
  ('Formal Phrases', 'general', 'B2', 5, 4, 'on behalf of', 'adına', 'preposition', 'I am speaking on behalf of the team.', 'Ekip adına konuşuyorum.', 'Başkasının yerine veya onun adına yapılan işleri anlatır.'),
  ('Formal Phrases', 'general', 'B2', 5, 5, 'in addition to', '-e ek olarak', 'preposition', 'In addition to his salary, he gets a bonus.', 'Maaşına ek olarak prim alır.', 'Bir şeye ek olarak başka bir şey söylenirken kullanılır. Arkasından isim veya -ing gelir.')
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
  ('YDS · Manner & Degree', 5, 5, 'relatively'),
  ('YDS · Place & Direction', 6, 1, 'among'),
  ('YDS · Place & Direction', 6, 2, 'towards'),
  ('YDS · Place & Direction', 6, 3, 'opposite'),
  ('YDS · Place & Direction', 6, 4, 'within'),
  ('YDS · Place & Direction', 6, 5, 'throughout'),
  ('YDS · Contrast & Choice', 7, 1, 'despite'),
  ('YDS · Contrast & Choice', 7, 2, 'except'),
  ('YDS · Contrast & Choice', 7, 3, 'instead of'),
  ('YDS · Contrast & Choice', 7, 4, 'besides'),
  ('YDS · Contrast & Choice', 7, 5, 'according to'),
  ('YDS · Position & Movement', 8, 1, 'beyond'),
  ('YDS · Position & Movement', 8, 2, 'beneath'),
  ('YDS · Position & Movement', 8, 3, 'alongside'),
  ('YDS · Position & Movement', 8, 4, 'via'),
  ('YDS · Position & Movement', 8, 5, 'upon'),
  ('YDS · Reason & Contrast', 9, 1, 'due to'),
  ('YDS · Reason & Contrast', 9, 2, 'thanks to'),
  ('YDS · Reason & Contrast', 9, 3, 'apart from'),
  ('YDS · Reason & Contrast', 9, 4, 'unlike'),
  ('YDS · Reason & Contrast', 9, 5, 'regarding'),
  ('YDS · Formal Phrases', 10, 1, 'amid'),
  ('YDS · Formal Phrases', 10, 2, 'regardless of'),
  ('YDS · Formal Phrases', 10, 3, 'prior to'),
  ('YDS · Formal Phrases', 10, 4, 'on behalf of'),
  ('YDS · Formal Phrases', 10, 5, 'in addition to')
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


-- Grammar topics. Safe to run more than once (slug is unique).
insert into public.grammar_topics (slug, title, level, position, content)
values
  ('to-be', 'To Be (am / is / are)', 'A1', 1, $j${"summary": "\"Olmak\" fiilidir. Kim olduğumuzu, nasıl olduğumuzu, nerede olduğumuzu ve yaşımızı anlatırken kullanılır.", "rules": [{"title": "Öznelere göre değişir", "text": "I → am, he / she / it → is, you / we / they → are."}, {"title": "Kısaltmalar", "text": "I am → I'm, he is → he's, they are → they're, is not → isn't, are not → aren't."}], "forms": [{"label": "Olumlu", "formula": "özne + am / is / are", "examples": [{"en": "I am a student.", "tr": "Ben bir öğrenciyim."}, {"en": "She is happy.", "tr": "O mutlu."}, {"en": "They are at home.", "tr": "Onlar evde."}]}, {"label": "Olumsuz", "formula": "özne + am / is / are + not", "examples": [{"en": "I am not tired.", "tr": "Yorgun değilim."}, {"en": "He isn't here.", "tr": "O burada değil."}]}, {"label": "Soru", "formula": "Am / Is / Are + özne ...?", "examples": [{"en": "Are you ready?", "tr": "Hazır mısın?"}, {"en": "Is she a teacher?", "tr": "O öğretmen mi?"}]}], "signals": [], "notes": ["Soru cümlesinde fiil özneden önce gelir: You are → Are you ...?", "Kısa cevaplarda olumlu formun kısaltması kullanılmaz: Yes, I am. (Yes, I'm. ✗)", "\"I am not\" için \"amn't\" diye bir kısaltma yoktur, \"I'm not\" denir."]}$j$::jsonb),
  ('present-simple', 'Present Simple', 'A1', 2, $j${"summary": "Alışkanlıkları, rutinleri, genel gerçekleri ve değişmeyen durumları anlatır.", "rules": [{"title": "Yapı", "text": "I / you / we / they + fiil, he / she / it + fiil + s / es."}, {"title": "-s / -es kuralı", "text": "-s, -sh, -ch, -x, -o ile bitenlere -es eklenir (watch → watches, go → goes). Ünsüz + y ile bitenlerde y düşer ve -ies gelir (study → studies)."}], "forms": [{"label": "Olumlu", "formula": "özne + fiil (he / she / it için -s)", "examples": [{"en": "I work every day.", "tr": "Her gün çalışırım."}, {"en": "She drinks coffee in the morning.", "tr": "O sabahları kahve içer."}]}, {"label": "Olumsuz", "formula": "özne + do / does + not + yalın fiil", "examples": [{"en": "They don't live here.", "tr": "Onlar burada yaşamıyor."}, {"en": "He doesn't like fish.", "tr": "O balığı sevmez."}]}, {"label": "Soru", "formula": "Do / Does + özne + yalın fiil ...?", "examples": [{"en": "Do you speak English?", "tr": "İngilizce konuşuyor musun?"}, {"en": "Does she work here?", "tr": "O burada mı çalışıyor?"}]}], "signals": ["always", "usually", "often", "sometimes", "never", "every day", "on Mondays"], "notes": ["does / doesn't kullanıldığında ana fiil yalın kalır: She doesn't likes ✗ → She doesn't like ✓", "Sıklık zarfları (always, never ...) genelde ana fiilden önce, \"be\" fiilinden sonra gelir."]}$j$::jsonb),
  ('present-continuous', 'Present Continuous', 'A1', 3, $j${"summary": "Şu anda olan, geçici süren eylemleri ve yakın gelecek için planlanmış işleri anlatır.", "rules": [{"title": "Yapı", "text": "özne + am / is / are + fiil-ing"}, {"title": "Yazım kuralı", "text": "e ile biten fiillerde e düşer (make → making). Tek heceli ve ünsüz-ünlü-ünsüz biten fiillerde son harf ikilenir (run → running, sit → sitting)."}], "forms": [{"label": "Olumlu", "formula": "özne + am / is / are + fiil-ing", "examples": [{"en": "I am reading a book.", "tr": "Bir kitap okuyorum."}, {"en": "They are playing football.", "tr": "Futbol oynuyorlar."}]}, {"label": "Olumsuz", "formula": "özne + am / is / are + not + fiil-ing", "examples": [{"en": "She isn't sleeping.", "tr": "O uyumuyor."}, {"en": "I'm not working today.", "tr": "Bugün çalışmıyorum."}]}, {"label": "Soru", "formula": "Am / Is / Are + özne + fiil-ing ...?", "examples": [{"en": "Are you listening to me?", "tr": "Beni dinliyor musun?"}, {"en": "What is he doing?", "tr": "O ne yapıyor?"}]}], "signals": ["now", "right now", "at the moment", "today", "currently", "these days", "Look!", "Listen!"], "notes": ["Durum fiilleri (know, like, love, want, need, believe ...) genelde -ing almaz: I know ✓, I am knowing ✗", "Yakın gelecek için planlanmış işlerde de kullanılır: I'm meeting him tomorrow."]}$j$::jsonb),
  ('past-simple', 'Past Simple', 'A2', 1, $j${"summary": "Geçmişte başlayıp biten eylemleri anlatır.", "rules": [{"title": "Düzenli fiiller", "text": "Fiile -ed eklenir: work → worked. e ile bitenlere sadece -d (live → lived), ünsüz + y ile bitenlerde -ied (study → studied)."}, {"title": "Düzensiz fiiller", "text": "Kendi biçimleri vardır, ezberlenmelidir: go → went, see → saw, have → had, buy → bought."}], "forms": [{"label": "Olumlu", "formula": "özne + fiil-ed / düzensiz 2. hâl", "examples": [{"en": "I visited my grandmother yesterday.", "tr": "Dün büyükannemi ziyaret ettim."}, {"en": "They went to Izmir last year.", "tr": "Geçen yıl İzmir'e gittiler."}]}, {"label": "Olumsuz", "formula": "özne + did not (didn't) + yalın fiil", "examples": [{"en": "She didn't come to the party.", "tr": "O partiye gelmedi."}, {"en": "We didn't see the film.", "tr": "Filmi izlemedik."}]}, {"label": "Soru", "formula": "Did + özne + yalın fiil ...?", "examples": [{"en": "Did you call him?", "tr": "Onu aradın mı?"}, {"en": "Where did they go?", "tr": "Nereye gittiler?"}]}], "signals": ["yesterday", "last week", "last year", "ago", "in 2020", "when I was a child"], "notes": ["did kullanıldığında ana fiil yalın kalır: Did she went? ✗ → Did she go? ✓", "\"be\" fiilinin geçmişi was / were'dir ve did ile kullanılmaz: I was tired. Were you at home?"]}$j$::jsonb),
  ('future-will-going-to', 'Future: will / going to', 'A2', 2, $j${"summary": "Gelecekteki olayları anlatır. will anlık kararlar ve tahminler, going to önceden verilmiş planlar için kullanılır.", "rules": [{"title": "will", "text": "özne + will + yalın fiil. Anlık karar, söz verme, teklif ve tahmin için kullanılır: I'll help you."}, {"title": "be going to", "text": "özne + am / is / are + going to + yalın fiil. Önceden verilmiş karar, plan ve şimdiki işaretlere dayanan tahminler için kullanılır."}], "forms": [{"label": "Olumlu", "formula": "will + fiil  /  am-is-are going to + fiil", "examples": [{"en": "I will call you later.", "tr": "Seni sonra arayacağım."}, {"en": "We are going to travel next month.", "tr": "Gelecek ay seyahat edeceğiz."}]}, {"label": "Olumsuz", "formula": "will not (won't) + fiil  /  am-is-are not going to + fiil", "examples": [{"en": "He won't be late.", "tr": "O geç kalmayacak."}, {"en": "I'm not going to buy it.", "tr": "Onu satın almayacağım."}]}, {"label": "Soru", "formula": "Will + özne + fiil ...?  /  Am-Is-Are + özne + going to + fiil ...?", "examples": [{"en": "Will you help me?", "tr": "Bana yardım eder misin?"}, {"en": "Are you going to study tonight?", "tr": "Bu gece ders çalışacak mısın?"}]}], "signals": ["tomorrow", "next week", "soon", "in two days", "tonight"], "notes": ["Karar o anda veriliyorsa will, daha önceden verilmişse going to kullanılır: \"The phone is ringing.\" \"I'll get it.\"", "will tüm öznelerle aynıdır ve fiil -s almaz: She will go ✓"]}$j$::jsonb),
  ('present-perfect', 'Present Perfect', 'B1', 1, $j${"summary": "Geçmişte olan ama şimdiyle bağlantısı bulunan olayları anlatır: deneyimler, yeni bitmiş işler ve hâlâ süren durumlar.", "rules": [{"title": "Yapı", "text": "özne + have / has + fiilin 3. hâli (V3)"}, {"title": "V3 nedir?", "text": "Düzenli fiillerde -ed (worked), düzensizlerde kendi biçimi (go → gone, see → seen, eat → eaten)."}, {"title": "have / has", "text": "he / she / it ile has, diğer öznelerle have kullanılır."}], "forms": [{"label": "Olumlu", "formula": "özne + have / has + V3", "examples": [{"en": "I have visited London twice.", "tr": "Londra'yı iki kez ziyaret ettim."}, {"en": "She has finished her homework.", "tr": "Ödevini bitirdi."}]}, {"label": "Olumsuz", "formula": "özne + have / has + not + V3", "examples": [{"en": "We haven't seen him today.", "tr": "Onu bugün görmedik."}, {"en": "He hasn't called yet.", "tr": "O henüz aramadı."}]}, {"label": "Soru", "formula": "Have / Has + özne + V3 ...?", "examples": [{"en": "Have you ever been to Italy?", "tr": "Hiç İtalya'ya gittin mi?"}, {"en": "Has she arrived?", "tr": "O geldi mi?"}]}], "signals": ["ever", "never", "already", "yet", "just", "since", "for", "recently", "so far"], "notes": ["Belirli bir geçmiş zaman ifadesiyle (yesterday, in 2019, last week) kullanılmaz. O durumda Past Simple kullanılır.", "for + süre (for two years), since + başlangıç noktası (since 2022).", "have been to = gidip döndü, have gone to = gitti ve henüz dönmedi."]}$j$::jsonb),
  ('first-conditional', 'First Conditional', 'B1', 2, $j${"summary": "Gelecekte gerçekleşmesi mümkün olan koşulları ve olası sonuçlarını anlatır.", "rules": [{"title": "Yapı", "text": "If + Present Simple, will + yalın fiil"}, {"title": "Sıra değişebilir", "text": "Sonuç cümlesi başa gelirse virgül kullanılmaz: I will call you if I have time."}], "forms": [{"label": "Olumlu", "formula": "If + Present Simple, will + yalın fiil", "examples": [{"en": "If it rains, we will stay at home.", "tr": "Yağmur yağarsa evde kalırız."}, {"en": "If you study, you will pass the exam.", "tr": "Çalışırsan sınavı geçersin."}]}, {"label": "Olumsuz", "formula": "If + özne + don't / doesn't ..., will not (won't) + yalın fiil", "examples": [{"en": "If you don't hurry, you will miss the bus.", "tr": "Acele etmezsen otobüsü kaçırırsın."}, {"en": "She won't come if she is tired.", "tr": "Yorgunsa gelmeyecek."}]}, {"label": "Soru", "formula": "Will + özne + yalın fiil + if + Present Simple ...?", "examples": [{"en": "What will you do if you lose your job?", "tr": "İşini kaybedersen ne yapacaksın?"}, {"en": "Will he help us if we ask?", "tr": "Sorarsak bize yardım eder mi?"}]}], "signals": ["if", "unless", "when", "as soon as"], "notes": ["if cümlesinde will kullanılmaz: If it will rain ✗ → If it rains ✓", "unless = if ... not: Unless you hurry, you will miss the bus."]}$j$::jsonb)
on conflict (slug) do nothing;


-- Grammar exercises (multiple choice). Safe to run more than once.
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "She ___ a teacher.", "options": ["am", "is", "are"], "answer": 1, "explanation": "he / she / it ile \"is\" kullanılır."}, {"sentence": "They ___ at home.", "options": ["is", "are", "am"], "answer": 1, "explanation": "they ile \"are\" kullanılır."}, {"sentence": "I ___ not tired.", "options": ["am", "is", "are"], "answer": 0, "explanation": "I ile \"am\" kullanılır: I am not tired."}, {"sentence": "___ you ready?", "options": ["Is", "Am", "Are"], "answer": 2, "explanation": "you ile soru cümlesi \"Are you ...?\" şeklinde kurulur."}, {"sentence": "He ___ my brother.", "options": ["are", "is", "am"], "answer": 1, "explanation": "he ile \"is\" kullanılır."}]}$j$::jsonb where slug = 'to-be';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "She ___ coffee every morning.", "options": ["drink", "drinks", "drinking"], "answer": 1, "explanation": "he / she / it ile fiile -s eklenir."}, {"sentence": "They ___ like fish.", "options": ["don't", "doesn't", "isn't"], "answer": 0, "explanation": "they ile olumsuzda \"don't\" kullanılır."}, {"sentence": "___ he work here?", "options": ["Do", "Does", "Is"], "answer": 1, "explanation": "he / she / it ile soru \"Does ...?\" ile kurulur."}, {"sentence": "My father ___ to work by bus.", "options": ["go", "goes", "going"], "answer": 1, "explanation": "go fiili he / she / it ile \"goes\" olur."}, {"sentence": "I ___ speak French.", "options": ["doesn't", "don't", "not"], "answer": 1, "explanation": "I ile olumsuzda \"don't\" kullanılır."}]}$j$::jsonb where slug = 'present-simple';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "Look! It ___ raining.", "options": ["is", "are", "does"], "answer": 0, "explanation": "it ile \"is\" kullanılır: It is raining."}, {"sentence": "I ___ a book at the moment.", "options": ["read", "am reading", "reads"], "answer": 1, "explanation": "\"at the moment\" Present Continuous işaretidir: am + fiil-ing."}, {"sentence": "They ___ playing football now.", "options": ["is", "are", "am"], "answer": 1, "explanation": "they ile \"are\" kullanılır."}, {"sentence": "She ___ sleeping right now.", "options": ["isn't", "don't", "doesn't"], "answer": 0, "explanation": "Olumsuz: is not (isn't) + fiil-ing."}, {"sentence": "What ___ you doing?", "options": ["is", "are", "do"], "answer": 1, "explanation": "you ile \"are\" kullanılır: What are you doing?"}]}$j$::jsonb where slug = 'present-continuous';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "I ___ my grandmother yesterday.", "options": ["visit", "visited", "visiting"], "answer": 1, "explanation": "\"yesterday\" geçmiş zaman işaretidir: fiile -ed eklenir."}, {"sentence": "They ___ to Izmir last year.", "options": ["go", "goes", "went"], "answer": 2, "explanation": "go düzensiz fiildir: go – went – gone."}, {"sentence": "She ___ come to the party.", "options": ["didn't", "don't", "wasn't"], "answer": 0, "explanation": "Geçmişte olumsuz: did not (didn't) + yalın fiil."}, {"sentence": "___ you call him?", "options": ["Do", "Did", "Are"], "answer": 1, "explanation": "Geçmişte soru \"Did + özne + yalın fiil\" ile kurulur."}, {"sentence": "We ___ the film last night.", "options": ["see", "saw", "seen"], "answer": 1, "explanation": "see düzensiz fiildir: see – saw – seen."}]}$j$::jsonb where slug = 'past-simple';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "I'm tired. I think I ___ go to bed early.", "options": ["will", "am going", "going to"], "answer": 0, "explanation": "O anda verilen karar için \"will\" kullanılır."}, {"sentence": "Look at those clouds! It ___ rain.", "options": ["will", "is going to", "going"], "answer": 1, "explanation": "Şimdiki işarete dayanan tahminde \"be going to\" kullanılır."}, {"sentence": "He ___ be late. He is always on time.", "options": ["won't", "doesn't", "isn't going"], "answer": 0, "explanation": "Tahminde olumsuz: will not (won't) + yalın fiil."}, {"sentence": "We ___ travel next month. We have already bought the tickets.", "options": ["will", "are going to", "go"], "answer": 1, "explanation": "Önceden verilmiş plan için \"be going to\" kullanılır."}, {"sentence": "___ you help me with this box?", "options": ["Will", "Are", "Do"], "answer": 0, "explanation": "Rica ve teklifte \"Will you ...?\" kullanılır."}]}$j$::jsonb where slug = 'future-will-going-to';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "I ___ London twice.", "options": ["have visited", "has visited", "visit"], "answer": 0, "explanation": "I ile \"have\" + V3 kullanılır: have visited."}, {"sentence": "She ___ her homework yet.", "options": ["hasn't finished", "didn't finished", "haven't finished"], "answer": 0, "explanation": "she ile \"hasn't\" + V3 kullanılır; \"yet\" olumsuzda cümle sonuna gelir."}, {"sentence": "___ you ever been to Italy?", "options": ["Did", "Have", "Has"], "answer": 1, "explanation": "you ile soru \"Have you ever ...?\" şeklinde kurulur."}, {"sentence": "He has lived here ___ 2019.", "options": ["for", "since", "ago"], "answer": 1, "explanation": "Başlangıç noktası (2019) ile \"since\" kullanılır."}, {"sentence": "They have lived here ___ ten years.", "options": ["since", "for", "ago"], "answer": 1, "explanation": "Süre (ten years) ile \"for\" kullanılır."}]}$j$::jsonb where slug = 'present-perfect';
update public.grammar_topics set content = content || $j${"exercises": [{"sentence": "If it rains, we ___ at home.", "options": ["stay", "will stay", "stayed"], "answer": 1, "explanation": "Sonuç cümlesinde \"will + yalın fiil\" kullanılır."}, {"sentence": "If you ___ hard, you will pass the exam.", "options": ["study", "will study", "studied"], "answer": 0, "explanation": "if cümlesinde Present Simple kullanılır, will kullanılmaz."}, {"sentence": "She ___ come if she is tired.", "options": ["won't", "doesn't", "didn't"], "answer": 0, "explanation": "Sonuç cümlesinde olumsuz: will not (won't) + yalın fiil."}, {"sentence": "___ you hurry, you will miss the bus.", "options": ["If", "Unless", "When"], "answer": 1, "explanation": "unless = if ... not: Acele etmezsen otobüsü kaçırırsın."}, {"sentence": "If he ___ me, I will tell him.", "options": ["will call", "calls", "called"], "answer": 1, "explanation": "if cümlesinde will kullanılmaz: If he calls ..."}]}$j$::jsonb where slug = 'first-conditional';
