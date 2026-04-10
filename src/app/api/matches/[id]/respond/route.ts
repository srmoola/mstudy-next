import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import MatchAcceptedEmail from "@/emails/match-accepted";
import MatchDeclinedEmail from "@/emails/match-declined";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body as { action: "accept" | "decline" };

  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: match, error: fetchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (fetchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.receiver_id !== user.id) {
    return NextResponse.json({ error: "Not authorized to respond to this match" }, { status: 403 });
  }

  if (match.status !== 0) {
    return NextResponse.json({ error: "This match has already been responded to" }, { status: 422 });
  }

  const newStatus = action === "accept" ? 1 : 2;
  const { error: updateError } = await supabase
    .from("matches")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", match.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  try {
    const [requesterProfile, receiverProfile, course] = await Promise.all([
      supabase.from("profiles").select("first_name, last_name, email").eq("id", match.requester_id).single(),
      supabase.from("profiles").select("first_name, last_name, email").eq("id", match.receiver_id).single(),
      supabase.from("courses").select("course_name").eq("id", match.course_id).single(),
    ]);

    if (!requesterProfile.data || !receiverProfile.data || !course.data) {
      throw new Error("Missing profile or course data");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const matchesUrl = `${appUrl}/matches`;

    if (action === "accept") {
      const requesterHtml = await render(
        MatchAcceptedEmail({
          recipientName: requesterProfile.data.first_name,
          partnerName: `${receiverProfile.data.first_name} ${receiverProfile.data.last_name}`,
          partnerEmail: receiverProfile.data.email,
          courseName: course.data.course_name,
          matchesUrl,
        })
      );

      const receiverHtml = await render(
        MatchAcceptedEmail({
          recipientName: receiverProfile.data.first_name,
          partnerName: `${requesterProfile.data.first_name} ${requesterProfile.data.last_name}`,
          partnerEmail: requesterProfile.data.email,
          courseName: course.data.course_name,
          matchesUrl,
        })
      );

      await Promise.all([
        sendEmail({
          to: requesterProfile.data.email,
          subject: `You're matched with ${receiverProfile.data.first_name} in ${course.data.course_name}!`,
          html: requesterHtml,
        }),
        sendEmail({
          to: receiverProfile.data.email,
          subject: `You're matched with ${requesterProfile.data.first_name} in ${course.data.course_name}!`,
          html: receiverHtml,
        }),
      ]);
    } else {
      const courseMatchUrl = `${appUrl}/courses/${match.course_id}/matches`;
      const declinedHtml = await render(
        MatchDeclinedEmail({
          requesterName: requesterProfile.data.first_name,
          courseName: course.data.course_name,
          matchPageUrl: courseMatchUrl,
        })
      );

      await sendEmail({
        to: requesterProfile.data.email,
        subject: `Match update for ${course.data.course_name}`,
        html: declinedHtml,
      });
    }
  } catch (emailErr) {
    console.error("Failed to send match response email:", emailErr);
  }

  return NextResponse.json({ success: true, status: newStatus });
}
