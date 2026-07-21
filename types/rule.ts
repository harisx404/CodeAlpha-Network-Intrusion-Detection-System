/**
 * TypeScript type definitions for NIDS detection rules.
 *
 * Mirrors the Pydantic rule schema in backend/schemas/rule.py.
 * Keep in sync when adding fields to either side.
 */

import type { SeverityLevel } from "@/types/alert";

export interface Rule {
  id: number;
  sid: number;
  name: string;
  body: string;
  is_active: boolean;
  severity: SeverityLevel;
  category: string;
}

export interface RuleCreate {
  sid: number;
  name: string;
  body: string;
  is_active: boolean;
  severity: SeverityLevel;
  category: string;
}
