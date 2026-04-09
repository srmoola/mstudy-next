"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const currentPassword = form.get("current_password") as string;
    const newPassword = form.get("new_password") as string;
    const confirmNewPassword = form.get("confirm_new_password") as string;

    const errs: string[] = [];
    if (!currentPassword) errs.push("Current password can't be blank");
    if (newPassword.length < 6) errs.push("New password must be at least 6 characters");
    if (newPassword !== confirmNewPassword) errs.push("New password confirmation doesn't match");
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errs.push("New password must be different from your current password");
    }

    if (errs.length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setErrors(["Unable to verify your account. Please sign in again."]);
      setLoading(false);
      return;
    }

    // Re-authenticate to verify the entered current password.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (reauthError) {
      setErrors(["Current password is incorrect"]);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setErrors([updateError.message]);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/signin?notice=" + encodeURIComponent("Password changed. Please sign in again."));
    router.refresh();
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Account security
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Change password</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Enter your current password and choose a new one.
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
              <label htmlFor="current_password" className="block text-sm font-semibold text-umBlue">
                Current password<span className="text-red-500">*</span>
              </label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                required
                autoFocus
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-semibold text-umBlue">
                New password<span className="text-red-500">*</span>
              </label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div>
              <label
                htmlFor="confirm_new_password"
                className="block text-sm font-semibold text-umBlue"
              >
                Confirm new password<span className="text-red-500">*</span>
              </label>
              <input
                id="confirm_new_password"
                name="confirm_new_password"
                type="password"
                required
                minLength={6}
                placeholder="Re-enter your new password"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
