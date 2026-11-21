// =============================================================
// StudyStoreProvider: the single source of truth for the demo.
// - Holds AppState in React state
// - Every action goes through `commit`, which persists to
//   localStorage and toasts any error
// - Pages read state and call actions via `useStudy()`
// =============================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { createInitialState } from "@/data/seed";
import { clearState, loadState, saveState } from "./storage";
import { ME, type AppState, type Group, type Profile, type Session } from "./types";

export const GROUP_MAX = 6;

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string): Result => ({ ok: false, error });

interface StudyActions {
  saveProfile: (p: Profile) => Result;
  toggleSavedSpace: (id: string) => Result;
  createGroup: (g: Omit<Group, "id" | "members" | "ownerId" | "createdAt">) => Result;
  updateGroup: (id: string, g: Partial<Group>) => Result;
  deleteGroup: (id: string) => Result;
  joinGroup: (id: string) => Result;
  leaveGroup: (id: string) => Result;
  createSession: (s: Omit<Session, "id" | "hostId" | "attendees">) => Result;
  updateSession: (id: string, s: Partial<Session>) => Result;
  deleteSession: (id: string) => Result;
  joinSession: (id: string) => Result;
  leaveSession: (id: string) => Result;
  requestConnection: (personId: string) => Result;
  cancelConnection: (personId: string) => Result;
  simulateAccept: (personId: string) => Result;
  block: (personId: string) => Result;
  unblock: (personId: string) => Result;
  report: (personId: string, reason: string) => Result;
  resetDemo: () => Result;
}

interface StudyContextValue extends StudyActions {
  state: AppState;
  storageError: string | null;
}

const StudyContext = createContext<StudyContextValue | null>(null);

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function StudyStoreProvider({ children }: { children: ReactNode }) {
  // ---- Load once from localStorage --------------------------------
  const [initial] = useState(() => {
    const r = loadState();
    return { state: (r.ok && r.value) || createInitialState(), error: r.ok ? null : r.error };
  });
  const [state, setState] = useState<AppState>(initial.state);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (initial.error) toast({ variant: "destructive", title: "Saved data problem", description: initial.error });
  }, [initial.error]);

  // ---- commit: apply an update, persist, surface errors -----------
  const commit = useCallback((next: AppState): Result => {
    stateRef.current = next;
    setState(next);
    const r = saveState(next);
    if (!r.ok) {
      setStorageError(r.error);
      toast({ variant: "destructive", title: "Not saved", description: r.error + " Your change works until you reload." });
    } else setStorageError(null);
    return { ok: true };
  }, []);

  const needProfile = (): Result | null =>
    stateRef.current.profile ? null : fail("Create your demo profile first (Join, no real email sent).");

  // ---- Actions -----------------------------------------------------
  const actions = useMemo<StudyActions>(() => {
    const s = () => stateRef.current;
    return {
      saveProfile: (p) => commit({ ...s(), profile: p }),

      toggleSavedSpace: (id) => {
        const saved = s().savedSpaces.includes(id) ? s().savedSpaces.filter((x) => x !== id) : [...s().savedSpaces, id];
        return commit({ ...s(), savedSpaces: saved });
      },

      // -- Groups --
      createGroup: (g) => {
        const np = needProfile(); if (np) return np;
        if (g.capacity < 2 || g.capacity > GROUP_MAX) return fail(`Groups hold 2 to ${GROUP_MAX} people.`);
        const group: Group = { ...g, id: newId("g"), members: [ME], ownerId: ME, createdAt: new Date().toISOString() };
        return commit({ ...s(), groups: [group, ...s().groups] });
      },
      updateGroup: (id, patch) => {
        const g = s().groups.find((x) => x.id === id);
        if (!g || g.ownerId !== ME) return fail("You can only edit groups you created.");
        const cap = patch.capacity ?? g.capacity;
        if (cap > GROUP_MAX || cap < g.members.length) return fail(`Capacity must be between ${g.members.length} and ${GROUP_MAX}.`);
        return commit({ ...s(), groups: s().groups.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
      },
      deleteGroup: (id) => {
        const g = s().groups.find((x) => x.id === id);
        if (!g || g.ownerId !== ME) return fail("You can only delete groups you created.");
        return commit({ ...s(), groups: s().groups.filter((x) => x.id !== id) });
      },
      joinGroup: (id) => {
        const np = needProfile(); if (np) return np;
        const g = s().groups.find((x) => x.id === id);
        if (!g) return fail("Group not found.");
        if (g.members.includes(ME)) return fail("You are already in this group.");
        if (g.members.length >= Math.min(g.capacity, GROUP_MAX)) return fail("This group is full.");
        return commit({ ...s(), groups: s().groups.map((x) => (x.id === id ? { ...x, members: [...x.members, ME] } : x)) });
      },
      leaveGroup: (id) => {
        const g = s().groups.find((x) => x.id === id);
        if (!g) return fail("Group not found.");
        if (g.ownerId === ME) return fail("You own this group. Delete it instead.");
        return commit({ ...s(), groups: s().groups.map((x) => (x.id === id ? { ...x, members: x.members.filter((m) => m !== ME) } : x)) });
      },

      // -- Sessions --
      createSession: (sess) => {
        const np = needProfile(); if (np) return np;
        const session: Session = { ...sess, id: newId("s"), hostId: ME, attendees: [ME] };
        return commit({ ...s(), sessions: [...s().sessions, session] });
      },
      updateSession: (id, patch) => {
        const x = s().sessions.find((y) => y.id === id);
        if (!x || x.hostId !== ME) return fail("You can only edit your own sessions.");
        return commit({ ...s(), sessions: s().sessions.map((y) => (y.id === id ? { ...y, ...patch } : y)) });
      },
      deleteSession: (id) => {
        const x = s().sessions.find((y) => y.id === id);
        if (!x || x.hostId !== ME) return fail("You can only delete your own sessions.");
        return commit({ ...s(), sessions: s().sessions.filter((y) => y.id !== id) });
      },
      joinSession: (id) => {
        const np = needProfile(); if (np) return np;
        const x = s().sessions.find((y) => y.id === id);
        if (!x) return fail("Session not found.");
        if (x.attendees.length >= x.capacity) return fail("This session is full.");
        return commit({ ...s(), sessions: s().sessions.map((y) => (y.id === id ? { ...y, attendees: [...y.attendees, ME] } : y)) });
      },
      leaveSession: (id) =>
        commit({ ...s(), sessions: s().sessions.map((y) => (y.id === id ? { ...y, attendees: y.attendees.filter((a) => a !== ME) } : y)) }),

      // -- Connections (mutual consent) --
      requestConnection: (pid) => {
        const np = needProfile(); if (np) return np;
        return commit({ ...s(), connections: { ...s().connections, [pid]: "pending" } });
      },
      cancelConnection: (pid) => {
        const c = { ...s().connections }; delete c[pid];
        return commit({ ...s(), connections: c });
      },
      simulateAccept: (pid) => {
        if (s().connections[pid] !== "pending") return fail("There is no pending request to accept.");
        return commit({ ...s(), connections: { ...s().connections, [pid]: "accepted" } });
      },

      // -- Safety --
      block: (pid) => {
        const c = { ...s().connections }; delete c[pid];
        return commit({ ...s(), connections: c, blocked: Array.from(new Set([...s().blocked, pid])) });
      },
      unblock: (pid) => commit({ ...s(), blocked: s().blocked.filter((b) => b !== pid) }),
      report: (pid, reason) => commit({ ...s(), reports: [...s().reports, { personId: pid, reason, at: new Date().toISOString() }] }),

      resetDemo: () => {
        const r = clearState();
        if (!r.ok) return fail(r.error);
        const fresh = createInitialState();
        stateRef.current = fresh;
        setState(fresh);
        return { ok: true };
      },
    };
  }, [commit]);

  return <StudyContext.Provider value={{ state, storageError, ...actions }}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside StudyStoreProvider");
  return ctx;
}

/** Helper: run an action and toast success or the returned error. */
export function runAction(r: Result, success: string, description?: string) {
  if (r.ok) toast({ title: success, description });
  else toast({ variant: "destructive", title: "Hold on", description: r.error });
  return r.ok;
}
