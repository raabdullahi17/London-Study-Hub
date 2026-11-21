// =============================================================
// SessionFormDialog: post or edit (own) drop-in session. Venue
// must be from the catalogue AND open to the public.
// =============================================================
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/common/bits";
import { PUBLIC_SPACES } from "@/data/spaces";
import { dayOffset } from "@/data/seed";
import { fieldErrors, sessionSchema } from "@/lib/validation";
import { runAction, useStudy } from "@/store/study-store";
import type { Session } from "@/store/types";

const blank = () => ({ title: "", spaceId: "", date: dayOffset(1), start: "10:00", end: "13:00", capacity: "6", note: "" });

export function SessionFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Session | null }) {
  const { createSession, updateSession } = useStudy();
  const [v, setV] = useState(blank);
  const [errs, setErrs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrs({});
    setV(editing ? { ...editing, capacity: String(editing.capacity) } : blank());
  }, [open, editing]);

  const set = (k: keyof ReturnType<typeof blank>) => (val: string) => setV((x) => ({ ...x, [k]: val }));

  const submit = () => {
    const parsed = sessionSchema.safeParse(v);
    if (!parsed.success) return setErrs(fieldErrors(parsed.error));
    if (editing && parsed.data.capacity < editing.attendees.length) return setErrs({ capacity: `Already ${editing.attendees.length} going.` });
    const ok = editing ? runAction(updateSession(editing.id, parsed.data), "Session updated") : runAction(createSession(parsed.data), "Session posted", "Others in the demo can now drop in.");
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl" data-testid="dialog-session-form">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{editing ? "Edit session" : "Post a drop-in session"}</DialogTitle>
          <DialogDescription>Public venues only, so anyone joining can actually get in. Nothing is booked.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div><Label>Title</Label><Input data-testid="input-session-title" value={v.title} onChange={(e) => set("title")(e.target.value)} placeholder="Essay sprint, cake after" /><FieldError msg={errs.title} /></div>
          <div>
            <Label>Public venue</Label>
            <Select value={v.spaceId} onValueChange={set("spaceId")}>
              <SelectTrigger data-testid="select-session-space"><SelectValue placeholder="Pick a public venue" /></SelectTrigger>
              <SelectContent>{PUBLIC_SPACES.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
            <FieldError msg={errs.spaceId} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="col-span-2 sm:col-span-1"><Label>Date</Label><Input data-testid="input-session-date" type="date" min={dayOffset(0)} value={v.date} onChange={(e) => set("date")(e.target.value)} /><FieldError msg={errs.date} /></div>
            <div ><Label>Start</Label><Input data-testid="input-session-start" type="time" value={v.start} onChange={(e) => set("start")(e.target.value)} /><FieldError msg={errs.start} /></div>
            <div ><Label>End</Label><Input data-testid="input-session-end" type="time" value={v.end} onChange={(e) => set("end")(e.target.value)} /><FieldError msg={errs.end} /></div>
          </div>
          <div className="grid grid-cols-[96px_1fr] gap-3">
            <div><Label>Spots</Label><Input data-testid="input-session-capacity" type="number" min={2} max={12} value={v.capacity} onChange={(e) => set("capacity")(e.target.value)} /><FieldError msg={errs.capacity} /></div>
            <div><Label>How to find you</Label><Textarea data-testid="input-session-note" rows={2} value={v.note} onChange={(e) => set("note")(e.target.value)} placeholder="Second floor, green scarf" /></div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button data-testid="button-submit-session" onClick={submit}>{editing ? "Save changes" : "Post session"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
