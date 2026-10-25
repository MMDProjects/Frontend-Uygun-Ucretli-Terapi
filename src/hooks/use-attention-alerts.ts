"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InboxCounts } from "@/services/inbox/types";

const SOUND_KEY = "asistan.sesAcik";
const TITLE_PREFIX = /^\(\d+\) /;

function readSoundPref(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "0";
  } catch {
    return true;
  }
}

function beep(durations: number[], freqs: number[]): void {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    let t = ctx.currentTime;
    durations.forEach((d, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + d);
      t += d + 0.05;
    });
    window.setTimeout(() => void ctx.close(), (t - ctx.currentTime) * 1000 + 200);
  } catch {
    // Ses çalınamazsa sessizce geç.
  }
}

function notify(crisis: boolean): void {
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") {
      return;
    }
    const n = new Notification(
      crisis ? "KRİZ: yeni kriz konuşması" : "Yeni bekleyen konuşma",
      { tag: crisis ? "asistan-kriz" : "asistan-bekleyen" },
    );
    n.onclick = () => {
      window.focus();
      window.location.assign("/admin/mesajlar");
      n.close();
    };
  } catch {
    // Bildirim oluşturulamazsa sessizce geç.
  }
}

export interface AttentionAlertControls {
  soundOn: boolean;
  toggleSound: () => void;
  permission: NotificationPermission | "unsupported";
  requestPermission: () => void;
}

export function useAttentionAlerts(counts: InboxCounts | null): AttentionAlertControls {
  const [soundOn, setSoundOn] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "unsupported",
  );
  const prev = useRef<{ attention: number; crisis: number } | null>(null);
  const soundRef = useRef(true);

  useEffect(() => {
    const pref = readSoundPref();
    soundRef.current = pref;
    // Tarayıcı değerleri yalnız istemcide okunabilir (hidrasyon uyumu için efektte).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoundOn(pref);
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  const attention = counts ? (counts.attention ?? counts.pendingAgent + counts.crisis) : null;
  const crisis = counts ? counts.crisis : null;

  useEffect(() => {
    if (attention === null || crisis === null) return;
    const last = prev.current;
    prev.current = { attention, crisis };
    if (!last) return;
    const crisisUp = crisis > last.crisis;
    const attentionUp = attention > last.attention;
    if (!crisisUp && !attentionUp) return;
    if (soundRef.current) {
      if (crisisUp) beep([0.25, 0.25, 0.4], [880, 660, 880]);
      else beep([0.12, 0.12], [660, 880]);
    }
    notify(crisisUp);
  }, [attention, crisis]);

  useEffect(() => {
    const base = document.title.replace(TITLE_PREFIX, "");
    document.title = attention && attention > 0 ? `(${attention}) ${base}` : base;
  }, [attention]);

  useEffect(
    () => () => {
      document.title = document.title.replace(TITLE_PREFIX, "");
    },
    [],
  );

  const toggleSound = useCallback(() => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    } catch {
      // localStorage yoksa tercih yalnız oturum boyunca geçerli.
    }
  }, []);

  const requestPermission = useCallback(() => {
    if (typeof Notification === "undefined") return;
    void Notification.requestPermission().then(setPermission);
  }, []);

  return { soundOn, toggleSound, permission, requestPermission };
}
