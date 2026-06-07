import type { Metadata } from "next";
import { PageIntro } from "@/components/common/page-intro";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Uygun Ücretli Terapi platformu kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
};

const sections = [
  {
    id: "veri-sorumlusu",
    title: "1. Veri Sorumlusu",
    content: (
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        kapsamında kişisel verileriniz; veri sorumlusu sıfatıyla{" "}
        <strong>Uygun Ücretli Terapi</strong> (bundan böyle &quot;Platform&quot;
        olarak anılacaktır) tarafından aşağıda açıklanan amaçlar doğrultusunda
        işlenmektedir.
      </p>
    ),
  },
  {
    id: "islenen-veriler",
    title: "2. İşlenen Kişisel Veriler",
    content: (
      <>
        <p className="mb-3">
          Platform tarafından aşağıdaki kişisel veri kategorileri
          işlenmektedir:
        </p>
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong>Kimlik Verileri:</strong> Ad, soyad, kullanıcı adı.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong>İletişim Verileri:</strong> E-posta adresi, telefon
              numarası.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong>İşlem Güvenliği Verileri:</strong> Şifrelenmiş parola,
              giriş zamanı, IP adresi log kayıtları.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong>Özel Nitelikli Kişisel Veriler:</strong> Psikolojik
              değerlendirme testi sonuçları ve danışmanlık talep içerikleri
              (yalnızca açık rızanıza dayanılarak işlenir).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong>Pazarlama Verileri:</strong> Bülten aboneliği tercihi
              (isteğe bağlı, ayrı onaya tabidir).
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "isleme-amaclari",
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    content: (
      <>
        <p className="mb-3">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul className="space-y-2 pl-4">
          {[
            "Üyelik kaydının oluşturulması ve hesap güvenliğinin sağlanması",
            "Uzman ile danışan arasındaki eşleşme sürecinin yürütülmesi",
            "Ücretsiz ön görüşme talebinin iletilmesi ve takibi",
            "Psikolojik değerlendirme testlerinin uygulanması ve sonuçların arşivlenmesi",
            "Platform ile ilgili teknik destek, bilgilendirme ve iletişim faaliyetlerinin yürütülmesi",
            "Yasal yükümlülüklerin yerine getirilmesi ve mevzuata uyum",
            "İzin vermeniz hâlinde elektronik ticari ileti (bülten) gönderilmesi",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "hukuki-sebepler",
    title: "4. Hukuki Sebepler",
    content: (
      <>
        <p className="mb-3">
          Kişisel verileriniz KVKK&apos;nın 5. ve 6. maddeleri kapsamında
          aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
        </p>
        <ul className="space-y-2 pl-4">
          {[
            "Açık rızanızın varlığı (özel nitelikli veriler ve pazarlama iletişimi için)",
            "Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması",
            "Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi",
            "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "veri-aktarimi",
    title: "5. Kişisel Verilerin Aktarılması",
    content: (
      <>
        <p className="mb-3">
          Kişisel verileriniz; KVKK&apos;nın 8. ve 9. maddeleri çerçevesinde
          aşağıdaki taraflarla paylaşılabilir:
        </p>
        <ul className="space-y-2 pl-4">
          {[
            "Onaylı uzmanlar — yalnızca talep gönderdiğiniz veya eşleştiğiniz uzmanlarla sınırlı bilgi paylaşımı",
            "Altyapı hizmet sağlayıcıları — barındırma, e-posta (Brevo/Sendinblue) ve depolama (AWS S3 / Cloudinary) hizmetleri",
            "Yasal zorunluluk hâlinde ilgili kamu kurum ve kuruluşları",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Kişisel verileriniz, yukarıda sayılanlar dışında üçüncü taraflarla
          paylaşılmaz; ticari amaçla satılmaz, kiralanmaz veya başka şekilde
          kullanıma sunulmaz.
        </p>
      </>
    ),
  },
  {
    id: "veri-toplama-yontemi",
    title: "6. Veri Toplama Yöntemi",
    content: (
      <p>
        Kişisel verileriniz; kayıt ve giriş formları, iletişim ve talep
        formları, test çözme ekranları ile çerezler (cookies) aracılığıyla
        elektronik ortamda toplanmaktadır. Psikolojik değerlendirme testi
        sonuçları gibi özel nitelikli veriler yalnızca açık rızanıza dayanılarak
        ve AES-256 şifreleme yöntemiyle güvenli biçimde saklanmaktadır.
      </p>
    ),
  },
  {
    id: "haklariniz",
    title: "7. Haklarınız (KVKK Madde 11)",
    content: (
      <>
        <p className="mb-3">
          KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="space-y-2 pl-4">
          {[
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
            "İşlenmişse buna ilişkin bilgi talep etme",
            "İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
            "Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme",
            "Eksik veya yanlış işlenmiş kişisel verilerin düzeltilmesini isteme",
            "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme",
            "Otomatik sistemler vasıtasıyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
            "Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Bu haklarınızı kullanmak için{" "}
          <a
            href="mailto:destek@psikodestek.com"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            destek@psikodestek.com
          </a>{" "}
          adresine yazılı olarak başvurabilirsiniz. Başvurularınız en geç{" "}
          <strong>30 gün</strong> içinde yanıtlanacaktır.
        </p>
      </>
    ),
  },
  {
    id: "cerezler",
    title: "8. Çerez (Cookie) Politikası",
    content: (
      <p>
        Platform, oturum yönetimi ve kullanıcı deneyimini iyileştirmek amacıyla
        zorunlu çerezler kullanmaktadır. Bu çerezler kişisel kimliğinizi
        doğrudan tanımlamaz; yalnızca oturum güvenliğini sağlar. Tarayıcı
        ayarlarından çerez tercihlerinizi yönetebilirsiniz; ancak bazı
        işlevlerin bu durumda kısıtlanabileceğini hatırlatırız.
      </p>
    ),
  },
  {
    id: "guncelleme",
    title: "9. Güncelleme ve İletişim",
    content: (
      <p>
        Bu aydınlatma metni yasal düzenlemelere veya platform uygulamalarındaki
        değişikliklere bağlı olarak güncellenebilir. Güncel metin her zaman bu
        sayfada yayımlanır. Sorularınız için{" "}
        <a
          href="mailto:destek@psikodestek.com"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          destek@psikodestek.com
        </a>{" "}
        adresinden bize ulaşabilirsiniz.
      </p>
    ),
  },
];

export default function KvkkPage() {
  return (
    <>
      <PageIntro
        title="KVKK Aydınlatma Metni"
        description="Kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğuna dair bilgilendirme."
      />

      <section className="pb-20 pt-4">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl">
            {/* Son güncelleme */}
            <p className="mb-8 text-sm text-muted-foreground">
              Son güncelleme: Haziran 2025
            </p>

            {/* İçerik kartı */}
            <div className="rounded-2xl border border-border bg-white shadow-sm">
              {/* Hızlı navigasyon */}
              <div className="border-b border-border px-8 py-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  İçindekiler
                </p>
                <nav className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="text-sm text-primary underline-offset-2 hover:underline"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bölümler */}
              <div className="divide-y divide-border">
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="px-8 py-7 scroll-mt-24">
                    <h2 className="mb-4 text-base font-semibold text-foreground">
                      {s.title}
                    </h2>
                    <div className="text-sm leading-7 text-muted-foreground">
                      {s.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
