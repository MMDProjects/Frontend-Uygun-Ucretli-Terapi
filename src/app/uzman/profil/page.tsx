"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Camera, CheckCircle2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/features/admin/components/page-header";
import { ProfileStatusBadge } from "@/features/uzman/components/profile-status-badge";
import {
  getMyUzmanProfile,
  updateMyUzmanProfile,
  getActiveTags,
  type ApiUzmanProfile,
  type ApiTag,
} from "@/lib/services/uzman.service";
import { cn } from "@/lib/utils";

const MAX_KEYWORDS = 5;
const MIN_KEYWORDS = 2;
const MIN_WORDS = 80;
const MAX_WORDS = 150;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function UzmanProfilPage() {
  const [profile, setProfile] = useState<ApiUzmanProfile | null>(null);
  const [allTags, setAllTags] = useState<ApiTag[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getMyUzmanProfile(), getActiveTags()])
      .then(([p, tags]) => {
        setProfile(p);
        setAllTags(tags);
        setTitle(p.title ?? "");
        setBio(p.bio ?? "");
        setEducation(p.education ?? "");
        setSelectedTagIds(p.tags.map((t) => t.id));
      })
      .catch(() => toast.error("Profil yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  const wordCount = countWords(bio);
  const wordCountValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;
  const keywordsValid =
    selectedTagIds.length >= MIN_KEYWORDS && selectedTagIds.length <= MAX_KEYWORDS;

  function toggleTag(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id)
        ? prev.filter((k) => k !== id)
        : prev.length < MAX_KEYWORDS
        ? [...prev, id]
        : prev
    );
  }

  async function handleSave() {
    if (!wordCountValid || !keywordsValid) return;
    setSaving(true);
    try {
      await updateMyUzmanProfile({ title, bio, education, tagIds: selectedTagIds });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (profile) {
        setProfile((p) => p ? { ...p, status: "onay_bekliyor" } : p);
      }
      toast.success("Profil güncellendi, admin onayı bekleniyor.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 skeleton rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const name = `${profile.userId}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profilim"
        description="Her güncelleme sonrası profil onaya gönderilmelidir."
      >
        <ProfileStatusBadge status={profile.status} />
      </PageHeader>

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
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="avatar" className="size-full object-cover" />
              ) : (
                profile.title?.charAt(0) ?? "?"
              )}
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
              Unvan <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 rounded-xl"
              placeholder="Klinik Psikolog"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Yıldız Puanı</Label>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {profile.rating.toFixed(1)} / 5
              </span>
            </div>
          </div>
          {profile.phone && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Telefon</Label>
              <Input
                type="tel"
                defaultValue={profile.phone}
                className="h-10 rounded-xl"
                readOnly
              />
              <p className="text-[10px] text-muted-foreground">Danışanlara gösterilmez; yalnızca admin görür.</p>
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">Eğitim</h3>
        <Textarea
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
          placeholder="Üniversite, bölüm, yıl…"
        />
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
              wordCount < MIN_WORDS || wordCount > MAX_WORDS
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

      {/* Tags */}
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
            {selectedTagIds.length} / {MAX_KEYWORDS}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const selected = selectedTagIds.includes(tag.id);
            const disabled = !selected && selectedTagIds.length >= MAX_KEYWORDS;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
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
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
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
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !wordCountValid || !keywordsValid}
          >
            {saving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Kaydediliyor…
              </>
            ) : (
              "Kaydet & Onaya Gönder"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
