import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { api } from "@/lib/api";
import type { MediaAsset } from "@/types/api";

export function MediaUploader({
  folderName,
  onUploaded,
  buttonLabel = "Upload image",
}: {
  folderName: string;
  onUploaded: (asset: MediaAsset) => void;
  buttonLabel?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const upload = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Select an image first.");
      return api.uploadImage(file, folderName);
    },
    onSuccess: (asset) => {
      toast.success("Image uploaded.");
      setFile(null);
      onUploaded(asset);
      void queryClient.invalidateQueries();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Upload failed."),
  });

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <Button type="button" variant="secondary" disabled={!file || upload.isPending} onClick={() => upload.mutate()}>
        <Upload className="h-4 w-4" />
        {upload.isPending ? "Uploading" : buttonLabel}
      </Button>
    </div>
  );
}