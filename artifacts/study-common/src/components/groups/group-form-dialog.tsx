// =============================================================
// GroupFormDialog: create or edit (own) group. Validated by
// groupSchema. Capacity is capped at 6.
// =============================================================
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/common/bits";
import { SPACES } from "@/data/spaces";
import { UNIVERSITIES } from "@/data/universities";
import { fieldErrors, groupSchema } from "@/lib/validation";
import { runAction, useStudy } from "@/store/study-store";
import type { Group, UniId } from "@/store/types";

const blank = { name: "", topic: "", description: "", spaceId: "", schedule: "", capacity: "6", contact: "", uni: "mixed" as UniId | "mixed" };

export function GroupFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Group | null }) {
  const { createGroup, updateGroup } = useStudy();
  const [v, setV] = useState(blank);
  const [errs, setErrs] = useState<Record<string, string>>({});

  // Reset form whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setErrs({});
    setV(editing ? { ...editing, capacity: String(editing.capacity) } : blank);
  }, [open, editing]);

  const set = (k: keyof typeof blank) => (val: string) => setV((x) => ({ ...x, [k]: val }));

  const submit = () => {
    const parsed = groupSchema.safeParse(v);
    if (!parsed.success) return setErrs(fieldErrors(parsed.error));
    const data = { ...parsed.data, uni: v.uni };
    const ok = editing ? runAction(updateGroup(editing.id, data), "Group updated") : runAction(createGroup(data), "Group created", "You are the first member.");
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl" data-testid="dialog-group-form">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{editing ? "Edit group" : "Start a small group"}</DialogTitle>
          <DialogDescription>Max 6 people. The contact is only shown to members, and should be fictional in this demo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div><Label>Name</Label><Input data-testid="input-group-name" value={v.name} onChange={(e) => set("name")(e.target.value)} /><FieldError msg={errs.name} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Topic</Label><Input data-testid="input-group-topic" value={v.topic} onChange={(e) => set("topic")(e.target.value)} /><FieldError msg={errs.topic} /></div>
            <div>
              <Label>University</Label>
              <Select value={v.uni} onValueChange={set("uni")}>
                <SelectTrigger data-testid="select-group-uni"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed unis</SelectItem>
                  {UNIVERSITIES.map((u) => <SelectItem key={u.id} value={u.id}>{u.short}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Description</Label><Textarea data-testid="input-group-description" value={v.description} onChange={(e) => set("description")(e.target.value)} /><FieldError msg={errs.description} /></div>
          <div>
            <Label>Usual space</Label>
            <Select value={v.spaceId} onValueChange={set("spaceId")}>
              <SelectTrigger data-testid="select-group-space"><SelectValue placeholder="Pick a space" /></SelectTrigger>
              <SelectContent>{SPACES.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
            <FieldError msg={errs.spaceId} />
          </div>
          <div className="grid grid-cols-[1fr_96px] gap-3">
            <div><Label>When</Label><Input data-testid="input-group-schedule" placeholder="Tuesdays, 16:00" value={v.schedule} onChange={(e) => set("schedule")(e.target.value)} /><FieldError msg={errs.schedule} /></div>
            <div><Label>Capacity</Label><Input data-testid="input-group-capacity" type="number" min={2} max={6} value={v.capacity} onChange={(e) => set("capacity")(e.target.value)} /><FieldError msg={errs.capacity} /></div>
          </div>
          <div><Label>Member contact (fictional)</Label><Input data-testid="input-group-contact" placeholder="ourgroup@example.com" value={v.contact} onChange={(e) => set("contact")(e.target.value)} /><FieldError msg={errs.contact} /></div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button data-testid="button-submit-group" onClick={submit}>{editing ? "Save changes" : "Create group"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
