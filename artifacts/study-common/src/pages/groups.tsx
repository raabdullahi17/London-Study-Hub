// =============================================================
// /groups  Browse, create, join, leave, edit and delete groups.
// Contacts are only visible to members. Cap: 6.
// =============================================================
import { useState } from "react";
import { Plus, MapPin, CalendarDays, Lock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, ProfileNudge, UniBadge, Chip } from "@/components/common/bits";
import { GroupFormDialog } from "@/components/groups/group-form-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { spaceById } from "@/data/spaces";
import { usePageMeta } from "@/hooks/use-page-meta";
import { GROUP_MAX, runAction, useStudy } from "@/store/study-store";
import { ME, type Group } from "@/store/types";

export default function GroupsPage() {
  usePageMeta("Study Groups", "Small study groups of up to six London students. Join, leave or start your own in this local demo.");
  const { state, joinGroup, leaveGroup, deleteGroup } = useStudy();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [deleting, setDeleting] = useState<Group | null>(null);
  const [mine, setMine] = useState(false);

  const list = state.groups.filter((g) => !mine || g.members.includes(ME));

  return (
    <div>
      <PageHeader kicker="Groups / max six" title="Small tables, not lecture halls." action={<Button data-testid="button-create-group" className="rounded-full" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" />Start a group</Button>}>
        Every group caps at six so nobody gets lost. Contact details appear once you join.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-4">
        {!state.profile && <ProfileNudge text="Create a demo profile to join or start a group." />}
        <div className="flex gap-2">
          <Chip testId="chip-all-groups" active={!mine} onClick={() => setMine(false)}>All groups</Chip>
          <Chip testId="chip-my-groups" active={mine} onClick={() => setMine(true)}>My groups</Chip>
        </div>
        {list.length === 0 ? (
          <EmptyState title="No groups yet" body={mine ? "You have not joined any groups. Browse all or start your own." : "Be the first to start one."} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => {
              const member = g.members.includes(ME);
              const own = g.ownerId === ME;
              const full = g.members.length >= Math.min(g.capacity, GROUP_MAX);
              return (
                <article key={g.id} data-testid={`card-group-${g.id}`} className="rise flex flex-col rounded-3xl border border-border bg-card p-5 hover:paper-shadow transition-all">
                  <div className="flex items-center justify-between"><UniBadge uni={g.uni} /><span className="font-mono-label text-muted-foreground">{g.topic}</span></div>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{g.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{spaceById(g.spaceId)?.name}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{g.schedule}</p>
                  </div>
                  {/* seat dots */}
                  <div className="mt-4 flex items-center gap-1.5" aria-label={`${g.members.length} of ${g.capacity} seats taken`}>
                    {Array.from({ length: g.capacity }).map((_, i) => <span key={i} className={`h-3 w-3 rounded-full border-2 ${i < g.members.length ? "border-secondary bg-secondary" : "border-border"}`} />)}
                    <span className="ml-2 text-xs text-muted-foreground" data-testid={`text-seats-${g.id}`}>{g.members.length}/{g.capacity}</span>
                  </div>
                  <div className="mt-3 rounded-xl bg-muted/70 p-3 text-sm">
                    {member ? <span data-testid={`text-contact-${g.id}`}><span className="font-bold">Contact:</span> {g.contact}</span> : <span className="flex items-center gap-2 text-muted-foreground"><Lock className="h-4 w-4" />Contact visible after joining</span>}
                  </div>
                  <div className="mt-auto flex gap-2 pt-4">
                    {own ? (
                      <>
                        <Button data-testid={`button-edit-group-${g.id}`} variant="outline" className="flex-1 rounded-full" onClick={() => { setEditing(g); setFormOpen(true); }}><Pencil className="mr-1 h-4 w-4" />Edit</Button>
                        <Button data-testid={`button-delete-group-${g.id}`} variant="outline" className="rounded-full text-destructive" onClick={() => setDeleting(g)}><Trash2 className="h-4 w-4" /></Button>
                      </>
                    ) : member ? (
                      <Button data-testid={`button-leave-group-${g.id}`} variant="outline" className="flex-1 rounded-full" onClick={() => runAction(leaveGroup(g.id), "You left the group")}>Leave group</Button>
                    ) : (
                      <Button data-testid={`button-join-group-${g.id}`} disabled={full} className="flex-1 rounded-full" onClick={() => runAction(joinGroup(g.id), "Welcome to the group", "Contact details are now visible.")}>{full ? "Full" : "Join group"}</Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <GroupFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this group?" body="Members will lose it too. This only affects this browser." confirm="Delete" onConfirm={() => { if (deleting) runAction(deleteGroup(deleting.id), "Group deleted"); setDeleting(null); }} />
    </div>
  );
}
