import { Bell, Globe, Menu, Moon, Search, Sparkles } from "lucide-react";

export function HNTopbar() {
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
        <IconBtn>
          <Sparkles className="h-4 w-4 text-violet" />
        </IconBtn>
        <IconBtn badge="3">
          <Bell className="h-4 w-4" />
        </IconBtn>
        <IconBtn>
          <Globe className="h-4 w-4" />
        </IconBtn>
        <IconBtn>
          <Moon className="h-4 w-4" />
        </IconBtn>
        <div className="relative ml-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-sky text-xs font-semibold text-primary-foreground ring-2 ring-violet/40">
            HN
          </div>
          <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-violet/30 blur-lg opacity-70" />
        </div>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: string;
}) {
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
