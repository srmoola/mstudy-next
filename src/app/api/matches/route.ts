import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import MatchRequestEmail from "@/emails/match-request";

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

  const { data: existingPending } = await supabase
    .from("matches")
    .select("id")
    .eq("requester_id", user.id)
    .eq("course_id", course_id)
    .eq("status", 0)
    .maybeSingle();

  if (existingPending) {
    return NextResponse.json(
      { error: "You already have a pending match request for this class." },
      { status: 422 }
    );
  }

  const { data: previousMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("course_id", course_id)
    .or(
      `and(requester_id.eq.${user.id},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${user.id})`
    )
    .maybeSingle();

  if (previousMatch) {
    return NextResponse.json(
      { error: "You've already been matched with this person for this class." },
      { status: 422 }
    );
  }

  const { data: match, error: insertError } = await supabase
    .from("matches")
    .insert({
      requester_id: user.id,
      receiver_id,
      course_id,
      status: 0,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  try {
    const [requesterProfile, receiverProfile, course] = await Promise.all([
      supabase.from("profiles").select("first_name, last_name").eq("id", user.id).single(),
      supabase.from("profiles").select("first_name, last_name, email").eq("id", receiver_id).single(),
      supabase.from("courses").select("course_name").eq("id", course_id).single(),
    ]);

    if (receiverProfile.data && requesterProfile.data && course.data) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const respondUrl = `${appUrl}/matches/${match.id}/respond`;

      const html = await render(
        MatchRequestEmail({
          receiverName: receiverProfile.data.first_name,
          requesterName: `${requesterProfile.data.first_name} ${requesterProfile.data.last_name}`,
          courseName: course.data.course_name,
          respondUrl,
        })
      );

      await sendEmail({
        to: receiverProfile.data.email,
        subject: `${requesterProfile.data.first_name} wants to study with you in ${course.data.course_name}`,
        html,
      });
    }
  } catch (emailErr) {
    console.error("Failed to send match request email:", emailErr);
  }

  return NextResponse.json({ success: true });
}
