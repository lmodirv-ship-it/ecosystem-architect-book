import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Rocket } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon, StatusDot } from "@/components/hn/primitives";
import { HN_BUILDER_BY_SLUG, HN_BUILDERS } from "@/lib/hn/builders";
import { CreateProjectDialog } from "@/components/hn/CreateProjectDialog";

export const Route = createFileRoute("/_app/builders/$builder")({
  loader: ({ params }) => {
    if (!HN_BUILDER_BY_SLUG[params.builder]) throw notFound();
    return { slug: params.builder };
  },
  head: ({ params }) => {
    const b = HN_BUILDER_BY_SLUG[params.builder];
    return {
      meta: [
        { title: `${b?.name ?? "Builder"} · HN Platform` },
        { name: "description", content: b?.description ?? "HN Builder" },
      ],
    };
  },
  notFoundComponent: () => (
    <GlassCard className="p-10 text-center text-sm text-muted-foreground">
      Builder not found. <Link to="/builders" className="text-violet">Back to Builders</Link>
    </GlassCard>
  ),
  errorComponent: ({ error }) => (
    <GlassCard className="p-10 text-center text-sm text-rose">
      {String(error)}
    </GlassCard>
  ),
  component: BuilderPage,
});

function BuilderPage() {
  const { slug } = Route.useLoaderData();
  const b = HN_BUILDER_BY_SLUG[slug];
  if (!b) return null;
  return (
    <div className="space-y-6">
      <Link
        to="/builders"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All Builders
      </Link>

      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <GlowIcon icon={b.icon} tone={b.tone} size="lg" />
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <StatusDot tone={b.tone} /> HN Builder
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl text-foreground">
                {b.emoji} {b.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground" dir="rtl">
                {b.arabic} — {b.description}
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet to-sky px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-violet/30 hover:brightness-110">
            <Rocket className="h-4 w-4" /> Launch Builder
          </button>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard className="p-5 md:p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Capabilities</h2>
          <EnergyLine className="my-4" />
          <ul className="grid gap-2 sm:grid-cols-2">
            {b.items.map((it: string) => (
              <li
                key={it}
                className="flex items-center gap-2 rounded-lg hn-glass px-3 py-2 text-sm text-foreground/90"
              >
                <Check className="h-3.5 w-3.5 text-mint" />
                {it}
              </li>
            ))}
          </ul>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Related Builders</h3>
            <EnergyLine className="my-3" />
            <ul className="space-y-2">
              {HN_BUILDERS.filter((x) => x.slug !== b.slug)
                .slice(0, 5)
                .map((x) => (
                  <li key={x.slug}>
                    <Link
                      to="/builders/$builder"
                      params={{ builder: x.slug }}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground/85 hover:bg-white/5 hover:text-foreground"
                    >
                      <span>{x.emoji}</span>
                      <span className="truncate">{x.name}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
