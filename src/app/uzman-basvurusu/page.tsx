import { PageIntro } from "@/components/common/page-intro";

export default function ExpertApplicationPage() {
  return (
    <>
      <PageIntro
        title="Uzman basvuru akisina ayrilan public sayfa"
        description="Sertifika PDF ve CV yukleme gereksinimlerine uygun form yapisi sonraki asamada bu sayfaya eklenecek."
      />
      <section className="pb-16">
        <div className="page-shell">
          <div className="surface-card p-8 text-sm leading-7 text-muted-foreground">
            Basvuru formu icin RHF + Zod tabanli ve dosya yukleme destekli bir
            yapi sonraki iterasyonda baglanacak.
          </div>
        </div>
      </section>
    </>
  );
}
