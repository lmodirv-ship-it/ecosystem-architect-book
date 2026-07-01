import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Plus,
  Send,
  Sparkles,
  FileBarChart,
  HeartPulse,
  Rocket,
  Database as DbIcon,
  FolderKanban,
  BrainCircuit,
  Gauge,
} from "lucide-react";
import {
  EnergyLine,
  GlassCard,
  GlowIcon,
  SectionHeader,
  StatusDot,
} from "@/components/hn/primitives";
import {
  HN_APPS,
  HN_RECENT_PROJECTS,
  HN_STATISTICS,
  HN_STATS,
  HN_SYSTEM_ACTIVITY,
  HN_SYSTEM_STATUS,
} from "@/lib/hn/data";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · HN Platform" },
      {
        name: "description",
        content:
          "HN Core Dashboard — a real-time view of every application, agent and system in the HN Ecosystem.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* MAIN COLUMN */}
      <div className="min-w-0 space-y-6">
        <HeroCard />
        <ApplicationsCard />
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentProjects />
          <SystemActivity />
        </div>
        <StatisticsOverview />
      </div>

      {/* RIGHT RAIL */}
      <div className="space-y-6">
        <SystemStatus />
        <AIAssistant />
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
function HeroCard() {
  return (
    <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
      {/* Cosmic glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.19_295/0.45),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-6 h-40 w-40 rounded-full border border-violet/30" />
      <div className="pointer-events-none absolute right-24 top-20 h-24 w-24 rounded-full bg-gradient-to-br from-violet to-sky blur-[2px] opacity-80" />

      <div className="relative">
        <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <StatusDot tone="violet" /> Welcome to
        </div>
        <h1 className="font-display text-4xl font-bold md:text-6xl">
          <span className="text-foreground">HN </span>
          <span className="hn-gradient-text">Platform</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
          The Digital Operating System for HN Ecosystem
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <HeroStat icon={Gauge} label="Total Apps" value={HN_STATS.totalApps} tone="violet" />
          <HeroStat icon={FolderKanban} label="Active Projects" value={HN_STATS.activeProjects} tone="sky" />
          <HeroStat icon={BrainCircuit} label="AI Agents" value={HN_STATS.aiAgents} tone="cyan" />
          <HeroStat icon={DbIcon} label="Databases" value={HN_STATS.databases} tone="mint" />
          <HeroStat icon={Sparkles} label="Uptime" value={HN_STATS.uptime} tone="amber" />
        </div>
      </div>
    </GlassCard>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  tone: "violet" | "sky" | "cyan" | "mint" | "amber";
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl hn-glass px-3 py-2.5">
      <GlowIcon icon={Icon} tone={tone} size="sm" />
      <div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="font-display text-lg font-semibold text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------- APPS ---------- */
function ApplicationsCard() {
  return (
    <GlassCard className="p-5 md:p-6">
      <SectionHeader
        title="HN Applications"
        action={
          <Link
            to="/applications"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all apps <ArrowUpRight className="h-3 w-3" />
          </Link>
        }
      />
      <EnergyLine className="my-4" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {HN_APPS.map((app) => (
          <Link
            key={app.id}
            to={app.href}
            className="group relative flex flex-col items-center justify-center rounded-2xl hn-glass p-4 text-center transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-violet/40"
          >
            {app.id === "add" ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-border-strong text-muted-foreground group-hover:text-foreground">
                <Plus className="h-6 w-6" />
              </div>
            ) : (
              <GlowIcon icon={app.icon} tone={app.tone} size="lg" />
            )}
            <div className="mt-3 text-sm font-semibold text-foreground">
              {app.name}
            </div>
            {app.tagline && (
              <div className="text-[11px] text-muted-foreground">
                {app.tagline}
              </div>
            )}
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

/* ---------- RECENT PROJECTS ---------- */
function RecentProjects() {
  return (
    <GlassCard className="p-5">
      <SectionHeader
        title="Recent Projects"
        action={<ViewAll to="/projects" />}
      />
      <EnergyLine className="my-4" />
      <ul className="space-y-4">
        {HN_RECENT_PROJECTS.map((p) => (
          <li key={p.name} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10 ring-1 ring-violet/20">
              <FolderKanban className="h-4 w-4 text-violet" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {p.name}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Updated {p.updated}
              </div>
            </div>
            <div className="w-28">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
            <span className="w-9 text-right font-mono text-xs text-muted-foreground">
              {p.progress}%
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* ---------- ACTIVITY ---------- */
function SystemActivity() {
  return (
    <GlassCard className="p-5">
      <SectionHeader title="System Activity" action={<ViewAll to="/analytics" />} />
      <EnergyLine className="my-4" />
      <ul className="space-y-4">
        {HN_SYSTEM_ACTIVITY.map((a) => (
          <li key={a.text} className="flex items-center gap-3">
            <StatusDot tone={a.tone} />
            <div className="flex-1 text-sm text-foreground">{a.text}</div>
            <div className="text-[11px] text-muted-foreground">{a.time}</div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* ---------- STATISTICS ---------- */
function StatisticsOverview() {
  return (
    <GlassCard className="p-5 md:p-6">
      <SectionHeader
        title="Statistics Overview"
        action={
          <button className="rounded-lg hn-glass px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            This Week ▾
          </button>
        }
      />
      <EnergyLine className="my-4" />
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <svg viewBox="0 0 400 140" className="h-32 w-full">
            <defs>
              <linearGradient id="hn-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.19 295)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(0.72 0.19 295)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 110 L40 100 L80 90 L120 95 L160 70 L200 78 L240 55 L280 65 L320 40 L360 55 L400 30 L400 140 L0 140 Z"
              fill="url(#hn-area)"
            />
            <path
              d="M0 110 L40 100 L80 90 L120 95 L160 70 L200 78 L240 55 L280 65 L320 40 L360 55 L400 30"
              fill="none"
              stroke="oklch(0.72 0.19 295)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HN_STATISTICS.map((s) => (
            <div key={s.label} className="rounded-xl hn-glass p-3">
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="text-[11px] text-mint">{s.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ---------- RIGHT RAIL ---------- */
function SystemStatus() {
  return (
    <GlassCard className="p-5">
      <SectionHeader title="System Status" action={<ViewAll to="/analytics" />} />
      <EnergyLine className="my-4" />
      <ul className="space-y-3">
        {HN_SYSTEM_STATUS.map((s) => (
          <li key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <StatusDot tone="mint" />
              {s.label}
            </div>
            <span className="text-xs text-mint">{s.status}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-lg bg-mint/10 px-3 py-2 text-center text-xs text-mint ring-1 ring-mint/20">
        All Systems Operational
      </div>
    </GlassCard>
  );
}

function AIAssistant() {
  return (
    <GlassCard className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/30 blur-3xl" />
      <div className="relative">
        <SectionHeader title="AI Assistant" />
        <EnergyLine className="my-4" />
        <div className="flex flex-col items-center py-2">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan opacity-80 blur-md" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-background ring-1 ring-violet/40">
              <BrainCircuit className="h-7 w-7 text-violet" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-sm font-semibold text-foreground">
              Hello, HN Master 👋
            </div>
            <div className="text-[11px] text-muted-foreground">
              How can I help you today?
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <QuickAction icon={Rocket} label="Create New Project" />
          <QuickAction icon={FileBarChart} label="Analyze Data" />
          <QuickAction icon={FileBarChart} label="Generate Report" />
          <QuickAction icon={HeartPulse} label="System Health Check" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl hn-glass px-3 py-2">
          <input
            placeholder="Ask anything…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-sky text-primary-foreground">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof Rocket;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 rounded-lg hn-glass px-2.5 py-2 text-left text-[11px] text-foreground/90 hover:text-foreground">
      <Icon className="h-3.5 w-3.5 text-violet" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function ViewAll({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      View all <ArrowUpRight className="h-3 w-3" />
    </Link>
  );
}
