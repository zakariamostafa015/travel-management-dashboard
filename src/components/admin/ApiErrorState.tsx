import { Alert } from "@/components/ui/alert";
import { getApiErrorEntries, getApiErrorMessage } from "@/lib/api-errors";

export function ApiErrorState({ error, fallback }: { error: unknown; fallback?: string }) {
  if (!error) return null;
  const entries = getApiErrorEntries(error);

  return (
    <Alert>
      <p>{getApiErrorMessage(error, fallback)}</p>
      {entries.length ? (
        <ul className="mt-2 list-inside list-disc text-xs">
          {entries.map((entry) => (
            <li key={`${entry.field}-${entry.message}`}>
              <span className="font-medium">{entry.field}:</span> {entry.message}
            </li>
          ))}
        </ul>
      ) : null}
    </Alert>
  );
}