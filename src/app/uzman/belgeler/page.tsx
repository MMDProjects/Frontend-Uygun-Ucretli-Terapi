"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/admin/components/page-header";
import { getMyUzmanProfile, updateMyUzmanProfile } from "@/lib/services/uzman.service";
import { cn } from "@/lib/utils";

function DropZone({
  label,
  hint,
  onFile,
  required,
  currentFileName,
}: {
  label: string;
  hint: string;
  onFile: (file: File) => void;
  required?: boolean;
  currentFileName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Sadece PDF dosyası yükleyebilirsiniz.");
      return;
    }
    onFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Sadece PDF dosyası yükleyebilirsiniz.");
      return;
    }
    onFile(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border/60 hover:border-primary/40 hover:bg-muted/20"
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50">
        <Upload className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      {currentFileName ? (
        <span className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
          {currentFileName} seçildi
        </span>
      ) : (
        <span className="rounded-xl border border-border/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
          Dosya Seç
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}

function CurrentFileRow({
  label,
  url,
  isPending,
}: {
  label: string;
  url: string;
  isPending?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between rounded-xl border px-4 py-3",
      isPending ? "border-amber-200 bg-amber-50" : "border-[#016a59]/20 bg-[#e6f0ee]/50"
    )}>
      <div className="flex items-center gap-2">
        <FileText className={cn("size-4", isPending ? "text-amber-600" : "text-[#016a59]")} />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {isPending && (
            <p className="text-xs text-amber-700">Admin onayı bekleniyor</p>
          )}
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 text-xs font-semibold text-[#016a59] hover:underline"
      >
        Görüntüle
        <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

export default function UzmanBelgelerPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [pendingCvUrl, setPendingCvUrl] = useState<string | null>(null);
  const [pendingCertUrl, setPendingCertUrl] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    getMyUzmanProfile()
      .then((p) => {
        setCvUrl(p.cvUrl);
        setCertUrl(p.certificateUrl);
        setPendingCvUrl(p.pendingCvUrl);
        setPendingCertUrl(p.pendingCertificateUrl);
      })
      .catch(() => toast.error("Profil yüklenemedi."))
      .finally(() => setProfileLoading(false));
  }, []);

  const hasSelection = cvFile !== null || certFile !== null;

  async function handleUpload() {
    if (!hasSelection) return;
    setUploading(true);
    try {
      await updateMyUzmanProfile({
        cv: cvFile ?? undefined,
        certificate: certFile ?? undefined,
      });
      toast.success("Belgeler admin onayına gönderildi. Onaylanana kadar profiliniz yayından kaldırılmıştır.");
      if (cvFile) setPendingCvUrl("pending");
      if (certFile) setPendingCertUrl("pending");
      setCvFile(null);
      setCertFile(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Belgelerim"
        description="CV ve sertifikalarınızı yükleyin. Danışanlar tarafından görülebilir."
      />

      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Belge güncellemesi admin onayı gerektirir</p>
          <p className="mt-0.5 text-xs text-amber-700">
            Yeni belge yüklediğinizde profiliniz admin onayına gönderilir. Onaylanana kadar profiliniz yayından kaldırılır.
          </p>
        </div>
      </div>

      {/* CV */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              CV / Özgeçmiş <span className="text-destructive">*</span>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Zorunlu belge. Danışanlar tarafından görülebilir.
            </p>
          </div>
          {cvFile ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="size-4" />
              Seçildi
            </span>
          ) : !profileLoading && !cvUrl && !pendingCvUrl ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <AlertCircle className="size-4" />
              Yüklenmemiş
            </span>
          ) : null}
        </div>

        {profileLoading ? (
          <div className="h-10 animate-pulse rounded-xl bg-muted/40" />
        ) : (
          <>
            {cvUrl && <CurrentFileRow label="Mevcut CV" url={cvUrl} />}
            {pendingCvUrl && pendingCvUrl !== "pending" && (
              <CurrentFileRow label="Onay Bekleyen CV" url={pendingCvUrl} isPending />
            )}
            {pendingCvUrl === "pending" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Yeni CV yüklendi, admin onayı bekleniyor.
              </div>
            )}
          </>
        )}

        <DropZone
          label="CV Yükle / Güncelle"
          hint="Yalnızca PDF · Maksimum 10 MB"
          onFile={setCvFile}
          required
          currentFileName={cvFile?.name}
        />
      </div>

      {/* Sertifika */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Sertifika</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Eğitim ve yetkinlik belgelerinizi ekleyin. Danışanlar tarafından görülebilir.
            </p>
          </div>
          {certFile && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="size-4" />
              Seçildi
            </span>
          )}
        </div>

        {profileLoading ? (
          <div className="h-10 animate-pulse rounded-xl bg-muted/40" />
        ) : (
          <>
            {certUrl && <CurrentFileRow label="Mevcut Sertifika" url={certUrl} />}
            {pendingCertUrl && pendingCertUrl !== "pending" && (
              <CurrentFileRow label="Onay Bekleyen Sertifika" url={pendingCertUrl} isPending />
            )}
            {pendingCertUrl === "pending" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Yeni sertifika yüklendi, admin onayı bekleniyor.
              </div>
            )}
          </>
        )}

        <DropZone
          label="Sertifika Yükle / Güncelle"
          hint="PDF · Diplomalar, kurs sertifikaları, akreditasyon belgeleri"
          onFile={setCertFile}
          currentFileName={certFile?.name}
        />
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleUpload}
          disabled={uploading || !hasSelection}
        >
          {uploading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Yükleniyor…
            </>
          ) : (
            <>
              <Upload className="mr-1.5 size-4" />
              Belgeleri Yükle & Onaya Gönder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
