/**
 * TypeScript type definitions for NIDS alert-related data.
 *
 * These mirror the Pydantic schemas in backend/schemas/alert.py exactly.
 * Keep in sync when adding fields to either side.
 */

export type SeverityLevel = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AlertStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "RESOLVED"
  | "FALSE_POSITIVE"
  | "ESCALATED";

export interface GeoData {
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  org: string | null;
}

export interface AlertResponse {
  id: number;
  timestamp: string;          // ISO 8601 string
  severity: SeverityLevel;
  status: AlertStatus;
  category: string | null;
  signature_id: number | null;
  signature: string;
  src_ip: string;
  src_port: number | null;
  dst_ip: string;
  dst_port: number | null;
  protocol: string | null;
  flow_id: string | null;
  geo: GeoData | null;
  raw_eve: Record<string, unknown> | null;
  notes: string;
  acknowledged_by: number | null;
  acknowledged_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertFilter {
  severity?: SeverityLevel;
  status?: AlertStatus;
  src_ip?: string;
  dst_ip?: string;
  signature?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface AcknowledgeRequest {
  notes?: string;
}

export interface ResolveRequest {
  resolution: "RESOLVED" | "FALSE_POSITIVE";
  notes?: string;
}
