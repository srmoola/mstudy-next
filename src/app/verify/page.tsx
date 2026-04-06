"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResendVerificationPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/confirm?next=/onboarding`,
      },
    });

    if (error) {
      setErrors([error.message]);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Email verification
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Resend verification email
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Enter your email below and we&apos;ll send you a new verification link.
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

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Verification email sent! Check your inbox.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-umBlue">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="e.g. alex@umich.edu"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
