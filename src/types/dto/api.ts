/**
 * Standard API envelope (align with backend contract).
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}
