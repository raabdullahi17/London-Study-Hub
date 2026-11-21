// =============================================================
// LondonMap: a hand-drawn, stylised SVG of central London.
// No tiles or API keys. `project()` converts lat/lon into SVG
// coordinates so relative geography stays roughly accurate.
// =============================================================
import type { Space } from "@/store/types";
import { uniById } from "@/data/universities";

const W = 800;
const H = 500;
const BOUNDS = { west: -0.2, east: 0.0, north: 51.54, south: 51.478 };

/** lat/lon -> x/y in the SVG viewBox. */
export function project(lat: number, lon: number) {
  const x = ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
  return { x, y };
}

// Approximate Thames path (west to east).
const THAMES: [number, number][] = [
  [51.4835, -0.2], [51.4845, -0.18], [51.4815, -0.16], [51.4845, -0.14], [51.4875, -0.125],
  [51.4965, -0.1235], [51.5045, -0.1215], [51.5085, -0.114], [51.5095, -0.1], [51.5075, -0.087],
  [51.5055, -0.075], [51.5035, -0.058], [51.507, -0.038], [51.502, -0.024], [51.49, -0.02], [51.4885, -0.008], [51.5, 0.0],
];

const STATIONS = [
  { name: "King's Cross", lat: 51.5308, lon: -0.1238 },
  { name: "Euston Sq", lat: 51.5257, lon: -0.1359 },
  { name: "Holborn", lat: 51.5174, lon: -0.12 },
  { name: "Barbican", lat: 51.5204, lon: -0.0979 },
  { name: "Liverpool St", lat: 51.5178, lon: -0.0823 },
  { name: "Whitechapel", lat: 51.5195, lon: -0.0596 },
  { name: "Mile End", lat: 51.5251, lon: -0.0332 },
  { name: "South Ken", lat: 51.4941, lon: -0.1738 },
  { name: "Waterloo", lat: 51.5031, lon: -0.1132 },
];

const LABELS = [
  { t: "BLOOMSBURY", lat: 51.5225, lon: -0.122 },
  { t: "THE CITY", lat: 51.5135, lon: -0.09 },
  { t: "SOUTH KENSINGTON", lat: 51.5015, lon: -0.172 },
  { t: "EAST END", lat: 51.5155, lon: -0.045 },
  { t: "SOUTHWARK", lat: 51.4985, lon: -0.095 },
];

function pathFrom(points: [number, number][]) {
  return points.map(([la, lo], i) => {
    const { x, y } = project(la, lo);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

interface Props {
  spaces: Space[];
  dimmedIds: Set<string>;
  selectedId: string | null;
  savedIds: string[];
  onSelect: (id: string) => void;
}

export function LondonMap({ spaces, dimmedIds, selectedId, savedIds, onSelect }: Props) {
  const thames = pathFrom(THAMES);
  // A stylised "line" linking stations east-west, tube-diagram style.
  const line = pathFrom([[51.4941, -0.1738], [51.5257, -0.1359], [51.5308, -0.1238], [51.5174, -0.12], [51.5204, -0.0979], [51.5178, -0.0823], [51.5195, -0.0596], [51.5251, -0.0332]]);
  const hydePark = project(51.5073, -0.1657);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full select-none" role="img" aria-label="Stylised map of central London with study space pins">
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="hsl(36 22% 86%)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="hsl(42 55% 96%)" />
      <rect width={W} height={H} fill="url(#grid)" />

      {/* Parks */}
      <ellipse cx={hydePark.x} cy={hydePark.y} rx="70" ry="30" fill="hsl(150 30% 82%)" transform={`rotate(-8 ${hydePark.x} ${hydePark.y})`} />
      <text x={hydePark.x} y={hydePark.y + 4} textAnchor="middle" className="fill-[hsl(150_30%_34%)]" style={{ font: "600 10px 'JetBrains Mono'", letterSpacing: 2 }}>HYDE PARK</text>
      <ellipse {...(() => { const p = project(51.5275, -0.153); return { cx: p.x, cy: p.y }; })()} rx="38" ry="26" fill="hsl(150 30% 84%)" />

      {/* Thames */}
      <path d={thames} fill="none" stroke="hsl(198 45% 78%)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      <path d={thames} fill="none" stroke="hsl(198 50% 86%)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stylised transit line */}
      <path d={line} fill="none" stroke="hsl(var(--secondary))" strokeOpacity="0.16" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />

      {LABELS.map((l) => {
        const p = project(l.lat, l.lon);
        return <text key={l.t} x={p.x} y={p.y} textAnchor="middle" fill="hsl(228 20% 60%)" style={{ font: "600 11px 'JetBrains Mono'", letterSpacing: 3 }}>{l.t}</text>;
      })}

      {STATIONS.map((s) => {
        const p = project(s.lat, s.lon);
        return (
          <g key={s.name}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="hsl(var(--card))" stroke="hsl(var(--secondary))" strokeWidth="2" />
            <text x={p.x + 7} y={p.y + 14} fill="hsl(228 30% 35%)" style={{ font: "500 10px Figtree" }}>{s.name}</text>
          </g>
        );
      })}

      {/* Pins */}
      {spaces.map((s) => {
        const p = project(s.lat, s.lon);
        const sel = s.id === selectedId;
        const dim = dimmedIds.has(s.id);
        const color = s.uni === "all" ? "hsl(var(--primary))" : uniById(s.uni)?.color ?? "hsl(var(--primary))";
        return (
          <g
            key={s.id}
            data-testid={`pin-space-${s.id}`}
            role="button"
            tabIndex={0}
            aria-label={`${s.name}${sel ? ", selected" : ""}`}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(s.id); } }}
            className="cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100"
            style={{ opacity: dim ? 0.25 : 1, transition: "opacity .3s" }}
          >
            {sel && <circle cx={p.x} cy={p.y} r="12" fill={color} className="pin-pulse" />}
            <circle className="ring opacity-0" cx={p.x} cy={p.y} r="17" fill="none" stroke="hsl(var(--ring))" strokeWidth="2" />
            <g style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${sel ? 1.25 : 1})`, transition: "transform .25s cubic-bezier(.2,.8,.2,1)" }}>
              <path d="M0 0 L-9 -14 A11 11 0 1 1 9 -14 Z" fill={color} stroke="hsl(var(--card))" strokeWidth="2" />
              <circle cx="0" cy="-19" r="4" fill={savedIds.includes(s.id) ? "hsl(var(--accent))" : "hsl(var(--card))"} />
            </g>
            {sel && (
              <g>
                <rect x={p.x - 2} y={p.y - 58} width={s.name.length * 6.6 + 16} height="22" rx="11" fill="hsl(var(--secondary))" />
                <text x={p.x + 6} y={p.y - 43} fill="hsl(var(--secondary-foreground))" style={{ font: "700 11px Figtree" }}>{s.name}</text>
              </g>
            )}
          </g>
        );
      })}

      <text x={W - 12} y={H - 12} textAnchor="end" fill="hsl(228 15% 55%)" style={{ font: "500 9px 'JetBrains Mono'", letterSpacing: 1 }}>STYLISED, NOT TO SCALE</text>
    </svg>
  );
}
