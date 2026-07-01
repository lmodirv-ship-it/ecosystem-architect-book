import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Send, Sparkles, BrainCircuit } from "lucide-react";
import { hnCoreRoute } from "@/lib/hn/builders";
import { GlassCard, GlowIcon } from "@/components/hn/primitives";

const SUGGESTIONS = [
  "أنشئ موقعًا جديدًا مع متجر إلكتروني",
  "Deploy my project with a custom domain and SSL",
  "أنشئ فيديو تعريفي مع شعار جديد",
  "Build an AI chatbot for customer support",
];

/** Natural-language command bar on the dashboard.
 *  Runs the same heuristic as HN Core to preview which builders will run. */
export function CommandBar() {
  const [q, setQ] = useState("");
  const routed = useMemo(() => (q.trim() ? hnCoreRoute(q) : []), [q]);

  return (
    <GlassCard strong className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-violet/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-16 h-52 w-52 rounded-full bg-cyan/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-violet" />
          Ask HN Core — build, deploy, analyze, or open anything.
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl hn-glass px-4 py-3 ring-1 ring-white/5 focus-within:ring-violet/40">
          <BrainCircuit className="h-5 w-5 shrink-0 text-violet" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="أنشئ موقعًا جديدًا…  ·  Deploy my SaaS  ·  افتح HN DB"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Link
            to="/core"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet to-sky px-3 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            <Send className="h-3.5 w-3.5" /> Dispatch
          </Link>
        </div>

        {routed.length > 0 ? (
          <div className="mt-4">
            <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              HN Core will engage
            </div>
            <div className="flex flex-wrap gap-2">
              {routed.map((b) => (
                <Link
                  key={b.slug}
                  to="/builders/$builder"
                  params={{ builder: b.slug }}
                  className="group flex items-center gap-2 rounded-xl hn-glass px-3 py-2 text-sm text-foreground/90 hover:text-foreground hover:ring-1 hover:ring-violet/40"
                >
                  <GlowIcon icon={b.icon} tone={b.tone} size="sm" />
                  <span>
                    {b.emoji} {b.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-lg hn-glass px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
