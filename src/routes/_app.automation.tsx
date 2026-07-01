import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/automation")({
  head: () => ({ meta: [{ title: "Automation · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 10 — Automation"
      title="Automation"
      description="Every scheduled, event-driven and AI-triggered workflow that keeps the HN Platform running."
      icon={Workflow}
      tone="cyan"
      bullets={[
        "Deployment pipelines",
        "Backups & scheduled jobs",
        "Monitoring & alerting",
        "Testing & security scans",
        "Update propagation",
        "AI-driven tasks & workers",
      ]}
    />
  ),
});
