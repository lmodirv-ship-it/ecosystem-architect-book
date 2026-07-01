import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/nawat")({
  head: () => ({ meta: [{ title: "Nawat · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 13 — Knowledge"
      title="HN Nawat"
      description="The long-term memory of the HN Ecosystem. How knowledge is stored, linked, searched and evolved."
      icon={BookOpen}
      tone="sky"
      bullets={[
        "Knowledge graph & entities",
        "Documents & source of truth",
        "Semantic search & embeddings",
        "AI memory bridge",
        "Versioning of knowledge",
        "Access & governance",
      ]}
    />
  ),
});
