import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FolderKanban,
  Loader2,
  Plus,
  Search,
  Trash2,
  Rocket,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard, GlowIcon } from "@/components/hn/primitives";
import { CreateProjectDialog } from "@/components/hn/CreateProjectDialog";
import {
  deleteProject,
  listProjects,
  updateProjectStatus,
} from "@/lib/hn/services/projects";
import type { ProjectKind, ProjectStatus } from "@/lib/hn/db-types";

export const Route = createFileRoute("/_app/projects")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Projects · HN Platform" },
      {
        name: "description",
        content: "Every initiative across the HN Ecosystem — live projects backed by HN DB.",
      },
    ],
  }),
  component: ProjectsPage,
});

const KIND_LABELS: Record<ProjectKind, string> = {
  website: "موقع",
  application: "تطبيق",
  mobile: "جوّال",
  ai: "ذكاء",
  media: "ميديا",
  cloud: "سحابة",
  database: "قاعدة",
  api: "API",
  storage: "تخزين",
};

const STATUS_META: Record<
  ProjectStatus,
  { label: string; text: string; bg: string; ring: string; icon: typeof Rocket }
> = {
  draft: { label: "مسوّدة", text: "text-muted-foreground", bg: "bg-white/5", ring: "ring-white/10", icon: Clock },
  building: { label: "قيد البناء", text: "text-amber", bg: "bg-amber/15", ring: "ring-amber/30", icon: Loader2 },
  live: { label: "منشور", text: "text-mint", bg: "bg-mint/15", ring: "ring-mint/30", icon: CheckCircle2 },
  archived: { label: "مؤرشف", text: "text-muted-foreground", bg: "bg-white/5", ring: "ring-white/10", icon: Archive },
  error: { label: "خطأ", text: "text-rose", bg: "bg-rose/15", ring: "ring-rose/30", icon: AlertTriangle },
};

function ProjectsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");

  const projectsQ = useQuery({ queryKey: ["projects"], queryFn: listProjects });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      updateProjectStatus(id, status),
    onSuccess: () => {
      toast.success("تم تحديث الحالة");
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "فشل التحديث"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "فشل الحذف"),
  });

  const projects = projectsQ.data ?? [];
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.description ?? "").toLowerCase().includes(query)
      );
    });
  }, [projects, q, statusFilter]);

  const stats = useMemo(() => ({
    total: projects.length,
    live: projects.filter((p) => p.status === "live").length,
    building: projects.filter((p) => p.status === "building").length,
    draft: projects.filter((p) => p.status === "draft").length,
  }), [projects]);

  return (
    <div className="space-y-6">
      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky/25 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <GlowIcon icon={FolderKanban} tone="sky" size="lg" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                HN DB · Projects
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
                Projects
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground" dir="rtl">
                كل مبادرة داخل منظومة HN — مع الحالة، المالك، والقرارات، مدعومة بقاعدة بيانات حقيقية.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="grid grid-cols-4 gap-3">
              <Stat label="Total" value={stats.total} />
              <Stat label="Live" value={stats.live} tone="mint" />
              <Stat label="Building" value={stats.building} tone="amber" />
              <Stat label="Draft" value={stats.draft} />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-sky px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet/30 hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> مشروع جديد
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في المشاريع…"
              className="h-10 w-full rounded-xl hn-glass pl-10 pr-3 text-sm outline-none focus:ring-1 focus:ring-violet/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "draft", "building", "live", "archived", "error"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-all ${
                  statusFilter === s
                    ? "bg-violet/20 text-foreground ring-1 ring-violet/40"
                    : "hn-glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "الكل" : STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {projectsQ.isLoading ? (
        <GlassCard className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> تحميل…
        </GlassCard>
      ) : projectsQ.error ? (
        <GlassCard className="p-6 text-sm text-rose">
          {(projectsQ.error as Error).message}
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-10 text-center text-sm text-muted-foreground" dir="rtl">
          {projects.length === 0 ? (
            <>
              لا يوجد مشاريع بعد.{" "}
              <button onClick={() => setOpen(true)} className="font-semibold text-violet hover:underline">
                أنشئ أوّل مشروع
              </button>
            </>
          ) : (
            "لا نتائج."
          )}
        </GlassCard>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status];
            const Icon = meta.icon;
            return (
              <GlassCard key={p.id} className="relative p-5" dir="rtl">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-semibold text-foreground">
                      {p.name}
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      {p.slug} · {KIND_LABELS[p.kind]}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                  >
                    <Icon className={`h-3 w-3 ${p.status === "building" ? "animate-spin" : ""}`} />
                    {meta.label}
                  </span>
                </div>

                {p.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {p.status !== "building" && p.status !== "live" && (
                    <ActionBtn onClick={() => statusMut.mutate({ id: p.id, status: "building" })}>
                      <Loader2 className="h-3 w-3 text-amber" />
                      بناء
                    </ActionBtn>
                  )}
                  {p.status !== "live" && (
                    <ActionBtn onClick={() => statusMut.mutate({ id: p.id, status: "live" })}>
                      <Rocket className="h-3 w-3 text-mint" />
                      نشر
                    </ActionBtn>
                  )}
                  {p.status !== "archived" && (
                    <ActionBtn onClick={() => statusMut.mutate({ id: p.id, status: "archived" })}>
                      <Archive className="h-3 w-3" />
                      أرشفة
                    </ActionBtn>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`حذف ${p.name}؟`)) deleteMut.mutate(p.id);
                    }}
                    className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-rose hover:bg-rose/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                <div className="mt-3 text-[10px] text-muted-foreground">
                  آخر تحديث: {new Date(p.updated_at).toLocaleString()}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <CreateProjectDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "mint" | "amber" }) {
  const c = tone === "mint" ? "text-mint" : tone === "amber" ? "text-amber" : "text-foreground";
  return (
    <div className="rounded-xl hn-glass px-3 py-2 text-center">
      <div className={`font-display text-xl font-bold ${c}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function ActionBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-lg hn-glass px-2 py-1 text-[11px] font-medium text-foreground hover:bg-white/10"
    >
      {children}
    </button>
  );
}
