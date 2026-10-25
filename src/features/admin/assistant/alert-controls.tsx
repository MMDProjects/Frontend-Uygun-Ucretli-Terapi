"use client";

import { Bell, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSharedAttentionAlerts } from "./inbox-counts-context";

export function AlertControls() {
  const alerts = useSharedAttentionAlerts();
  if (!alerts) return null;
  return (
    <div className="flex items-center gap-1">
      {alerts.permission === "default" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={alerts.requestPermission}
          aria-label="Masaüstü bildirimlerini aç"
        >
          <Bell className="size-4" aria-hidden="true" />
          Bildirimleri aç
        </Button>
      ) : null}
      {alerts.permission === "granted" ? (
        <span className="text-xs text-muted-foreground">Bildirimler açık</span>
      ) : null}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={alerts.toggleSound}
        aria-label={alerts.soundOn ? "Uyarı sesini kapat" : "Uyarı sesini aç"}
        aria-pressed={alerts.soundOn}
      >
        {alerts.soundOn ? (
          <Volume2 className="size-4" aria-hidden="true" />
        ) : (
          <VolumeX className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
