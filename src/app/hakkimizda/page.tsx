import { Shield, Users, Star, HeartHandshake, Zap, Lock } from "lucide-react";
import { PageIntro } from "@/components/common/page-intro";

const STATS = [
  { value: "150+", label: "Uzman", description: "Admin onaylı, belgelenmiş profesyoneller" },
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
      <PageIntro
        title="Bizi Diğer Platformlardan Ayıran Özellikler"
        description="Psikolojik danışmanlıkta güven ve şeffaflığı ön planda tutuyoruz. İşte fark yaratan unsurlar."
      />

      {/* İstatistik Kartları */}
      <section className="bg-[#cce1de] py-10">
        <div className="page-shell grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-primary/20 bg-white p-5 text-center shadow-sm"
            >
              <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-semibold text-primary-hover">{stat.label}</span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.description}</span>
            </div>
          ))}
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
