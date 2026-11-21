// =============================================================
// /people  Similar-course students first, connection requests,
// blocked list. All people are fictional samples.
// =============================================================
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, ProfileNudge } from "@/components/common/bits";
import { PersonCard } from "@/components/people/person-card";
import { PEOPLE, personById } from "@/data/people";
import { usePageMeta } from "@/hooks/use-page-meta";
import { runAction, useStudy } from "@/store/study-store";
import type { Person, Profile } from "@/store/types";

/** Simple similarity: shared course words count most, then uni, then shared "looking for". */
function score(p: Person, me: Profile | null) {
  if (!me) return { n: 0, note: "" };
  const words = new Set(me.course.toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  const shared = p.course.toLowerCase().split(/\W+/).filter((w) => words.has(w)).length;
  const sameUni = p.uni === me.uni;
  const n = shared * 3 + (sameUni ? 1 : 0) + p.lookingFor.filter((l) => me.lookingFor.includes(l)).length;
  const note = shared ? "Similar course to yours" : sameUni ? "Same university" : "";
  return { n, note };
}

export default function PeoplePage() {
  usePageMeta("People", "Meet fictional sample London students with similar courses. Connections need mutual consent in this local demo.");
  const { state, unblock } = useStudy();
  const ranked = useMemo(
    () => PEOPLE.filter((p) => !state.blocked.includes(p.id)).map((p) => ({ p, ...score(p, state.profile) })).sort((a, b) => b.n - a.n),
    [state.blocked, state.profile],
  );

  return (
    <div>
      <PageHeader kicker="People / sample students" title="Someone else is also studying alone.">
        Course and fun fact first, names second. Contact details only appear after both sides agree. Everyone here is fictional.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-5">
        {!state.profile && <ProfileNudge text="Add your course to see similar students first and send requests." />}
        {ranked.length === 0 ? <EmptyState title="Everyone is blocked" body="Unblock someone below to see them again." /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ranked.map(({ p, note }) => <PersonCard key={p.id} person={p} matchNote={note} />)}
          </div>
        )}
        {state.blocked.length > 0 && (
          <section className="rounded-3xl border border-border bg-card p-5" data-testid="section-blocked">
            <h2 className="font-display text-xl font-bold">Blocked</h2>
            <p className="text-sm text-muted-foreground">Hidden only in this browser. There is no moderator in this demo.</p>
            <ul className="mt-3 divide-y divide-border">
              {state.blocked.map((id) => (
                <li key={id} className="flex items-center justify-between py-2 text-sm">
                  <span>{personById(id)?.name ?? id}</span>
                  <Button size="sm" variant="outline" className="rounded-full" data-testid={`button-unblock-${id}`} onClick={() => runAction(unblock(id), "Unblocked")}>Unblock</Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
