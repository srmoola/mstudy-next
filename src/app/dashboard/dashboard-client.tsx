"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface CourseInfo {
  id: number;
  course_name: string;
  number_students: number;
}

export default function DashboardClient({
  firstName,
  initialCourses,
}: {
  firstName: string;
  initialCourses: CourseInfo[];
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

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

  async function addCourse(courseId: number) {
    const res = await fetch("/api/courses/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
    });

    const data = await res.json();
    if (!res.ok) {
      router.push("/dashboard?alert=" + encodeURIComponent(data.error || "Failed to add course"));
      return;
    }

    setCourses((prev) => [
      ...prev,
      { id: data.course.id, course_name: data.course.course_name, number_students: data.course.number_students },
    ]);
    setSearchQuery("");
    setShowResults(false);
    setPanelOpen(false);
  }

  async function removeCourse(courseId: number) {
    const res = await fetch("/api/courses/unenroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
    });

    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, {firstName}!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Your study partner dashboard. Add or remove courses anytime.
          </p>
        </header>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-umBlue">Your courses</h2>
          <p className="mt-1 text-sm text-slate-600">
            Remove a course with &times; or tap + to add another.
          </p>

          <ul className="mt-6 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <li
                key={course.id}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm transition hover:border-umMaize hover:shadow-md"
              >
                <Link href={`/courses/${course.id}`} className="block p-4 pr-10">
                  <p className="text-sm font-semibold leading-snug text-umBlue">
                    {course.course_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.number_students} {course.number_students === 1 ? "student" : "students"}{" "}
                    in app
                  </p>
                </Link>
                <button
                  onClick={() => removeCourse(course.id)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-base leading-none text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  &times;
                </button>
              </li>
            ))}

            <li>
              <button
                type="button"
                onClick={() => setPanelOpen(!panelOpen)}
                className="flex h-full min-h-[5.5rem] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition hover:border-umMaize hover:bg-amber-50/40 hover:text-umBlue"
              >
                <span className="text-3xl font-light leading-none text-umMaize">+</span>
                <span className="text-xs font-semibold uppercase tracking-wide">Add course</span>
              </button>
            </li>
          </ul>

          {panelOpen && (
            <div
              ref={panelRef}
              className="relative mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-md"
            >
              <p className="text-sm font-semibold text-umBlue">Search courses</p>
              <p className="text-xs text-slate-500">
                Search by code or name, then pick a course to enroll.
              </p>

              <div className="relative mt-2">
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
                          onClick={() => addCourse(c.id)}
                          className="block w-full px-3 py-2 text-left text-sm text-umBlue hover:bg-slate-100"
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
