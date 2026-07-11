import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Sparkles,
  FolderKanban,
  Database as DbIcon,
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
  HN_RECENT_PROJECTS,
  HN_STATISTICS,
  HN_STATS,
  HN_SYSTEM_ACTIVITY,
} from "@/lib/hn/data";
import { CosmicBackground } from "@/components/hn/CosmicBackground";
import { CoreOrbit } from "@/components/hn/CoreOrbit";
import { CommandBar } from "@/components/hn/CommandBar";
import { LiveHealth } from "@/components/hn/LiveHealth";
import { Assistant } from "@/components/hn/Assistant";
import { BootSequence } from "@/components/hn/BootSequence";
import { OwnerDashboard } from "@/components/hn/dashboard/OwnerDashboard";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · HN Platform" },
      {
        name: "description",
        content:
          "HN Core Dashboard — the living command surface of the HN Digital Operating System.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <BootSequence />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* MAIN COLUMN */}
        <div className="min-w-0 space-y-6">
          <HeroOrbit />
          <CommandBar />
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentProjects />
            <SystemActivity />
          </div>
          <StatisticsOverview />
        </div>

        {/* RIGHT RAIL */}
        <div className="space-y-6">
          <LiveHealth />
          <Assistant />
        </div>
      </div>

      {/* Owner Dashboard — Real business KPIs backed by Supabase */}
      <div className="mt-8">
        <OwnerDashboard />
      </div>
    </>
  );
}

/* ---------- HERO with orbital HN Core ---------- */
function HeroOrbit() {
  return (
    <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
      <CosmicBackground density={55} />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <StatusDot tone="violet" /> Welcome to
          </div>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">HN </span>
            <span className="hn-gradient-text">Platform</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            The Digital Operating System for the HN Ecosystem.
            <br />
            Every application orbits a single central brain — HN Core.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <HeroStat icon={Gauge} label="Total Apps" value={HN_STATS.totalApps} tone="violet" />
            <HeroStat icon={FolderKanban} label="Active Projects" value={HN_STATS.activeProjects} tone="sky" />
            <HeroStat icon={BrainCircuit} label="AI Agents" value={HN_STATS.aiAgents} tone="cyan" />
            <HeroStat icon={DbIcon} label="Databases" value={HN_STATS.databases} tone="mint" />
            <HeroStat icon={Sparkles} label="Uptime" value={HN_STATS.uptime} tone="amber" />
          </div>
        </div>

        <div className="relative flex justify-center">
          <CoreOrbit />
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
