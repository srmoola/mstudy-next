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

  const { data: existing } = await supabase
    .from("user_classes")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You are already signed up for this course" },
      { status: 422 }
    );
  }

  const { error: insertError } = await supabase
    .from("user_classes")
    .insert({ user_id: user.id, course_id: courseId });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await supabase
    .from("courses")
    .update({ number_students: (course.number_students || 0) + 1 })
    .eq("id", courseId);

  return NextResponse.json({
    course: {
      id: course.id,
      course_name: course.course_name,
      number_students: (course.number_students || 0) + 1,
    },
  });
}
