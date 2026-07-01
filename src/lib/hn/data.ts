/**
 * Single Source of Truth for HN Platform mock data.
 * Later swapped for Lovable Cloud queries (see Architecture Bible ch. 6).
 */
import {
  BrainCircuit,
  Box,
  Video,
  Database,
  Cloud,
  ShoppingBag,
  ShieldCheck,
  BookOpen,
  Columns3,
  LifeBuoy,
  LineChart,
  Plus,
} from "lucide-react";

export type HNApp = {
  id: string;
  name: string;
  tagline: string;
  icon: typeof BrainCircuit;
  tone: "violet" | "cyan" | "rose" | "mint" | "amber" | "sky";
  href: string;
};

export const HN_APPS: HNApp[] = [
  { id: "ai", name: "HN AI", tagline: "Artificial Intelligence", icon: BrainCircuit, tone: "violet", href: "/ai-center" },
  { id: "builder", name: "HN Builder", tagline: "No-Code Builder", icon: Box, tone: "sky", href: "/applications" },
  { id: "video", name: "HN Video", tagline: "Video Studio", icon: Video, tone: "rose", href: "/applications" },
  { id: "db", name: "HN DB", tagline: "Database System", icon: Database, tone: "mint", href: "/database" },
  { id: "cloud", name: "HN Cloud", tagline: "Cloud Services", icon: Cloud, tone: "amber", href: "/cloud" },
  { id: "store", name: "HN Store", tagline: "Digital Store", icon: ShoppingBag, tone: "violet", href: "/applications" },
  { id: "audit", name: "HN Audit", tagline: "Security Audit", icon: ShieldCheck, tone: "cyan", href: "/security" },
  { id: "nawat", name: "HN Nawat", tagline: "Memory System", icon: BookOpen, tone: "sky", href: "/nawat" },
  { id: "foundation", name: "HN Foundation", tagline: "Guidelines", icon: Columns3, tone: "amber", href: "/foundation" },
  { id: "support", name: "HN Support", tagline: "Support Center", icon: LifeBuoy, tone: "rose", href: "/applications" },
  { id: "analytics", name: "HN Analytics", tagline: "Analytics Center", icon: LineChart, tone: "cyan", href: "/analytics" },
  { id: "add", name: "Add New", tagline: "", icon: Plus, tone: "violet", href: "/applications" },
];

export const HN_STATS = {
  totalApps: 12,
  activeProjects: 24,
  aiAgents: 18,
  databases: 8,
  uptime: "99.99%",
};

export const HN_SYSTEM_STATUS = [
  { label: "HN Core", status: "Operational" as const },
  { label: "AI Engine", status: "Operational" as const },
  { label: "Database", status: "Operational" as const },
  { label: "Cloud Services", status: "Operational" as const },
  { label: "Security", status: "Operational" as const },
];

export const HN_RECENT_PROJECTS = [
  { name: "HN Platform v2.0", updated: "2h ago", progress: 75 },
  { name: "AI Agent System", updated: "5h ago", progress: 90 },
  { name: "Nawat Memory DB", updated: "1d ago", progress: 60 },
  { name: "HN Video Studio", updated: "2d ago", progress: 80 },
];

export const HN_SYSTEM_ACTIVITY = [
  { text: "AI Agent Alpha completed a task", time: "2 min ago", tone: "cyan" as const },
  { text: "Database backup completed", time: "15 min ago", tone: "sky" as const },
  { text: "New user registered", time: "1 hour ago", tone: "violet" as const },
  { text: "Security scan completed", time: "2 hours ago", tone: "amber" as const },
  { text: "Cloud deployment successful", time: "3 hours ago", tone: "mint" as const },
];

export const HN_STATISTICS = [
  { label: "Visitors", value: "24,589", delta: "+12.5%" },
  { label: "Tasks", value: "1,429", delta: "+8.3%" },
  { label: "Storage", value: "2.4 TB", delta: "+5.1%" },
  { label: "API Calls", value: "98,765", delta: "+15.7%" },
];
