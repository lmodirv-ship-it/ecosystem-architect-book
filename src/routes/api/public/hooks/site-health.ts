/**
 * Public cron endpoint — real server-side health checks for every site.
 * Called by pg_cron every 5 minutes. Also invokable on-demand from the UI.
 *
 * Runs a small HEAD/GET fetch per site (concurrency-limited), writes a
 * health_checks row and updates the parent `sites` row.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

type SiteRow = {
  id: string;
  url: string;
  domain: string;
};

async function probe(url: string): Promise<{
  is_up: boolean;
  latency_ms: number;
  status_code: number | null;
  error: string | null;
}> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "HN-Platform-Monitor/1.0" },
    });
    // Some hosts reject HEAD (405/403). Retry GET for a truthful signal.
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "HN-Platform-Monitor/1.0" },
      });
    }
    clearTimeout(timer);
    const latency = Date.now() - started;
    return {
      is_up: res.status < 500,
      latency_ms: latency,
      status_code: res.status,
      error: res.status >= 500 ? `HTTP ${res.status}` : null,
    };
  } catch (e) {
    clearTimeout(timer);
    return {
      is_up: false,
      latency_ms: Date.now() - started,
      status_code: null,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

function classify(is_up: boolean, latency_ms: number): "online" | "degraded" | "offline" {
  if (!is_up) return "offline";
  if (latency_ms > 3000) return "degraded";
  return "online";
}

export const Route = createFileRoute("/api/public/hooks/site-health")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          site_ids?: string[];
          limit?: number;
        };

        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );

        let query = supabase.from("sites").select("id, url, domain");
        if (body.site_ids?.length) query = query.in("id", body.site_ids);
        query = query.order("last_checked_at", { ascending: true, nullsFirst: true });
        if (body.limit) query = query.limit(body.limit);
        else query = query.limit(60); // cron batch cap: 60 sites / 5 min

        const { data: sites, error } = await query;
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const rows = (sites ?? []) as SiteRow[];
        const results: Array<{ id: string; status: string; latency: number }> = [];

        // Concurrency of 8.
        const queue = [...rows];
        const workers = Array.from({ length: 8 }, async () => {
          while (queue.length) {
            const site = queue.shift();
            if (!site) return;
            const r = await probe(site.url);
            const status = classify(r.is_up, r.latency_ms);
            await supabase.from("health_checks").insert({
              site_id: site.id,
              is_up: r.is_up,
              status_code: r.status_code,
              latency_ms: r.latency_ms,
              error: r.error,
            });
            await supabase
              .from("sites")
              .update({
                status,
                last_checked_at: new Date().toISOString(),
                last_latency_ms: r.latency_ms,
                last_status_code: r.status_code,
              })
              .eq("id", site.id);
            results.push({ id: site.id, status, latency: r.latency_ms });
          }
        });
        await Promise.all(workers);

        return new Response(
          JSON.stringify({ checked: results.length, results }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
