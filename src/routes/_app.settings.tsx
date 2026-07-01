import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 12 — Governance"
      title="Settings"
      description="Workspace configuration, roles, integrations and platform-wide preferences."
      icon={Settings}
      tone="sky"
      bullets={[
        "Workspace & branding",
        "Members & roles",
        "Integrations",
        "Preferences & locale",
        "Billing & usage",
        "Danger zone",
      ]}
    />
  ),
});
