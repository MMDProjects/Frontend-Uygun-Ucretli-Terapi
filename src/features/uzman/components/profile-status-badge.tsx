import { cn } from "@/lib/utils";
import type { UzmanProfileStatus } from "@/types/domain";

const STATUS_CONFIG: Record<
  UzmanProfileStatus,
  { label: string; className: string; dot: string }
> = {
  taslak: {
    label: "Taslak",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  onay_bekliyor: {
    label: "Onay Bekliyor",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  yayinda: {
    label: "Yayında",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  pasif: {
    label: "Pasif",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

interface ProfileStatusBadgeProps {
  status: UzmanProfileStatus;
  className?: string;
}

export function ProfileStatusBadge({ status, className }: ProfileStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
