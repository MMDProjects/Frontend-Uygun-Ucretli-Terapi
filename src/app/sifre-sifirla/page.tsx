import { AuthCard } from "@/components/common/auth-card";
import { PageIntro } from "@/components/common/page-intro";

export default function ResetPasswordPage() {
  return (
    <>
      <PageIntro
        title="Yalnizca Brevo e-posta akisina ayrilan public sayfa"
        description="Kural geregi SMS ve WhatsApp secenekleri olmadan, sadece e-posta tabanli sifre sifirlama yapisi hedeflenir."
      />
      <section className="pb-16">
        <div className="page-shell">
          <AuthCard
            title="Sifremi Unuttum"
            description="Kullanici e-posta adresini girer, sonraki iterasyonda Brevo transactional mail entegrasyonu ile link gonderilir."
            fields={[{ id: "email", label: "E-posta", type: "email" }]}
          />
        </div>
      </section>
    </>
  );
}
