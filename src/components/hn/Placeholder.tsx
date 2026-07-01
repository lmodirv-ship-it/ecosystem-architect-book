
import { EnergyLine, GlassCard, GlowIcon } from "@/components/hn/primitives";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "@/components/hn/primitives";

/**
 * Shared "coming soon" surface for sections whose deep implementation
 * lives in later phases of the HN Architecture Bible. Keeps the shell
 * navigable and on-brand without shipping cheap placeholder content.
 */
export function HNPlaceholder({
  title,
  chapter,
  description,
  icon,
  tone = "violet",
  bullets,
}: {
  title: string;
  chapter: string;
  description: string;
  icon: LucideIcon;
  tone?: Tone;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard strong className="relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <GlowIcon icon={icon} tone={tone} size="lg" />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {chapter}
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="text-sm font-semibold text-foreground">
          Scope defined in the HN Architecture Bible
        </div>
        <EnergyLine className="my-4" />
        <ul className="grid gap-3 md:grid-cols-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-foreground/90"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_6px] shadow-violet/70" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-xl bg-violet/10 px-4 py-3 text-xs text-foreground/80 ring-1 ring-violet/20">
          This module is scaffolded on brand and will be implemented in a
          subsequent phase without breaking the HN Design Language.
        </div>
      </GlassCard>
    </div>
  );
}

