// =============================================================
// Small shared building blocks: PageHeader, EmptyState, UniBadge,
// ProfileNudge, Initials, FieldError.
// =============================================================
import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { uniById } from "@/data/universities";
import { cn } from "@/lib/utils";

export function PageHeader({ kicker, title, children, action }: { kicker: string; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-12 pb-6 rise">
      <p className="font-mono-label text-primary">{kicker}</p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[0.95]">{title}</h1>
          {children && <p className="mt-3 max-w-2xl text-muted-foreground text-base md:text-lg">{children}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action, testId }: { title: string; body: string; action?: ReactNode; testId?: string }) {
  return (
    <div data-testid={testId ?? "empty-state"} className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <svg viewBox="0 0 120 40" className="mx-auto mb-4 h-10 w-32" aria-hidden>
        <line x1="4" y1="20" x2="116" y2="20" stroke="hsl(var(--border))" strokeWidth="6" strokeLinecap="round" />
        <circle cx="30" cy="20" r="7" fill="hsl(var(--card))" stroke="hsl(var(--secondary))" strokeWidth="3" />
        <circle cx="60" cy="20" r="7" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="3" />
        <circle cx="90" cy="20" r="7" fill="hsl(var(--card))" stroke="hsl(var(--secondary))" strokeWidth="3" strokeDasharray="3 3" />
      </svg>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function UniBadge({ uni, className }: { uni: string; className?: string }) {
  const u = uniById(uni);
  const label = u ? u.short : "Mixed unis";
  const color = u ? u.color : "hsl(var(--secondary))";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2 py-0.5 text-xs font-semibold", className)}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function Initials({ name, color, className }: { name: string; color?: string; className?: string }) {
  const init = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full font-display font-bold text-sm text-white", className)} style={{ background: color ?? "hsl(var(--secondary))" }}>
      {init}
    </span>
  );
}

export function ProfileNudge({ text }: { text: string }) {
  return (
    <Link href="/join" data-testid="link-nudge-join" className="group flex items-center justify-between gap-3 rounded-2xl bg-secondary px-5 py-4 text-secondary-foreground transition-transform hover:-translate-y-0.5">
      <span className="text-sm">
        <span className="font-bold">Browsing as a guest.</span> {text}
      </span>
      <span className="flex items-center gap-1 text-sm font-bold text-accent whitespace-nowrap">
        Join the demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-medium text-destructive">{msg}</p>;
}

export function Chip({ active, onClick, children, testId }: { active: boolean; onClick: () => void; children: ReactNode; testId?: string }) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95",
        active ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-card text-foreground hover:border-secondary/60",
      )}
    >
      {children}
    </button>
  );
}
