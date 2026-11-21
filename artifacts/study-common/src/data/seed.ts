// =============================================================
// Seed groups and sessions. Dates are computed relative to today
// so the demo never looks stale.
// =============================================================
import type { AppState, Group, Session } from "@/store/types";

/** yyyy-mm-dd for today + n days, in local time. */
export function dayOffset(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const SEED_GROUPS: Group[] = [
  { id: "g-algos", name: "Algorithms Without Tears", uni: "mixed", topic: "Computer Science", description: "Weekly problem sets, talked through slowly. Beginners very welcome.", spaceId: "british-library", schedule: "Wednesdays, 17:00", capacity: 6, members: ["p-sofia", "p-zainab", "p-tomasz"], ownerId: "p-sofia", contact: "Discord server: algos-sample (fictional)", createdAt: "2025-01-10" },
  { id: "g-law", name: "Contract Law Crammers", uni: "kcl", topic: "Law", description: "Case summaries and quizzing each other before seminars.", spaceId: "maughan", schedule: "Mondays, 14:00", capacity: 5, members: ["p-daniel", "p-amara"], ownerId: "p-daniel", contact: "law-crammers@example.com", createdAt: "2025-01-12" },
  { id: "g-east", name: "East London Commuter Desk", uni: "mixed", topic: "Any subject", description: "For anyone coming in on the District or Elizabeth line. Quiet work, shared lunch.", spaceId: "idea-store", schedule: "Tuesdays and Thursdays, 10:00", capacity: 6, members: ["p-kwame", "p-chloe", "p-zainab", "p-felix", "p-amara", "p-ravi"], ownerId: "p-kwame", contact: "WhatsApp group link: example.com/east-desk (fictional)", createdAt: "2025-01-08" },
  { id: "g-econ", name: "Econometrics Accountability", uni: "lse", topic: "Economics", description: "Pomodoro pairs. Show up, set a goal, report back in 50 minutes.", spaceId: "barbican-library", schedule: "Fridays, 11:00", capacity: 4, members: ["p-felix"], ownerId: "p-felix", contact: "felix.sample@example.com", createdAt: "2025-01-15" },
  { id: "g-studio", name: "Studio Sketch Mornings", uni: "ucl", topic: "Architecture", description: "Bring a sketchbook. We draw for an hour, then crit gently.", spaceId: "wellcome", schedule: "Saturdays, 10:30", capacity: 6, members: ["p-mei", "p-ravi"], ownerId: "p-mei", contact: "studio-sketch@example.com", createdAt: "2025-01-18" },
];

function seedSessions(): Session[] {
  return [
    { id: "s-1", title: "Quiet morning focus block", spaceId: "barbican-library", date: dayOffset(1), start: "09:30", end: "12:00", hostId: "p-felix", attendees: ["p-felix", "p-chloe"], capacity: 6, note: "Phones face down. Coffee after." },
    { id: "s-2", title: "CS lab write-up drop-in", spaceId: "british-library", date: dayOffset(2), start: "14:00", end: "17:00", hostId: "p-sofia", attendees: ["p-sofia"], capacity: 5, note: "Meet by the cafe tables, ground floor." },
    { id: "s-3", title: "Commuter coffee and revision", spaceId: "idea-store", date: dayOffset(3), start: "10:00", end: "13:00", hostId: "p-kwame", attendees: ["p-kwame", "p-zainab", "p-amara"], capacity: 6, note: "Top floor. Look for the orange tote bag." },
    { id: "s-4", title: "Reading-only Sunday", spaceId: "wellcome", date: dayOffset(5), start: "11:00", end: "15:00", hostId: "p-mei", attendees: ["p-mei"], capacity: 4, note: "No laptops, just books." },
  ];
}

export function createInitialState(): AppState {
  return {
    version: 1,
    profile: null,
    savedSpaces: [],
    groups: SEED_GROUPS,
    sessions: seedSessions(),
    connections: {},
    blocked: [],
    reports: [],
  };
}
