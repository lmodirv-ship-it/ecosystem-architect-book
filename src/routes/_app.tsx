import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { HNSidebar } from "@/components/hn/Sidebar";
import { HNTopbar } from "@/components/hn/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppShell,
});

function AppShell() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      navigate({
        to: "/auth",
        search: { redirect: location.pathname + location.search },
      });
    }
  }, [loading, session, navigate, location.pathname, location.search]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-violet" />
      </div>
    );
  }

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
