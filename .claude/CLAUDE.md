**CASE BRIEF**

**Psikolojik Danışmanlık Platformu**

*v2.1  |  Son Revize Sonrası Nihai Sürüm*

| Proje Adı | Psikolojik Danışmanlık Platformu |
| :---- | :---- |
| **Versiyon** | v2.1 — Son Revize Sonrası |
| **Mimari** | Tek Sayfa (No /danisan/ panel) \+ Uzman Paneli \+ Admin |
| **Giriş Kanalları** | Danışan (/giris) | Uzman (/uzman/giris) | Admin (/admin/giris) |
| **Şifre Sıfırlama** | Sadece E-posta — Brevo (Sendinblue) |
| **Sayfa Yükleme** | Skeleton Loading (Framer Motion animasyonu kaldırıldı) |
| **Fiyat Gösterimi** | Sadece /paketler sayfasında (uzman kartında gösterilmez) |
| **Paket Sayısı** | 5 adet (içerik müşteriden alınacak, fiyatlar admin'den) |
| **Kurumsal Sayfa** | /kurumsal — Ayrı sayfa ve header navigasyonu |
| **Renk Paleti** | Fresh Ivy Green \#016a59 \+ shade/tint skalası |
| **Tech Stack** | Next.js 15 \+ NestJS \+ PostgreSQL \+ Prisma \+ Tailwind \+ Brevo |

***🔄  Bu brief v2.1 ile güncellendi. Kırmızı kartlar v2.1'de değişen revizeleri gösterir. Stitch, Figma ve kodda bu brief sürekli açık tutulur.***

# **1\. PROJE ÖZETİ**

## **1.1 Ne Yapıyoruz?**

Psikologlar, psikolojik danışmanlar ve terapistlerin listelendiği; danışanların uzman bulup ücretsiz ön görüşme veya talep formu gönderebileceği bir eşleştirme platformu. Ödeme ve randevu sistemi yoktur (Faz 1). Platform güven odaklıdır: her uzman admin onayından geçer, belgeler danışana açıktır.

## **1.2 Kullanıcı Rolleri**

| Rol | Giriş Noktası | Temel Yetkileri |
| :---- | :---- | :---- |
| Anonim Ziyaretçi | Direkt URL | Uzman listesi, blog, testler, iletişim, kurumsal |
| Danışan (Giriş Yapmış) | /giris | Aynı sayfalar \+ test arşivi, favoriler, taleplerim, profil |
| Uzman | /uzman/giris | Kendi panel: profil, belgeler, müsaitlik, talepler, blog |
| Admin | /admin/giris | Tam sistem yönetimi |

*💡 Danışan için ayrı /danisan/ URL alanı YOKTUR. Giriş yapan danışan ana siteyi kullanır; ek içerikler koşullu render edilir.*

## **1.3 Temel Değer Önerileri**

* Admin onaylı, sertifikalı uzman profilleri.

* Ücretsiz ön görüşme — ödeme olmadan WhatsApp üzerinden ilk iletişim.

* Şeffaf paket fiyatları (tek noktada: /paketler sayfası).

* Mobil öncelikli, hızlı yüklenen (skeleton) deneyim.

* KVKK uyumlu, güvenli veri işleme.

# **2\. GÜNCEL SİTE HARİTASI (v2.1)**

## **2.1 Ana Site (Herkese Açık)**

| Sayfa | URL | Giriş Yapmış Danışana Ek İçerik |
| :---- | :---- | :---- |
| Ana Sayfa | / | Ücretsiz ön görüşme popup, kişisel test CTA |
| Uzmanlarımız | /uzmanlar | Favori kaydetme ikonu aktif |
| Uzman Detay | /uzmanlar/\[slug\] | Talep formu aktif (anonim için login yönlendirme) |
| Testler | /testler | Önceki sonuçlarım bölümü görünür |
| Test Çöz+Sonuç | /testler/\[slug\] | Sonuç arşivlenir danışana |
| Blog | /blog | — |
| Blog Detay | /blog/\[slug\] | — |
| Paketler | /paketler | 5 adet paket \+ fiyatlar (admin'den çekilir) |
| Hakkımızda | /hakkimizda | — |
| Nasıl Çalışır | /nasil-calisir | — |
| Uzman Başvurusu | /uzman-basvurusu | — |
| İletişim | /iletisim | Tek form \+ konu dropdown |
| Kurumsal | /kurumsal | Kurumsal bilgi \+ form (AYRI SAYFA) |
| SSS | /sss | — |
| KVKK / Yasal | /kvkk vb. | — |

## **2.2 Auth Sayfaları**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Danışan Giriş | /giris | E-posta \+ şifre |
| Danışan Kayıt | /kayit | Ad, Soyad, Telefon, E-posta, Şifre, Şifre Tekrar, KVKK, Bülten |
| Şifremi Unuttum | /sifre-sifirla | E-posta gir → Brevo mail → Link tıkla → Yeni şifre |
| Uzman Giriş | /uzman/giris | Ayrı sayfa, ayrı flow |
| Uzman Kayıt | /uzman/kayit | Ad, Soyad, Telefon, E-posta, Şifre \+ Sertifika PDF \+ CV PDF |

## **2.3 Uzman Paneli**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Dashboard | /uzman/dashboard | Profil durumu, tamamlanma yüzdesi, istatistikler |
| Profil Düzenleme | /uzman/profil | 80-150 kelime tanıtım, anahtar kelimeler, fotoğraf |
| Belgeler | /uzman/belgeler | Sertifika PDF \+ CV PDF yükleme |
| Müsaitlik | /uzman/musaitlik | Takvim seçimi (login'de de sorulur) |
| Gelen Talepler | /uzman/talepler | Danışan form/talepleri |
| Blog | /uzman/blog | Yazı oluşturma, taslak, onay durumu |
| Bildirimler | /uzman/bildirimler | Admin uyarıları \+ sistem bildirimleri |

## **2.4 Admin Paneli**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Dashboard | /admin/dashboard | Görev odaklı: bekleyen işler |
| Uzmanlar | /admin/uzmanlar | Liste, aktif/pasif, öncelik skoru |
| Onaylar | /admin/onaylar | Profil \+ blog onayları, reddetme notu zorunlu |
| Paketler & Fiyatlar | /admin/paketler | 5 paketin tümünü yönet |
| Anahtar Kelimeler | /admin/anahtar-kelimeler | Taxonomy yönetimi |
| Müsaitlik | /admin/musaitlik | Genel \+ uzman bazlı takvim, kırmızıya alma |
| Blog Moderasyon | /admin/blog | Onayla/Reddet(not), revize statüsü |
| Yorumlar | /admin/yorumlar | Onayla/Reddet moderation |
| SSS | /admin/sss | Soru-cevap çiftleri ekle/düzenle |
| Kullanıcılar | /admin/kullanicilar | Danışan listesi |
| Bülten | /admin/bulten | Abone listesi (Brevo) |
| Bildirimler | /admin/bildirimler | Uzmana uyarı gönder |
| İletişim Formları | /admin/iletisim-formlari | Gelen form talepleri |
| Sistem Ayarları | /admin/ayarlar | Logo, genel, e-posta şablonları |

# **3\. REVİZE NOTLARI — GÜNCEL & NİHAİ SÜRÜM**

*Kırmızı kart \= v2.1'de değişen/güncellenen madde. Yeşil kart \= v2.0'dan gelen, onaylı madde.*

| \#R01 | Ücretsiz Ön Görüşme Popup Giriş yapan danışana (ilk girişte veya belirli sayfada) popup: 'Ücretsiz ön görüşme hakkınız var\!' → 'WhatsApp ile Başlat' butonu. Anonim ziyaretçiye de ana sayfada gösterilir. Popup kapanabilir. |
| :---: | :---- |

| \#R02 | Test Sonucu Görüntüleme Danışan test tamamlayınca anında sonucu görür: puan özeti \+ grafik \+ uzman önerisi CTA. Giriş yapan danışan için arşive kaydedilir (/testler sayfasında 'Önceki Sonuçlarım' bölümü). |
| :---: | :---- |

| \#R03 | Test Yaptırmak İster misiniz? CTA Ana sayfada ve gerekli sayfalarda 'Kendinizi Tanıyın — Ücretsiz Test Yapın' CTA. /testler sayfasına yönlendirir. |
| :---: | :---- |

| \#R04 | Tek Sayfa Mimarisi — Danışan Panel Yok  🔄 v2.1 DEĞİŞTİ AYRI DANIŞAN PANELİ YOKTUR. Danışan giriş yaptıktan sonra aynı sayfaları görür \+ giriş yapanlar için ek UI katmanları (favoriler ikonu, 'Talep Gönder' aktif, test arşivi, header dropdown). |
| :---: | :---- |

| \#R05 | Skeleton Loading  🔄 v2.1 DEĞİŞTİ Framer Motion sayfa animasyonu KALDIRILDI. Her sayfa/komponent için özel skeleton bileşeni. Shimmer: CSS @keyframes gradient sweep 1.5s infinite. prefers-reduced-motion desteği. |
| :---: | :---- |

| \#R06 | Kurumsal Sayfa — Ayrı URL  🔄 v2.1 DEĞİŞTİ /kurumsal ayrı bir sayfa. Header'da 'Kurumsal' navigasyon linki. İçerik: kurumsal hizmet tanıtımı \+ form (Şirket Adı, Yetkili, E-posta, Telefon, Çalışan Sayısı opsiyonel, Konu dropdown, Mesaj). |
| :---: | :---- |

| \#R07 | Şifre Sıfırlama — Sadece Brevo Mail  🔄 v2.1 DEĞİŞTİ Şifre sıfırlama linki sadece e-posta ile gönderilir. Brevo transactional API. SMS ve WhatsApp kanal seçimi kaldırıldı. Link geçerlilik: 30 dakika. |
| :---: | :---- |

| \#R08 | Uzman Listesinde Fiyat Yok  🔄 v2.1 DEĞİŞTİ Uzman kartında ve detay sayfasında fiyat bilgisi gösterilmez. Fiyatlar yalnızca /paketler sayfasında bulunur. Admin merkezi fiyat yönetimi /paketler'e yansır. |
| :---: | :---- |

| \#R09 | 5 Adet Paket  🔄 v2.1 DEĞİŞTİ Paket sayısı 5'e çıkarıldı. İçerikler (isim, seans sayısı, açıklama) müşteriden alınacak. Tüm paket fiyatları admin '/admin/paketler' ekranından güncellenir, /paketler sayfasına yansır. |
| :---: | :---- |

| \#R10 | İletişim Formu — Tek Form \+ Konu Dropdown  🔄 v2.1 DEĞİŞTİ Harita kaldırıldı. Tek iletişim formu. Konu alanı: Soru Sorun | Randevu Oluşturun | Öneri | Şikayet | Diğer. Seçime göre conditional alanlar gösterilebilir. |
| :---: | :---- |

| \#R11 | Sabit Ücretler \+ Admin Merkezi Fiyat Yönetimi Ücretler sabit. Admin '/admin/paketler' ekranından günceller → tüm siteye (sadece /paketler) yansır. Bireysel uzman fiyatı yok. |
| :---: | :---- |

| \#R12 | Uzman Listesi — Yıldız \+ Anahtar Kelime \+ Biyografi Limiti Uzman kartında yıldız puanı (1-5). Anahtar kelimeler chip olarak gösterilir. Profil biyografisi min 80, maks 150 kelime zorunlu. |
| :---: | :---- |

| \#R13 | Uzman Profili — Canlı Destek Bağlantısı Uzman detay sayfasında 'Canlı Destek' butonu (WhatsApp ikonlu, sağ alt sabit). Tıklayınca WhatsApp Business API ile bağlantı. 'Profili İncele' deniyor → detay sayfasında bu buton belirgin. |
| :---: | :---- |

| \#R14 | Kayıt Formu Alanları Danışan: Ad, Soyad, Telefon No, E-posta, Şifre, Şifre Tekrar, KVKK onayı (zorunlu), Bülten izni (opsiyonel). Uzman: Aynı \+ Sertifika PDF (zorunlu), CV/Özgeçmiş PDF (zorunlu). |
| :---: | :---- |

| \#R15 | Sertifikalar — PDF Yükleme, Danışana Görünür Uzman belgeler sayfasına: Sertifika PDF ve CV/Özgeçmiş PDF yükleme. Uzman detay sayfasında danışanlar belgeleri görüntüler (inline PDF viewer veya indirme linki). |
| :---: | :---- |

| \#R16 | Admin — Anahtar Kelime Yönetimi '/admin/anahtar-kelimeler': ekle, düzenle, sırala, yayınla/gizle. Uzmanlar bu listeden seçim yapar, serbest metin yok. |
| :---: | :---- |

| \#R17 | Yüz Yüze Görüşme Kaldırıldı Hizmet tiplerinden 'Yüz Yüze' tamamen kaldırıldı. Sadece online hizmet. Faz 2'de yeniden değerlendirilebilir. |
| :---: | :---- |

| \#R18 | Admin — Revize Notu ile Red Yazısı Admin profil veya blog reddederken not girişi zorunlu. Uzman panelinde belirgin uyarı: 'Reddedildi: \[Admin Notu\]'. Bildirim çanına da düşer. |
| :---: | :---- |

| \#R19 | Uzman Olarak Giriş Yap Header navigasyonunda ve footer'da 'Uzman Girişi' linki. Ayrı /uzman/giris sayfası, ayrı akış. |
| :---: | :---- |

| \#R20 | Profil Güncelleme → Tekrar Onay Uzman her profil güncellemesinde (fotoğraf, biyografi, belgeler vb.) değişiklikler admin onayına düşer. Onaylanana kadar yayındaki eski versiyon görünür. |
| :---: | :---- |

| \#R21 | 80–150 Kelime Tanıtım Yazısı Profil formunda 'Hakkımda' alanı: min 80, maks 150 kelime. Canlı kelime sayacı. Dışında form gönderilemez. |
| :---: | :---- |

| \#R22 | Uzman Öncelik Skoru Admin '/admin/uzmanlar' ekranında her uzmana 1-100 öncelik skoru. Uzman listesi bu skora göre sıralanır. Eşit skorlarda yıldız ikincil kriter. |
| :---: | :---- |

| \#R23 | Canlı Destek Butonu Tüm sayfalarda sağ alt sabit buton. 'Canlı Destek' adı \+ WhatsApp ikonu. Primary (\#016a59) renk. |
| :---: | :---- |

| \#R24 | Yorum Sistemi \+ Admin Moderasyonu Kullanıcı uzman profilinde yorum bırakır → admin panele düşer → Onayla/Reddet. Onaylanan yorum profilde görünür, yıldız ortalamasına dahil olur. |
| :---: | :---- |

*⚠️ Google Yorumları entegrasyonu (Google My Business API) şimdilik beklemede. Altyapı hazır bırakılır, Faz 2'ye ertelendi.*

| \#R25 | Mobil Uzman Kartı Düzeni Sol üst: fotoğraf (72×72px, yuvarlak). Yanına: ad-soyad \+ unvan. Altına: biyografi özeti (2 satır truncate). En alta: etiket chip'leri (min 2, maks 5). Yıldız \+ 'Profili İncele' butonu. |
| :---: | :---- |

| \#R26 | Etiket Limiti — Min 2, Maks 5 Uzman profil formunda anahtar kelime seçimi: min 2, maks 5\. Form validasyonu zorlar. Kart ve profilde chip olarak gösterilir. |
| :---: | :---- |

| \#R27 | Anlık Kullanıcı Sayacı Uzman listesinde 'Şu an X kişi inceliyor' (85+ formatı gibi olabilir). X: simüle, her 30-90s güncellenen veri. Yeşil nabız animasyonu. |
| :---: | :---- |

| \#R28 | Blog Red — Not Zorunlu \+ Revize Edilebilir Admin blog reddederken not girer. Uzman düzeltip tekrar gönderir → 'Revize Gönderildi' statüsü. |
| :---: | :---- |

| \#R29 | Ekibimiz / Hikayemiz Kaldırıldı Hakkımızda'dan 'Ekibimiz' ve 'Hikayemiz' kaldırıldı. Yerine: 'Bizi diğer platformlardan ayıran özellikler' bölümü. |
| :---: | :---- |

| \#R30 | SSL Sertifikası HTTPS zorunlu, HTTP → HTTPS yönlendirme. Vercel SSL otomatik (Let's Encrypt). |
| :---: | :---- |

| \#R31 | Admin — SSS Yönetimi '/admin/sss': Soru \+ Cevap ekle, düzenle, sırala, yayınla/gizle. Ana sitede /sss. |
| :---: | :---- |

| \#R32 | Uzman Uyarı \+ Popup Bildirim Admin uyarı gönderince uzmanın açık sayfasında anlık popup. Kapatınca bildirim çanında kalır. |
| :---: | :---- |

| \#R33 | Danışan Bülten Listesi \+ KVKK Ayrımı Kayıt formunda ayrı iki onay: 1\) KVKK zorunlu, 2\) Bülten opsiyonel. Bülten listesi '/admin/bulten'. Brevo ile toplu mail. |
| :---: | :---- |

| \#R34 | Logo Site Tasarımına Entegre Logo renk paletiyle uyumlu işlenecek. Favicon, og:image, PWA ikonları hazırlanacak. |
| :---: | :---- |

| \#R35 | Müsaitlik Takvimi Genel takvim (admin kırmızıya alır) \+ uzman bazlı bireysel tablolar. Uzman login'de müsaitliğini seçer. Çift yönlü senkronizasyon. |
| :---: | :---- |

| \#R36 | Nasıl Çalışır — Düzenlenmeli '/nasil-calisir' sayfası yeni akışa (talep gönderme, WhatsApp ön görüşme) göre revize edilecek. |
| :---: | :---- |

| \#R37 | Ücretsiz Ön Görüşme → WhatsApp Tüm 'Ücretsiz Ön Görüşme' butonları WhatsApp Business API'ye yönlendirir. Önceden doldurulmuş mesaj şablonu. Numara admin ayarlarından yönetilir. |
| :---: | :---- |

# **4\. ORTAK KOMPONENT & SKELETON LİSTESİ**

| Komponent | Skeleton | İlgili Revize |
| :---- | :---- | :---- |
| ExpertCard (Desktop) | ExpertCardSkeleton | R12, R22, R08 |
| ExpertCard (Mobil) | ExpertCardSkeleton | R25, R26 |
| StarRating | — | R12 |
| TagChip | — | R26 |
| LiveSupportButton (sabit) | — | R23 |
| FreeMeetingPopup | — | R01, R37 |
| LiveUserCount | — | R27 |
| PackageCard | PackageCardSkeleton | R09, R11 |
| PDFViewer | PDFViewerSkeleton | R15 |
| AdminRedNote | — | R18 |
| NotificationBell | — | R32 |
| AvailabilityGrid | AvailabilityGridSkeleton | R35 |
| CorporateForm | — | R06 |
| ContactForm | — | R10 |
| WordCounter | — | R21 |
| TestResultCard | TestResultSkeleton | R02 |
| UserDropdownMenu | — | R04 |
| BlogCard | BlogCardSkeleton | — |
| ProfilePage | ProfileSkeleton | — |

---

**PSİKOLOJİK DANIŞMANLIK PLATFORMU**

**PROJE STANDARTLARI & TEKNİK KURALLAR**

*v2.1  |  Son Revize Sonrası Nihai Sürüm*

**⚠️  v2.1 ile gelen temel mimari değişiklikler: Ayrı danışan paneli kaldırıldı (tek sayfa mimarisi). Sayfa geçiş animasyonu → skeleton. Kurumsal iletişim ayrı sayfa. Şifre sıfırlama sadece Brevo mail.**

# **1\. MİMARİ KARAR DEĞİŞİKLİKLERİ (v2.1)**

## **1.1 Tek Sayfa Mimarisi — Danışan Paneli Kaldırıldı**

**🔄 DEĞİŞTİ: v2.0'da ayrı /danisan/ paneli planlanmıştı. Bu karar iptal edildi.**

Platform tek bir URL alanı üzerinde çalışır. Anonim ziyaretçi ile giriş yapmış danışan aynı sayfaları görür; fark yalnızca gösterilen içerik ve erişilen özelliklerdir.

| Kullanıcı Durumu | Ne Görür? | Ek Erişim |
| :---- | :---- | :---- |
| Anonim Ziyaretçi | Tüm kurumsal sayfalar, uzman listesi, blog, testler | — |
| Giriş Yapmış Danışan | Aynı sayfalar \+ kişisel içerik katmanı | Test sonuçları, favoriler, talepler, profil |

*💡 Danışan giriş yaptıktan sonra Header'da hesap menüsü açılır (profil, taleplerim, testlerim, çıkış). Ayrı bir /danisan/ route yoktur.*

### **Danışan Giriş Sonrası Görünen Ek Unsurlar**

* Ücretsiz ön görüşme hakkı popup (ilk girişte veya belirli sayfada tetiklenir).

* Test sayfasında 'Önceki Sonuçlarım' bölümü görünür.

* 'Test Yaptırmak İster misiniz?' CTA kişiselleştirilmiş olarak gösterilir.

* Uzman profilinde 'Talep Gönder' formu aktif hale gelir (anonim için login yönlendirmesi).

* Header'da kullanıcı adı \+ dropdown menü görünür.

## **1.2 Sayfa Geçişi: Animasyon → Skeleton**

**🔄 DEĞİŞTİ: HiDoctor benzeri Framer Motion sayfa geçişi kararı değiştirildi. Yerine Skeleton loading kullanılır.**

| Durum | Uygulama |
| :---- | :---- |
| Sayfa yüklenirken | İlgili sayfanın skeleton versiyonu gösterilir (kart, liste, metin alanları gri shimmer) |
| Veri çekilirken | Komponent bazlı skeleton (uzman kartı, blog kartı, profil skeleton) |
| Hata durumunda | Error boundary ile açıklayıcı hata mesajı \+ 'Tekrar Dene' butonu |
| Buton aksiyon sonrası | Buton loading spinner (disabled \+ spinner) — bu animasyon kalır |

* Her sayfa için özel skeleton bileşeni yazılır: ExpertCardSkeleton, BlogCardSkeleton, ProfileSkeleton vb.

* Shimmer animasyonu: CSS @keyframes ile gradient sweep, 1.5s infinite.

* prefers-reduced-motion: Skeleton gösterilir, shimmer animasyonu devre dışı kalır.

## **1.3 Kurumsal İletişim — Ayrı Sayfa**

**🔄 DEĞİŞTİ: Kurumsal form artık iletişim sayfasının bir sekmesi değil, ayrı /kurumsal sayfasıdır.**

* URL: /kurumsal

* Header navigasyonunda ayrı link: 'Kurumsal'

* Sayfa içeriği: kurumsal hizmet açıklaması \+ kurumsal iletişim formu.

* Form alanları: Şirket Adı, Yetkili Kişi, E-posta, Telefon, Çalışan Sayısı (opsiyonel), Talep Konusu (dropdown), Mesaj.

## **1.4 Şifre Sıfırlama — Sadece E-posta (Brevo)**

**🔄 DEĞİŞTİ: v2.0'da SMS ve WhatsApp kanal seçimi planlanmıştı. Sadece e-posta ile sıfırlama yapılacak.**

* Şifre sıfırlama maili: Brevo (eski Sendinblue) transactional e-posta API'si.

* Kullanıcı 'Şifremi Unuttum' ekranına e-posta girer → link Brevo üzerinden gönderilir.

* Link geçerlilik süresi: 30 dakika.

* SMS ve WhatsApp kanal seçimi UI'dan tamamen kaldırıldı.

## **1.5 Uzman Listesinde Fiyat Gösterimi**

**🔄 DEĞİŞTİ: Uzman kartında ve listeleme sayfasında fiyat bilgisi gösterilmeyecek.**

* Fiyatlar sadece /paketler sayfasında gösterilir.

* Uzman kartı ve detay sayfasında fiyat alanı yoktur.

* Admin merkezi fiyat yönetimi özelliği korunur — /paketler sayfasına yansır.

## **1.6 Paket Sayısı: 5 Adet**

**🔄 DEĞİŞTİ: v2.0'da Tek \+ Çift seans vardı. Toplam 5 adet paket olacak.**

* 5 adet paket içeriği müşteri tarafından belirlenecek (örnek: 1, 4, 8, 12, 20 seans vb.).

* Her paketin adı, seans sayısı ve fiyatı admin panelden yönetilir.

* /paketler sayfasında 5 kart olarak listelenir.

*💡 Paket içerikleri (isim, seans sayısı, açıklama) müşteriden alınacak. Fiyatlar admin panelden güncellenir.*

## **1.7 İletişim Sayfası Formu**

**🔄 DEĞİŞTİ: Ayrı form sekmeleri yerine tek form \+ konu seçimi dropdown yapısı.**

* Tek bir iletişim formu. 'Konu' alanı dropdown/radio ile seçilir.

* Konu seçenekleri: Soru Sorun | Randevu Oluşturun | Öneri | Şikayet | Diğer

* Seçilen konuya göre form ek alanlar gösterebilir (conditional fields).

* Harita tamamen kaldırıldı.

# **2\. TEKNOLOJİ YIĞINI (TECH STACK)**

## **2.1 Frontend**

| Katman | Teknoloji | Not |
| :---- | :---- | :---- |
| Framework | Next.js 15 (App Router) | SEO için SSR/SSG — blog, uzman profilleri |
| Dil | TypeScript (strict: true) | Tüm dosyalar .tsx / .ts |
| Stil | Tailwind CSS v4 | Utility-first, özel CSS yasak |
| UI Kit | shadcn/ui \+ Radix UI | Erişilebilir, hafif |
| Form | React Hook Form \+ Zod | Tüm formlar RHF \+ Zod validasyon |
| State | Zustand | Global state, Redux yasak |
| Skeleton | Custom CSS shimmer bileşenleri | Her komponent için ayrı skeleton |
| Linting | ESLint \+ Prettier \+ Husky | Commit öncesi otomatik |
| Paket | npm | Yarn kullanılmaz |

## **2.2 Backend**

| Katman | Teknoloji | Not |
| :---- | :---- | :---- |
| Framework | NestJS | Modüler mimari |
| Dil | TypeScript | Tip güvenliği zorunlu |
| Veritabanı | PostgreSQL | İlişkisel; ileride randevu/ödeme modülü için |
| ORM | Prisma ORM | Type-safe, migration yönetimi |
| Auth | JWT \+ Refresh Token | Access: 15dk, Refresh: 7 gün |
| Dosya Depolama | AWS S3 / Cloudinary | CV, sertifika, profil fotoğrafı |
| E-posta | Brevo (Sendinblue) | Şifre sıfırlama \+ transactional mailler \+ bülten |
| WhatsApp | WhatsApp Business API | Canlı destek butonu ve ücretsiz ön görüşme |

## **2.3 DevOps & Güvenlik**

| Alan | Araç/Kural | Detay |
| :---- | :---- | :---- |
| CI/CD | GitHub Actions | Her PR'da lint, test, build zorunlu |
| Hosting | Vercel (Frontend) | Next.js için optimize |
| SSL | Vercel SSL (Let's Encrypt) | Tüm trafikte HTTPS, HTTP → HTTPS yönlendirme |
| Env | .env.local / .env.production | Secret'lar commit'lenmez |
| KVKK | AES-256 şifreleme \+ zorunlu onay | Psikolojik veriler için |
| Rate Limit | Login: 5 istek/dk | Brute-force koruması |

# **3\. RENK PALETİ & TASARIM SİSTEMİ**

## **3.1 Token Sistemi — Fresh Ivy Green**

| Token Adı | Hex | Kullanım Alanı |
| :---- | :---- | :---- |
| fresh-ivy-green (Base) | \#016a59 | Primary butonlar, CTA, aktif state, ana vurgu |
| fresh-ivy-green-shade-300 | \#014a3e | Hover state, heading renkleri |
| fresh-ivy-green-shade-500 | \#01352d | Active/pressed state |
| fresh-ivy-green-tint-300 | \#4d978b | Secondary butonlar, badge, chip |
| fresh-ivy-green-tint-600 | \#99c3bd | Divider, border, disabled state |
| fresh-ivy-green-tint-800 | \#cce1de | Background vurgu alanları |
| fresh-ivy-green-tint-900 | \#e6f0ee | Kart arkaplanı, hafif bg |
| \#FFFFFF | \#FFFFFF | Ana sayfa arka planı, kart içi |
| \#1a1a1a | \#1a1a1a | Body metin |
| \#4a4a4a | \#4a4a4a | İkincil metin, placeholder |
| \#dc2626 | \#dc2626 | Hata, destructive, red butonu |
| \#f59e0b | \#f59e0b | Uyarı, amber |

## **3.2 Renk Kuralları**

* Primary buton: \#016a59 bg \+ beyaz metin. Hover: shade-300. Active: shade-500.

* Ghost/outline buton: beyaz bg, primary border ve metin.

* Destructive: \#dc2626. Uyarı: \#f59e0b. Bilgi: \#3b82f6.

* WCAG AA kontrast zorunlu. Her renk kombinasyonu kontrol edilir.

* Figma'da 'Color Styles' kütüphanesi olarak kurulur, hex doğrudan kullanılmaz.

## **3.3 Tipografi**

| Eleman | Font | Boyut/Ağırlık | Renk |
| :---- | :---- | :---- | :---- |
| H1 | Inter / Geist | 36-48px / 700 | Primary veya Beyaz |
| H2 | Inter / Geist | 28-32px / 600 | shade-300 |
| H3 | Inter / Geist | 20-24px / 600 | Base Primary |
| Body | Inter / Geist | 16px / 400 | \#1a1a1a |
| Label/Caption | Inter / Geist | 12-14px / 500 | \#4a4a4a |
| Buton | Inter / Geist | 14-16px / 600 | Duruma göre |

*💡 next/font ile Inter veya Geist. Google Fonts CDN link kullanılmaz.*

# **4\. BİLEŞEN KURALLARI**

## **4.1 Genel Standartlar**

* Her bileşen tek sorumluluk ilkesine (SRP) uyar.

* Props için TypeScript interface/type zorunlu. 'any' kullanılmaz.

* Bileşen adı PascalCase, dosya adı kebab-case.

* Barrel export: index.ts üzerinden.

* shadcn/ui önce kontrol edilir, özel yazmadan önce.

## **4.2 Skeleton Bileşenleri**

Her veri çeken bileşenin skeleton versiyonu bulunur:

| Bileşen | Skeleton Versiyonu | Not |
| :---- | :---- | :---- |
| ExpertCard | ExpertCardSkeleton | Fotoğraf, başlık, 3 tag, buton placeholder |
| BlogCard | BlogCardSkeleton | Görsel, başlık, meta placeholder |
| ProfilePage | ProfileSkeleton | Fotoğraf \+ uzun metin placeholder |
| PackageCard | PackageCardSkeleton | Başlık \+ fiyat placeholder |
| TestCard | TestCardSkeleton | — |
| AdminList | TableSkeleton | Satır bazlı shimmer |

## **4.3 Buton Hiyerarşisi**

| Varyant | Görünüm | Kullanım |
| :---- | :---- | :---- |
| Primary | \#016a59 bg \+ beyaz metin | Ana CTA: 'Uzman Bul', 'Talep Gönder' |
| Secondary | tint-300 bg \+ beyaz metin | İkincil: 'Filtrele', 'Kaydet' |
| Outline | Beyaz bg \+ primary border | Üçüncül: 'İptal', 'Geri' |
| Ghost | Transparan \+ primary metin | Navigasyon, link buton |
| Destructive | red-600 bg \+ beyaz metin | Sil, Reddet |
| Disabled | tint-600 bg \+ gri metin | Tüm disabled state'ler |

## **4.4 Form Kuralları**

* Tüm formlar React Hook Form \+ Zod.

* Zorunlu alanlar kırmızı yıldız (\*) ile işaretlenir.

* Hata mesajı: alanın altında, red-600, 12px.

* KVKK onay kutusu tüm public formlarda zorunlu.

* Gönder butonu: istek süresince disabled \+ spinner.

* Başarı: toast notification (yeşil) \+ yönlendirme.

## **4.5 Uzman Kartı — Masaüstü & Mobil**

### **Masaüstü**

* Fotoğraf (kare, yuvarlak köşe) — sol veya üst konumda.

* Ad-soyad, unvan, yıldız puanı.

* Anahtar kelime chip'leri (min 2, maks 5).

* 'Profili İncele' butonu.

* Fiyat bilgisi YOK.

### **Mobil**

* Sol üst: profil fotoğrafı (72×72px, yuvarlak köşe).

* Fotoğrafın yanına (sağ): ad-soyad \+ unvan.

* Altına: kısa biyografi özeti (2 satır, truncate).

* En alta: etiket chip'leri (min 2, maks 5, horizontal scroll gerekirse).

* Yıldız puanı \+ 'Profili İncele' butonu.

## **4.6 Canlı Destek Butonu**

* Tüm sayfalarda sağ alt köşede sabit 'Canlı Destek' butonu.

* WhatsApp Business API ile bağlanır. WhatsApp ikonu.

* Renk: Primary (\#016a59). Hover: shade-300.

* Mobilde alt navigasyonla çakışmayacak pozisyon.

*💡 Uzman profili 'Profili İncele' butonuna tıklandıktan sonra detay sayfasında bu buton 'WhatsApp ikonu \+ Canlı Destek' olarak belirgin gösterilir.*

## **4.7 Anlık Kullanıcı Sayacı**

* Uzman listesi sayfasında: 'Şu an X kişi inceliyor' (örnek: 85+ kişi gibi formatlar da olabilir).

* X değeri: 8–47 arası rastgele, her 30–90 saniyede güncellenir (simüle veri).

* Yeşil nabız (pulse) animasyonu \+ metin. Shimmer'dan bağımsız animasyon.

# **5\. SAYFA MİMARİSİ & ROTA YAPISI**

## **5.1 URL & Rota Yapısı**

| Rota | Açıklama | Auth Gerekli? |
| :---- | :---- | :---- |
| / | Ana sayfa | Hayır |
| /uzmanlar | Uzman listesi \+ filtreler | Hayır |
| /uzmanlar/\[slug\] | Uzman detay sayfası | Hayır (talep gönderme için) |
| /testler | Test listeleme | Hayır |
| /testler/\[slug\] | Test çözme \+ sonuç | Hayır (arşiv için evet) |
| /blog | Blog listesi | Hayır |
| /blog/\[slug\] | Blog detay | Hayır |
| /paketler | 5 paket listeleme \+ fiyatlar | Hayır |
| /hakkimizda | Misyon, vizyon, fark | Hayır |
| /nasil-calisir | Adım adım akış | Hayır |
| /uzman-basvurusu | Uzman başvuru formu | Hayır |
| /iletisim | Tek form \+ konu seçimi | Hayır |
| /kurumsal | Kurumsal sayfa \+ form | Hayır |
| /sss | SSS listesi | Hayır |
| /kvkk | KVKK metni | Hayır |
| /giris | Danışan/genel giriş | Hayır |
| /kayit | Danışan kayıt | Hayır |
| /sifre-sifirla | Şifre sıfırlama (Brevo mail) | Hayır |
| /uzman/giris | Uzman özel giriş | Hayır |
| /uzman/kayit | Uzman kayıt | Hayır |
| /uzman/dashboard | Uzman panel anasayfa | Evet (Uzman) |
| /uzman/profil | Profil düzenleme | Evet (Uzman) |
| /uzman/belgeler | Sertifika \+ CV yükleme | Evet (Uzman) |
| /uzman/musaitlik | Müsaitlik takvimi | Evet (Uzman) |
| /uzman/talepler | Gelen danışan formları | Evet (Uzman) |
| /uzman/blog | Blog yazma/yönetme | Evet (Uzman) |
| /uzman/bildirimler | Sistem bildirimleri | Evet (Uzman) |
| /admin/\* | Tüm admin sayfaları | Evet (Admin) |

*💡 Danışana özel içerik (test sonuçları, favoriler, talepler) ana sayfalarda giriş durumuna göre koşullu render edilir. Ayrı /danisan/ rotası yoktur.*

# **6\. UZMAN PROFİL STANDARTLARI**

## **6.1 Profil Alanları**

| Alan | Kural | Not |
| :---- | :---- | :---- |
| Tanıtım Yazısı | Min 80, maks 150 kelime | Canlı kelime sayacı gösterilir |
| Fotoğraf | Zorunlu, kurumsal, min 400×400px | AWS S3 / Cloudinary'a yüklenir |
| Telefon No | Zorunlu (kayıt formunda) | Danışana gösterilmez, sadece admin görür |
| Anahtar Kelimeler | Min 2, maks 5 — admin listesinden seçilir | Serbest metin girişi yok |
| Sertifikalar | PDF, danışana görünür | Inline PDF viewer veya indirme |
| CV/Özgeçmiş | PDF, zorunlu | Kayıt \+ profil formunda yükleme alanı |
| Yıldız Puanı | Onaylı yorumlardan otomatik | 1–5, yarım yıldız destekli |
| Öncelik Skoru | Admin atar: 1–100 | Liste sıralaması bu skora göre |
| Fiyat | Uzman sayfasında gösterilmez | Sadece /paketler sayfasında |
| Durum | Taslak → Onay Bekliyor → Yayında → Pasif | Her güncellemede onaya düşer |

## **6.2 Onay ve Bildirim Akışı**

* Uzman profil kaydeder → 'Admine Gönder' basar → Admin panele düşer.

* Admin ONAYLA: yayına girer.

* Admin REDDET: Not girişi zorunlu → 'Reddedildi: \[Admin Notu\]' formatında uzman panelinde gösterilir.

* Red anında: uzmanın açık sayfasında popup bildirim. Kalıcı: bildirim çanında.

* Uzman düzeltip tekrar gönderebilir.

*💡 Uzman sisteme her giriş yaptığında müsaitlik seçim modalı açılır (eğer güncel müsaitlik girilmemişse).*

# **7\. ADMİN PANELİ KURALLARI**

## **7.1 Dashboard**

* Görev odaklı: sadece aksiyon bekleyen işler büyük puntolarla gösterilir.

* 🔴 Bekleyen uzman başvuruları | 🟡 Profil güncelleme onayları | 🟢 Yeni danışan formları | 🔔 Blog onayları | 💬 Yeni yorumlar

## **7.2 Fiyat & Paket Yönetimi**

* '/admin/paketler' ekranı: 5 adet paketin adı, seans sayısı, fiyatı ve açıklaması düzenlenir.

* Bir güncelleme /paketler sayfasına anında yansır.

* Uzman listesinde fiyat gösterilmez — bu kural admin ekranında da hatırlatılır.

## **7.3 Müsaitlik Takvimi**

* Genel müsaitlik tablosu: admin kapalı/dolu zaman dilimlerini kırmızıya alır.

* Uzman bazlı bireysel tablolar: her uzmana ayrı takvim görünümü.

* Uzman login'de müsaitliğini seçer (modal veya hızlı seçim).

* Genel ve özel müsaitlik çift yönlü senkronize çalışır.

* Admin kırmızıya aldığı slot uzmanın müsaitlik seçimini override eder.

## **7.4 Anahtar Kelime Yönetimi**

* '/admin/anahtar-kelimeler': ekle, düzenle, sırayla, yayınla/gizle.

* Uzmanlar bu listeden seçim yapar. Serbest metin yok.

## **7.5 Blog Moderasyonu**

* Taslak → İncelemede → Yayında / Reddedildi.

* Red: not zorunlu. Uzman düzeltip tekrar gönderebilir → 'Revize Gönderildi' statüsü.

## **7.6 Yorum Moderasyonu**

* Kullanıcı yorumu → admin panele düşer → Onayla / Reddet.

* Onaylanan yorum profilde görünür ve yıldız ortalamasına dahil olur.

*⚠️ Google Yorumları entegrasyonu şimdilik beklemede. Altyapı hazır bırakılır.*

## **7.7 SSS Yönetimi**

* '/admin/sss': soru \+ cevap çifti ekle, düzenle, sırala, yayınla/gizle.

## **7.8 Bülten & KVKK**

* Kayıt formunda iki ayrı onay: 1\) KVKK (zorunlu), 2\) Bülten aboneliği (opsiyonel).

* Bülten onayı verenler '/admin/bulten' altında listelenir.

* Brevo üzerinden toplu mail gönderilebilir.

## **7.9 Uzman Uyarı / Bildirim Gönderme**

* Admin '/admin/bildirimler' ekranından uzman seçip not ile uyarı gönderir.

* Uzmanın açık sayfasında anlık popup. Kapatılınca bildirim çanında kalır.

# **8\. MOBİL KURALLAR**

## **8.1 Breakpoints (Tailwind)**

| Breakpoint | Genişlik | Hedef |
| :---- | :---- | :---- |
| base (xs) | \< 640px | Telefon — PRIMARY tasarım noktası |
| sm | 640px+ | Büyük telefon / küçük tablet |
| md | 768px+ | Tablet |
| lg | 1024px+ | Laptop |
| xl / 2xl | 1280px+ / 1536px+ | Desktop / Geniş ekran |

## **8.2 Mobil Öncelikli Kurallar**

* Tasarım her zaman mobil ekrandan başlar, sonra masaüstüne genişler.

* Dokunma hedefleri minimum 44×44px (iOS HIG standardı).

* Uzman listesi filtreleri: 'Filtrele' butonu → bottom sheet modal.

* Popup içerikler mobilde bottom sheet olarak kaydığında açılır.

# **9\. KOD YAZIM STANDARTLARI**

## **9.1 Klasör Yapısı**

* app/ — Next.js App Router rotaları ve layout'lar

* components/ — atoms, molecules, organisms \+ her biri için skeleton

* features/ — feature-based modüller (uzman/, admin/)

* lib/ — hooks, utils, API servisleri

* types/ — global TypeScript tipleri

## **9.2 Güvenlik**

* SSL zorunlu; HTTP → HTTPS yönlendirme.

* Tüm girdi backend'de sanitize edilir.

* Şifreler bcrypt (min 12 round).

* Admin route'ları IP whitelist \+ 2FA.

* CORS: sadece izinli domainler.

## **9.3 Performans**

* next/image zorunlu, ham \<img\> yasak.

* Lighthouse: Performance \> 85, Accessibility \> 90\.

* next/font ile preload; Google Fonts CDN yasak.

# **10\. KALDIRILAN & DEĞİŞTİRİLEN UNSURLAR (v2.1)**

| Kaldırılan / Değiştirilen | Yerine Gelen | Sürüm |
| :---- | :---- | :---- |
| Ayrı /danisan/ paneli | Tek sayfa mimarisi (koşullu render) | v2.1 |
| Framer Motion sayfa geçişi | Skeleton loading bileşenleri | v2.1 |
| Kurumsal form (iletişim sekmesi) | Ayrı /kurumsal sayfası | v2.1 |
| SMS \+ WhatsApp şifre sıfırlama | Sadece e-posta (Brevo) | v2.1 |
| Uzman kartında fiyat gösterimi | Fiyat yok — sadece /paketler'de | v2.1 |
| 2 paket (tek+çift) | 5 adet paket (içerik müşteriden alınacak) | v2.1 |
| İletişim formu sekmeleri | Tek form \+ konu dropdown (Soru/Randevu/Öneri/Şikayet) | v2.1 |
| İletişim sayfasında harita | Kaldırıldı | v2.0 |
| Ekibimiz \+ Hikayemiz | Bizi ayıran özellikler bölümü | v2.0 |
| Yüz yüze hizmet seçeneği | Kaldırıldı (Faz 2'ye ertelendi) | v2.0 |
| Sayfa popup'ları (geçiş) | Skeleton \+ error boundary | v2.1 |
| Sağ alt WhatsApp butonu adı | Canlı Destek olarak güncellendi | v2.1 |
