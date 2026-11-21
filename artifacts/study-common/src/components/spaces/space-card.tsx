// =============================================================
// SpaceCard (list item) + SpaceDetailDialog (full details).
// =============================================================
import { forwardRef } from "react";
import { Bookmark, BookmarkCheck, Clock, Lock, TrainFront, Wifi, Plug, Users, Volume1, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UniBadge } from "@/components/common/bits";
import { ACCESS_LABEL } from "@/data/spaces";
import type { Space } from "@/store/types";
import { cn } from "@/lib/utils";

interface CardProps {
  space: Space;
  selected: boolean;
  saved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onOpen: () => void;
}

export const SpaceCard = forwardRef<HTMLDivElement, CardProps>(function SpaceCard({ space: s, selected, saved, onSelect, onToggleSave, onOpen }, ref) {
  return (
    <div
      ref={ref}
      data-testid={`card-space-${s.id}`}
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer rounded-2xl border bg-card p-4 transition-all duration-300",
        selected ? "border-secondary paper-shadow -translate-y-0.5" : "border-border hover:border-secondary/40",
      )}
    >
      {selected && <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary" />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <UniBadge uni={s.uni === "all" ? "" : s.uni} className={s.uni === "all" ? "hidden" : ""} />
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", s.access === "uni-only" ? "bg-muted text-muted-foreground" : "bg-accent/40 text-secondary")}>
              {s.access === "uni-only" && <Lock className="h-3 w-3" />}
              {ACCESS_LABEL[s.access]}
            </span>
          </div>
          <h3 className="mt-2 font-display text-lg font-bold leading-tight">{s.name}</h3>
          <p className="text-sm text-muted-foreground">{s.area}</p>
        </div>
        <button
          type="button"
          data-testid={`button-save-${s.id}`}
          aria-label={saved ? "Remove from saved" : "Save space"}
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all active:scale-90", saved ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary text-muted-foreground")}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><TrainFront className="h-3.5 w-3.5" />{s.station.name}, ~{s.station.mins} min</span>
        <span className="inline-flex items-center gap-1"><Volume1 className="h-3.5 w-3.5" />{s.noise}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{s.crowd} <em className="not-italic opacity-70">(illustrative)</em></span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {s.wifi && <Wifi className="h-4 w-4 text-secondary" aria-label="Wi-Fi" />}
          {s.plugs && <Plug className="h-4 w-4 text-secondary" aria-label="Plugs" />}
          {s.openLate && <Clock className="h-4 w-4 text-secondary" aria-label="Open late" />}
        </div>
        <button type="button" data-testid={`button-details-${s.id}`} onClick={(e) => { e.stopPropagation(); onOpen(); }} className="text-sm font-bold text-primary underline-offset-4 hover:underline">
          Details
        </button>
      </div>
    </div>
  );
});

export function SpaceDetailDialog({ space, open, onOpenChange, saved, onToggleSave }: { space: Space | null; open: boolean; onOpenChange: (o: boolean) => void; saved: boolean; onToggleSave: () => void }) {
  if (!space) return null;
  const s = space;
  const facts: [string, string][] = [
    ["Hours", s.hours],
    ["Crowd", `${s.crowd} (illustrative, not live)`],
    ["Noise", s.noise],
    ["Nearest station", `${s.station.name}, about ${s.station.mins} min walk`],
    ["Cost", s.free ? "Free" : "Paid"],
    ["Wi-Fi / plugs", `${s.wifi ? "Wi-Fi" : "No Wi-Fi"} / ${s.plugs ? "plugs" : "few plugs"}`],
    ["Good for", [s.desks && "desks", s.rooms && "rooms", s.groupFriendly ? "groups" : "solo"].filter(Boolean).join(", ")],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl" data-testid="dialog-space-detail">
        <DialogHeader>
          <p className="font-mono-label text-primary">{s.area}</p>
          <DialogTitle className="font-display text-3xl font-extrabold">{s.name}</DialogTitle>
          <DialogDescription>{s.description}</DialogDescription>
        </DialogHeader>
        <div className={cn("flex gap-2 rounded-xl p-3 text-sm", s.access === "uni-only" ? "bg-muted" : "bg-accent/30")}>
          <Lock className="h-4 w-4 mt-0.5 shrink-0" />
          <div><span className="font-bold">{ACCESS_LABEL[s.access]}.</span> {s.accessNote}</div>
        </div>
        <dl className="divide-y divide-border text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium capitalize-first">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm"><span className="font-bold">Local tip:</span> {s.tip}</p>
        <p className="flex gap-2 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />Hours and crowd levels are illustrative demo values. Study Common does not book desks or rooms; check the venue directly.</p>
        <Button data-testid="button-detail-save" onClick={onToggleSave} variant={saved ? "outline" : "default"} className="rounded-full">
          {saved ? "Saved, tap to remove" : "Save this space"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
