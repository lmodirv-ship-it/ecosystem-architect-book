import {
  LayoutDashboard,
  Blocks,
  BrainCircuit,
  FolderKanban,
  Database,
  Cloud,
  Workflow,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Landmark,
  Settings,
  Layers,
  Sparkles,
} from "lucide-react";

export type HNNavItem = {
  title: string;
  to: string;
  icon: typeof LayoutDashboard;
};

export const HN_NAV: HNNavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "HN Core", to: "/core", icon: Sparkles },
  { title: "Builders", to: "/builders", icon: Layers },
  { title: "Applications", to: "/applications", icon: Blocks },
  { title: "AI Center", to: "/ai-center", icon: BrainCircuit },
  { title: "Projects", to: "/projects", icon: FolderKanban },
  { title: "Database", to: "/database", icon: Database },
  { title: "Cloud", to: "/cloud", icon: Cloud },
  { title: "Automation", to: "/automation", icon: Workflow },
  { title: "Analytics", to: "/analytics", icon: BarChart3 },
  { title: "Security", to: "/security", icon: ShieldCheck },
  { title: "Nawat (Memory)", to: "/nawat", icon: BookOpen },
  { title: "Foundation", to: "/foundation", icon: Landmark },
  { title: "Settings", to: "/settings", icon: Settings },
];
