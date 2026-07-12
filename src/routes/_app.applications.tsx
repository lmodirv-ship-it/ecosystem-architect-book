import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Database,
  Download,
  ExternalLink,
  Globe,
  Layers,
  Loader2,
  RefreshCw,
  Search,
  Server,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard, GlowIcon } from "@/components/hn/primitives";
import {
  checkSiteHealth,
  checkSitesBatch,
  deleteSite,
  listSites,
  seedSitesFromEcosystem,
  type SiteWithUptime,
} from "@/lib/hn/services/sites";
import { useUserRoles } from "@/hooks/useUserRoles";
import { HN_CATEGORY_META } from "@/lib/hn/ecosystem";
import type { SiteStatus } from "@/lib/hn/db-types";

export const Route = createFileRoute("/_app/applications")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Applications · HN Platform" },
      {
        name: "description",
        content:
          "HN Ecosystem Registry — every live domain and subdomain under HN Groupe, monitored from a single command surface.",
      },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const qc = useQueryClient();
  const { isAdmin } = useUserRoles();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<SiteStatus | "all">("all");
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [bulkChecking, setBulkChecking] = useState(false);

  const sitesQ = useQuery({ queryKey: ["sites"], queryFn: listSites });

  const seedMut = useMutation({
    mutationFn: seedSitesFromEcosystem,
    onSuccess: (r) => {
      toast.success(`تمت مزامنة ${r.inserted} موقع في السجل`);
      qc.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "فشل الاستيراد"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: () => {
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "فشل الحذف"),
  });

  const runCheck = async (site: SiteWithUptime) => {
    setChecking((c) => ({ ...c, [site.id]: true }));
    try {
      const r = await checkSiteHealth(site);
      toast.success(`${site.domain}: ${r.status} · ${r.latency_ms}ms`);
      qc.invalidateQueries({ queryKey: ["sites"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الفحص");
    } finally {
      setChecking((c) => ({ ...c, [site.id]: false }));
    }
  };

  const runAllChecks = async () => {
    if (!sites) return;
    setBulkChecking(true);
    const targets = filtered.slice(0, 30);
    toast.info(`فحص ${targets.length} موقع عبر الخادم…`);
    try {
      const r = await checkSitesBatch(targets.map((s) => s.id));
      toast.success(`اكتمل فحص ${r.checked} موقع`);
      qc.invalidateQueries({ queryKey: ["sites"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الفحص المجمّع");
    } finally {
      setBulkChecking(false);
    }
  };

  const sites = sitesQ.data;
  const stats = useMemo(() => {
    const s = sites ?? [];
    return {
      total: s.length,
      online: s.filter((x) => x.status === "online").length,
      degraded: s.filter((x) => x.status === "degraded").length,
      offline: s.filter((x) => x.status === "offline").length,
      unknown: s.filter((x) => x.status === "unknown").length,
    };
  }, [sites]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (sites ?? []).filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.domain.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    });
  }, [sites, q, statusFilter]);

  return (
    <div className="space-y-6">
      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <GlowIcon icon={Layers} tone="violet" size="lg" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Ecosystem Registry
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
                HN Applications
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground" dir="rtl">
                السجل التشغيلي الحيّ لكل مواقع HN — الحالة، الاستجابة، والفحص الفوري من قلب المنصّة.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Total" value={stats.total} />
            <Stat label="Online" value={stats.online} tone="mint" />
            <Stat label="Degraded" value={stats.degraded} tone="amber" />
            <Stat label="Offline" value={stats.offline} tone="rose" />
            <Stat label="Unknown" value={stats.unknown} />
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          {isAdmin && (
            <button
              onClick={() => seedMut.mutate()}
              disabled={seedMut.isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-sky px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {seedMut.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              استيراد من Ecosystem
            </button>
          )}
          <button
            onClick={runAllChecks}
            disabled={bulkChecking || !filtered.length}
            className="flex items-center gap-2 rounded-xl hn-glass px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-white/10 disabled:opacity-60"
          >
            {bulkChecking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-violet" />
            )}
            فحص أول 20 موقع
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في المواقع…"
              className="h-10 w-full rounded-xl hn-glass pl-10 pr-3 text-sm outline-none focus:ring-1 focus:ring-violet/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "online", "degraded", "offline", "unknown"] as const).map((s) => (
              <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s === "all" ? "الكل" : s}
              </Chip>
            ))}
          </div>
        </div>
      </GlassCard>

      {sitesQ.isLoading ? (
        <GlassCard className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> تحميل السجل…
        </GlassCard>
      ) : sitesQ.error ? (
        <GlassCard className="p-6 text-sm text-rose">
          فشل تحميل السجل: {(sitesQ.error as Error).message}
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground" dir="rtl">
          {sites?.length === 0
            ? isAdmin
              ? "السجل فارغ. اضغط «استيراد من Ecosystem» لملء ١٤١ موقعًا."
              : "السجل فارغ. اطلب من المسؤول استيراد المواقع."
            : "لا نتائج مطابقة."}
        </GlassCard>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onCheck={() => runCheck(site)}
              onDelete={() => {
                if (confirm(`حذف ${site.domain}؟`)) deleteMut.mutate(site.id);
              }}
              checking={!!checking[site.id]}
              canDelete={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs transition-all ${
        active
          ? "bg-violet/20 text-foreground ring-1 ring-violet/40"
          : "hn-glass text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "mint" | "amber" | "rose";
}) {
  const toneClass =
    tone === "mint"
      ? "text-mint"
      : tone === "amber"
        ? "text-amber"
        : tone === "rose"
          ? "text-rose"
          : "text-foreground";
  return (
    <div className="rounded-xl hn-glass px-3 py-2 text-center">
      <div className={`font-display text-xl font-bold ${toneClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

const STATUS_TONE: Record<SiteStatus, { bg: string; text: string; ring: string; dot: string }> = {
  online: { bg: "bg-mint/15", text: "text-mint", ring: "ring-mint/40", dot: "bg-mint" },
  degraded: { bg: "bg-amber/15", text: "text-amber", ring: "ring-amber/40", dot: "bg-amber" },
  offline: { bg: "bg-rose/15", text: "text-rose", ring: "ring-rose/40", dot: "bg-rose" },
  unknown: {
    bg: "bg-white/5",
    text: "text-muted-foreground",
    ring: "ring-white/10",
    dot: "bg-muted-foreground",
  },
};

function SiteCard({
  site,
  onCheck,
  onDelete,
  checking,
  canDelete,
}: {
  site: SiteWithUptime;
  onCheck: () => void;
  onDelete: () => void;
  checking: boolean;
  canDelete: boolean;
}) {
  const tone = STATUS_TONE[site.status as SiteStatus];
  const catMeta = HN_CATEGORY_META[site.category as keyof typeof HN_CATEGORY_META];
  return (
    <GlassCard className="group relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hn-glass">
            <Globe className="h-4 w-4 text-violet" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-semibold text-foreground">
              {site.name}
            </div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">
              {site.domain}
            </div>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-widest ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${tone.dot} ${
              site.status === "online" ? "animate-pulse shadow-[0_0_6px_currentColor]" : ""
            }`}
          />
          {site.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[11px]">
        <Meta label="Latency" value={site.last_latency_ms ? `${site.last_latency_ms}ms` : "—"} />
        <Meta
          label="Uptime 24h"
          value={site.uptime_24h_pct !== null ? `${site.uptime_24h_pct}%` : "—"}
        />
        <Meta label="Category" value={catMeta?.label ?? site.category} />
        <Meta
          label="Checked"
          value={
            site.last_checked_at ? new Date(site.last_checked_at).toLocaleTimeString() : "—"
          }
        />
      </div>

      {(site.server || site.version || site.linked_database) && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
          {site.server && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5">
              <Server className="h-2.5 w-2.5" /> {site.server}
            </span>
          )}
          {site.linked_database && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5">
              <Database className="h-2.5 w-2.5" /> {site.linked_database}
            </span>
          )}
          {site.version && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5">
              v{site.version}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onCheck}
          disabled={checking}
          className="flex items-center gap-1.5 rounded-lg hn-glass px-2.5 py-1.5 text-[11px] font-medium text-foreground transition hover:bg-white/10 disabled:opacity-60"
        >
          {checking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3 text-violet" />
          )}
          فحص
        </button>
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg hn-glass px-2.5 py-1.5 text-[11px] font-medium text-foreground transition hover:bg-white/10"
        >
          <ExternalLink className="h-3 w-3 text-cyan" />
          فتح
        </a>
        <button
          className="flex items-center gap-1.5 rounded-lg hn-glass px-2.5 py-1.5 text-[11px] font-medium text-foreground transition hover:bg-white/10"
          title="نشاط الموقع"
        >
          <Activity className="h-3 w-3 text-sky" />
        </button>
        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-rose transition hover:bg-rose/10"
            title="حذف"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </GlassCard>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-mono text-[11px] text-foreground">{value}</div>
    </div>
  );
}
