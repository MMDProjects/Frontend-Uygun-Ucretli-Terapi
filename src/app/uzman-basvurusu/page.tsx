"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, type UseFormRegister, type FieldErrors, type UseFormSetValue, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { ApiTag } from "@/lib/services/uzman.service";
import { getTags } from "@/lib/services/public.service";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  ad: z.string().min(2, "Ad zorunludur."),
  soyad: z.string().min(2, "Soyad zorunludur."),
  eposta: z.string().email("Geçerli e-posta girin."),
  telefon: z.string().min(10, "Geçerli telefon numarası girin."),
  il: z.string().min(1, "İl zorunludur."),
  ilce: z.string().min(1, "İlçe zorunludur."),
  sifre: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  unvan: z.string().optional(),
  yas: z.string().optional(),
  cinsiyet: z.string().optional(),
  site: z.string().optional(),
  instagram: z.string().optional(),
  lisansUni: z.string().min(2, "Üniversite adı zorunludur."),
  lisansBolum: z.string().min(2, "Bölüm zorunludur."),
  lisansYil: z.string().optional(),
  ylUni: z.string().optional(),
  ylBolum: z.string().optional(),
  ylYil: z.string().optional(),
  sertifikalar: z.array(z.object({ ad: z.string(), kurum: z.string() })),
  tagIds: z.array(z.string()).min(2, "En az 2 etiket seçiniz.").max(5, "En fazla 5 etiket seçilebilir."),
  deneyim: z.string().optional(),
  biyografi: z
    .string()
    .min(1, "Biyografi zorunludur.")
    .refine(
      (v) => v.trim().split(/\s+/).filter(Boolean).length >= 80,
      { message: "Biyografi en az 80 kelime olmalıdır." }
    )
    .refine(
      (v) => v.trim().split(/\s+/).filter(Boolean).length <= 150,
      { message: "Biyografi en fazla 150 kelime olabilir." }
    ),
  kvkk: z.boolean().refine((v) => v, { message: "KVKK onayı zorunludur." }),
  kosullar: z.boolean().refine((v) => v, { message: "Kullanım koşulları onayı zorunludur." }),
  sertifika: z.any().optional(),
  cv: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Sabit veriler ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "İletişim" },
  { id: 2, label: "Eğitim" },
  { id: 3, label: "Sertifika" },
  { id: 4, label: "Uzmanlık" },
  { id: 5, label: "Onay" },
];

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["ad", "soyad", "eposta", "telefon", "il", "ilce", "sifre"],
  2: ["lisansUni", "lisansBolum"],
  3: [],
  4: ["tagIds", "biyografi"],
  5: ["kvkk", "kosullar"],
};

const DENEYIM_SURESI = [
  "1 yıldan az",
  "1–3 yıl",
  "3–5 yıl",
  "5–10 yıl",
  "10 yıldan fazla",
];

// ─── Yardımcı bileşenler ──────────────────────────────────────────────────────

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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

type BaseStepProps = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

function Step1({ register, errors }: BaseStepProps) {
  return (
    <div className="space-y-5">
      <FieldGroup>
        <Field label="Ad" required error={errors.ad?.message}>
          <Input {...register("ad")} />
        </Field>
        <Field label="Soyad" required error={errors.soyad?.message}>
          <Input {...register("soyad")} />
        </Field>
        <Field label="E-posta" required error={errors.eposta?.message}>
          <Input type="email" {...register("eposta")} />
        </Field>
        <Field label="Telefon" required error={errors.telefon?.message}>
          <Input type="tel" placeholder="05XX XXX XX XX" {...register("telefon")} />
        </Field>
        <Field label="İl" required error={errors.il?.message}>
          <Input {...register("il")} />
        </Field>
        <Field label="İlçe" required error={errors.ilce?.message}>
          <Input {...register("ilce")} />
        </Field>
        <Field label="Yaş">
          <Input type="number" min={18} {...register("yas")} />
        </Field>
        <Field label="Cinsiyet">
          <select
            {...register("cinsiyet")}
            className="h-11 w-full rounded-2xl border border-input bg-white px-4 text-base text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seçin</option>
            <option>Kadın</option>
            <option>Erkek</option>
            <option>Belirtmek istemiyorum</option>
          </select>
        </Field>
        <Field label="Şifre" required error={errors.sifre?.message}>
          <Input type="password" placeholder="En az 8 karakter" {...register("sifre")} />
        </Field>
        <Field label="Unvan / Ünvan">
          <Input placeholder="Uzman Klinik Psikolog" {...register("unvan")} />
        </Field>
        <Field label="Kişisel Site">
          <Input placeholder="https://..." {...register("site")} />
        </Field>
        <Field label="Instagram">
          <Input placeholder="@uzmanadi" {...register("instagram")} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function EduBlock({
  title,
  required,
  uniName,
  bolumName,
  yilName,
  register,
  errors,
}: {
  title: string;
  required?: boolean;
  uniName: keyof FormValues;
  bolumName: keyof FormValues;
  yilName: keyof FormValues;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <FieldGroup>
        <Field
          label="Üniversite"
          required={required}
          error={(errors[uniName] as { message?: string })?.message}
        >
          <Input {...register(uniName)} />
        </Field>
        <div className="space-y-4">
          <Field
            label="Bölüm"
            required={required}
            error={(errors[bolumName] as { message?: string })?.message}
          >
            <Input {...register(bolumName)} />
          </Field>
          <Field label="Mezuniyet Yılı">
            <Input type="number" placeholder="2020" {...register(yilName)} />
          </Field>
        </div>
      </FieldGroup>
    </div>
  );
}

function Step2({ register, errors }: BaseStepProps) {
  return (
    <div className="space-y-8">
      <EduBlock
        title="Lisans Eğitimi"
        required
        uniName="lisansUni"
        bolumName="lisansBolum"
        yilName="lisansYil"
        register={register}
        errors={errors}
      />
      <div className="border-t border-border" />
      <EduBlock
        title="Yüksek Lisans (Opsiyonel)"
        uniName="ylUni"
        bolumName="ylBolum"
        yilName="ylYil"
        register={register}
        errors={errors}
      />
    </div>
  );
}

function Step3({ control }: { control: Control<FormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: "sertifikalar" });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="relative rounded-2xl border border-border bg-muted/20 p-4 space-y-3"
        >
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          )}
          <Field label="Sertifika Adı">
            <Input
              placeholder="Sertifika adı"
              defaultValue={field.ad}
              name={`sertifikalar.${i}.ad`}
            />
          </Field>
          <Field label="Veren Kurum">
            <Input
              placeholder="Kurum"
              defaultValue={field.kurum}
              name={`sertifikalar.${i}.kurum`}
            />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ ad: "", kurum: "" })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-primary transition hover:border-primary hover:bg-muted/30"
      >
        <Plus className="size-4" />
        Yeni Sertifika Ekle
      </button>
    </div>
  );
}

function Step4({
  register,
  errors,
  setValue,
  tagIds,
  biyografi,
  allTags,
  tagsError,
}: BaseStepProps & {
  setValue: UseFormSetValue<FormValues>;
  tagIds: string[];
  biyografi: string;
  allTags: ApiTag[];
  tagsError: boolean;
}) {

  const wordCount = biyografi.trim() ? biyografi.trim().split(/\s+/).length : 0;

  function toggleTag(id: string) {
    const next = tagIds.includes(id)
      ? tagIds.filter((t) => t !== id)
      : tagIds.length < 5
      ? [...tagIds, id]
      : tagIds;
    setValue("tagIds", next, { shouldValidate: true });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label>
            Uzmanlık Alanları{" "}
            <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {tagIds.length} / 5 seçildi (min 2)
          </span>
        </div>
        {tagsError ? (
          <p className="text-xs text-destructive">Etiketler yüklenemedi, lütfen sayfayı yenileyin.</p>
        ) : allTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">Etiketler yükleniyor…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                active={tagIds.includes(tag.id)}
                onClick={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        )}
        {errors.tagIds && (
          <p className="text-xs text-destructive">{errors.tagIds.message}</p>
        )}
      </div>

      <Field label="Deneyim Süresi">
        <select
          {...register("deneyim")}
          className="h-11 w-full max-w-xs rounded-2xl border border-input bg-white px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Seçin</option>
          {DENEYIM_SURESI.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="biyografi">
            Kendinizi Tanıtın (Biyografi){" "}
            <span className="text-destructive">*</span>
          </Label>
          <span
            className={[
              "text-xs font-semibold",
              wordCount < 80 || wordCount > 150 ? "text-destructive" : "text-green-600",
            ].join(" ")}
          >
            {wordCount} / 150 kelime
          </span>
        </div>
        <textarea
          id="biyografi"
          rows={5}
          placeholder="Danışanlarınıza kendinizi anlatın..."
          {...register("biyografi")}
          className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
        {errors.biyografi && (
          <p className="text-xs text-destructive">{errors.biyografi.message}</p>
        )}
      </div>
    </div>
  );
}

function Step5({ register, errors }: BaseStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Sertifika (PDF) <span className="text-destructive">*</span></Label>
        <Input type="file" accept=".pdf" {...register("sertifika")} className="h-10 rounded-xl" />
      </div>
      <div className="space-y-1.5">
        <Label>CV / Özgeçmiş (PDF) <span className="text-destructive">*</span></Label>
        <Input type="file" accept=".pdf" {...register("cv")} className="h-10 rounded-xl" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:bg-muted/30">
          <input
            type="checkbox"
            {...register("kvkk")}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            <Link href="/kvkk" className="font-semibold text-primary hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            {"'"}ni okudum ve kabul ediyorum.{" "}
            <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.kvkk && (
          <p className="mt-1 text-xs text-destructive">{errors.kvkk.message}</p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:bg-muted/30">
          <input
            type="checkbox"
            {...register("kosullar")}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            Platform kullanım koşullarını kabul ediyorum.{" "}
            <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.kosullar && (
          <p className="mt-1 text-xs text-destructive">{errors.kosullar.message}</p>
        )}
      </div>
    </div>
  );
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────

export default function ExpertApplicationPage() {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ad: "", soyad: "", eposta: "", telefon: "",
      il: "", ilce: "", sifre: "", unvan: "",
      yas: "", cinsiyet: "",
      site: "", instagram: "",
      lisansUni: "", lisansBolum: "", lisansYil: "",
      ylUni: "", ylBolum: "", ylYil: "",
      sertifikalar: [{ ad: "", kurum: "" }],
      tagIds: [],
      deneyim: "", biyografi: "",
      kvkk: false, kosullar: false,
    },
  });

  const tagIds = watch("tagIds");
  const biyografi = watch("biyografi") ?? "";

  const [allTags, setAllTags] = useState<ApiTag[]>([]);
  const [tagsError, setTagsError] = useState(false);

  useEffect(() => {
    getTags()
      .then((tags) => setAllTags(tags.filter((t) => t.isActive)))
      .catch(() => setTagsError(true));
  }, []);

  const [step, setStep] = useState(1);
  const isLast = step === STEPS.length;

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: FormValues) {
    try {
      const formData = new FormData();

      // Temel alanlar
      formData.append("firstName", data.ad);
      formData.append("lastName", data.soyad);
      formData.append("email", data.eposta);
      formData.append("phone", data.telefon);
      formData.append("password", data.sifre ?? "");
      formData.append("title", data.unvan || "Uzman");
      formData.append("kvkkConsent", "true");
      if (data.biyografi) formData.append("bio", data.biyografi);

      // Eğitim bilgisi
      const educationParts: string[] = [];
      if (data.lisansUni || data.lisansBolum) {
        educationParts.push(
          `Lisans: ${data.lisansUni} - ${data.lisansBolum}${data.lisansYil ? ` (${data.lisansYil})` : ""}`.trim(),
        );
      }
      if (data.ylUni || data.ylBolum) {
        educationParts.push(
          `Yüksek Lisans: ${data.ylUni} - ${data.ylBolum}${data.ylYil ? ` (${data.ylYil})` : ""}`.trim(),
        );
      }
      if (educationParts.length > 0) formData.append("education", educationParts.join("\n"));

      // Kişisel bilgiler
      if (data.il) formData.append("city", data.il);
      if (data.ilce) formData.append("district", data.ilce);
      if (data.yas) formData.append("age", data.yas);
      if (data.cinsiyet) formData.append("gender", data.cinsiyet);
      if (data.site) formData.append("website", data.site);
      if (data.instagram) formData.append("instagram", data.instagram);
      if (data.deneyim) formData.append("experienceDuration", data.deneyim);

      // Sertifika listesi (metin)
      const sertCerts = data.sertifikalar?.filter((s) => s.ad || s.kurum);
      if (sertCerts?.length) {
        formData.append("registrationCertificates", JSON.stringify(sertCerts));
      }

      // Etiketler
      data.tagIds?.forEach((id) => formData.append("tagIds", id));

      // PDF dosyaları
      if (data.sertifika?.[0]) formData.append("certificate", data.sertifika[0]);
      if (data.cv?.[0]) formData.append("cv", data.cv[0]);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${apiUrl}/auth/register/uzman`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : (err.message ?? "Başvuru gönderilemedi."));
      }

      toast.success("Başvurunuz alındı! İnceleme sonucunda e-posta ile bilgilendirileceksiniz.");
      setStep(1); // formu sıfırla
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Başvuru gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="min-h-screen bg-muted py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
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
                <span
                  className={[
                    "flex size-5 items-center justify-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {s.id}
                </span>
                <span className="text-xs font-medium">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Form kartı */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
            {step === 1 && <Step1 register={register} errors={errors} />}
            {step === 2 && <Step2 register={register} errors={errors} />}
            {step === 3 && <Step3 control={control} />}
            {step === 4 && (
              <Step4
                register={register}
                errors={errors}
                setValue={setValue}
                tagIds={tagIds}
                biyografi={biyografi}
                allTags={allTags}
                tagsError={tagsError}
              />
            )}
            {step === 5 && <Step5 register={register} errors={errors} />}
          </div>

          {/* Navigasyon */}
          <div className="mt-4 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                Geri
              </Button>
            ) : (
              <div />
            )}
            {isLast ? (
              <Button type="submit" className="font-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Gönderiliyor…
                  </>
                ) : (
                  "Başvuruyu Gönder"
                )}
              </Button>
            ) : (
              <Button type="button" onClick={goNext}>
                {step === 4 ? "Özete Git →" : "Devam Et →"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
