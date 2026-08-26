# Dal Modeli ve Terfi Kurallari

> Bu dosya dal / ortam eslemesinin **tek kaynagidir**. Diger dokumanlar bu
> tabloyu tekrar etmez, buraya link verir. Ayni icerik backend reposunda da
> aynadir; degisiklik ikisinde birden yapilir.

## Dallar

```
feat/uzman-filtreleri ──PR (squash)──► test ──PR (merge commit)──► main ──► VPS deploy
```

| Dal | Rol | Deploy |
|---|---|---|
| `feat/*` `fix/*` `chore/*` `infra/*` | Gunluk is | Yok — yalniz CI |
| `test` | Entegrasyon / QA | Yok (ayri test sunucusu henuz yok) |
| `main` | Prod'a hazir kod | Her merge'de VPS'e otomatik deploy |

Rehberdeki uc dalli modelden (`dev → test → main`) sapma: ayri bir test
sunucusu olmadigi ve ekip kucuk oldugu icin `dev` dali acilmadi; is dallari
`dev`'in rolunu ustlenir. Ayri bir QA ortami kurulursa `dev` eklenmeli ve o
gun terfi otomasyonunun GitHub tuzaklari birlikte degerlendirilmelidir.

## Kurallar

1. Tum is dallari **`test`'ten** acilir.
2. `main`'e yalnizca `test` veya `hotfix/*` dalindan PR acilabilir.
   CI'daki **Terfi Zinciri Kontrolu** job'u bunu zorlar.
3. `main`'e merge = **canliya deploy**. Yarim is `test`'e bile merge edilmez.
4. `test` ortaminda bulunan bug `test` uzerinde duzeltilmez — `test`'ten
   `fix/*` acilir, tekrar terfi ettirilir. Aksi halde dallar ayrisir.
5. Hotfix sonrasi **`main → test` geri-merge zorunlu**. Atlanirsa bir sonraki
   terfi duzeltmeyi geri alir. Bu adim otomatiklestirilmedi — bilinen risk.
6. Is dali omru <= 3 gun (`hotfix/*` saatler).

## Merge yontemi

| Yon | Yontem | Neden |
|---|---|---|
| is dali → `test` | **squash** | Temiz gecmis |
| `test` → `main` | **merge commit** | Commit kimligi korunmali; squash yeni commit uretir ve dallar kalici ayrisir |

Rebase merge repo ayarindan kapatilmistir.

## Isimlendirme

`<tur>/<kebab-aciklama>` — tur kucuk harf: `feat fix hotfix chore infra`.
Turkce karakter ve bosluk yasak. Is kodu varsa BUYUK harfle araya girer:
`feat/UUT-12-uzman-filtreleri`.

## Korumalar

`main` ve `test`: dogrudan push kapali, force-push kapali, dal silme kapali,
konusma cozumu zorunlu. Zorunlu kontroller:

| Hedef | Zorunlu kontroller |
|---|---|
| `test` | `Frontend CI`, `Docker Imaj Build` |
| `main` | + `Terfi Zinciri Kontrolu` |

> **Dikkat:** zorunlu kontrol adlari CI job adlarina (Turkce adlar dahil)
> birebir baglidir. Bir job'u yeniden adlandirmak korumayi **sessizce** kirar.
