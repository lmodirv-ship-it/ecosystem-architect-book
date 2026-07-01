import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HNSidebar } from "@/components/hn/Sidebar";
import { HNTopbar } from "@/components/hn/Topbar";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <HNSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HNTopbar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
          HN Platform v1.0.0 · © 2026 HN Groupe. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
