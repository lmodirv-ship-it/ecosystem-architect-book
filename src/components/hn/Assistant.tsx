import { motion } from "framer-motion";
import { BrainCircuit, Rocket, ShieldAlert, Sparkles, ListChecks } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EnergyLine, GlassCard, SectionHeader, TONE_TEXT, type Tone } from "@/components/hn/primitives";

type Item = { icon: LucideIcon; label: string; value: string; tone: Tone };

const ITEMS: Item[] = [
  { icon: Rocket, label: "Deployments", value: "3", tone: "violet" },
  { icon: ShieldAlert, label: "SSL alerts", value: "2", tone: "rose" },
  { icon: Sparkles, label: "AI suggestions", value: "1", tone: "cyan" },
  { icon: ListChecks, label: "Pending tasks", value: "5", tone: "amber" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Working late";
}

export function Assistant() {
  return (
    <GlassCard strong className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/30 blur-3xl" />
      <div className="relative">
        <SectionHeader title="HN Assistant" />
        <EnergyLine className="my-4" />

        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan"
              animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background ring-1 ring-violet/40">
              <BrainCircuit className="h-6 w-6 text-violet" />
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {greeting()} 👋
            </div>
            <div className="font-display text-base font-semibold text-foreground">
              Hello, HN Master
            </div>
            <div className="text-[11px] text-muted-foreground">
              Your platform is calm and ready.
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.label}
                className="flex items-center gap-2 rounded-xl hn-glass px-2.5 py-2"
              >
                <Icon className={`h-4 w-4 ${TONE_TEXT[it.tone]}`} />
                <div>
                  <div className="font-display text-sm font-semibold text-foreground leading-none">
                    {it.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {it.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-violet/25 bg-violet/10 p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-violet">
            <Sparkles className="h-3.5 w-3.5" /> Recommendation
          </div>
          <p className="mt-1 text-sm text-foreground/90">
            I recommend reviewing <span className="font-semibold">HN Cloud</span>{" "}
            today — SSL renewal is approaching on 2 domains.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
