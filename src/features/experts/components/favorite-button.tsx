"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import { addFavorite, removeFavorite } from "@/lib/services/danisan.service";

type FavoriteButtonProps = {
  expertId: string;
};

export function FavoriteButton({ expertId }: FavoriteButtonProps) {
  const { isAuthenticated, role } = useAuthStore();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || role !== "danisan") return null;

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(expertId);
        setFavorited(false);
        toast.success("Favorilerden çıkarıldı.");
      } else {
        await addFavorite(expertId);
        setFavorited(true);
        toast.success("Favorilere eklendi!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem başarısız.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        favorited
          ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary",
        loading && "opacity-60 cursor-not-allowed",
      )}
    >
      <Heart className={cn("size-4", favorited && "fill-current")} />
      {favorited ? "Favoride" : "Favorile"}
    </button>
  );
}
