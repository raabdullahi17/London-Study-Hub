// =============================================================
// /profile  Edit your demo profile, see saved spaces, reset demo.
// =============================================================
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, UniBadge } from "@/components/common/bits";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ProfileFields, type ProfileDraft } from "@/components/profile/profile-fields";
import { spaceById } from "@/data/spaces";
import { fieldErrors, profileSchema } from "@/lib/validation";
import { usePageMeta } from "@/hooks/use-page-meta";
import { runAction, useStudy } from "@/store/study-store";

export default function ProfilePage() {
  usePageMeta("Your profile", "Edit your Study Common demo profile. Everything is stored only in this browser.");
  const { state, saveProfile, resetDemo } = useStudy();
  const p = state.profile;
  const [draft, setDraft] = useState<ProfileDraft | null>(p ? { name: p.name, course: p.course, year: p.year, gender: p.gender, funFact: p.funFact, contact: p.contact, lookingFor: p.lookingFor } : null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [resetOpen, setResetOpen] = useState(false);

  const save = () => {
    if (!p || !draft) return;
    const r = profileSchema.safeParse(draft);
    if (!r.success) return setErrs(fieldErrors(r.error));
    setErrs({});
    runAction(saveProfile({ ...p, ...draft }), "Profile updated");
  };

  return (
    <div>
      <PageHeader kicker="Profile / this browser only" title={p ? `Hi, ${p.name.split(" ")[0]}.` : "No profile yet."}>
        {p ? `Signed in to the demo as ${p.email}. Verification was simulated.` : "Browse freely, or make a demo profile to join in."}
      </PageHeader>
      <div className="mx-auto grid max-w-5xl gap-5 px-4 md:grid-cols-[1fr_320px] md:px-6">
        {p && draft ? (
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4"><UniBadge uni={p.uni} /></div>
            <ProfileFields v={draft} set={(x) => setDraft((d) => (d ? { ...d, ...x } : d))} errs={errs} />
            <Button data-testid="button-save-profile" className="mt-5 w-full rounded-full" onClick={save}>Save changes</Button>
          </div>
        ) : (
          <EmptyState title="Nobody at this desk" body="Join with a uni email (code is simulated) to edit a profile." action={<Link href="/join" data-testid="link-profile-join" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Join the demo</Link>} />
        )}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Saved spaces</h2>
            {state.savedSpaces.length === 0 ? <p className="text-sm text-muted-foreground">None yet. Tap the bookmark on any space.</p> : (
              <ul className="mt-2 space-y-1 text-sm">{state.savedSpaces.map((id) => <li key={id} data-testid={`text-saved-${id}`}>{spaceById(id)?.name}</li>)}</ul>
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 text-sm">
            <h2 className="font-display text-lg font-bold">Demo data</h2>
            <p className="text-muted-foreground">Stored in localStorage on this device. {state.reports.length} local report(s), {state.blocked.length} blocked.</p>
            <Button data-testid="button-reset-demo" variant="outline" className="mt-3 w-full rounded-full text-destructive" onClick={() => setResetOpen(true)}>Reset demo</Button>
          </div>
        </aside>
      </div>
      <ConfirmDialog open={resetOpen} onOpenChange={setResetOpen} title="Reset the demo?" body="Clears your profile, saves, groups, sessions and connections from this browser." confirm="Reset" onConfirm={() => { if (runAction(resetDemo(), "Demo reset")) { setDraft(null); } setResetOpen(false); }} />
    </div>
  );
}
