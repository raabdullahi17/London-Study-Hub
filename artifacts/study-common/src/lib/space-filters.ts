// =============================================================
// Space filtering logic, separated from UI so it is easy to test
// and explain. `applySpaceFilters` is a pure function.
// =============================================================
import type { Crowd, Space, UniId } from "@/store/types";

export type FlagKey = "free" | "quiet" | "openLate" | "wifiPlugs" | "nearStation" | "groupFriendly" | "silent" | "desks" | "rooms" | "saved";

export interface SpaceFilters {
  query: string;
  uni: UniId | "any";
  crowd: Crowd | "any";
  flags: Set<FlagKey>;
}

export const FLAG_LABELS: { key: FlagKey; label: string }[] = [
  { key: "free", label: "Free" },
  { key: "quiet", label: "Quiet" },
  { key: "silent", label: "Silent" },
  { key: "groupFriendly", label: "Group-friendly" },
  { key: "openLate", label: "Open late" },
  { key: "wifiPlugs", label: "Wi-Fi + plugs" },
  { key: "nearStation", label: "Near station" },
  { key: "desks", label: "Desks" },
  { key: "rooms", label: "Rooms" },
  { key: "saved", label: "Saved" },
];

const FLAG_TEST: Record<FlagKey, (s: Space, saved: string[]) => boolean> = {
  free: (s) => s.free,
  quiet: (s) => s.noise !== "social",
  silent: (s) => s.noise === "silent",
  groupFriendly: (s) => s.groupFriendly,
  openLate: (s) => s.openLate,
  wifiPlugs: (s) => s.wifi && s.plugs,
  nearStation: (s) => s.station.mins <= 5,
  desks: (s) => s.desks,
  rooms: (s) => s.rooms,
  saved: (s, saved) => saved.includes(s.id),
};

export function applySpaceFilters(spaces: Space[], f: SpaceFilters, saved: string[]): Space[] {
  const q = f.query.trim().toLowerCase();
  return spaces.filter((s) => {
    if (q && !`${s.name} ${s.area} ${s.station.name} ${s.description}`.toLowerCase().includes(q)) return false;
    // "University" shows spaces that uni's students can use: their own + public.
    if (f.uni !== "any" && s.uni !== "all" && s.uni !== f.uni) return false;
    if (f.crowd !== "any" && s.crowd !== f.crowd) return false;
    for (const k of f.flags) if (!FLAG_TEST[k](s, saved)) return false;
    return true;
  });
}
