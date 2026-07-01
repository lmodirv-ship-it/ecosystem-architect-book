import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronsLeft, Sparkles } from "lucide-react";
import { HN_NAV } from "@/lib/hn/nav";
import { cn } from "@/lib/utils";
import { GlassCard, StatusDot } from "./primitives";

export function HNSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col gap-4 border-r border-border/60 bg-sidebar/60 backdrop-blur-xl px-4 py-5">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-2">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-sky ring-1 ring-white/10">
          <span className="font-display text-lg font-bold text-primary-foreground">
            HN
          </span>
          <span className="pointer-events-none absolute -inset-1 rounded-2xl bg-violet/30 blur-xl opacity-60" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-semibold text-foreground">
            HN Platform
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            Digital Operating System
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {HN_NAV.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-violet/20 to-sky/10 text-foreground ring-1 ring-violet/30"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-violet" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.title}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_8px] shadow-violet/70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Core Status */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">
            HN Core Status
          </div>
          <Sparkles className="h-3.5 w-3.5 text-violet" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StatusDot tone="mint" />
          <span className="text-xs text-foreground">All Systems Operational</span>
        </div>
        <svg viewBox="0 0 200 40" className="mt-3 h-10 w-full">
          <defs>
            <linearGradient id="hn-spark" x1="0" x2="1">
              <stop offset="0%" stopColor="oklch(0.80 0.16 165)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.80 0.16 165)" />
              <stop offset="100%" stopColor="oklch(0.80 0.16 165)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 25 L20 22 L40 26 L60 18 L80 24 L100 14 L120 22 L140 12 L160 20 L180 10 L200 18"
            fill="none"
            stroke="url(#hn-spark)"
            strokeWidth="1.5"
          />
        </svg>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Uptime</span>
          <span className="font-mono text-foreground">99.99%</span>
        </div>
      </GlassCard>

      {/* Profile */}
      <GlassCard className="flex items-center gap-3 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-sky text-xs font-semibold text-primary-foreground">
          HN
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">HN Master</div>
          <div className="truncate text-[11px] text-muted-foreground">Super Admin</div>
        </div>
        <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
      </GlassCard>

      <button className="mt-1 flex items-center justify-center gap-2 rounded-lg py-1.5 text-[11px] text-muted-foreground hover:text-foreground">
        <ChevronsLeft className="h-3.5 w-3.5" /> Collapse
      </button>
    </aside>
  );
}
