// =============================================================
// PersonCard: shows course / uni / year / fun fact FIRST, then the
// name. Connection flow: Connect -> Pending -> (demo) Simulate their
// acceptance -> fictional contact revealed. Block/Report menu.
// =============================================================
import { useState } from "react";
import { MoreHorizontal, Send, Check, Mail, Sparkles, ShieldAlert, Ban } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Initials, UniBadge, FieldError } from "@/components/common/bits";
import { CONTACT_LABEL, LOOKING_FOR_LABEL } from "@/data/people";
import { uniById } from "@/data/universities";
import { runAction, useStudy } from "@/store/study-store";
import type { Person } from "@/store/types";

export function PersonCard({ person: p, matchNote }: { person: Person; matchNote?: string }) {
  const { state, requestConnection, cancelConnection, simulateAccept, block, report } = useStudy();
  const status = state.connections[p.id];
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState<string>();

  const submitReport = () => {
    if (reason.trim().length < 5) return setReasonErr("Add a short reason (5+ characters).");
    if (runAction(report(p.id, reason.trim()), "Report saved locally", "No moderator will see this. It is stored only in your browser.")) {
      setReportOpen(false); setReason(""); setReasonErr(undefined);
    }
  };

  return (
    <article data-testid={`card-person-${p.id}`} className="rise flex flex-col rounded-3xl border border-border bg-card p-5 transition-all hover:paper-shadow hover:-translate-y-0.5">
      {/* Course, uni, year first */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <UniBadge uni={p.uni} />
          <span className="font-mono-label text-muted-foreground">{p.year}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button data-testid={`button-person-menu-${p.id}`} aria-label="More actions" className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem data-testid={`button-report-${p.id}`} onSelect={() => setReportOpen(true)}><ShieldAlert className="mr-2 h-4 w-4" />Report</DropdownMenuItem>
            <DropdownMenuItem data-testid={`button-block-${p.id}`} className="text-destructive" onSelect={() => runAction(block(p.id), `${p.name} blocked`, "They are hidden from People. Undo from the blocked list.")}>
              <Ban className="mr-2 h-4 w-4" />Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold leading-tight" data-testid={`text-course-${p.id}`}>{p.course}</h3>
      <p className="mt-2 rounded-xl bg-muted/70 px-3 py-2 text-sm italic">"{p.funFact}"</p>

      <div className="mt-4 flex items-center gap-3">
        <Initials name={p.name} color={uniById(p.uni)?.color} />
        <div className="min-w-0 text-sm">
          <p className="font-bold">{p.name}</p>
          <p className="truncate text-muted-foreground">Commutes from {p.commute}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.lookingFor.map((l) => <span key={l} className="rounded-full border border-border px-2 py-0.5 text-xs">{LOOKING_FOR_LABEL[l]}</span>)}
      </div>
      {matchNote && <p className="mt-3 text-xs font-semibold text-primary">{matchNote}</p>}

      {/* Connection flow */}
      <div className="mt-auto pt-4">
        {!status && (
          <Button data-testid={`button-connect-${p.id}`} className="w-full rounded-full" onClick={() => runAction(requestConnection(p.id), "Request sent", `It stays pending until ${p.name.split(" ")[0]} accepts.`)}>
            <Send className="mr-2 h-4 w-4" />Request to connect
          </Button>
        )}
        {status === "pending" && (
          <div className="space-y-2" data-testid={`status-pending-${p.id}`}>
            <div className="flex items-center justify-between rounded-full bg-accent/40 px-4 py-2 text-sm font-semibold">
              <span>Pending their reply</span>
              <button data-testid={`button-cancel-${p.id}`} className="text-xs underline" onClick={() => runAction(cancelConnection(p.id), "Request withdrawn")}>Withdraw</button>
            </div>
            <button
              data-testid={`button-simulate-accept-${p.id}`}
              onClick={() => runAction(simulateAccept(p.id), "Demo: they accepted", "Both sides agreed, so contact details are now shown.")}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-secondary/50 px-4 py-2 text-xs font-bold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> Demo only: simulate {p.name.split(" ")[0]} accepting
            </button>
          </div>
        )}
        {status === "accepted" && (
          <div className="rounded-2xl bg-secondary p-3 text-secondary-foreground" data-testid={`status-connected-${p.id}`}>
            <p className="flex items-center gap-1.5 text-xs font-bold text-accent"><Check className="h-3.5 w-3.5" />Connected (mutual)</p>
            <p className="mt-1 flex items-center gap-2 text-sm"><Mail className="h-4 w-4" />{CONTACT_LABEL[p.contact]}: <span className="font-mono text-xs">{p.contactHandle}</span></p>
            <p className="mt-1 text-[11px] opacity-70">Fictional contact. No messages are sent from this demo.</p>
          </div>
        )}
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Report {p.name}</DialogTitle>
            <DialogDescription>
              Honest notice: this is a demo with no moderators. Your report is saved only in this browser and nobody reviews it. In a real product this would go to a trained safety team.
            </DialogDescription>
          </DialogHeader>
          <Textarea data-testid="input-report-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What happened?" />
          <FieldError msg={reasonErr} />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button data-testid="button-submit-report" onClick={submitReport}>Save report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
