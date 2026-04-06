import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const courseId = body.course_id;

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("user_classes")
    .delete()
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const newCount = Math.max((course.number_students || 0) - 1, 0);
  await supabase.from("courses").update({ number_students: newCount }).eq("id", courseId);

  return NextResponse.json({ success: true });
}
