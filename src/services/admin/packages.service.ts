import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";

export interface AdminPackage {
  id: string;
  name: string;
  sessionCount: number;
  price: string;
  description: string;
}

export interface UpdatePackageDto {
  name?: string;
  sessionCount?: number;
  price?: number;
  description?: string;
}

export async function getAdminPackages(): Promise<AdminPackage[]> {
  const base = getOptionalApiBase();
  if (!base) return [];
  return apiFetch<AdminPackage[]>("/packages");
}

export async function updateAdminPackage(
  id: string,
  dto: UpdatePackageDto
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;
  await apiFetch<unknown>(`/admin/packages/${id}`, {
    method: "PUT",
    body: dto,
  });
}
