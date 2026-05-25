"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

type UploadedFile = {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
  type: "cv" | "sertifika";
};

const MOCK_FILES: UploadedFile[] = [
  {
    id: "file-001",
    name: "ozgecmis_ayse_kaya.pdf",
    sizeLabel: "1.2 MB",
    uploadedAt: "15 Mart 2026",
    type: "cv",
  },
  {
    id: "file-002",
    name: "psikoloji_lisans_diplomasi.pdf",
    sizeLabel: "845 KB",
    uploadedAt: "15 Mart 2026",
    type: "sertifika",
  },
  {
    id: "file-003",
    name: "cbt_sertifikasi_2022.pdf",
    sizeLabel: "623 KB",
    uploadedAt: "15 Mart 2026",
    type: "sertifika",
  },
];

function FileRow({
  file,
  onDelete,
}: {
  file: UploadedFile;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-white p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
        <FileText className="size-5 text-red-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {file.sizeLabel} · {file.uploadedAt}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          aria-label="İndir"
        >
          <Download className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(file.id)}
          className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
          aria-label="Sil"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function DropZone({
  label,
  hint,
  onFile,
  required,
}: {
  label: string;
  hint: string;
  onFile: (file: File) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") onFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border/60 hover:border-primary/40 hover:bg-muted/20"
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/50">
        <Upload className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <span className="rounded-xl border border-border/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
        Dosya Seç
      </span>
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

export default function UzmanBelgelerPage() {
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const cvFile = files.find((f) => f.type === "cv");
  const sertifikalar = files.filter((f) => f.type === "sertifika");

  function handleDelete(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleFileUpload(type: "cv" | "sertifika") {
    return (file: File) => {
      const newFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        sizeLabel: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        type,
      };
      if (type === "cv") {
        setFiles((prev) => prev.filter((f) => f.type !== "cv").concat(newFile));
      } else {
        setFiles((prev) => [...prev, newFile]);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    };
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Belgelerim"
        description="CV ve sertifikalarınızı yükleyin. Danışanlar tarafından görülebilir."
      />

      {uploadSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="size-4 shrink-0 text-green-600" />
          <p className="text-sm font-semibold text-green-800">
            Dosya başarıyla yüklendi.
          </p>
        </div>
      )}

      {/* CV */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
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
              Yüklendi
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <AlertCircle className="size-4" />
              Yüklenmedi
            </span>
          )}
        </div>

        {cvFile ? (
          <FileRow file={cvFile} onDelete={handleDelete} />
        ) : (
          <DropZone
            label="CV Yükle"
            hint="Yalnızca PDF · Maksimum 10 MB"
            onFile={handleFileUpload("cv")}
            required
          />
        )}

        {cvFile && (
          <div className="mt-3">
            <DropZone
              label="CV Güncelle"
              hint="Yeni PDF yükleyerek mevcut CV'yi değiştirin"
              onFile={handleFileUpload("cv")}
            />
          </div>
        )}
      </div>

      {/* Sertifikalar */}
      <div className="rounded-2xl border border-border/60 bg-white p-5">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Sertifikalar</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Eğitim ve yetkinlik belgelerinizi ekleyin. Danışanlar tarafından görülebilir.
          </p>
        </div>

        {sertifikalar.length > 0 && (
          <div className="mb-4 space-y-2">
            {sertifikalar.map((f) => (
              <FileRow key={f.id} file={f} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <DropZone
          label="Sertifika Ekle"
          hint="PDF · Diplomalar, kurs sertifikaları, akreditasyon belgeleri"
          onFile={handleFileUpload("sertifika")}
        />
      </div>
    </div>
  );
}
