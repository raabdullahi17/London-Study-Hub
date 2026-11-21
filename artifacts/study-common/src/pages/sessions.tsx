// =============================================================
// /sessions  Browse, post, edit, delete own drop-in sessions;
// join or leave others'. Public venues only.
// =============================================================
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, ProfileNudge } from "@/components/common/bits";
import { SessionFormDialog } from "@/components/sessions/session-form-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { spaceById } from "@/data/spaces";
import { personById } from "@/data/people";
import { dayOffset } from "@/data/seed";
import { usePageMeta } from "@/hooks/use-page-meta";
import { runAction, useStudy } from "@/store/study-store";
import { ME, type Session } from "@/store/types";

export default function SessionsPage() {
  usePageMeta("Drop-in Sessions", "Post or join drop-in study sessions at public London venues. Local demo, nothing is booked.");
  const { state, joinSession, leaveSession, deleteSession } = useStudy();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [deleting, setDeleting] = useState<Session | null>(null);

  const upcoming = state.sessions.filter((s) => s.date >= dayOffset(0)).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

  return (
    <div>
      <PageHeader kicker="Sessions / drop in" title="Turn up. Sit near someone." action={<Button data-testid="button-create-session" className="rounded-full" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" />Post a session</Button>}>
        Low-stakes study sessions at venues anyone can enter. Nothing is reserved; just show up.
      </PageHeader>
      <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-3">
        {!state.profile && <ProfileNudge text="Create a demo profile to post or drop in." />}
        {upcoming.length === 0 ? <EmptyState title="No sessions on the board" body="Post one and give someone a reason to leave the house." /> : upcoming.map((s) => {
          const own = s.hostId === ME;
          const going = s.attendees.includes(ME);
          const host = own ? "You" : personById(s.hostId)?.name ?? "Someone";
          const d = parseISO(s.date);
          return (
            <article key={s.id} data-testid={`card-session-${s.id}`} className="rise flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center">
              <div className="flex w-20 shrink-0 flex-col items-center rounded-2xl bg-secondary py-2 text-secondary-foreground">
                <span className="font-mono-label text-accent">{format(d, "EEE")}</span>
                <span className="font-display text-3xl font-extrabold leading-none">{format(d, "d")}</span>
                <span className="text-xs">{format(d, "MMM")}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono-label text-primary">{s.start} to {s.end}</p>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{spaceById(s.spaceId)?.name} / hosted by {host}</p>
                {s.note && <p className="mt-1 text-sm">{s.note}</p>}
                <p className="mt-1 text-xs text-muted-foreground" data-testid={`text-attendees-${s.id}`}>{s.attendees.length} of {s.capacity} planning to come</p>
              </div>
              <div className="flex gap-2">
                {own ? (
                  <>
                    <Button data-testid={`button-edit-session-${s.id}`} variant="outline" className="rounded-full" onClick={() => { setEditing(s); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button data-testid={`button-delete-session-${s.id}`} variant="outline" className="rounded-full text-destructive" onClick={() => setDeleting(s)}><Trash2 className="h-4 w-4" /></Button>
                  </>
                ) : going ? (
                  <Button data-testid={`button-leave-session-${s.id}`} variant="outline" className="rounded-full" onClick={() => runAction(leaveSession(s.id), "You left the session")}>Leave</Button>
                ) : (
                  <Button data-testid={`button-join-session-${s.id}`} disabled={s.attendees.length >= s.capacity} className="rounded-full" onClick={() => runAction(joinSession(s.id), "You are dropping in", "Added to your plans in this browser.")}>{s.attendees.length >= s.capacity ? "Full" : "Drop in"}</Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <SessionFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this session?" body="It will disappear from the board in this browser." confirm="Delete" onConfirm={() => { if (deleting) runAction(deleteSession(deleting.id), "Session deleted"); setDeleting(null); }} />
    </div>
  );
}
