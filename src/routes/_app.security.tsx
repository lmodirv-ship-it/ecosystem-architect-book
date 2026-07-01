import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { HNPlaceholder } from "@/components/hn/Placeholder";

export const Route = createFileRoute("/_app/security")({
  head: () => ({ meta: [{ title: "Security · HN Platform" }] }),
  component: () => (
    <HNPlaceholder
      chapter="Chapter 11 — Security"
      title="Security"
      description="Identity, authorization, encryption, audit and incident response — designed in, not bolted on."
      icon={ShieldCheck}
      tone="cyan"
      bullets={[
        "Identity & authentication",
        "Roles & fine-grained authorization",
        "Encryption at rest & in transit",
        "Audit trail & logs",
        "Secrets rotation",
        "Disaster & incident response",
      ]}
    />
  ),
});
