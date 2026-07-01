import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Landmark, BookMarked } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon } from "@/components/hn/primitives";

export const Route = createFileRoute("/_app/foundation")({
  head: () => ({
    meta: [
      { title: "Foundation · HN Platform" },
      {
        name: "description",
        content:
          "HN Foundation — principles, governance and the Architecture Bible that guide every HN decision.",
      },
    ],
  }),
  component: FoundationLayout,
});

function FoundationLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const onIndex = pathname === "/foundation";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard strong className="relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/25 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <GlowIcon icon={Landmark} tone="amber" size="lg" />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              HN Foundation
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
              Principles, Governance & the Architecture Bible
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              The official reference every human and every AI agent must read
              before touching HN Platform.
            </p>
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <TabLink to="/foundation" active={onIndex}>
            Overview
          </TabLink>
          <TabLink
            to="/foundation/bible"
            active={pathname.startsWith("/foundation/bible")}
          >
            <BookMarked className="mr-1.5 inline h-3.5 w-3.5" /> Architecture Bible
          </TabLink>
        </div>
      </GlassCard>

      {onIndex ? <FoundationIndex /> : <Outlet />}
    </div>
  );
}

function TabLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={
        "rounded-lg px-3 py-1.5 text-xs transition-all " +
        (active
          ? "bg-violet/20 text-foreground ring-1 ring-violet/30"
          : "hn-glass text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}

function FoundationIndex() {
  const pillars = [
    { title: "Philosophy", body: "Why HN Platform exists and what problem it solves." },
    { title: "Digital Ecosystem", body: "How Foundation, Nawat, AI and Platform connect." },
    { title: "Design Language", body: "Glass, lighting, motion, typography, dark & light." },
    { title: "Governance", body: "How decisions, features and updates are approved." },
    { title: "Evolution", body: "How the platform grows without breaking itself." },
  ];
  return (
    <GlassCard className="p-6">
      <div className="text-sm font-semibold text-foreground">
        Foundation Pillars
      </div>
      <EnergyLine className="my-4" />
      <div className="grid gap-3 md:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-xl hn-glass p-4">
            <div className="font-display text-sm font-semibold text-foreground">
              {p.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{p.body}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
