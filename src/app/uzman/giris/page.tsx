import { AuthCard } from "@/components/common/auth-card";
import { PageIntro } from "@/components/common/page-intro";

export default function ExpertLoginPage() {
  return (
    <>
      <PageIntro
        title="Uzmanlara ayrik giris akisi icin temel sayfa"
        description="Uzman paneli ikinci asamada detaylandirilacak olsa da, ayrik giris noktasi simdiden olusturuldu."
      />
      <section className="pb-16">
        <div className="page-shell">
          <AuthCard
            title="Uzman Girisi"
            description="Uzman paneline gecis yapacak kullanicilar icin e-posta ve sifre tabanli giris kabugu."
            fields={[
              { id: "email", label: "E-posta", type: "email" },
              { id: "password", label: "Sifre", type: "password" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
