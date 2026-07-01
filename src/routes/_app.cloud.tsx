import { createFileRoute } from "@tanstack/react-router";
import { Cloud } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/cloud")({
  head: () => ({ meta: [{ title: "Cloud · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 3 — Digital Architecture"
      title="HN Cloud"
      description="Storage, compute, edge functions and secrets — the runtime foundation for every HN application."
      icon={Cloud}
      tone="amber"
      bullets={[
        "Storage buckets & assets",
        "Edge functions & server APIs",
        "Secrets & environment management",
        "Deployment channels",
        "Observability & logs",
        "Cost dashboards",
      ]}
    />
  ),
});
