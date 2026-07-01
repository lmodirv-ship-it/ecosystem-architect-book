import * as React from "react";
import { cn } from "@/lib/utils";

/** Semantic tone → token map. Single source of truth for HN accents. */
export const TONE_TEXT = {
  violet: "text-violet",
  cyan: "text-cyan",
  mint: "text-mint",
  amber: "text-amber",
  rose: "text-rose",
  sky: "text-sky",
} as const;
export const TONE_BG_SOFT = {
  violet: "bg-violet/10",
  cyan: "bg-cyan/10",
  mint: "bg-mint/10",
  amber: "bg-amber/10",
  rose: "bg-rose/10",
  sky: "bg-sky/10",
} as const;
export const TONE_RING = {
  violet: "ring-violet/30",
  cyan: "ring-cyan/30",
  mint: "ring-mint/30",
  amber: "ring-amber/30",
  rose: "ring-rose/30",
  sky: "ring-sky/30",
} as const;
export type Tone = keyof typeof TONE_TEXT;

export function GlassCard({
  className,
  children,
  strong,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? "hn-glass-strong" : "hn-glass",
        "rounded-2xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {action}
    </div>
  );
}

export function StatusDot({ tone = "mint" as Tone }: { tone?: Tone }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-2.5 w-2.5 items-center justify-center",
      )}
    >
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
          TONE_BG_SOFT[tone],
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          tone === "mint" && "bg-mint",
          tone === "violet" && "bg-violet",
          tone === "cyan" && "bg-cyan",
          tone === "amber" && "bg-amber",
          tone === "rose" && "bg-rose",
          tone === "sky" && "bg-sky",
        )}
      />
    </span>
  );
}

export function GlowIcon({
  icon: Icon,
  tone = "violet",
  size = "md",
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconSize =
    size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl ring-1",
        box,
        TONE_BG_SOFT[tone],
        TONE_RING[tone],
        className,
      )}
    >
      <Icon className={cn(iconSize, TONE_TEXT[tone])} />
      <span
        className={cn(
          "pointer-events-none absolute -inset-2 rounded-2xl blur-xl opacity-40",
          TONE_BG_SOFT[tone],
        )}
      />
    </div>
  );
}

export function EnergyLine({ className }: { className?: string }) {
  return <div className={cn("hn-energy-line", className)} />;
}
