import { apiFetch } from "@/lib/api";
import { buildQuery } from "./query";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  ListAppointmentsParams,
} from "./types";

export function listAppointments(
  params: ListAppointmentsParams = {},
): Promise<Appointment[]> {
  return apiFetch(`/admin/appointments${buildQuery(params)}`);
}

export function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  return apiFetch("/admin/appointments", { method: "POST", body: input });
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  return apiFetch(`/admin/appointments/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
