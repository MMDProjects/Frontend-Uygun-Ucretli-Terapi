# Guvenlik Politikasi

## Desteklenen surumler

Yalnizca `main` dalindaki son surum desteklenir.

## Aciklarin bildirimi

Guvenlik aciklarini **public issue olarak acmayin**. GitHub uzerinden
private vulnerability reporting kullanin:
**Security → Report a vulnerability**.

- Ilk yanit taahhudu: **72 saat**
- Duzeltme sonrasi bildiren kisiye geri donus yapilir

Bildiriminizde: etkilenen sayfa/bilesen, yeniden uretim adimlari, etki
degerlendirmesi ve varsa PoC yer alsin.

## Kapsam disi

- Test/local ortama yonelik DoS veya yuk testi
- Sosyal muhendislik
- Guncel olmayan bagimliliklarin salt varligi (somut sömürü yolu olmadan)

## Secret sizmasi durumunda

1. Ilgili secret **hemen rotate edilir** (once rotate, sonra temizlik).
2. Git gecmisinden `git filter-repo` / BFG ile temizlenir —
   `git rm` gecmisten silmez.
3. Sizinti public repoya girdiyse GitHub Support bilgilendirilir.
4. Ekip bilgilendirilir, olay backend reposundaki `docs/devops/known-issues.md` dosyasina islenir.
