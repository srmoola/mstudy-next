import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findMatches } from "@/lib/match-finder";
import type { Profile } from "@/lib/types";
import MatchCards from "./match-cards";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("course_name")
    .eq("id", Number(id))
    .single();
  return {
    title: course ? `Find a Partner – ${course.course_name} – MStudy` : "Find a Partner – MStudy",
  };
}

export default async function MatchesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!course) redirect("/dashboard?alert=" + encodeURIComponent("Course not found."));

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!currentProfile) redirect("/onboarding");

  const { data: enrollments } = await supabase
    .from("user_classes")
    .select("user_id")
    .eq("course_id", course.id);

  const classUserIds = (enrollments || []).map((e) => e.user_id).filter((uid) => uid !== user.id);

  let suggestions: Profile[] = [];
  if (classUserIds.length > 0) {
    const { data: candidates } = await supabase
      .from("profiles")
      .select("*")
      .in("id", classUserIds);

    if (candidates) {
      suggestions = findMatches(currentProfile as Profile, candidates as Profile[]);
    }
  }

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14">
        <Link
          href={`/courses/${course.id}`}
          className="inline-block text-sm font-medium text-umBlue/60 hover:text-umMaize transition mb-8"
        >
          &larr; Back to {course.course_name}
        </Link>

        <header className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            {course.course_name}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Suggested Partners
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {suggestions.length} compatible{" "}
            {suggestions.length === 1 ? "partner" : "partners"} found
          </p>
        </header>

        {suggestions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-umBlue">No matches yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Check back later as more students join this class.
            </p>
          </div>
        ) : (
          <MatchCards
            suggestions={suggestions}
            courseId={course.id}
            courseName={course.course_name}
          />
        )}
      </div>
    </main>
  );
}
