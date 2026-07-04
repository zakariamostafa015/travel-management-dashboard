import { ApiError } from "@/lib/api";

export function getApiErrorMessage(error: unknown, fallback = "Request failed.") {
  if (error instanceof ApiError) {
    return error.traceId ? `${error.message} Trace: ${error.traceId}` : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getApiFieldError(error: unknown, fieldName: string) {
  if (!(error instanceof ApiError) || !error.errors) return undefined;
  const exact = error.errors[fieldName];
  const pascal = error.errors[fieldName.charAt(0).toUpperCase() + fieldName.slice(1)];
  return exact?.[0] ?? pascal?.[0];
}

export function getApiErrorEntries(error: unknown) {
  if (!(error instanceof ApiError) || !error.errors) return [];
  return Object.entries(error.errors).flatMap(([field, messages]) => messages.map((message) => ({ field, message })));
}