import { createFileRoute } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/database")({
  head: () => ({ meta: [{ title: "Database · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 6 — Data Architecture"
      title="HN Database"
      description="Entities, relations, indexes, permissions and lifecycles for every data object in the HN Ecosystem."
      icon={Database}
      tone="mint"
      bullets={[
        "Entity catalog (Users, Projects, Applications, Agents…)",
        "Relations & indexes",
        "Row Level Security policies",
        "Migration history",
        "Backups & disaster recovery",
        "Query performance insights",
      ]}
    />
  ),
});
