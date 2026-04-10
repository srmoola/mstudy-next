import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RespondActions from "./respond-actions";

export async function generateMetadata() {
  return { title: "Respond to Match – MStudy" };
}

export default async function RespondPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!match) {
    redirect("/dashboard?alert=" + encodeURIComponent("Match not found."));
  }

  if (match.receiver_id !== user.id) {
    redirect(
      "/dashboard?alert=" +
        encodeURIComponent("You are not authorized to respond to this match.")
    );
  }

  if (match.status !== 0) {
    redirect(
      "/matches?notice=" +
        encodeURIComponent("This match has already been responded to.")
    );
  }

  const [requesterProfile, course] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "first_name, last_name, year, gender, location_preference, time_preference, day_preference"
      )
      .eq("id", match.requester_id)
      .single(),
    supabase
      .from("courses")
      .select("course_name")
      .eq("id", match.course_id)
      .single(),
  ]);

  if (!requesterProfile.data || !course.data) {
    redirect("/dashboard?alert=" + encodeURIComponent("Could not load match details."));
  }

  const p = requesterProfile.data;

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-lg px-3 py-10 sm:px-6 sm:py-14">
        <Link
          href="/matches"
          className="inline-block text-sm font-medium text-umBlue/60 hover:text-umMaize transition mb-8"
        >
          &larr; Your matches
        </Link>

        <header className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            {course.data.course_name}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Study Partner Request
          </h1>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-br from-umBlue to-[#001633] px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-black text-white">
                {p.first_name[0]}
                {p.last_name[0]}
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-sm text-white/60">{p.year}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </p>
                <p className="text-sm font-medium text-umBlue">
                  {p.location_preference.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Preferred times
                </p>
                <p className="text-sm font-medium text-umBlue">
                  {p.time_preference.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Available days
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {p.day_preference.map((day: string) => (
                    <span
                      key={day}
                      className="rounded-full bg-umBlue/5 px-2.5 py-0.5 text-xs font-medium text-umBlue"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <RespondActions matchId={match.id} />
        </div>
      </div>
    </main>
  );
}
