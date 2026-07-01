import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BrainCircuit, Send, Sparkles, Workflow } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon, StatusDot } from "@/components/hn/primitives";
import { HN_BUILDERS, hnCoreRoute } from "@/lib/hn/builders";

export const Route = createFileRoute("/_app/core")({
  head: () => ({
    meta: [
      { title: "HN Core · HN Platform" },
      {
        name: "description",
        content:
          "HN Core — the central brain of the HN Platform. Every request is analyzed and dispatched to the right builders.",
      },
    ],
  }),
  component: HNCorePage,
});

const EXAMPLES = [
  "أريد بناء متجر إلكتروني مع تطبيق جوّال ونظام ولاء",
  "Build a SaaS landing page + database + AI chatbot for support",
  "أنشئ فيديو تعريفي لموقعي مع شعار جديد وحملة تسويقيّة",
  "Deploy the project with a custom domain, SSL and daily backups",
];

function HNCorePage() {
  const [prompt, setPrompt] = useState(EXAMPLES[0]);
  const [submitted, setSubmitted] = useState(EXAMPLES[0]);

  const routed = useMemo(() => hnCoreRoute(submitted), [submitted]);

  return (
    <div className="space-y-6">
      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <StatusDot tone="violet" /> Central Brain
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">
            <span className="text-foreground">HN </span>
            <span className="hn-gradient-text">Core</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base" dir="rtl">
            كل طلب يمرّ عبر HN Core أوّلاً. يحلّله، يقرّر ما يحتاج، ثم يوزّع العمل تلقائياً
            على المنشئات المناسبة ويجمع النتائج في مشروع واحد متكامل.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-2xl hn-glass px-4 py-3">
            <BrainCircuit className="h-5 w-5 text-violet" />
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSubmitted(prompt);
              }}
              placeholder="Describe what you want to build…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setSubmitted(prompt)}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet to-sky px-3 text-sm text-primary-foreground hover:brightness-110"
            >
              <Send className="h-3.5 w-3.5" /> Dispatch
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setPrompt(ex);
                  setSubmitted(ex);
                }}
                className="rounded-lg hn-glass px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-cyan" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Dispatch Plan
          </h2>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {routed.length} builder{routed.length === 1 ? "" : "s"} engaged
          </span>
        </div>
        <EnergyLine className="my-4" />
        <ol className="space-y-3">
          {routed.map((b, i) => (
            <li key={b.slug}>
              <Link
                to="/builders/$builder"
                params={{ builder: b.slug }}
                className="group flex items-center gap-4 rounded-2xl hn-glass p-4 transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-violet/40"
              >
                <div className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <GlowIcon icon={b.icon} tone={b.tone} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-semibold text-foreground">
                    {b.emoji} {b.name}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {b.tagline}
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-violet opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ol>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-foreground">All Available Builders</h3>
        <EnergyLine className="my-3" />
        <div className="flex flex-wrap gap-2">
          {HN_BUILDERS.map((b) => (
            <Link
              key={b.slug}
              to="/builders/$builder"
              params={{ builder: b.slug }}
              className="rounded-lg hn-glass px-3 py-1.5 text-xs text-foreground/85 hover:text-foreground"
            >
              {b.emoji} {b.name}
            </Link>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
