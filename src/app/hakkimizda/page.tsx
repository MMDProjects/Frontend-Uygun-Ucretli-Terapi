import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Users,
  Star,
  HeartHandshake,
  Zap,
  Lock,
  Target,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Çocuk aile rehberlik ve erişkin merkezi olarak online danışmanlığı herkes için erişilebilir kılmak amacıyla kurulduk. Admin onaylı uzmanlar, şeffaf süreçler.",
  openGraph: {
    title: "Hakkımızda | Yeçamer",
    description:
      "Çocuk aile rehberlik ve erişkin merkezi olarak online danışmanlığı herkes için erişilebilir kılmak amacıyla kurulduk.",
    url: "https://yecamer.com.tr/hakkimizda",
  },
};

const STATS = [
  { value: "30+", label: "Uzman", description: "Admin onaylı, belgelenmiş profesyoneller" },
  { value: "5.000+", label: "Danışan", description: "Platforma güvenen kullanıcılar" },
  { value: "4.8", label: "Ortalama Puan", description: "Onaylı danışan yorumlarına göre" },
  { value: "0 TL", label: "Ön Görüşme", description: "İlk tanışma görüşmesi tamamen ücretsiz" },
];

const DIFFERENTIATORS = [
  {
    icon: Shield,
    title: "Admin Onaylı Uzmanlar",
    description:
      "Her uzman profili ekibimiz tarafından incelenir; diplomalar ve sertifikalar doğrulanır. Onaylanmayan profil yayına alınmaz.",
  },
  {
    icon: Users,
    title: "Doğru Eşleştirme",
    description:
      "Uzmanlık alanları ve müsaitlik takvimine göre size en uygun danışmanı bulmanıza yardımcı oluruz.",
  },
  {
    icon: HeartHandshake,
    title: "Ücretsiz Ön Görüşme",
    description:
      "Herhangi bir ücret ödemeden WhatsApp üzerinden kısa bir tanışma görüşmesi yapabilirsiniz.",
  },
  {
    icon: Lock,
    title: "KVKK Uyumlu & Güvenli",
    description:
      "Kişisel ve psikolojik verileriniz AES-256 ile şifrelenerek KVKK kapsamında korunur.",
  },
  {
    icon: Star,
    title: "Şeffaf Değerlendirme",
    description:
      "Yıldız puanları yalnızca gerçek danışanların onaylı yorumlarından oluşur; sahte yorum eklenmez.",
  },
  {
    icon: Zap,
    title: "Mobil Öncelikli Deneyim",
    description:
      "Her sayfa hızlı yüklenir, skeleton ile bekleme süresi hissedilmez. Telefondan tam erişim.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Hakkımızda
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Çocuk aile rehberlik ve erişkin merkezi olarak online danışmanlığı
              herkes için erişilebilir kılmak amacıyla kurulduk. Admin onaylı
              uzmanlarımız ve şeffaf süreçlerimizle güvene dayalı bir
              eşleştirme platformu sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-primary/20 bg-white p-5 text-center shadow-sm"
            >
              <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-semibold text-primary-hover">
                {stat.label}
              </span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="bg-white py-12">
        <div className="page-shell grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-[#e6f0ee] p-8">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Target className="size-5 text-primary" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-primary-hover">Misyonumuz</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Online danışmanlığı herkes için erişilebilir kılmak; güvenilir
              uzmanlarla danışanları buluşturarak sağlıklı, mutlu bireyler ve
              toplumlar oluşturmak.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-[#e6f0ee] p-8">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Eye className="size-5 text-primary" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-primary-hover">Vizyonumuz</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Türkiye&apos;nin en güvenilir online danışmanlık platformu olmak;
              her bireyin ihtiyaç duyduğunda profesyonel destek alabileceği
              şeffaf ve erişilebilir bir ekosistem kurmak.
            </p>
          </div>
        </div>
      </section>

      {/* Fark Yaratan Özellikler */}
      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-primary-hover sm:text-3xl">
            Neden Bizi Seçmelisiniz?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" aria-hidden />
                </div>
                <h3 className="text-sm font-bold text-primary-hover">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="page-shell flex flex-col items-center gap-5 text-center">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-primary-hover sm:text-3xl">
            Uzmanlarımızla Tanışmaya Hazır mısınız?
          </h2>
          <p className="max-w-lg text-sm leading-7 text-muted-foreground">
            Ücretsiz ön görüşme hakkınızı kullanarak size en uygun uzmanı
            bulabilir, sürece güvenli bir şekilde başlayabilirsiniz.
          </p>
          <Link
            href="/uzmanlar"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Uzmanları Keşfet
          </Link>
        </div>
      </section>
    </>
  );
}
