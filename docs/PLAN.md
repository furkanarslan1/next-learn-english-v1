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
- Telaffuz için ücretsiz Web Speech API.

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

## 4. Expo hazırlığı
- Tekrar aralığı ve skor gibi iş mantığı UI'dan ayrı saf fonksiyonlar olarak yazılır, mobilde de kullanılır.
- Veri her iki platformda aynı Supabase backend'inden gelir.
- Tasarım mobile-first yapılır.

## 5. İsteğe bağlı eklemeler
- Günlük seri (streak) ve hedef takibi.
- Yanlış yapılan kelimeler için ayrı tekrar listesi.
- Boşluk doldurma testi (kalıpları cümle içinde pekiştirir).

## 6. Supabase free plan notları
- Bir hafta aktivite olmazsa proje duraklatılır. Canlıya çıkarken Pro plana geçmek mantıklı.
- Veritabanı limiti 500 MB. Satır sayısını yukarıdaki kurallarla düşük tutuyoruz.

## Sıradaki adımlar
1. Supabase projesi aç, `.env.local` ekle.
2. Şema: `supabase/migrations` altında (yazıldı, Supabase projesine uygulanacak).
3. Giriş (auth) akışı.
4. Mobil öncelikli ana sayfa.
5. Kelime seçme ve tekrar ekranı.
