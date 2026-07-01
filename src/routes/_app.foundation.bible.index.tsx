import { createFileRoute, Link } from "@tanstack/react-router";
import { EnergyLine, GlassCard } from "@/components/hn/primitives";
import { HN_BIBLE_CHAPTERS, HN_BIBLE_PREAMBLE, HN_BIBLE_RULES } from "@/lib/hn/bible";

export const Route = createFileRoute("/_app/foundation/bible/")({
  head: () => ({
    meta: [
      { title: "Architecture Bible · HN Foundation" },
      {
        name: "description",
        content:
          "HN Platform Architecture Bible v1.0 — the official architectural reference for the HN Digital Operating System.",
      },
    ],
  }),
  component: BiblePage,
});

function BiblePage() {
  return (
    <div className="space-y-6">
      <GlassCard strong className="p-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          HN Platform Architecture Bible
        </div>
        <div className="mt-1 font-display text-2xl font-bold text-foreground">
          Version 1.0 — The Digital Operating System of HN Ecosystem
        </div>
        <EnergyLine className="my-4" />
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {HN_BIBLE_PREAMBLE}
        </p>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="text-sm font-semibold text-foreground">
          Table of Contents
        </div>
        <EnergyLine className="my-4" />
        <ol className="grid gap-3 md:grid-cols-2">
          {HN_BIBLE_CHAPTERS.map((c) => (
            <li key={c.n}>
              <Link
                to="/foundation/bible/$chapter"
                params={{ chapter: c.slug }}
                className="block rounded-xl hn-glass p-4 transition hover:ring-1 hover:ring-violet/40"
              >
                <div className="text-[11px] font-mono text-violet">
                  Chapter {c.n}
                </div>
                <div className="font-display text-sm font-semibold text-foreground">
                  {c.title}{" "}
                  <span className="text-muted-foreground">
                    · {c.arabicTitle}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {c.summary}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="text-sm font-semibold text-foreground">
          Execution Rules (قواعد التنفيذ)
        </div>
        <EnergyLine className="my-4" />
        <ul className="space-y-2 text-sm text-foreground/90">
          {HN_BIBLE_RULES.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_6px] shadow-violet/70" />
              {r}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
