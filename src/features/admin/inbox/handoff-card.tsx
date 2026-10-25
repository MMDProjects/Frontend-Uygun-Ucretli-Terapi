import { ShieldAlert, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationDetail } from "@/services/inbox/types";
import { handoffReasonLabel } from "./constants";
import { formatDateTime } from "./labels";

export function HandoffCard({ detail }: { detail: ConversationDetail }) {
  if (!detail.handoffReason) return null;
  const crisis = detail.handoffReason === "acil_durum";
  const Icon = crisis ? ShieldAlert : UserRound;
  return (
    <div
      className={cn(
        "flex items-start gap-2 border-b px-4 py-2 text-xs sm:text-sm",
        crisis
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-sky-200 bg-sky-50 text-sky-950",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          Elif devretti: {handoffReasonLabel(detail.handoffReason)}
          {detail.handedOffAt ? (
            <span className="ml-2 font-normal opacity-70">
              {formatDateTime(detail.handedOffAt)}
            </span>
          ) : null}
        </p>
        {detail.handoffSummary ? (
          <p className="mt-0.5 whitespace-pre-wrap break-words">{detail.handoffSummary}</p>
        ) : null}
      </div>
    </div>
  );
}
