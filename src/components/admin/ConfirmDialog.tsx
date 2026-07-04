import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? "Working" : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3 rounded-md border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p>This action updates the API immediately and can affect public website content.</p>
      </div>
    </Modal>
  );
}