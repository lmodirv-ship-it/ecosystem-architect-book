import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/ai-center")({
  head: () => ({ meta: [{ title: "AI Center · HN Platform" }, { name: "description", content: "HN AI — the reasoning layer of the HN Platform." }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 9 — Artificial Intelligence"
      title="AI Center"
      description="HN AI thinks, suggests, reviews, builds, writes, analyses, remembers and prevents errors — as a first-class citizen of the platform."
      icon={BrainCircuit}
      tone="violet"
      bullets={[
        "Agents catalog & orchestration",
        "Prompt Library (single source of truth)",
        "Model routing via Lovable AI Gateway",
        "Long-term memory bridge to HN Nawat",
        "Guardrails & evaluation loop",
        "Cost & usage telemetry",
      ]}
    />
  ),
});
