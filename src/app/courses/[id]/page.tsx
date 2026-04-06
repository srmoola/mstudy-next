import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("course_name")
    .eq("id", Number(id))
    .single();
  return { title: course ? `${course.course_name} – MStudy` : "Course – MStudy" };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: pendingMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("requester_id", user.id)
    .eq("course_id", course.id)
    .eq("status", 0)
    .limit(1)
    .maybeSingle();

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <Link
          href="/dashboard"
          className="inline-block text-sm font-medium text-umBlue/60 hover:text-umMaize transition mb-8"
        >
          &larr; Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-umBlue to-[#001633] px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">Class</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {course.course_name}
            </h1>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-8">
            {/* Student count */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-umBlue/10 text-umBlue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Students in Class</p>
                <p className="text-2xl font-black text-umBlue">{course.number_students ?? 0}</p>
              </div>
            </div>

            {/* Match button */}
            <div>
              {pendingMatch ? (
                <div className="rounded-xl border border-umMaize/30 bg-umMaize/10 px-5 py-4 text-sm text-umBlue">
                  <p className="font-semibold">Match request pending</p>
                  <p className="mt-1 text-umBlue/60">
                    You already have an active match request for this class. Hang tight!
                  </p>
                </div>
              ) : (
                <>
                  <Link
                    href={`/courses/${course.id}/matches`}
                    className="block w-full rounded-full bg-umMaize px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.2em] text-umBlue shadow-md shadow-umMaize/30 transition hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-umMaize focus:ring-offset-2"
                  >
                    Match
                  </Link>
                  <p className="mt-3 text-center text-xs text-slate-400">
                    Find a study partner in this class
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
