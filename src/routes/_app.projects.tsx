import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({ meta: [{ title: "Projects · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 6 — Data Architecture"
      title="Projects"
      description="Every initiative across the HN Ecosystem, with progress, owners, decisions and history."
      icon={FolderKanban}
      tone="sky"
      bullets={[
        "Project entity & lifecycle",
        "Ownership & permissions",
        "Milestones & releases",
        "Linked applications & agents",
        "Decisions log & rationale",
        "Archive & history",
      ]}
    />
  ),
});
