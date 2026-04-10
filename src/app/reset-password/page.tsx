"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace(
          "/signin?alert=" +
            encodeURIComponent("Invalid or expired reset link. Please request a new one.")
        );
        return;
      }
      setHasSession(true);
      setChecking(false);
    });
  }, [supabase, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const newPassword = form.get("new_password") as string;
    const confirmPassword = form.get("confirm_password") as string;

    const errs: string[] = [];
    if (newPassword.length < 6) errs.push("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) errs.push("Passwords don't match.");

    if (errs.length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setErrors([error.message]);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push(
      "/signin?notice=" +
        encodeURIComponent("Password reset successfully. Please sign in with your new password.")
    );
    router.refresh();
  }

  if (checking || !hasSession) {
    return (
      <main className="min-h-screen w-full bg-white text-umBlue">
        <div className="mx-auto flex max-w-lg items-center justify-center px-3 py-24">
          <p className="text-sm text-slate-500">Verifying reset link...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Account recovery
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Set a new password
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Choose a new password for your account.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:mt-10 sm:p-8">
          {errors.length > 0 && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">Please fix the following:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errors.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new_password" className="block text-sm font-semibold text-umBlue">
                New password<span className="text-red-500">*</span>
              </label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                required
                autoFocus
                minLength={6}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-semibold text-umBlue">
                Confirm new password<span className="text-red-500">*</span>
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                minLength={6}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-full bg-linear-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
