/**
 * TypeScript types for the standard API response envelope.
 */

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  meta: PaginationMeta | null;
}

export interface WsMessage {
  type: "new_alert" | "stats_update" | "ping" | "system_status";
  timestamp: string;
  data?: Record<string, unknown>;
}

export type PaginatedResponse<T> = ApiResponse<T[]>;
