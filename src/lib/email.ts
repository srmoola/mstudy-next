import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "MStudy <noreply@mstudy.us>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
