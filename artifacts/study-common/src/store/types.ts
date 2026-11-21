// =============================================================
// Shared domain types for Study Common.
// Everything here is local demo data: no backend, no real people.
// =============================================================

export type UniId = "ucl" | "kcl" | "imperial" | "lse" | "qmul";

export type Gender = "" | "woman" | "man" | "non-binary" | "another" | "prefer-not";
export type ContactPref = "email" | "discord" | "whatsapp" | "in-person";
export type LookingFor = "study-buddy" | "study-group" | "commute-buddy" | "accountability" | "friends";

/** The visitor's own profile, created on /join. */
export interface Profile {
  name: string;
  email: string;
  uni: UniId;
  course: string;
  year: string;
  gender: Gender;
  funFact: string;
  contact: ContactPref;
  lookingFor: LookingFor[];
  verifiedAt: string; // ISO time the SIMULATED code was entered
}

/** A fictional sample student. */
export interface Person {
  id: string;
  name: string;
  uni: UniId;
  course: string;
  year: string;
  funFact: string;
  lookingFor: LookingFor[];
  contact: ContactPref;
  contactHandle: string; // always fictional (@example.com etc.)
  commute: string;
}

export type Access = "public" | "uni-only" | "reader-pass";
export type Noise = "silent" | "quiet" | "social";
export type Crowd = "usually calm" | "varies" | "often busy";

export interface Space {
  id: string;
  name: string;
  area: string;
  uni: UniId | "all";
  access: Access;
  accessNote: string;
  free: boolean;
  noise: Noise;
  openLate: boolean;
  wifi: boolean;
  plugs: boolean;
  station: { name: string; mins: number };
  crowd: Crowd;
  groupFriendly: boolean;
  desks: boolean;
  rooms: boolean;
  hours: string;
  description: string;
  tip: string;
  lat: number;
  lon: number;
}

export interface Group {
  id: string;
  name: string;
  uni: UniId | "mixed";
  topic: string;
  description: string;
  spaceId: string;
  schedule: string;
  capacity: number; // hard max 6
  members: string[]; // person ids, "me" = the visitor
  ownerId: string;
  contact: string; // fictional; only shown to members
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  spaceId: string; // must be a PUBLIC space
  date: string; // yyyy-mm-dd
  start: string; // HH:mm
  end: string; // HH:mm
  hostId: string;
  attendees: string[];
  capacity: number;
  note: string;
}

export type ConnectionStatus = "pending" | "accepted";

export interface Report {
  personId: string;
  reason: string;
  at: string;
}

/** The whole persisted app state (one localStorage key). */
export interface AppState {
  version: 1;
  profile: Profile | null;
  savedSpaces: string[];
  groups: Group[];
  sessions: Session[];
  connections: Record<string, ConnectionStatus>;
  blocked: string[];
  reports: Report[];
}

/** Id used for the visitor in member/attendee lists. */
export const ME = "me";
