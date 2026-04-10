import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export const metadata = { title: "Dashboard – MStudy" };

type MatchRow = {
  id: number;
  requester_id: string;
  receiver_id: string;
  course_id: number;
  status: number;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, year, gender, match_same_gender, location_preference, time_preference, day_preference")
    .eq("id", user.id)
    .single();

  if (
    !profile?.year ||
    !profile?.gender ||
    (profile?.match_same_gender !== true && profile?.match_same_gender !== false) ||
    !profile?.location_preference?.length ||
    !profile?.time_preference?.length ||
    !profile?.day_preference?.length
  ) {
    redirect("/onboarding?alert=" + encodeURIComponent("Finish onboarding to open your dashboard."));
  }

  const { data: enrollments } = await supabase
    .from("user_classes")
    .select("course_id, courses(id, course_name, number_students)")
    .eq("user_id", user.id)
    .order("course_id");

  const courses = (enrollments || []).map((e) => {
    const c = e.courses as unknown as {
      id: number;
      course_name: string;
      number_students: number;
    };
    return c;
  }).filter(Boolean);

  const { data: matchRows } = await supabase
    .from("matches")
    .select("*")
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(10);

  const allMatches = (matchRows || []) as MatchRow[];

  const partnerIds = [
    ...new Set(
      allMatches.map((m) =>
        m.requester_id === user.id ? m.receiver_id : m.requester_id
      )
    ),
  ];
  const courseIds = [...new Set(allMatches.map((m) => m.course_id))];

  const [profilesResult, matchCoursesResult] = await Promise.all([
    partnerIds.length > 0
      ? supabase.from("profiles").select("id, first_name, last_name").in("id", partnerIds)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase.from("courses").select("id, course_name").in("id", courseIds)
      : Promise.resolve({ data: [] }),
  ]);

  const matchesForClient = allMatches.map((m) => {
    const partnerId = m.requester_id === user.id ? m.receiver_id : m.requester_id;
    const partner = (profilesResult.data || []).find((p) => p.id === partnerId);
    const course = (matchCoursesResult.data || []).find((c) => c.id === m.course_id);
    const isIncoming = m.receiver_id === user.id;
    return {
      id: m.id,
      status: m.status,
      partnerName: partner ? `${partner.first_name} ${partner.last_name}` : "Unknown",
      partnerInitials: partner ? `${partner.first_name[0]}${partner.last_name[0]}` : "??",
      courseName: course?.course_name || "Unknown Course",
      isIncoming,
    };
  });

  return (
    <DashboardClient
      firstName={profile.first_name}
      initialCourses={courses}
      matches={matchesForClient}
    />
  );
}
