import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 3) {
    return NextResponse.json({ courses: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("id, course_name")
    .ilike("course_name", `%${q}%`)
    .order("course_name")
    .limit(20);

  return NextResponse.json({
    courses: (courses || []).map((c) => ({ id: c.id, name: c.course_name })),
  });
}
