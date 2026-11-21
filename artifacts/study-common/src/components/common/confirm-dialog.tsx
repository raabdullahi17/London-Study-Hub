// Reusable confirmation for destructive actions (delete group/session).
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function ConfirmDialog({ open, onOpenChange, title, body, confirm, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; body: string; confirm: string; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl">{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-confirm-cancel">Keep it</AlertDialogCancel>
          <AlertDialogAction data-testid="button-confirm-ok" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}>{confirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
