import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button, type ButtonProps } from "@/components/ui/button";

export function ConfirmActionButton({
  title,
  description,
  confirmLabel,
  busy,
  children,
  onConfirm,
  ...buttonProps
}: ButtonProps & {
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  children: ReactNode;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        busy={busy}
        confirmLabel={confirmLabel}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
}