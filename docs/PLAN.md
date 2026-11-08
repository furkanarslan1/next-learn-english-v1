# İngilizce Uygulaması – Plan ve Kararlar

## Amaç
Gramer, kelime ve kalıpları unutmamak için tekrar ve pratik yapılabilen uygulama. Önce Next.js (web, mobil uyumlu), sonra Expo ile mobil app. Backend: Supabase (free plan ile başla).

## Teknoloji
Next.js, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), shadcn/ui, react-icons, Tailwind.

## Ana sayfa bölümleri
- Kelime öğren
- Gramer çalış
- Düello yap

## 1. Kelime sistemi

### Kart içeriği
- Kelime kartı: İngilizcesi, Türkçesi, örnek cümle, hangi anlamda ve nerede kullanıldığı.
- Ses (telaffuz) şimdilik yok.

### Aralıklı tekrar aşamaları
- Aşamalar: 3 saat, 6 saat, 12 saat, 24 saat, 2 gün, 4 gün, 1 hafta, 1 ay. Sayılar örnektir.
- Aşama tablosu kodda sabit tutulur, kolay değiştirilir.
- Sonradan SM-2 benzeri dinamik aralığa geçilebilir.

### Maliyet ve performans kuralları
- Kelime ve deste içeriği herkese ortak tablolarda durur, kullanıcıya kopyalanmaz.
- Kullanıcı başına sadece **aktif desteler** satır olarak tutulur. Öğrenilenler profildeki dizilere taşınır, tablo büyümez.
- Tekrarda yeni satır eklenmez, mevcut satır güncellenir.
- Kaydırma ve testler istemcide çalışır. Oturum sonunda tek güncelleme atılır.
- Index: `(user_id, next_review_at)`.
- Bildirim için cron gerekmez. Uygulama açılınca `next_review_at <= now()` olanlar çekilir.
- Kelime/gramer içeriği cache'lenir (Next.js cache).
- Satır tahmini: 5.000 kullanıcı × ~10 aktif deste = 50 bin satır (~5 MB). Free plan limiti 500 MB.


### Deste (kart grubu) modeli
Kelime takibi desteler üzerinden yapılır.

- Kelimeler **deste** halinde sunulur (örn. 5 kelime). Desteleri şimdilik biz seviyeye göre hazırlarız. Kullanıcının kendi destesini oluşturması sonraya bırakıldı (şema buna açık kalacak).
- Tekrar takvimi **desteye** bağlıdır, kelimeye değil. Kullanıcı başına satır sayısı = deste sayısı.
- `user_decks`: `user_id`, `deck_id`, `stage smallint`, `next_review_at`, `success_count smallint`, `known_word_ids int[]`.
- `decks` ve `words` herkese ortak, cache'lenir.
- **Zorunlu olan:** tekrar oturumunda sadece kartları kaydırmak.
- **İsteğe bağlı:** boşluk doldurma (TR → EN), doğru/yanlış, çoktan seçmeli, tüm öğrenilenlerle genel pratik.
- Kaydırma ve testler istemcide çalışır. Oturum bitince **tek** güncelleme atılır (aşama, sonraki tekrar, bilinen kelimeler).
- Tekrar sıklığı kuralları ("ilk 3 saatte 4 oturum..." gibi) kodda sabit bir tabloda tutulur, kolay değiştirilir. Oturum başına tek güncelleme olduğu için maliyet düşük kalır.
- Tüm sayılar (deste boyutu, eşikler, tekrar sayıları) örnektir, değiştirilebilir.

#### Kategoriler
- Desteler `category` alanıyla ayrılır: `general` (A1, A2, B1... seviyeye göre) ve `yds` (YDS kelimeleri, seviyesi yok).
- Kelimeler ekranında seviye ve YDS sekme olarak görünür.
- Aynı anda en fazla 3 aktif deste (`MAX_ACTIVE_DECKS`, `lib/srs.ts`). Tekrar aralıkları da orada.
- Örnek veri `supabase/seed.sql` içinde. YDS kelimeleri hem seviye desteleri (B1/B2) hem ayrı YDS desteleri olarak durur. Aynı kelime birden fazla desteye bağlanabilir (`deck_words`), kelime kopyalanmaz. Yeni YDS kelimeleri geldikçe seed'e eklenir.

#### "Biliyorum" işareti
- Kullanıcı destedeki bir kelimeyi "Biliyorum" diye işaretleyebilir. Geri alınabilir.
- İşaretli kelime tekrar oturumlarında gizlenir. Deste küçülür.
- Tüm kelimeler bilindi olunca (veya kullanıcı "Öğrendim" deyince) deste öğrenilmiş sayılır ve sıradaki deste açılır.
- Boşalan yere yeni kelime **eklenmez** (yeni kelime 0. aşamadan başlar, deste ise ileri aşamada olabilir, takvim karışır).
- Bilinen kelimeler genel pratik ve testlere dahil olmaya devam eder (unutmayı fark etmek için).
- Öğrenilen desteler satır olarak tutulmaz: deste id'si profildeki `learned_deck_ids int[]` alanına, kelime id'leri `learned_word_ids int[]` alanına taşınır. Tablo büyümez.

## 2. Gramer sistemi
- Seviyelere göre gruplanır: A1, A2, B1, B2...
- Her konu bir bilgi kartıdır (örn. Present Continuous): kural, olumlu, olumsuz, soru cümleleri, örnekler, notlar.
- İçerik veritabanında veya JSON olarak tutulur. Kod değiştirmeden güncellenebilir.
- Gramer konularına da aynı aralıklı tekrar bağlanabilir.

## 3. Düello (Challenge)
- **İlk sürüm eşzamansız (asenkron):**
  - Oyuncu A testi çözer, skor ve süre kaydedilir.
  - Oyuncu B aynı sorularla sonra çözer. Skorlar karşılaştırılır.
  - Realtime bağlantı gerekmez, maliyet düşük, bağlantı limitine takılmaz.
- Sorular düello oluşturulurken sunucuda seçilir. Doğru cevaplar istemciye gönderilmez. Kontrol sunucuda (Postgres fonksiyonu veya Route Handler) yapılır.
- Canlı (Supabase Realtime) düello sonraya bırakılır. Free plan'da eşzamanlı ~200 bağlantı sınırı var.

### Düello – uygulanan yapı
- Rakip nickname ile bulunur. Sorular (10 adet, 4 şıklı) sunucuda `create_duel()` ile üretilir.
- Cevap anahtarı `duel_answer_keys` tablosunda durur. RLS açık ve hiç policy yok, API'den okunamaz.
- Skor sadece `submit_duel()` ile yazılır, doğrudan insert/update kapalı. Cevaplar sunucuda puanlanır.
- Rakibin skoru, sen bitirene kadar gizlidir. Eşitlikte hızlı olan kazanır (süreyi istemci gönderir, bu yüzden tam güvenli değildir).
- Maliyet notu: her düello 1 satır + 1 anahtar satırı. İleride bitmiş düelloları belirli süre sonra silen bir temizlik (pg_cron) eklenebilir.

### Canlı düello (isteğe bağlı mod)
- Varsayılan eşzamansız kalır. Canlı mod, iki oyuncu da "Canlı oyna"ya basarsa açılır.
- Maliyet kuralları: Realtime bağlantısı sadece canlı moda girilince kurulur. Sadece Broadcast ve Presence kullanılır (veritabanı dinleme yok). Sadece "kaçıncı soruda" sayısı gönderilir. Lobide 2 dakika rakip gelmezse, düello bitince ve sayfadan çıkınca bağlantı kapanır. Bağlantı kurulamazsa normal moda dönülür.
- Puanlama yine sunucuda `submit_duel()` ile yapılır, canlı mesajlar skor taşımaz.
- Supabase ücretsiz plan Realtime limitleri (yaklaşık 200 eşzamanlı bağlantı, ayda 2 milyon mesaj) Dashboard → Usage'tan doğrulanmalı.
- Presence bazen birkaç saniye geç yayılabilir; arayüz olay geldikçe güncellenir.

## Günlük seri
- `touch_streak()` kayıtlı bir etkinlik (deste oturumu, gramer testi, düello) tamamlanınca çalışır. Günler Türkiye saatine göre sayılır.

## Gramer tekrarı
- Her konunun 5 çoktan seçmeli sorusu var. Test %70 ve üstü geçilirse konu `user_grammar` ile aynı aşama takvimine göre tekrar edilir. Kalınırsa bir aşama geri gidip 3 saat sonra tekrar gelir. Tekrar zamanı gelmemişse takvim değişmez.

## 4. Expo hazırlığı
- Tekrar aralığı ve skor gibi iş mantığı UI'dan ayrı saf fonksiyonlar olarak yazılır, mobilde de kullanılır.
- Veri her iki platformda aynı Supabase backend'inden gelir.
- Tasarım mobile-first yapılır.

## 5. İsteğe bağlı eklemeler
- Günlük seri (streak) ve hedef takibi.
- Yanlış yapılan kelimeler için ayrı tekrar listesi.
- Boşluk doldurma testi (kalıpları cümle içinde pekiştirir).

## Tema
- Ana renk indigo (primary), vurgu amber, başarı yeşil. Renkler `app/globals.css` içinde tek yerden değişir.
- Font: Nunito. Yuvarlak köşeler (`--radius: 1rem`), büyük dokunma alanları (buton yüksekliği 44px).
- Açık/koyu tema sistem ayarını izler (şimdilik manuel anahtar yok).
- Giriş yapılmış sayfalar `app/(app)` altında, ortak alt gezinme çubuğu (yüzen dock) ile.
- Hedef kitle genel İngilizce öğrenenler. YDS sadece ayrı bir kelime bölümü.

## 6. Supabase free plan notları
- Bir hafta aktivite olmazsa proje duraklatılır. Canlıya çıkarken Pro plana geçmek mantıklı.
- Veritabanı limiti 500 MB. Satır sayısını yukarıdaki kurallarla düşük tutuyoruz.

## Sıradaki adımlar
1. Supabase projesi aç, `.env.local` ekle.
2. Şema: `supabase/migrations` altında (yazıldı, Supabase projesine uygulanacak).
3. Giriş: e-posta ve şifre (yazıldı). Kayıttan sonra benzersiz nickname seçilir (büyük/küçük harf duyarsız). Google girişi şimdilik ertelendi.
4. Mobil öncelikli ana sayfa.
5. Kelime desteleri, kart çalışma ekranı, testler, genel pratik, gramer ve düello yazıldı. Arayüz Türkçe. Gramer testleri, günlük seri ve canlı düello da yazıldı. Sıradaki: gerçek YDS listesi, Expo.
