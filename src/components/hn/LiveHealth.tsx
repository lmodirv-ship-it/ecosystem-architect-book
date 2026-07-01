import { useEffect, useState } from "react";
import { Cpu, MemoryStick, HardDrive, BrainCircuit, Database, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EnergyLine, GlassCard, SectionHeader, TONE_TEXT, type Tone } from "@/components/hn/primitives";

type Metric = {
  key: string;
  label: string;
  icon: LucideIcon;
  tone: Tone;
  base: number; // % baseline
  variance: number;
  unit?: string;
};

const METRICS: Metric[] = [
  { key: "cpu", label: "CPU", icon: Cpu, tone: "violet", base: 34, variance: 12 },
  { key: "ram", label: "RAM", icon: MemoryStick, tone: "sky", base: 52, variance: 8 },
  { key: "storage", label: "Storage", icon: HardDrive, tone: "amber", base: 61, variance: 3 },
  { key: "ai", label: "AI Engine", icon: BrainCircuit, tone: "cyan", base: 28, variance: 22 },
  { key: "db", label: "Database", icon: Database, tone: "mint", base: 41, variance: 10 },
  { key: "cloud", label: "Cloud", icon: Cloud, tone: "rose", base: 47, variance: 15 },
];

function toneBar(t: Tone) {
  return {
    violet: "from-violet to-sky",
    sky: "from-sky to-cyan",
    cyan: "from-cyan to-mint",
    mint: "from-mint to-sky",
    amber: "from-amber to-rose",
    rose: "from-rose to-violet",
  }[t];
}

export function LiveHealth() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(METRICS.map((m) => [m.key, m.base])),
  );

  useEffect(() => {
    const tick = () => {
      setValues((prev) => {
        const next: Record<string, number> = {};
        for (const m of METRICS) {
          const cur = prev[m.key] ?? m.base;
          const drift = (Math.random() - 0.5) * m.variance;
          const target = m.base + drift;
          const smooth = cur + (target - cur) * 0.45;
          next[m.key] = Math.max(4, Math.min(96, smooth));
        }
        return next;
      });
    };
    tick();
    const id = window.setInterval(tick, 1800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <GlassCard className="p-5">
      <SectionHeader
        title="Live System Health"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-medium text-mint ring-1 ring-mint/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            live
          </span>
        }
      />
      <EnergyLine className="my-4" />
      <ul className="space-y-3">
        {METRICS.map((m) => {
          const v = values[m.key] ?? m.base;
          const Icon = m.icon;
          return (
            <li key={m.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${TONE_TEXT[m.tone]}`} />
                  <span className="text-foreground/90">{m.label}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {v.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${toneBar(m.tone)} transition-[width] duration-1000 ease-out`}
                  style={{ width: `${v}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 rounded-lg bg-mint/10 px-3 py-2 text-center text-xs text-mint ring-1 ring-mint/20">
        All Systems Operational
      </div>
    </GlassCard>
  );
}
