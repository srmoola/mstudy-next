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
  const { course_id, receiver_id } = body;

  const { data: existingMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("requester_id", user.id)
    .eq("course_id", course_id)
    .eq("status", 0)
    .maybeSingle();

  if (existingMatch) {
    return NextResponse.json(
      { error: "You already have a pending match request for this class." },
      { status: 422 }
    );
  }

  const { error: insertError } = await supabase.from("matches").insert({
    requester_id: user.id,
    receiver_id,
    course_id,
    status: 0,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
