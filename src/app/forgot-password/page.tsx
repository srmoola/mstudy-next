"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();

    if (!email.endsWith("@umich.edu")) {
      setErrors(["Please enter a valid @umich.edu email address."]);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/confirm?next=/reset-password`,
    });

    if (error) {
      setErrors([error.message]);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="min-h-screen w-full bg-white text-umBlue">
        <div className="mx-auto flex max-w-lg flex-col items-center px-3 py-16 text-center sm:px-6 sm:py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-umBlue to-umMaize text-4xl text-white shadow-lg shadow-umBlue/30">
            &#9993;
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Check your email
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            If an account exists with that email, we&apos;ve sent a password reset link.
            Click the link in the email to set a new password.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            If you don&apos;t see it, check your spam folder.
          </p>

          <div className="mt-8">
            <Link
              href="/signin"
              className="text-sm font-semibold text-umBlue underline decoration-umMaize underline-offset-4 transition hover:text-umMaize"
            >
              Back to sign in
            </Link>
          </div>
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
            Reset your password
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Enter the email address you signed up with and we&apos;ll send you a link
            to reset your password.
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
              <label htmlFor="email" className="block text-sm font-semibold text-umBlue">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="e.g. alex@umich.edu"
                autoComplete="email"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-full bg-linear-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>

            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="font-semibold text-umBlue underline decoration-umMaize underline-offset-4 hover:text-umMaize"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
