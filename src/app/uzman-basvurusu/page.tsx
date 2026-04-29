"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// ─── Sabit veriler ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "İletişim" },
  { id: 2, label: "Eğitim" },
  { id: 3, label: "Sertifika" },
  { id: 4, label: "Uzmanlık" },
  { id: 5, label: "Onay" },
];

const HEDEF_KITLE = ["Yetişkin", "Çocuk", "Ergen", "Çift"];

const UZMANLIK_ALANLARI = [
  "Aile ve Çift Danışmanlığı",
  "Cinsel Terapi",
  "Çocuk Psikolojisi",
  "Ergen Psikolojisi",
  "İlişki Danışmanlığı",
  "Sınav Koçu",
  "Yetişkin Psikolojisi",
  "Travma ve TSSB",
  "Depresyon",
  "Kaygı Bozuklukları",
];

const DENEYIM_SURESI = [
  "1 yıldan az",
  "1–3 yıl",
  "3–5 yıl",
  "5–10 yıl",
  "10 yıldan fazla",
];

// ─── Tip tanımları ────────────────────────────────────────────────────────────

type Sertifika = { ad: string; kurum: string };

type FormData = {
  // Adım 1
  ad: string; soyad: string; eposta: string; telefon: string;
  il: string; ilce: string; yas: string; cinsiyet: string;
  site: string; instagram: string;
  // Adım 2
  lisansUni: string; lisansBolum: string; lisansYil: string;
  ylUni: string; ylBolum: string; ylYil: string;
  // Adım 3
  sertifikalar: Sertifika[];
  // Adım 4
  hedefKitle: string[]; uzmanlikAlanlari: string[];
  deneyim: string; biyografi: string;
  // Adım 5
  kvkk: boolean; kosullar: boolean;
};

const INITIAL: FormData = {
  ad: "", soyad: "", eposta: "", telefon: "",
  il: "", ilce: "", yas: "", cinsiyet: "",
  site: "", instagram: "",
  lisansUni: "", lisansBolum: "", lisansYil: "",
  ylUni: "", ylBolum: "", ylYil: "",
  sertifikalar: [{ ad: "", kurum: "" }],
  hedefKitle: [], uzmanlikAlanlari: [],
  deneyim: "", biyografi: "",
  kvkk: false, kosullar: false,
};

// ─── Yardımcı bileşenler ──────────────────────────────────────────────────────

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
    </div>
  );
}

function Chip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ─── Adım bileşenleri ─────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <FieldGroup>
        <Field label="Ad" required>
          <Input value={data.ad} onChange={(e) => set("ad", e.target.value)} />
        </Field>
        <Field label="Soyad" required>
          <Input value={data.soyad} onChange={(e) => set("soyad", e.target.value)} />
        </Field>
        <Field label="E-posta" required>
          <Input type="email" value={data.eposta} onChange={(e) => set("eposta", e.target.value)} />
        </Field>
        <Field label="Telefon" required>
          <Input type="tel" placeholder="05XX XXX XX XX" value={data.telefon} onChange={(e) => set("telefon", e.target.value)} />
        </Field>
        <Field label="İl" required>
          <Input value={data.il} onChange={(e) => set("il", e.target.value)} />
        </Field>
        <Field label="İlçe" required>
          <Input value={data.ilce} onChange={(e) => set("ilce", e.target.value)} />
        </Field>
        <Field label="Yaş">
          <Input type="number" min={18} value={data.yas} onChange={(e) => set("yas", e.target.value)} />
        </Field>
        <Field label="Cinsiyet">
          <select
            value={data.cinsiyet}
            onChange={(e) => set("cinsiyet", e.target.value)}
            className="h-11 w-full rounded-2xl border border-input bg-white px-4 text-base text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seçin</option>
            <option>Kadın</option>
            <option>Erkek</option>
            <option>Belirtmek istemiyorum</option>
          </select>
        </Field>
        <Field label="Kişisel Site">
          <Input placeholder="https://..." value={data.site} onChange={(e) => set("site", e.target.value)} />
        </Field>
        <Field label="Instagram">
          <Input placeholder="@uzmanadi" value={data.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function EduBlock({
  title, required,
  uni, bolum, yil,
  onUni, onBolum, onYil,
}: {
  title: string; required?: boolean;
  uni: string; bolum: string; yil: string;
  onUni: (v: string) => void; onBolum: (v: string) => void; onYil: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <FieldGroup>
        <Field label="Üniversite" required={required}>
          <Input value={uni} onChange={(e) => onUni(e.target.value)} />
        </Field>
        <div className="space-y-4">
          <Field label="Bölüm" required={required}>
            <Input value={bolum} onChange={(e) => onBolum(e.target.value)} />
          </Field>
          <Field label="Mezuniyet Yılı">
            <Input type="number" placeholder="2020" value={yil} onChange={(e) => onYil(e.target.value)} />
          </Field>
        </div>
      </FieldGroup>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <EduBlock
        title="Lisans Eğitimi" required
        uni={data.lisansUni} bolum={data.lisansBolum} yil={data.lisansYil}
        onUni={(v) => set("lisansUni", v)}
        onBolum={(v) => set("lisansBolum", v)}
        onYil={(v) => set("lisansYil", v)}
      />
      <div className="border-t border-border" />
      <EduBlock
        title="Yüksek Lisans (Opsiyonel)"
        uni={data.ylUni} bolum={data.ylBolum} yil={data.ylYil}
        onUni={(v) => set("ylUni", v)}
        onBolum={(v) => set("ylBolum", v)}
        onYil={(v) => set("ylYil", v)}
      />
    </div>
  );
}

function Step3({
  sertifikalar, setSertifikalar,
}: { sertifikalar: Sertifika[]; setSertifikalar: (s: Sertifika[]) => void }) {
  const update = (i: number, field: keyof Sertifika, val: string) => {
    const next = sertifikalar.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setSertifikalar(next);
  };
  const remove = (i: number) => setSertifikalar(sertifikalar.filter((_, idx) => idx !== i));
  const add = () => setSertifikalar([...sertifikalar, { ad: "", kurum: "" }]);

  return (
    <div className="space-y-4">
      {sertifikalar.map((s, i) => (
        <div key={i} className="relative rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
          {sertifikalar.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          )}
          <Field label="Sertifika Adı">
            <Input placeholder="Sertifika adı" value={s.ad} onChange={(e) => update(i, "ad", e.target.value)} />
          </Field>
          <Field label="Veren Kurum">
            <Input placeholder="Kurum" value={s.kurum} onChange={(e) => update(i, "kurum", e.target.value)} />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-primary transition hover:border-primary hover:bg-muted/30"
      >
        <Plus className="size-4" />
        Yeni Sertifika Ekle
      </button>
    </div>
  );
}

function Step4({ data, set, toggleChip }: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  toggleChip: (field: "hedefKitle" | "uzmanlikAlanlari", val: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <Label>Hedef Kitle <span className="text-muted-foreground font-normal">(Çoklu Seçim)</span></Label>
        <div className="flex flex-wrap gap-2">
          {HEDEF_KITLE.map((k) => (
            <Chip
              key={k} label={k}
              active={data.hedefKitle.includes(k)}
              onClick={() => toggleChip("hedefKitle", k)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>Uzmanlık Alanları <span className="text-muted-foreground font-normal">(Çoklu Seçim)</span></Label>
        <div className="flex flex-wrap gap-2">
          {UZMANLIK_ALANLARI.map((a) => (
            <Chip
              key={a} label={a}
              active={data.uzmanlikAlanlari.includes(a)}
              onClick={() => toggleChip("uzmanlikAlanlari", a)}
            />
          ))}
        </div>
      </div>

      <Field label="Deneyim Süresi">
        <select
          value={data.deneyim}
          onChange={(e) => set("deneyim", e.target.value)}
          className="h-11 w-full max-w-xs rounded-2xl border border-input bg-white px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Seçin</option>
          {DENEYIM_SURESI.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Field>

      <div className="space-y-1.5">
        <Label htmlFor="biyografi">
          Kendinizi Tanıtın (Biyografi) <span className="text-destructive">*</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">min 80, maks 150 kelime</span>
        </Label>
        <textarea
          id="biyografi"
          rows={5}
          placeholder="Danışanlarınıza kendinizi anlatın..."
          value={data.biyografi}
          onChange={(e) => set("biyografi", e.target.value)}
          className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.biyografi.trim() ? data.biyografi.trim().split(/\s+/).length : 0} kelime
        </p>
      </div>
    </div>
  );
}

function Step5({ data, set }: {
  data: FormData;
  set: (k: keyof FormData, v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:bg-muted/30">
        <input
          type="checkbox"
          checked={data.kvkk}
          onChange={(e) => set("kvkk", e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span className="text-sm text-muted-foreground">
          <Link href="/kvkk" className="font-semibold text-primary hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          {"'"}ni okudum ve kabul ediyorum. <span className="text-destructive">*</span>
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:bg-muted/30">
        <input
          type="checkbox"
          checked={data.kosullar}
          onChange={(e) => set("kosullar", e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span className="text-sm text-muted-foreground">
          Platform kullanım koşullarını kabul ediyorum. <span className="text-destructive">*</span>
        </span>
      </label>
    </div>
  );
}

// ─── Ana sayfa ────────────────────────────────────────────────────────────────

export default function ExpertApplicationPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);

  const setField = (k: keyof FormData, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }));

  const setBoolField = (k: keyof FormData, v: boolean) =>
    setData((prev) => ({ ...prev, [k]: v }));

  const setSertifikalar = (s: Sertifika[]) =>
    setData((prev) => ({ ...prev, sertifikalar: s }));

  const toggleChip = (field: "hedefKitle" | "uzmanlikAlanlari", val: string) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? (prev[field] as string[]).filter((v) => v !== val)
        : [...(prev[field] as string[]), val],
    }));

  const isLast = step === STEPS.length;

  return (
    <div className="min-h-screen bg-muted py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Başlık */}
        <h1 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
          Uzman Başvuru Formu
        </h1>

        {/* Step göstergesi */}
        <div className="mb-6 flex overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div
                key={s.id}
                className={[
                  "flex flex-1 flex-col items-center gap-1 py-3 text-center transition",
                  isActive
                    ? "bg-primary text-white"
                    : isDone
                    ? "bg-muted/60 text-muted-foreground"
                    : "text-muted-foreground/50",
                  s.id < STEPS.length ? "border-r border-border" : "",
                ].join(" ")}
              >
                <span className={[
                  "flex size-5 items-center justify-center rounded-full text-xs font-bold",
                  isActive ? "bg-white/20 text-white" : isDone ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                ].join(" ")}>
                  {s.id}
                </span>
                <span className="text-xs font-medium">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Form kartı */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {step === 1 && <Step1 data={data} set={setField} />}
          {step === 2 && <Step2 data={data} set={setField} />}
          {step === 3 && <Step3 sertifikalar={data.sertifikalar} setSertifikalar={setSertifikalar} />}
          {step === 4 && <Step4 data={data} set={setField} toggleChip={toggleChip} />}
          {step === 5 && <Step5 data={data} set={setBoolField} />}
        </div>

        {/* Navigasyon */}
        <div className="mt-4 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Geri
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={() => {
              if (!isLast) setStep((s) => s + 1);
            }}
            type={isLast ? "submit" : "button"}
            className={isLast ? "font-bold" : ""}
          >
            {isLast ? "Başvuruyu Gönder" : step === 4 ? "Özete Git →" : "Devam Et →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
