// =============================================================
// AppShell: header, persistent Demo label, desktop nav, mobile
// bottom nav, storage error banner and footer disclaimer.
// =============================================================
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { MapPinned, Users, UserRound, CalendarClock, CircleUserRound, AlertTriangle } from "lucide-react";
import { useStudy } from "@/store/study-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Spaces", icon: MapPinned },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/people", label: "People", icon: UserRound },
  { href: "/sessions", label: "Sessions", icon: CalendarClock },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

/** Roundel-ish logo mark: a ring with a bar, but a desk instead of a name. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" />
      <rect x="2" y="16" width="36" height="8" rx="2" fill="hsl(var(--secondary))" />
      <circle cx="20" cy="20" r="2.2" fill="hsl(var(--accent))" />
    </svg>
  );
}

export function DemoLabel({ className }: { className?: string }) {
  return (
    <span
      data-testid="label-demo"
      title="Local demo: sample data, saved only in this browser"
      className={cn("inline-flex items-center gap-1.5 rounded-full border-2 border-secondary bg-accent px-2.5 py-0.5 font-mono-label text-secondary", className)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
      Demo
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { state, storageError } = useStudy();
  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
          <Link href="/" data-testid="link-home" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="font-display text-xl font-extrabold">Study Common</span>
          </Link>
          <DemoLabel />
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {NAV.slice(0, 4).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`link-nav-${n.label.toLowerCase()}`}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  isActive(n.href) ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto md:ml-2 flex items-center gap-2">
            {state.profile ? (
              <Link href="/profile" data-testid="link-profile" className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-semibold hover:border-primary transition-colors">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {state.profile.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{state.profile.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link href="/join" data-testid="link-join" className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0">
                Join the demo
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ---- Storage error banner ---- */}
      {storageError && (
        <div role="alert" data-testid="status-storage-error" className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{storageError}</span>
          </div>
        </div>
      )}

      <main className="flex-1 pb-24 md:pb-10">{children}</main>

      {/* ---- Footer disclaimer ---- */}
      <footer className="hidden md:block border-t border-border py-6 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <p>Study Common is a hackathon demo. All people, contacts, hours and crowd levels are fictional or illustrative. Data stays in this browser.</p>
          <p className="font-mono-label">No accounts / No emails sent / No booking</p>
        </div>
      </footer>

      {/* ---- Mobile bottom nav ---- */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} href={n.href} data-testid={`link-mobile-${n.label.toLowerCase()}`} className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold">
                <n.icon className={cn("h-5 w-5 transition-transform", active ? "text-primary -translate-y-0.5" : "text-muted-foreground")} />
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
