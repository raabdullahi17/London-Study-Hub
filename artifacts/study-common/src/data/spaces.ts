// =============================================================
// Seed study spaces. Real London venues, but every hour, crowd
// level and amenity here is ILLUSTRATIVE for the demo. Always
// check the venue's own site. Nothing here can be booked.
// =============================================================
import type { Space } from "@/store/types";

export const SPACES: Space[] = [
  {
    id: "british-library", name: "British Library", area: "King's Cross / St Pancras", uni: "all",
    access: "reader-pass", accessNote: "Public areas and cafe tables are open to all. Reading Rooms need a free Reader Pass, registered in person with ID.",
    free: true, noise: "quiet", openLate: true, wifi: true, plugs: true, station: { name: "King's Cross St Pancras", mins: 3 },
    crowd: "often busy", groupFriendly: true, desks: true, rooms: false, hours: "Roughly 9:30 to 20:00 weekdays (illustrative)",
    description: "The big red-brick one. Open-plan tables near the cafes buzz with students; the Reading Rooms are proper hush.",
    tip: "Upper-floor tables tend to have more sockets than the ground floor.", lat: 51.5299, lon: -0.1277,
  },
  {
    id: "wellcome", name: "Wellcome Collection Reading Room", area: "Euston Road", uni: "all",
    access: "public", accessNote: "Free and open to the public, no pass needed. It is a gallery-library hybrid, so expect visitors.",
    free: true, noise: "quiet", openLate: false, wifi: true, plugs: false, station: { name: "Euston Square", mins: 2 },
    crowd: "varies", groupFriendly: false, desks: true, rooms: false, hours: "Roughly 10:00 to 18:00, closed Mondays (illustrative)",
    description: "Sofas, staircases and odd medical curiosities. Good for reading, less for laptop marathons.",
    tip: "Bring a charged battery; sockets are scarce.", lat: 51.5258, lon: -0.1339,
  },
  {
    id: "ucl-student-centre", name: "UCL Student Centre", area: "Bloomsbury", uni: "ucl",
    access: "uni-only", accessNote: "UCL card holders only. Students from other unis cannot enter.",
    free: true, noise: "social", openLate: true, wifi: true, plugs: true, station: { name: "Euston Square", mins: 4 },
    crowd: "often busy", groupFriendly: true, desks: true, rooms: true, hours: "Often 24 hours in term time (illustrative)",
    description: "Floors get quieter as you go up. Bookable group rooms exist through UCL's own system, not here.",
    tip: "Lower floors are chattier; head up for focus.", lat: 51.5246, lon: -0.1340,
  },
  {
    id: "maughan", name: "Maughan Library", area: "Chancery Lane", uni: "kcl",
    access: "uni-only", accessNote: "King's ID required at the gates.",
    free: true, noise: "silent", openLate: true, wifi: true, plugs: true, station: { name: "Chancery Lane", mins: 5 },
    crowd: "varies", groupFriendly: false, desks: true, rooms: true, hours: "Long hours in term, often late (illustrative)",
    description: "A Gothic former public records office with a round reading room straight out of a period drama.",
    tip: "The round reading room is the silent one. Respect it.", lat: 51.5155, lon: -0.1110,
  },
  {
    id: "lse-library", name: "LSE Library", area: "Holborn / Aldwych", uni: "lse",
    access: "uni-only", accessNote: "LSE students and staff; some external access by prior arrangement only.",
    free: true, noise: "quiet", openLate: true, wifi: true, plugs: true, station: { name: "Holborn", mins: 6 },
    crowd: "often busy", groupFriendly: true, desks: true, rooms: true, hours: "Long hours, extended in exam season (illustrative)",
    description: "That spiral ramp. Silent zones upstairs, group study lower down.",
    tip: "Exam season fills it by mid-morning.", lat: 51.5145, lon: -0.1165,
  },
  {
    id: "imperial-central", name: "Imperial Central Library", area: "South Kensington", uni: "imperial",
    access: "uni-only", accessNote: "Imperial card holders only.",
    free: true, noise: "quiet", openLate: true, wifi: true, plugs: true, station: { name: "South Kensington", mins: 7 },
    crowd: "varies", groupFriendly: true, desks: true, rooms: true, hours: "Often 24/7 in term (illustrative)",
    description: "Six floors of engineers. Group pods on lower levels, silence at the top.",
    tip: "Combine with a walk in Hyde Park between problem sets.", lat: 51.4988, lon: -0.1749,
  },
  {
    id: "barbican-library", name: "Barbican Library", area: "Barbican", uni: "all",
    access: "public", accessNote: "Free public library run by the City of London. Anyone can walk in.",
    free: true, noise: "quiet", openLate: false, wifi: true, plugs: true, station: { name: "Barbican", mins: 3 },
    crowd: "usually calm", groupFriendly: false, desks: true, rooms: false, hours: "Roughly 9:30 to 17:30, some later evenings (illustrative)",
    description: "Brutalist calm. A big music library and quiet desks overlooking concrete and greenery.",
    tip: "Walk the highwalks from Moorgate if it is raining less than usual.", lat: 51.5200, lon: -0.0935,
  },
  {
    id: "idea-store", name: "Idea Store Whitechapel", area: "Whitechapel", uni: "all",
    access: "public", accessNote: "Free public library, open to everyone.",
    free: true, noise: "social", openLate: true, wifi: true, plugs: true, station: { name: "Whitechapel", mins: 2 },
    crowd: "varies", groupFriendly: true, desks: true, rooms: false, hours: "Roughly 9:00 to 21:00 weekdays (illustrative)",
    description: "Glass-fronted and lively, with a cafe and city views. Handy for Queen Mary commuters on the District line.",
    tip: "Top floor has the best light and quieter tables.", lat: 51.5185, lon: -0.0617,
  },
  {
    id: "qm-library", name: "Queen Mary Mile End Library", area: "Mile End", uni: "qmul",
    access: "uni-only", accessNote: "Queen Mary card holders only.",
    free: true, noise: "quiet", openLate: true, wifi: true, plugs: true, station: { name: "Mile End", mins: 8 },
    crowd: "often busy", groupFriendly: true, desks: true, rooms: true, hours: "Extended hours in term (illustrative)",
    description: "Right on the Regent's Canal. Group rooms and silent floors on campus.",
    tip: "Canal-side walk to Mile End station is the nicest commute decompression.", lat: 51.5235, lon: -0.0405,
  },
];

export const spaceById = (id: string) => SPACES.find((s) => s.id === id);
export const PUBLIC_SPACES = SPACES.filter((s) => s.access !== "uni-only");

export const ACCESS_LABEL: Record<Space["access"], string> = {
  public: "Open to public",
  "reader-pass": "Free pass for some areas",
  "uni-only": "University card only",
};
