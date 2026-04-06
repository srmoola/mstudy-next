import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export const metadata = { title: "Dashboard – MStudy" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, year, gender, location_preference, time_preference, day_preference")
    .eq("id", user.id)
    .single();

  if (
    !profile?.year ||
    !profile?.gender ||
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

  return (
    <DashboardClient
      firstName={profile.first_name}
      initialCourses={courses}
    />
  );
}
