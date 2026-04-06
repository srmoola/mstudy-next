"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { YEARS, GENDERS, LOCATIONS, TIMES, DAYS } from "@/lib/types";

interface CourseOption {
  id: number;
  name: string;
}

export default function OnboardingPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CourseOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Map<number, string>>(new Map());
  const [profile, setProfile] = useState<{
    gender: string;
    year: string;
    match_same_gender: string;
    location_preference: string[];
    time_preference: string[];
    day_preference: string[];
  }>({
    gender: "",
    year: "",
    match_same_gender: "",
    location_preference: [],
    time_preference: [],
    day_preference: [],
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("gender, year, match_same_gender, location_preference, time_preference, day_preference")
        .eq("id", user.id)
        .single();

      if (prof) {
        setProfile({
          gender: prof.gender || "",
          year: prof.year || "",
          match_same_gender: prof.match_same_gender ? "true" : prof.match_same_gender === false ? "false" : "",
          location_preference: prof.location_preference || [],
          time_preference: prof.time_preference || [],
          day_preference: prof.day_preference || [],
        });
      }

      const { data: enrollments } = await supabase
        .from("user_classes")
        .select("course_id, courses(id, course_name)")
        .eq("user_id", user.id);

      if (enrollments) {
        const map = new Map<number, string>();
        for (const e of enrollments) {
          const course = e.courses as unknown as { id: number; course_name: string };
          if (course) map.set(course.id, course.course_name);
        }
        setSelectedCourses(map);
      }
    }
    loadProfile();
  }, [supabase]);

  const runSearch = useCallback(async (q: string) => {
    if (q.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const { data } = await supabase
      .from("courses")
      .select("id, course_name")
      .ilike("course_name", `%${q}%`)
      .order("course_name")
      .limit(20);

    if (data) {
      setSearchResults(data.map((c) => ({ id: c.id, name: c.course_name })));
      setShowResults(true);
    }
  }, [supabase]);

  function handleSearchInput(val: string) {
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 200);
  }

  function addCourse(course: CourseOption) {
    setSelectedCourses((prev) => new Map(prev).set(course.id, course.name));
    setSearchQuery("");
    setShowResults(false);
  }

  function removeCourse(id: number) {
    setSelectedCourses((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrors(["Not authenticated"]);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        gender: profile.gender,
        year: profile.year,
        match_same_gender: profile.match_same_gender === "true",
        location_preference: profile.location_preference,
        time_preference: profile.time_preference,
        day_preference: profile.day_preference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setErrors([updateError.message]);
      setLoading(false);
      return;
    }

    const newCourseIds = Array.from(selectedCourses.keys());

    const { data: existingEnrollments } = await supabase
      .from("user_classes")
      .select("course_id")
      .eq("user_id", user.id);

    const oldIds = (existingEnrollments || []).map((e) => e.course_id);
    const toRemove = oldIds.filter((id) => !newCourseIds.includes(id));
    const toAdd = newCourseIds.filter((id) => !oldIds.includes(id));

    for (const courseId of toRemove) {
      await supabase.from("user_classes").delete().eq("user_id", user.id).eq("course_id", courseId);
      await supabase.rpc("decrement_course_students", { cid: courseId });
    }

    for (const courseId of toAdd) {
      await supabase.from("user_classes").insert({ user_id: user.id, course_id: courseId });
      await supabase.rpc("increment_course_students", { cid: courseId });
    }

    router.push("/dashboard?notice=" + encodeURIComponent("Onboarding complete! You're ready to find a study partner."));
    router.refresh();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Tell us how you study
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Onboarding</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            A few quick questions so we can match you with the right Michigan study partners.
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
            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Gender<span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Used only for matching if you choose same-gender matches.
              </p>
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
                      required
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year */}
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
                      required
                    />
                    <span>{y}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Match same gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Match preference<span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Choose if you only want same-gender matches or if it doesn&apos;t matter.
              </p>
              <div className="mt-1 flex flex-col gap-2 text-sm sm:flex-row">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-umMaize">
                  <input
                    type="radio"
                    name="match_same_gender"
                    value="true"
                    checked={profile.match_same_gender === "true"}
                    onChange={() => setProfile((p) => ({ ...p, match_same_gender: "true" }))}
                    className="h-4 w-4 text-umBlue"
                    required
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

            {/* Location preference */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Where do you like to study?<span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">Pick at least one.</p>
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

            {/* Time preference */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                When do you usually study?<span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">Pick at least one.</p>
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

            {/* Courses */}
            <div className="space-y-2" ref={searchRef}>
              <label className="block text-sm font-semibold text-umBlue">
                Which courses are you in?
              </label>
              <p className="text-xs text-slate-500">
                Type at least three characters to search 14,000+ courses. Click a course to add
                it; remove with <span className="font-medium">&times;</span>.
              </p>

              <div className="relative mt-1">
                <input
                  type="search"
                  autoComplete="off"
                  placeholder="e.g. EECS 203"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => searchQuery.length >= 3 && runSearch(searchQuery)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-umBlue shadow-sm placeholder:text-slate-400 focus:border-umMaize focus:outline-none focus:ring-2 focus:ring-umMaize/40"
                />
                {showResults && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {searchResults.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-500">
                        No courses match. Try different keywords.
                      </p>
                    ) : (
                      searchResults.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => addCourse(c)}
                          className="block w-full px-3 py-2 text-left text-sm text-umBlue hover:bg-slate-100"
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Chips */}
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(selectedCourses.entries()).map(([id, name]) => (
                  <div
                    key={id}
                    className="group relative inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 pr-6 text-xs font-medium text-umBlue shadow-sm"
                  >
                    <span className="truncate">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeCourse(id)}
                      className="absolute right-0.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      aria-label={`Remove ${name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Day preference */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-umBlue">
                Which days work for you?<span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">Pick at least one.</p>
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
                {loading ? "Saving..." : "Save and continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
