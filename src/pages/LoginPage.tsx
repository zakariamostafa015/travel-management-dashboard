import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plane } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useAuth } from "@/auth/AuthProvider";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username, password);
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <form onSubmit={(event) => void submit(event)} className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground">
              <Plane className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-semibold">Admin sign in</h1>
              <p className="text-sm text-muted-foreground">Manage tours, content, requests, and settings.</p>
            </div>
          </div>

          {error ? <Alert className="mb-4">{error}</Alert> : null}

          <div className="space-y-4">
            <Field label="Username">
              <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Password">
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </div>
        </form>
      </section>
      <section className="hidden bg-[#181715] p-10 text-[#faf9f5] lg:flex lg:flex-col lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium text-[#cc785c]">Travel operations cockpit</p>
          <h2 className="font-display text-6xl font-semibold leading-tight">A calmer way to keep every journey ready.</h2>
          <p className="mt-6 text-lg leading-8 text-[#d7d1c8]">
            The dashboard keeps content editing, language work, bookings, and user administration in one focused operational workspace.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-[#d7d1c8]">
          <div className="rounded-lg bg-[#252320] p-4">Tours</div>
          <div className="rounded-lg bg-[#252320] p-4">Bookings</div>
          <div className="rounded-lg bg-[#252320] p-4">Languages</div>
        </div>
      </section>
    </div>
  );
}