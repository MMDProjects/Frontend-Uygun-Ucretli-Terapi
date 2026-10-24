"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeadListItem, LeadStatus } from "@/services/inbox/types";
import {
  CHANNEL_LABELS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_ORDER,
  LEAD_STATUS_STYLE,
  SERVICE_TYPE_LABELS,
} from "./lead-meta";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

function resolvePhone(lead: LeadListItem): string | null {
  if (lead.channel === "WHATSAPP") return lead.contact.phone ?? lead.phone;
  return lead.phone ?? lead.contact.phone;
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function PhoneLink({ lead }: { lead: LeadListItem }) {
  const phone = resolvePhone(lead);
  if (!phone) return <span className="text-muted-foreground">—</span>;
  return (
    <a href={telHref(phone)} className="text-primary hover:underline">
      {phone}
    </a>
  );
}

function Summary({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <p
        title={text}
        className={`text-sm text-muted-foreground ${expanded ? "whitespace-pre-wrap" : "line-clamp-2"}`}
      >
        {text}
      </p>
      {text.length > 80 && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs text-primary"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Daralt" : "Tümünü göster"}
        </Button>
      )}
    </div>
  );
}

function StatusSelect({
  lead,
  onChange,
  className,
}: {
  lead: LeadListItem;
  onChange: (id: string, status: LeadStatus) => void;
  className?: string;
}) {
  return (
    <Select
      value={lead.status}
      onValueChange={(v) => onChange(lead.id, v as LeadStatus)}
    >
      <SelectTrigger className={className} size="sm">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${LEAD_STATUS_STYLE[lead.status]}`}
        >
          {LEAD_STATUS_LABELS[lead.status]}
        </span>
      </SelectTrigger>
      <SelectContent>
        {LEAD_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s}>
            {LEAD_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ConversationLink({ lead }: { lead: LeadListItem }) {
  if (!lead.conversationId) return null;
  return (
    <Link
      href={`/admin/mesajlar?c=${lead.conversationId}`}
      className="inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-md border bg-background px-2.5 text-xs font-medium hover:bg-muted"
    >
      <MessageSquare className="size-3.5" />
      Konuşmaya git
    </Link>
  );
}

interface LeadsTableProps {
  leads: LeadListItem[];
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export function LeadsTable({ leads, onStatusChange }: LeadsTableProps) {
  return (
    <>
      <div className="grid gap-4 md:hidden">
        {leads.map((lead) => (
          <Card key={lead.id} className="rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{lead.fullName}</p>
                  <p className="text-sm">
                    <PhoneLink lead={lead} />
                    {lead.age != null && (
                      <span className="text-muted-foreground"> · {lead.age} yaş</span>
                    )}
                  </p>
                </div>
                <Badge variant="outline">{CHANNEL_LABELS[lead.channel]}</Badge>
              </div>
              <p className="text-sm font-medium">
                {SERVICE_TYPE_LABELS[lead.serviceType]}
              </p>
              <p className="text-sm text-muted-foreground">
                Aranacak saat: {lead.preferredCallTime}
              </p>
              <Summary text={lead.summary} />
              <p className="text-xs text-muted-foreground">
                {formatDate(lead.createdAt)}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusSelect
                  lead={lead}
                  onChange={onStatusChange}
                  className="w-full sm:w-[200px]"
                />
                <ConversationLink lead={lead} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad soyad</TableHead>
              <TableHead>Kanal</TableHead>
              <TableHead>Hizmet</TableHead>
              <TableHead>İstenen arama saati</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Yaş</TableHead>
              <TableHead>Özet</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/50">
                <TableCell className="whitespace-nowrap font-medium">
                  {lead.fullName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{CHANNEL_LABELS[lead.channel]}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {SERVICE_TYPE_LABELS[lead.serviceType]}
                </TableCell>
                <TableCell className="max-w-[160px] whitespace-normal text-sm">
                  {lead.preferredCallTime}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  <PhoneLink lead={lead} />
                </TableCell>
                <TableCell className="text-sm">{lead.age ?? "—"}</TableCell>
                <TableCell className="max-w-[240px] whitespace-normal">
                  <Summary text={lead.summary} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </TableCell>
                <TableCell>
                  <StatusSelect
                    lead={lead}
                    onChange={onStatusChange}
                    className="w-[170px]"
                  />
                </TableCell>
                <TableCell>
                  <ConversationLink lead={lead} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
