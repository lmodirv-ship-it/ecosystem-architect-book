/**
 * Sites service — Ecosystem Registry backed by Supabase `sites` table.
 * Provides seed (from static ecosystem.ts), list, upsert, delete, and health.
 */
import { supabase } from "@/integrations/supabase/client";
import { HN_ALL_PROPERTIES, HN_DOMAIN_GROUPS, HN_CATEGORY_META } from "@/lib/hn/ecosystem";
import type { SiteRow, SiteStatus } from "@/lib/hn/db-types";

export type SiteWithUptime = SiteRow & {
  uptime_24h_pct: number | null;
  checks_24h: number;
};

export async function listSites(): Promise<SiteWithUptime[]> {
  const { data, error } = await supabase
    .from("sites_with_uptime" as never)
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as SiteRow[];
}

export async function countSites(): Promise<number> {
  const { count, error } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function upsertSite(input: {
  id?: string;
  name: string;
  url: string;
  category: string;
  app_type?: string | null;
  server?: string | null;
  version?: string | null;
  linked_database?: string | null;
}): Promise<SiteRow> {
  const domain = new URL(input.url).hostname;
  const payload = {
    id: input.id,
    name: input.name,
    url: input.url,
    domain,
    category: input.category,
    app_type: input.app_type ?? null,
    server: input.server ?? null,
    version: input.version ?? null,
    linked_database: input.linked_database ?? null,
  };
  const { data, error } = await supabase
    .from("sites")
    .upsert(payload, { onConflict: "url" })
    .select()
    .single();
  if (error) throw error;
  await logActivity("site.upsert", "site", (data as { id: string }).id, { url: input.url });
  return data as unknown as SiteRow;
}

export async function deleteSite(id: string) {
  const { error } = await supabase.from("sites").delete().eq("id", id);
  if (error) throw error;
  await logActivity("site.delete", "site", id);
}

/**
 * Seed sites table from the static ecosystem.ts file (Single Source of Truth
 * for known 141 unique properties). Idempotent via upsert on `url`.
 */
export async function seedSitesFromEcosystem(): Promise<{ inserted: number }> {
  const rows = HN_ALL_PROPERTIES.map((p) => {
    const group = HN_DOMAIN_GROUPS.find((g) => g.root === p.root);
    const catMeta = group ? HN_CATEGORY_META[group.category] : null;
    const brand = group?.brand ?? p.root;
    const name = p.subdomain ? `${p.subdomain}.${brand}` : brand;
    return {
      name,
      url: p.url,
      domain: p.host,
      category: group?.category ?? "brand",
      app_type: catMeta?.label ?? null,
      status: "unknown" as const,
      metadata: { subdomain: p.subdomain, root: p.root } as never,
    };
  });

  // Chunk to avoid payload limits.
  const CHUNK = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const { error, count } = await supabase
      .from("sites")
      .upsert(slice, { onConflict: "url", count: "exact" });
    if (error) throw error;
    inserted += count ?? slice.length;
  }
  await logActivity("sites.seed", "sites", null, { count: inserted });
  return { inserted };
}

/**
 * Client-side health check via HEAD/GET. Because CORS blocks reading response
 * headers for third-party domains, we use `no-cors` and time the request —
 * a settled promise means the host is reachable.
 */
export async function checkSiteHealth(site: Pick<SiteRow, "id" | "url">): Promise<{
  is_up: boolean;
  latency_ms: number;
  status: SiteStatus;
}> {
  const started = performance.now();
  let is_up = false;
  let latency = 0;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    await fetch(site.url, { method: "GET", mode: "no-cors", signal: controller.signal });
    clearTimeout(t);
    latency = Math.round(performance.now() - started);
    is_up = true;
  } catch {
    latency = Math.round(performance.now() - started);
    is_up = false;
  }
  const status: SiteStatus = is_up
    ? latency > 3000
      ? "degraded"
      : "online"
    : "offline";

  await supabase.from("health_checks").insert({
    site_id: site.id,
    is_up,
    latency_ms: latency,
    status_code: is_up ? 200 : null,
  });
  await supabase
    .from("sites")
    .update({
      status,
      last_checked_at: new Date().toISOString(),
      last_latency_ms: latency,
      last_status_code: is_up ? 200 : null,
    })
    .eq("id", site.id);
  return { is_up, latency_ms: latency, status };
}

export async function logActivity(
  action: string,
  target_type: string | null = null,
  target_id: string | null = null,
  meta: Record<string, unknown> = {},
) {
  const { data: userData } = await supabase.auth.getUser();
  await supabase.from("activity_log").insert({
    user_id: userData.user?.id ?? null,
    action,
    target_type,
    target_id,
    meta: meta as never,
  });
}

export async function listRecentActivity(limit = 20) {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
