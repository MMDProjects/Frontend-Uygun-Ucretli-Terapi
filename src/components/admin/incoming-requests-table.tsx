"use client";

import { AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  INCOMING_STATUS_LABELS,
  INCOMING_STATUS_ORDER,
} from "@/lib/incoming-request-meta";
import type { IncomingRequest, IncomingRequestStatus } from "@/types/dto/incoming-request";

function formatTableDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd.MM.yyyy HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

function truncateMessage(text: string, max = 56): string {
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

const STATUS_STYLE: Record<IncomingRequestStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-800",
  in_progress: "border-blue-200 bg-blue-50 text-blue-800",
  resolved: "border-green-200 bg-green-50 text-green-800",
};

interface IncomingRequestsTableProps {
  requests: IncomingRequest[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenMessage: (request: IncomingRequest) => void;
  onStatusChange: (id: string, status: IncomingRequestStatus) => void;
  isCorporate?: boolean;
}

export function IncomingRequestsTable({
  requests,
  loading,
  error,
  onRefresh,
  onOpenMessage,
  onStatusChange,
  isCorporate,
}: IncomingRequestsTableProps) {
  return (
    <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
      <CardHeader>
        <CardTitle>Talep listesi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
            <AlertTriangle className="size-8" />
            <p className="text-sm">{error}</p>
            <Button type="button" variant="outline" onClick={() => void onRefresh()}>
              Tekrar dene
            </Button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Kriterlere uygun talep bulunamadı.
          </p>
        )}

        {!loading && !error && requests.length > 0 && (
          <>
            {/* Mobil kartlar */}
            <div className="grid gap-4 md:hidden">
              {requests.map((req) => (
                <Card key={req.id} className="p-4 shadow-sm rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{req.fullName}</p>
                        <p className="text-sm text-muted-foreground">{req.email}</p>
                        {req.phone && (
                          <p className="text-sm text-muted-foreground">{req.phone}</p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={req.kvkkAccepted
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-amber-200 bg-amber-50 text-amber-900"}
                      >
                        {req.kvkkAccepted ? "KVKK onaylı" : "KVKK yok"}
                      </Badge>
                    </div>

                    {isCorporate && req.companyName && (
                      <p className="text-sm font-medium text-primary">
                        🏢 {req.companyName}
                        {req.employeeCount && ` · ${req.employeeCount} çalışan`}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">{formatTableDate(req.createdAt)}</p>
                    <p className="text-sm font-medium">{req.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {truncateMessage(req.message, 120)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Select
                        value={req.status}
                        onValueChange={(v) => onStatusChange(req.id, v as IncomingRequestStatus)}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]" size="sm">
                          <SelectValue>{INCOMING_STATUS_LABELS[req.status]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {INCOMING_STATUS_ORDER.map((s) => (
                            <SelectItem key={s} value={s}>
                              {INCOMING_STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenMessage(req)}
                      >
                        Mesajı görüntüle
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Masaüstü tablo */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Ad soyad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Telefon</TableHead>
                    {isCorporate && <TableHead>Şirket</TableHead>}
                    <TableHead>Konu</TableHead>
                    <TableHead>Mesaj</TableHead>
                    <TableHead>KVKK</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/50">
                      <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                        {formatTableDate(req.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {req.fullName}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate text-muted-foreground text-sm">
                        {req.email}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {req.phone || "—"}
                      </TableCell>
                      {isCorporate && (
                        <TableCell className="text-sm">
                          {req.companyName && (
                            <span className="font-medium text-foreground">{req.companyName}</span>
                          )}
                          {req.employeeCount && (
                            <span className="block text-xs text-muted-foreground">
                              {req.employeeCount} çalışan
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="max-w-[140px]">
                        <span className="line-clamp-2 text-sm">{req.subject}</span>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {truncateMessage(req.message)}
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-primary text-xs hover:text-primary/80"
                          onClick={() => onOpenMessage(req)}
                        >
                          Görüntüle
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={req.kvkkAccepted
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"}
                        >
                          {req.kvkkAccepted ? "Onaylı" : "—"}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={req.status}
                          onValueChange={(v) => onStatusChange(req.id, v as IncomingRequestStatus)}
                        >
                          <SelectTrigger className="w-[120px]" size="sm">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${STATUS_STYLE[req.status]}`}>
                              {INCOMING_STATUS_LABELS[req.status]}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {INCOMING_STATUS_ORDER.map((s) => (
                              <SelectItem key={s} value={s}>
                                {INCOMING_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
