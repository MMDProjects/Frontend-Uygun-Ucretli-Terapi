"use client";

import { useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileStatusBadge } from "@/features/uzman/components/profile-status-badge";
import { MOCK_UZMAN_PROFILE, ADMIN_KEYWORD_LIST } from "@/features/uzman/data/mock-uzman";
import { cn } from "@/lib/utils";

const MAX_KEYWORDS = 5;
const MIN_KEYWORDS = 2;
const MIN_WORDS = 80;
const MAX_WORDS = 150;

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export default function UzmanProfilPage() {
  const profile = MOCK_UZMAN_PROFILE;

  const [bio, setBio] = useState(profile.bio);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(profile.keywords);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const wordCount = countWords(bio);
  const wordCountValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;
  const keywordsValid =
    selectedKeywords.length >= MIN_KEYWORDS && selectedKeywords.length <= MAX_KEYWORDS;

  function toggleKeyword(kw: string) {
    setSelectedKeywords((prev) =>
      prev.includes(kw)
        ? prev.filter((k) => k !== kw)
        : prev.length < MAX_KEYWORDS
        ? [...prev, kw]
        : prev
    );
  }

  async function handleSaveDraft() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    alert("Profiliniz onay için gönderildi.");
  }

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/60 bg-white p-5">
        <div>
          <p className="text-sm font-semibold text-foreground">Profil Durumu</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Her güncelleme sonrası profil onaya gönderilmelidir.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProfileStatusBadge status={profile.status} />
          {(profile.status === "taslak" || profile.status === "pasif") && (
            <Button size="sm" onClick={handleSubmit} disabled={submitting || !wordCountValid || !keywordsValid}>
              {submitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Gönderiliyor…
                </>
              ) : (
                "Admine Gönder"
              )}
            </Button>
          )}
        </div>
      </div>

      {profile.adminNote && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">Admin Notu</p>
            <p className="mt-0.5 text-sm text-red-700">{profile.adminNote}</p>
          </div>
        </div>
      )}

      {/* Photo */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">Profil Fotoğrafı</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              AK
            </div>
            <button
              type="button"
              className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition hover:bg-primary-hover"
              aria-label="Fotoğraf değiştir"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Fotoğraf Yükle</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Minimum 400×400px, kurumsal fotoğraf. JPG veya PNG.
            </p>
            <button
              type="button"
              className="mt-2 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Dosya Seç
            </button>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">Temel Bilgiler</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ad Soyad <span className="text-destructive">*</span>
            </Label>
            <Input
              defaultValue={profile.name}
              className="h-10 rounded-xl"
              readOnly
            />
            <p className="text-[10px] text-muted-foreground">Ad-soyad admin tarafından onaylanmıştır.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Unvan <span className="text-destructive">*</span>
            </Label>
            <Input defaultValue={profile.title} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Telefon <span className="text-destructive">*</span>
            </Label>
            <Input
              type="tel"
              defaultValue={profile.phone}
              className="h-10 rounded-xl"
            />
            <p className="text-[10px] text-muted-foreground">Danışanlara gösterilmez; yalnızca admin görür.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Yıldız Puanı</Label>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {profile.rating} / 5
              </span>
              <span className="text-xs text-muted-foreground">(28 değerlendirme)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Tanıtım Yazısı <span className="text-destructive">*</span>
          </h3>
          <span
            className={cn(
              "text-xs font-semibold",
              wordCount < MIN_WORDS
                ? "text-destructive"
                : wordCount > MAX_WORDS
                ? "text-destructive"
                : "text-green-600"
            )}
          >
            {wordCount} / {MAX_WORDS} kelime
          </span>
        </div>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="rounded-xl resize-none"
          placeholder="Kendinizi danışanlarınıza tanıtın…"
        />
        {wordCount < MIN_WORDS && (
          <p className="mt-1.5 text-xs text-destructive">
            En az {MIN_WORDS} kelime gereklidir. ({MIN_WORDS - wordCount} kelime daha)
          </p>
        )}
        {wordCount > MAX_WORDS && (
          <p className="mt-1.5 text-xs text-destructive">
            En fazla {MAX_WORDS} kelime olabilir. ({wordCount - MAX_WORDS} kelime fazla)
          </p>
        )}
      </div>

      {/* Keywords */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Uzmanlık Alanları <span className="text-destructive">*</span>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Min {MIN_KEYWORDS}, maks {MAX_KEYWORDS} alan seçin.
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold",
              !keywordsValid ? "text-destructive" : "text-green-600"
            )}
          >
            {selectedKeywords.length} / {MAX_KEYWORDS}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ADMIN_KEYWORD_LIST.map((kw) => {
            const selected = selectedKeywords.includes(kw);
            const disabled = !selected && selectedKeywords.length >= MAX_KEYWORDS;
            return (
              <button
                key={kw}
                type="button"
                onClick={() => toggleKeyword(kw)}
                disabled={disabled}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  selected
                    ? "border-primary bg-primary text-white"
                    : disabled
                    ? "cursor-not-allowed border-border/40 bg-muted/30 text-muted-foreground/50"
                    : "border-border/60 bg-white text-muted-foreground hover:border-primary/40 hover:text-primary"
                )}
              >
                {kw}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> zorunlu alan
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="size-4" />
              Kaydedildi
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving}>
            {saving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Kaydediliyor…
              </>
            ) : (
              "Taslak Kaydet"
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || !wordCountValid || !keywordsValid}
          >
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Gönderiliyor…
              </>
            ) : (
              "Admine Gönder"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
