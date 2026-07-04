import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-errors";

export type MutationFeedbackOptions = {
  successMessage: string;
  errorMessage?: string;
  invalidate?: QueryKey | QueryKey[];
  onSuccess?: () => void;
};

function normalizeInvalidations(invalidate?: QueryKey | QueryKey[]) {
  if (!invalidate) return [];
  return Array.isArray(invalidate[0]) ? (invalidate as QueryKey[]) : [invalidate as QueryKey];
}

export function handleMutationSuccess(queryClient: QueryClient, options: MutationFeedbackOptions) {
  toast.success(options.successMessage);
  normalizeInvalidations(options.invalidate).forEach((queryKey) => {
    void queryClient.invalidateQueries({ queryKey });
  });
  options.onSuccess?.();
}

export function handleMutationError(error: unknown, fallback = "Request failed.") {
  toast.error(getApiErrorMessage(error, fallback));
}

export function createMutationHandlers(queryClient: QueryClient, options: MutationFeedbackOptions) {
  return {
    onSuccess: () => handleMutationSuccess(queryClient, options),
    onError: (error: unknown) => handleMutationError(error, options.errorMessage),
  };
}