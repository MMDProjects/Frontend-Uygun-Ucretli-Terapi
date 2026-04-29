"use client";

import { useState } from "react";
import { PenSquare, Plus, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { MOCK_BLOG_POSTS } from "@/features/uzman/data/mock-uzman";
import type { UzmanBlogPost, UzmanBlogStatus } from "@/types/domain";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<
  UzmanBlogStatus,
  { label: string; className: string }
> = {
  taslak: {
    label: "Taslak",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  incelemede: {
    label: "İncelemede",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  yayinda: {
    label: "Yayında",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  reddedildi: {
    label: "Reddedildi",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  revize_gonderildi: {
    label: "Revize Gönderildi",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const STATUS_TABS: { label: string; value: UzmanBlogStatus | "Tümü" }[] = [
  { label: "Tümü", value: "Tümü" },
  { label: "Taslak", value: "taslak" },
  { label: "İncelemede", value: "incelemede" },
  { label: "Yayında", value: "yayinda" },
  { label: "Reddedildi", value: "reddedildi" },
];

function BlogPostRow({ post, onDelete }: { post: UzmanBlogPost; onDelete: (id: string) => void }) {
  const config = STATUS_CONFIG[post.status];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  config.className
                )}
              >
                {config.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {post.updatedAt}
              </span>
            </div>
            <h4 className="text-sm font-bold text-foreground">{post.title}</h4>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {post.status === "yayinda" && (
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                aria-label="Görüntüle"
              >
                <Eye className="size-3.5" />
              </button>
            )}
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              aria-label="Düzenle"
            >
              <Edit className="size-3.5" />
            </button>
            {post.status !== "yayinda" && (
              <button
                type="button"
                onClick={() => onDelete(post.id)}
                className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                aria-label="Sil"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {post.adminNote && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-red-600" />
            <div>
              <p className="text-[11px] font-semibold text-red-800">Admin Notu:</p>
              <p className="text-[11px] text-red-700">{post.adminNote}</p>
            </div>
          </div>
        )}

        {post.status === "reddedildi" && (
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              Düzelt ve Tekrar Gönder
            </button>
          </div>
        )}
        {(post.status === "taslak") && (
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              className="rounded-xl border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              İncelemeye Gönder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UzmanBlogPage() {
  const [posts, setPosts] = useState<UzmanBlogPost[]>(MOCK_BLOG_POSTS);
  const [activeTab, setActiveTab] = useState<UzmanBlogStatus | "Tümü">("Tümü");

  const filtered =
    activeTab === "Tümü" ? posts : posts.filter((p) => p.status === activeTab);

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
                activeTab === value
                  ? "border-primary bg-primary text-white"
                  : "border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Button size="sm">
          <Plus className="size-4" />
          Yeni Yazı
        </Button>
      </div>

      {/* Blog list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-16 text-center">
          <PenSquare className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">
            Bu kategoride blog yazısı yok
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Yeni bir yazı ekleyerek başlayın.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <BlogPostRow key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
