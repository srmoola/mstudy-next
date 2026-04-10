import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Your Matches – MStudy" };

type MatchRow = {
  id: number;
  requester_id: string;
  receiver_id: string;
  course_id: number;
  status: number;
  created_at: string;
  updated_at: string;
};

function statusLabel(status: number) {
  switch (status) {
    case 0:
      return { text: "Pending", color: "bg-amber-100 text-amber-700" };
    case 1:
      return { text: "Accepted", color: "bg-emerald-100 text-emerald-700" };
    case 2:
      return { text: "Declined", color: "bg-red-100 text-red-600" };
    case 3:
      return { text: "Expired", color: "bg-slate-100 text-slate-500" };
    default:
      return { text: "Unknown", color: "bg-slate-100 text-slate-500" };
  }
}

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const allMatches = (matches || []) as MatchRow[];

  const partnerIds = [
    ...new Set(
      allMatches.map((m) =>
        m.requester_id === user.id ? m.receiver_id : m.requester_id
      )
    ),
  ];
  const courseIds = [...new Set(allMatches.map((m) => m.course_id))];

  const [profilesResult, coursesResult] = await Promise.all([
    partnerIds.length > 0
      ? supabase.from("profiles").select("id, first_name, last_name, email").in("id", partnerIds)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase.from("courses").select("id, course_name").in("id", courseIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map(
    (profilesResult.data || []).map((p) => [p.id, p])
  );
  const courseMap = new Map(
    (coursesResult.data || []).map((c) => [c.id, c])
  );

  const pending = allMatches.filter(
    (m) => m.status === 0 && m.receiver_id === user.id
  );
  const active = allMatches.filter((m) => m.status === 1);
  const sent = allMatches.filter(
    (m) => m.status === 0 && m.requester_id === user.id
  );
  const past = allMatches.filter((m) => m.status === 2 || m.status === 3);

  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <Link
          href="/dashboard"
          className="inline-block text-sm font-medium text-umBlue/60 hover:text-umMaize transition mb-8"
        >
          &larr; Dashboard
        </Link>

        <header className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Matches
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Your Matches
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 sm:text-base">
            Manage your study partner connections.
          </p>
        </header>

        {/* Incoming requests */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-umBlue mb-1">
              Incoming Requests
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Someone wants to study with you!
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pending.map((m) => {
                const partner = profileMap.get(m.requester_id);
                const course = courseMap.get(m.course_id);
                return (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-umMaize/40 bg-umMaize/5 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-umBlue text-sm font-bold text-white">
                        {partner?.first_name?.[0]}
                        {partner?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-umBlue">
                          {partner?.first_name} {partner?.last_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {course?.course_name}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/matches/${m.id}/respond`}
                      className="block w-full rounded-full bg-umMaize px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-umBlue shadow-sm transition hover:bg-yellow-400"
                    >
                      Review &amp; Respond
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Accepted matches */}
        {active.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-umBlue mb-1">
              Active Partners
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Your accepted study partners.
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {active.map((m) => {
                const partnerId =
                  m.requester_id === user.id
                    ? m.receiver_id
                    : m.requester_id;
                const partner = profileMap.get(partnerId);
                const course = courseMap.get(m.course_id);
                const { text, color } = statusLabel(m.status);
                return (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                          {partner?.first_name?.[0]}
                          {partner?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-umBlue">
                            {partner?.first_name} {partner?.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course?.course_name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}
                      >
                        {text}
                      </span>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Contact
                      </p>
                      <p className="text-sm font-medium text-umBlue">
                        {partner?.email}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Sent requests */}
        {sent.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-umBlue mb-1">
              Sent Requests
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Waiting for a response.
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sent.map((m) => {
                const partner = profileMap.get(m.receiver_id);
                const course = courseMap.get(m.course_id);
                const { text, color } = statusLabel(m.status);
                return (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-umBlue/10 text-sm font-bold text-umBlue">
                          {partner?.first_name?.[0]}
                          {partner?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-umBlue">
                            {partner?.first_name} {partner?.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course?.course_name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}
                      >
                        {text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Past matches */}
        {past.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-umBlue mb-1">Past</h2>
            <p className="text-sm text-slate-500 mb-4">
              Declined or expired matches.
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {past.map((m) => {
                const partnerId =
                  m.requester_id === user.id
                    ? m.receiver_id
                    : m.requester_id;
                const partner = profileMap.get(partnerId);
                const course = courseMap.get(m.course_id);
                const { text, color } = statusLabel(m.status);
                return (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 opacity-60 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                          {partner?.first_name?.[0]}
                          {partner?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-umBlue">
                            {partner?.first_name} {partner?.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course?.course_name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}
                      >
                        {text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {allMatches.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-umBlue">No matches yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Head to one of your courses and tap &ldquo;Match&rdquo; to find a study
              partner!
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-full bg-umBlue px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#001633]"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
