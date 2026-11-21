// =============================================================
// /  Study Spaces: search + filters, stylised map linked to list,
// saved spaces and a detail dialog.
// =============================================================
import { useMemo, useRef, useState } from "react";
import { Search, Map as MapIcon, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chip, EmptyState, PageHeader } from "@/components/common/bits";
import { LondonMap } from "@/components/spaces/london-map";
import { SpaceCard, SpaceDetailDialog } from "@/components/spaces/space-card";
import { SPACES, spaceById } from "@/data/spaces";
import { UNIVERSITIES } from "@/data/universities";
import { applySpaceFilters, FLAG_LABELS, type FlagKey, type SpaceFilters } from "@/lib/space-filters";
import { usePageMeta } from "@/hooks/use-page-meta";
import { runAction, useStudy } from "@/store/study-store";
import { cn } from "@/lib/utils";

export default function SpacesPage() {
  usePageMeta("Study Spaces", "Find a desk in London: free, quiet, late-opening study spaces near UCL, King's, Imperial, LSE and Queen Mary. Illustrative demo data.");
  const { state, toggleSavedSpace } = useStudy();
  const [filters, setFilters] = useState<SpaceFilters>({ query: "", uni: "any", crowd: "any", flags: new Set() });
  const [selected, setSelected] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const results = useMemo(() => applySpaceFilters(SPACES, filters, state.savedSpaces), [filters, state.savedSpaces]);
  const dimmed = useMemo(() => new Set(SPACES.filter((s) => !results.includes(s)).map((s) => s.id)), [results]);

  const toggleFlag = (k: FlagKey) => setFilters((f) => { const n = new Set(f.flags); n.has(k) ? n.delete(k) : n.add(k); return { ...f, flags: n }; });
  const toggleSave = (id: string) => { const was = state.savedSpaces.includes(id); runAction(toggleSavedSpace(id), was ? "Removed from saved" : "Saved to your spaces"); };
  const selectFromMap = (id: string) => { setSelected(id); setMobileView("list"); setTimeout(() => cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" }), 60); };
  const clear = () => setFilters({ query: "", uni: "any", crowd: "any", flags: new Set() });

  return (
    <div>
      <PageHeader kicker="Study spaces / London" title={<>Find a desk.<br /><span className="text-primary">Then find your people.</span></>}>
        Nine real London venues with honest access notes. Hours and crowds are illustrative, nothing here is bookable.
      </PageHeader>

      {/* ---- Filters ---- */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input data-testid="input-search-spaces" className="pl-9 rounded-full bg-card" placeholder="Search by name, area or station" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
          </div>
          <Select value={filters.uni} onValueChange={(v) => setFilters({ ...filters, uni: v as SpaceFilters["uni"] })}>
            <SelectTrigger data-testid="select-uni" className="sm:w-48 rounded-full bg-card"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="any">Any university</SelectItem>{UNIVERSITIES.map((u) => <SelectItem key={u.id} value={u.id}>{u.short} students</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.crowd} onValueChange={(v) => setFilters({ ...filters, crowd: v as SpaceFilters["crowd"] })}>
            <SelectTrigger data-testid="select-crowd" className="sm:w-48 rounded-full bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any crowd level</SelectItem>
              <SelectItem value="usually calm">Usually calm</SelectItem>
              <SelectItem value="varies">Varies</SelectItem>
              <SelectItem value="often busy">Often busy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FLAG_LABELS.map((f) => <Chip key={f.key} testId={`chip-${f.key}`} active={filters.flags.has(f.key)} onClick={() => toggleFlag(f.key)}>{f.label}</Chip>)}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground" data-testid="text-result-count">{results.length} of {SPACES.length} spaces</p>
          <div className="md:hidden flex rounded-full border border-border bg-card p-0.5">
            {(["list", "map"] as const).map((v) => (
              <button key={v} data-testid={`button-view-${v}`} onClick={() => setMobileView(v)} className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold", mobileView === v && "bg-secondary text-secondary-foreground")}>
                {v === "list" ? <List className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}{v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- List + map ---- */}
      <div className="mx-auto mt-4 grid max-w-7xl gap-5 px-4 md:grid-cols-[minmax(0,420px)_1fr] md:px-6">
        <div className={cn("space-y-3", mobileView === "map" && "hidden md:block")}>
          {results.length === 0 ? (
            <EmptyState title="No stops on this line" body="Nothing matches all those filters. Try loosening one or two." action={<button data-testid="button-clear-filters" onClick={clear} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Clear filters</button>} />
          ) : results.map((s) => (
            <SpaceCard key={s.id} ref={(el) => { cardRefs.current[s.id] = el; }} space={s} selected={selected === s.id} saved={state.savedSpaces.includes(s.id)} onSelect={() => setSelected(s.id)} onToggleSave={() => toggleSave(s.id)} onOpen={() => setDetailId(s.id)} />
          ))}
        </div>
        <div className={cn("md:sticky md:top-20 h-[60dvh] md:h-[calc(100dvh-7rem)] overflow-hidden rounded-3xl border border-border paper-shadow", mobileView === "list" && "hidden md:block")}>
          <LondonMap spaces={SPACES} dimmedIds={dimmed} selectedId={selected} savedIds={state.savedSpaces} onSelect={selectFromMap} />
        </div>
      </div>

      <SpaceDetailDialog space={detailId ? spaceById(detailId) ?? null : null} open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)} saved={!!detailId && state.savedSpaces.includes(detailId)} onToggleSave={() => detailId && toggleSave(detailId)} />
    </div>
  );
}
