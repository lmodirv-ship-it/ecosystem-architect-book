import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon, StatusDot } from "@/components/hn/primitives";
import { HN_BUILDERS } from "@/lib/hn/builders";

export const Route = createFileRoute("/_app/builders/")({
  head: () => ({
    meta: [
      { title: "Builders · HN Platform" },
      {
        name: "description",
        content:
          "HN Builders — one operating system to create websites, apps, mobile, AI agents, media, databases, cloud deployments, designs and business tools.",
      },
    ],
  }),
  component: BuildersHub,
});

function BuildersHub() {
  return (
    <div className="space-y-6">
      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <GlowIcon icon={Layers} tone="violet" size="lg" />
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <StatusDot tone="violet" /> AI Digital Operating System
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">
                <span className="text-foreground">HN </span>
                <span className="hn-gradient-text">Builders</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base" dir="rtl">
                منصّة واحدة لبناء أي منتج رقمي — موقع، تطبيق، جوّال، وكيل ذكاء اصطناعي،
                ميديا، قاعدة بيانات، أو مشروع كامل يديره HN Core.
              </p>
            </div>
          </div>
          <Link
            to="/core"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet to-sky px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-violet/30 hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> Ask HN Core
          </Link>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {HN_BUILDERS.map((b) => (
          <Link
            key={b.slug}
            to="/builders/$builder"
            params={{ builder: b.slug }}
            className="group relative overflow-hidden rounded-2xl hn-glass p-5 transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-violet/40"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet/15 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <GlowIcon icon={b.icon} tone={b.tone} size="md" />
                <div>
                  <div className="font-display text-base font-semibold text-foreground">
                    {b.emoji} {b.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{b.tagline}</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <EnergyLine className="my-3" />
            <div className="text-[11px] text-muted-foreground" dir="rtl">
              {b.arabic}
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {b.items.slice(0, 4).map((it) => (
                <li
                  key={it}
                  className="rounded-md hn-glass px-2 py-0.5 text-[10px] text-foreground/80"
                >
                  {it}
                </li>
              ))}
              {b.items.length > 4 && (
                <li className="text-[10px] text-muted-foreground">
                  +{b.items.length - 4} more
                </li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
