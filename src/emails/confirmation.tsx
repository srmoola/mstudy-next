import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ConfirmationEmailProps {
  firstName: string;
  confirmationUrl: string;
}

export default function ConfirmationEmail({
  firstName,
  confirmationUrl,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your MStudy email</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <div style={logoBox}>M</div>
            <Heading style={heading}>Verify your email</Heading>
          </Section>
          <Section style={contentSection}>
            <Text style={paragraph}>Hi {firstName},</Text>
            <Text style={paragraph}>
              Thanks for signing up for MStudy! Click the button below to verify
              your email address and start finding study partners.
            </Text>
            <Section style={buttonContainer}>
              <Link href={confirmationUrl} style={button}>
                Verify my email
              </Link>
            </Section>
            <Text style={smallText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{confirmationUrl}</Text>
            <Hr style={hr} />
            <Text style={footer}>
              If you didn&apos;t sign up for MStudy, you can safely ignore this
              email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  color: "#00274C",
};

const logoSection = {
  textAlign: "center" as const,
  padding: "40px 20px 20px",
};

const logoBox = {
  display: "inline-block",
  background: "linear-gradient(135deg, #00274C, #FFCB05)",
  borderRadius: "16px",
  width: "50px",
  height: "50px",
  lineHeight: "50px",
  color: "white",
  fontWeight: 900,
  fontSize: "24px",
  textAlign: "center" as const,
};

const heading = {
  marginTop: "16px",
  fontSize: "24px",
  fontWeight: 800,
  color: "#00274C",
};

const contentSection = {
  padding: "0 24px 40px",
};

const paragraph = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "1.6",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(to right, #00274C, #FFCB05)",
  color: "white",
  fontWeight: 600,
  fontSize: "16px",
  padding: "14px 32px",
  borderRadius: "50px",
  textDecoration: "none",
};

const smallText = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
};

const linkText = {
  fontSize: "14px",
  color: "#00274C",
  wordBreak: "break-all" as const,
};

const hr = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "32px 0",
};

const footer = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center" as const,
};
