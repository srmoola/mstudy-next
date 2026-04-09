"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { YEARS, GENDERS, LOCATIONS, TIMES, DAYS } from "@/lib/types";

interface ProfileForm {
  first_name: string;
  last_name: string;
  gender: string;
  year: string;
  match_same_gender: string;
  location_preference: string[];
  time_preference: string[];
  day_preference: string[];
}

export default function ProfilePage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    gender: "",
    year: "",
    match_same_gender: "",
    location_preference: [],
    time_preference: [],
    day_preference: [],
  });

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, gender, year, match_same_gender, location_preference, time_preference, day_preference"
        )
        .eq("id", user.id)
        .single();

      if (prof) {
        setProfile({
          first_name: prof.first_name || "",
          last_name: prof.last_name || "",
          gender: prof.gender || "",
          year: prof.year || "",
          match_same_gender:
            prof.match_same_gender === true ? "true" : prof.match_same_gender === false ? "false" : "",
          location_preference: prof.location_preference || [],
          time_preference: prof.time_preference || [],
          day_preference: prof.day_preference || [],
        });
      }

      setLoaded(true);
    }

    loadProfile();
  }, [router, supabase]);

  function toggleArrayPref(
    field: "location_preference" | "time_preference" | "day_preference",
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const errs: string[] = [];
    if (!profile.first_name.trim()) errs.push("First name is required");
    if (!profile.last_name.trim()) errs.push("Last name is required");
    if (!profile.gender) errs.push("Gender is required");
    if (!profile.year) errs.push("Year is required");
    if (profile.match_same_gender === "") errs.push("Match preference is required");
    if (!profile.location_preference.length) errs.push("Pick at least one location");
    if (!profile.time_preference.length) errs.push("Pick at least one study time");
    if (!profile.day_preference.length) errs.push("Pick at least one day");

    if (errs.length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrors(["Not authenticated"]);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        gender: profile.gender,
        year: profile.year,
        match_same_gender: profile.match_same_gender === "true",
        location_preference: profile.location_preference,
        time_preference: profile.time_preference,
        day_preference: profile.day_preference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setErrors([error.message]);
      setLoading(false);
      return;
    }

    router.push("/dashboard?notice=" + encodeURIComponent("Profile updated."));
    router.refresh();
  }

  if (!loaded) {
    return (
      <main className="min-h-screen w-full bg-white text-umBlue">
        <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
          <p className="text-sm text-slate-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">Your account</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Edit profile</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Update your information and matching preferences. Class enrollment is managed from your
            dashboard.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-umBlue">
                  First name<span className="text-red-500">*</span>
                </label>
                <input
                  value={profile.first_name}
                  onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-umBlue">
                  Last name<span className="text-red-500">*</span>
                </label>
                <input
                  value={profile.last_name}
                  onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-umBlue placeholder-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Gender<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
                {GENDERS.map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-umMaize"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={profile.gender === g}
                      onChange={() => setProfile((p) => ({ ...p, gender: g }))}
                      className="h-4 w-4 text-umBlue"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Year<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                {YEARS.map((y) => (
                  <label
                    key={y}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-umMaize"
                  >
                    <input
                      type="radio"
                      name="year"
                      value={y}
                      checked={profile.year === y}
                      onChange={() => setProfile((p) => ({ ...p, year: y }))}
                      className="h-4 w-4 text-umBlue"
                    />
                    <span>{y}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Match preference<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex flex-col gap-2 text-sm sm:flex-row">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-umMaize">
                  <input
                    type="radio"
                    name="match_same_gender"
                    value="true"
                    checked={profile.match_same_gender === "true"}
                    onChange={() => setProfile((p) => ({ ...p, match_same_gender: "true" }))}
                    className="h-4 w-4 text-umBlue"
                  />
                  <span>Yes, same gender only</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-umMaize">
                  <input
                    type="radio"
                    name="match_same_gender"
                    value="false"
                    checked={profile.match_same_gender === "false"}
                    onChange={() => setProfile((p) => ({ ...p, match_same_gender: "false" }))}
                    className="h-4 w-4 text-umBlue"
                  />
                  <span>Doesn&apos;t matter</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Where do you like to study?<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex flex-wrap gap-3 text-sm">
                {LOCATIONS.map((loc) => (
                  <label
                    key={loc}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-umMaize"
                  >
                    <input
                      type="checkbox"
                      checked={profile.location_preference.includes(loc)}
                      onChange={() => toggleArrayPref("location_preference", loc)}
                      className="h-4 w-4 text-umBlue"
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                When do you usually study?<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex flex-wrap gap-3 text-sm">
                {TIMES.map((time) => (
                  <label
                    key={time}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-umMaize"
                  >
                    <input
                      type="checkbox"
                      checked={profile.time_preference.includes(time)}
                      onChange={() => toggleArrayPref("time_preference", time)}
                      className="h-4 w-4 text-umBlue"
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Which days work for you?<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex flex-wrap gap-2 text-sm">
                {DAYS.map((day) => (
                  <label
                    key={day}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-umMaize"
                  >
                    <input
                      type="checkbox"
                      checked={profile.day_preference.includes(day)}
                      onChange={() => toggleArrayPref("day_preference", day)}
                      className="h-4 w-4 text-umBlue"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
