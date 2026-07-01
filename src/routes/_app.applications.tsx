import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Globe, Search, Layers } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon } from "@/components/hn/primitives";
import {
  HN_CATEGORY_META,
  HN_DOMAIN_GROUPS,
  HN_ECOSYSTEM_STATS,
  type HNDomainGroup,
  type HNPropertyCategory,
} from "@/lib/hn/ecosystem";

export const Route = createFileRoute("/_app/applications")({
  head: () => ({
    meta: [
      { title: "Applications · HN Platform" },
      {
        name: "description",
        content:
          "The full HN Ecosystem — every domain, subdomain, and application under HN Groupe, unified as one operating system.",
      },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<HNPropertyCategory | "all">("all");

  const categories = useMemo(() => {
    const set = new Set<HNPropertyCategory>();
    HN_DOMAIN_GROUPS.forEach((g) => set.add(g.category));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return HN_DOMAIN_GROUPS.filter((g) => {
      if (cat !== "all" && g.category !== cat) return false;
      if (!query) return true;
      if (g.root.includes(query) || g.brand.toLowerCase().includes(query)) return true;
      return g.properties.some((p) => p.host.toLowerCase().includes(query));
    });
  }, [q, cat]);

  const shownProps = filtered.reduce((n, g) => n + g.properties.length, 0);

  return (
    <div className="space-y-6">
      <GlassCard strong className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <GlowIcon icon={Layers} tone="violet" size="lg" />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Chapter 05 — Applications
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
                HN Ecosystem Registry
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                منظومة HN الحيّة — كل نطاق ونطاق فرعي وتطبيق تحت مظلّة واحدة.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Live URLs" value={HN_ECOSYSTEM_STATS.totalUrls} />
            <Stat label="Unique" value={HN_ECOSYSTEM_STATS.uniqueProperties} />
            <Stat label="Domains" value={HN_ECOSYSTEM_STATS.rootDomains} />
            <Stat label="Categories" value={HN_ECOSYSTEM_STATS.categories} />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search domains, subdomains, brands…"
              className="h-10 w-full rounded-xl hn-glass pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-violet/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              All ({HN_DOMAIN_GROUPS.length})
            </Chip>
            {categories.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {HN_CATEGORY_META[c].label}
              </Chip>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {filtered.length} domain{filtered.length === 1 ? "" : "s"} · {shownProps} propert
          {shownProps === 1 ? "y" : "ies"}
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <DomainCard key={g.root} group={g} />
        ))}
        {filtered.length === 0 && (
          <GlassCard className="col-span-full p-10 text-center text-sm text-muted-foreground">
            No domains match “{q}”.
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl hn-glass px-3 py-2 text-center">
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs transition-all ${
        active
          ? "bg-violet/20 text-foreground ring-1 ring-violet/40"
          : "hn-glass text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

const TONE_CLASSES: Record<
  HNDomainGroup["color"],
  {
    glow: string;
    chipBg: string;
    chipText: string;
    chipRing: string;
    dot: string;
    dotShadow: string;
    text: string;
  }
> = {
  violet: {
    glow: "bg-violet/20",
    chipBg: "bg-violet/15",
    chipText: "text-violet",
    chipRing: "ring-violet/30",
    dot: "bg-violet",
    dotShadow: "shadow-violet/60",
    text: "text-violet",
  },
  cyan: {
    glow: "bg-cyan/20",
    chipBg: "bg-cyan/15",
    chipText: "text-cyan",
    chipRing: "ring-cyan/30",
    dot: "bg-cyan",
    dotShadow: "shadow-cyan/60",
    text: "text-cyan",
  },
  mint: {
    glow: "bg-mint/20",
    chipBg: "bg-mint/15",
    chipText: "text-mint",
    chipRing: "ring-mint/30",
    dot: "bg-mint",
    dotShadow: "shadow-mint/60",
    text: "text-mint",
  },
  amber: {
    glow: "bg-amber/20",
    chipBg: "bg-amber/15",
    chipText: "text-amber",
    chipRing: "ring-amber/30",
    dot: "bg-amber",
    dotShadow: "shadow-amber/60",
    text: "text-amber",
  },
  rose: {
    glow: "bg-rose/20",
    chipBg: "bg-rose/15",
    chipText: "text-rose",
    chipRing: "ring-rose/30",
    dot: "bg-rose",
    dotShadow: "shadow-rose/60",
    text: "text-rose",
  },
  sky: {
    glow: "bg-sky/20",
    chipBg: "bg-sky/15",
    chipText: "text-sky",
    chipRing: "ring-sky/30",
    dot: "bg-sky",
    dotShadow: "shadow-sky/60",
    text: "text-sky",
  },
};

function DomainCard({ group }: { group: HNDomainGroup }) {
  const meta = HN_CATEGORY_META[group.category];
  const tone = group.color;
  const t = TONE_CLASSES[tone];
  return (
    <GlassCard className="group relative overflow-hidden p-5">
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${t.glow}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <GlowIcon icon={Globe} tone={tone} size="md" />
          <div>
            <div className="font-display text-sm font-semibold text-foreground">
              {group.brand}
            </div>
            <div className="text-xs font-mono text-muted-foreground">{group.root}</div>
          </div>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] uppercase tracking-widest ring-1 ${t.chipBg} ${t.chipText} ${t.chipRing}`}
        >
          {meta.label}
        </span>
      </div>
      <EnergyLine className="my-3" />
      <div className="text-[11px] text-muted-foreground" dir="rtl">
        {meta.arabic}
      </div>
      <ul className="mt-3 space-y-1.5">
        {group.properties.map((p) => (
          <li key={p.url}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/85 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_6px] ${t.dot} ${t.dotShadow}`}
                />
                <span className="truncate font-mono">
                  {p.subdomain ? (
                    <>
                      <span className={t.text}>{p.subdomain}</span>
                      <span className="text-muted-foreground">.{group.root}</span>
                    </>
                  ) : (
                    <span className="text-foreground">{group.root}</span>
                  )}
                </span>
              </span>
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
        {group.properties.length} propert{group.properties.length === 1 ? "y" : "ies"}
      </div>
    </GlassCard>
  );
}
