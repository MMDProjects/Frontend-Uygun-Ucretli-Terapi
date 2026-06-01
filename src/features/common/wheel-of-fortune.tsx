"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, PartyPopper } from "lucide-react";
import { siteConfig } from "@/lib/constants/site";

const SEGMENT_COLORS = ["#016a59", "#014a3e", "#4d978b", "#01352d", "#016a59", "#99c3bd", "#4d978b", "#014a3e"];

type Segment = { label: string; description: string; color: string };

const DEFAULT_SEGMENTS: Segment[] = [
  { label: "Ön Görüş.", description: "Ücretsiz ön görüşme hakkı — 20 dk WhatsApp görüşmesi", color: "#016a59" },
  { label: "%10 İnd.",  description: "İlk seansta %10 indirim fırsatı",                      color: "#014a3e" },
  { label: "Tekrar!",   description: "Bu sefer olmadı — bir daha dene!",                      color: "#4d978b" },
  { label: "Bedava!",   description: "Ücretsiz ilk seans hakkı kazandın",                     color: "#01352d" },
  { label: "%20 İnd.",  description: "İlk seansta %20 indirim fırsatı",                      color: "#016a59" },
  { label: "Sürpriz!",  description: "Özel sürpriz ödül — WhatsApp'tan talep et",            color: "#99c3bd" },
];

function WheelSVG({ segments }: { segments: Segment[] }) {
  const cx = 150, cy = 150, r = 140;
  const total = segments.length;
  const angle = 360 / total;

  const computed = segments.map((seg, i) => {
    const startAngle = ((i * angle - 90) * Math.PI) / 180;
    const endAngle   = (((i + 1) * angle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle   = (((i + 0.5) * angle - 90) * Math.PI) / 180;
    const tx = cx + r * 0.67 * Math.cos(midAngle);
    const ty = cy + r * 0.67 * Math.sin(midAngle);
    const d  = [`M ${cx} ${cy}`, `L ${x1} ${y1}`, `A ${r} ${r} 0 0 1 ${x2} ${y2}`, "Z"].join(" ");
    return { ...seg, d, tx, ty, textRotation: (i + 0.5) * angle };
  });

  return (
    <svg viewBox="0 0 300 300" className="size-full">
      {computed.map((seg, i) => (
        <g key={i}>
          <path d={seg.d} fill={seg.color} stroke="white" strokeWidth="2" />
          <text
            x={seg.tx} y={seg.ty}
            textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize="13" fontWeight="500"
            fontFamily="system-ui, sans-serif"
            transform={`rotate(${seg.textRotation}, ${seg.tx}, ${seg.ty})`}
          >
            {seg.label}
          </text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="20" fill="white" stroke="#016a59" strokeWidth="3" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16">🎰</text>
    </svg>
  );
}

export function WheelOfFortune({ onClose }: { onClose: () => void }) {
  const [segments, setSegments]               = useState<Segment[]>(DEFAULT_SEGMENTS);
  const [spinning, setSpinning]               = useState(false);
  const [result, setResult]                   = useState<Segment | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.wheelSegments) && data.wheelSegments.length >= 2) {
          setSegments(
            data.wheelSegments.map((s: { label: string; description: string }, i: number) => ({
              label: s.label,
              description: s.description,
              color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  function spin() {
    if (spinning || result) return;
    setSpinning(true);
    const total = segments.length;
    const angle = 360 / total;
    const winIndex   = Math.floor(Math.random() * total);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const target     = currentRotation + extraSpins * 360 + (360 - winIndex * angle - angle / 2);

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
      wheelRef.current.style.transform  = `rotate(${target}deg)`;
    }
    setTimeout(() => {
      setCurrentRotation(target % 360);
      setResult(segments[winIndex]);
      setSpinning(false);
    }, 3600);
  }

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Çarkıfelek"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div>
            <p className="font-bold text-primary-hover">🎰 Çarkı Çevir!</p>
            <p className="text-xs text-muted-foreground">Özel teklifini kazan</p>
          </div>
          <button
            type="button" onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
            aria-label="Kapat"
          >
            <X className="size-4" />
          </button>
        </div>

        {!result ? (
          <div className="flex flex-col items-center gap-4 px-5 py-5">
            {/* Pointer + Wheel */}
            <div className="relative">
              <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
                <div className="size-0 border-x-[10px] border-b-[20px] border-x-transparent border-b-destructive" />
              </div>
              <div
                ref={wheelRef}
                className="size-72"
                style={{ transform: `rotate(${currentRotation}deg)` }}
              >
                <WheelSVG segments={segments} />
              </div>
            </div>

            <button
              type="button" onClick={spin} disabled={spinning}
              className="h-11 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {spinning ? "Dönüyor…" : "Çevir!"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <PartyPopper className="size-12 text-warning" aria-hidden />
            <div>
              <p className="text-lg font-bold text-primary-hover">Tebrikler! 🎉</p>
              <p className="mt-1 text-base font-semibold text-primary">{result.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ödülünüzü almak için WhatsApp üzerinden bizimle iletişime geçin.
            </p>
            <Link
              href={siteConfig.whatsappHref} target="_blank" rel="noreferrer"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
            >
              WhatsApp ile Talep Et
            </Link>
            <button
              type="button" onClick={onClose}
              className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              Daha sonra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
