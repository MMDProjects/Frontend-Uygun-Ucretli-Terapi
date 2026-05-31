"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, Camera, CheckCircle2, Star, Info } from "lucide-react";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [savingDirect, setSavingDirect] = useState(false);
  const [savingReview, setSavingReview] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

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

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  // Direkt güncelleme: unvan, eğitim, etiketler, avatar
  async function handleSaveDirect() {
    setSavingDirect(true);
    try {
      await updateMyUzmanProfile({
        title,
        education,
        tagIds: selectedTagIds,
        avatar: avatarFile ?? undefined,
      });
      setAvatarFile(null);
      toast.success("Bilgiler kaydedildi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingDirect(false);
    }
  }

  // Admin onayına giden güncelleme: biyografi
  async function handleSaveBio() {
    if (!wordCountValid) return;
    setSavingReview(true);
    try {
      await updateMyUzmanProfile({ bio });
      // Mevcut bio değişmez, pendingBio olarak kaydedildi
      setProfile((p) => p ? { ...p, status: "onay_bekliyor", pendingBio: bio } : p);
      toast.success("Yeni biyografi admin onayına gönderildi. Mevcut profiliniz yayında kalmaya devam eder.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingReview(false);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profilim"
        description="Unvan, eğitim ve fotoğraf değişiklikleri anında kaydedilir. Biyografi değişikliği admin onayına gider."
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
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar önizleme" className="size-full object-cover" />
              ) : profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="avatar" className="size-full object-cover" />
              ) : (
                profile.title?.charAt(0) ?? "?"
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
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
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              >
                {avatarFile ? avatarFile.name : "Dosya Seç"}
              </button>
              {avatarFile && (
                <button
                  type="button"
                  onClick={handleSaveDirect}
                  disabled={savingDirect}
                  className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#014a3e] disabled:opacity-50"
                >
                  {savingDirect ? "Kaydediliyor…" : "Fotoğrafı Kaydet"}
                </button>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
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
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
        {profile.pendingBio ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-100 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Info className="size-3.5 shrink-0 text-amber-700" />
              <span className="text-xs font-semibold text-amber-800">Admin onayında bekleyen biyografi</span>
            </div>
            <p className="text-xs text-amber-700 line-clamp-3">{profile.pendingBio}</p>
            <p className="mt-1.5 text-[10px] text-amber-600">Onaylanana kadar mevcut biyografiniz sitede görünmeye devam eder.</p>
          </div>
        ) : (
          <div className="mb-3 flex items-center gap-2">
            <Info className="size-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700 font-medium">
              Biyografi değişikliği admin onayına gider. Mevcut biyografiniz onaylanana kadar sitede görünmeye devam eder.
            </p>
          </div>
        )}
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
          className="rounded-xl resize-none bg-white"
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
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveBio}
            disabled={savingReview || !wordCountValid}
            className="border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            {savingReview ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                Gönderiliyor…
              </>
            ) : (
              "Biyografi Onaya Gönder"
            )}
          </Button>
        </div>
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
          <Button
            size="sm"
            onClick={handleSaveDirect}
            disabled={savingDirect || (selectedTagIds.length > 0 && !keywordsValid)}
          >
            {savingDirect ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Kaydediliyor…
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1.5 size-4" />
                Bilgileri Kaydet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
