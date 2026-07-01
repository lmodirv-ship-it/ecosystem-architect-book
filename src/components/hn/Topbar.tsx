import { Bell, Globe, LogOut, Menu, Moon, Search, Sparkles, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, signOut } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";

export function HNTopbar() {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName =
    (user?.user_metadata as { display_name?: string } | undefined)?.display_name ||
    user?.email?.split("@")[0] ||
    "HN";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/auth" });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
      <button className="flex h-10 w-10 items-center justify-center rounded-xl hn-glass text-muted-foreground hover:text-foreground">
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search in HN Platform…"
          className="h-10 w-full rounded-xl hn-glass pl-11 pr-16 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <IconBtn><Sparkles className="h-4 w-4 text-violet" /></IconBtn>
        <IconBtn badge="3"><Bell className="h-4 w-4" /></IconBtn>
        <IconBtn><Globe className="h-4 w-4" /></IconBtn>
        <IconBtn><Moon className="h-4 w-4" /></IconBtn>

        <div className="relative ml-1" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-sky text-xs font-semibold text-primary-foreground ring-2 ring-violet/40 transition hover:ring-violet"
            title={displayName}
          >
            {initials}
            <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-violet/30 blur-lg opacity-70" />
          </button>
          {open && (
            <div
              className="absolute end-0 top-12 z-50 w-64 overflow-hidden rounded-2xl hn-glass-strong ring-1 ring-white/10 shadow-xl"
              dir="rtl"
            >
              <div className="border-b border-white/10 p-4">
                <div className="text-sm font-semibold text-foreground">{displayName}</div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email}</div>
                {isAdmin && (
                  <span className="mt-2 inline-flex rounded-full bg-violet/20 px-2 py-0.5 text-[10px] font-semibold text-violet ring-1 ring-violet/40">
                    مسؤول
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/foundation/bible" });
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-white/5"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" /> الملف الشخصي
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm text-rose hover:bg-rose/10"
              >
                <LogOut className="h-4 w-4" /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl hn-glass text-muted-foreground transition-colors hover:text-foreground">
      {children}
      {badge && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}
