import { ClipboardCopy } from "lucide-react";
import type { DraftTool, InboxMessage } from "@/services/inbox/types";
import { handoffReasonLabel } from "./constants";

function argText(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function toolLine(tool: DraftTool): string {
  if (tool.name === "lead_tool") {
    const parts = [
      argText(tool.args, "ad_soyad"),
      argText(tool.args, "hizmet"),
      argText(tool.args, "arama_saati"),
    ].filter(Boolean);
    return `Arama talebi açardı: ${parts.join(" · ")}`;
  }
  if (tool.name === "personel_aktar_tool") {
    const reason = argText(tool.args, "sebep");
    const summary = argText(tool.args, "ozet");
    const label = reason ? handoffReasonLabel(reason) : "";
    return `Personele devrederdi: ${[label, summary].filter(Boolean).join(" — ")}`;
  }
  return tool.name;
}

interface DraftBubbleProps {
  message: InboxMessage;
  onCopy?: (text: string) => void;
}

export function DraftBubble({ message, onCopy }: DraftBubbleProps) {
  const standby = message.draftMeta?.mode === "STANDBY";
  const tools = message.draftMeta?.tools ?? [];
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="px-1 text-[11px] font-medium italic text-sky-800">
        {standby
          ? "Elif'in taslağı — eski bot aktif, gönderilmedi"
          : "Elif'in taslağı — gönderilmedi"}
      </span>
      <div className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm border border-dashed border-sky-300 bg-sky-50/60 px-3.5 py-2 text-sm text-sky-900/80">
        {message.content}
      </div>
      {tools.length > 0 ? (
        <ul className="space-y-0.5 px-1 text-right text-[11px] text-muted-foreground">
          {tools.map((tool, i) => (
            <li key={`${tool.name}-${i}`}>{toolLine(tool)}</li>
          ))}
        </ul>
      ) : null}
      {onCopy ? (
        <button
          type="button"
          onClick={() => onCopy(message.content)}
          aria-label="Taslağı yazma kutusuna kopyala"
          className="inline-flex items-center gap-1 px-1 text-[11px] font-medium text-primary hover:underline"
        >
          <ClipboardCopy className="size-3" />
          Yazma kutusuna kopyala
        </button>
      ) : null}
    </div>
  );
}
