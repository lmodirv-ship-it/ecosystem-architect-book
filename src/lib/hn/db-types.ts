// Re-exports of the database types for ergonomic use in the app.
import type { Database } from "@/integrations/supabase/types";

export type AppRole = "admin" | "editor" | "viewer";
export type SiteStatus = "online" | "offline" | "degraded" | "unknown";
export type ProjectKind =
  | "website"
  | "application"
  | "mobile"
  | "ai"
  | "media"
  | "cloud"
  | "database"
  | "api"
  | "storage";
export type ProjectStatus = "draft" | "building" | "live" | "archived" | "error";

// Placeholder DB row shapes (real types will come from generated Database once tables show up).
export type SiteRow = {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  app_type: string | null;
  server: string | null;
  version: string | null;
  status: SiteStatus;
  ssl_expires_at: string | null;
  last_checked_at: string | null;
  last_latency_ms: number | null;
  last_status_code: number | null;
  linked_database: string | null;
  linked_project_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  kind: ProjectKind;
  status: ProjectStatus;
  description: string | null;
  builder: string | null;
  config: Record<string, unknown>;
  linked_site_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityRow = {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

export type HealthCheckRow = {
  id: string;
  site_id: string;
  checked_at: string;
  is_up: boolean;
  status_code: number | null;
  latency_ms: number | null;
  error: string | null;
};

// Keeps the Database import used so IDEs don't strip it.
export type _KeepDb = Database;
