"use client";

import { AlertTriangle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROLE_COLORS, ROLE_LABELS } from "@/lib/danisan-user-meta";
import type { DanisanRole, DanisanUser } from "@/types/dto/user-list";

interface DanisanUsersTableProps {
  users: DanisanUser[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenDetail: (user: DanisanUser) => void;
  onOpenWarning: (user: DanisanUser) => void;
  onRoleChange: (userId: string, role: DanisanRole) => void;
  onStatusToggle: (userId: string) => void;
  onNotifyStub: (user: DanisanUser) => void;
}

const ROLE_OPTIONS: DanisanRole[] = ["danisan", "premium_danisan", "guest"];

export function DanisanUsersTable({
  users,
  loading,
  error,
  onRefresh,
  onOpenDetail,
  onOpenWarning,
  onRoleChange,
  onStatusToggle,
  onNotifyStub,
}: DanisanUsersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danışan listesi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : null}

        {error && !loading ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
            <AlertTriangle className="size-8" />
            <p className="text-sm">{error}</p>
            <Button type="button" variant="outline" onClick={() => void onRefresh()}>
              Tekrar dene
            </Button>
          </div>
        ) : null}

        {!loading && !error && users.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Kriterlere uygun danışan bulunamadı.
          </p>
        ) : null}

        {!loading && !error && users.length > 0 ? (
          <>
            <div className="grid gap-4 md:hidden">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        className="text-left font-medium hover:underline"
                        onClick={() => onOpenDetail(user)}
                      >
                        {user.name}
                      </button>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30"
                            : ""
                        }
                      >
                        {user.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          onRoleChange(user.id, value as DanisanRole)
                        }
                      >
                        <SelectTrigger
                          className={`w-[200px] ${ROLE_COLORS[user.role].bg} ${ROLE_COLORS[user.role].text}`}
                          size="sm"
                        >
                          <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Bildirim (yakında)"
                        onClick={() => onNotifyStub(user)}
                      >
                        <Bell className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onOpenDetail(user)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{user.id}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            onRoleChange(user.id, value as DanisanRole)
                          }
                        >
                          <SelectTrigger
                            className={`w-[200px] ${ROLE_COLORS[user.role].bg} ${ROLE_COLORS[user.role].text}`}
                            size="sm"
                          >
                            <SelectValue placeholder="Rol seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((r) => (
                              <SelectItem key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30"
                              : ""
                          }
                        >
                          {user.status === "active" ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            title="Uyarı gönder"
                            onClick={() => onOpenWarning(user)}
                          >
                            <AlertTriangle className="size-4 text-amber-600" />
                          </Button>
                          <Switch
                            checked={user.status === "active"}
                            onCheckedChange={() => onStatusToggle(user.id)}
                            aria-label="Danışan durumu"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
