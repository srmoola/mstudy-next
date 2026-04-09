"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const firstName = (form.get("first_name") as string).trim();
    const lastName = (form.get("last_name") as string).trim();
    const email = (form.get("email") as string).trim().toLowerCase();
    const password = form.get("password") as string;
    const passwordConfirmation = form.get("password_confirmation") as string;
    const umichEmailRegex = /^[^\s@]+@umich\.edu$/;

    const errs: string[] = [];
    if (!firstName) errs.push("First name can't be blank");
    if (!lastName) errs.push("Last name can't be blank");
    if (!email) errs.push("Email can't be blank");
    if (email && !umichEmailRegex.test(email)) {
      errs.push("Invalid email. You must register with an @umich.edu email address.");
    }
    if (password.length < 6) errs.push("Password must be at least 6 characters");
    if (password !== passwordConfirmation) errs.push("Password confirmation doesn't match");

    if (errs.length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (!profileLookupError && existingProfile) {
      setErrors([
        "An account with this email already exists. If this is you, sign in below.",
      ]);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/api/auth/confirm?next=/onboarding`,
      },
    });

    if (error) {
      const lower = error.message.toLowerCase();
      const looksLikeDuplicate =
        lower.includes("already registered") ||
        lower.includes("already been registered") ||
        lower.includes("user already") ||
        lower.includes("email address is already");
      setErrors([
        looksLikeDuplicate
          ? "An account with this email already exists. If this is you, sign in below."
          : error.message,
      ]);
      setLoading(false);
      return;
    }

    router.push("/check-your-email");
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Join MStudy
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Create your account
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Sign up with your email and we&apos;ll send you a verification link to get started.
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
              <label htmlFor="first_name" className="block text-sm font-semibold text-umBlue">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoFocus
                placeholder="e.g. Alex"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold text-umBlue">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                placeholder="e.g. Johnson"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-umBlue">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="e.g. alex@umich.edu"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-umBlue">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-semibold text-umBlue"
              >
                Confirm password<span className="text-red-500">*</span>
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
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
