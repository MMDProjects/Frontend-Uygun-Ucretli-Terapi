import { AuthCard } from "@/components/common/auth-card";
import { PageIntro } from "@/components/common/page-intro";

export default function LoginPage() {
  return (
    <>
      <PageIntro
        title="Tek sayfa mimarisine uyumlu public giris sayfasi"
        description="Danisan girisi, ayrik panel yerine mevcut site deneyimine kisisel katman ekleyecek sekilde konumlandi."
      />
      <section className="pb-16">
        <div className="page-shell">
          <AuthCard
            title="Giris Yap"
            description="Bu iskelet, Brevo sifre sifirlama ve JWT tabanli auth akisina baglanacak public giris formunun temelidir."
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
