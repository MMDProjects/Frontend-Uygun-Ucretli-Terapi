export const homeSteps = [
  {
    n: "01",
    title: "Uzman Seçin",
    desc: "Alanında uzman terapistleri filtreleyin, profillerini inceleyin ve size en uygun uzmanı bulun.",
  },
  {
    n: "02",
    title: "Talep Gönderin",
    desc: "Seçtiğiniz uzmana ön görüşme talebi gönderin. 24 saat içinde dönüş alırsınız.",
  },
  {
    n: "03",
    title: "Seansınıza Başlayın",
    desc: "Belirlenen tarihte güvenli video bağlantısıyla seansınıza katılın. Tamamen çevrimiçi.",
  },
] as const;

export const homeTests = [
  {
    name: "Depresyon Testi (PHQ-9)",
    desc: "Depresyon belirtilerini değerlendirin",
    time: "3 dk",
  },
  {
    name: "Kaygı Testi (GAD-7)",
    desc: "Anksiyete düzeyinizi ölçün",
    time: "2 dk",
  },
  {
    name: "Tükenmişlik Testi",
    desc: "İş stresi ve tükenmişliği ölçün",
    time: "4 dk",
  },
] as const;

export const homeStats = [
  {
    label: "Uzman Sayısı",
    value: "120",
    suffix: "+",
    subtext: "Aktif terapist",
  },
  {
    label: "Tamamlanan",
    value: "8K",
    suffix: "+",
    subtext: "Seans gerçekleşti",
  },
] as const;

export const homeFeatures = [
  {
    label: "MEMNUNIYET",
    value: "4.9",
    subtext: "3.200+ değerlendirme",
    type: "rating",
  },
  {
    label: "İLK SEANSINA KADAR",
    value: "24 saat",
    subtext: "Talep sonrası ortalama yanıt süresi",
    type: "default",
  },
  {
    label: "GÜVENLİ & ÖZEL",
    value: "KVKK uyumlu,\nşifreli bağlantı",
    subtext: "Tüm veriler korunmaktadır",
    type: "security",
  },
] as const;
