// =============================================================
// /join  3-step onboarding: uni email (domain check) -> SIMULATED
// code shown on screen (no email sent) -> profile.
// =============================================================
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, PageHeader } from "@/components/common/bits";
import { ProfileFields, type ProfileDraft } from "@/components/profile/profile-fields";
import { uniFromEmail } from "@/data/universities";
import { emailSchema, fieldErrors, profileSchema } from "@/lib/validation";
import { usePageMeta } from "@/hooks/use-page-meta";
import { runAction, useStudy } from "@/store/study-store";

export default function JoinPage() {
  usePageMeta("Join the demo", "Create a local demo profile with a London university email. The verification code is simulated; no email is sent.");
  const { saveProfile } = useStudy();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string>();
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<ProfileDraft>({ name: "", course: "", year: "", gender: "", funFact: "", contact: "email", lookingFor: [] });
  // Simulated code, generated in the browser and shown on screen.
  const demoCode = useMemo(() => String(100000 + Math.floor(Math.random() * 900000)), []);
  const uni = uniFromEmail(email);

  const submitEmail = () => {
    const r = emailSchema.safeParse(email);
    if (!r.success) return setErr(r.error.issues[0].message);
    setErr(undefined); setStep(2);
  };
  const submitCode = () => {
    if (code.trim() !== demoCode) return setErr("That does not match the demo code shown above.");
    setErr(undefined); setStep(3);
  };
  const submitProfile = () => {
    const r = profileSchema.safeParse(draft);
    if (!r.success) return setErrs(fieldErrors(r.error));
    if (!uni) return;
    if (runAction(saveProfile({ ...draft, email: email.trim().toLowerCase(), uni: uni.id, verifiedAt: new Date().toISOString() }), "Welcome to Study Common", "Your demo profile is saved in this browser.")) navigate("/people");
  };

  return (
    <div>
      <PageHeader kicker={`Join / step ${step} of 3`} title="Pull up a chair.">You can browse everything without this. A profile lets you join groups, drop in and connect.</PageHeader>
      <div className="mx-auto max-w-xl px-4 md:px-6">
        <div className="mb-5 flex gap-1.5">{[1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? "bg-primary" : "bg-border"}`} />)}</div>
        <div className="rise rounded-3xl border border-border bg-card p-6 paper-shadow">
          {step === 1 && (
            <div className="space-y-3">
              <Label>University email</Label>
              <Input data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ucl.ac.uk" onKeyDown={(e) => e.key === "Enter" && submitEmail()} />
              <FieldError msg={err} />
              {uni && <p className="text-sm font-semibold text-primary" data-testid="text-detected-uni">Looks like {uni.name}</p>}
              <p className="text-xs text-muted-foreground">Accepted: ucl.ac.uk, kcl.ac.uk, imperial.ac.uk, lse.ac.uk, qmul.ac.uk. Stored only in this browser.</p>
              <Button data-testid="button-submit-email" className="w-full rounded-full" onClick={submitEmail}>Continue</Button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div className="rounded-2xl border-2 border-dashed border-secondary/50 bg-accent/30 p-4">
                <p className="font-mono-label">Simulated verification</p>
                <p className="mt-1 text-sm">No email was sent. In a real product a code would go to {email}. For this demo, your code is:</p>
                <p className="mt-2 font-mono text-3xl font-bold tracking-[0.3em]" data-testid="text-demo-code">{demoCode}</p>
              </div>
              <Label>Enter code</Label>
              <Input data-testid="input-code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitCode()} />
              <FieldError msg={err} />
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(1)}>Back</Button>
                <Button data-testid="button-submit-code" className="flex-1 rounded-full" onClick={submitCode}>Confirm</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <ProfileFields v={draft} set={(p) => setDraft((d) => ({ ...d, ...p }))} errs={errs} />
              <Button data-testid="button-submit-profile" className="w-full rounded-full" onClick={submitProfile}>Create demo profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
