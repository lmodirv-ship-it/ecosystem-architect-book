import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 6 — Data Architecture · Analytics"
      title="Analytics"
      description="Signals about people, projects, agents and infrastructure — turned into decisions."
      icon={BarChart3}
      tone="cyan"
      bullets={[
        "Product & usage analytics",
        "Agent performance",
        "Infrastructure metrics",
        "Cohort & funnel analysis",
        "Reports & exports",
        "Experiment tracking",
      ]}
    />
  ),
});
