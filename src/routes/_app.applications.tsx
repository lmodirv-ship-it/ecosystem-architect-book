import { createFileRoute } from "@tanstack/react-router";
import { Blocks } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/applications")({
  head: () => ({ meta: [{ title: "Applications · HN Platform" }, { name: "description", content: "Every application inside the HN Ecosystem, orchestrated from HN Core." }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 5 — Applications"
      title="HN Applications"
      description="A unified registry of every HN application. Each app declares the data it consumes, the data it produces, and its relationships to the rest of the ecosystem."
      icon={Blocks}
      tone="sky"
      bullets={[
        "Application manifest & capabilities",
        "Data inputs / outputs contracts",
        "Inter-app event bus",
        "Independent, extensible modules",
        "Versioning & release channels",
        "Health & telemetry per app",
      ]}
    />
  ),
});
