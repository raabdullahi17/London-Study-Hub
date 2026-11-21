// =============================================================
// ProfileFields: shared profile form used by /join and /profile.
// =============================================================
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chip, FieldError } from "@/components/common/bits";
import { CONTACT_LABEL, LOOKING_FOR_LABEL } from "@/data/people";
import { YEARS } from "@/data/universities";
import type { ContactPref, Gender, LookingFor } from "@/store/types";

export interface ProfileDraft { name: string; course: string; year: string; gender: Gender; funFact: string; contact: ContactPref; lookingFor: LookingFor[] }

const GENDERS: { v: Gender | "none"; l: string }[] = [
  { v: "none", l: "Leave blank" }, { v: "woman", l: "Woman" }, { v: "man", l: "Man" }, { v: "non-binary", l: "Non-binary" }, { v: "another", l: "Another identity" }, { v: "prefer-not", l: "Prefer not to say" },
];

export function ProfileFields({ v, set, errs }: { v: ProfileDraft; set: (p: Partial<ProfileDraft>) => void; errs: Record<string, string> }) {
  const toggle = (l: LookingFor) => set({ lookingFor: v.lookingFor.includes(l) ? v.lookingFor.filter((x) => x !== l) : [...v.lookingFor, l] });
  return (
    <div className="grid gap-4">
      <div><Label>Name (first name + initial is fine)</Label><Input data-testid="input-name" value={v.name} onChange={(e) => set({ name: e.target.value })} /><FieldError msg={errs.name} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Course</Label><Input data-testid="input-course" value={v.course} onChange={(e) => set({ course: e.target.value })} placeholder="Computer Science" /><FieldError msg={errs.course} /></div>
        <div>
          <Label>Year</Label>
          <Select value={v.year} onValueChange={(year) => set({ year })}>
            <SelectTrigger data-testid="select-year"><SelectValue placeholder="Pick a year" /></SelectTrigger>
            <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <FieldError msg={errs.year} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Gender (optional)</Label>
          <Select value={v.gender || "none"} onValueChange={(g) => set({ gender: g === "none" ? "" : (g as Gender) })}>
            <SelectTrigger data-testid="select-gender"><SelectValue /></SelectTrigger>
            <SelectContent>{GENDERS.map((g) => <SelectItem key={g.v} value={g.v}>{g.l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred contact</Label>
          <Select value={v.contact} onValueChange={(c) => set({ contact: c as ContactPref })}>
            <SelectTrigger data-testid="select-contact"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(CONTACT_LABEL).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div><Label>Fun fact</Label><Input data-testid="input-funfact" value={v.funFact} onChange={(e) => set({ funFact: e.target.value })} placeholder="I can name every Zone 1 station" /><FieldError msg={errs.funFact} /></div>
      <div>
        <Label>Looking for</Label>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {(Object.keys(LOOKING_FOR_LABEL) as LookingFor[]).map((l) => <Chip key={l} testId={`chip-looking-${l}`} active={v.lookingFor.includes(l)} onClick={() => toggle(l)}>{LOOKING_FOR_LABEL[l]}</Chip>)}
        </div>
        <FieldError msg={errs.lookingFor} />
      </div>
    </div>
  );
}
