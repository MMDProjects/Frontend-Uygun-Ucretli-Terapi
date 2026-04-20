import {
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "Online danışmanlık",
    description:
      "Uzmanınızla güvenli görüşme ortamında buluşun; süreç boyunca iletişim net ve takip edilebilir kalır.",
  },
  {
    icon: ShieldCheck,
    title: "Güven ve gizlilik",
    description:
      "KVKK uyumlu veri işleme ve açık rıza akışlarıyla kişisel bilgileriniz koruma altındadır.",
  },
  {
    icon: Users,
    title: "Uzman eşleştirme",
    description:
      "Alan ve ihtiyaçlarınıza uygun uzmanları listeleyin; profiller üzerinden bilinçli karar verin.",
  },
  {
    icon: ClipboardList,
    title: "Testler ve içerik",
    description:
      "Kısa değerlendirme testleri ve blog içerikleriyle kendinizi tanımanıza destek oluruz.",
  },
] as const;

export function ServicesSection() {
  return (
    <section className="section-shell bg-background" aria-labelledby="home-services-heading">
      <div className="page-shell">
        <h2 id="home-services-heading" className="sr-only">
          Temel hizmetler
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((item) => (
            <article
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm sm:items-start sm:text-left"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                <item.icon className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary-hover">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
